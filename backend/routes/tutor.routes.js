import express from "express";
import { applyTutor } from "../controllers/tutor.controller.js";
import { auth ,role} from "../middlewares/auth.middleware.js"; 
import { createClass, createBatch } from "../controllers/tutor.controller.js";
const router = express.Router();

/**
 * POST /api/tutor/apply
 */

router.post("/", (req, res) => {
  res.json({ success: true, message: "Tutor base route working" });
});
router.post("/apply", applyTutor);
router.post("/class", auth, role("TUTOR"), createClass);
router.post("/batch", auth, role("TUTOR"), createBatch);

export default router;
