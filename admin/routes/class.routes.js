const express = require("express");
const router = express.Router();

const {
  renderClasses,
  renderCreateClass,
  createClass,
  renderEditClass,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");

const { auth } = require("../middlewares/auth.middleware");
const Class = require("../models/class");

// LIST
router.get("/", auth, renderClasses);

// API: latest upcoming classes for attaching to courses
router.get("/upcoming", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classes = await Class.find({
      isDeleted: false,
      startDate: { $gte: today },
    })
      .sort({ startDate: 1 })
      .limit(50)
      .select("_id title startDate endDate")
      .lean();

    res.json({ success: true, data: classes });
  } catch (err) {
    console.error("/admin/classes/upcoming error", err);
    res.status(500).json({ success: false, message: "Failed to load classes" });
  }
});

// CREATE
router.get("/create", auth, renderCreateClass);
router.post("/create", auth, createClass);

// EDIT
router.get("/edit/:id", auth, renderEditClass);
router.post("/edit/:id", auth, updateClass);

// DELETE
router.post("/delete/:id", auth, deleteClass);

module.exports = router;
