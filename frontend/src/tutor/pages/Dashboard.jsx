"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Video,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { getCourses } from "@/api/course.api";
import { useRouter } from "next/navigation";

const TutorDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  // Fetch tutor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id && !user?._id) return;

      try {
        setLoading(true);
        const tutorId = user.id || user._id;
        const res = await getCourses({ tutorId });
        const data = res?.data;
        setCourses(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Calculate stats from real data
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.published).length,
    withMeetingLink: courses.filter(c => c.meetingLink).length,
    totalRevenue: courses.reduce((sum, c) => sum + (c.price || 0), 0),
  };

  const statsConfig = [
    {
      label: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: <BookOpen size={24} />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Published",
      value: stats.publishedCourses.toString(),
      icon: <CheckCircle size={24} />,
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "With Meeting Links",
      value: stats.withMeetingLink.toString(),
      icon: <Video size={24} />,
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <TrendingUp size={24} />,
      bg: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 md:pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome Section */}
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Welcome back, {user?.name || "Tutor"}! 👋
              </h1>
              <p className="text-slate-600 mt-2 font-medium">
                {courses.length > 0
                  ? `You're managing ${courses.length} course${courses.length > 1 ? 's' : ''}. Keep up the great work!`
                  : "Start by creating your first course to engage with students."
                }
              </p>
            </div>
            <button
              onClick={() => router.push('/tutor/classes')}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <BookOpen size={20} />
              Manage Courses
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Your Courses
              </h3>
              <button
                onClick={() => router.push('/tutor/classes')}
                className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 4).map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group cursor-pointer"
                    onClick={() => router.push('/tutor/classes')}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900">{course.title}</h4>
                        {course.published && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {course.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-black text-blue-600">₹{course.price || 0}</p>
                        {course.meetingLink && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Video size={12} /> Link added
                          </p>
                        )}
                      </div>
                      <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">No courses yet</p>
                <button
                  onClick={() => router.push('/tutor/classes')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Create Your First Course
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black backdrop-blur-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                </div>
                <div>
                  <h4 className="font-black text-lg">{user?.name || 'Tutor'}</h4>
                  <p className="text-blue-100 text-sm">{user?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/tutor/profile/${user?.id || user?._id}`)}
                className="w-full bg-white/20 backdrop-blur-sm text-white py-2 rounded-lg font-bold hover:bg-white/30 transition"
              >
                View Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completion Rate</span>
                  <span className="font-black text-slate-900">
                    {courses.length > 0 ? Math.round((stats.withMeetingLink / courses.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${courses.length > 0 ? (stats.withMeetingLink / courses.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">
                  {stats.withMeetingLink} of {courses.length} courses have meeting links
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/tutor/classes')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-bold text-slate-900">Manage Courses</span>
                </div>
                <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => router.push('/tutor/packages')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Award size={20} />
                  </div>
                  <span className="font-bold text-slate-900">View Packages</span>
                </div>
                <ArrowRight size={20} className="text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
