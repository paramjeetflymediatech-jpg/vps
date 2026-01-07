import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo/logo.webp";
import {
  Home,
  BookOpen,
  PlayCircle,
  Clock,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const menuItems = [
    { name: "My Dashboard", path: "/student/dashboard", icon: <Home size={20} /> },
    { name: "My Courses", path: "/student/courses", icon: <BookOpen size={20} /> },
    { name: "Live Sessions", path: "#", icon: <PlayCircle size={20} /> },
    { name: "Schedule", path: "#", icon: <Clock size={20} /> },
    { name: "Settings", path: "#", icon: <Settings size={20} /> },
  ];

  const activeStyle =
    "flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-[#0852A1] font-bold shadow-lg transition-all";
  const inactiveStyle =
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[70] w-72 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 flex flex-col shadow-2xl`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 bg-white p-1 rounded-lg" />
          <span className="text-xl font-black">STUDENT HUB</span>
        </div>

        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <X />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="p-4">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-sm font-bold">Rahul Sharma</p>
          <p className="text-xs text-white/50 mb-3">Student</p>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
