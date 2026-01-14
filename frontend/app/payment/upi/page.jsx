"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpiPaymentPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // 🔹 UPI Details
  const upiId = "nshpental-1@okaxis";
  const name = "The English Raj";
  const amount = "499";
  const note = "Session Activation";

  // 🔹 Build UPI deep link
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // 🔹 Detect mobile device safely (client-only)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  // 🔹 Handle UPI click
  const handleUpiPay = () => {
    if (isMobile) {
      window.location.href = upiUrl;
    } else {
      alert("Please scan the QR code using your mobile UPI app.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center"
      >
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900">
          Scan & Pay
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          Complete payment to activate your session
        </p>

        {/* QR Code */}
        <div className="mt-6 flex justify-center">
          <Image
            src="/upi-qr.png"     // must be inside /public
            alt="UPI QR Code"
            width={220}
            height={220}
            priority
            className="rounded-lg"
          />
        </div>

        {/* UPI ID */}
        <p className="mt-4 text-sm font-medium text-gray-700">
          UPI ID:{" "}
          <span className="font-semibold text-gray-900">
            {upiId}
          </span>
        </p>

        {/* Pay Button */}
        <button
          onClick={handleUpiPay}
          className="mt-6 w-full
                     bg-[#0852A1] hover:bg-[#063F7C]
                     text-white py-3 rounded-full
                     text-sm font-semibold transition"
        >
          Pay via UPI App
        </button>

        {/* Helper Text */}
        {!isMobile && (
          <p className="mt-3 text-xs text-gray-500">
            On desktop? Scan the QR code using Google Pay, PhonePe, or Paytm.
          </p>
        )}

        {/* Cancel */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-xs text-gray-500 hover:underline"
        >
          Cancel & Go Back
        </button>
      </motion.div>
    </div>
  );
}
