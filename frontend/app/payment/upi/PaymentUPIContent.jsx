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

  /* =========================
     ✅ SAFE UPI CONFIG
  ========================== */

  const upiId = "nshpental-1@okaxis";
  const merchantName = "The English Raj";
  const planName = `${lessons} Lessons Package`;

  // IMPORTANT: amount must be decimal
  const amountFormatted = Number(amount).toFixed(2);

  const upiUrl =
    `upi://pay` +
    `?pa=${upiId}` +
    `&pn=${encodeURIComponent(merchantName)}` +
    `&am=${amountFormatted}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(planName)}` +
    `&mode=02` +
    `&orgid=000000`;

  /* =========================
     🟢 HANDLE PAYMENT
  ========================== */

  const handleUpiPay = () => {
    if (!isMobile) {
      alert("Scan the QR code using your mobile UPI app.");
      return;
    }

    setPaymentInitiated(true);

    // Delay avoids Google Pay blocking
    setTimeout(() => {
      window.location.href = upiUrl;
    }, 500);
  };

  /* =========================
     📤 HANDLE FILE UPLOAD
  ========================== */

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProof = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token");

      /* 1️⃣ LOG PAYMENT */
      const logResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/upi/log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tutorId,
            amount: Number(amountFormatted),
            lessons: Number(lessons),
            status: "PENDING",
          }),
        }
      );

      if (!logResponse.ok) {
        throw new Error("Payment log failed");
      }

      const logData = await logResponse.json();
      const paymentId = logData.payment?._id;

      /* 2️⃣ UPLOAD PROOF */
      const formData = new FormData();
      formData.append("paymentImage", selectedFile);
      formData.append("paymentId", paymentId);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/upload-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      setUploaded(true);

      setTimeout(() => {
        router.push("/student/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to upload payment proof");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     🧾 UI
  ========================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
      >
        <h1 className="text-xl font-bold">Scan & Pay</h1>

        <p className="mt-2 text-2xl font-extrabold text-[#0852A1]">
          ₹{amountFormatted}
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
              Payment initiated. Upload payment screenshot for verification.
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
                  className="w-full py-3 rounded-full font-semibold transition
                             flex items-center justify-center gap-2
                             bg-green-600 hover:bg-green-700 text-white
                             disabled:opacity-50 disabled:cursor-not-allowed"
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
