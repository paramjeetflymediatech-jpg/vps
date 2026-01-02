import React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Star,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "120",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Active Courses",
    value: "6",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    title: "Sessions Today",
    value: "4",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    title: "Tutor Rating",
    value: "4.9",
    icon: Star,
    color: "bg-yellow-500",
  },
];

const upcomingSessions = [
  {
    student: "Aman Sharma",
    course: "Spoken English",
    time: "10:00 AM – 11:00 AM",
  },
  {
    student: "Neha Verma",
    course: "IELTS Prep",
    time: "12:30 PM – 1:30 PM",
  },
  {
    student: "Rohit Singh",
    course: "Business English",
    time: "4:00 PM – 5:00 PM",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Tutor 👋
          </p>
        </div>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="Tutor"
            className="w-10 h-10 rounded-full border"
          />
          <span className="font-medium">Tutor</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>
              <h2 className="text-3xl font-bold mt-1">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${item.color}`}
            >
              <item.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Sessions
        </h2>

        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500">
            No sessions scheduled today.
          </p>
        ) : (
          <ul className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <li
                key={index}
                className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {session.student}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session.course}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  {session.time}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
