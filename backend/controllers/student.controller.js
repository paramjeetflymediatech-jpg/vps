import Class from "../models/class.js";
import Enrollment from "../models/enrollment.js";
import TutorAvailability from "../models/TutorAvailability.js";
import Payment from "../models/payment.js";
import mongoose from "mongoose";
/**
 * STUDENT: LIST AVAILABLE CLASSES
 *
 * Returns only upcoming/ongoing classes, excluding past/completed ones,
 * enriched with tutor + course info so the frontend can render a rich card UI.
 *
 * Optional query params:
 *  - tutorId: filter by specific tutor
 */
export const getClasses = async (req, res) => {
  try {
    // const { tutorId } = req.query;

    const todayStary = new Date();
    todayStary.setHours(0, 0, 0, 0);

    // const filter = {
    //   status: { $in: ["UPCOMING", "ONGOING"] },
    //   endDate: { $gte: todayStary },
    // };

    // const classes = await Class.find(filter)
    //   .populate("tutorId")
    //   .populate("courseId", "title")
    //   .sort({ startDate: 1 })
    //   .lean();
    const tomorrow = new Date(todayStary);
    tomorrow.setDate(todayStary.getDate() + 1);

    const tutorSlotsToday = await TutorAvailability.find({
      date: { $gte: todayStary, $lt: tomorrow },
    })
      .populate("tutorId")
      .lean();

    return res.json({ success: true, data: tutorSlotsToday });
  } catch (error) {
    console.error("getClasses (student) error", error);
    return res.status(500).json({ message: error.message });
  }
};

// export const enrollClass = async (req, res) => {
//   try {
//     const { classId } = req.body;
//     const cls = await Class.findById(classId);

//     if (!cls) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Check if already enrolled
//     if (cls.enrolledStudents.includes(req.user.id)) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     if (cls.enrolledStudents.length >= cls.maxStudents) {
//       return res.status(400).json({ message: "Class full" });
//     }

//     // Atomic update
//     await Class.findByIdAndUpdate(classId, {
//       $addToSet: { enrolledStudents: req.user.id },
//     });

//     await Enrollment.create({
//       userId: req.user.id,
//       classId: cls._id,
//     });

//     res.json({ message: "Enrolled successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

/**
 * GET MY ENROLLMENTS
 * Fetch all classes the student is enrolled in via Batches.
 */
