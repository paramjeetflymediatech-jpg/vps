"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { getTutors } from "@/api/tutorApi";
import {
  getStudentClasses,
  checkPaymentStatus,
  saveSelectedSlot,
} from "@/api/student.api";
import { getEnrollmentsStudents } from "@/api/enrollments.api";
import toast from "react-hot-toast";

const TABS = ["Upcoming", "Completed", "Cancelled", "Missed", "Pending"];
const ITEMS_PER_PAGE = 6;

const getTodayKey = () => new Date().toISOString().split("T")[0];

const isAvailableFutureSlot = (date, slot) => {
  if (!slot.isAvailable || slot.isBooked) return false;
  const now = new Date();
  const [h, m] = slot.startTime.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate.getTime() > now.getTime();
};

const MySessions = () => {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  // Slots / Tutors
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Enrollments (Student view)
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  /* ---------------- RESET ON TAB CHANGE ---------------- */
  useEffect(() => {
    setSessions([]);
    setPage(1);
    setSelectedSlot(null);
    setPaymentMessage("");
  }, [activeTab]);

  /* ---------------- FETCH TUTORS & AVAILABILITY ---------------- */
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const today = getTodayKey();
        const tutorRes = await getTutors();
        const tutorList = tutorRes.data?.data || [];

        const availabilityRes = await getStudentClasses();
        const availability = availabilityRes.data?.data || [];

        const mappedTutors = tutorList.map((t) => {
          const todayAvailability = availability.find(
            (a) =>
              a.tutorId?._id === t._id &&
              new Date(a.date).toISOString().split("T")[0] === today,
          );

          let date = null;
          let slots = [];
          if (todayAvailability) {
            date = todayAvailability.date;
            slots = todayAvailability.availability
              .filter((s) => isAvailableFutureSlot(todayAvailability.date, s))
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
          }

          return {
            id: t._id,
            name: t.name,
            sessions: Math.floor(Math.random() * 500) + 50,
            date,
            slots,
            img: t.avatar || `https://i.pravatar.cc/150?u=${t.email}`,
          };
        });

        setTutors(mappedTutors);
      } catch (err) {
        console.error("Tutor fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  /* ---------------- SLOT SELECTION ---------------- */
  const handleSlotSelection = async (tutorId, date, slot) => {
    if (slot.isBooked) {
      setPaymentMessage("Slot has been successfully booked.");
      return;
    }
    if (!slot.isAvailable) {
      setPaymentMessage("This slot is not available.");
      return;
    }
    try {
      setPaymentMessage("");
      const paymentRes = await checkPaymentStatus(tutorId);
      const paid = paymentRes.data?.paid;
      const status = paymentRes.data?.status;

      if (paid && status === "SUCCESS") {
        await saveSelectedSlot({ tutorId, date, slot });
        setSelectedSlot({ tutorId, startTime: slot.startTime });
        setPaymentMessage("Slot booked successfully!");
        return;
      }

      if (paid && status !== "SUCCESS") {
        setPaymentMessage(
          "Please wait for the payment confirmation from admin.",
        );
        return;
      }

      router.push(`/CoursesPricing?tutorId=${tutorId}&time=${slot.startTime}`);
    } catch (err) {
      console.error("Slot error:", err);
      setPaymentMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    }
  };

  /* ---------------- FETCH ENROLLMENTS ---------------- */
  useEffect(() => {
    if (!user?.id) return;

    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const res = await getEnrollmentsStudents({
          userId: user.id,
          status: activeTab,
        });
        console.log(res, "res");
        setEnrollments(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load enrollments");
      } finally {
        setLoadingEnrollments(false);
      }
    };

    fetchEnrollments();
  }, [user?.id, activeTab]);

  /* ---------------- PAGINATION ---------------- */
  const TOTAL_PAGES = Math.max(1, Math.ceil(tutors.length / ITEMS_PER_PAGE));
  const paginatedTutors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return tutors.slice(start, start + ITEMS_PER_PAGE);
  }, [tutors, page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 bg-[#FBFCFF] min-h-screen pt-20 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black">My Sessions</h1>
          <p className="text-gray-500 font-medium">
            Manage your learning journey
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold ${
                activeTab === tab
                  ? "bg-white text-[#6335F8] shadow"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* ENROLLMENTS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow border overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">
          Your Enrollments ({activeTab})
        </h2>
        {loadingEnrollments ? (
          <div className="p-6 text-center">Loading enrollments...</div>
        ) : enrollments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No enrollments found for this tab.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Tutor</th>
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
                  <td className="p-3">{e.tutor?.name}</td>
                  <td className="p-3">{e.package?.title}</td>
                  <td className="p-3">
                    {new Date(e.slot?.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {e.slot?.startTime} - {e.slot?.endTime}
                  </td>
                  <td className="p-3">
                    {e.meetingLink ? (
                      <a
                        href={e.meetingLink}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Join
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
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
        )}
      </div>

      {/* PAYMENT MESSAGE */}
      {paymentMessage && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-6 font-semibold">
          {paymentMessage}
        </div>
      )}

      {/* TUTORS SLOTS GRID */}
      {paginatedTutors.length > 0 && (
        <div>
          <h2 className="text-xl font-black flex gap-2 mb-6">
            <LayoutGrid size={20} /> Book a Trial Session
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white p-6 rounded-3xl border hover:shadow-xl"
              >
                <div className="flex gap-4 mb-4">
                  <img
                    src={tutor.img}
                    className="w-16 h-16 rounded-2xl"
                    alt={tutor.name}
                  />
                  <div>
                    <h4 className="font-black">{tutor.name}</h4>
                    <p className="text-xs text-gray-400 font-bold">
                      {tutor.sessions}+ Sessions
                    </p>
                  </div>
                </div>

                {/* SLOTS */}
                {tutor.slots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {tutor.slots.map((slot, i) => (
                      <button
                        key={i}
                        disabled={slot.isBooked || !slot.isAvailable}
                        onClick={() =>
                          handleSlotSelection(tutor.id, tutor.date, slot)
                        }
                        className={`px-3 py-2 text-xs rounded-lg font-bold
                          ${
                            slot.isBooked
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : selectedSlot?.tutorId === tutor.id &&
                                  selectedSlot?.startTime === slot.startTime
                                ? "bg-[#6335F8] text-white"
                                : "bg-white border border-gray-200 hover:bg-purple-50"
                          }
                        `}
                      >
                        {slot.isBooked
                          ? "Reserved"
                          : `${slot.startTime} - ${slot.endTime}`}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mb-4">
                    No slots available today
                  </p>
                )}

                <button
                  disabled
                  className="w-full py-3 rounded-xl font-black bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Select a Slot
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-16">
            <div className="flex bg-white p-2 rounded-2xl border shadow">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2"
              >
                <ChevronLeft />
              </button>
              <span className="px-4 font-black text-gray-500">
                Page {page} of {TOTAL_PAGES}
              </span>
              <button
                disabled={page === TOTAL_PAGES}
                onClick={() => setPage((p) => p + 1)}
                className="p-2"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessions;
