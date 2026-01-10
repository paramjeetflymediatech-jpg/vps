"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logo/logo.webp";

import {
  Home,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const StudentSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- SIDEBAR STATE ---------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------------- USER STATE ---------------- */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : {});
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  /* ---------------- MENU ---------------- */
  const menuItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <Home size={18} />,
    },
    {
      name: "My Courses",
      path: "/student/courses",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Packages",
      path: "/student/packages",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Book a Trial",
      path: "/student/myClass",
      icon: <Home size={18} />,
    },
    {
      name: "Tutors",
      path: "/student/allTutors",
      icon: <BookOpen size={18} />,
    },
  ];

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all";

  const activeStyle =
    "bg-white/20 text-white font-bold border-l-4 border-white";

  const inactiveStyle =
    "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <>
     {/* ================= MOBILE MENU BUTTON ================= */}
<div className="md:hidden fixed top-4 left-4 z-50">
  <button
    onClick={() => setSidebarOpen(true)}
    className="p-2 rounded-lg
    bg-gradient-to-r from-blue-600 to-purple-600
    text-white shadow-lg"
  >
    <Menu size={26} />
  </button>
</div>


      {/* ================= OVERLAY (MOBILE) ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72
        bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col shadow-2xl`}
      >
        {/* ---------- HEADER ---------- */}
        <div className="p-6 flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src={logo.src}
              alt="Logo"
              className="w-10 h-10 bg-white p-1 rounded-lg"
            />
            <span className="text-lg font-black text-white">
              STUDENT HUB
            </span>
          </Link>

          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* ---------- MENU ---------- */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`${baseStyle} ${
                pathname.startsWith(item.path)
                  ? activeStyle
                  : inactiveStyle
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* ---------- PROFILE ---------- */}
        <div className="p-4">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-sm font-bold text-white">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-white/50 mb-3">
              {user?.role || "STUDENT"}
            </p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2
              rounded-xl bg-red-500/20 text-red-100
              hover:bg-red-500 hover:text-white
              transition-all text-xs font-bold"
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
