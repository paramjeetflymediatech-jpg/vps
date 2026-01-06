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
} from "../api/classes.api";
import { getCourses } from "../api/course.api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Classes = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);

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

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getAllClasses();
      if (res?.data?.success) setClasses(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const res = await getCourses();
    if (res?.data?.success) setCourses(res.data.data);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tutorId: user._id,
      price: Number(form.price),
      maxStudents: Number(form.maxStudents),
    };

    const res = editClass
      ? await updateClass(editClass._id, payload)
      : await createClass(payload);

    if (res?.data?.success) {
      editClass
        ? setClasses((prev) =>
            prev.map((c) =>
              c._id === editClass._id ? res.data.data : c
            )
          )
        : setClasses((prev) => [res.data.data, ...prev]);

      closeModal();
    }
  };

  /* ================= HELPERS ================= */
  const openCreate = () => {
    resetForm();
    setEditClass(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditClass(item);
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
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
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
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border p-6 shadow-sm"
            >
              <div className="flex justify-between mb-3">
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <Edit3
                    size={16}
                    className="cursor-pointer text-blue-600"
                    onClick={() => openEdit(item)}
                  />
                  <Trash2
                    size={16}
                    className="cursor-pointer text-red-600"
                    onClick={() => deleteClass(item._id)}
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">{item.title}</h3>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={14} /> Max {item.maxStudents}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(item.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 font-black text-[#0852A1]">
                  <IndianRupee size={14} /> {item.price}
                </div>
              </div>

              {item.meetingLink && (
                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-4 text-center py-3 bg-green-600 text-white rounded-2xl font-bold"
                >
                  Join Live Class
                </a>
              )}
            </div>
          ))}
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
                onChange={(e) =>
                  setForm({ ...form, courseId: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
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
                    onChange={(e) =>
                      updateSchedule(i, "day", e.target.value)
                    }
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
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
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
