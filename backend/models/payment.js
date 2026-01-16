import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    method: {
      type: String,
      default: "UPI",
    },
    lessons: {
      type: Number,
    },
    txnId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
