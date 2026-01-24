const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    clientPaymentId: { type: String, unique: true, required: true }, // new unique ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor"},
    amount: Number,
    lessons: Number,
    method: { type: String, default: "UPI" },
    status: { 
      type: String, 
      enum: ["PENDING", "UNDER_REVIEW", "SUCCESS", "REJECTED"], 
      default: "PENDING" 
    },
    proofImage: String,
    upiRefNo: String, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
