import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "TUTOR", "STUDENT"],
      default: "STUDENT",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
