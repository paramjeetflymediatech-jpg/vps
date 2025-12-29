import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "@/api/otp.api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;
  const purpose = state?.purpose || "register";

  // ✅ HARD GUARD
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

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

      // REGISTER FLOW → LOGIN
      if (purpose === "register") {
        navigate("/login");
      }

      // FORGOT FLOW → RESET PASSWORD
      if (purpose === "forgot") {
        navigate("/reset-password", {
          state: { email, otp },
        });
      }

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      alert("OTP resent successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to resend OTP");
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
            onClick={handleResend}
            className="text-[#0852A1] font-medium"
          >
            Resend
          </button>
        </p>

        <p className="text-center text-sm mt-4">
          <Link to="/login" className="text-[#0852A1] font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
