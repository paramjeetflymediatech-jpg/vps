"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { verifyOtp, resendOtp } from "@/api/otp.api";
 
const RegisterOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const inputsRef = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
 
  const email = searchParams.get("email");
 
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
 
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };
 
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
 
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
 
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }
 
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
 
    try {
      setLoading(true);
      await verifyOtp({ email, otp: finalOtp });
      router.push("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
 
  const handleResend = async () => {
    try {
      await resendOtp({ email });
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT INFO PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Verify your email
        </h1>
        <p className="mt-4 text-neutral-400 max-w-md text-white">
          We’ve sent a one-time verification code to your email address.
          Enter the code below to complete your registration securely.
        </p>
 
        <div className="mt-10 space-y-3 text-sm text-neutral-300 text-white">
          <div>✔ One-time secure verification</div>
          <div>✔ No password shared</div>
          <div>✔ Fast account activation</div>
        </div>
      </div>
 
      {/* RIGHT OTP PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
 
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">
            Enter verification code
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Code sent to <span className="font-medium">{email}</span>
          </p>
 
          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
 
          {/* OTP FORM */}
          <form onSubmit={handleVerify} className="mt-7 space-y-6">
 
            {/* OTP INPUTS */}
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-lg font-semibold
           border border-neutral-300 rounded-lg
           shadow-sm
           focus:outline-none
           focus:ring-1 focus:ring-neutral-900
           focus:border-neutral-900
           focus:shadow-md
           transition"
                />
              ))}
            </div>
 
            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md
                       bg-[#0852A1] text-white text-sm font-semibold
                         hover:bg-[#387DC6] transition
                         disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
          </form>
 
          {/* RESEND */}
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-neutral-900 hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default RegisterOtp;