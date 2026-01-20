import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { auth, role } from "../middlewares/auth.middleware.js";

import upload from "../../admin/middlewares/upload.js"; // Aapka multer config

const router = express.Router();

// 'image' field name frontend ke FormData name se match hona chahiye
router.post("/", auth, role("TUTOR"), upload.single("image"), createCourse);
router.put("/:id", auth, role("TUTOR"), upload.single("image"), updateCourse);

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.delete("/:id", auth, role("TUTOR"), deleteCourse);

export default router;
