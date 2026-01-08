"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../api/auth.api";
 
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
 
  const router = useRouter();
 
  const handleSendOtp = async (e) => {
    e.preventDefault();
 
    setError("");
    setSuccess("");
 
    if (!email) {
      setError("Email is required");
      return;
    }
 
    try {
      setLoading(true);
      await forgotPassword(email);
 
      setSuccess("OTP has been sent to your email");
 
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&purpose=forgot`);
      }, 800);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT PANEL (Brand / Trust) */}
      <div className="hidden lg:flex flex-col justify-center px-16  bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Secure access to <br /> your account
        </h1>
        <p className="text-neutral-400 mt-4 max-w-md text-white">
          Reset your password securely using a one-time verification code sent
          directly to your registered email address.
        </p>
 
        <div className="mt-10 space-y-4 text-sm text-neutral-300 text-white">
          <div>✔ Encrypted verification</div>
          <div>✔ No password stored</div>
          <div>✔ Secure OTP validation</div>
        </div>
      </div>
 
      {/* RIGHT PANEL (Form) */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-lg px-8 py-9">
 
          <h2 className="text-2xl font-semibold text-neutral-900">
            Forgot password
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enter your email to receive a verification code
          </p>
 
          {/* Alerts */}
          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
 
          {success && (
            <div className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
              {success}
            </div>
          )}
 
          {/* Form */}
          <form onSubmit={handleSendOtp} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-12 px-4 text-sm
                           rounded-md border border-neutral-300
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md text-sm font-semibold
                         bg-[#0852A1] text-white
                         hover:bg-[#387DC6] transition
                         disabled:opacity-60 disabled:cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send verification code"}
            </button>
          </form>
 
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-neutral-900 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default ForgotPassword;