export const getMyEnrollments = async (req, res) => {
  try {
    // const enrollments = await Enrollment.find({ tutorId: req.user.id })
    //   .populate("userId")
    //   .populate("tutorId")
    //   .sort({ createdAt: -1 });
    // console.log(enrollments, ".eme");

    const tutorId = new mongoose.Types.ObjectId(req.user.id);

    const enrollments = await Enrollment.aggregate([
      /* 1️⃣ Match tutor */
      {
        $match: {
          tutorId,
        },
      },

      /* 2️⃣ Join student */
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      /* 3️⃣ Join tutor */
      {
        $lookup: {
          from: "users",
          localField: "tutorId",
          foreignField: "_id",
          as: "tutor",
        },
      },
      { $unwind: "$tutor" },

      /* 4️⃣ Join payment */
      {
        $lookup: {
          from: "payments",
          let: { userId: "$userId", tutorId: "$tutorId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$tutorId", "$$tutorId"] },
                    { $eq: ["$status", "SUCCESS"] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }, // latest payment
          ],
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 5️⃣ Join package */
      {
        $lookup: {
          from: "coursepackages",
          localField: "payment.packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $unwind: {
          path: "$package",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 6️⃣ Shape final response */
      {
        $project: {
          _id: 1,
          slot: 1,
          status: 1,
          paymentStatus: 1,
          createdAt: 1,

          student: {
            _id: "$student._id",
            name: "$student.name",
            email: "$student.email",
          },

          tutor: {
            _id: "$tutor._id",
            name: "$tutor.name",
          },

          payment: {
            _id: "$payment._id",
            amount: "$payment.amount",
            method: "$payment.method",
            status: "$payment.status",
          },

          package: {
            _id: "$package._id",
            title: "$package.title",
            lessons: "$package.lessons",
          },
        },
      },

      /* 7️⃣ Sort latest first */
      {
        $sort: { createdAt: 1 },
      },
    ]);

    res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error("getMyEnrollments error", error);
    res.status(500).json({ message: error.message });
  }
};
// export const getMyEnrollmentsStudent = async (req, res) => {
//   try {
//     const userId = new mongoose.Types.ObjectId(req.user.id);
//     let status = req.query.status.toUpperCase();

//     const enrollments = await Enrollment.aggregate([
//       /* 1️⃣ Match tutor */
//       {
//         $match: {
//           userId,
//           status,
//         },
//       },

//       /* 2️⃣ Join student */
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "student",
//         },
//       },
//       { $unwind: "$student" },

//       /* 3️⃣ Join tutor */
//       {
//         $lookup: {
//           from: "users",
//           localField: "tutorId",
//           foreignField: "_id",
//           as: "tutor",
//         },
//       },
//       { $unwind: "$tutor" },

//       /* 4️⃣ Join payment */
//       {
//         $lookup: {
//           from: "payments",
//           let: { userId: "$userId", tutorId: "$tutorId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$userId", "$$userId"] },
//                     { $eq: ["$tutorId", "$$tutorId"] },
//                     { $eq: ["$status", "SUCCESS"] },
//                   ],
//                 },
//               },
//             },
//             { $sort: { createdAt: -1 } },
//             { $limit: 1 }, // latest payment
//           ],
//           as: "payment",
//         },
//       },
//       {
//         $unwind: {
//           path: "$payment",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       /* 5️⃣ Join package */
//       {
//         $lookup: {
//           from: "coursepackages",
//           localField: "payment.packageId",
//           foreignField: "_id",
//           as: "package",
//         },
//       },
//       {
//         $unwind: {
//           path: "$package",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       /* 6️⃣ Shape final response */
//       {
//         $project: {
//           _id: 1,
//           slot: 1,
//           status: 1,
//           paymentStatus: 1,
//           createdAt: 1,

//           student: {
//             _id: "$student._id",
//             name: "$student.name",
//             email: "$student.email",
//           },

//           tutor: {
//             _id: "$tutor._id",
//             name: "$tutor.name",
//           },

//           payment: {
//             _id: "$payment._id",
//             amount: "$payment.amount",
//             method: "$payment.method",
//             status: "$payment.status",
//           },

//           package: {
//             _id: "$package._id",
//             title: "$package.title",
//             lessons: "$package.lessons",
//           },
//         },
//       },

//       /* 7️⃣ Sort latest first */
//       {
//         $sort: { createdAt: 1 },
//       },
//     ]);
//     console.log(enrollments);
//     // let data=enrollments.filter()

//     res.json({ success: true, data: enrollments });
//   } catch (error) {
//     console.error("getMyEnrollments error", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// ----------------- CHECK PAYMENT STATUS -----------------

// export const getMyEnrollmentsStudent = async (req, res) => {
//   try {
//     const userId = new mongoose.Types.ObjectId(req.user.id);
//     let status = req.query.status?.toUpperCase() || "UPCOMING";

//     const now = new Date();

//     const enrollments = await Enrollment.aggregate([
//       // 1️⃣ Match user
//       { $match: { userId } },

//       // 2️⃣ Join student
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "student",
//         },
//       },
//       { $unwind: "$student" },

//       // 3️⃣ Join tutor
//       {
//         $lookup: {
//           from: "users",
//           localField: "tutorId",
//           foreignField: "_id",
//           as: "tutor",
//         },
//       },
//       { $unwind: "$tutor" },

//       // 4️⃣ Join payment
//       {
//         $lookup: {
//           from: "payments",
//           let: { userId: "$userId", tutorId: "$tutorId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$userId", "$$userId"] },
//                     { $eq: ["$tutorId", "$$tutorId"] },
//                     { $eq: ["$status", "SUCCESS"] },
//                   ],
//                 },
//               },
//             },
//             { $sort: { createdAt: -1 } },
//             { $limit: 1 },
//           ],
//           as: "payment",
//         },
//       },
//       { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },

//       // 5️⃣ Join package
//       {
//         $lookup: {
//           from: "coursepackages",
//           localField: "payment.packageId",
//           foreignField: "_id",
//           as: "package",
//         },
//       },
//       { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },

//       // 6️⃣ Add session start & end datetime for filtering
//       {
//         $addFields: {
//           sessionStart: {
//             $dateFromString: {
//               dateString: {
//                 $concat: [
//                   { $dateToString: { format: "%Y-%m-%d", date: "$slot.date" } },
//                   "T",
//                   "$slot.startTime",
//                   ":00.000Z",
//                 ],
//               },
//             },
//           },
//           sessionEnd: {
//             $dateFromString: {
//               dateString: {
//                 $concat: [
//                   { $dateToString: { format: "%Y-%m-%d", date: "$slot.date" } },
//                   "T",
//                   "$slot.endTime",
//                   ":00.000Z",
//                 ],
//               },
//             },
//           },
//         },
//       },

//       // 7️⃣ Filter based on status
//       {
//         $match: (() => {
//           switch (status) {
//             case "UPCOMING":
//               return {
//                 status: "UPCOMING",
//                 sessionEnd: { $gte: now },
//               };
//             case "COMPLETED":
//               return {
//                 status: "COMPLETED",
//               };
//             case "MISSED":
//               return {
//                 status: "UPCOMING",
//                 sessionEnd: { $lt: now }, // End time has passed
//                 paymentStatus: "SUCCESS",
//               };
//             case "CANCELLED":
//               return { status: "CANCELLED" };
//             case "PENDING":
//               return {
//                 status: "UPCOMING",
//                 paymentStatus: { $ne: "SUCCESS" },
//               };
//             default:
//               return {};
//           }
//         })(),
//       },

//       // 8️⃣ Project final response
//       {
//         $project: {
//           _id: 1,
//           slot: 1,
//           status: 1,
//           paymentStatus: 1,
//           createdAt: 1,
//           student: {
//             _id: "$student._id",
//             name: "$student.name",
//             email: "$student.email",
//           },
//           tutor: {
//             _id: "$tutor._id",
//             name: "$tutor.name",
//           },
//           payment: {
//             _id: "$payment._id",
//             amount: "$payment.amount",
//             method: "$payment.method",
//             status: "$payment.status",
//           },
//           package: {
//             _id: "$package._id",
//             title: "$package.title",
//             lessons: "$package.lessons",
//           },
//         },
//       },

//       // 9️⃣ Sort latest first
//       { $sort: { createdAt: 1 } },
//     ]);

//     console.log(enrollments)

//     res.json({ success: true, data: enrollments });
//   } catch (error) {
//     console.error("getMyEnrollments error", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getMyEnrollmentsStudent = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    let statusFilter = req.query.status?.toUpperCase() || "UPCOMING";
    console.log(statusFilter);

    const now = new Date();

    const enrollments = await Enrollment.aggregate([
      // 1️⃣ Match user
      { $match: { userId } },

      // 2️⃣ Join student
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // 3️⃣ Join tutor
      {
        $lookup: {
          from: "users",
          localField: "tutorId",
          foreignField: "_id",
          as: "tutor",
        },
      },
      { $unwind: "$tutor" },

      // 4️⃣ Join payment
      {
        $lookup: {
          from: "payments",
          let: { userId: "$userId", tutorId: "$tutorId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$tutorId", "$$tutorId"] },
                    { $eq: ["$status", "SUCCESS"] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },

      // 5️⃣ Join package
      {
        $lookup: {
          from: "coursepackages",
          localField: "payment.packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },

      // 6️⃣ Compute sessionStart and sessionEnd datetimes
      {
        $addFields: {
          sessionStart: {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$slot.date" } },
                  "T",
                  "$slot.startTime",
                  ":00.000Z",
                ],
              },
            },
          },
          sessionEnd: {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$slot.date" } },
                  "T",
                  "$slot.endTime",
                  ":00.000Z",
                ],
              },
            },
          },
        },
      },

      // 7️⃣ Compute dynamic status based on time
      {
        $addFields: {
          computedStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "CANCELLED"] },
                  then: "CANCELLED",
                },
                {
                  case: { $eq: ["$status", "COMPLETED"] },
                  then: "COMPLETED",
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$status", "UPCOMING"] },
                      { $lt: ["$sessionEnd", now] },
                    ],
                  },
                  then: "MISSED",
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$status", "UPCOMING"] },
                      { $gte: ["$sessionStart", now] },
                    ],
                  },
                  then: "UPCOMING",
                },
                {
                  case: {
                    $and: [
                      { $eq: ["$status", "UPCOMING"] },
                      { $lt: ["$sessionStart", now] },
                      { $gte: ["$sessionEnd", now] },
                    ],
                  },
                  then: "ONGOING",
                },
              ],
              default: "PENDING",
            },
          },
        },
      },

      // 8️⃣ Filter according to requested tab
      {
        $match: (() => {
          switch (statusFilter) {
            case "UPCOMING":
              return { computedStatus: "UPCOMING" };
            case "COMPLETED":
              return { computedStatus: "COMPLETED" };
            case "MISSED":
              // For MISSED, we want either computedStatus = MISSED
              // or original status = UPCOMING but sessionEnd < now
              return {
                $or: [
                  { computedStatus: "MISSED" },
                  {
                    $and: [
                      { status: "UPCOMING" },
                      { sessionEnd: { $lt: now } },
                    ],
                  },
                ],
              };
            case "CANCELLED":
              return { computedStatus: "CANCELLED" };
            case "PENDING":
              return { computedStatus: "PENDING" };
            case "ONGOING":
              return { computedStatus: "ONGOING" };
            default:
              return {};
          }
        })(),
      },

      // 9️⃣ Project final response
      {
        $project: {
          _id: 1,
          slot: 1,
          status: 1,
          meetingLink:1,
          computedStatus: 1,
          paymentStatus: 1,
          createdAt: 1,
          student: {
            _id: "$student._id",
            name: "$student.name",
            email: "$student.email",
          },
          tutor: {
            _id: "$tutor._id",
            name: "$tutor.name",
          },
          payment: {
            _id: "$payment._id",
            amount: "$payment.amount",
            method: "$payment.method",
            status: "$payment.status",
          },
          package: {
            _id: "$package._id",
            title: "$package.title",
            lessons: "$package.lessons",
          },
        },
      },

      // 10️⃣ Sort latest first
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error("getMyEnrollments error", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const tutorId = req.params.tutorId;
    let status = "pending";
    const payment = await Payment.findOne({
      userId,
      tutorId,
    });
    if (payment && payment.status === "SUCCESS") {
      status = payment.status;
    }
    res.json({ paid: !!payment, status: status });
  } catch (err) {
    console.error("Check payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- SAVE SELECTED SLOT -----------------
// export const saveSelectedSlot = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { tutorId, slot, date } = req.body[0];
//     const data = {
//       tutorId: tutorId,
//       slotId: slot._id,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       date: date,
//     };
//     const { slotId, endTime, startTime } = data;
//     // 1️⃣ Check payment
//     const payment = await Payment.findOne({
//       userId,
//       tutorId,
//       status: "SUCCESS",
//     });

//     if (!payment) {
//       return res.status(403).json({ error: "Payment required" });
//     }

//     // 2️⃣ Check if slot already booked by this user
//     const existingEnrollment = await Enrollment.findOne({
//       userId,
//       tutorId,
//       slotId,
//     });

//     if (existingEnrollment) {
//       return res.status(400).json({ error: "Slot already booked" });
//     }
//     // 3️⃣ Save enrollment
//     const enrollment = await Enrollment.create({
//       userId,
//       tutorId,
//       slotId,
//       slot: {
//         startTime,
//         endTime,
//         date,
//       },
//       status: "UPCOMING",
//       paymentStatus: "SUCCESS",
//     });

//     //update tututor avaliballity isbooked true

//     const updatedDoc = await TutorAvailability.updateOne(
//       {
//         tutorId: tutorId,
//         date: date,
//         "availability._id": slotId, // match the specific slot
//        // optional: prevent double booking
//       },
//       {
//         $set: {
//           "availability.$.isBooked": true, // update the matched slot // optional: mark unavailable too
//         },
//       },
//       { new: true }, // return the updated document
//     );

//     res.json({ message: "Slot booked successfully", data: enrollment });
//   } catch (err) {
//     console.error("Save slot error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export const saveSelectedSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tutorId, slot, date } = req.body[0];

    const slotId = slot._id;
    const { startTime, endTime } = slot;

    // 1️⃣ Check successful payment
    const payment = await Payment.findOne({
      userId,
      tutorId,
      status: "SUCCESS",
    }).populate("packageId"); // 👈 IMPORTANT

    if (!payment) {
      return res.status(403).json({ message: "Payment required" });
    }

    if (!payment.packageId) {
      return res.status(400).json({ message: "Package not found for payment" });
    }

    const totalLessons = payment.packageId.lessons;

    // 2️⃣ Count already booked lessons
    const bookedCount = await Enrollment.countDocuments({
      userId,
      tutorId,
    });

    console.log(bookedCount, "booke", totalLessons, "totallw");

    if (bookedCount >= totalLessons) {
      return res.status(400).json({
        message: `Lesson limit reached. You can book only ${totalLessons} lessons. if you want book more sessions please upgrade your plan`,
      });
    }

    // 3️⃣ Prevent duplicate slot booking
    const existingEnrollment = await Enrollment.findOne({
      userId,
      tutorId,
      slotId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // 4️⃣ Save enrollment
    const enrollment = await Enrollment.create({
      userId,
      tutorId,
      slotId,
      slot: {
        startTime,
        endTime,
        date,
      },
      status: "UPCOMING",
      paymentStatus: "SUCCESS",
      packageId: payment.packageId._id, // 👈 optional but recommended
    });

    // 5️⃣ Mark slot as booked in tutor availability
    await TutorAvailability.updateOne(
      {
        tutorId,
        date,
        "availability._id": slotId,
        "availability.isBooked": false,
      },
      {
        $set: {
          "availability.$.isBooked": true,
        },
      },
    );

    return res.json({
      message: "Slot booked successfully",
      remainingLessons: totalLessons - (bookedCount + 1),
      data: enrollment,
    });
  } catch (err) {
    console.error("Save slot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- GET STUDENT ENROLLMENTS -----------------
export const enrollClass = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .populate("tutorId", "name avatar email")
      .lean();

    res.json({ data: enrollments });
  } catch (err) {
    console.error("Fetch enrollments error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/enrollments/:id/meeting-link
export const updateMeetingLink = async (req, res) => {
  console.log(req.query, req.params, req.body);
  try {
    const tutorId = req.user.id;
    const { id } = req.params;
    const { meetingLink } = req.body;

    if (!meetingLink) {
      return res.status(400).json({ message: "Meeting link is required" });
    }

    const enrollment = await Enrollment.findOne({
      _id: id,
      tutorId, // 🔒 ensures only tutor can update
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not authorized to update this meeting link",
      });
    }

    enrollment.meetingLink = meetingLink;
    await enrollment.save();

    res.json({
      success: true,
      message: "Meeting link updated successfully",
      data: enrollment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
