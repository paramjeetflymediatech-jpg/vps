import mongoose from "mongoose";

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

export default mongoose.model("Course", courseSchema);
