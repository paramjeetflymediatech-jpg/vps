import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    console.log("Mongo host:", mongoose.connection.host);
    console.log("Mongo name:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ DB Error", err.message);
    process.exit(1);
  }
};

export default connectDB;
