"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const StudentLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    const isStudent = user?.role && user.role.toLowerCase() === "student";

    if (!token || !isStudent) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router, pathname]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Checking student session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* HEADER */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
};

export default StudentLayout;
