import mongoose from "mongoose";

<<<<<<< HEAD
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  // Backend uses tutorId ref to User; keep instructor for compatibility
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  // Organization reference to align with backend `Class` model
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});
=======
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);
>>>>>>> f31c143611fbc17f1ef25c98bfacb959917c5db6

export default mongoose.model("course", CourseSchema);
