import Class from "../models/class.js";
import Course from "../models/course.js";

/**
 * CREATE CLASS
 */
export const createClass = async (req, res) => {
  try {
    const data = req.body;

    const courseExists = await Course.findById(data.courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newClass = await Class.create(data);

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL CLASSES
 * Optional filters: courseId, instructorId, status
 */
export const getAllClasses = async (req, res) => {
  try {
    const { courseId, instructorId, status } = req.query;

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (instructorId) filter.instructorId = instructorId;
    if (status) filter.status = status;

    const classes = await Class.find(filter)
      .populate("courseId", "title")
      .populate("instructorId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CLASS BY ID
 */
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("courseId", "title")
      .populate("instructorId", "name email");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ success: true, data: classData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CLASS
 */
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      success: true,
      message: "Class updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE CLASS
 */
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
