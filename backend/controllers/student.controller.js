import Class from "../models/class.js";
import Batch from "../models/batch.js";
import Enrollment from "../models/enrollment.js";

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

    const filter = {
      status: { $in: ["UPCOMING", "ONGOING"] },
      endDate: { $gte: todayStary },
    };

    // if (tutorId) {
    //   filter.tutorId = tutorId;
    // }

    const classes = await Class.find(filter)
      .populate("tutorId")
      .populate("courseId", "title")
      .sort({ startDate: 1 })
      .lean();
    console.log(classes);
    return res.json({ success: true, data: classes });
  } catch (error) {
    console.error("getClasses (student) error", error);
    return res.status(500).json({ message: error.message });
  }
};

export const enrollClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if already enrolled
    if (cls.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    if (cls.enrolledStudents.length >= cls.maxStudents) {
      return res.status(400).json({ message: "Class full" });
    }

    // Atomic update
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { enrolledStudents: req.user.id },
    });

    await Enrollment.create({
      userId: req.user.id,
      classId: cls._id,
    });

    res.json({ message: "Enrolled successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY ENROLLMENTS
 * Fetch all classes the student is enrolled in via Batches.
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate({
        path: "classId",
        populate: [
          { path: "courseId", select: "title" },
          { path: "tutorId", select: "name email image" },
        ],
      })
      .sort({ createdAt: -1 });

    const data = enrollments
      .filter((e) => e.classId)
      .map((e) => {
        const cls = e.classId;
        return {
          _id: cls._id, // Class ID
          enrollmentId: e._id,
          title: cls.title,
          description: cls.description,
          status: cls.status, // UPCOMING, ONGOING, COMPLETED
          startDate: cls.startDate,
          endDate: cls.endDate,
          schedule: cls.schedule, // [{day, startTime, endTime}]
          meetingLink: cls.meetingLink,
          tutorId: cls.tutorId, // {name, email}
          courseId: cls.courseId, // {title}
          // batchId removed as we don't use it
        };
      });

    res.json({ success: true, data });
  } catch (error) {
    console.error("getMyEnrollments error", error);
    res.status(500).json({ message: error.message });
  }
};
