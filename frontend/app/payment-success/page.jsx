"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Payment Successful 🎉",
      text: "Your session has been activated successfully.",
      confirmButtonColor: "#6335F8",
      confirmButtonText: "Go to My Classes",
      allowOutsideClick: false,
    }).then(() => {
      router.push("/student/myClass");
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF]">
      {/* Fallback UI (in case alert blocked) */}
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h1 className="text-xl font-bold text-gray-800">
          Payment Successful
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Redirecting you to your classes...
        </p>
      </div>
    </div>
  );
}
