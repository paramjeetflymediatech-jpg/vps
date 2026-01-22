import mongoose from "mongoose";
import CoursePackage from "../models/package.js";
import Course from "../models/course.js";
import Payment from "../models/payment.js";

const ObjectId = mongoose.Types.ObjectId;
const isValidObjectId = (id) => ObjectId.isValid(id);

export const getPackages = async (req, res) => {
  try {
    const { level, category, organizationId, userId } = req.query;

    if (userId) {
      /* ---------- VALIDATE USER ---------- */
      if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ message: "Valid userId is required" });
      }
    }
    /* ---------- MATCH PACKAGES ---------- */
    const matchStage = {
      published: true,
      isDeleted: false,
    };

    if (level) matchStage.level = level;
    if (category) matchStage.category = category;
    if (organizationId && isValidObjectId(organizationId)) {
      matchStage.organizationId = new ObjectId(organizationId);
    }

    /* ---------- AGGREGATION ---------- */
    const ObjectId = mongoose.Types.ObjectId;

    const packages = await CoursePackage.aggregate([
      { $match: matchStage },

      /* 🔹 Lookup payment */
      {
        $lookup: {
          from: "payments",
          let: { packageId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$packageId", "$$packageId"] },
                    { $eq: ["$userId", new ObjectId(userId)] },
                    { $eq: ["$status", "SUCCESS"] },
                  ],
                },
              },
            },

            /* 🔹 Lookup user inside payment */
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },

            {
              $project: {
                user: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  isPaymentDone: 1,
                },
              },
            },
          ],
          as: "paymentInfo",
        },
      },

      /* 🔹 isPaymentDone */
      {
        $addFields: {
          isPaymentDone: { $gt: [{ $size: "$paymentInfo" }, 0] },
          user: { $arrayElemAt: ["$paymentInfo.user", 0] },
        },
      },

      {
        $project: {
          paymentInfo: 0,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    /* ---------- POPULATE COURSES ---------- */
    await CoursePackage.populate(packages, {
      path: "courses",
      select: "title price image",
    });
    return res.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("getPackages error:", error);
    return res.status(500).json({ message: error.message });
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
    }).populate("courses", "title description price image");

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
    } = req.body;

    const courseIds = Array.isArray(courses)
      ? courses
      : courses
        ? [courses]
        : [];

    if (!title || courseIds.length === 0) {
      return res.status(400).json({
        message: "Title and at least one course is required",
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
          return res
            .status(400)
            .json({ message: "Invalid course id in courses" });
        }
      }
      updates.courses = courseIds;
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
      { new: true },
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
