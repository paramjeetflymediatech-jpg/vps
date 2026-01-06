import API from "./axios.instance";
/**
 * CLASSES API
 */

// Get all classes
export const getAllClasses = (params) => API.get("/classes", { params });

// Get single class
export const getClassById = (id) => API.get(`/classes/${id}`);

// Create class
export const createClass = (data) => API.post("/classes", data);

// Update class
export const updateClass = (id, data) => API.put(`/classes/${id}`, data);

// Delete class
export const deleteClass = (id) => API.delete(`/classes/${id}`);

export default {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
