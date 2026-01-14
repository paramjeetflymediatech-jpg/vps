"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpiPaymentClient({ amount, plan, tutorId }) {
  const router = useRouter();

  /* =========================
     🔹 DEVICE CHECK
     ========================= */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device for UPI deep linking
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  /* =========================
     🔹 UPI DETAILS
     ========================= */

  const upiId = "nshpental-1@okaxis";
  const name = "The English Raj";

  // ✅ UPI deep link (opens GPay / PhonePe / Paytm)
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(plan)}`;

  /* =========================
     🔹 PAYMENT HANDLERS
     ========================= */

  const handleUpiPay = () => {
    if (isMobile) {
      // ✅ Open UPI app on mobile
      window.location.href = upiUrl;

      // ✅ After intent, move user to success page
      // (real apps confirm from backend later)
      setTimeout(() => {
        router.push(`/payment-success?tutorId=${tutorId ?? ""}`);
      }, 3000);
    } else {
      // Desktop users must scan QR manually
      alert("Please scan the QR code using your mobile UPI app.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center"
      >
        {/* =========================
            HEADER
           ========================= */}
        <h1 className="text-xl font-bold">Scan & Pay</h1>
        <p className="text-sm text-gray-600 mt-1">{plan}</p>
        <p className="mt-2 text-lg font-bold text-[#0852A1]">
          ₹{amount}
        </p>

        {/* =========================
            QR CODE
           ========================= */}
        <div className="mt-6 flex justify-center">
          <Image
            src="/upi-qr.png"
            alt="UPI QR Code"
            width={220}
            height={220}
            priority
          />
        </div>

        <p className="mt-4 text-sm">
          UPI ID: <strong>{upiId}</strong>
        </p>

        {/* =========================
            PAY BUTTON
           ========================= */}
        <button
          onClick={handleUpiPay}
          className="mt-6 w-full bg-[#0852A1] hover:bg-[#063F7C]
                     text-white py-3 rounded-full font-semibold"
        >
          Pay via UPI App
        </button>

        {!isMobile && (
          <p className="mt-3 text-xs text-gray-500">
            Scan QR using Google Pay, PhonePe, or Paytm
          </p>
        )}

        {/* =========================
            CANCEL
           ========================= */}
        <button
          onClick={() => router.back()}
          className="mt-4 text-xs text-gray-500 hover:underline"
        >
          Cancel & Go Back
        </button>
      </motion.div>
    </div>
  );
}
