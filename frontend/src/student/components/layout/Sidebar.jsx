"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const StudentSidebar = ({ sidebarOpen, setSidebarOpen, open, setOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const isOpen = typeof open === "boolean" ? open : sidebarOpen;
  const setIsOpen = typeof setOpen === "function" ? setOpen : setSidebarOpen;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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
      name: "Live Classes",
      path: null,
      icon: <PlayCircle size={18} />,
    },
    {
      name: "Schedule",
      path: null,
      icon: <Clock size={18} />,
    },
    {
      name: "Settings",
      path: null,
      icon: <Settings size={18} />,
    },
  ];

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all";

  const activeStyle =
    "bg-white/20 text-white font-bold border-l-4 border-white";

  const inactiveStyle =
    "text-white/70 hover:bg-white/10 hover:text-white";

  const disabledStyle =
    "text-white/40 cursor-not-allowed opacity-60";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[70] w-72
      bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 flex flex-col shadow-2xl`}
    >
      {/* LOGO */}
      {/* <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 bg-white p-1 rounded-lg"
          />
          <span className="text-lg font-black text-white">
            STUDENT HUB
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-white"
        >
          <X />
        </button>
      </div> */}


      {/* LOGO */}
<div className="p-6 flex items-center justify-between">
  <Link
    href="/"
    className="flex items-center gap-3"
    onClick={() => setIsOpen(false)}
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
</div>


      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) =>
          item.path ? (
            <Link
              key={index}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`${baseStyle} ${
                pathname.startsWith(item.path) ? activeStyle : inactiveStyle
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          ) : (
            <div
              key={index}
              className={`${baseStyle} ${disabledStyle}`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          )
        )}
      </nav>

      {/* PROFILE + LOGOUT */}
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
            transition-all text-xs font-bold cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
