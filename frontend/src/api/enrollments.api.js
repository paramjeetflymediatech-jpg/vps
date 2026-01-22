import API from "./axios.instance";

/**
 * Get tutor's availability for a specific week
 * @param {string} date - Optional ISO date string for week start (Monday)
 */
export const getEnrollments = (params) => {
  return API.get("/student/my-classes", { params });
};
export const getEnrollmentsStudents = (params) => {
  return API.get("/student/student-classes", { params });
};
export const updateMeetingLink = (id, data) =>
  API.post(`/student/enrollments/${id}/meeting-link`, data);
export default { getEnrollments };
