import Course from "../models/course.js";

// @desc    Create a new course
// @route   POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, tutorId, organizationId, published } = req.body;

    // Multer se filename extract karein
    const imageName = req.file ? req.file.filename : null;

    // Course data object taiyar karein
    const courseData = {
      title,
      description,
      price: Number(price), // String ko number mein convert karein
      published: published === "true" || published === true,
      image: imageName, // Sirf filename: "1767606882074.jpg"
    };

    // Mandatory/Optional IDs logic
    // Agar tutorId string hai toh use add karein, warna null ya skip karein
    if (tutorId && tutorId.trim() !== "") {
      courseData.tutorId = tutorId;
    }

    if (organizationId && organizationId.trim() !== "") {
      courseData.organizationId = organizationId;
    }

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (err) {
    console.error("Create Course Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const data = { ...req.body };

    // Agar user ne nayi file di hai toh use update karein
    if (req.file) {
      data.image = req.file.filename;
    }

    // Number conversion
    if (data.price) data.price = Number(data.price);
    if (data.published) data.published = data.published === "true" || data.published === true;

    // IDs Cleaning: Agar empty string bhej rahe ho toh use undefined kar do 
    // taaki Mongoose use bypass kar sake
    if (!data.tutorId || data.tutorId.trim() === "") delete data.tutorId;
    if (!data.organizationId || data.organizationId.trim() === "") delete data.organizationId;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- GET aur DELETE functions (Wahi rahenge jo aapne diye hain) ---

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("tutorId", "name email") 
      .populate("organizationId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("tutorId")
      .populate("organizationId");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    if (err.kind === "ObjectId") return res.status(400).json({ message: "Invalid Course ID" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};