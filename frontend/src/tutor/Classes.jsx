"use client";

import { useEffect, useState, useMemo } from "react";
import { getEnrollments, updateMeetingLink } from "@/api/enrollments.api";
import toast from "react-hot-toast";
import { Calendar, Clock, Video, Edit, Plus, ExternalLink, Search, User } from "lucide-react";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await getEnrollments({ tutorId: user.id });
        setEnrollments(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user?.id]);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const studentName = e.student?.name?.toLowerCase() || "";
      const courseTitle = e.package?.title?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return studentName.includes(query) || courseTitle.includes(query);
    });
  }, [enrollments, searchQuery]);

  const handleSaveMeetingLink = async (id) => {
    if (!meetingLink || meetingLink.trim() === "") {
      toast.error("Please enter a valid meeting link");
      return;
    }

    try {
      await updateMeetingLink(id, { meetingLink });
      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, meetingLink } : e))
      );
      toast.success("Meeting link updated");
      setEditingId(null);
      setMeetingLink("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update meeting link");
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Classes</h2>
          <p className="text-gray-500 mt-1">Manage your student sessions and meeting links</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Enrollments Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Meeting Link</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredEnrollments.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Student Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{e.student?.name}</div>
                        <div className="text-xs text-gray-500">{e.student?.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Course Info */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-700">{e.package?.title}</div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{new Date(e.slot?.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} className="text-blue-500" />
                      <span>{e.slot?.startTime} - {e.slot?.endTime}</span>
                    </div>
                  </td>

                  {/* Meeting Link */}
                  <td className="px-6 py-5">
                    {editingId === e._id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          autoFocus
                          value={meetingLink}
                          onChange={(ev) => setMeetingLink(ev.target.value)}
                          placeholder="https://..."
                          className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm w-full max-w-[200px] focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveMeetingLink(e._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {e.meetingLink ? (
                          <>
                            <a
                              href={e.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              <Video size={14} />
                              Join
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingId(e._id);
                                setMeetingLink(e.meetingLink || "");
                              }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                              title="Edit link"
                            >
                              <Edit size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(e._id);
                              setMeetingLink("");
                            }}
                            className="inline-flex items-center gap-1.5 border border-dashed border-gray-300 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <Plus size={14} />
                            Add link
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${e.status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : e.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Calendar size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No classes found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              {searchQuery ? `No results for "${searchQuery}"` : "You don't have any enrollments assigned to you yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollments;

