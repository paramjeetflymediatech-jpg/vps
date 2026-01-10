import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
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
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    resetToken: String,
    resetTokenExpiry: Date,

    // ============ Tutor-specific profile fields ============
    // Area of expertise (e.g., "IELTS", "Business English")
    expertise: { type: String },
    // Overall experience label (e.g., "5+ Years")
    experience: { type: String },
    // Rich profile info for TutorDetailsView (optional, can be filled later)
    bio: { type: String },
    education: { type: String },
    specialties: [{ type: String }],
    // High-level availability info shown in "Next Available" on TutorDetailsView
    availability: {
      type: String,
      default: "Today",
    },
    // How fast the tutor usually replies (for TutorDetailsView sidebar)
    responseTime: {
      type: String,
      default: "< 2 hours",
    },
    // Aggregate rating info for public tutor profile
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
