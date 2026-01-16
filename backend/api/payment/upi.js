import express from "express";
import Payment from "../../models/payment.js";
const router = express.Router();

router.post("/upi/initiate", async (req, res) => {
  const { userId, amount, txnId, proofImageUrl } = req.body;

  if (!userId || !amount || !txnId) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    // Create or update a payment record for this txnId
    const payment = await Payment.findOneAndUpdate(
      { txnId },
      {
        userId,
        amount,
        txnId,
        proofImageUrl: proofImageUrl || undefined,
        status: "PENDING",
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Payment recorded:", payment);

    return res.json({ success: true, message: "Payment recorded. Verification pending." });
  } catch (err) {
    console.error("Payment save error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
