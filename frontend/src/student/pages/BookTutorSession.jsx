"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTutorById } from "@/api/tutorApi";
import { getStudentClasses } from "@/api/student.api";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";

// Helper: build next 7 days (today + 6)
const buildDates = () => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      dateObj: d,
      day: names[d.getDay()],
      date: d.getDate(),
    });
  }

  return result;
};

// Helper: check if a calendar date is within class start/end
const isDateInClassRange = (cls, d) => {
  if (!cls.startDate || !cls.endDate) return true;
  const start = new Date(cls.startDate);
  const end = new Date(cls.endDate);
  const dayOnly = new Date(d);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  dayOnly.setHours(0, 0, 0, 0);
  return dayOnly >= start && dayOnly <= end;
};

// Helper: HH:MM (24h) -> h:MM AM/PM
const formatTime = (time24) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
};

const BookTutorSession = () => {
  const params = useParams();
  const tutorId = params?.tutorId || params?.id;

  const [tutor, setTutor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);

  const dates = useMemo(buildDates, []);

  useEffect(() => {
    if (!tutorId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [tutorRes, classesRes] = await Promise.all([
          getTutorById(tutorId),
          getStudentClasses({ tutorId }),
        ]);
        console.log(tutorRes, "res", classesRes);
        const t = tutorRes.data?.data;
        setTutor(t || null);

        const cls = classesRes.data?.data || classesRes.data || [];
        setClasses(Array.isArray(cls) ? cls : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load tutor information");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tutorId]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // Slots for selected date
  const slotsForSelectedDay = useMemo(() => {
    if (!dates[activeDateIndex]) return [];
    const d = dates[activeDateIndex].dateObj;
    const dayName = dates[activeDateIndex].day; // Mon/Tue...
    const dateStr = d.toISOString().slice(0, 10);

    const items = [];

    classes.forEach((cls) => {
      if (!isDateInClassRange(cls, d)) return;
      const schedule = Array.isArray(cls.schedule) ? cls.schedule : [];

      schedule.forEach((slot, idx) => {
        if (slot.day !== dayName || !slot.startTime || !slot.endTime) return;

        const key = `${cls._id || ""}-${idx}`;
        const isToday = dateStr === todayStr;
        const isPastToday = isToday && slot.endTime <= currentHHMM;

        items.push({
          key,
          label: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
          isPast: isPastToday,
        });
      });
    });

    // sort by start time
    return items.sort((a, b) => a.label.localeCompare(b.label));
  }, [activeDateIndex, classes, dates, currentHHMM, todayStr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
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

  if (!tutor) {
    return (
      <div className="p-6 text-center text-gray-500">Tutor not found.</div>
    );
  }

  const joinedYear = tutor.createdAt
    ? new Date(tutor.createdAt).getFullYear()
    : "--";

  const sessionCount = tutor.reviewsCount || 0; // best we have for now

  return (
    <div className="min-h-screen bg-[#F5F5FF] pb-16">
      {/* Top gradient banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-8 px-4 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Tutor avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold">
              {tutor.name?.charAt(0) || "T"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {tutor.name}
              </h1>
              <p className="text-sm md:text-base opacity-80">
                {tutor.expertise || "Expert English Tutor"}
              </p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="flex gap-4">
            <div className="bg-white text-indigo-700 rounded-2xl px-6 py-3 text-center text-sm shadow-lg min-w-[130px]">
              <div className="text-2xl font-bold">{joinedYear}</div>
              <div className="opacity-70">Tutor since</div>
            </div>
            <div className="bg-white text-indigo-700 rounded-2xl px-6 py-3 text-center text-sm shadow-lg min-w-[130px]">
              <div className="text-2xl font-bold">{sessionCount}</div>
              <div className="opacity-70">Sessions taken</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-6 flex border-b border-white/20 text-sm">
          <Link
            href={`/student/tutor/${tutorId}`}
            className="px-4 pb-2 text-white/80 hover:text-white transition"
          >
            About
          </Link>
          <button className="px-4 pb-2 font-semibold border-b-2 border-white">
            Book a Session
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto mt-8 px-4 md:px-0">
        <Link
          href="/student/myClass"
          className="flex items-center text-gray-500 hover:text-blue-600 mb-4 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to all sessions
        </Link>

        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          {/* Date strip */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar size={18} className="text-purple-600" />
              Select a day
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
            {dates.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDateIndex(idx)}
                className={`min-w-[70px] rounded-xl px-4 py-3 text-center font-semibold border transition
                  ${
                    activeDateIndex === idx
                      ? "bg-[#6335F8] text-white border-transparent"
                      : "bg-white text-[#6335F8] border-[#E0D7FF]"
                  }`}
              >
                <div className="text-xs mb-1">{d.day}</div>
                <div className="text-lg">{d.date}</div>
              </button>
            ))}
          </div>

          {/* Time slots */}
          <div className="mb-3 text-sm font-medium text-gray-700">
            Choose your timing
          </div>

          {slotsForSelectedDay.length === 0 ? (
            <div className="text-gray-400 text-sm py-8 text-center">
              No available slots for this day.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {slotsForSelectedDay.map((slot) => (
                <button
                  key={slot.key}
                  disabled={slot.isPast}
                  onClick={() => setSelectedSlotKey(slot.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs md:text-sm
                    ${
                      slot.isPast
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200"
                        : selectedSlotKey === slot.key
                        ? "border-[#6335F8] bg-[#6335F8] text-white"
                        : "bg-white hover:border-[#6335F8] text-gray-700"
                    }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border flex-shrink-0
                      ${
                        slot.isPast
                          ? "border-gray-300 bg-gray-200"
                          : selectedSlotKey === slot.key
                          ? "border-white bg-white"
                          : "border-gray-400"
                      }`}
                  />
                  {slot.label}
                </button>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center text-sm text-gray-500 gap-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>
                {tutor.rating || 4.8} rating • {tutor.reviewsCount || 0} reviews
              </span>
            </div>

            <button
              disabled={!selectedSlotKey}
              className={`px-8 py-3 rounded-2xl font-semibold text-sm md:text-base shadow-md transition
                ${
                  selectedSlotKey
                    ? "bg-[#6335F8] text-white hover:bg-[#5128d8]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Continue to book
            </button>
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default BookTutorSession;
