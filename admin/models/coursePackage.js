const mongoose = require("mongoose");

const coursePackageSchema = new mongoose.Schema(
  {
    // Basic info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },

    // Courses inside this package (admin selects from existing courses)
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],

    // Optional: specific live classes included in this package
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    // Target level/type (for English learning)
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    },
    category: {
      type: String, // e.g. GENERAL_ENGLISH, SPOKEN_ENGLISH, IELTS, BUSINESS_ENGLISH
    },

    // Pricing
    price: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Access / validity (in days)
    accessDurationDays: {
      type: Number, // e.g. 90, 180, 365
    },

    // Ownership / organization
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    // Who created this package (should be ADMIN at route level)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Visibility
    published: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoursePackage", coursePackageSchema);
