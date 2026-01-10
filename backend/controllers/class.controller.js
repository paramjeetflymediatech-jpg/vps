import mongoose from "mongoose";
import Class from "../models/class.js";
import Course from "../models/course.js";
import User from "../models/User.js";

/**
 * Helper: validate ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper: sort schedule by weekday + startTime (Mon..Sun, then time)
 */
const sortSchedule = (schedule = []) => {
  const dayOrder = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return [...schedule].sort((a, b) => {
    const da = dayOrder[a.day] || 999;
    const db = dayOrder[b.day] || 999;
    if (da !== db) return da - db;

    const ta = (a.startTime || "").padStart(5, "0");
    const tb = (b.startTime || "").padStart(5, "0");
    return ta.localeCompare(tb);
  });
};

/**
 * Helper: find if a tutor has any schedule clash (same day + overlapping time)
 * for UPCOMING / ONGOING classes (ignores date ranges).
 */
const findTutorScheduleClash = async ({
  tutorId,
  schedule,
  excludeClassId,
}) => {
  if (!tutorId || !Array.isArray(schedule) || !schedule.length) {
    return null;
  }

  const days = schedule.map((s) => s.day);

  const query = {
    tutorId,
    status: { $in: ["UPCOMING", "ONGOING"] },
    "schedule.day": { $in: days },
  };

  if (excludeClassId) {
    query._id = { $ne: excludeClassId };
  }

  const classes = await Class.find(query).lean();

  const clash = classes.find((cls) => {
    if (!Array.isArray(cls.schedule)) return false;

    return cls.schedule.some((existingSlot) => {
      if (!existingSlot.day || !existingSlot.startTime || !existingSlot.endTime) return false;
      if (!days.includes(existingSlot.day)) return false;

      return schedule.some((newSlot) => {
        if (newSlot.day !== existingSlot.day) return false;

        const s1 = newSlot.startTime;
        const e1 = newSlot.endTime;
        const s2 = existingSlot.startTime;
        const e2 = existingSlot.endTime;

        if (!s1 || !e1 || !s2 || !e2) return false;

        // Time overlap: not (one ends before the other starts)
        return !(e1 <= s2 || e2 <= s1);
      });
    });
  });

  return clash || null;
};

/**
 * CREATE CLASS
 */
export const createClass = async (req, res) => {
  try {
    const {
      title,
      courseId,
      tutorId,
      meetingLink,
      startDate,
      endDate,
      schedule,
      status = "UPCOMING",
      maxStudents,
      price,
    } = req.body;

    // REQUIRED FIELDS
    if (!title || !courseId || !tutorId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Basic date validation: no past startDate, endDate after startDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({
        message: "startDate cannot be in the past",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message: "endDate must be on or after startDate",
      });
    }

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({
        message: "Schedule is required",
      });
    }

    const sortedSchedule = sortSchedule(schedule);

    // ObjectId validation
    if (!isValidObjectId(courseId) || !isValidObjectId(tutorId)) {
      return res.status(400).json({
        message: "Invalid courseId or tutorId",
      });
    }

    // Course check
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tutor check (ADMIN or TUTOR)
    const tutor = await User.findById(tutorId);
    if (!tutor || !["ADMIN", "TUTOR"].includes(tutor.role)) {
      return res.status(400).json({ message: "Invalid tutor" });
    }

    // Validate schedule times
    for (const slot of schedule) {
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return res.status(400).json({
          message: "Invalid schedule format",
        });
      }

      if (slot.startTime >= slot.endTime) {
        return res.status(400).json({
          message: "Schedule endTime must be after startTime",
        });
      }
    }

    // Time clash check: tutor cannot have another class at same day/time (any UPCOMING/ONGOING class)
    const clash = await findTutorScheduleClash({
      tutorId,
      schedule: sortedSchedule,
    });

    if (clash) {
      return res.status(409).json({
        message: "Tutor already has another class at this time",
      });
    }

    // Create class
    const newClass = await Class.create({
      title,
      courseId,
      tutorId,
      meetingLink,
      startDate,
      endDate,
      schedule: sortedSchedule,
      status,
      maxStudents,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL CLASSES
 */
export const getAllClasses = async (req, res) => {
  try {
    const { courseId, tutorId, status } = req.query;
    const filter = {};

    if (courseId) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ message: "Invalid courseId" });
      }
      filter.courseId = courseId;
    }

    if (tutorId) {
      if (!isValidObjectId(tutorId)) {
        return res.status(400).json({ message: "Invalid tutorId" });
      }
      filter.tutorId = tutorId;
    }

    if (status) {
      filter.status = status;
    }

    const classes = await Class.find(filter)
      .populate("courseId", "title")
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CLASS BY ID
 */
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const classData = await Class.findById(id)
      .populate("courseId", "title")
      .populate("tutorId", "name email");
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CLASS
 */
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate class id
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    /* ================= OBJECT ID VALIDATION ================= */
    if (updates.courseId && !isValidObjectId(updates.courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    if (updates.tutorId && !isValidObjectId(updates.tutorId)) {
      return res.status(400).json({ message: "Invalid tutorId" });
    }

    /* ================= COURSE CHECK ================= */
    if (updates.courseId) {
      const course = await Course.findById(updates.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
    }

    /* ================= TUTOR CHECK ================= */
    if (updates.tutorId) {
      const tutor = await User.findById(updates.tutorId);
      if (!tutor || !["ADMIN", "TUTOR"].includes(tutor.role)) {
        return res.status(400).json({ message: "Invalid tutor" });
      }
    }

    /* ================= SCHEDULE VALIDATION ================= */
    const schedule = updates.schedule || existingClass.schedule;

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({
        message: "Schedule is required",
      });
    }

    for (const slot of schedule) {
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return res.status(400).json({
          message: "Invalid schedule format",
        });
      }

      if (slot.startTime >= slot.endTime) {
        return res.status(400).json({
          message: "Schedule endTime must be after startTime",
        });
      }
    }

    /* ================= STATUS TRANSITION ================= */
    /* ================= STATUS TRANSITION ================= */
    if (updates.status) {
      const allowedTransitions = {
        UPCOMING: ["ONGOING"],
        ONGOING: ["COMPLETED"],
        COMPLETED: [],
      };

      if (!allowedTransitions[existingClass.status]?.includes(updates.status)) {
        return res.status(400).json({
          message: `Cannot change status from ${existingClass.status} to ${updates.status}`,
        });
      }
    }

    /* ================= TIME CLASH CHECK ================= */
    const effectiveTutorId = updates.tutorId || existingClass.tutorId;

    const clash = await findTutorScheduleClash({
      tutorId: effectiveTutorId,
      schedule,
      excludeClassId: id,
    });

    if (clash) {
      return res.status(409).json({
        message: "Tutor already has another class at this time",
      });
    }

    /* ================= UPDATE ================= */
    if (updates.schedule) {
      updates.schedule = sortSchedule(schedule);
    }

    const updatedClass = await Class.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE CLASS
 */
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
