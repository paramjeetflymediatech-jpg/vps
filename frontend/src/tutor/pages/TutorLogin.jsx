"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { tutorLogin } from "@/api/tutorApi";

const TutorLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await tutorLogin({ email, password, role: "TUTOR" });

      // Store token in a common key so all APIs (axios.instance) can use it
      localStorage.setItem("token", res.data.token);
      // Optionally keep a tutor-specific token as well
      localStorage.setItem("tutorToken", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/tutor/dashboard");
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message === "Please verify your email first"
      ) {
        router.push(`/register-otp?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
      {/* LEFT INFO PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">Tutor Login</h1>
        <p className="mt-4  max-w-md text-lg text-white">
          Access your dashboard, manage your classes, and track student progress
          easily.
        </p>
        <div className="mt-10 space-y-3 text-lg text-white">
          <div>✔ Manage your classes efficiently</div>
          <div>✔ Track student progress</div>
          <div>✔ Access anytime, anywhere</div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900 text-center">
            Login as Tutor
          </h2>
          <p className="text-sm text-neutral-500 mt-1 mb-5 text-center">
            Enter your credentials to access your dashboard
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 text-sm border border-neutral-300 rounded-full
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:shadow-md"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-12 px-4 text-sm border border-neutral-300 rounded-full pr-10
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-4/ text-neutral-500 hover:text-neutral-800"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#0852A1] text-white font-semibold
                         hover:bg-[#387DC6] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login as Tutor"}
            </button>
          </form>

          {/* FOOTER LINK */}
        <p className="text-center text-sm text-neutral-600 mt-6">
            Want to become a tutor?{" "}
            <Link
              href="/become-tutor"
              className="font-medium text-neutral-900 hover:underline"
            >
              Apply here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;
