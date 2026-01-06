const Class = require("../models/class.js");
const Course = require("../models/courseModel");
const User = require("../models//userModel");

// LIST CLASSES
exports.renderClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isDeleted: false })
      .populate("courseId", "title")
      .populate("instructorId", "name")
      .sort({ createdAt: -1 });
    console.log(classes, "ss");

    res.render("classes/index", {
      title: "Manage Classes",
      classes,
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

// CREATE FORM
exports.renderCreateClass = async (req, res) => {
  const courses = await Course.find();
  const instructors = await User.find({ role: "TUTOR" });

  res.render("classes/create", {
    title: "Create Class",
    courses,
    instructors,
  });
};

// CREATE CLASS
exports.createClass = async (req, res) => {
  try {
    await Class.create(req.body);
    res.redirect("/admin/classes");
  } catch (err) {
    res.send(err.message);
  }
};

// EDIT FORM
exports.renderEditClass = async (req, res) => {
  const classData = await Class.findById(req.params.id);
  const courses = await Course.find();
  const instructors = await User.find({ role: "TUTOR" });

  res.render("classes/edit", {
    title: "Edit Class",
    classData,
    courses,
    instructors,
  });
};

// UPDATE CLASS
exports.updateClass = async (req, res) => {
  await Class.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/classes");
};

// DELETE CLASS (SOFT)
exports.deleteClass = async (req, res) => {
  await Class.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.redirect("/admin/classes");
};
