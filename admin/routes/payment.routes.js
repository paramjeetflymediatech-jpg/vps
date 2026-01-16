const express = require("express");
const router = express.Router();

const Payment = require("../models/payment");
const User = require("../models/userModel");
const { auth, role } = require("../middlewares/auth.middleware");

// LIST PAYMENTS
router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.render("payments/list", { payments });
  } catch (err) {
    console.error("Admin payments list error:", err);
    res.status(500).render("layouts/error", {
      message: "Failed to load payments",
      path: req.originalUrl,
    });
  }
});

// VIEW SINGLE PAYMENT
router.get("/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "name email role isPaymentDone")
      .lean();

    if (!payment) {
      return res.status(404).render("layouts/error", {
        message: "Payment not found",
        path: req.originalUrl,
      });
    }

    res.render("payments/view", { payment });
  } catch (err) {
    console.error("Admin payment view error:", err);
    res.status(500).render("layouts/error", {
      message: "Failed to load payment",
      path: req.originalUrl,
    });
  }
});

// VERIFY / UPDATE PAYMENT STATUS & USER.isPaymentDone
router.post("/:id/verify", auth, role("ADMIN"), async (req, res) => {
  const { status } = req.body; // PENDING | VERIFIED | REJECTED

  if (!status || !["PENDING", "VERIFIED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    await payment.save();

    // When verified, mark user.isPaymentDone = true
    if (status === "VERIFIED" && payment.userId) {
      await User.findByIdAndUpdate(payment.userId, {
        $set: { isPaymentDone: true },
      });
    }

    return res.json({
      success: true,
      message: "Payment updated successfully",
    });
  } catch (err) {
    console.error("Admin payment verify error:", err);
    return res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
