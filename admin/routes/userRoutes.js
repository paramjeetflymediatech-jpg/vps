const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Batch = require("../models/Batch");
const { auth, role } = require("../middlewares/auth.middleware");

const getUsers = async (req, res) => {
  try {
    let data = [];
    if (req.user.role === "ADMIN") {
      const filter = { organizationId: req.user.organizationId };
      if (role) filter.role = role;
      const users = await User.find(filter).select("-password");
      data = users;
    } else if (req.user.role === "TUTOR") {
      const batches = await Batch.find({
        tutorId: req.user.id,
      }).select("enrolledStudents");

      const studentIds = batches.flatMap((b) => b.enrolledStudents);

      const students = await User.find({
        _id: { $in: studentIds },
      }).select("-password");
      data = students;
    } else if (req.user.role === "STUDENT") {
      const user = await User.findById(req.user.id).select("-password");
      data = user;
    }
    console.log("Fetched users data:", data);
    return res.render("users", { users: data });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};
router.get("/", auth, role("ADMIN"), getUsers);

// Create a new user (admin only)
router.post("/create", auth, (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser
    .save()
    .then(() => res.redirect("/admin/users"))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
