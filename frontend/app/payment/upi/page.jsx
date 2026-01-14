// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// export const dynamic = 'force-dynamic'; // <--- prevent pre-rendering


// export default function UpiPaymentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const amount = searchParams.get("amount") || "0";
//   const plan = searchParams.get("plan") || "Session Activation";

//   const [isMobile, setIsMobile] = useState(false);

//   const upiId = "nshpental-1@okaxis";
//   const name = "The English Raj";

//   const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
//     name
//   )}&am=${amount}&cu=INR&tn=${encodeURIComponent(plan)}`;

//   useEffect(() => {
//     setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
//   }, []);

//   const handleUpiPay = () => {
//     if (isMobile) {
//       window.location.href = upiUrl;
//     } else {
//       alert("Please scan the QR code using your mobile UPI app.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center"
//       >
//         <h1 className="text-xl font-bold">Scan & Pay</h1>

//         <p className="text-sm text-gray-600 mt-1">{plan}</p>
//         <p className="mt-2 text-lg font-bold text-[#0852A1]">
//           ₹{amount}
//         </p>

//         <div className="mt-6 flex justify-center">
//           <Image
//             src="/upi-qr.png"
//             alt="UPI QR Code"
//             width={220}
//             height={220}
//             priority
//           />
//         </div>

//         <p className="mt-4 text-sm">
//           UPI ID: <strong>{upiId}</strong>
//         </p>

//         <button
//           onClick={handleUpiPay}
//           className="mt-6 w-full bg-[#0852A1] hover:bg-[#063F7C]
//                      text-white py-3 rounded-full font-semibold"
//         >
//           Pay via UPI App
//         </button>

//         {!isMobile && (
//           <p className="mt-3 text-xs text-gray-500">
//             Scan QR using Google Pay, PhonePe, or Paytm
//           </p>
//         )}

//         <button
//           onClick={() => router.push("/")}
//           className="mt-4 text-xs text-gray-500 hover:underline"
//         >
//           Cancel & Go Back
//         </button>
//       </motion.div>
//     </div>
//   );
// }



"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic"; // ✅ Prevent pre-rendering (required for useSearchParams)

export default function UpiPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================
     🔹 QUERY PARAMS
     ========================= */

  // Amount passed from previous page
  const amount = searchParams.get("amount") || "0";

  // Payment description
  const plan = searchParams.get("plan") || "Session Activation";

  // ✅ NEW: tutorId needed for redirect after success
  const tutorId = searchParams.get("tutorId");

  /* =========================
     🔹 DEVICE CHECK
     ========================= */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device for UPI deep linking
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
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
        router.push(`/payment-success?tutorId=${tutorId}`);
      }, 3000);
    } else {
      // Desktop users must scan QR manually
      alert("Please scan the QR code using your mobile UPI app.");
    }
  };

  // ✅ Manual success (fallback / testing)
  const handleSuccess = () => {
    router.push(`/payment-success?tutorId=${tutorId}`);
  };

  // ✅ Manual failure
  const handleFailure = () => {
    router.push("/payment-failed");
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
            FALLBACK BUTTONS (DEV / DESKTOP)
           ========================= */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSuccess}
            className="w-full bg-green-600 text-white py-2 rounded-full text-sm font-bold"
          >
            Payment Successful
          </button>

          <button
            onClick={handleFailure}
            className="w-full bg-red-600 text-white py-2 rounded-full text-sm font-bold"
          >
            Payment Failed
          </button>
        </div>

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
