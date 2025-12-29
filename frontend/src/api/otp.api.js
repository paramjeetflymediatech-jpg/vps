import API from "./axios.instance";

export const verifyOtp = (data) => {
  return API.post("/auth/verify-otp", data);
};

export const resendOtp = (data) => {
  return API.post("/auth/resend-otp", data);
};
