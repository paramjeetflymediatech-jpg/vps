import express from "express";
const router = express.Router();

/**
 * User submits payment request after paying
 */
router.post("/upi/initiate", async (req, res) => {
  const { userId, amount, txnId } = req.body;

  if (!txnId) {
    return res.status(400).json({ message: "Transaction ID required" });
  }

  // Save payment as PENDING
  const payment = {
    userId,
    amount,
    txnId,
    status: "PENDING",
    createdAt: new Date(),
  };

  // TODO: save to DB
  console.log("Payment saved:", payment);

  res.json({
    success: true,
    message: "Payment submitted for verification",
  });
});

export default router;
