import Payment from "../models/payment.js";
import { sendEmail } from "../config/mailer.js";
import { v4 as uuidv4 } from "uuid";
// Map lesson number to price
const lessonPricing = {
  8: 1,
  12: 3530,
  16: 4720,
};

// POST /api/payment/upi
export const createUpiPayment = (req, res) => {
  try {
    const { lessons } = req.body;

    if (!lessons || !lessonPricing[lessons]) {
      return res.status(400).json({ message: "Invalid lesson plan" });
    }

    const amount = lessonPricing[lessons];

    // This endpoint only calculates amount for a given lesson plan
    // Actual transaction logging happens in logUpiPayment

    return res.status(200).json({ amount, lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/payment/upi/log



import Class from "../models/class.js";
import Course from "../models/course.js";
import CoursePackage from "../models/package.js";
import Enrollment from "../models/enrollment.js";

const grantAccess = async (userId, itemId, itemType) => {
  try {
    let classesToEnroll = [];

    if (itemType === "CLASS") {
      classesToEnroll.push(itemId);
    } else if (itemType === "COURSE") {
      // Find all classes for this course
      const classes = await Class.find({ courseId: itemId });
      classesToEnroll = classes.map((c) => c._id);
    } else if (itemType === "PACKAGE") {
      const pkg = await CoursePackage.findById(itemId).populate("courses");
      if (pkg && pkg.courses) {
        const courseIds = pkg.courses.map((c) => c._id);
        const classes = await Class.find({ courseId: { $in: courseIds } });
        classesToEnroll = classes.map((c) => c._id);
      }
    }

    for (const classId of classesToEnroll) {
      // Idempotent enrollment
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { enrolledStudents: userId },
      });
      await Enrollment.updateOne(
        { userId, classId },
        { $setOnInsert: { userId, classId } },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }
};

// POST /api/payment/upi/log
export const logUpiPayment = async (req, res) => {
  try {
    const { tutorId, amount, lessons, status, clientPaymentId, itemId, itemType } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const paymentId = clientPaymentId || uuidv4(); 
    const payment = await Payment.findOneAndUpdate(
      { clientPaymentId: paymentId },
      {
        $setOnInsert: {
          clientPaymentId: paymentId,
          userId,
          tutorId,
          amount,
          lessons,
          itemId, // Store what was bought
          itemType, // CLASS, COURSE, PACKAGE
          method: "UPI",
          status: status || "PENDING",
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // If payment is SUCCESS/COMPLETED, grant access immediately
    if (payment.status === "SUCCESS" || payment.status === "COMPLETED") {
       if (itemId && itemType) {
           await grantAccess(userId, itemId, itemType);
       }
    }

    console.log("Logged payment:", payment);
    res.status(201).json({ success: true, payment });
  } catch (err) {
    console.error("logUpiPayment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Logs a payment attempt/result into the database
// export const logUpiPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id;
//     const { tutorId, amount, status, lessons, txnId } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: user not found" });
//     }

//     if (!amount) {
//       return res.status(400).json({ message: "Amount is required" });
//     }

//     const normalizedStatus =
//       status === "FAILED" || status === "failed"
//         ? "FAILED"
//         : status === "PENDING" || status === "pending"
//         ? "PENDING"
//         : "SUCCESS";

//     const payment = await Payment.create({
//       userId,
//       tutorId,
//       amount,
//       lessons,
//       txnId,
//       status: normalizedStatus,
//     });

//     return res.status(201).json({ payment });
//   } catch (err) {
//     console.error("logUpiPayment error:", err);
//     return res.status(500).json({ message: "Failed to log payment" });
//   }
// };

// POST /api/payment/upload-proof
// export const uploadPaymentProof = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id;
//     const { paymentId } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: user not found" });
//     }

//     if (!paymentId) {
//       return res.status(400).json({ message: "Payment ID is required" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Payment image is required" });
//     }

//     // Update payment with image URL
//     const payment = await Payment.findOneAndUpdate(
//       { _id: paymentId, userId },
//       { paymentImage: req.file.path }, // Cloudinary URL
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     // Send notification email to admin
//     const adminEmail = process.env.ADMIN_EMAIL || "admin@yopmail.com";
//     await sendEmail(
//       adminEmail,
//       "New Payment Proof Uploaded",
//       `New payment proof uploaded by user ${userId}. Payment ID: ${paymentId}, Amount: ₹${payment.amount}`
//     );

//     return res.status(200).json({
//       message: "Payment proof uploaded successfully",
//       payment
//     });
//   } catch (err) {
//     console.error("uploadPaymentProof error:", err);
//     return res.status(500).json({ message: "Failed to upload payment proof" });
//   }
// };

// GET /api/payment/admin/all - Get all payments for admin
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("userId", "name email")
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ payments });
  } catch (err) {
    console.error("getAllPayments error:", err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// PUT /api/payment/admin/verify/:paymentId - Verify payment (admin only)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // "SUCCESS" or "FAILED"

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status === "SUCCESS" || status === "COMPLETED") {
        if (payment.itemId && payment.itemType) {
            await grantAccess(payment.userId._id, payment.itemId, payment.itemType);
        }
    }

    return res.status(200).json({
      message: `Payment ${status.toLowerCase()} successfully`,
      payment,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

export const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.proofImage = req.file.path;
    payment.status = "UNDER_REVIEW";
    await payment.save();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
