"use client";

import { useEffect, useState, useMemo } from "react";
import { getEnrollments, updateMeetingLink } from "@/api/enrollments.api";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  Edit,
  ExternalLink,
  Search,
  User,
} from "lucide-react";

const STATUS_OPTIONS = [
  "Upcoming",
  "Completed",
  "Cancelled",
  "Missed", 
];

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!user?.id) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await getEnrollments({ tutorId: user.id });
        setEnrollments(res?.data?.data || []);
      } catch {
        toast.error("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user?.id]);

  /* =========================
     FILTER
  ========================= */
  const filteredEnrollments = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return enrollments.filter(
      (e) =>
        e.student?.name?.toLowerCase().includes(q) ||
        e.package?.title?.toLowerCase().includes(q),
    );
  }, [enrollments, searchQuery]);

  /* =========================
     SAVE LINK + STATUS
  ========================= */
  const handleSave = async (id) => {
    if (!meetingLink.trim()) {
      toast.error("Meeting link is required");
      return;
    }

    try {
      await updateMeetingLink(id, { meetingLink, status });

      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, meetingLink, status } : e)),
      );

      toast.success("Class updated successfully");
      setEditingId(null);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-6 rounded-2xl border">
        <div>
          <h2 className="text-3xl font-bold">My Classes</h2>
          <p className="text-gray-500">Manage meeting links & status</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold">Student</th>
              <th className="px-6 py-4 text-xs font-bold">Course</th>
              <th className="px-6 py-4 text-xs font-bold">Date</th>
              <th className="px-6 py-4 text-xs font-bold">Time</th>
              <th className="px-6 py-4 text-xs font-bold">Meeting</th>
              <th className="px-6 py-4 text-xs font-bold text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredEnrollments.map((e) => (
              <tr key={e._id} className="hover:bg-gray-50">
                {/* STUDENT */}
                <td className="px-6 py-4">
                  <div className="flex gap-3 items-center">
                    <User />
                    <div>
                      <div className="font-bold">{e.student?.name}</div>
                      <div className="text-xs text-gray-500">
                        {e.student?.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* COURSE */}
                <td className="px-6 py-4">{e.package?.title}</td>

                {/* DATE */}
                <td className="px-6 py-4">
                  <Calendar size={14} />{" "}
                  {new Date(e.slot?.date).toLocaleDateString()}
                </td>

                {/* TIME */}
                <td className="px-6 py-4">
                  <Clock size={14} /> {e.slot?.startTime} - {e.slot?.endTime}
                </td>

                {/* MEETING */}
                <td className="px-6 py-4">
                  {editingId === e._id ? (
                    <input
                      value={meetingLink}
                      onChange={(ev) => setMeetingLink(ev.target.value)}
                      className="border px-2 py-1 rounded w-full"
                      placeholder="https://..."
                    />
                  ) : e.meetingLink ? (
                    <a
                      href={e.meetingLink}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-blue-600 font-bold"
                    >
                      <Video size={14} /> Join <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Not added</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  {editingId === e._id ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-bold text-sm">{e.status}</span>
                  )}
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-center">
                  {editingId === e._id ? (
                    <button
                      onClick={() => handleSave(e._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(e._id);
                        setMeetingLink(e.meetingLink || "");
                        setStatus(e.status);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;
