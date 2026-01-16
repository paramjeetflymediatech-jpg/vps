// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function UpiContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const amount = searchParams?.get("amount"); // from CoursesPricing
//   const lessons = searchParams?.get("lessons");
//   const tutorId = searchParams?.get("tutorId");

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));

//     if (!amount || !lessons) {
//       alert("Lesson plan or amount missing!");
//       router.push("/courses-pricing"); // fallback
//     }
//   }, [amount, lessons, router]);

//   const upiId = "nshpental-1@okaxis";
//   const merchantName = "The English Raj";
//   const planName = `${lessons} Lessons Package`;

//   const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
//     merchantName
//   )}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;

//   const handleUpiPay = () => {
//     if (!isMobile) {
//       alert("Scan the QR code using your mobile UPI app.");
//       return;
//     }
//     window.location.href = upiUrl;

//     router.push(
//       `/payment/success?tutorId=${tutorId || ""}&amount=${amount}&status=pending`
//     );
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
//       >
//         <h1 className="text-xl font-bold">Scan & Pay</h1>
//         <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{amount}</p>
//         <p className="text-sm text-gray-600 mt-1">{planName}</p>
//         <div className="mt-6 flex justify-center">
//           <Image
//             src="/upi-qr.png"
//             width={220}
//             height={220}
//             alt="UPI QR"
//             priority
//           />
//         </div>
//         <button
//           onClick={handleUpiPay}
//           className="mt-6 w-full bg-[#0852A1] text-white py-3 rounded-full font-semibold"
//         >
//           Pay via UPI App
//         </button>
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, CheckCircle } from "lucide-react";

export default function PaymentUPIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount");
  const lessons = searchParams.get("lessons");
  const tutorId = searchParams.get("tutorId");

  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));

    if (!amount || !lessons) {
      router.replace("/courses-pricing");
      return;
    }

    setReady(true);
  }, [amount, lessons, router]);

  if (!ready) return null;

  const upiId = "nshpental-1@okaxis";
  const merchantName = "The English Raj";
  const planName = `${lessons} Lessons Package`;

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;

  const handleUpiPay = () => {
    if (!isMobile) {
      alert("Scan the QR code using your mobile UPI app.");
      return;
    }

    window.location.href = upiUrl;
    setPaymentInitiated(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProof = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      
      // First log the payment
      const logResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/upi/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId,
          amount: Number(amount),
          lessons: Number(lessons),
          status: "SUCCESS",
        }),
      });

      if (!logResponse.ok) {
        throw new Error("Failed to log payment");
      }

      const logData = await logResponse.json();
      const paymentId = logData.payment?._id;

      // Then upload the proof
      const formData = new FormData();
      formData.append("paymentImage", selectedFile);
      formData.append("paymentId", paymentId);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/upload-proof`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        setUploaded(true);
        setTimeout(() => {
          router.push("/payment-success");
        }, 2000);
      } else {
        alert("Failed to upload payment proof.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to process payment proof.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
      >
        <h1 className="text-xl font-bold">Scan & Pay</h1>

        <p className="mt-2 text-2xl font-extrabold text-[#0852A1]">
          ₹{amount}
        </p>

        <p className="text-sm font-medium text-gray-600 mt-1">
          {planName}
        </p>

        <div className="mt-6 flex justify-center">
          <Image
            src="/upi-qr.png"
            width={220}
            height={220}
            alt="UPI QR"
            priority
          />
        </div>

        {!paymentInitiated ? (
          <button
            onClick={handleUpiPay}
            className="mt-6 w-full bg-[#0852A1] hover:bg-[#063c75]
                       text-white py-3 rounded-full font-semibold transition"
          >
            Pay via UPI App
          </button>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Payment initiated! Please upload a screenshot of your payment confirmation.
            </p>
            
            {!uploaded ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleUploadProof}
                  disabled={!selectedFile || uploading}
                  className="w-full py-3 rounded-full font-semibold transition flex items-center justify-center gap-2
                           bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload Payment Proof"}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle size={20} />
                Proof uploaded! Redirecting...
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
