"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Clock, Star, Search, X, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStudentClasses } from "@/api/student.api";

const BookSession = () => {
  const [activeDate, setActiveDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Backend data state
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedTime, setSelectedTime] = useState("");
  const [searchName, setSearchName] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  // Modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  /* ---------------- DATES (dynamic: today + next 6 days) ---------------- */
  const dates = useMemo(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push({
        day: names[d.getDay()],
        date: d.getDate(),
      });
    }

    return result;
  }, []);

  /* ---------------- TIME OPTIONS (derived from backend) ---------------- */
  const timeWindows = useMemo(() => {
    const slotSet = new Set();
    classes.forEach((cls) => {
      (cls.schedule || []).forEach((s) => {
        if (s.startTime && s.endTime) {
          // Simple human format e.g. "Mon 06:00 - 07:00"
          const label = `${s.day || ""} ${s.startTime} - ${s.endTime}`.trim();
          slotSet.add(label);
        }
      });
    });
    return Array.from(slotSet);
  }, [classes]);

  /* ---------------- TUTORS (derived from classes & selected day) ---------------- */
  const tutors = useMemo(() => {
    const selectedDay = dates[activeDate]?.day; // e.g. "Mon", "Tue"

    return classes
      .filter((cls) => {
        if (!selectedDay) return true;
        const schedule = cls.schedule || [];
        return schedule.some((s) => s.day === selectedDay);
      })
      .map((cls, index) => {
        const tutor = cls.tutorId || {};
        const email = tutor.email || cls._id || index;

        const slots = (cls.schedule || []).map((s) => {
          return `${s.day || ""} ${s.startTime} - ${s.endTime}`.trim();
        });

        return {
          id: cls._id || index,
          name: tutor.name || "Tutor",
          rating: 4.8, // placeholder until rating is in backend
          sessions: Math.floor(Math.random() * 1000) + 100,
          image: `https://i.pravatar.cc/150?u=${email}`,
          slots,
        };
      });
  }, [classes, activeDate, dates]);

  /* ---------------- FILTER ---------------- */
  const filteredTutors = tutors.filter((tutor) => {
    if (!applyFilter) return true;

    const matchName = tutor.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchTime = selectedTime
      ? tutor.slots.includes(selectedTime)
      : true;

    return matchName && matchTime;
  });

  // Load classes from backend on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getStudentClasses();
        const data = res.data?.data || res.data || [];
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load available classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  /* ---------------- BOOK CLICK ---------------- */
  const handleBookNow = (tutor) => {
    if (!selectedSlot || selectedSlot.tutorId !== tutor.id) {
      toast.error("Please select a time slot first", {
        position: "top-right", // This moves it to the top-left corner
      });
      return;
    }
    setSelectedTutor(tutor);
    setShowConfirm(true);
  };

  /* ---------------- RAZORPAY REDIRECT ---------------- */
  const handleConfirmBooking = () => {
    setShowConfirm(false);

    // 👉 Replace with your real Razorpay checkout URL
    window.location.href = ""; // demo Razorpay link
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-white relative">
      <Toaster />

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Book a Session</h1>
        <p className="text-gray-500">Search & book available tutors</p>
      </div>

      {/* DATE FILTER */}
      <div className="flex gap-3 overflow-x-auto">
        {dates.map((d, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveDate(index);
              setSelectedSlot(null);
            }}
            className={`min-w-[70px] rounded-xl px-4 py-3 font-semibold
              ${
                activeDate === index
                  ? "bg-[#6335F8] text-white"
                  : "bg-purple-50 text-[#6335F8]"
              }`}
          >
            <div className="text-xs">{d.day}</div>
            <div className="text-lg">{d.date}</div>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Tutor name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />

        <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
          <Clock size={16} />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-transparent w-full outline-none"
          >
            <option value="">All Times</option>
            {timeWindows.map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setApplyFilter(true)}
          className="bg-[#6335F8] text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Search size={16} /> Search
        </button>
      </div>

      {/* TUTORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-sm">
            No tutors available for this day. Please select another day.
          </div>
        ) : (
          filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="border rounded-2xl p-5 hover:shadow-lg"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold">{tutor.name}</h3>
                  <p className="text-sm text-gray-500 flex gap-1 items-center">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {tutor.rating} | {tutor.sessions}+ sessions
                  </p>
                </div>
                <img
                  src={tutor.image}
                  className="w-14 h-14 rounded-full"
                />
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {tutor.slots.map((slot, i) => (
                  <button
                    key={i}
                    disabled={slot === "Reserved"}
                    onClick={() =>
                      setSelectedSlot({ tutorId: tutor.id, slotIndex: i })
                    }
                    className={`px-3 py-2 text-xs rounded-lg border
                      ${
                        slot === "Reserved"
                          ? "bg-gray-100 text-gray-300"
                          : selectedSlot?.tutorId === tutor.id &&
                            selectedSlot?.slotIndex === i
                          ? "bg-[#6335F8] text-white"
                          : "hover:border-[#6335F8]"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleBookNow(tutor)}
                className="w-full py-3 rounded-xl bg-[#6335F8] text-white font-bold"
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative border border-purple-200">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selectedTutor.image}
                className="w-20 h-20 rounded-full mb-4"
              />

              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex gap-2 items-center text-sm mb-4">
                <ShieldCheck size={16} />
                Try another tutor for free or get a refund if not satisfied
              </div>

              <button
                onClick={handleConfirmBooking}
                className="w-full bg-[#6335F8] text-white py-3 rounded-full font-bold mb-3"
              >
                Yes, I want to book this session
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 rounded-full bg-gray-100 text-gray-700"
              >
                No, I want to book another slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSession;
