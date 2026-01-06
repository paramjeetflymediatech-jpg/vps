import React from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo/logo.webp";

import { 
  Home, 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Settings,
  LogOut,
  X // Mobile close button ke liye
} from "lucide-react";

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "My Dashboard", path: "/student/dashboard", icon: <Home size={20} /> },
    { name: "My Courses", path: "/student/courses", icon: <BookOpen size={20} /> },
    { name: "Live Sessions", path: "/student/live", icon: <PlayCircle size={20} /> },
    { name: "Schedule", path: "/student/schedule", icon: <Clock size={20} /> },
    { name: "Settings", path: "/student/settings", icon: <Settings size={20} /> },
  ];

  const activeStyle = "flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-[#0852A1] font-bold shadow-lg shadow-blue-900/20 transform scale-105 transition-all duration-300";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200";

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[70] w-72 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 flex flex-col shadow-2xl md:shadow-none
    `}>
      
      {/* Brand & Close Button */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-contain bg-white p-1"
          />
          <span className="text-xl font-black tracking-tight">
            STUDENT HUB
          </span>
        </div>

        {/* Mobile Close Icon - Only visible on mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
        <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold px-2 mb-4">
          Learning Menu
        </p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)} // Mobile par click karte hi menu band ho jaye
            className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Student Profile Card (Sidebar Bottom) */}
      <div className="p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?u=student" 
                className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover" 
                alt="Student" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-indigo-600 rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Rahul Sharma</p>
              <p className="text-[10px] text-white/50">Level 4 Learner</p>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-all text-xs font-bold">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;