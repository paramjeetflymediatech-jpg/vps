// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// import {
//   Video,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Clock,
//   LayoutGrid,
// } from "lucide-react";
// import { getTutors } from "@/api/tutorApi";
// import { getStudentClasses } from "@/api/student.api";

// const TABS = ["Upcoming", "Completed", "Cancelled", "Missed", "Pending"];
// const TOTAL_PAGES = 5;

// const MySessions = () => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("Upcoming");
//   const [sessions, setSessions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [tutors, setTutors] = useState([]);
//   const [loadingTutors, setLoadingTutors] = useState(true);
//   const [tutorError, setTutorError] = useState(null);

//   useEffect(() => {
//     // keep sessions empty for now
//     setSessions([]);
//   }, [activeTab]);

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const res = await getTutors();
//         const rawTutors = (res.data?.data || []).slice(0, 8);

//         const apiTutors = await Promise.all(
//           rawTutors.map(async (t, index) => {
//             const id = t._id || index;
//             let nextAvailability = "No upcoming classes";

//             try {
//               const classesRes = await getStudentClasses({ tutorId: id });
//               const classes = classesRes.data?.data || classesRes.data || [];

//               if (Array.isArray(classes) && classes.length > 0) {
//                 const sortedClasses = [...classes].sort(
//                   (a, b) => new Date(a.startDate) - new Date(b.startDate)
//                 );
//                 const firstClass = sortedClasses[0];
//                 const schedule = Array.isArray(firstClass.schedule)
//                   ? firstClass.schedule
//                   : [];

//                 if (schedule.length > 0) {
//                   const sortedSlots = [...schedule].sort((a, b) => {
//                     const ta = a.startTime || "";
//                     const tb = b.startTime || "";
//                     return ta.localeCompare(tb);
//                   });
//                   const slot = sortedSlots[0];

//                   const dayPart = slot.day || "";
//                   const timePart =
//                     slot.startTime && slot.endTime
//                       ? `${slot.startTime} - ${slot.endTime}`
//                       : "";
//                   const datePart = !firstClass.startDate
//                     ? new Date(firstClass.startDate).toLocaleDateString() +
//                       "-" +
//                       new Date(firstClass.endDate).toLocaleDateString()
//                     : "";

//                   const pieces = [dayPart, timePart, datePart].filter(Boolean);
//                   if (pieces.length) {
//                     nextAvailability = pieces.join(", ");
//                   } else {
//                     nextAvailability = "Upcoming slot";
//                   }
//                 }
//               }
//             } catch (e) {
//               console.error(
//                 "Failed to load classes for tutor availability in MySessions",
//                 e
//               );
//             }

//             return {
//               id,
//               tutorId: t.id,
//               name: t.name,
//               sessions: Math.floor(Math.random() * 1000) + 100,
//               time: nextAvailability,
//               img: `https://i.pravatar.cc/150?u=${t.email}`,
//             };
//           })
//         );

//         setTutors(apiTutors);
//       } catch (err) {
//         console.error(err);
//         setTutorError("Failed to load tutors");
//       } finally {
//         setLoadingTutors(false);
//       }
//     };

//     fetchTutors();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 bg-[#FBFCFF] min-h-screen">
//       {/* ---------- HEADER SECTION ---------- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//             My Sessions
//           </h1>
//           <p className="text-gray-500 font-medium mt-1">
//             Manage your learning journey and schedule
//           </p>
//         </div>

