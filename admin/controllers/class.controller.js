const Class = require("../models/class.js");
const Course = require("../models/courseModel");
const User = require("../models//userModel");

// LIST CLASSES
exports.renderClasses = async (req, res) => {
  try {
    const data = await Class.find({})
      .populate({ path: "courseId", select: "title", strictPopulate: false })
      .populate({
        path: "tutorId",
        select: "name email",
        strictPopulate: false,
      });
    res.render("batches/index", {
      data: data,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", error.message);
  }
};

// CREATE FORM
exports.renderCreateClass = async (req, res) => {
  try {
    const data = await Course.find();
    const instructors = await User.find({ role: "TUTOR" });
    res.render("batches/create", {
      title: "Create Class",
      data: data,
      tutors: instructors,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", error.message);
  }
};

// CREATE CLASS
exports.createClass = async (req, res) => {
  try {
    let data = await Class.create(req.body);
    if (data.insertedId) {
      console.log(error);
      req.flash("succes", "Class created successfully");
      res.redirect("/admin/classes");
    }
  } catch (err) {
    res.send(err.message);
  }
};

// EDIT FORM
exports.renderEditClass = async (req, res) => {
  // Populate the related course and instructor for the edit form
  const classData = await Class.findById(req.params.id)
    .populate({ path: "courseId", select: "title", strictPopulate: false })
    .populate({
      path: "tutorId",
      select: "name email",
      strictPopulate: false,
    })
    .lean();

  const data = await Course.find();
  const instructors = await User.find({ role: "TUTOR" });

  res.render("batches/edit", {
    title: "Edit Class",
    classdata: classData,
    data: data,
    tutors: instructors,
  });
};

// UPDATE CLASS
exports.updateClass = async (req, res) => {
  console.log(req.body);

  try {
    await Class.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/classes");
  } catch (error) {
    cnsole.log(error);
    req.flash("error", error.message);
  }
};

// DELETE CLASS (SOFT)
exports.deleteClass = async (req, res) => {
  console.log(req.params.id);
  await Class.deleteOne({ _id: req.params.id });
  res.redirect("/admin/classes");
};
