"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, CheckCircle } from "lucide-react";

export default function PaymentUPIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientPaymentId = useRef(crypto.randomUUID());
  const amount = searchParams.get("amount");
  const lessons = searchParams.get("lessons");
  const packageId = searchParams.get("packageId");
  const tutorId = searchParams.get("tutorId");

  const [ready, setReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (!amount || !lessons) {
      router.replace("/courses-pricing");
      return;
    }
    setReady(true);
  }, [amount, lessons, router]);

  if (!ready) return null;

  const planName = `${lessons} Lessons Package`;
  const amountFormatted = Number(amount).toFixed(2);

  /* =====================
     📤 UPLOAD PAYMENT PROOF
  ====================== */

  const handleUploadProof = async () => {
    if (!selectedFile) {
      alert("Please upload payment screenshot");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      // 1️⃣ Log payment as PENDING
      const logRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/upi/log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tutorId,
            packageId,
            amount: Number(amountFormatted),
            lessons: Number(lessons),
            status: "PENDING",
            clientPaymentId: clientPaymentId.current,
          }),
        }
      );

      if (!logRes.ok) {
        const text = await logRes.text();
        throw new Error(
          `Failed to log payment (status ${logRes.status}). Check backend URL and auth.`
        );
      }

      const logData = await logRes.json();
      const paymentId = logData.payment?._id;

      if (!paymentId) {
        throw new Error("Payment logging failed");
      }

      // 2️⃣ Upload screenshot
      const formData = new FormData();
      formData.append("paymentImage", selectedFile);
      formData.append("paymentId", paymentId);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/upload-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        console.error("Failed to upload payment proof", uploadRes.status, text);
        throw new Error(
          `Failed to upload payment proof (status ${uploadRes.status}).`
        );
      }

      setUploaded(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/student/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment proof. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* =====================
     🧾 UI
  ====================== */

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

        <p className="text-sm text-gray-600">{planName}</p>

        {/* QR CODE */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <Image
            src="/upi-sc.jpeg"
            width={220}
            height={220}
            alt="UPI QR"
            priority
          />

          {/* PayPal link for international students */}
          <a
            href="https://paypal.me/aneesha3089"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold text-sm hover:underline"
          >
            Pay via PayPal (International Students)
          </a>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Open any UPI app and scan this QR to complete payment.
        </p>

        {/* UPLOAD SECTION */}
        <div className="mt-6">
          {!uploaded ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full mb-4 border p-2 rounded"
              />

              <button
                onClick={handleUploadProof}
                disabled={uploading || !selectedFile}
                className="w-full py-3 rounded-full bg-green-600 text-white
                           font-semibold disabled:opacity-50"
              >
                <Upload size={16} className="inline mr-2" />
                {uploading ? "Uploading..." : "Upload Payment Proof"}
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <CheckCircle size={18} />
              Proof uploaded! Awaiting admin approval.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
