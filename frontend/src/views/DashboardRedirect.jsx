"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (user.role === "tutor") {
      router.replace("/tutor/dashboard");
      return;
    }

    router.replace("/");
  }, [router]);

  return null;
};

export default DashboardRedirect;
