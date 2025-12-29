import API from "./axios.instance";

/* ================= VERIFY OTP ================= */
export const verifyOtp = (data) => {
  // email, otp
  return API.post("/auth/verify-otp", data);
};

/* ================= RESEND OTP ================= */
export const resendOtp = (data) => {
  // email
  return API.post("/auth/resend-otp", data);
};
