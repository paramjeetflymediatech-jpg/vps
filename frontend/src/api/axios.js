// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://theenglishraj-backend.onrender.com/api", // backend URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically (future use)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


// http://localhost:5000