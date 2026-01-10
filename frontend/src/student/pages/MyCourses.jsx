// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Video,
//   Bell,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// /* ---------------- CONSTANTS ---------------- */

// // Session tabs
// const TABS = ["Upcoming", "Completed", "Cancelled", "Missed", "Pending"];

// // Total pages (API se aayega later)
// const TOTAL_PAGES = 10;

// const MySessions = () => {
//   const router = useRouter();

//   /* ---------------- STATE ---------------- */

//   const [activeTab, setActiveTab] = useState("Upcoming");
//   const [sessions, setSessions] = useState([]);
//   const [tutors, setTutors] = useState([]);
//   const [page, setPage] = useState(1);

//   /* ---------------- EFFECTS ---------------- */

//   useEffect(() => {
//     fetchSessions(activeTab);
//     fetchTutors();
//   }, [activeTab, page]);

//   /* ---------------- DATA FETCHING ---------------- */

//   const fetchSessions = async (status) => {
//     const data = {
//       Upcoming: [],
//       Completed: [],
//       Cancelled: [],
//       Missed: [],
//       Pending: [],
//     };
//     setSessions(data[status]);
//   };

//   const fetchTutors = async () => {
//     setTutors([
//       {
//         id: 1,
//         name: "Radhika Mehta",
//         rating: 4.8,
//         sessions: 539,
//         time: "04:00 PM Jan 9th",
//         img: "https://i.pravatar.cc/150?u=radhika",
//       },
//       {
//         id: 2,
//         name: "Bela",
//         rating: 4.9,
//         sessions: 722,
//         time: "05:00 PM Jan 9th",
//         img: "https://i.pravatar.cc/150?u=bela",
//       },
//       {
//         id: 3,
//         name: "Aisha",
//         rating: 4.8,
//         sessions: 4139,
//         time: "06:00 PM Jan 9th",
//         img: "https://i.pravatar.cc/150?u=aisha",
//       },
//     ]);
//   };

//   /* ---------------- HANDLERS ---------------- */

//   // Book now → redirect to TutorDetailsView
//   const handleBookNow = (tutorId) => {
//     // router.push(`/TutorDetailsView?id=${tutorId}`);
//     router.push("/student/TutorDetailsView");
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="bg-white w-full p-4 md:p-10 text-gray-800">

//       {/* ---------- NOTIFICATION ---------- */}
//       {/* <div className="flex justify-end mb-4">
//         <button className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg text-sm font-semibold">
//           <Bell size={18} /> Notifications
//         </button>
//       </div> */}

//       {/* ---------- HEADER + TABS ---------- */}
//       <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
//         <div>
//           <h1 className="text-xl font-bold">My Sessions</h1>
//           <p className="text-gray-500 text-sm">View your sessions</p>
//         </div>

//         <div className="flex bg-gray-50 border rounded-lg p-1">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-1.5 rounded-md text-sm transition
//                 ${
//                   activeTab === tab
//                     ? "bg-white text-[#6335F8] shadow font-semibold"
//                     : "text-gray-500"
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ---------- EMPTY SESSION STATE ---------- */}
//       {sessions.length === 0 && (
//         <div className="rounded-3xl border bg-purple-50 py-16 flex flex-col items-center mb-12">
//           <div className="text-5xl mb-4">🙄</div>
//           <h3 className="text-lg font-bold mb-6">
//             You have no {activeTab} sessions
//           </h3>
//           <button

//   onClick={() => router.push("/student/myClass")}
//   className="bg-[#6335F8] text-white px-6 py-2.5 rounded-full flex items-center gap-2"
// >
//   Schedule a tutor <Video size={18} />
// </button>
//         </div>
//       )}

//       {/* ---------- BOOK A TRIAL (ROW + SCROLL) ---------- */}
//       <h2 className="text-lg font-bold mb-4">Book a trial</h2>

//       <div className="flex gap-4 overflow-x-auto pb-4 mb-12">
//         {tutors.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="min-w-[260px] border rounded-2xl p-4 hover:shadow transition flex-shrink-0"
//           >
//             <div className="flex gap-3 mb-4">
//               <img
//                 src={tutor.img}
//                 alt={tutor.name}
//                 className="w-12 h-12 rounded-lg object-cover"
//               />
//               <div>
//                 <h4 className="font-bold text-sm">{tutor.name}</h4>
//                 <p className="text-xs text-gray-500">
//                   ★ {tutor.rating} ({tutor.sessions}+ sessions)
//                 </p>
//               </div>
//             </div>

//             <p className="text-xs text-gray-400 uppercase mb-1">
//               Next availability
//             </p>
//             <p className="font-bold text-sm mb-4">{tutor.time}</p>

