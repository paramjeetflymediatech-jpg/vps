"use client";

import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

// 🔐 Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ❗ Centralized response error handling
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Network / no response
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else if (error.response.status === 401) {
      // Unauthorized — clear auth and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error(message || "Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default API;

