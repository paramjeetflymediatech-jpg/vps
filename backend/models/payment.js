import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clientPaymentId: { type: String, unique: true, required: true }, // new unique ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor"},
    amount: Number,
    lessons: Number,
    method: { type: String, default: "UPI" },
    status: { 
      type: String, 
      enum: ["PENDING", "UNDER_REVIEW", "SUCCESS", "FAILED"], 
      default: "PENDING" 
    },
    proofImage: String,
    upiRefNo: String, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
