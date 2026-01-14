import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"; // 1. Path import karein
import { fileURLToPath } from "url"; // ES Modules mein __dirname ke liye
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.routes.js";
import courseRoutes from "./routes/course.routes.js";
import classRoutes from "./routes/class.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";


// ES Modules mein __dirname setup (Zaroori hai uploads folder access karne ke liye)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  process.env.BACKEND_URL || "http://localhost:8000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

/* ================= MIDDLEWARE ================= */
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Limit thodi kam kar sakte hain
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 2. Uploads folder ko STATIC banayein (Taki image URL kaam kare)
// Ab image ka link hoga: http://localhost:8000/uploads/filename.png
app.use("/uploads", express.static("public/uploads"));

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("Backend LIVE from VPS 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payment", paymentRoutes);


/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

startServer();
