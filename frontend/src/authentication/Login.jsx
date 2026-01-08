import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginUser } from "@/api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  const role = "STUDENT"; // ✅ ADD THIS

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({
        email,
        password,
        role, // ✅ SENT TO API
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (!res.data?.token) {
        throw new Error("Token not received");
      }

      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message === "Please verify your email first"
      ) {
        navigate("/register-otp", { state: { email } });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">Welcome back.</h1>
        <p className="mt-4 text-neutral-400 max-w-md text-white">
          Sign in to manage your account, track activity, and access your
          dashboard securely.
        </p>

        <div className="mt-10 space-y-3 text-lg text-neutral-500 text-white">
          <div>✔ Secure authentication</div>
          <div>✔ Encrypted credentials</div>
          <div>✔ Trusted by professionals</div>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">Sign in</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enter your credentials to continue
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md
                        bg-[#0852A1] text-white
                         hover:bg-[#387DC6] text-sm font-semibold
                         transition
                         disabled:opacity-60  cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-neutral-900 hover:underline"
            >
              Create account
            </Link>
          </p>

          <button
            onClick={() => navigate("/tutor/login")}
            className="block mx-auto mt-4 text-lg font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            Login as Tutor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
