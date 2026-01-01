import express from "express";
import { applyTutor } from "../controllers/tutor.controller.js";

const router = express.Router();

/**
 * POST /api/tutor/apply
 */
router.post("/apply", applyTutor);

/**
 * OPTIONAL: base test route
 * POST /api/tutor
 */
router.post("/", (req, res) => {
  res.json({ success: true, message: "Tutor base route working" });
});

export default router;
