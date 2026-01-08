"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Calendar, Star, Clock } from "lucide-react";

const stats = [
  { title: "Total Students", value: 120, icon: Users, color: "bg-blue-500" },
  { title: "Active Classes", value: 6, icon: BookOpen, color: "bg-green-500" },
  { title: "Sessions Today", value: 4, icon: Calendar, color: "bg-purple-500" },
  { title: "Tutor Rating", value: "4.9★", icon: Star, color: "bg-yellow-500" },
];

const sessions = [
  { student: "Aman Sharma", course: "Spoken English", time: "10:00 – 11:00" },
  { student: "Neha Verma", course: "IELTS Prep", time: "12:30 – 1:30" },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{s.title}</p>
            <h2 className="text-3xl font-bold mt-2">{s.value}</h2>
          </div>
        ))}
      </section>

      {/* WELCOME SECTION */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user?.name || "Tutor"} 👋
        </h2>
        <p className="text-gray-600">
          Manage your classes, track student progress, and build your teaching profile.
        </p>
      </section>

      {/* UPCOMING SESSIONS */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>

        <ul className="space-y-4">
          {sessions.map((s, i) => (
            <li
              key={i}
              className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium">{s.student}</p>
                <p className="text-sm text-gray-500">{s.course}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} /> {s.time}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
