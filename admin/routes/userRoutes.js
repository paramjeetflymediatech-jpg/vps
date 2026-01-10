const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Batch = require("../models/Batch");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { auth, role } = require("../middlewares/auth.middleware");
const crypto = require("crypto");
const sendMail = require("../utils/sendmail");

// Route: GET /admin/users/* ========================================================

router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    // Pagination params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    // Optional role filter and sorting
    const roleFilter = req.query.role ? req.query.role.trim() : "";
    const sortRole =
      req.query.sortRole === "asc" || req.query.sortRole === "desc"
        ? req.query.sortRole
        : "";
    const sortName =
      req.query.sortName === "asc" || req.query.sortName === "desc"
        ? req.query.sortName
        : "";

    const query = { _id: { $ne: req.user.id } };
    if (roleFilter) {
      query.role = roleFilter;
    }

    const sort = {};
    if (sortName) {
      // Primary sort by name if requested
      sort.name = sortName === "asc" ? 1 : -1;
    } else if (sortRole) {
      // Otherwise sort by role if requested
      sort.role = sortRole === "asc" ? 1 : -1;
    }
    // Secondary sort by newest users
    sort.createdAt = -1;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit) || 1, 1);

    res.render("users", {
      data: users,
      page,
      totalPages,
      limit,
      total,
      roleFilter,
      sortRole,
      sortName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

/* =========================================================
   ADD USER PAGE (ADMIN)
========================================================= */
router.get("/adduser", auth, role("ADMIN"), (req, res) => {
  res.render("users/adduser.ejs", { data: null });
});

/* =========================================================
   CREATE USER (ADMIN)
========================================================= */
router.post("/create", auth, role("ADMIN"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role: userRole,
      status,
      // isVerified,
    } = req.body;

    // Check duplicate
    const exists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.redirect("/admin/users/");
    }

    // let hashedPassword = null;

    const user = await User.create({
      name,
      email,
      phone,
      // password: hashedPassword,
      role: userRole,
      status: status,
      // isVerified: isVerified === "on",
    });

    /* 🔹 If Tutor without password → send setup link */
    if (user.role === "TUTOR" && status === "ACTIVE") {
      const token = crypto.randomBytes(32).toString("hex");

      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins
      await user.save();

      const link = `${process.env.BASE_URL}/admin/users/setup-password/${token}`;

      await sendMail({
        to: user.email,
        subject: "Set your password",
        html: `
          <p>Your tutor account has been created.</p>
          <p>Click below to set your password:</p>
          <a href="${link}">Set Password</a>
          <p>This link expires in 30 minutes.</p>
        `,
      });
    }

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.redirect("/users/addusers?error=Something went wrong");
  }
});

/* =========================================================
    EDIT USER PAGE (ADMIN)
========================================================= */

router.get("/:id/edit", auth, role("ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.render("users/edituser", { user });
  } catch (error) {
    console.error(error);
    return res.status(500).render("layouts/error", {
      message: "Something went wrong",
    });
  }
});

/* =========================================================
    UPDATE USER (ADMIN)
========================================================= */

router.post("/:id/update", auth, role("ADMIN"), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    return res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    return res.status(500).render("layouts/error", {
      message: "Something went wrong",
    });
  }
});

/* =========================================================
   VIEW USER (ADMIN)
========================================================= */
router.get("/:id", auth, role("ADMIN"), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("layouts/error", {
      message: "Invalid user ID",
      path: req.originalUrl,
    });
  }

  try {
    const data = await User.findById(id).lean();

    if (!data) {
      return res.status(404).render("layouts/error", {
        message: "User not found",
        path: req.originalUrl,
      });
    }

    res.render("users/viewuser", { data });
  } catch (err) {
    console.error(err);
    res.status(500).render("layouts/error", {
      message: "Something went wrong",
      path: req.originalUrl,
    });
  }
});

/* =========================================================
   DELETE USER (ADMIN)
========================================================= */



router.delete("/delete/:id", auth, role("ADMIN"), async (req, res) => {
  const { id } = req.params;

  console.log("DELETE USER ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("❌ DELETE USER ERROR:", err); // 🔥 THIS LINE
    return res.status(500).json({ message: "Delete failed" });
  }
});


/* =========================================================
   TOGGLE USER STATUS (ADMIN)
========================================================= */
router.post("/toggle-status", auth, role("ADMIN"), async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    console.log(user, "user");
    if (user.status === "ACTIVE" && !user.isVerified) {
      user.isVerified = true;
    }
    console.log(user.password == "", "usr");
    if (user.password == "") {
      user.isVerified = false;
    }
    if (user.status === "ACTIVE") {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins
      const link = `${process.env.BASE_URL}/admin/users/setup-password/${token}`;

      await sendMail({
        to: user.email,
        subject: "Set your password",
        html: `
          <p>Your tutor account has been created.</p>
          <p>Click below to set your password:</p>
          <a href="${link}">Set Password</a>
          <p>This link expires in 30 minutes.</p>
        `,
      });
    }

    await user.save();

    res.json({ success: true, status: user.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   SETUP PASSWORD PAGE
========================================================= */
router.get("/setup-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.render("layouts/error", {
      message: "Invalid or expired link",
      path: req.originalUrl,
    });
  }

  res.render("auth/setup-password", { token: req.params.token });
});

/* =========================================================
   HANDLE PASSWORD SETUP
========================================================= */
router.post("/setup-password", async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render("layouts/error", {
      message: "Passwords do not match",
    });
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.render("layouts/error", {
      message: "Invalid or expired link",
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  user.isVerified = true;

  await user.save();

  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

module.exports = router;
