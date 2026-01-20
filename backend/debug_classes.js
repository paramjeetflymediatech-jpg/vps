import mongoose from "mongoose";
import dotenv from "dotenv";
import Class from "./models/class.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const now = new Date();
    console.log("Current Time:", now);

    // 1. Fetch ALL classes (raw)
    const allClasses = await Class.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.log("\n--- TRULY LATEST 5 CLASSES (by createdAt) ---");
    allClasses.forEach((c) => {
      console.log(
        `ID: ${c._id}, Title: "${c.title}", Status: ${c.status}, Start: ${c.startDate}, End: ${c.endDate}, CreatedAt: ${c.createdAt}`,
      );
    });

    // 2. Fetch using Student Controller Logic
    // Student logic: sort({ startDate: 1 })
    const filter = {
      status: { $in: ["UPCOMING", "ONGOING"] },
      endDate: { $gte: now },
    };

    const studentClasses = await Class.find(filter)
      .sort({ startDate: 1 })
      .limit(100) // Fetch more to query
      .lean();

    console.log(
      "\n--- STUDENT CONTROLLER QUERY RESULTS (Top 5 by startDate) ---",
    );
    studentClasses.slice(0, 5).forEach((c) => {
      console.log(`ID: ${c._id}, Title: "${c.title}", Start: ${c.startDate}`);
    });

    // 3. Check for specific problematic class
    if (allClasses.length > 0) {
      const latest = allClasses[0];
      console.log(`\nChecking Latest Class: "${latest.title}"`);
      console.log(`ID: ${latest._id}`);
      console.log(`Created At: ${latest.createdAt}`);
      console.log(`Start Date: ${latest.startDate}`);
      console.log(`End Date:   ${latest.endDate}`);
      console.log(`Status:     ${latest.status}`);

      const isIncluded = studentClasses.find(
        (c) => c._id.toString() === latest._id.toString(),
      );
      if (!isIncluded) {
        console.log(`\n[FAIL] Class NOT in student list.`);

        const isStatusOk = ["UPCOMING", "ONGOING"].includes(latest.status);
        const isDateOk = new Date(latest.endDate) >= now;

        console.log(
          `Status Check: ${isStatusOk ? "PASS" : "FAIL"} (Value: ${latest.status})`,
        );
        console.log(
          `Date Check:   ${isDateOk ? "PASS" : "FAIL"} (End: ${latest.endDate} vs Now: ${now})`,
        );
      } else {
        console.log("\n[PASS] Class IS in the student list.");
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
