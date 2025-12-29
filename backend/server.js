import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import User from "./models/User.js";
import cors from "cors";


dotenv.config();
connectDB();

const app = express();

const whitelist = ['https://theenglishraj.com', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools / same-origin requests
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Dev-only: list users (no passwords)
if (process.env.NODE_ENV !== "production") {
  app.get("/api/debug/users", async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 });
      res.json({ success: true, users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
}

// Dev-only: list recent OTPs (helps debug OTP generation/expiry)
if (process.env.NODE_ENV !== "production") {
  app.get("/api/debug/otps", async (req, res) => {
    try {
      const otps = await (await import("./models/Otp.js")).default.find({}).sort({ createdAt: -1 }).limit(50);
      res.json({ success: true, otps });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
