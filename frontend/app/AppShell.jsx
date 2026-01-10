"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearningGoal from "@/components/LearningGoal";
import Testimonials from "@/views/Testimonials";

export default function AppShell({ children }) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTutors = pathname === "/tutors";

  const isStudent = pathname.startsWith("/student");

  // Only /tutor or /tutor/... (NOT /tutors)
  const isTutorSection =
    (pathname === "/tutor" || pathname.startsWith("/tutor/")) &&
    pathname !== "/tutor/login";

  // Dashboards manage their own layout
  if (isStudent || isTutorSection) {
    return children;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Header />

      <main className="min-h-[80vh]">
        {children}
      </main>

      {/* 👉 Learning Goal ONLY on Home */}
      {isHome && <LearningGoal />}

      {/* 👉 Testimonials on Home + Tutors */}
      {(isHome || isTutors) && <Testimonials />}

      <Footer />
    </>
  );
}
