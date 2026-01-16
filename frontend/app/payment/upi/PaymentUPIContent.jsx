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

  /* =====================
     ✅ UPI CONFIG
  ====================== */

  const upiId = "nshpental-1@okaxis";
  const merchantName = "The English Raj";
  const planName = `${lessons} Lessons Package`;
  const amountFormatted = Number(amount).toFixed(2);

  const baseUpi =
    `upi://pay` +
    `?pa=${upiId}` +
    `&pn=${encodeURIComponent(merchantName)}` +
    `&am=${amountFormatted}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(planName)}`;

  // App-specific intent URLs
  const upiApps = [
    {
      name: "Google Pay",
      url: `intent://pay?${baseUpi.split("?")[1]}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`,
    },
    {
      name: "PhonePe",
      url: `intent://pay?${baseUpi.split("?")[1]}#Intent;scheme=upi;package=com.phonepe.app;end`,
    },
    {
      name: "Paytm",
      url: `intent://pay?${baseUpi.split("?")[1]}#Intent;scheme=upi;package=net.one97.paytm;end`,
    },
    {
      name: "Any UPI App",
      url: baseUpi,
    },
  ];

  const openUpiApp = (url) => {
    if (!isMobile) {
      alert("Please scan QR using your mobile UPI app.");
      return;
    }
    setPaymentInitiated(true);
    setTimeout(() => {
      window.location.href = url;
    }, 400);
  };

  /* =====================
     📤 PROOF UPLOAD
  ====================== */

  const handleUploadProof = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");

      const logRes = await fetch(
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

      const logData = await logRes.json();
      const paymentId = logData.payment?._id;

      const formData = new FormData();
      formData.append("paymentImage", selectedFile);
      formData.append("paymentId", paymentId);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/upload-proof`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      setUploaded(true);
      setTimeout(() => router.push("/student/dashboard"), 2000);
    } catch (err) {
      alert("Upload failed. Try again.");
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

        <div className="mt-5 flex justify-center">
          <Image src="/upi-qr.png" width={200} height={200} alt="UPI QR" />
        </div>

        {!paymentInitiated ? (
          <div className="mt-6 space-y-3">
            {upiApps.map((app) => (
              <button
                key={app.name}
                onClick={() => openUpiApp(app.url)}
                className="w-full py-3 rounded-full font-semibold bg-[#0852A1]
                           hover:bg-[#063c75] text-white transition"
              >
                Pay with {app.name}
              </button>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              If one app fails due to limit, try another UPI app.
            </p>
          </div>
        ) : (
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
                  {uploading ? "Uploading..." : "Upload Payment Proof"}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle size={18} />
                Proof uploaded. Redirecting...
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
