import API from "./axios.instance";
/* ================= APPLY TUTOR ================= */
export const applyTutorApi = (data) => {
  return API.post("/tutor/apply", data);
};

/* ================= TUTOR LOGIN ================= */
export const tutorLogin = (data) => {
  return API.post("/auth/login", data);
};


