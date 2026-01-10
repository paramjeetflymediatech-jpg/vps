const Class = require("../models/class");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

/**
 * Helper: normalize schedule from request body.
 * Accepts either an array of slots or an object map (e.g. { 0: {...}, 1: {...} }).
 */
function normalizeSchedule(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") return Object.values(raw);
  return [];
}

/**
 * Helper: sort schedule by weekday + startTime (Mon..Sun, then time)
 */
function sortSchedule(schedule = []) {
  const dayOrder = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  const normalized = normalizeSchedule(schedule);
  return [...normalized].sort((a, b) => {
    const da = dayOrder[a.day] || 999;
    const db = dayOrder[b.day] || 999;
    if (da !== db) return da - db;

    const ta = (a.startTime || "").padStart(5, "0");
    const tb = (b.startTime || "").padStart(5, "0");
    const days = normalized.map((s) => s.day);
    console.log(ta.localeCompare(tb));
    return ta.localeCompare(tb);
  });
}
/**
 * Helper: find if a tutor has any schedule clash (same day + overlapping time)
 * for UPCOMING / ONGOING classes (ignores date ranges).
 */
async function findTutorScheduleClash({ tutorId, schedule, excludeClassId }) {
  const normalized = normalizeSchedule(schedule);
  if (!tutorId || !Array.isArray(normalized) || !normalized.length) {
    return null;
  }

  const days = normalized.map((s) => s.day);

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
      if (!existingSlot.day || !existingSlot.startTime || !existingSlot.endTime)
        return false;
      if (!days.includes(existingSlot.day)) return false;

      return normalized.some((newSlot) => {
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
}

/**
 * LIST CLASSES
 */
exports.renderClasses = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const sortTitle =
      req.query.sortTitle === "asc" || req.query.sortTitle === "desc"
        ? req.query.sortTitle
        : "";

    const sort = {};
    if (sortTitle) {
      sort.title = sortTitle === "asc" ? 1 : -1;
    }
    sort.createdAt = -1;

    const [data, total] = await Promise.all([
      Class.find()
        .populate("courseId", "title")
        .populate("tutorId", "name email")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Class.countDocuments(),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit) || 1, 1);

    res.render("batches/index", {
      data,
      page,
      totalPages,
      limit,
      total,
      sortTitle,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/**
 * CREATE FORM
 */
exports.renderCreateClass = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    const tutors = await User.find({ role: "TUTOR" }).lean();

    res.render("batches/create", {
      title: "Create Class",
      data: courses,
      tutors,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("/admin/classes/create");
  }
};

/**
 * CREATE CLASS
 */
exports.createClass = async (req, res) => {
  try {
    const { title, description, schedule, maxStudents, status } = req.body;

    const { courseId, tutorId, startDate, endDate } = req.body;

    const normalizedSchedule = normalizeSchedule(schedule);

    const clash = await findTutorScheduleClash({
      tutorId,
      schedule: normalizedSchedule,
    });

    if (clash) {
      req.flash("error", "Tutor already has another class at this time");
      return res.redirect("/admin/classes/create");
    }

    await Class.create({
      courseId,
      tutorId,
      startDate,
      endDate,
      price: req.body.price,
      meetLink: req.body.meetLink,
      title,
      description,
      schedule: sortSchedule(normalizedSchedule),
      maxStudents: Number(maxStudents),
      status,
    });

    req.flash("success", "Class created successfully");
    res.redirect("/admin/classes");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("/admin/classes/create");
  }
};

/**
 * EDIT FORM
 */
exports.renderEditClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("courseId", "title")
      .populate("tutorId", "name email")
      .lean();

    if (!classData) {
      req.flash("error", "Class not found");
      return res.redirect("/admin/classes");
    }

    const courses = await Course.find().lean();
    const tutors = await User.find({ role: "TUTOR" }).lean();

    res.render("batches/edit", {
      title: "Edit Class",
      classdata: classData,
      data: courses,
      tutors,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("/admin/classes");
  }
};

/**
 * UPDATE CLASS
 */
exports.updateClass = async (req, res) => {
  try {
    const {
      courseId,
      meetingLink,
      startDate,
      endDate,
      schedule,
      price,
      maxStudents,
      status,
    } = req.body;

    const existingClass = await Class.findById(req.params.id);
    if (!existingClass) {
      req.flash("error", "Class not found");
      return res.redirect("/admin/classes");
    }

    const effectiveTutorId = req.body.tutorId || existingClass.tutorId;

    const normalizedSchedule = normalizeSchedule(schedule);

    const clash = await findTutorScheduleClash({
      tutorId: effectiveTutorId,
      schedule: normalizedSchedule,
      excludeClassId: req.params.id,
    });

    if (clash) {
      req.flash("error", "Tutor already has another class at this time");
      return res.redirect(`/admin/classes/edit/${req.params.id}`);
    }

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      {
        courseId,
        meetingLink,
        startDate,
        endDate,
        schedule: sortSchedule(normalizedSchedule),
        price: Number(price),
        maxStudents: Number(maxStudents),
        status,
        title: req.body.title,
        description: req.body.description,
        tutorId: req.body.tutorId,
      },
      { new: true, runValidators: true }
    );

    req.flash("success", "Class updated successfully");
    res.redirect("/admin/classes");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/**
 * DELETE CLASS (HARD DELETE)
 * 👉 If you want SOFT delete, see note below
 */
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      req.flash("error", "Class not found");
      return res.redirect("/admin/classes");
    }

    req.flash("success", "Class deleted successfully");
    res.redirect("/admin/classes");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};
