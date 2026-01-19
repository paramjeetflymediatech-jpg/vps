"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  X,
  Loader2,
} from "lucide-react";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
} from "../api/classes.api";
import { getCourses, updateCourse } from "../api/course.api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Classes = () => {
  const [user, setUser] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [meetingLinks, setMeetingLinks] = useState({});

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    maxStudents: 50,
    meetingLink: "",
    schedule: [{ day: "Mon", startTime: "", endTime: "" }],
  });

  const handleMeetingLinkChange = (courseId, value) => {
    setMeetingLinks(prev => ({ ...prev, [courseId]: value }));
  };

  const saveMeetingLink = async (courseId) => {
    try {
      const meetingLink = meetingLinks[courseId];
      if (!meetingLink) {
        alert("Please enter a meeting link");
        return;
      }

      const res = await updateCourse(courseId, { meetingLink });
      if (res?.data) {
        // Update local state
        setAssignedCourses(prev =>
          prev.map(course =>
            course._id === courseId
              ? { ...course, meetingLink }
              : course
          )
        );
        alert("Meeting link saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save meeting link", error);
      alert("Failed to save meeting link");
    }
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchAssignedCourses();
      fetchCourses();
    }
  }, [user]);

  const fetchAssignedCourses = async () => {
    if (!user?.id && !user?._id) return;

    try {
      setLoading(true);
      const tutorId = user.id || user._id;

      // Fetch courses where this tutor is assigned
      const res = await getCourses({ tutorId });

      if (res?.data) {
        setAssignedCourses(Array.isArray(res.data) ? res.data : res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load assigned courses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const res = await getCourses();
    if (res?.data) setCourses(res.data);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tutorId = user?.id || user?._id;
    if (!tutorId) {
      console.error(
        "Tutor ID not found in user object from localStorage",
        user
      );
      return;
    }

    const payload = {
      ...form,
      tutorId,
      price: Number(form.price),
      maxStudents: Number(form.maxStudents),
    };

    try {
      const res = editClass
        ? await updateClass(editClass._id, payload)
        : await createClass(payload);

      if (res?.data?.success) {
        const updatedClass = res.data.data;

        if (editClass) {
          setClasses((prev) =>
            prev.map((c) => (c._id === updatedClass._id ? updatedClass : c))
          );
        } else {
          setClasses((prev) => [updatedClass, ...prev]);
        }

        closeModal();
      }
    } catch (error) {
      // Errors (including 409) are already handled by axios interceptor with toasts.
      console.warn("Failed to save class", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message,
      });
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const res = await deleteClass(id);
    if (res?.data?.success) {
      setClasses((prev) => prev.filter((c) => c._id !== id));
    }
  };
  /* ================= HELPERS ================= */
  const openCreate = () => {
    resetForm();
    setEditClass(null);
    setShowModal(true);
  };

  const openEdit = async (data) => {
    setEditClass(data);
    const res = await getClassById(data._id);
    if (res?.data?.success) {
      let item = res.data.data;
      setForm({
        courseId: item.courseId?._id || item.courseId,
        title: item.title,
        description: item.description,
        price: item.price,
        startDate: item.startDate?.slice(0, 10),
        endDate: item.endDate?.slice(0, 10),
        maxStudents: item.maxStudents,
        meetingLink: item.meetingLink || "",
        schedule:
          item.schedule?.length > 0
            ? item.schedule
            : [{ day: "Mon", startTime: "", endTime: "" }],
      });
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      courseId: "",
      title: "",
      description: "",
      price: "",
      startDate: "",
      endDate: "",
      maxStudents: 50,
      meetingLink: "",
      schedule: [{ day: "Mon", startTime: "", endTime: "" }],
    });
  };

  /* ================= SCHEDULE ================= */
  const updateSchedule = (index, key, value) => {
    const updated = [...form.schedule];
    updated[index][key] = value;
    setForm({ ...form, schedule: updated });
  };

  const addSchedule = () => {
    setForm({
      ...form,
      schedule: [...form.schedule, { day: "Mon", startTime: "", endTime: "" }],
    });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      {/* <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
        <div>
          <h2 className="text-3xl font-black">Classes Panel</h2>
          <p className="text-gray-500">{classes.length} total classes</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0852A1] text-white px-6 py-3 rounded-2xl font-bold"
        >
          <Plus size={18} /> Create Class
        </button>
      </div> */}

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedCourses && assignedCourses.length > 0 ? (
            assignedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3">{course.title}</h3>

                {course.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2 font-black text-[#0852A1]">
                    <IndianRupee size={14} /> {course.price || 'Free'}
                  </div>
                  {course.expiryDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Valid until: {new Date(course.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 mb-2">Add Google Meet link for your students:</p>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                    value={meetingLinks[course._id] || course.meetingLink || ""}
                    onChange={(e) => handleMeetingLinkChange(course._id, e.target.value)}
                  />
                  <button
                    onClick={() => saveMeetingLink(course._id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                  >
                    Save Meeting Link
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No courses assigned yet</p>
              <p className="text-sm mt-2">Contact your admin to get assigned to courses</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editClass ? "Edit Class" : "Create Class"}
              </h3>
              <X onClick={closeModal} className="cursor-pointer" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* COURSE */}
              <select
                required
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <input
                required
                placeholder="Class Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="url"
                placeholder="Meeting Link"
                value={form.meetingLink}
                onChange={(e) =>
                  setForm({ ...form, meetingLink: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              {/* SCHEDULE */}
              {form.schedule.map((s, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <select
                    value={s.day}
                    onChange={(e) => updateSchedule(i, "day", e.target.value)}
                    className="border rounded-xl px-3 py-2"
                  >
                    {DAYS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={s.startTime}
                    onChange={(e) =>
                      updateSchedule(i, "startTime", e.target.value)
                    }
                    className="border rounded-xl px-3 py-2"
                  />
                  <input
                    type="time"
                    value={s.endTime}
                    onChange={(e) =>
                      updateSchedule(i, "endTime", e.target.value)
                    }
                    className="border rounded-xl px-3 py-2"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addSchedule}
                className="text-blue-600 font-bold text-sm"
              >
                + Add Schedule
              </button>

              {/* PRICE */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="number"
                  placeholder="Max Students"
                  value={form.maxStudents}
                  onChange={(e) =>
                    setForm({ ...form, maxStudents: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0852A1] text-white py-4 rounded-2xl font-bold"
              >
                {editClass ? "Update Class" : "Create Class"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
