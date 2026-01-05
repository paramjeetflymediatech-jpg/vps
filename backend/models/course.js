import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    schedule: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true, // ✅ added
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
