const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  timeSlot: String,
  maxStudents: Number,
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});

module.exports = mongoose.model("Batch", batchSchema);
