import express from "express";
import { auth, role } from "../middlewares/auth.middleware.js";
import { getClasses, enrollBatch, getMyEnrollments } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/classes", auth, role("STUDENT"), getClasses);
router.get("/my-classes", auth, role("STUDENT"), getMyEnrollments);
router.post("/enroll", auth, role("STUDENT"), enrollBatch);

export default router;
