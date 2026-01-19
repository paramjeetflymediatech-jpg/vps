"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  LayoutDashboard,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { getStudentEnrollments } from "@/api/student.api";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await getStudentEnrollments();
        const data = res.data?.data || [];
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Calculate stats from real data
  const stats = {
    completed: enrollments.filter(e => e.status === 'COMPLETED').length,
    upcoming: enrollments.filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING').length,
    hours: enrollments.length * 2, // Estimate 2 hours per enrollment
    streak: 0, // Can be calculated based on attendance later
  };

  // Get upcoming classes (next 3)
  const upcomingClasses = enrollments
    .filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  // Calculate weekly progress (completed vs total)
  const weeklyProgress = enrollments.length > 0
    ? Math.round((stats.completed / enrollments.length) * 100)
    : 0;

  const statsConfig = [
    {
      label: "Enrolled Courses",
      value: enrollments.length.toString(),
      icon: <BookOpen size={20} />,
      bg: "bg-blue-50 text-blue-600"
    },
    {
      label: "Total Hours",
      value: `${stats.hours}h`,
      icon: <Clock size={20} />,
      bg: "bg-orange-50 text-orange-600"
    },
    {
      label: "Completed",
      value: stats.completed.toString(),
      icon: <Trophy size={20} />,
      bg: "bg-green-50 text-green-600"
    },
    {
      label: "Upcoming",
      value: stats.upcoming.toString(),
      icon: <Star size={20} />,
      bg: "bg-purple-50 text-purple-600"
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-20 md:pt-6 pb-10">

      <main className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">

        {/* ---------- WELCOME SECTION ---------- */}
        <div className="px-4 sm:px-6 animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">
            {enrollments.length > 0 ? (
              <>
                You've completed{" "}
                <span className="text-blue-600 font-black">
                  {weeklyProgress}%
                </span>{" "}
                of your enrolled courses. Keep going!
              </>
            ) : (
              "Get started by enrolling in your first course!"
            )}
          </p>
        </div>

        {/* ---------- STATS GRID ---------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-6">
          {statsConfig.map((s, i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100
                         hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-95 cursor-pointer"
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

          {/* PROGRESS OVERVIEW */}
          <div className="lg:col-span-2 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <LayoutDashboard size={18} className="text-blue-600" />
                Your Progress
              </h3>
              <button
                onClick={() => router.push('/student/courses')}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : enrollments.length > 0 ? (
              <div className="space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600">Overall Completion</span>
                    <span className="font-black text-blue-600">{weeklyProgress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${weeklyProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course list */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-slate-700">Recent Enrollments</h4>
                  {enrollments.slice(0, 3).map((enrollment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{enrollment.title || enrollment.course?.title || 'Course'}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Status: <span className={`font-bold ${enrollment.status === 'COMPLETED' ? 'text-green-600' :
                              enrollment.status === 'ONGOING' ? 'text-blue-600' :
                                'text-orange-600'
                            }`}>{enrollment.status}</span>
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${enrollment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          enrollment.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                        {enrollment.status === 'COMPLETED' ? '✓' :
                          enrollment.status === 'ONGOING' ? '⟳' : '○'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl border-2 border-dashed
                              border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
                <BookOpen size={48} className="mb-3 opacity-20" />
                <p className="text-xs sm:text-sm font-medium text-center mb-4">
                  You haven't enrolled in any courses yet.
                </p>
                <button
                  onClick={() => router.push('/student/packages')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
                >
                  Browse Packages
                </button>
              </div>
            )}
          </div>

          {/* UPCOMING CLASSES */}
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 p-5 sm:p-8 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600" />
              Upcoming Classes
            </h3>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls, i) => {
                  const startDate = new Date(cls.startDate);
                  const time = cls.schedule?.[0]?.startTime || '10:00';

                  return (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 group hover:bg-blue-50 transition-colors">
                      <div className="bg-white p-2 rounded-xl text-blue-600 font-black text-[10px] sm:text-xs text-center min-w-[55px] shadow-sm">
                        {time}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-800">
                          {cls.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {cls.tutor?.name ? `with ${cls.tutor.name}` : startDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="pt-4">
                  <p className="text-center text-[11px] text-slate-400 mb-4 font-medium">
                    No upcoming classes scheduled.
                  </p>
                  <button
                    onClick={() => router.push('/student/myClass')}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    + Book a Session
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;