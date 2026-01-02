const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth.middleware");

router.get("/login", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // ✅ Redirect to dashboard
      return res.redirect("/admin/dashboard");
    } catch (err) {
      // Invalid token → remove it
      res.clearCookie("token");
    }
  }
  return res.render("adminlogin", { error: null });
});

router.post("/logout", auth, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
});
router.get("/dashboard", auth, (req, res) => {
  res.render("dashboard", {
    user: req.user, // ✅ pass user to EJS
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: "ADMIN" });
  if (!admin) {
    return res.render("adminlogin", { error: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.render("adminlogin", { error: "Invalid credentials" });
  }

  // JWT Token
  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      organizationId: admin.organizationId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Store token in cookie (recommended for EJS)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production
  });

  return res.redirect("dashboard");
});

module.exports = router;
