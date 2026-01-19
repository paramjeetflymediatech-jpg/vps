"use client";

import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  GraduationCap,
  X,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/assets/logo/logo.webp";

const TutorLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("tutorToken") || localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    const parsedUser = userRaw ? JSON.parse(userRaw) : null;

    const isTutor =
      parsedUser?.role && parsedUser.role.toLowerCase() === "tutor";

    if (!token || !isTutor) {
      router.replace("/tutor/login");
    } else {
      setUser(parsedUser);
      setCheckingAuth(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("tutorToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/tutor/login");
  };

  // Active Link Styling
  const activeLink =
    "flex items-center gap-3 px-4 py-3 rounded bg-white text-[#0852A1] font-semibold transition-all shadow-sm";
  const normalLink =
    "flex items-center gap-3 px-4 py-3 rounded text-white hover:bg-white/10 transition-all";

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Checking tutor session...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MOBILE OVERLAY - Jab sidebar khulega to piche ka screen dark ho jayega */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed md:sticky inset-y-0 md:top-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 flex flex-col min-h-screen md:h-screen
      `}
      >
        {/* Logo Section - Centered */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center md:justify-center">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center"
            >
              <img
                src={Logo.src}
                alt="Logo"
                className="w-32 cursor-pointer hover:opacity-90 transition"
              />
            </Link>

            {/* Close Button (Mobile Only) */}
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link
            href="/tutor/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={
              pathname === "/tutor" || pathname === "/tutor/dashboard"
                ? activeLink
                : normalLink
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link
            href="/tutor/packages"
            onClick={() => setSidebarOpen(false)}
            className={
              pathname.startsWith("/tutor/packages") ? activeLink : normalLink
            }
          >
            <BookOpen size={20} /> Packages
          </Link>

          <Link
            href="/tutor/classes"
            onClick={() => setSidebarOpen(false)}
            className={
              pathname.startsWith("/tutor/classes") ? activeLink : normalLink
            }
          >
            <GraduationCap size={20} /> My Courses
          </Link>

          <Link
            href={`/tutor/profile/${user.id}`}
            onClick={() => setSidebarOpen(false)}
            className={
              pathname.startsWith("/tutor/profile") ? activeLink : normalLink
            }
          >
            <User size={20} /> Profile
          </Link>
        </nav>

        {/* Logout Button at Bottom - Always Visible */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded bg-red-500/20 text-white hover:bg-red-500/30 transition-all font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
              Tutor Panel
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700 leading-none">
                {user?.name || "Tutor"}
              </span>
              <span className="text-xs text-gray-500">
                {user?.role || "TUTOR"}
              </span>
            </div>
            <img
              src={user?.avatar || "no image"}
              alt="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#0852A1]/20"
            />

            <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden lg:block text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
