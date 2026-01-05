module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ielts_db",
  PORT: process.env.PORT || 5000,
  sessionSecret: process.env.SESSION_SECRET || "supersecretenglishraj",
  JWT_SECRET: process.env.JWT_SECRET || "thisisaverysecuresecretkeyforjwt",
  EMAIL_USER: process.env.EMAIL_USER || "amandeepkumar.flymediatech@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "gjyrzqgjwwwjflbu",
  EMAIL_PORT: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
  BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
