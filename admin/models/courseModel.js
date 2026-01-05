const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String },
  // Backend uses tutorId ref to User; keep instructor for compatibility
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  // Organization reference to align with backend `Class` model
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

// Export as "Class" so admin and backend use the same collection name/Model
module.exports = mongoose.model('course', CourseSchema);
