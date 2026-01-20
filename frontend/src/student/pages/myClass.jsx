"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Star, Search, X, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStudentClasses } from "@/api/student.api";

/* ---------------- DAY MAP ---------------- */
const dayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/* ---------------- SLOT TIME CHECK (Timezone Safe + 1hr rule) ---------------- */
const isValidSlot = (day, startTime) => {
  if (!day || !startTime) return false;

  const now = new Date(); // local timezone
  const slotDate = new Date(now);

  const targetDayIndex = dayMap[day];
  if (targetDayIndex === undefined) return false;

  let diff = targetDayIndex - now.getDay();
  if (diff < 0) diff += 7;

  slotDate.setDate(now.getDate() + diff);

  const [h, m] = startTime.split(":").map(Number);
  slotDate.setHours(h, m, 0, 0);

  // ⛔ Disable slot 1 hour before start
  const oneHourBefore = new Date(slotDate.getTime() - 60 * 60 * 1000);

  return now < oneHourBefore;
};

/* ---------------- LABEL HELPER ---------------- */
const getDayLabel = (offset) => {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  return null;
};

const BookSession = () => {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  /* ---------------- DATES (Today → Next 6 Days) ---------------- */
  const dates = useMemo(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        day: names[d.getDay()],
        date: d.getDate(),
        label: getDayLabel(i),
      };
    });
  }, []);

  /* ---------------- AUTO REFRESH EVERY 1 MINUTE ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setClasses((prev) => [...prev]); // trigger re-render
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- FETCH CLASSES ---------------- */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await getStudentClasses();
        setClasses(res.data?.data || []);
      } catch {
        toast.error("Failed to load slots");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  /* ---------------- TIME FILTER OPTIONS ---------------- */
  const timeWindows = useMemo(() => {
    const set = new Set();
    classes.forEach((cls) => {
      (cls.schedule || []).forEach((s) => {
        if (isValidSlot(s.day, s.startTime)) {
          set.add(`${s.day} ${s.startTime} - ${s.endTime}`);
        }
      });
    });
    return Array.from(set);
  }, [classes]);

  /* ---------------- TUTORS ---------------- */
  const tutors = useMemo(() => {
    const selectedDay = activeDate !== null ? dates[activeDate]?.day : null;

    return classes
      .map((cls, index) => {
        const tutor = cls.tutorId || {};
        const email = tutor.email || index;

        const slots = (cls.schedule || [])
          .filter((s) => isValidSlot(s.day, s.startTime))
          .filter((s) => !selectedDay || s.day === selectedDay)
          .map((s) => `${s.day} ${s.startTime} - ${s.endTime}`);

        if (!slots.length) return null;

        return {
          id: cls._id || index,
          tutorId: tutor._id,
          name: tutor.name || "Tutor",
          rating:tutor.rating,
          sessions: Math.floor(Math.random() * 1000) + 100,
          image: tutor.avatar || `https://i.pravatar.cc/150?u=${email}`,
          slots,
        };
      })
      .filter(Boolean);
  }, [classes, activeDate, dates]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredTutors = tutors.filter((t) => {
    if (!applyFilter) return true;
    return (
      t.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (!selectedTime || t.slots.includes(selectedTime))
    );
  });

  /* ---------------- BOOK ---------------- */
  const handleBookNow = (tutor) => {
    if (!selectedSlot || selectedSlot.tutorId !== tutor.id) {
      toast.error("Please select a valid future slot");
      return;
    }
    setSelectedTutor(tutor);
    setShowConfirm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen space-y-6">
      <Toaster />

      <h1 className="text-3xl font-black mt-12">Book a Session</h1>

      {/* DATE SELECTOR */}
      <div className="flex gap-2">
        {dates.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveDate(i);
              setSelectedSlot(null);
            }}
            className={`w-16 h-16 rounded-xl text-sm font-bold ${
              activeDate === i
                ? "bg-[#6335F8] text-white"
                : "bg-purple-50 text-[#6335F8]"
            }`}
          >
            <div>{d.label || d.day}</div>
            <div>{d.date}</div>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">
        <input
          placeholder="Tutor name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Times</option>
          {timeWindows.map((t, i) => (
            <option key={i}>{t}</option>
          ))}
        </select>

        <button
          onClick={() => setApplyFilter(true)}
          className="bg-[#6335F8] text-white px-4 rounded-lg"
        >
          <Search size={16} />
        </button>
      </div>

      {/* TUTORS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} className="border p-4 rounded-xl">
            <div className="flex justify-between mb-3">
              <h3 className="font-bold">{tutor.name}</h3>
              <img src={tutor.image} className="w-12 h-12 rounded-full" />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tutor.slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setSelectedSlot({ tutorId: tutor.id, slotIndex: i })
                  }
                  className={`px-3 py-1 text-xs rounded-lg border ${
                    selectedSlot?.tutorId === tutor.id &&
                    selectedSlot?.slotIndex === i
                      ? "bg-[#6335F8] text-white"
                      : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleBookNow(tutor)}
              className="w-full bg-[#6335F8] text-white py-2 rounded-lg"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>
            <p className="font-bold mb-4">
              Confirm booking with {selectedTutor?.name}
            </p>
            <button className="w-full bg-[#6335F8] text-white py-2 rounded-lg">
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSession;
