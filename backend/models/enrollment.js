import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Selected slot info
    slotId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to slot from tutor availability
    slot: {
      startTime: { type: String, required: true },
      endTime: { type: String },
      date: { type: Date, required: true },
    },
    meetingLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "COMPLETED", "CANCELLED", "MISSED", "PENDING"],
      default: "UPCOMING",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    notes: { type: String }, // optional notes for admin/student
  },
  { timestamps: true },
);

export default mongoose.model("Enrollment", enrollmentSchema);
