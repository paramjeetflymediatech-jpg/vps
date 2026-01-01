import TutorApplication from "../models/TutorApplication.js";

export const applyTutor = async (req, res) => {
  console.log("🔥 POST /api/tutor/apply HIT");

  try {
    const { name, email, phone, expertise, experience } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !phone || !expertise || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Prevent duplicate applications
    const existingTutor = await TutorApplication.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingTutor) {
      return res.status(409).json({
        success: false,
        message: "You have already applied. We will contact you soon.",
      });
    }

    // 3️⃣ Save application
    await TutorApplication.create({
      name,
      email,
      phone,
      expertise,
      experience,
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
