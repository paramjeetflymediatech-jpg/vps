// app.js - Admin web server entrypoint
// This file sets up the Express app for the admin interface:
// - loads configuration and environment variables
// - connects to MongoDB
// - configures sessions, passport authentication, and middleware
// - mounts admin routes and starts the HTTP server

require("dotenv").config(); // Load .env (if present) into process.env
const express = require("express");
const mongoose = require("mongoose");
// Load .env (if present) into process.env

const session = require("express-session");
const passport = require("passport");
const path = require("path");
const config = require("./config/config");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Session setup: stores session data server-side (default memory store here)
// In production, replace the default store with a persistent store.
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
// Passport configuration and initialization
// `./passport` should configure strategies and serialize/deserialize
require("./passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Parse cookies on incoming requests (used by some auth/session flows)
app.use(cookieParser());
// Configure view engine (EJS) and views directory

// Static assets and body parsing middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(express.json()); // parse JSON bodies

// Expose `node_modules` under `/vendor` for client-side libs if needed
app.use("/vendor", express.static(path.join(__dirname, "node_modules")));
app.use("/uploads", express.static("uploads"));
// Session setup: stores session data server-side (default memory store here)
// In production, replace the default store with a persistent store.
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Mount admin-related routers
app.use("/admin/users", require("./routes/userRoutes"));
app.use("/admin/courses", require("./routes/courseRoutes"));
app.use("/admin/", require("./routes/admin.routes"));

// Dashboard route (simple authentication check)
app.get("/admin", (req, res) => {
  if (!req.user) {
    // If not authenticated, redirect to admin login
    return res.redirect("/admin/login");
  }
  // Render the dashboard view
  res.render("/dashboard");
});

// Make `user` available in all templates via `res.locals.user`
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Basic error / 404 handling
// Note: Express error handlers normally accept 4 args: (err, req, res, next)
// This handler checks for a token expiry special-case and otherwise renders
// a simple error page. Adjust behavior as needed for your app.
app.use((err, req, res, next) => {
  if (err && err.message === "TOKEN_EXPIRED") {
    return req.render("layouts/alert-redirect", {
      type: "error",
      title: "Session Expired",
      message: "Please login again.",
      redirect: "/admin/login",
    });
  }

  // Fallback: render an error page for missing routes or other errors
  return res.status(404).render("layouts/error", {
    message: "Page not found",
    path: req.originalUrl,
  });
});
// Start the HTTP server
const PORT = config.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
