"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logo/logo.webp";

import {
  Home,
  BookOpen,
  Package,
  LogOut,
  CalendarCheck,
  Menu,
  X,
  GraduationCap
} from "lucide-react";

const StudentSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: <Home size={18} /> },
    { name: "My Courses", path: "/student/courses", icon: <BookOpen size={18} /> },
    { name: "Packages", path: "/student/packages", icon: <Package size={18} /> },
    { name: "Book a Trial", path: "/student/myClass", icon: <CalendarCheck size={18} /> },
{ name: "Tutors", path: "/student/allTutors", icon: <GraduationCap size={18} /> },
  ];

  const baseStyle = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1";
  const activeStyle = "bg-white/20 text-white font-bold border-l-4 border-white shadow-inner";
  const inactiveStyle = "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      {/* Added 'top-0' and 'z-[60]' to stay above everything */}
      <div className="md:hidden fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
        <div className="flex items-center justify-between p-3 px-5">
          <div className="flex items-center gap-3">
            <img
              src={logo.src}
              alt="Logo"
              className="w-8 h-8 bg-white p-1 rounded-lg object-contain"
            />
            <span className="text-sm font-black tracking-tight text-white uppercase">
              Student Hub
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ================= OVERLAY (MOBILE) ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-[80] 
        w-[280px] sm:w-[320px] md:w-72 
        bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col shadow-2xl`}
      >
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between p-6 flex-shrink-0">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src={logo.src}
              alt="Logo"
              className="w-10 h-10 bg-white p-1 rounded-lg shadow-md"
            />
            <span className="text-xl font-black text-white tracking-tighter">
              STUDENT HUB
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* ---------- MENU (Scrollable) ---------- */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`${baseStyle} ${
                pathname === item.path ? activeStyle : inactiveStyle
              }`}
            >
              {item.icon}
              <span className="text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* ---------- PROFILE (Bottom) ---------- */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex flex-col gap-1 mb-3">
              <p className="text-sm font-bold text-white truncate">
                {user?.name || "Student User"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                {user?.role || "Student Account"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5
              rounded-xl bg-red-500 hover:bg-red-600 text-white
              transition-all text-xs font-bold shadow-lg"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;