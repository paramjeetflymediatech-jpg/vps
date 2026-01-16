import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    txnId: { type: String, required: true, unique: true },
    // Optional: URL or path to transaction screenshot/image
    proofImageUrl: { type: String },
    // PENDING = user submitted, admin not yet verified
    // VERIFIED = admin confirmed payment
    // REJECTED = admin rejected/invalid payment
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
