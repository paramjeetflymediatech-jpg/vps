"use client";

import { useEffect, useState } from "react";
import { getEnrollments, updateMeetingLink } from "@/api/enrollments.api";
import toast from "react-hot-toast";
import { Calendar, Clock } from "lucide-react";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

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
    return <div className="p-6">Loading enrollments...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h2 className="text-2xl font-bold">Enrollments</h2>
        <p className="text-sm text-gray-500">Students who booked your sessions</p>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Meeting</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id} className="border-t">
                {/* Student Info */}
                <td className="p-3">
                  <div className="font-semibold">{e.student?.name}</div>
                  <div className="text-xs text-gray-500">{e.student?.email}</div>
                </td>

                {/* Course Info */}
                <td className="p-3">{e.package?.title}</td>

                {/* Date & Time */}
                <td className="p-3 flex items-center gap-1">
                  <Calendar size={14} /> {new Date(e.slot?.date).toLocaleDateString()}
                </td>
                <td className="p-3 flex items-center gap-1">
                  <Clock size={14} /> {e.slot?.startTime} - {e.slot?.endTime}
                </td>

                {/* Meeting Link (Editable for tutor) */}
                <td className="p-3">
                  {editingId === e._id ? (
                    <div className="flex gap-2">
                      <input
                        value={meetingLink}
                        onChange={(ev) => setMeetingLink(ev.target.value)}
                        placeholder="Paste meeting link"
                        className="border px-2 py-1 rounded text-sm w-48"
                      />
                      <button
                        onClick={() => handleSaveMeetingLink(e._id)}
                        className="text-green-600 text-xs font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      {e.meetingLink && (
                        <a
                          href={e.meetingLink}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Join
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingId(e._id);
                          setMeetingLink(e.meetingLink || "");
                        }}
                        className="text-sm text-blue-600 underline"
                      >
                        {e.meetingLink ? "Edit" : "Add link"}
                      </button>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      e.status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700"
                        : e.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {enrollments.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No enrollments yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollments;
