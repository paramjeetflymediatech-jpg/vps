// import express from "express";
// import cors from "cors";
// import "./config/env.js";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/auth.routes.js";
// import otpRoutes from "./routes/otp.routes.js";
// import tutorRoutes from "./routes/tutor.routes.js";
// import bookingRoutes from "./routes/booking.routes.js";

// const app = express();

// /* ================== ENV ================== */
// const PORT = process.env.PORT || 5000;
// const NODE_ENV = process.env.NODE_ENV || "development";

// /* ================== MIDDLEWARE ================== */
// app.use(
//   cors({
//     origin:
//       NODE_ENV === "production"
//         ? ["https://theenglishraj.com", "https://www.theenglishraj.com"]
//         : "*",
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// /* ================== ROUTES ================== */
// app.use("/api/auth", authRoutes);
// app.use("/api/otp", otpRoutes);
// app.use("/api/tutors", tutorRoutes);
// app.use("/api/bookings", bookingRoutes);

// /* ================== HEALTH CHECK ================== */
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "🚀 English Raj Backend is Live",
//     environment: NODE_ENV,
//   });
// });

// /* ================== 404 HANDLER ================== */
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "❌ API route not found",
//   });
// });

// /* ================== START SERVER ================== */
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(
//         `🔥 Server running in ${NODE_ENV} mode on port ${PORT}`
//       );
//     });
//   } catch (error) {
//     console.error("❌ Server startup failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

import express from "express";
import cors from "cors";
import "./config/env.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================== CORS ================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.theenglishraj.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================== BODY PARSER ================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================== ROUTES ================== */
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/bookings", bookingRoutes);

/* ================== HEALTH ================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 EnglishRaj Backend is running",
  });
});

/* ================== GLOBAL ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR 👉", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================== START ================== */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
