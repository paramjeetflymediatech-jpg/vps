import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  Calendar,
  ArrowUpRight,
  Menu
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: "Completed", value: "12", icon: <BookOpen />, bg: "bg-blue-50 text-blue-600" },
    { label: "Hours", value: "128h", icon: <Clock />, bg: "bg-orange-50 text-orange-600" },
    { label: "Points", value: "2,450", icon: <Trophy />, bg: "bg-yellow-50 text-yellow-600" },
    { label: "Streak", value: "8 Days", icon: <Star />, bg: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-8 space-y-8">

        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-[#0852A1] text-white"
          >
            <Menu />
          </button>
          <h1 className="font-bold">Dashboard</h1>
        </div>

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Welcome, Rahul 👋
          </h1>
          <p className="text-slate-500 mt-1">
            You've reached <b className="text-[#0852A1]">85%</b> of your weekly goal.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm border"
            >
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-xs uppercase text-gray-400 font-bold">
                {s.label}
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {s.value}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
