"use client";

import React, { useEffect, useState } from "react";
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
 

const TutorDetailsView = ({ id: propId }) => {
  const params = useParams();
  const routeId = params?.id;
  const id = propId || routeId;

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            const classes = classesRes.data?.data || classesRes.data || [];

            if (Array.isArray(classes) && classes.length > 0) {
              // pick earliest class by startDate, then earliest slot within that class
              const sortedClasses = [...classes].sort(
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
                const slot = sortedSlots[0];

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
            // Use expertise from backend when available, otherwise default label
            subject: t.expertise || "Spoken English & Communication",
            // Use backend rating/reviews when available, otherwise fall back to defaults
            rating: typeof t.rating === "number" && t.rating > 0 ? t.rating : 4.8,
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
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load tutor details");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

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
      <div className="text-center py-20 text-gray-500">
        Tutor not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Back */}
      <Link
        href="/student/tutors"
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Tutors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm flex gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                {tutor.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 rounded-full border-4 border-white"></div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold">{tutor.name}</h1>
                {tutor.verified && (
                  <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <ShieldCheck size={14} className="mr-1" /> Verified
                  </span>
                )}
              </div>

              <p className="text-lg text-blue-600 font-medium mb-1">
                {tutor.subject}
              </p>

              {tutor.joinedDate && (
                <p className="text-xs text-gray-400 mb-2">
                  Joined on {tutor.joinedDate}
                </p>
              )}

              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-400 fill-current mr-1" />
                  <strong>{tutor.rating}</strong>
                  <span className="ml-1">
                    ({tutor.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-1 text-gray-400" />
                  {tutor.experience}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen size={22} className="mr-2 text-blue-600" />
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {tutor.bio}
            </p>

            <h3 className="text-sm font-bold uppercase mb-3 text-gray-700">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.specialties.map((s, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-4 py-2 rounded-xl text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Award size={22} className="mr-2 text-blue-600" />
              Education
            </h2>
            <p className="text-gray-700 font-medium">
              {tutor.education}
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR (NO PRICE) */}
        <div>
          <div className="bg-white rounded-3xl p-6 border shadow-xl sticky top-8">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  Next Available
                </div>
                <span className="font-bold">
                  {tutor.availability}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-2" />
                  Response Time
                </div>
                <span className="font-bold">
                  {tutor.responseTime}
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 mb-4">
              Book a Lesson
            </button>

            <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 mb-3">
              Send Message
            </button>

            <div className="text-center text-gray-500 text-xs space-y-1 mt-2">
              <p>No payment required to contact the tutor</p>
              <p className="flex items-center justify-center gap-1">
                <Mail size={12} /> {tutor.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsView;
