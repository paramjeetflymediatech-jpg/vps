import Course from "../models/course.js";

/* ===========================
   CREATE COURSE
=========================== */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      schedule,
      duration,
      price,
      status,
    } = req.body;

    if (!title || !schedule || !duration || !price) {
      return res.status(400).json({
        message: "Title, schedule, duration and price are required",
      });
    }

    const course = await Course.create({
      title,
      schedule,
      duration,
      price,
      status: status || "Draft",
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

/* ===========================
   GET ALL COURSES
=========================== */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* ===========================
   GET COURSE BY ID
=========================== */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

/* ===========================
   UPDATE COURSE
=========================== */
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        schedule: req.body.schedule,
        duration: req.body.duration,
        price: req.body.price,
        status: req.body.status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

/* ===========================
   DELETE COURSE
=========================== */
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
