import express from "express";
const router = express.Router();

/**
 * 1️⃣ Client submits UPI txnId after paying
 * Status is ALWAYS PENDING here
 */
router.post("/upi/initiate", async (req, res) => {
  try {
    const { userId, amount, txnId } = req.body;

    if (!userId || !amount || !txnId) {
      return res.status(400).json({
        success: false,
        message: "userId, amount and txnId are required",
      });
    }

    // 🚨 Never trust client for success
    const payment = {
      userId,
      amount,
      txnId,
      method: "UPI",
      status: "PENDING",
      createdAt: new Date(),
    };

    // TODO: Save to DB
    // await Payment.create(payment);

    console.log("✅ UPI payment saved:", payment);

    return res.status(201).json({
      success: true,
      message: "Payment recorded. Verification pending.",
      data: payment,
    });
  } catch (error) {
    console.error("❌ UPI initiate error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * 2️⃣ Check payment status (Frontend polling)
 */
router.get("/upi/status/:txnId", async (req, res) => {
  try {
    const { txnId } = req.params;

    // TODO: Fetch from DB
    // const payment = await Payment.findOne({ txnId });

    // TEMP response (for testing)
    return res.json({
      success: true,
      txnId,
      status: "PENDING", // SUCCESS | FAILED
    });
  } catch (error) {
    console.error("❌ Status check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * 3️⃣ MOCK: Mark payment SUCCESS (TESTING ONLY)
 */
router.put("/upi/mock-success/:txnId", async (req, res) => {
  const { txnId } = req.params;

  // TODO: Update DB → status: SUCCESS
  console.log(`🟢 Payment marked SUCCESS for txnId: ${txnId}`);

  return res.json({
    success: true,
    txnId,
    status: "SUCCESS",
  });
});

/**
 * 4️⃣ MOCK: Mark payment FAILED (TESTING ONLY)
 */
router.put("/upi/mock-failed/:txnId", async (req, res) => {
  const { txnId } = req.params;

  // TODO: Update DB → status: FAILED
  console.log(`🔴 Payment marked FAILED for txnId: ${txnId}`);

  return res.json({
    success: true,
    txnId,
    status: "FAILED",
  });
});

/**
 * 5️⃣ Health check (debug)
 */
router.get("/test", (req, res) => {
  res.json({ paymentRoute: "WORKING ✅" });
});

export default router;
