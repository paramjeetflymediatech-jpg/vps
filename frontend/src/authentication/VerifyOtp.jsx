"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { verifyOtp, resendOtp } from "@/api/otp.api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose") || "register";

  // ✅ HARD GUARD
  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp({
        email,
        otp,
        purpose,
      });

      if (purpose === "register") {
        toast.success("Email verified successfully. You can now log in.");
        router.push("/login");
      }

      if (purpose === "forgot") {
        toast.success("OTP verified. Please set your new password.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      }

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setResending(true);
      await resendOtp({ email });
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify OTP 🔢
        </h2>

        <p className="text-center text-sm text-gray-500 mb-4">
          OTP sent to <b>{email}</b>
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-lg px-4 py-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0852A1] text-white py-2 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Didn’t receive OTP?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-[#0852A1] font-medium disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        </p>

        <p className="text-center text-sm mt-4">
          <Link href="/login" className="text-[#0852A1] font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
