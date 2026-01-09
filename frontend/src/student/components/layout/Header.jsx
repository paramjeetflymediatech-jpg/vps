"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Menu,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const Header = ({ setSidebarOpen }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-8">
        <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between gap-3">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
            >
              <Menu size={22} className="text-gray-600" />
            </button>

            <div className="hidden lg:flex relative w-full max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl bg-gray-50 border border-transparent
                focus:bg-white focus:border-[#0852A1] focus:ring-4 focus:ring-blue-50 outline-none"
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 sm:gap-2 pr-3 border-r border-gray-100">
              <button className="p-2 rounded-xl hover:bg-blue-50 hover:text-[#0852A1] transition">
                <HelpCircle size={20} />
              </button>

              <button className="relative p-2 rounded-xl hover:bg-blue-50 hover:text-[#0852A1] transition">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#0852A1]">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] uppercase font-bold text-blue-600">
                  {user?.role || "STUDENT"}
                </p>
              </div>

                <div className="relative">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/150?u=guest"}
                    alt="Profile"
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl object-cover border-2 border-transparent
                    group-hover:border-[#0852A1] transition"
                  />
                </div>

                <ChevronDown
                  size={16}
                  className={`hidden md:block text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-xs font-bold"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-100
              focus:bg-white focus:border-[#0852A1] outline-none"
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>
    </header>
  );
};

export default Header;