//         <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-100 overflow-x-auto max-w-full">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
//                 activeTab === tab
//                   ? "bg-white text-[#6335F8] shadow-sm"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ---------- MAIN CONTENT AREA ---------- */}
//       <div className="grid grid-cols-1 gap-10">
//         {/* EMPTY STATE REDESIGN */}
//         {sessions.length === 0 && (
//           <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-purple-100 bg-white p-12 md:p-20 flex flex-col items-center text-center">
//             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
//             <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6">
//               <Calendar size={40} className="text-[#6335F8]" />
//             </div>
//             <h3 className="text-2xl font-black text-gray-900 mb-2">
//               No {activeTab} sessions yet
//             </h3>
//             <p className="text-gray-500 max-w-xs mb-8 font-medium">
//               It looks like you haven't scheduled any lessons in this category.
//               Start your journey today!
//             </p>
//             <button
//               onClick={() => router.push("/student/myClass")}
//               className="bg-[#6335F8] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-[#6335F8]/30 hover:scale-105 transition-transform"
//             >
//               Find a Tutor <Video size={20} />
//             </button>
//           </div>
//         )}

//         {/* ---------- RECOMMENDATIONS / BOOK A TRIAL ---------- */}
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
//               <LayoutGrid size={20} className="text-[#6335F8]" />
//               Book a Trial Session
//             </h2>
//             <Link
//               href="/student/allTutors"
//               className="text-sm font-bold text-[#6335F8] hover:underline inline-block"
//             >
//               View All
//             </Link>
//           </div>

//           <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
//             {tutors.map((tutor) => (
//               <div
//                 key={tutor.id}
//                 className="min-w-[280px] group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-[#6335F8]/5 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="relative">
//                     <img
//                       src={tutor.img}
//                       alt={tutor.name}
//                       className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-purple-50 transition-all"
//                     />
//                     <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-lg border-2 border-white">
//                       <Star size={12} className="fill-current" />
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-black text-gray-900">{tutor.name}</h4>
//                     <p className="text-xs font-bold text-gray-400">
//                       {tutor.sessions}+ Sessions
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-2xl p-4 mb-6">
//                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
//                     <Clock size={10} /> Next Available
//                   </p>
//                   <p className="font-bold text-sm text-gray-800">
//                     {tutor.time}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() =>
//                     router.push(`/student/book-session/${tutor.id}`)
//                   }
//                   className="w-full py-3.5 rounded-xl bg-purple-50 text-[#6335F8] cursor-pointer font-black text-sm hover:bg-[#6335F8] hover:text-white transition-all shadow-sm group-hover:shadow-md"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ---------- MODERN PAGINATION ---------- */}
//       <div className="flex flex-col items-center gap-4 mt-16">
//         <div className="flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//             className="p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           <div className="flex items-center gap-1 mx-2">
//             {/* First page */}
//             <button
//               onClick={() => setPage(1)}
//               className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
//                 page === 1
//                   ? "bg-[#6335F8] text-white shadow-lg shadow-[#6335F8]/20"
//                   : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
//               }`}
//             >
//               1
//             </button>

//             {/* Ellipsis or pages 2 to TOTAL_PAGES-1 */}
//             {TOTAL_PAGES > 3 && (
//               <>
//                 {page > 2 && (
//                   <span className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm font-black">
//                     ...
//                   </span>
//                 )}

//                 {page > 1 && page < TOTAL_PAGES && (
//                   <button
//                     onClick={() => setPage(page)}
//                     className="w-10 h-10 rounded-xl text-sm font-black bg-[#6335F8] text-white shadow-lg shadow-[#6335F8]/20"
//                   >
//                     {page}
//                   </button>
//                 )}

//                 {page < TOTAL_PAGES - 1 && (
//                   <span className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm font-black">
//                     ...
//                   </span>
//                 )}
//               </>
//             )}

//             {/* Last page */}
//             {TOTAL_PAGES > 1 && (
//               <button
//                 onClick={() => setPage(TOTAL_PAGES)}
//                 className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
//                   page === TOTAL_PAGES
//                     ? "bg-[#6335F8] text-white shadow-lg shadow-[#6335F8]/20"
//                     : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
//                 }`}
//               >
//                 {TOTAL_PAGES}
//               </button>
//             )}
//           </div>

//           <button
//             disabled={page === TOTAL_PAGES}
//             onClick={() => setPage(page + 1)}
//             className="p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MySessions;




