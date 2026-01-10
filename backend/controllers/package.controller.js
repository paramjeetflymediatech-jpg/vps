import mongoose from "mongoose";
import CoursePackage from "../models/package.js";
import Course from "../models/course.js";
import Class from "../models/class.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to generate simple unique slug from title
const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now()
  );
};

/**
 * PUBLIC: Get all published packages (optionally filter by level/category)
 * GET /api/packages
 */
export const getPackages = async (req, res) => {
  try {
    const { level, category, organizationId } = req.query;

    const filter = { published: true, isDeleted: false };

    if (level) filter.level = level;
    if (category) filter.category = category;
    if (organizationId && isValidObjectId(organizationId)) {
      filter.organizationId = organizationId;
    }

    const packages = await CoursePackage.find(filter)
      .populate("courses", "title price image")
      .populate("classes", "title price startDate endDate")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: packages });
  } catch (error) {
    console.error("getPackages error", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUBLIC: Get single package by id
 * GET /api/packages/:id
 */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid package id" });
    }

    const pkg = await CoursePackage.findOne({
      _id: id,
      isDeleted: false,
      published: true,
    })
      .populate("courses", "title description price image")
      .populate("classes", "title price startDate endDate");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    console.error("getPackageById error", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: Create package
 * POST /api/packages
 */
export const createPackage = async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      category,
      price,
      discountPrice,
      accessDurationDays,
      courses,
      classes,
    } = req.body;

    const courseIds = Array.isArray(courses) ? courses : courses ? [courses] : [];
    const classIds = Array.isArray(classes) ? classes : classes ? [classes] : [];

    if (!title || (courseIds.length === 0 && classIds.length === 0)) {
      return res.status(400).json({
        message: "Title and at least one course or class is required",
      });
    }

    // Validate course ids (if provided)
    if (courseIds.length > 0) {
      for (const courseId of courseIds) {
        if (!isValidObjectId(courseId)) {
          return res
            .status(400)
            .json({ message: "Invalid course id in courses" });
        }
      }

      const existingCourses = await Course.find({
        _id: { $in: courseIds },
      }).select("_id");
      if (existingCourses.length !== courseIds.length) {
        return res
          .status(400)
          .json({ message: "One or more courses do not exist" });
      }
    }

    // Validate class ids (if provided)
    if (classIds.length > 0) {
      for (const classId of classIds) {
        if (!isValidObjectId(classId)) {
          return res
            .status(400)
            .json({ message: "Invalid class id in classes" });
        }
      }

      const existingClasses = await Class.find({
        _id: { $in: classIds },
      }).select("_id");
      if (existingClasses.length !== classIds.length) {
        return res
          .status(400)
          .json({ message: "One or more classes do not exist" });
      }
    }

    const pkg = await CoursePackage.create({
      title,
      slug: generateSlug(title),
      description,
      level,
      category,
      price: price ? Number(price) : 0,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      accessDurationDays: accessDurationDays
        ? Number(accessDurationDays)
        : undefined,
      courses: courseIds,
      classes: classIds,
      organizationId: req.user?.organizationId || undefined,
      createdBy: req.user?._id || req.user?.id,
      published: req.body.published === "true" || req.body.published === true,
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    console.error("createPackage error", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: Update package
 * PUT /api/packages/:id
 */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      level,
      category,
      price,
      discountPrice,
      accessDurationDays,
      courses,
      classes,
      published,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid package id" });
    }

    const updates = {};

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (level) updates.level = level;
    if (category) updates.category = category;
    if (price !== undefined) updates.price = Number(price);
    if (discountPrice !== undefined)
      updates.discountPrice = Number(discountPrice);
    if (accessDurationDays !== undefined)
      updates.accessDurationDays = Number(accessDurationDays);

    if (courses) {
      const courseIds = Array.isArray(courses) ? courses : [courses];
      if (courseIds.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one course is required" });
      }
      for (const courseId of courseIds) {
        if (!isValidObjectId(courseId)) {
          return res.status(400).json({ message: "Invalid course id in courses" });
        }
      }
      updates.courses = courseIds;
    }

    if (classes) {
      const classIds = Array.isArray(classes) ? classes : [classes];
      for (const classId of classIds) {
        if (!isValidObjectId(classId)) {
          return res.status(400).json({ message: "Invalid class id in classes" });
        }
      }
      updates.classes = classIds;
    }

    if (published !== undefined) {
      updates.published = published === "true" || published === true;
    }

    const pkg = await CoursePackage.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    console.error("updatePackage error", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: Soft delete package
 * DELETE /api/packages/:id
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid package id" });
    }

    const pkg = await CoursePackage.findByIdAndUpdate(
      id,
      { isDeleted: true, published: false },
      { new: true }
    );

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("deletePackage error", error);
    res.status(500).json({ message: error.message });
  }
};
