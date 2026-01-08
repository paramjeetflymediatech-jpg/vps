"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../assets/logo/logo.webp";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  /* 🔐 Check token */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  /* 🚪 Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    setOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src={Logo.src} alt="Logo" className="h-12" />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden lg:flex items-center gap-8 text-lg font-medium text-gray-800">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-[#0852A1]"
                : "hover:text-[#0852A1] transition-colors"
            }
          >
            Home
          </Link>

          <Link
            href="/tutors"
            className={
              pathname === "/tutors"
                ? "text-[#0852A1]"
                : "hover:text-[#0852A1] transition-colors"
            }
          >
            Meet your tutor
          </Link>

          <Link
            href="/organizations"
            className={
              pathname === "/organizations"
                ? "text-[#0852A1]"
                : "hover:text-[#0852A1] transition-colors"
            }
          >
            For Organizations
          </Link>

          <Link
            href="/become-tutor"
            className={
              pathname === "/become-tutor"
                ? "text-[#0852A1]"
                : "hover:text-[#0852A1] transition-colors"
            }
          >
            Become a tutor
          </Link>
        </nav>
        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden lg:flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className="bg-[#0852A1] text-white px-5 py-2 rounded-full"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="border border-[#0852A1] text-[#0852A1] px-5 py-2 rounded-full"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-3xl text-gray-700"
              >
                <FaUserCircle />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                  <Link
                    href="/student/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-3xl text-gray-800"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="lg:hidden bg-white shadow-md border-t animate-slide-down">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-lg">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/tutors" onClick={() => setOpen(false)}>
              Meet your tutor
            </Link>
            <Link href="/organizations" onClick={() => setOpen(false)}>
              For Organizations
            </Link>
            <Link href="/become-tutor" onClick={() => setOpen(false)}>
              Become a tutor
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="bg-[#0852A1] text-white py-2 rounded text-center"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="border border-[#0852A1] text-[#0852A1] py-2 rounded text-center"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link href="/student/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
