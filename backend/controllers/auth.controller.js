import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";


/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const emailLower = String(email).toLowerCase();

    // Dev log: show incoming fields except password
    console.log("[register] payload:", { name, email, phone });

    // Basic validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ email: emailLower });
    console.log("[register] userExists:", !!userExists);
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: emailLower,
      phone,
      password: hashed,
      isVerified: false
    });

    const otp = generateOtp();

    await Otp.create({
      email: emailLower,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
    });

    // Log OTP to console for development (helps when email fails)
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Sending email shouldn't block registration — handle failure gracefully
    try {
      await sendOtpEmail(emailLower, otp);
      return res.status(201).json({ success: true, message: "OTP sent to email" });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
      return res.status(201).json({ success: true, message: "Registered — failed to send OTP" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body; // purpose: 'register' | 'forgot'
    const emailLower = String(email).toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP record matching email + otp
    const record = await Otp.findOne({ email: emailLower, otp: String(otp).trim() });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check expiry
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // If this verification is for registration, mark user verified and remove OTPs
    if (!purpose || purpose === "register") {
      await User.updateOne({ email: emailLower }, { isVerified: true });
      await Otp.deleteMany({ email: emailLower });
      return res.json({ success: true, message: "Email verified successfully" });
    }

    // If purpose is 'forgot', do NOT delete the OTP here — keep it so reset-password can verify
    return res.json({ success: true, message: "OTP verified for password reset" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = String(email).toLowerCase();

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();

    // Remove previous otps and create new
    await Otp.deleteMany({ email: emailLower });
    await Otp.create({ email: emailLower, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    try {
      await sendOtpEmail(emailLower, otp);
    } catch (err) {
      console.error("Resend OTP email error:", err);
      return res.status(200).json({ success: true, message: "OTP generated but failed to send email" });
    }

    res.status(200).json({ success: true, message: "OTP resent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = String(email).toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    await Otp.deleteMany({ email: emailLower });
    await Otp.create({ email: emailLower, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`Generated password-reset OTP for ${emailLower}: ${otp}`);

    try {
      await sendOtpEmail(emailLower, otp);
    } catch (err) {
      console.error("Forgot password email error:", err);
      return res.status(200).json({ success: true, message: "OTP generated but failed to send email" });
    }

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const otpTrimmed = String(otp).trim();

    console.log("[resetPassword] request:", {
      email: emailLower,
      otp: otpTrimmed,
    });

    // 1️⃣ Check user exists
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Find OTP record
    const otpRecord = await Otp.findOne({
      email: emailLower,
      otp: otpTrimmed,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // 3️⃣ Check OTP expiry
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ email: emailLower }); // cleanup
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 4️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5️⃣ Update password
    user.password = hashedPassword;
    await user.save();

    // 6️⃣ Delete OTPs after successful reset
    await Otp.deleteMany({ email: emailLower });

    console.log("[resetPassword] password updated for:", emailLower);

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const emailRaw = req.body.email;
    const passwordRaw = req.body.password;

    // 1️⃣ Validate input
    if (!emailRaw || !passwordRaw) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const email = emailRaw.toLowerCase().trim();
    const password = String(passwordRaw);

    console.log("[login] attempt:", { email });

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Check email verification
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 4️⃣ Compare password safely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};
