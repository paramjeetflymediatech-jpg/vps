"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { getTutors } from "@/api/tutorApi";
import { getStudentClasses } from "@/api/student.api";

const TABS = ["Upcoming", "Completed", "Cancelled", "Missed", "Pending"];
const ITEMS_PER_PAGE = 6;

const MySessions = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  /* 🔁 Reset sessions + page when tab changes */
  useEffect(() => {
    setSessions([]);
    setPage(1);
  }, [activeTab]);

  /* 📡 Fetch tutors */
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutors();
        const rawTutors = res.data?.data || [];

        const apiTutors = await Promise.all(
          rawTutors.map(async (t, index) => {
            const id = t._id || index;
            let nextAvailability = "No upcoming classes";

            try {
              const classesRes = await getStudentClasses({ tutorId: id });
              const classes = classesRes.data?.data || [];
              const slot = classes?.[0]?.schedule?.[0];

              if (slot) {
                nextAvailability = `${slot.day}, ${slot.startTime}`;
              }
            } catch { }

            return {
              id,
              name: t.name,
              sessions: Math.floor(Math.random() * 500) + 50,
              time: nextAvailability,
              img: `https://i.pravatar.cc/150?u=${t.email}`,
            };
          })
        );

        setTutors(apiTutors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  /* 📄 Pagination logic */
  const TOTAL_PAGES = Math.max(
    1,
    Math.ceil(tutors.length / ITEMS_PER_PAGE)
  );

  const paginatedTutors = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return tutors.slice(start, start + ITEMS_PER_PAGE);
  }, [tutors, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 bg-[#FBFCFF] min-h-screen pt-20">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black">My Sessions</h1>
          <p className="text-gray-500 font-medium">
            Manage your learning journey
          </p>
        </div>

        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${activeTab === tab
                  ? "bg-white text-[#6335F8] shadow"
                  : "text-gray-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {sessions.length === 0 && (
        <div className="bg-white border-dashed border-2 rounded-3xl p-14 text-center mb-12">
          <Calendar className="mx-auto mb-4 text-[#6335F8]" size={40} />
          <h3 className="text-2xl font-black mb-2">
            No {activeTab} sessions
          </h3>
          <p className="text-gray-500 mb-6">
            Start by booking a trial session
          </p>
          <button
            onClick={() => router.push("/student/myClass")}
            className="bg-[#6335F8] text-white px-8 py-4 rounded-2xl font-bold"
          >
            Find a Tutor
          </button>
        </div>
      )}

      {/* RECOMMENDED TUTORS */}
      <div>
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black flex gap-2 items-center">
            <LayoutGrid size={20} /> Book a Trial Session
          </h2>
          <Link href="/student/allTutors" className="text-[#6335F8] font-bold">
            View All
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white p-6 rounded-3xl border hover:shadow-xl transition"
            >
              <div className="flex gap-4 mb-4">
                <img
                  src={tutor.img}
                  className="w-16 h-16 rounded-2xl"
                  alt=""
                />
                <div>
                  <h4 className="font-black">{tutor.name}</h4>
                  <p className="text-xs text-gray-400 font-bold">
                    {tutor.sessions}+ Sessions
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                <p className="text-[10px] uppercase font-black text-gray-400 flex gap-1">
                  <Clock size={10} /> Next Available
                </p>
                <p className="font-bold text-sm">{tutor.time}</p>
              </div>

              <button
                onClick={() =>
                  router.push(`/CoursesPricing?tutorId=${tutor.id}`)
                }
                className="w-full py-3 rounded-xl bg-purple-50 text-[#6335F8] font-black hover:bg-[#6335F8] hover:text-white transition"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-16">
        <div className="flex bg-white p-2 rounded-2xl border shadow">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <span className="px-4 font-black text-gray-500">
            Page {page} of {TOTAL_PAGES}
          </span>

          <button
            disabled={page === TOTAL_PAGES}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySessions;
