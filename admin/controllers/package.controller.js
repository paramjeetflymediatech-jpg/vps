const CoursePackage = require("../models/coursePackage");
const Course = require("../models/courseModel");
const Class = require("../models/class");

// Helper to generate simple unique slug from title
function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now()
  );
}

/**
 * LIST PACKAGES
 */
exports.renderPackages = async (req, res) => {
  try {
    const query = {};
    if (req.user && req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const sortTitle =
      req.query.sortTitle === "asc" || req.query.sortTitle === "desc"
        ? req.query.sortTitle
        : "";

    const sort = {};
    if (sortTitle) {
      sort.title = sortTitle === "asc" ? 1 : -1;
    }
    sort.createdAt = -1;

    const [packages, total] = await Promise.all([
      CoursePackage.find(query)
        .populate("courses", "title price")
        .populate("createdBy", "name email")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CoursePackage.countDocuments(query),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit) || 1, 1);

    res.render("packages/list", {
      packages,
      page,
      totalPages,
      limit,
      total,
      sortTitle,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/**
 * CREATE FORM
 */
exports.renderCreatePackage = async (req, res) => {
  try {
    const query = { published: true };
    if (req.user && req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    // Only show courses that have at least one upcoming class (by startDate)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingClasses = await Class.find({
      isDeleted: false,
      startDate: { $gte: today },
    })
      .select("courseId")
      .lean();

    const courseIdSet = new Set(
      upcomingClasses
        .map((c) => (c.courseId ? c.courseId.toString() : null))
        .filter(Boolean)
    );

    let courses = [];
    if (courseIdSet.size) {
      courses = await Course.find({
        ...query,
        _id: { $in: Array.from(courseIdSet) },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("_id title price")
        .lean();
    }
    console.log(courses, "courses");

    res.render("packages/add", {
      title: "Create Package",
      courses,
      error: null,
      formData: {},
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.status(error.status).json(error.message);
  }
};

/**
 * CREATE PACKAGE
 */
exports.createPackage = async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      category,
      price,
      discountPrice,
      accessDurationDays,
    } = req.body;

    let { courses } = req.body;

    // Normalize to arrays
    if (courses && !Array.isArray(courses)) courses = [courses];

    const courseIds = courses || [];

    if (courseIds.length === 0) {
      req.flash("error", "Please select at least one course for the package.");
      return res.redirect("back");
    }

    await CoursePackage.create({
      title,
      slug: generateSlug(title),
      description,
      courses: courseIds,
      level,
      category,
      price: Number(price || 0),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      accessDurationDays: accessDurationDays
        ? Number(accessDurationDays)
        : undefined,
      organizationId: req.user.organizationId || null,
      createdBy: req.user.id,
      published: req.body.published === "on",
    });

    req.flash("success", "Package created successfully");
    res.redirect("/admin/packages");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/**
 * EDIT FORM
 */
exports.renderEditPackage = async (req, res) => {
  try {
    const pkg = await CoursePackage.findById(req.params.id).lean();
    if (!pkg) {
      req.flash("error", "Package not found");
      return res.redirect("/admin/packages");
    }

    const query = { published: true };
    if (req.user && req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    // Only show courses that have at least one upcoming class (by startDate)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingClasses = await Class.find({
      isDeleted: false,
      startDate: { $gte: today },
      courseId: { $ne: null },
    })
      .select("courseId")
      .lean();

    const courseIdSet = new Set(
      upcomingClasses
        .map((c) => (c.courseId ? c.courseId.toString() : null))
        .filter(Boolean)
    );

    let courses = [];
    if (courseIdSet.size) {
      courses = await Course.find({
        ...query,
        _id: { $in: Array.from(courseIdSet) },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("_id title price")
        .lean();
    }

    res.render("packages/edit", {
      pkg,
      courses,
      error: null,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("/admin/packages");
  }
};

/**
 * UPDATE PACKAGE
 */
exports.updatePackage = async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      category,
      price,
      discountPrice,
      accessDurationDays,
    } = req.body;

    let { courses } = req.body;
    if (courses && !Array.isArray(courses)) courses = [courses];

    const courseIds = courses || [];

    if (courseIds.length === 0) {
      req.flash("error", "Please select at least one course for the package.");
      return res.redirect("back");
    }

    const updated = await CoursePackage.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        courses: courseIds,
        level,
        category,
        price: Number(price || 0),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        accessDurationDays: accessDurationDays
          ? Number(accessDurationDays)
          : undefined,
        published: req.body.published === "on",
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      req.flash("error", "Package not found");
      return res.redirect("/admin/packages");
    }

    req.flash("success", "Package updated successfully");
    res.redirect("/admin/packages");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/**
 * DELETE PACKAGE (hard delete)
 */
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await CoursePackage.findByIdAndDelete(req.params.id);

    if (!deleted) {
      req.flash("error", "Package not found");
      return res.redirect("/admin/packages");
    }

    req.flash("success", "Package deleted successfully");
    res.redirect("/admin/packages");
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
  }
};
