"use client";

import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.theenglishraj.com/api",
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
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const fallbackMessage = error.message || "Something went wrong";

    // Network / no response
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else if (status === 401) {
      // Unauthorized — clear auth and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error(backendMessage || "Session expired. Please login again.");
      window.location.href = "/login";
    } else if (status === 409) {
      // Conflict – server rejected the data (e.g. duplicate or invalid business state)
      toast.error(
        backendMessage ||
          "Could not save changes (409 Conflict). Please check your inputs or existing classes."
      );
    } else {
      toast.error(backendMessage || fallbackMessage);
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn("API error", {
        url: error.config?.url,
        method: error.config?.method,
        status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default API;

