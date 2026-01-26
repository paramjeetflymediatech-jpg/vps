"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Star,
  BookOpen,
  Clock,
  Award,
  ShieldCheck,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getTutorById } from "@/api/tutorApi";
import { getStudentClasses } from "@/api/student.api";
import { getAvailabilityByTutorId } from "@/api/tutorAvailability.api";

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

const TutorDetailsView = ({ id: propId }) => {
  const params = useParams();
  const routeId = params?.id;
  const id = propId || routeId;

  const [tutor, setTutor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  const [tutorAvailability, setTutorAvailability] = useState(null);

  const dates = useMemo(buildDates, []);

  useEffect(() => {
    if (!id) return;

    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTutorById(id);
        const t = res.data?.data;
        if (!t) {
          setTutor(null);
        } else {
          // Try to compute next availability from upcoming classes for this tutor
          let nextAvailability = t.availability || "Today";
          try {
            const classesRes = await getStudentClasses({ tutorId: t._id });
            const cls = classesRes.data?.data || classesRes.data || [];
            setClasses(Array.isArray(cls) ? cls : []);

            if (Array.isArray(cls) && cls.length > 0) {
              // pick earliest class by startDate, then earliest slot within that class
              const sortedClasses = [...cls].sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate)
              );
              const firstClass = sortedClasses[0];
              const schedule = Array.isArray(firstClass.schedule)
                ? firstClass.schedule
                : [];

              if (schedule.length > 0) {
                const sortedSlots = [...schedule].sort((a, b) => {
                  const ta = a.startTime || "";
                  const tb = b.startTime || "";
                  return ta.localeCompare(tb);
                });
                const slot =
                  sortedSlots.length <= 1 ? [] : sortedSlots[0];

                const dayPart = slot.day || "";
                const timePart =
                  slot.startTime && slot.endTime
                    ? `${slot.startTime} - ${slot.endTime}`
                    : "";
                const datePart = firstClass.startDate
                  ? new Date(firstClass.startDate).toLocaleDateString()
                  : "";

                const pieces = [dayPart, timePart, datePart].filter(Boolean);
                if (pieces.length) {
                  nextAvailability = pieces.join(", ");
                } else {
                  nextAvailability = "Upcoming slot";
                }
              }
            }
          } catch (e) {
            console.error("Failed to load tutor classes for availability", e);
          }

          // Map API tutor to view model, prefer backend values and fall back to placeholders
          setTutor({
            id: t._id,
            name: t.name,
            avatar: t.avatar,
            // Use expertise from backend when available, otherwise default label
            subject: t.expertise || "Spoken English & Communication",
            // Use backend rating/reviews when available, otherwise fall back to defaults
            rating:
              typeof t.rating === "number" && t.rating > 0 ? t.rating : 4.8,
            reviews:
              typeof t.reviewsCount === "number" && t.reviewsCount > 0
                ? t.reviewsCount
                : 120,
            // Use experience string from backend if present
            experience: t.experience || "5+ Years",
            // Optional rich profile fields with safe fallbacks
            bio:
              t.bio ||
              "Passionate English tutor focused on helping students gain real-world speaking confidence.",
            email: t.email,
            education: t.education || "Certified English Trainer",
            specialties:
              Array.isArray(t.specialties) && t.specialties.length > 0
                ? t.specialties
                : ["Spoken English", "Grammar", "Interview Prep"],
            // High-level availability & response time coming from backend schema / classes
            availability: nextAvailability,
            responseTime: t.responseTime || "< 2 hours",
            // Verification / status / joined date
            verified: !!t.isVerified,
            status: t.status || "INACTIVE",
            joinedDate: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString()
              : null,
            joinedYear: t.createdAt
              ? new Date(t.createdAt).getFullYear()
              : "--",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load tutor details");
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailability = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekStartDate = today.toISOString().split("T")[0];

        const res = await getAvailabilityByTutorId(id, weekStartDate);
        if (res.data?.data) {
          setTutorAvailability(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load tutor availability:", err);
      }
    };

    fetchTutor();
    fetchAvailability();
  }, [id]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // Slots for selected date - now using tutor availability
  const slotsForSelectedDay = useMemo(() => {
    if (!dates[activeDateIndex] || !tutorAvailability) return [];

    const d = dates[activeDateIndex].dateObj;
    const dateStr = d.toISOString().slice(0, 10);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[d.getDay()];

    // Find the availability for this specific date
    const dayAvailability = tutorAvailability.availability?.find(
      (day) => {
        const dayDate = new Date(day.date).toISOString().slice(0, 10);
        return dayDate === dateStr;
      }
    );

    if (!dayAvailability) return [];

    const items = [];
    const isToday = dateStr === todayStr;

    // Get only available slots
    dayAvailability.slots.forEach((slot, idx) => {
      if (!slot.isAvailable) return; // Skip unavailable slots

      const key = `${dateStr}-${slot.startTime}`;
      const isPastToday = isToday && slot.endTime <= currentHHMM;

      items.push({
        key,
        label: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
        isPast: isPastToday,
      });
    });

    // Sort by start time
    return items.sort((a, b) => a.label.localeCompare(b.label));
  }, [activeDateIndex, tutorAvailability, dates, currentHHMM, todayStr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20 text-gray-500">Tutor not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5FF] pt-15 md:pt-4 pb-10">
      {/* Top gradient banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-6 md:py-8 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Tutor avatar + name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="relative flex-shrink-0">
              {tutor.avatar ? (
                <img
                  src={tutor.avatar.startsWith('http') ? tutor.avatar : `http://localhost:8000/${tutor.avatar}`}
                  alt={tutor.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white/20">
                  {tutor.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {tutor.name}
              </h1>
              <p className="text-sm md:text-base opacity-80">
                {tutor.subject}
              </p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 mb-6">
            <div className="bg-white text-indigo-700 rounded-2xl px-4 py-2 md:px-6 md:py-3 text-center text-sm shadow-lg min-w-[120px] md:min-w-[130px]">
              <div className="text-xl md:text-2xl font-bold">{tutor.joinedYear}</div>
              <div className="opacity-70 text-xs md:text-sm">Tutor since</div>
            </div>
            <div className="bg-white text-indigo-700 rounded-2xl px-4 py-2 md:px-6 md:py-3 text-center text-sm shadow-lg min-w-[120px] md:min-w-[130px]">
              <div className="text-xl md:text-2xl font-bold">{tutor.reviews}</div>
              <div className="opacity-70 text-xs md:text-sm">Session taken</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20 text-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 md:px-6 pb-2 transition whitespace-nowrap ${activeTab === "about"
                ? "font-semibold border-b-2 border-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className={`px-4 md:px-6 pb-2 transition whitespace-nowrap ${activeTab === "booking"
                ? "font-semibold border-b-2 border-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              Book a Session
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto mt-6 md:mt-8 px-4 md:px-8">
        {/* Back */}
        <Link
          href="/student/allTutors"
          className="flex items-center text-gray-500 hover:text-blue-600 mb-4 md:mb-6 text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Tutors
        </Link>

        {/* About Tab Content */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2 text-blue-600" />
                  About Me
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">{tutor.bio}</p>

                <h3 className="text-xs md:text-sm font-bold uppercase mb-2 md:mb-3 text-gray-700">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
                  <Award size={20} className="mr-2 text-blue-600" />
                  Education
                </h2>
                <p className="text-sm md:text-base text-gray-700 font-medium">{tutor.education}</p>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border shadow-xl lg:sticky lg:top-8">
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <Calendar size={16} className="mr-2" />
                      Next Available
                    </div>
                    <span className="font-bold text-xs md:text-sm text-right">{tutor.availability}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <Mail size={16} className="mr-2" />
                      Response Time
                    </div>
                    <span className="font-bold text-xs md:text-sm">{tutor.responseTime}</span>
                  </div>

                  <div className="flex items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <strong className="text-xs md:text-sm">{tutor.rating}</strong>
                    <span className="text-gray-600 text-xs md:text-sm">({tutor.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600 text-xs md:text-sm">{tutor.experience}</span>
                  </div>

                  {tutor.verified && (
                    <div className="flex items-center justify-center gap-2 p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl">
                      <ShieldCheck size={16} className="text-blue-700" />
                      <span className="text-blue-700 font-semibold text-xs md:text-sm">Verified Tutor</span>
                    </div>
                  )}
                </div>

                <div className="text-center text-gray-500 text-xs space-y-1 mt-2">
                  <p>No payment required to contact the tutor</p>
                  <p className="flex items-center justify-center gap-1 break-all">
                    <Mail size={12} className="flex-shrink-0" /> {tutor.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book a Session Tab Content */}
        {activeTab === "booking" && (
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-5 md:p-8">
            {/* Date strip */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-purple-600" />
                Choose your timing
              </h2>
            </div>

            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
              {dates.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDateIndex(idx)}
                  className={`min-w-[60px] md:min-w-[70px] rounded-xl px-3 py-2 md:px-4 md:py-3 text-center font-semibold border transition flex-shrink-0
                    ${activeDateIndex === idx
                      ? "bg-[#6335F8] text-white border-transparent"
                      : "bg-white text-[#6335F8] border-[#E0D7FF]"
                    }`}
                >
                  <div className="text-xs mb-1">{d.day}</div>
                  <div className="text-base md:text-lg">{d.date}</div>
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="mb-3 text-xs md:text-sm font-medium text-gray-700">
              Choose your timing
            </div>

            {slotsForSelectedDay.length === 0 ? (
              <div className="text-gray-400 text-sm py-8 text-center">
                No available slots for this day.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {slotsForSelectedDay.map((slot) => (
                  <button
                    key={slot.key}
                    disabled={slot.isPast}
                    onClick={() => setSelectedSlotKey(slot.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl border text-xs md:text-sm
                      ${slot.isPast
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200"
                        : selectedSlotKey === slot.key
                          ? "border-[#6335F8] bg-[#6335F8] text-white"
                          : "bg-white hover:border-[#6335F8] text-gray-700"
                      }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border flex-shrink-0
                        ${slot.isPast
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
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center justify-center sm:justify-start text-xs md:text-sm text-gray-500 gap-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span>
                  {tutor.rating} rating • {tutor.reviews} reviews
                </span>
              </div>

              <button
                disabled={!selectedSlotKey}
                className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base shadow-md transition
                  ${selectedSlotKey
                    ? "bg-[#6335F8] text-white hover:bg-[#5128d8]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Continue to book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDetailsView;

