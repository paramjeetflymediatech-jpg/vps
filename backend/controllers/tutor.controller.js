import TutorApplication from "../models/TutorApplication.js";
import Class from "../models/class.js";
import Batch from "../models/batch.js";
import User from "../models/User.js";

export const applyTutor = async (req, res) => {
  try {
    const { name, email, phone, expertise, experience } = req.body;
    console.log("Received tutor application data:", req.body);
    // 1️⃣ Validation
    if (!name || !email || !phone || !expertise || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Prevent duplicate applications

    // 2️⃣ Check email or phone already exists
    const existingTutor = await User.findOne({
      $or: [{ email: email }, { phone }],
    });

    if (existingTutor) {
      if (existingTutor.email === email) {
        return res
          .status(409)
          .json({ success: false, message: "Email already registered" });
      }

      if (existingTutor.phone === phone) {
        return res.status(409).json({
          success: false,
          message: "Try to use a different phone number",
        });
      }
    }

    // 3️⃣ Save application
    await User.create({
      name,
      email,
      phone,
      expertise,
      password: "",
      experience,
      role: "TUTOR",
      status: "INACTIVE",
    });

    // 4️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("❌ Tutor Apply Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createClass = async (req, res) => {
  const newClass = await Class.create({
    title: req.body.title,
    description: req.body.description,
    tutorId: req.user.id,
    organizationId: req.user.organizationId,
  });
  res.json(newClass);
};

export const createBatch = async (req, res) => {
  const batch = await Batch.create({
    ...req.body,
    tutorId: req.user.id,
    organizationId: req.user.organizationId,
  });
  res.json(batch);
};
