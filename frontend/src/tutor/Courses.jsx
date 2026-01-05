import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/api/course.api";

const Courses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null); // ✅ ADDED

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // CREATE / UPDATE COURSE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: e.target.title.value,
      schedule: e.target.schedule.value,
      duration: e.target.duration.value,
      price: Number(e.target.price.value),
      status: e.target.status.value,
    };

    try {
      if (editCourse) {
        // ✅ UPDATE
        const res = await updateCourse(editCourse._id, data);
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourse._id ? res.data : c))
        );
      } else {
        // ✅ CREATE
        const res = await createCourse(data);
        setCourses((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
      setEditCourse(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE COURSE
  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button
          onClick={() => {
            setEditCourse(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#0852A1] text-white px-5 py-2.5 rounded-lg"
        >
          <Plus size={18} /> Create Course
        </button>
      </div>

      {/* COURSES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
          >
            {/* TITLE + STATUS */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-1 text-sm text-gray-600">
              <p>📅 Schedule: {item.schedule}</p>
              <p>⏳ Duration: {item.duration}</p>
              <p>💰 Price: ₹{item.price}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={() => {
                  setEditCourse(item); // ✅ FIXED
                  setShowModal(true);
                }}
                className="flex items-center gap-1 text-blue-600"
              >
                <Edit size={16} /> Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="flex items-center gap-1 text-red-600 hover:underline"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editCourse ? "Edit Course" : "Create Course"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                defaultValue={editCourse?.title || ""}
                placeholder="Course Title"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <input
                name="schedule"
                defaultValue={editCourse?.schedule || ""}
                placeholder="Schedule (Mon-Fri | 10AM)"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <input
                name="duration"
                defaultValue={editCourse?.duration || ""}
                placeholder="Duration (3 Months)"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <input
                name="price"
                type="number"
                defaultValue={editCourse?.price || ""}
                placeholder="Price"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <select
                name="status"
                defaultValue={editCourse?.status || "Active"}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditCourse(null);
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-[#0852A1] text-white px-4 py-2 rounded">
                  {editCourse ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
