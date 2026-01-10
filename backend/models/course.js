import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    imageId: { type: String },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    // Optional: link one or many live classes to this course
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("course", CourseSchema);
