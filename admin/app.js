const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const config = require("./config");
const app = express();
const cookieParser = require("cookie-parser");
// Connect to MongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.use(cookieParser());
// Setup EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Setup
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport.js Setup
require("./passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/admin/users", require("./routes/userRoutes"));
app.use("/admin/courses", require("./routes/courseRoutes"));
app.use("/admin/", require("./routes/admin.routes"));
// Dashboard Route
app.get("/admin", (req, res) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  res.render("/dashboard");
});
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use((req, res) => {
  console.log("404 Error - Path not found:", req.originalUrl);
  res.status(404).render("layouts/error", {
    message: "Page not found",
    path: req.originalUrl,
  });
});
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
