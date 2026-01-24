// const express = require("express");
// const router = express.Router();

// const Payment = require("../models/payment");
// const User = require("../models/userModel");
// const { auth, role } = require("../middlewares/auth.middleware");
// const sendMail = require("../utils/sendmail");

// // LIST PAYMENTS
// router.get("/", auth, role("ADMIN"), async (req, res) => {
//   try {
//     const payments = await Payment.find()
//       .populate("userId", "name email role")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.render("payments/list", { payments });
//   } catch (err) {
//     console.error("Admin payments list error:", err);
//     res.status(500).render("layouts/error", {
//       message: "Failed to load payments",
//       path: req.originalUrl,
//     });
//   }
// });

// // VIEW SINGLE PAYMENT
// router.get("/:id", auth, role("ADMIN"), async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//       .populate("userId", "name email role isPaymentDone")
//       .lean();

//     if (!payment) {
//       return res.status(404).render("layouts/error", {
//         message: "Payment not found",
//         path: req.originalUrl,
//       });
//     }

//     res.render("payments/view", { payment });
//   } catch (err) {
//     console.error("Admin payment view error:", err);
//     res.status(500).render("layouts/error", {
//       message: "Failed to load payment",
//       path: req.originalUrl,
//     });
//   }
// });

// // VERIFY / UPDATE PAYMENT STATUS & USER.isPaymentDone
// router.post("/:id/verify", auth, role("ADMIN"), async (req, res) => {
//   const { status } = req.body; // PENDING | VERIFIED | REJECTED

//   if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     const payment = await Payment.findById(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     payment.status = status;
//     await payment.save();

//     // When verified, mark user.isPaymentDone = true and send activation email
//     if (status === "APPROVED" && payment.userId) {
//       const user = await User.findByIdAndUpdate(
//         payment.userId,
//         { $set: { isPaymentDone: true } },
//         { new: true }
//       );

//       // Send activation email
//       if (user && user.email) {
//         try {
//           await sendMail({
//             to: user.email,
//             subject: "Your account has been activated",
//             html: `
//               <p>Hi ${user.name || "there"},</p>
//               <p>Your payment has been verified and your account is now <strong>activated</strong>.</p>
//               <p>You can now log in and start viewing your courses.</p>
//               <p>If you did not make this payment, please contact support immediately.</p>
//             `,
//           });
//         } catch (mailErr) {
//           console.error("Payment activation email error:", mailErr);
//           // Do not fail the API just because email failed
//         }
//       }
//     }

//     return res.json({
//       success: true,
//       message: "Payment updated successfully",
//     });
//   } catch (err) {
//     console.error("Admin payment verify error:", err);
//     return res.status(500).json({ message: "Update failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const Payment = require("../models/payment");
const User = require("../models/userModel");
const { auth, role } = require("../middlewares/auth.middleware");
const sendMail = require("../utils/sendmail");

// ================= LIST PAYMENTS =================
router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalPayments = await Payment.countDocuments();
    const payments = await Payment.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log(payments, "payments");

    return res.render("payments/list", {
      payments,
      currentPage: page,
      totalPages: Math.ceil(totalPayments / limit),
    });
  } catch (err) {
    console.error("Admin payments list error:", err);
    return res.status(500).render("layouts/error", {
      message: "Failed to load payments",
      path: req.originalUrl,
    });
  }
});

// ================= VIEW SINGLE PAYMENT =================
router.get("/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "name email role isPaymentDone")
      .lean();

    if (!payment) {
      return res.status(404).render("layouts/error", {
        message: "Payment not found",
        path: req.originalUrl,
      });
    }

    return res.render("payments/view", { payment });
  } catch (err) {
    console.error("Admin payment view error:", err);
    return res.status(500).render("layouts/error", {
      message: "Failed to load payment",
      path: req.originalUrl,
    });
  }
});

// ================= VERIFY / UPDATE PAYMENT =================
router.post("/:id/verify", auth, role("ADMIN"), async (req, res) => {
  const { status } = req.body; // PENDING | APPROVED | REJECTED

  if (!["PENDING", "SUCCESS", "REJECTED"].includes(status)) {
    return res.status(400).render("layouts/error", {
      message: "Invalid status",
      path: req.originalUrl,
    });
  }

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).render("layouts/error", {
        message: "Payment not found",
        path: req.originalUrl,
      });
    }

    payment.status = status;
    await payment.save();

    // ✅ SUCCESS → activate user
    if (status === "SUCCESS" && payment.userId) {
      const user = await User.findByIdAndUpdate(
        payment.userId,
        { $set: { isPaymentDone: true } },
        { new: true },
      );
      console.log(user, "payment update");
      // 📧 Send activation email
      if (user?.email) {
        await sendMail({
          to: user.email,
          subject: "Payment SUCCESS – Account Activated",
          html: `
              <p>Hi ${user.name || "there"},</p>
              <p>Your payment has been <strong>SUCCESS</strong>.</p>
              <p>Your account is now active. You can start your classes.</p>
              <p>Thank you!</p>
            `,
        });
      }
    }

    // 🔁 REDIRECT BACK TO PAYMENTS LIST
    return res.status(200).json({
      message: "Payment status update successfully",
      path: "/admin/payments",
    });
  } catch (err) {
    return res.status(500).render("layouts/error", {
      message: "Payment update failed",
      path: req.originalUrl,
    });
  }
});

module.exports = router;
