"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function PaymentFailedPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Payment Failed ❌",
      text: "Your payment could not be completed. Please try again.",
      confirmButtonText: "Try Again",
      allowOutsideClick: false,
    }).then(() => {
      router.push("/"); // or /payment /student/myClass
    });
  }, [router]);

  return null;
}
