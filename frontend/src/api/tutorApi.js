import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= APPLY TUTOR ================= */
export const applyTutorApi = (data) => {
  return API.post("/tutor/apply", data);
};

/* ================= TUTOR LOGIN ================= */
export const tutorLogin = (data) => {
  return API.post("/tutor/login", data);
};


