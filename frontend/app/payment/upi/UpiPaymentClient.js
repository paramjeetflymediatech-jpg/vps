"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
<<<<<<<< HEAD:frontend/src/views/UpiPaymentClient.jsx
========
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
>>>>>>>> 554eb953dc02007d16d5b66a5869ef51e93908ce:frontend/app/payment/upi/UpiPaymentClient.js

export default function UpiPaymentClient({ amount, plan, tutorId }) {
  const router = useRouter();

<<<<<<<< HEAD:frontend/src/views/UpiPaymentClient.jsx
  // Query params
  const amount = searchParams.get("amount") || "0";
  const plan = searchParams.get("plan") || "Session Activation";
  const tutorId = searchParams.get("tutorId");

  // Mobile detection
========
  // Device check for mobile UPI deep link
>>>>>>>> 554eb953dc02007d16d5b66a5869ef51e93908ce:frontend/app/payment/upi/UpiPaymentClient.js
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
<<<<<<<< HEAD:frontend/src/views/UpiPaymentClient.jsx
    if (typeof window !== "undefined") {
========
    if (typeof navigator !== "undefined") {
>>>>>>>> 554eb953dc02007d16d5b66a5869ef51e93908ce:frontend/app/payment/upi/UpiPaymentClient.js
      setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  // UPI details
  const upiId = "nshpental-1@okaxis";
  const merchantName = "The English Raj";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(plan)}`;

  const handleUpiPay = () => {
<<<<<<<< HEAD:frontend/src/views/UpiPaymentClient.jsx
    if (!isMobile) {
========
    if (isMobile) {
      window.location.href = upiUrl;

      setTimeout(() => {
        router.push(`/payment-success?tutorId=${tutorId ?? ""}`);
      }, 3000);
    } else {
>>>>>>>> 554eb953dc02007d16d5b66a5869ef51e93908ce:frontend/app/payment/upi/UpiPaymentClient.js
      alert("Please scan the QR code using your mobile UPI app.");
      return;
    }

    // 1️⃣ Open UPI app
    window.location.href = upiUrl;

    // 2️⃣ Immediately redirect to payment-success (status pending)
    // Frontend does not assume success — backend will verify
    router.push(`/payment-success?tutorId=${tutorId}&amount=${amount}&status=pending`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center"
      >
        <h1 className="text-xl font-bold">Scan & Pay</h1>
        <p className="text-sm text-gray-600 mt-1">{plan}</p>
        <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{amount}</p>

        {/* QR Code */}
        <div className="mt-6 flex justify-center">
          <Image
            src="/upi-qr.png"
            width={220}
            height={220}
            alt="UPI QR Code"
            priority
          />
        </div>

        <p className="mt-4 text-sm">
          UPI ID: <strong>{upiId}</strong>
        </p>

        <button
          onClick={handleUpiPay}
          className="mt-6 w-full bg-[#0852A1] hover:bg-[#063F7C] text-white py-3 rounded-full font-semibold transition"
        >
          Pay via UPI App
        </button>

        <p className="mt-4 text-xs text-gray-500">
          After payment, please return to this page to enter your Transaction ID.
        </p>
      </motion.div>
    </div>
  );
}
