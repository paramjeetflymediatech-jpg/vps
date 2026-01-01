import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";


dotenv.config();

const app = express();

/* ================= CORS (MUST BE FIRST) ================= */
/* ================= CORS (MUST BE FIRST) ================= */
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.BACKEND_URL || "http://localhost:8000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/", (req, res) => {
  res.send("Backend LIVE from VPS 🚀");
});

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
console.log("✅ Tutor routes loaded");
app.use("/api/tutor", tutorRoutes);


/* ================= START SERVER ================= */
const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
};

startServer();
