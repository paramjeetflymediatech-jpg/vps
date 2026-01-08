"use client";

import { usePathname } from "next/navigation";
import TutorLayout from "@/tutor/pages/TutorLayout";

export default function TutorRootLayout({ children }) {
  const pathname = usePathname();

  // Do not wrap the tutor login page with TutorLayout, so it can show even when not logged in
  if (pathname === "/tutor/login") {
    return children;
  }

  return <TutorLayout>{children}</TutorLayout>;
}
