import express from "express";
import { 
    createCourse, 
    getCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse 
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/upload.js"; // Aapka multer config

const router = express.Router();

// 'image' field name frontend ke FormData name se match hona chahiye
router.post("/", upload.single("image"), createCourse);
router.put("/:id", upload.single("image"), updateCourse);

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);

export default router;