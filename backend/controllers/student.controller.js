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
    const now = new Date();
    const { tutorId } = req.query;

    const filter = {
      status: { $in: ["UPCOMING", "ONGOING"] },
      endDate: { $gte: now },
    };

    if (tutorId) {
      filter.tutorId = tutorId;
    }

    const classes = await Class.find(filter)
      .populate("tutorId", "name email")
      .populate("courseId", "title")
      .sort({ startDate: 1 });

    return res.json({ success: true, data: classes });
  } catch (error) {
    console.error("getClasses (student) error", error);
    return res.status(500).json({ message: error.message });
  }
};

export const enrollBatch = async (req, res) => {
  const batch = await Batch.findById(req.body.batchId);

  if (batch.enrolledStudents.length >= batch.maxStudents) {
    return res.status(400).json({ message: "Batch full" });
  }

  batch.enrolledStudents.push(req.user.id);
  await batch.save();

  await Enrollment.create({
    userId: req.user.id,
    batchId: batch._id,
  });

  res.json({ message: "Enrolled successfully" });
};
