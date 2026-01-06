const express = require("express");
const router = express.Router();

const {
  renderClasses,
  renderCreateClass,
  createClass,
  renderEditClass,
  updateClass,
  deleteClass,
} = require("../controllers/class.controller");

const { auth } = require("../middlewares/auth.middleware");

// LIST
router.get("/", auth, renderClasses);

// CREATE
router.get("/create", auth, renderCreateClass);
router.post("/create", auth, createClass);

// EDIT
router.get("/edit/:id", auth, renderEditClass);
router.post("/edit/:id", auth, updateClass);

// DELETE
router.post("/delete/:id", auth, deleteClass);

module.exports = router;
