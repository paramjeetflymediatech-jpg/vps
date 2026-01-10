import API from "./axios.instance";

/* ================= STUDENT: CLASSES / ENROLLMENT ================= */
// Wrap existing /student routes; optional params (e.g. { tutorId })
export const getStudentClasses = (params) =>
  API.get("/student/classes", { params });
export const enrollInBatch = (data) => API.post("/student/enroll", data);

/* ================= STUDENT: PACKAGES (READ-ONLY) ================= */
// List all published packages
export const getStudentPackages = (params) => API.get("/packages", { params });

// Get single package details
export const getStudentPackageById = (id) => API.get(`/packages/${id}`);

export default {
  getStudentClasses,
  enrollInBatch,
  getStudentPackages,
  getStudentPackageById,
};
