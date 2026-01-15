// app/payment/upi/PaymentUPIContent.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

export default function PaymentUPIContent() {
  const searchParams = useSearchParams();
  // Get your specific UPI params here
  const amount = searchParams.get("amount");
  const upiId = searchParams.get("upiId");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            Loading payment details...
          </div>
        </div>
      }
    >
      <div className="p-4">
        <h1 className="text-xl font-bold">Complete UPI Payment</h1>
        <p>Paying: ₹{amount}</p>
        {/* Rest of your UPI specific UI */}
      </div>
    </Suspense>
  );
}
