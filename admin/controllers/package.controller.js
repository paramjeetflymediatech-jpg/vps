const CoursePackage = require("../models/coursePackage");
const Course = require("../models/courseModel");

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

    const packages = await CoursePackage.find(query)
      .populate("courses", "title price")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.render("packages/list", { packages });
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

    const courses = await Course.find(query).select("_id title price").lean();

    res.render("packages/add", {
      title: "Create Package",
      courses,
      error: null,
      formData: {},
    });
  } catch (error) {
    console.error(error);
    req.flash("error", error.message);
    res.redirect("back");
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
    if (!courses || (Array.isArray(courses) && courses.length === 0)) {
      req.flash("error", "Please select at least one course for the package.");
      return res.redirect("back");
    }

    // Ensure courses is an array
    if (!Array.isArray(courses)) {
      courses = [courses];
    }
console.log(req.user,'us')
    await CoursePackage.create({
      title,
      slug: generateSlug(title),
      description,
      courses,
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

    const courses = await Course.find(query).select("_id title price").lean();

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
    if (!courses || (Array.isArray(courses) && courses.length === 0)) {
      req.flash("error", "Please select at least one course for the package.");
      return res.redirect("back");
    }

    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    const updated = await CoursePackage.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        courses,
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
