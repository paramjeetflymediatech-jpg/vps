"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth.api";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // import the CSS

const Register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "", // phone includes country code automatically
    password: "",   // ✅ ADD THIS

  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in name field
    if (name === 'name') {
      // Only allow letters and spaces
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, '');
      setForm((prev) => ({ ...prev, [name]: onlyLetters }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle phone separately
  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate name - no numbers allowed
    if (form.name.length < 3) {
      toast.error("Name must be at least 3 characters long");
      setLoading(false);
      return;
    }

    if (/\d/.test(form.name)) {
      toast.error("Name cannot contain numbers");
      setLoading(false);
      return;
    }

    if (form.password.length < 5) {
      toast.error("Password must be at least 5 characters long");
      setLoading(false);
      return;
    }

    try {
      await registerUser(form);

      router.push(`/register-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Create your account
        </h1>
        <p className="mt-4 text-neutral-400 max-w-md text-white">
          Join thousands of learners improving their English with structured
          lessons, expert tutors, and real-world practice.
        </p>

        <div className="mt-10 space-y-3 text-lg text-neutral-300 text-white">
          <div>✔ Personalized learning path</div>
          <div>✔ Verified tutors</div>
          <div>✔ Progress tracking</div>
        </div>
      </div>

      {/* RIGHT REGISTER PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">

          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">
            Sign up
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Create an account to get started
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Your Full Name"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone number
              </label>

              <div className="flex">
                <PhoneInput
                  defaultCountry="in" // default India
                  value={form.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    required: true,
                    placeholder: "Enter Your Phone Number",
                  }}
                  className="w-full"
                  inputClassName="!w-full !h-12 !text-sm !border-neutral-300
                      focus:!ring-2 focus:!ring-neutral-900
                      rounded-r-md" // rounded only on right side
                  buttonClassName="!h-12 !rounded-l-md !border !border-neutral-300" // fix country code dropdown
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 text-sm
                             border border-neutral-300 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-neutral-900
                             focus:border-neutral-900"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
