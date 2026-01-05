const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

 
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "ADMIN" });

    if (!admin) {
      req.flash("error", "Admin not found");
      return res.redirect("/admin/login");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false, // true in production
    });

    req.flash("success", "Welcome Admin!");
    res.redirect("/admin/dashboard");

  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    res.redirect("/admin/login");
  }
};

 

module.exports = { adminLogin };
