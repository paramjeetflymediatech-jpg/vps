import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import { createUpiPayment, logUpiPayment, uploadPaymentProof } from "../controllers/payment.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// POST /api/payment/upi - calculate amount for lesson plan
router.post("/upi", paymentAuth, createUpiPayment);

// POST /api/payment/upi/log - store payment transaction in DB
router.post("/upi/log", paymentAuth, logUpiPayment);

// POST /api/payment/upload-proof - upload payment proof image
router.post("/upload-proof", paymentAuth, (req, res, next) => {
  req.body.folder = "payments";
  next();
}, upload.single("paymentImage"), uploadPaymentProof);

export default router;
