import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/api/auth.api";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

      // Call forgot-password API which sends OTP
      await forgotPassword(email);

      setSuccess("OTP has been sent to your email");

      // Redirect to OTP verification page with email
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password 🔐
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your email to receive OTP
        </p>

        {error && (
          <p className="mb-3 text-sm text-red-600 text-center">{error}</p>
        )}
        {success && (
          <p className="mb-3 text-sm text-green-600 text-center">{success}</p>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0852A1] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0852A1] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Remember password?{" "}
          <Link to="/login" className="text-[#0852A1] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
