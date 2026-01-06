const Class = require("../models/class");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

/**
 * LIST CLASSES
 */
exports.renderClasses = async (req, res) => {
  try {
    const data = await Class.find()
      .populate("courseId", "title")
      .populate("tutorId", "name email")
      .lean();

    res.render("batches/index", { data });
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
    res.redirect("back");
  }
};

/**
 * CREATE CLASS
 */
exports.createClass = async (req, res) => {
  try {
    const { 
      title,
      description,  
      schedule, 
      maxStudents,
      status,
    } = req.body;

    await Class.create({
      courseId: req.body.courseId,
      tutorId: req.body.tutorId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
      meetLink: req.body.meetLink,
      title,
      description,
      schedule,
      maxStudents: Number(maxStudents),
      status,
    });

    req.flash("success", "Class created successfully");
    res.redirect("/admin/classes");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
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

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      {
        courseId,
        meetingLink,
        startDate,
        endDate,
        schedule,
        price: Number(price),
        maxStudents: Number(maxStudents),
        status,
        title: req.body.title,
        description: req.body.description,
        tutorId: req.body.tutorId,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      req.flash("error", "Class not found");
      return res.redirect("/admin/classes");
    }

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
