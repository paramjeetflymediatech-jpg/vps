import axios from "axios";

const API = axios.create({ 
    baseURL: "http://localhost:8000/api",
    withCredentials: true 
});

export const getCourses = () => API.get("/courses");

// Create: FormData pass karein
export const createCourse = (formData) => API.post("/courses", formData);

// Update: FormData pass karein
export const updateCourse = (id, formData) => API.put(`/courses/${id}`, formData);

export const deleteCourse = (id) => API.delete(`/courses/${id}`);