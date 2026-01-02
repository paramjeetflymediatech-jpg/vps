const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const admin = await User.findOne({ email, role: "ADMIN" });

  if (!admin) {
    return res.status(401).json({ message: "Admin not found" });
  }

  // 2. Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3. Generate token
  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      // organizationId: admin.organizationId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 4. Response
  res.json({
    message: "Admin login successful",
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      // organizationId: admin.organizationId,
    },
  });
};
module.exports = { adminLogin };
