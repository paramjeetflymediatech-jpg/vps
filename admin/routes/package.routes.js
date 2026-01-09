const express = require("express");
const router = express.Router();

const {
  renderPackages,
  renderCreatePackage,
  createPackage,
  renderEditPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/package.controller");

const { auth, role } = require("../middlewares/auth.middleware");

// LIST
router.get("/", auth, role("ADMIN"), renderPackages);

// CREATE
router.get("/add", auth, role("ADMIN"), renderCreatePackage);
router.post("/add", auth, role("ADMIN"), createPackage);

// EDIT
router.get("/edit/:id", auth, role("ADMIN"), renderEditPackage);
router.post("/edit/:id", auth, role("ADMIN"), updatePackage);

// DELETE
router.post("/delete/:id", auth, role("ADMIN"), deletePackage);

module.exports = router;