"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
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
                const schedule = Array.isArray(firstClass.schedule) ? firstClass.schedule : [];

                if (schedule.length > 0) {
                  const sortedSlots = [...schedule].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
                  const slot = sortedSlots[0];
                  nextAvailability = `${slot.day || ""}, ${slot.startTime || ""}`;
                }
              }
            } catch (e) {
              console.error("Failed to load classes", e);
            }

            return {
              id,
              tutorId: t.id,
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
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    /* 1. Added pt-20 for mobile: This pushes content down so it doesn't hide behind your fixed mobile header. 
      2. Changed p-6 to p-4 sm:p-6 lg:p-10: More breathing room on desktop, compact on mobile.
    */
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 bg-[#FBFCFF] min-h-screen pt-20 md:pt-10">
      
//       {/* ---------- HEADER SECTION ---------- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
//             My Sessions
//           </h1>
//           <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
//             Manage your learning journey and schedule
//           </p>
//         </div>

//         {/* TABS: Made scrollable on mobile so they don't wrap and look messy. 
//         */}
//         <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
//           <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-100 min-w-max">
//             {TABS.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
//                   activeTab === tab
//                     ? "bg-white text-[#6335F8] shadow-sm"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ---------- MAIN CONTENT AREA ---------- */}
//       <div className="grid grid-cols-1 gap-1">
        
//         {/* EMPTY STATE: Reduced padding for mobile */}
//         {sessions.length === 0 && (
//           <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed border-purple-100 bg-white p-8 sm:p-16 md:p-20 flex flex-col items-center text-center">
//             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6">
//               <Calendar size={32} className="text-[#6335F8]" />
//             </div>
//             <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
//               No {activeTab} sessions yet
//             </h3>
//             <p className="text-sm sm:text-base text-gray-500 max-w-xs mb-8 font-medium">
//               It looks like you haven't scheduled any lessons in this category.
//             </p>
//             <button
//               onClick={() => router.push("/student/myClass")}
//               className=" sm:w-auto bg-[#6335F8] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-transform"
//             >
//               Find a Tutor <Video size={20} />
//             </button>
//           </div>
//         )}

//         {/* ---------- RECOMMENDATIONS ---------- */}
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
//               <LayoutGrid size={20} className="text-[#6335F8]" />
//               Book a Trial Session
//             </h2>
//             <Link
//               href="/student/allTutors"
//               className="text-xs sm:text-sm font-bold text-[#6335F8] hover:underline"
//             >
//               View All
//             </Link>
//           </div>

//           {/* Tutor Cards: Use horizontal scroll on mobile, but grid layout would also work. 
//             Here, we maintain your scrollable design but improve the touch experience.
//           */}
//           <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 no-scrollbar snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
//             {tutors.map((tutor) => (
//               <div
//                 key={tutor.id}
//                 className="min-w-[260px] sm:min-w-[280px] snap-start group bg-white border border-gray-100 rounded-[2rem] p-5 sm:p-6 hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4 mb-5">
//                   <div className="relative">
//                     <img
//                       src={tutor.img}
//                       alt={tutor.name}
//                       className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-4 ring-gray-50"
//                     />
//                     <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-1 rounded-lg border-2 border-white">
//                       <Star size={10} className="fill-current" />
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-black text-gray-900 text-sm sm:text-base">{tutor.name}</h4>
//                     <p className="text-[10px] sm:text-xs font-bold text-gray-400">
//                       {tutor.sessions}+ Sessions
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-2xl p-4 mb-6">
//                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
//                     <Clock size={10} /> Next Available
//                   </p>
//                   <p className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-1">
//                     {tutor.time}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => router.push(`/student/book-session/${tutor.id}`)}
//                   className="w-full py-3 rounded-xl bg-purple-50 text-[#6335F8] font-black text-xs sm:text-sm hover:bg-[#6335F8] hover:text-white transition-all shadow-sm"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//     {/* ---------- MODERN PAGINATION ---------- */}
// <div className="flex flex-col items-center gap-4 mt-12 sm:mt-16">
//   <div className="flex items-center bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-100 shadow-sm">
//     <button
//       disabled={page === 1}
//       onClick={() => setPage(page - 1)}
//       className="p-1 sm:p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//     >
//       {/* Use className for responsive sizing instead of props */}
//       <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//     </button>

//     <div className="flex items-center gap-1 mx-2">
//       <span className="md:hidden text-xs font-black text-gray-500 px-2">
//         Page {page} of {TOTAL_PAGES}
//       </span>

//       <div className="hidden md:flex items-center gap-1">
//          <button className="w-10 h-10 rounded-xl text-sm font-black bg-[#6335F8] text-white">
//            {page}
//          </button>
//       </div>
//     </div>

//     <button
//       disabled={page === TOTAL_PAGES}
//       onClick={() => setPage(page + 1)}
//       className="p-1 sm:p-2 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//     >
//       {/* Use className for responsive sizing instead of props */}
//       <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
//     </button>
//   </div>
// </div>
//     </div>


<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 bg-[#FBFCFF] min-h-screen pt-20 md:pt-10">
  
  {/* ================= HEADER SECTION ================= */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
        My Sessions
      </h1>
      <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
        Manage your learning journey and schedule
      </p>
    </div>

    {/* ================= TABS (WRAP, NO SCROLL) ================= */}
    <div className="w-full lg:w-auto">
      <div className="flex flex-wrap bg-gray-100/80 p-1.5 rounded-2xl border border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
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
  </div>

  {/* ================= MAIN CONTENT ================= */}
  <div className="grid grid-cols-1 gap-6">

    {/* ================= EMPTY STATE ================= */}
    {sessions.length === 0 && (
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-purple-100 bg-white p-8 sm:p-16 md:p-20 flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6">
          <Calendar size={32} className="text-[#6335F8]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
          No {activeTab} sessions yet
        </h3>

        <p className="text-sm sm:text-base text-gray-500 max-w-xs mb-8 font-medium">
          It looks like you haven't scheduled any lessons in this category.
        </p>

        <button
          onClick={() => router.push("/student/myClass")}
          className="bg-[#6335F8] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:scale-105 transition-transform"
        >
          Find a Tutor <Video size={20} />
        </button>
      </div>
    )}

    {/* ================= RECOMMENDATIONS ================= */}
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
          <LayoutGrid size={20} className="text-[#6335F8]" />
          Book a Trial Session
        </h2>

        <Link
          href="/student/allTutors"
          className="text-xs sm:text-sm font-bold text-[#6335F8] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* ================= TUTOR GRID (NO SCROLL) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white border border-gray-100 rounded-[2rem] p-5 sm:p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img
                  src={tutor.img}
                  alt={tutor.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-4 ring-gray-50"
                />
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-1 rounded-lg border-2 border-white">
                  <Star size={10} className="fill-current" />
                </div>
              </div>

              <div>
                <h4 className="font-black text-gray-900 text-sm sm:text-base">
                  {tutor.name}
                </h4>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400">
                  {tutor.sessions}+ Sessions
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <Clock size={10} /> Next Available
              </p>
              <p className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-1">
                {tutor.time}
              </p>
            </div>

            <button
              onClick={() => router.push(`/student/book-session/${tutor.id}`)}
              className="w-full py-3 rounded-xl bg-purple-50 text-[#6335F8] font-black text-xs sm:text-sm hover:bg-[#6335F8] hover:text-white transition-all shadow-sm"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* ================= PAGINATION ================= */}
  <div className="flex justify-center mt-12 sm:mt-16">
    <div className="flex items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="p-2 text-gray-400 disabled:opacity-20"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <span className="px-4 text-xs sm:text-sm font-black text-gray-500">
        Page {page} of {TOTAL_PAGES}
      </span>

      <button
        disabled={page === TOTAL_PAGES}
        onClick={() => setPage(page + 1)}
        className="p-2 text-gray-400 disabled:opacity-20"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  </div>
</div>



  );
};

export default MySessions;