const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Course = require("../models/courseModel");
const { auth, role } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const User = require("../models/userModel");
/*
|--------------------------------------------------------------------------
| READ – List Courses
|--------------------------------------------------------------------------
*/

router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const data = await Course.find({ _id: { $ne: req.user.id } })
      .sort({ createdAt: -1 })
      .lean();

    res.render("tutor_course/list", { courses: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users" });
  }
});
// router.get("/", auth,  async (req, res) => {
//   try {
//     const courses = await Course.find()
//       .populate("tutorId", "name email")
//       .populate("organizationId", "name")
//       .sort({ createdAt: -1 });
//     console.log(courses);

//     return res.render("courselist", { courses: courses });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Server Error");
//   }
// });

/*
|--------------------------------------------------------------------------
| CREATE – Show Add Course Page
|--------------------------------------------------------------------------
*/
router.get("/add", auth, role("ADMIN"), async (req, res) => {
  try {
    const tutors = await User.find({ role: "TUTOR" })
      .select("_id name email")
      .lean();

    res.render("tutor_course/add", {
      error: null,
      formData: {},
      tutors, // 👈 PASS TUTORS
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
/*
|--------------------------------------------------------------------------
| CREATE – Save Course
|--------------------------------------------------------------------------
*/
router.post(
  "/add",
  auth,
  role("ADMIN"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, tutorId, price, published, organizationId } =
        req.body;
      console.log("Form Data:", req.body);
      const image = req.file ? req.file.filename : null;
      let data = await Course.create({
        title,
        description,
        tutorId: tutorId || null,
        organizationId: organizationId || null,
        price: Number(price || 0),
        published: published === "on" ? true : false,
        image, // 👈 SAVE IMAGE
      });
      console.log("New Course Created:", data);
      return res.redirect("/admin/courses");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE – Show Edit Course Page
|--------------------------------------------------------------------------
*/
router.get("/edit/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const tutors = await User.find({ role: "TUTOR" })
      .select("_id name email")
      .lean();

    if (!course) return res.redirect("/admin/courses");

    res.render("tutor_course/edit", {
      course,
      tutors,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
/*
|--------------------------------------------------------------------------
| UPDATE – Update Course
|--------------------------------------------------------------------------
*/

router.post(
  "/edit/:id",
  auth,
  role("ADMIN"),
  upload.single("image"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.redirect("/admin/courses");

      if (req.file && course.image) {
        const oldPath = path.join(
          __dirname,
          "../public/uploads/courses",
          course.image
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      await Course.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        tutorId: req.body.tutorId,
        price: Number(req.body.price || 0),
        published: req.body.published === "on" ? true : false,
        image: req.file ? req.file.filename : course.image,
      });

      res.redirect("/admin/courses");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE – Delete Course
|--------------------------------------------------------------------------
*/
router.post("/delete/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    // 1. Find course first
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.redirect("/admin/courses");
    }

    // 2. Delete image if exists
    if (course.image) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads/courses",
        course.image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // 🔥 delete image
      }
    }

    // 3. Delete course from DB
    await Course.findByIdAndDelete(req.params.id);

    res.redirect("/admin/courses");
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
