const express = require("express");
const router = express.Router();
const Course = require("../models/courseModel");
const { auth, role } = require("../middlewares/auth.middleware");

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
router.get("/add", auth, role("ADMIN"), (req, res) => {
  res.render("tutor_course/add", { error: null, formData: {} });
});

/*
|--------------------------------------------------------------------------
| CREATE – Save Course
|--------------------------------------------------------------------------
*/
router.post("/add", auth, role("ADMIN"), async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      tutorId,
      price,
      published,
      organizationId,
    } = req.body;

    if (!title || !description) {
      return res.render("courses/add", {
        error: "Title and description are required",
        formData: req.body,
      });
    }

    await Course.create({
      title,
      description,
      instructor,
      tutorId: tutorId || null,
      organizationId: organizationId || null,
      price: Number(price || 0),
      published: published === "on",
    });

    res.redirect("/admin/courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE – Show Edit Course Page
|--------------------------------------------------------------------------
*/
router.get("/edit/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.redirect("/admin/courses");

    res.render("tutor_course/edit", { course, error: null });
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
router.post("/edit/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      tutorId,
      price,
      published,
      organizationId,
    } = req.body;

    await Course.findByIdAndUpdate(req.params.id, {
      title,
      description,
      instructor,
      tutorId: tutorId || null,
      organizationId: organizationId || null,
      price: Number(price || 0),
      published: published === "on",
    });

    res.redirect("/admin/courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

/*
|--------------------------------------------------------------------------
| DELETE – Delete Course
|--------------------------------------------------------------------------
*/
router.post("/delete/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect("/admin/courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
