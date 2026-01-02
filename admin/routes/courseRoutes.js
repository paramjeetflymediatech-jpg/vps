const express = require("express");
const router = express.Router();
const Course = require("../models/courseModel");
const { auth } = require("../middlewares/auth.middleware");

// List all courses
router.get("/",auth, (req, res) => {
  Course.find()
    .then((courses) => res.render("courses", { courses }))
    .catch((err) => res.status(500).send(err));
});

// Create a new course
router.post("/create", auth, (req, res) => {
  const { title, description, instructor, price, published } = req.body;
  const newCourse = new Course({
    title,
    description,
    instructor,
    price,
    published,
  });

  newCourse
    .save()
    .then(() => res.redirect("/admin/courses"))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
