const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Course = require("../models/courseModel");
const Class = require("../models/class");
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

    // Load upcoming classes (startDate today or future) for attaching to the course
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classes = await Class.find({
      isDeleted: false,
      startDate: { $gte: today },
    })
      .sort({ startDate: 1 })
      .limit(20)
      .select("_id title startDate endDate")
      .lean();

    res.render("tutor_course/add", {
      error: null,
      formData: {},
      tutors,
      classes,
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
    console.log(req.body);
    try {
      const { title, description, tutorId, price, published } = req.body;
      let { classes } = req.body;

      // Normalize classes to an array of ids
      if (classes && !Array.isArray(classes)) {
        classes = [classes];
      }
      const classIds = classes || [];

      const imageUrl = req.file?.path; // Cloudinary URL
      const imageId = req.file?.filename;

      // Compute course expiry date = max endDate of attached classes (if any)
      let expiryDate = null;
      if (classIds.length) {
        const latestClass = await Class.find({ _id: { $in: classIds } })
          .sort({ endDate: -1 })
          .limit(1)
          .select("endDate")
          .lean();
        if (latestClass.length && latestClass[0].endDate) {
          expiryDate = latestClass[0].endDate;
        }
      }

      let data = await Course.create({
        title,
        description,
        tutorId: tutorId || null,
        organizationId: req.user.organizationId || null,
        price: Number(price || 0),
        published: published === "on",
        image: imageUrl,
        imageId, // 👈 SAVE IMAGE
        classes: classIds,
        expiryDate,
      });
      // ✅ Update all selected classes with courseId
      if (classIds.length) {
        await Class.updateMany(
          { _id: { $in: classIds } },
          { $set: { courseId: data._id, tutorId: tutorId || null } },
        );
      }
      console.log("New Course Created:", data);
      return res.redirect("/admin/courses");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  },
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

    // Load upcoming classes (startDate today or future) so admin can attach/detach them
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classes = await Class.find({
      isDeleted: false,
      startDate: { $gte: today },
    })
      .sort({ startDate: 1 })
      .limit(20)
      .select("_id title startDate endDate")
      .lean();

    if (!course) return res.redirect("/admin/courses");

    res.render("tutor_course/edit", {
      course,
      tutors,
      classes,
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

    // Delete old image
    if (req.file && course.imageId) {
      await cloudinary.uploader.destroy(course.imageId);
    }

    course.title = req.body.title;
    course.description = req.body.description;
    course.tutorId = req.body.tutorId || null;
    course.organizationId = req.user.organizationId || course.organizationId;
    course.price = Number(req.body.price);
    course.published = req.body.published === "on";

    // Normalize classes
    let { classes } = req.body;
    let addedClasses = [];
    if (classes && !Array.isArray(classes)) {
      classes = [classes];
    }
    const classIds = classes || [];
    if (classIds.length > 1) {
      // 🔁 SYNC CLASS ↔ COURSE RELATION
      const oldClassIds = course.classes.map((id) => id.toString());
      const newClassIds = classIds.map((id) => id.toString());
      const removedClasses = oldClassIds.filter(
        (id) => !newClassIds.includes(id),
      );
      addedClasses = newClassIds.filter((id) => !oldClassIds.includes(id));

      if (removedClasses.length) {
        await Class.updateMany(
          { _id: { $in: removedClasses } },
          { $unset: { courseId: "" } },
        );
      }
    } else {
      addedClasses = [...classIds];
    }

    if (addedClasses.length) {
      await Class.updateMany(
        { _id: { $in: addedClasses } },
        { $set: { courseId: course._id, tutorId: course.tutorId } },
      );
    }

    course.classes = classIds;

    // Recompute expiry date
    if (classIds.length) {
      const latestClass = await Class.find({ _id: { $in: classIds } })
        .sort({ endDate: -1 })
        .limit(1)
        .select("endDate")
        .lean();

      course.expiryDate =
        latestClass.length && latestClass[0].endDate
          ? latestClass[0].endDate
          : null;
    } else {
      course.expiryDate = null;
    }

    if (req.file) {
      course.image = req.file.path;
      course.imageId = req.file.filename;
    }

    await course.save();
    res.redirect("/admin/courses");
  },
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
