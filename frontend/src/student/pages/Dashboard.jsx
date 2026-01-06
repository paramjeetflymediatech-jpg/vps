import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Overlay logic usually handled inside Sidebar component */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <div className="flex items-center md:block">
           {/* Mobile Menu Trigger (Only visible on mobile) */}
           <button 
             onClick={() => setSidebarOpen(true)}
             className="ml-4 md:hidden p-2 rounded-lg bg-[#0852A1] text-white"
           >
             <Menu size={20} />
           </button>
           <Header />
        </div>

        {/* Dashboard Content Area */}
        <main className="p-4 md:p-8 space-y-8 flex-1">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome, Rahul 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              You've reached <b className="text-[#0852A1] font-black">85%</b> of your weekly goal. Keep it up!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  {s.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Placeholders for future sections like Recent Activity or My Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white h-64 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 font-bold border-dashed">
                Weekly Progress Chart
             </div>
             <div className="bg-white h-64 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 font-bold border-dashed">
                Upcoming Classes
             </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;