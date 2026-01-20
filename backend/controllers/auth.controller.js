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

    // 1️⃣ Basic validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check email or phone already exists
    const userExists = await User.findOne({
      $or: [{ email: emailLower }, { phone }],
    });

    if (userExists) {
      if (userExists.email === emailLower) {
        return res.status(400).json({ message: "Email already registered" });
      }

      if (userExists.phone === phone) {
        return res
          .status(400)
          .json({ message: "Try to use a different phone number" });
      }
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    await User.create({
      name,
      email: emailLower,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    // 5️⃣ Generate OTP
    const otp = generateOtp();

    await Otp.create({
      email: emailLower,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // 6️⃣ Send OTP (non-blocking)
    try {
      await sendOtpEmail(emailLower, otp);
      return res.status(201).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);

      // ROLLBACK: Delete the user and OTP if email fails
      await User.deleteOne({ email: emailLower });
      await Otp.deleteMany({ email: emailLower });

      return res.status(500).json({
        success: false,
        message: "Registered, but failed to send OTP. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
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
    const record = await Otp.findOne({
      email: emailLower,
      otp: String(otp).trim(),
    });

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
      return res.json({
        success: true,
        message: "Email verified successfully",
      });
    }

    // If purpose is 'forgot', do NOT delete the OTP here — keep it so reset-password can verify
    return res.json({
      success: true,
      message: "OTP verified for password reset",
    });
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
    await Otp.create({
      email: emailLower,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    try {
      await sendOtpEmail(emailLower, otp);
    } catch (err) {
      console.error("Resend OTP email error:", err);
      return res.status(200).json({
        success: true,
        message: "OTP generated but failed to send email",
      });
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
    await Otp.create({
      email: emailLower,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    try {
      await sendOtpEmail(emailLower, otp);
    } catch (err) {
      console.error("Forgot password email error:", err);
      return res.status(200).json({
        success: true,
        message: "OTP generated but failed to send email",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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
      message:
        "Password reset successful. Please login with your new password.",
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
    const { email: emailRaw, password: passwordRaw, role } = req.body;

    // 1️⃣ Validate input
    if (!emailRaw || !passwordRaw || !role) {
      console.log("❌ Login failed: Missing fields", {
        emailRaw,
        hasPassword: !!passwordRaw,
        role,
      });
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const email = emailRaw.toLowerCase().trim();
    const password = String(passwordRaw);
    const requestedRole = role.toUpperCase();

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ Login failed: User not found", email);
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Block admin login here
    if (user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Please use the admin login portal",
      });
    }

    // 4️⃣ Role mismatch protection
    if (user.role !== requestedRole) {
      return res.status(403).json({
        success: false,
        message: `You are not allowed to login as ${requestedRole}`,
      });
    }
    // Inactive account check - block any non-ACTIVE account
    if (user.password == "") {
      return res.status(403).json({
        success: false,
        message: "Please check your email to setup password first.",
      });
    }
    // Inactive account check - block any non-ACTIVE account
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }
    // 5️⃣ Email verification check
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 6️⃣ Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 7️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        organizationId: user.organizationId,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 8️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        organizationId: user.organizationId,
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
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    // If photo uploaded (via multer)
    if (req.file) {
      updates.imageid = `${req.file.filename}`;
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
