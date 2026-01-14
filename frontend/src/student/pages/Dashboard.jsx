// "use client";

// import { useEffect, useState } from "react";
// import {
//   BookOpen,
//   Clock,
//   Trophy,
//   Star,
//   LayoutDashboard,
// } from "lucide-react";

// const Dashboard = () => {
//   /* ---------------- STATE ---------------- */

//   // Logged-in user data
//   const [user, setUser] = useState(null);

//   /* ---------------- EFFECTS ---------------- */

//   // Fetch user from localStorage (client-side only)
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const raw = localStorage.getItem("user");
//     setUser(raw ? JSON.parse(raw) : null);
//   }, []);

//   /* ---------------- MOCK STATS (API READY) ---------------- */

//   const userStats = {
//     weeklyProgress: 72, // % progress
//   };

//   // Cards configuration
//   const statsConfig = [
//     {
//       label: "Completed",
//       value: "12",
//       icon: <BookOpen />,
//       bg: "bg-blue-50 text-blue-600",
//     },
//     {
//       label: "Hours",
//       value: "128h",
//       icon: <Clock />,
//       bg: "bg-orange-50 text-orange-600",
//     },
//     {
//       label: "Points",
//       value: "2,450",
//       icon: <Trophy />,
//       bg: "bg-yellow-50 text-yellow-600",
//     },
//     {
//       label: "Streak",
//       value: "8 Days",
//       icon: <Star />,
//       bg: "bg-purple-50 text-purple-600",
//     },
//   ];

//   /* ---------------- UI ---------------- */

//   return (
//     // FULL WIDTH / NO EXTRA MARGINS
//     <div className="w-full min-h-screen bg-gray-50">
      
//       {/* MAIN CONTENT AREA */}
//       <main className="w-full space-y-8">

//         {/* ---------- WELCOME SECTION ---------- */}
//         <div className="px-6 pt-6 animate-in fade-in slide-in-from-left duration-700">
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//             Welcome, {user?.name || "Student"} 👋
//           </h1>

//           <p className="text-slate-500 mt-1 font-medium">
//             You've reached{" "}
//             <b className="text-[#0852A1] font-black">
//               {userStats.weeklyProgress}%
//             </b>{" "}
//             of your weekly goal. Keep it up!
//           </p>
//         </div>

//         {/* ---------- STATS GRID ---------- */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
//           {statsConfig.map((s, i) => (
//             <div
//               key={i}
//               className="bg-white p-6 rounded-3xl border border-gray-100
//                          hover:shadow-md transition-all active:scale-95"
//             >
//               {/* Icon */}
//               <div
//                 className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}
//               >
//                 {s.icon}
//               </div>

//               {/* Label */}
//               <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">
//                 {s.label}
//               </p>

//               {/* Value */}
//               <h3 className="text-2xl font-black text-slate-800">
//                 {s.value}
//               </h3>
//             </div>
//           ))}
//         </div>

//         {/* ---------- ACTIVITY SECTION ---------- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">

//           {/* WEEKLY PROGRESS */}
//           <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-gray-800">Weekly Progress</h3>
//               <span className="text-xs text-[#0852A1] font-bold cursor-pointer">
//                 View Report
//               </span>
//             </div>

//             {/* Placeholder Chart */}
//             <div className="h-48 w-full bg-gray-50 rounded-2xl border-2 border-dashed
//                             border-gray-200 flex flex-col items-center justify-center text-gray-400">
//               <LayoutDashboard size={32} className="mb-2 opacity-20" />
//               <p className="text-sm font-medium">
//                 Chart data will appear here
//               </p>
//             </div>
//           </div>

//           {/* UPCOMING CLASSES */}
//           <div className="bg-white rounded-[2rem] border border-gray-100 p-8">
//             <h3 className="font-bold text-gray-800 mb-6">
//               Upcoming Classes
//             </h3>

//             <div className="space-y-4">
//               {/* Example class */}
//               <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
//                 <div className="bg-white p-2 rounded-xl text-[#0852A1] font-bold text-xs text-center min-w-[50px]">
//                   10:00<br />AM
//                 </div>

//                 <div>
//                   <p className="text-sm font-bold text-gray-800">
//                     English Speaking
//                   </p>
//                   <p className="text-[10px] text-gray-500">
//                     Live with Dr. Sarah
//                   </p>
//                 </div>
//               </div>

//               {/* Empty note */}
//               <p className="text-center text-xs text-gray-400">
//                 No other classes scheduled for today.
//               </p>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  const userStats = { weeklyProgress: 72 };

  const statsConfig = [
    { label: "Completed", value: "12", icon: <BookOpen size={20} />, bg: "bg-blue-50 text-blue-600" },
    { label: "Hours", value: "128h", icon: <Clock size={20} />, bg: "bg-orange-50 text-orange-600" },
    { label: "Points", value: "2,450", icon: <Trophy size={20} />, bg: "bg-yellow-50 text-yellow-600" },
    { label: "Streak", value: "8 Days", icon: <Star size={20} />, bg: "bg-purple-50 text-purple-600" },
  ];

  return (
    // Added pt-20 for mobile to clear the fixed mobile header, and pb-10 for breathing room
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-20 md:pt-6 pb-10">
      
      <main className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">

        {/* ---------- WELCOME SECTION ---------- */}
        <div className="px-4 sm:px-6 animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name || "Student"} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">
            You've reached{" "}
            <span className="text-blue-600 font-black">
              {userStats.weeklyProgress}%
            </span>{" "}
            of your weekly goal.
          </p>
        </div>

        {/* ---------- STATS GRID ---------- */}
        {/* Adjusted grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-6">
          {statsConfig.map((s, i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100
                         hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-95"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${s.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                {s.icon}
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                {s.label}
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800">
                {s.value}
              </h3>
            </div>
          ))}
        </div>

        {/* ---------- ACTIVITY SECTION ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6">

          {/* WEEKLY PROGRESS - Spans 2 cols on desktop */}
          <div className="lg:col-span-2 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <LayoutDashboard size={18} className="text-blue-600" />
                Weekly Progress
              </h3>
              <button className="text-xs text-blue-600 font-bold hover:underline">
                View Report
              </button>
            </div>

            {/* Placeholder Chart */}
            <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl border-2 border-dashed
                            border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
              <div className="animate-pulse bg-slate-200 w-12 h-12 rounded-full mb-3" />
              <p className="text-xs sm:text-sm font-medium text-center">
                Visual analytics will be displayed here as you complete sessions.
              </p>
            </div>
          </div>

          {/* UPCOMING CLASSES */}
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600" />
              Upcoming Classes
            </h3>

            <div className="space-y-3">
              {/* Example class */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 group hover:bg-blue-50 transition-colors">
                <div className="bg-white p-2 rounded-xl text-blue-600 font-black text-[10px] sm:text-xs text-center min-w-[55px] shadow-sm">
                  10:00<br />AM
                </div>

                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">
                    English Speaking
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Live with Dr. Sarah
                  </p>
                </div>
              </div>

              {/* Empty state / Action */}
              <div className="pt-4">
                <p className="text-center text-[11px] text-slate-400 mb-4 font-medium">
                  No other classes scheduled for today.
                </p>
                <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all">
                  + Schedule New Class
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;