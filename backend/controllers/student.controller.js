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

// export const getClasses = async (req, res) => {
//   try {
//     const todayStary = new Date();
//     todayStary.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(todayStary);
//     tomorrow.setDate(todayStary.getDate() + 1);

//     const tutorSlotsToday = await TutorAvailability.find({
//       date: { $gte: todayStary, $lt: tomorrow },
//     })
//       .populate("tutorId")
//       .lean();

//     return res.json({ success: true, data: tutorSlotsToday });
//   } catch (error) {
//     console.error("getClasses (student) error", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

export const getClasses = async (req, res) => {
  try {
    let { activeDate } = req.query;

    // fallback to today if activeDate not sent
    const baseDate = activeDate ? new Date(activeDate) : new Date();

    // normalize day (UTC-safe)
    const startOfDay = new Date(baseDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

    const tutorSlots = await TutorAvailability.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    })
      .populate("tutorId")
      .lean();
    return res.json({
      success: true,
      data: tutorSlots,
      dateUsed: startOfDay, // optional debug
    });
  } catch (error) {
    console.error("getClasses (student) error", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
          meetingLink: 1,
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
    console.log(enrollments);
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

// export const getMyEnrollmentsStudent = async (req, res) => {
//   try {
//     const userId = new mongoose.Types.ObjectId(req.user.id);
//     let statusFilter = req.query.status?.toUpperCase() || "UPCOMING";
//     console.log(statusFilter);

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

//       // 6️⃣ Compute sessionStart and sessionEnd datetimes
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

//       // 7️⃣ Compute dynamic status based on time
//       {
//         $addFields: {
//           computedStatus: {
//             $switch: {
//               branches: [
//                 {
//                   case: { $eq: ["$status", "CANCELLED"] },
//                   then: "CANCELLED",
//                 },
//                 {
//                   case: { $eq: ["$status", "COMPLETED"] },
//                   then: "COMPLETED",
//                 },
//                 {
//                   case: {
//                     $and: [
//                       { $eq: ["$status", "UPCOMING"] },
//                       { $lt: ["$sessionEnd", now] },
//                     ],
//                   },
//                   then: "MISSED",
//                 },
//                 {
//                   case: {
//                     $and: [
//                       { $eq: ["$status", "UPCOMING"] },
//                       { $gte: ["$sessionStart", now] },
//                     ],
//                   },
//                   then: "UPCOMING",
//                 },
//                 {
//                   case: {
//                     $and: [
//                       { $eq: ["$status", "UPCOMING"] },
//                       { $lt: ["$sessionStart", now] },
//                       { $gte: ["$sessionEnd", now] },
//                     ],
//                   },
//                   then: "ONGOING",
//                 },
//               ],
//               default: "PENDING",
//             },
//           },
//         },
//       },

//       // 8️⃣ Filter according to requested tab
//       {
//         $match: (() => {
//           switch (statusFilter) {
//             case "UPCOMING":
//               return { computedStatus: "UPCOMING" };
//             case "COMPLETED":
//               return { computedStatus: "COMPLETED" };
//             case "MISSED":
//               // For MISSED, we want either computedStatus = MISSED
//               // or original status = UPCOMING but sessionEnd < now
//               return {
//                 $or: [
//                   { computedStatus: "MISSED" },
//                   {
//                     $and: [
//                       { status: "UPCOMING" },
//                       { sessionEnd: { $lt: now } },
//                     ],
//                   },
//                 ],
//               };
//             case "CANCELLED":
//               return { computedStatus: "CANCELLED" };
//             case "PENDING":
//               return { computedStatus: "PENDING" };
//             case "ONGOING":
//               return { computedStatus: "ONGOING" };
//             default:
//               return {};
//           }
//         })(),
//       },

//       // 9️⃣ Project final response
//       {
//         $project: {
//           _id: 1,
//           slot: 1,
//           status: 1,
//           meetingLink: 1,
//           computedStatus: 1,
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

//       // 10️⃣ Sort latest first
//       { $sort: { createdAt: -1 } },
//     ]);

//     res.json({ success: true, data: enrollments });
//   } catch (error) {
//     console.error("getMyEnrollments error", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const getMyEnrollmentsStudent = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const statusFilter = req.query.status?.toUpperCase() || "UPCOMING";
    const now = new Date();

    const enrollments = await Enrollment.aggregate([
      // 1️⃣ Match student
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

      // 4️⃣ Join TutorAvailability (slot-level)
      {
        $lookup: {
          from: "tutoravailabilities",
          let: {
            tutorId: "$tutorId",
            slotDate: "$slot.date",
            slotId: "$slotId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$tutorId", "$$tutorId"] },
                    { $eq: ["$date", "$$slotDate"] },
                  ],
                },
              },
            },
            {
              $project: {
                availability: {
                  $filter: {
                    input: "$availability",
                    as: "a",
                    cond: { $eq: ["$$a._id", "$$slotId"] },
                  },
                },
              },
            },
          ],
          as: "tutorAvailability",
        },
      },
      {
        $unwind: {
          path: "$tutorAvailability",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 5️⃣ Merge availability into slot
      {
        $addFields: {
          slot: {
            $mergeObjects: [
              "$slot",
              {
                isAvailable: {
                  $arrayElemAt: [
                    "$tutorAvailability.availability.isAvailable",
                    0,
                  ],
                },
                isBooked: {
                  $arrayElemAt: ["$tutorAvailability.availability.isBooked", 0],
                },
              },
            ],
          },
        },
      },

      // 6️⃣ Join payment
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

      // 7️⃣ Join package
      {
        $lookup: {
          from: "coursepackages",
          localField: "payment.packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },

      // 8️⃣ Compute session start & end
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

      // 9️⃣ Compute status
      {
        $addFields: {
          computedStatus: {
            $switch: {
              branches: [
                // 1️⃣ Hard stops
                { case: { $eq: ["$status", "CANCELLED"] }, then: "CANCELLED" },
                { case: { $eq: ["$status", "COMPLETED"] }, then: "COMPLETED" },

                // 2️⃣ Missed (guarded)
                {
                  case: {
                    $and: [
                      { $in: ["$status", ["UPCOMING", "CONFIRMED"]] },
                      { $lt: ["$sessionEnd", now] },
                    ],
                  },
                  then: "MISSED",
                },

                // 3️⃣ Ongoing
                {
                  case: {
                    $and: [
                      { $lte: ["$sessionStart", now] },
                      { $gte: ["$sessionEnd", now] },
                    ],
                  },
                  then: "ONGOING",
                },

                // 4️⃣ Upcoming
                {
                  case: { $gt: ["$sessionStart", now] },
                  then: "UPCOMING",
                },
              ],
              default: "$status",
            },
          },
        },
      },

      // 🔟 Filter tab
      {
        $match: (() => {
          switch (statusFilter) {
            case "UPCOMING":
              return { computedStatus: "UPCOMING" };
            case "COMPLETED":
              return { computedStatus: "COMPLETED" };
            case "MISSED":
              return { computedStatus: "MISSED" };
            case "ONGOING":
              return { computedStatus: "ONGOING" };
            case "CANCELLED":
              return { computedStatus: "CANCELLED" };
            default:
              return {};
          }
        })(),
      },

      // 1️⃣1️⃣ Final projection
      {
        $project: {
          _id: 1,
          slot: 1,
          status: 1,
          computedStatus: 1,
          meetingLink: 1,
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

      // 1️⃣2️⃣ Sort
      { $sort: { createdAt: -1 } },
    ]);

    return res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error("getMyEnrollmentsStudent error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const tutorId = req.params.tutorId;

    // Assume you have createdAt on Payment schema
    const latestPayment = await Payment.findOne({ userId })
      .populate("userId")
      .sort({
        createdAt: -1,
      });

    if (!latestPayment) {
      return res.json({ paid: false, status: "pending" });
    }

    const isPaid = latestPayment.status === "SUCCESS";

    res.json({
      paid: isPaid,
      status: latestPayment.status,
      paymentId: latestPayment._id,
    });
  } catch (err) {
    console.error("Check payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllEnrollmentStudents = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role == "STUDENT") {
      filter = { userId: req.user.id };
    } else {
      filter = { tutorId: req.user.id };
    }
    const enrollments = await Enrollment.find(filter).populate("userId");
    return res.json({ success: true, data: enrollments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------- SAVE SELECTED SLOT -----------------

export const saveSelectedSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tutorId, slot, date } = req.body;
    const slotId = slot._id;
    const { startTime, endTime } = slot;

    // 1️⃣ Get ALL successful payments for this user (oldest → newest)
    const payments = await Payment.find({
      userId,
      status: "SUCCESS",
    })
      .populate("packageId")
      .sort({ createdAt: 1 });

    if (!payments.length) {
      return res.status(403).json({ message: "Payment required" });
    }

    // Sum total lessons from all packages
    const totalLessons = payments.reduce((sum, p) => {
      if (!p.packageId) return sum;
      return sum + (p.packageId.lessons || 0);
    }, 0);

    if (!totalLessons) {
      return res
        .status(400)
        .json({ message: "No lessons available for your payments" });
    }

    // 2️⃣ Count already booked lessons (for this user across all tutors)
    const bookedCount = await Enrollment.countDocuments({
      userId,
      paymentStatus: "SUCCESS",
      status: { $in: ["UPCOMING", "COMPLETED", "MISSED"] },
    });

    if (bookedCount >= totalLessons) {
      return res.status(400).json({
        message: `Lesson limit reached. You have used all ${totalLessons} lessons.`,
      });
    }

    // 3️⃣ Pick WHICH payment/package this new enrollment should consume
    //    We walk through payments until we find one that still has capacity.
    let lessonsUsedSoFar = bookedCount; // before this new booking
    let activePayment = null;

    for (const p of payments) {
      const pkgLessons = p.packageId?.lessons || 0;
      if (lessonsUsedSoFar < pkgLessons) {
        activePayment = p;
        break;
      }
      lessonsUsedSoFar -= pkgLessons;
    }

    // Fallback (shouldn't normally happen, but be safe)
    if (!activePayment) {
      activePayment = payments[payments.length - 1];
    }

    if (!activePayment.packageId) {
      return res
        .status(400)
        .json({ message: "Package not found for active payment" });
    }

    // 4️⃣ Prevent duplicate slot booking
    const existingEnrollment = await Enrollment.findOne({
      userId,
      tutorId,
      slotId,
      status: { $ne: "CANCELLED" },
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // 5️⃣ Update tutor availability (slot-level check)
    const availabilityUpdate = await TutorAvailability.updateOne(
      {
        tutorId,
        date,
        "availability._id": slotId,
      },
      {
        $set: {
          "availability.$.isBooked": true,
        },
      }
    );

    if (!availabilityUpdate || availabilityUpdate.modifiedCount === 0) {
      return res.status(400).json({
        message: "Slot is no longer available",
      });
    }

    // 6️⃣ Save enrollment, consuming one lesson from activePayment/package
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
      packageId: activePayment.packageId._id,
      paymentId: activePayment._id, // optional but useful
    });

    const remainingLessons = totalLessons - (bookedCount + 1);

    return res.json({
      message: "Slot booked successfully",
      remainingLessons,
      data: enrollment,
    });
  } catch (err) {
    console.error("Save slot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


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

// export const saveSelectedSlot = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { tutorId, slot, date } = req.body[0];
//     const slotId = slot._id;
//     const { startTime, endTime } = slot;
//     // 1️⃣ Check successful payment
//     const payment = await Payment.findOne({
//       userId,
//       tutorId,
//       status: "SUCCESS",
//     }).populate("packageId"); // 👈 IMPORTANT

//     if (!payment) {
//       return res.status(403).json({ message: "Payment required" });
//     }

//     if (!payment.packageId) {
//       return res.status(400).json({ message: "Package not found for payment" });
//     }

//     const totalLessons = payment.packageId.lessons;

//     // 2️⃣ Count already booked lessons
//     const bookedCount = await Enrollment.countDocuments({
//       userId,
//       tutorId,
//     });

//     if (bookedCount >= totalLessons) {
//       return res.status(400).json({
//         message: `Lesson limit reached. You can book only ${totalLessons} lessons. if you want book more sessions please upgrade your plan`,
//       });
//     }

//     // 3️⃣ Prevent duplicate slot booking
//     const existingEnrollment = await Enrollment.findOne({
//       userId,
//       tutorId,
//       slotId,
//     });

//     if (existingEnrollment) {
//       return res.status(400).json({ message: "Slot already booked" });
//     }

//     // 4️⃣ Save enrollment
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
//       packageId: payment.packageId._id, // 👈 optional but recommended
//     });

//     return res.json({
//       message: "Slot booked successfully",
//       remainingLessons: totalLessons - (bookedCount + 1),
//       data: enrollment,
//     });
//   } catch (err) {
//     console.error("Save slot error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const saveSelectedSlot = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { tutorId, slot, date } = req.body;
//     const slotId = slot._id;
//     const { startTime, endTime } = slot;

//     // 1️⃣ Check successful payment
//     const payment = await Payment.findOne({
//       userId,
//       status: "SUCCESS",
//     })
//       .populate("packageId")
//       .sort({ createdAt: -1 });

//     if (!payment) {
//       return res.status(403).json({ message: "Payment required" });
//     }

//     if (!payment.packageId) {
//       return res.status(400).json({ message: "Package not found for payment" });
//     }

//     const totalLessons = payment.packageId.lessons;

//     // 2️⃣ Count already booked lessons
//     const bookedCount = await Enrollment.countDocuments({
//       userId,
//       paymentStatus: "SUCCESS",
//       status: { $in: ["UPCOMING", "COMPLETED", "MISSED"] },
//     });

//     if (bookedCount >= totalLessons) {
//       return res.status(400).json({
//         message: `Lesson limit reached. You can book only ${totalLessons} lessons.`,
//       });
//     }

//     // 3️⃣ Prevent duplicate slot booking
//     const existingEnrollment = await Enrollment.findOne({
//       userId,
//       tutorId,
//       slotId,
//       status: { $ne: "CANCELLED" },
//     });

//     if (existingEnrollment) {
//       return res.status(400).json({ message: "Slot already booked" });
//     }

//     // 4️⃣ Update tutor availability (slot-level check)
//     const availabilityUpdate = await TutorAvailability.updateOne(
//       {
//         tutorId,
//         date,
//         "availability._id": slotId,
//       },
//       {
//         $set: {
//           "availability.$.isBooked": true,
//         },
//       },
//     );

//     if (!availabilityUpdate) {
//       return res.status(400).json({
//         message: "Slot is no longer available",
//       });
//     }

//     // 5️⃣ Save enrollment
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
//       packageId: payment.packageId._id,
//     });

//     return res.json({
//       message: "Slot booked successfully",
//       remainingLessons: totalLessons - (bookedCount + 1),
//       data: enrollment,
//     });
//   } catch (err) {
//     console.error("Save slot error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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
    const { meetingLink, status } = req.body;

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
    enrollment.status = status.toUpperCase();
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

export const cancelEnrollment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // enrollment ID

    const enrollment = await Enrollment.findOne({
      _id: id,
      userId, // 🔒 ensure only the student can cancel
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not authorized to cancel this session",
      });
    }

    // Check if the session is at least 2 hours away
    if (!enrollment.slot?.date || !enrollment.slot?.startTime) {
      return res.status(400).json({ message: "Invalid slot data" });
    }

    const [h, m] = enrollment.slot.startTime.split(":").map(Number);
    const slotDate = new Date(enrollment.slot.date);
    slotDate.setHours(h, m, 0, 0);

    const now = new Date();
    const diffInHours = (slotDate - now) / (1000 * 60 * 60);

    if (diffInHours < 2) {
      return res.status(400).json({
        message:
          "You can only cancel a session at least 2 hours before it starts",
      });
    }

    // Cancel the session
    enrollment.status = "CANCELLED";
    await enrollment.save();

    // Update tutor availability: mark the slot as available
    await TutorAvailability.updateOne(
      {
        tutorId: enrollment.tutorId,
        date: enrollment.slot.date,
        "availability.startTime": enrollment.slot.startTime,
      },
      {
        $set: {
          "availability.$.isBooked": false,
          "availability.$.isAvailable": true,
        },
      },
    );
    res.json({
      success: true,
      message: "Session cancelled successfully",
      data: enrollment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
