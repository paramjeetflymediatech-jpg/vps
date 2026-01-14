"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpiPaymentClient({ amount, plan, tutorId }) {
  const router = useRouter();

  // Device check for mobile UPI deep link
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  // UPI details
  const upiId = "nshpental-1@okaxis";
  const name = "The English Raj";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(plan)}`;

  const handleUpiPay = () => {
    if (isMobile) {
      window.location.href = upiUrl;

      setTimeout(() => {
        router.push(`/payment-success?tutorId=${tutorId ?? ""}`);
      }, 3000);
    } else {
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
        <h1 className="text-xl font-bold">Scan & Pay</h1>
        <p className="text-sm text-gray-600 mt-1">{plan}</p>
        <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{amount}</p>

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

        <button
          onClick={handleUpiPay}
          className="mt-6 w-full bg-[#0852A1] hover:bg-[#063F7C]
                     text-white py-3 rounded-full font-semibold"
        >
          Pay via UPI App
        </button>
      </motion.div>
    </div>
  );
}
