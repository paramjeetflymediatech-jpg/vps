const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" },
    amount: Number,
    lessons: Number,
    method: { type: String, default: "UPI" },
    proofImage: String,
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