//             <button
//               onClick={() => handleBookNow(tutor.id)}
//               className="w-full py-2 rounded-xl bg-purple-50 text-[#6335F8] font-bold
//                          hover:bg-[#6335F8] hover:text-white transition"
//             >
//               Book now
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* ---------- PAGINATION (NUMBERS) ---------- */}
//       <div className="flex justify-center items-center gap-2 mt-10">

//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-3 py-1 border rounded disabled:opacity-40"
//         >
//           <ChevronLeft size={16} />
//         </button>

//         {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
//           const pageNumber = i + 1;
//           return (
//             <button
//               key={pageNumber}
//               onClick={() => setPage(pageNumber)}
//               className={`px-3 py-1 rounded font-semibold text-sm
//                 ${
//                   page === pageNumber
//                     ? "bg-[#6335F8] text-white"
//                     : "border text-gray-600 hover:bg-gray-100"
//                 }`}
//             >
//               {pageNumber}
//             </button>
//           );
//         })}

//         <button
//           disabled={page === TOTAL_PAGES}
//           onClick={() => setPage(page + 1)}
//           className="px-3 py-1 border rounded disabled:opacity-40"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MySessions;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { getTutors } from "@/api/tutorApi";
import { getStudentClasses } from "@/api/student.api";

const TABS = ["Upcoming", "Completed", "Cancelled", "Missed", "Pending"];
const TOTAL_PAGES = 5;

const MySessions = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [tutorError, setTutorError] = useState(null);

  useEffect(() => {
    // keep sessions empty for now
    setSessions([]);
  }, [activeTab]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutors();
        const rawTutors = (res.data?.data || []).slice(0, 8);

        const apiTutors = await Promise.all(
          rawTutors.map(async (t, index) => {
            const id = t._id || index;
            let nextAvailability = "No upcoming classes";

            try {
              const classesRes = await getStudentClasses({ tutorId: id });
              const classes = classesRes.data?.data || classesRes.data || [];

              if (Array.isArray(classes) && classes.length > 0) {
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
                  const datePart = !firstClass.startDate
                    ? new Date(firstClass.startDate).toLocaleDateString() +
                      "-" +
                      new Date(firstClass.endDate).toLocaleDateString()
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
              console.error(
                "Failed to load classes for tutor availability in MySessions",
                e
              );
            }

            return {
              id,
              name: t.name,
              sessions: Math.floor(Math.random() * 1000) + 100,
              time: nextAvailability,
              img: `https://i.pravatar.cc/150?u=${t.email}`,
            };
          })
        );

        setTutors(apiTutors);
      } catch (err) {
        console.error(err);
        setTutorError("Failed to load tutors");
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-[#FBFCFF] min-h-screen">
      {/* ---------- HEADER SECTION ---------- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Sessions
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage your learning journey and schedule
          </p>
        </div>

        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-100 overflow-x-auto max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-[#6335F8] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="grid grid-cols-1 gap-10">
        {/* EMPTY STATE REDESIGN */}
        {sessions.length === 0 && (
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-purple-100 bg-white p-12 md:p-20 flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6">
              <Calendar size={40} className="text-[#6335F8]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              No {activeTab} sessions yet
            </h3>
            <p className="text-gray-500 max-w-xs mb-8 font-medium">
              It looks like you haven't scheduled any lessons in this category.
              Start your journey today!
            </p>
            <button
              onClick={() => router.push("/student/myClass")}
              className="bg-[#6335F8] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-[#6335F8]/30 hover:scale-105 transition-transform"
            >
              Find a Tutor <Video size={20} />
            </button>
          </div>
        )}

        {/* ---------- RECOMMENDATIONS / BOOK A TRIAL ---------- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <LayoutGrid size={20} className="text-[#6335F8]" />
              Book a Trial Session
            </h2>
            <button className="text-sm font-bold text-[#6335F8] hover:underline">
              View All
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="min-w-[280px] group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-[#6335F8]/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={tutor.img}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-purple-50 transition-all"
                    />
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-lg border-2 border-white">
                      <Star size={12} className="fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{tutor.name}</h4>
                    <p className="text-xs font-bold text-gray-400">
                      {tutor.sessions}+ Sessions
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock size={10} /> Next Available
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {tutor.time}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/student/tutor/${tutor.id}`)}
                  className="w-full py-3.5 rounded-xl bg-purple-50 text-[#6335F8] font-black text-sm hover:bg-[#6335F8] hover:text-white transition-all shadow-sm group-hover:shadow-md"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- MODERN PAGINATION ---------- */}
      <div className="flex flex-col items-center gap-4 mt-16">
        <div className="flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {[1, 2, 3, "...", TOTAL_PAGES].map((item, i) => (
              <button
                key={i}
                onClick={() => typeof item === "number" && setPage(item)}
                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                  page === item
                    ? "bg-[#6335F8] text-white shadow-lg shadow-[#6335F8]/20"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            disabled={page === TOTAL_PAGES}
            onClick={() => setPage(page + 1)}
            className="p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySessions;
