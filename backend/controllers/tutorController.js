import Tutor from "../models/Tutor.js";

export const applyTutor = async (req, res) => {
  try {
    const { name, email, phone, expertise, experience } = req.body;

    if (!name || !email || !phone || !expertise || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(409).json({
        success: false,
        message: "Tutor already applied with this email",
      });
    }

    const tutor = await Tutor.create({
      name,
      email,
      phone,
      expertise,
      experience,
    });

    res.status(201).json({
      success: true,
      message: "Tutor application submitted successfully",
      tutor,
    });
  } catch (error) {
    console.error("Tutor Apply Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
