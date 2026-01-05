import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/courses",
});

// GET ALL
export const getCourses = () => API.get("/");

// CREATE
export const createCourse = (data) => API.post("/", data);

// DELETE
export const deleteCourse = (id) => API.delete(`/${id}`);

// UPDATE
export const updateCourse = (id, data) =>
  API.put(`/${id}`, data);
