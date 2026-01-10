const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Course = require("../models/courseModel");
const { auth, role } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const User = require("../models/userModel");
const cloudinary = require("../middlewares/index");
/*
|--------------------------------------------------------------------------
| READ – List Courses
|--------------------------------------------------------------------------
*/

router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const sortTitle =
      req.query.sortTitle === "asc" || req.query.sortTitle === "desc"
        ? req.query.sortTitle
        : "";

    const query = { _id: { $ne: req.user.id } };

    const sort = {};
    if (sortTitle) {
      sort.title = sortTitle === "asc" ? 1 : -1;
    }
    sort.createdAt = -1;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Course.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit) || 1, 1);

    res.render("tutor_course/list", {
      courses,
      page,
      totalPages,
      limit,
      total,
      sortTitle,
    });
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
      const imageUrl = req.file?.path; // Cloudinary URL
      const imageId = req.file?.filename;

      let data = await Course.create({
        title,
        description,
        tutorId: tutorId || null,
        organizationId: organizationId || null,
        price: Number(price || 0),
        published: published === "on" ? true : false,
        image: imageUrl,
        imageId, // 👈 SAVE IMAGE
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Not found");

    if (req.file && course.imageId) {
      await cloudinary.uploader.destroy(course.imageId);
    }

    course.title = req.body.title;
    course.description = req.body.description;
    course.tutorId = req.body.tutorId || null;
    course.organizationId = req.body.organizationId || null;
    course.price = Number(req.body.price);
    course.published = req.body.published === "on";

    if (req.file) {
      course.image = req.file.path;
      course.imageId = req.file.filename;
    }

    await course.save();
    res.redirect("/admin/courses");
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
      let deletimg = await cloudinary.uploader.destroy(course.imageId);
      console.log("Cloudinary delete response:", deletimg);
      if (deletimg.result !== "ok") {
        console.warn("Warning: Image deletion from Cloudinary failed");
        throw new Error("Failed to delete image from Cloudinary");
      } else {
        console.log("Image deleted from Cloudinary successfully");
        // 3. Delete course from DB
        await Course.findByIdAndDelete(req.params.id);
        res.redirect("/admin/courses");
      }
    }
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
