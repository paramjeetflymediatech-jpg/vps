import mongoose from "mongoose";
import Class from "../models/class.js";
import Course from "../models/course.js";
import User from "../models/user.js";

/**
 * Helper: validate ObjectId
 */
const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/**
 * CREATE CLASS
 */
export const createClass = async (req, res) => {
  try {
    const {
      title,
      courseId,
      instructorId,
      meetLink,
      startTime,
      endTime,
      status,
    } = req.body;

    // Required fields
    if (
      !title ||
      !courseId ||
      !instructorId ||
      !meetLink ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // ObjectId validation
    if (!isValidObjectId(courseId) || !isValidObjectId(instructorId)) {
      return res.status(400).json({
        message: "Invalid courseId or instructorId",
      });
    }

    // Date validation
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    if (new Date(startTime) < new Date()) {
      return res.status(400).json({
        message: "Class start time must be in the future",
      });
    }

    // Course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Instructor existence
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "INSTRUCTOR") {
      return res.status(400).json({
        message: "Invalid instructor",
      });
    }

    // Meeting link uniqueness
    const linkExists = await Class.findOne({ meetLink });
    if (linkExists) {
      return res.status(409).json({
        message: "Meeting link already in use",
      });
    }

    // Time clash validation
    const clash = await Class.findOne({
      instructorId,
      status: { $in: ["SCHEDULED", "ONGOING"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (clash) {
      return res.status(409).json({
        message: "Instructor already has a class in this time slot",
      });
    }

    const newClass = await Class.create({
      title,
      courseId,
      instructorId,
      meetLink,
      startTime,
      endTime,
      status,
    });

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
 */
export const getAllClasses = async (req, res) => {
  try {
    const { courseId, instructorId, status } = req.query;
    const filter = {};

    if (courseId) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ message: "Invalid courseId" });
      }
      filter.courseId = courseId;
    }

    if (instructorId) {
      if (!isValidObjectId(instructorId)) {
        return res.status(400).json({ message: "Invalid instructorId" });
      }
      filter.instructorId = instructorId;
    }

    if (status) {
      filter.status = status;
    }

    const classes = await Class.find(filter)
      .populate("courseId", "title")
      .populate("instructorId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CLASS BY ID
 */
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const classData = await Class.findById(id)
      .populate("courseId", "title")
      .populate("instructorId", "name email");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CLASS
 */
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const updatedData = req.body;

    // Date logic
    const start = updatedData.startTime || existingClass.startTime;
    const end = updatedData.endTime || existingClass.endTime;

    if (new Date(start) >= new Date(end)) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // Status transition
    if (updatedData.status) {
      const allowed = {
        SCHEDULED: ["ONGOING", "CANCELLED"],
        ONGOING: ["COMPLETED"],
        COMPLETED: [],
        CANCELLED: [],
      };

      if (!allowed[existingClass.status].includes(updatedData.status)) {
        return res.status(400).json({
          message: `Cannot change status from ${existingClass.status} to ${updatedData.status}`,
        });
      }
    }

    // Clash check (exclude current class)
    const clash = await Class.findOne({
      _id: { $ne: id },
      instructorId:
        updatedData.instructorId || existingClass.instructorId,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (clash) {
      return res.status(409).json({
        message: "Instructor already has a class at this time",
      });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
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
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const deleted = await Class.findByIdAndDelete(id);
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
