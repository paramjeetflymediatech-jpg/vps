import express from "express";
import { auth, role } from "../middlewares/auth.middleware.js";

import {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/upload.js";
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put(
  "/profile/:id",
  auth,
  role("TUTOR"),
  upload.single("avatar"),
  updateProfile
);

// Profile update for all authenticated users
router.put(
  "/profile",
  auth,
  upload.single("avatar"),
  updateProfile
);

export default router;
