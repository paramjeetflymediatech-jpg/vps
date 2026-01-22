"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const tutorId = searchParams.get("tutorId");
    const amountParam = searchParams.get("amount");
    const lessonsParam = searchParams.get("lessons");
    const packageId = searchParams.get("packageId");

    const amount = amountParam ? Number(amountParam) : undefined;
    const finalStatus =
      statusParam === "failed" || statusParam === "FAILED"
        ? "FAILED"
        : "SUCCESS";

    const logAndRedirect = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token && amount) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/upi/log`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                tutorId,
                amount,
                lessons: lessonsParam ? Number(lessonsParam) : undefined,
                status: finalStatus,
                packageId,
              }),
            },
          );
        }
      } catch (err) {
        console.error("Failed to log payment", err);
      } finally {
        if (finalStatus === "FAILED") {
          router.replace("/payment-failed");
        } else {
          router.replace("/payment-success");
        }
      }
    };

    logAndRedirect();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-gray-600">Processing payment result...</p>
    </div>
  );
}
