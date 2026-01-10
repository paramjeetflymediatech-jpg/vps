const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  imageId: { type: String },
  // Backend uses tutorId ref to User
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  // Organization reference to align with backend `Class` model
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  // Optional: link one or many live classes to this course
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

// Export as "Class" so admin and backend use the same collection name/Model
const course = mongoose.model("course", CourseSchema);
module.exports = course;
