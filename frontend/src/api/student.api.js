import API from "./axios.instance";

/* ================= STUDENT: CLASSES / ENROLLMENT ================= */
// Wrap existing /student routes; optional params (e.g. { tutorId })
export const getStudentClasses = (params) =>
  API.get("/student/classes", { params });
export const getStudentEnrollments = () => API.get("/student/my-classes");
export const enrollInBatch = (data) => API.post("/student/enroll", data);

/* ================= STUDENT: PACKAGES (READ-ONLY) ================= */
// List all published packages
export const getStudentPackages = (params) => API.get("/packages", { params });
export const saveSelectedSlot = (data) =>
  API.post("/student/saveSelectedSlot", data);

// Get single package details
export const getStudentPackageById = (id) => API.get(`/packages/${id}`);
export const checkPaymentStatus = (id) =>
  API.get(`/student/checkPaymentStatus/${id}`);
export const getEnrollments = (params) => {
  return API.get("/student/my-classes", { params });
};

export default {
  getStudentClasses,
  getStudentEnrollments,
  getStudentPackages,
  enrollInBatch,
  saveSelectedSlot,
  checkPaymentStatus,
  getStudentPackageById,
};
