import API from "./axios.instance";

export const getCourses = (params) => API.get("/courses",{params});

// Create: FormData pass karein
export const createCourse = (formData) => API.post("/courses", formData);

// Update: FormData pass karein
export const updateCourse = (id, formData) => API.put(`/courses/${id}`, formData);

export const deleteCourse = (id) => API.delete(`/courses/${id}`);