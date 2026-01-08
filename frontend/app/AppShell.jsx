"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();

  const isStudent = pathname.startsWith("/student");
  // Treat only /tutor and /tutor/... (not /tutors) as tutor dashboard area
  const isTutorSection =
    (pathname === "/tutor" || pathname.startsWith("/tutor/")) &&
    pathname !== "/tutor/login";

  if (isStudent || isTutorSection) {
    // Student and tutor dashboard pages manage their own layout (header/sidebar/footer)
    return children;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <main className="min-h-[80vh]">{children}</main>
      <Footer />
    </>
  );
}
