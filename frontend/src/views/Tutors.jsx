import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Calendar, Award, ShieldCheck, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import tutorHeroImg from "../assets/tutorimg.jpg";
import { getTutors } from "../api/tutorApi";

const Tutors = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    limit: 10,
    total: 0
  });

  // Toggle View State
  const [showAll, setShowAll] = useState(false);
  // Default limit when collapsed
  const INITIAL_LIMIT = 6;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      // Fetches 12 per page usually, but we can stick to 10 or 12. 
      // If user wants "View All/Show Less" toggle within a page, 
      // we might fetch more or just handle local slicing.
      // Let's fetch 12 (multiple of 3) for better grid layout.
      const res = await getTutors({ page, limit: 12 });
      if (res.data.success) {
        setTutors(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch tutors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [page]);

  // Client-side search within the current page
  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      (tutor.skills || []).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // If !showAll, slice the array
  const displayedTutors = showAll ? filteredTutors : filteredTutors.slice(0, INITIAL_LIMIT);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-sans text-slate-900">

      {/* ================= MODERN HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-br from-[#0B3C66] to-[#0852A1]">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 text-blue-100 text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
                <ShieldCheck size={16} /> 100% Verified Expert Tutors
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                Unlock Your <br />
                <span className="text-yellow-400">Global Potential</span>
              </h1>
              <p className="mt-6 text-blue-100 text-xl leading-relaxed max-w-lg">
                Connect with world-class English mentors for 1-on-1 sessions. Master IELTS, Business Fluency, and Public Speaking.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  <button className="px-8 py-4 bg-white text-[#0852A1] rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1">
                    Book a Free Trial
                  </button>
                </Link>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0852A1] bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                  <p className="pl-6 text-sm text-blue-100 font-medium">Joined by 10k+ learners</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/10 transition-transform duration-500">
                <img src={tutorHeroImg.src} alt="Tutor" className="w-full h-full object-cover" />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                    <Star fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800">4.9/5</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Average Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SEARCH & FILTER BAR ================= */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-4 flex flex-col md:flex-row gap-4 items-center border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, expertise, or exam (e.g. IELTS)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#0852A1] transition-all text-base"
            />
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
            Find Mentors
          </button>
        </div>
      </div>

      {/* ================= TUTOR LISTINGS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Available Mentors</h2>
            <p className="text-slate-500 mt-2 text-lg">Expert guidance tailored to your goals.</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[#0852A1] font-bold hover:text-[#063d7a] transition-colors flex items-center gap-1 text-sm bg-blue-50 px-4 py-2 rounded-lg"
            >
              {showAll ? "Show Less" : "View All"}
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <p className="text-xs font-bold text-slate-400">
              {loading ? "Loading..." : `${filteredTutors.length} Tutors found`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0852A1]"></div>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xl font-medium">No tutors found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {displayedTutors.map((tutor) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={tutor._id || tutor.id}
                  className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col items-center text-center h-full relative overflow-hidden"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Profile Visuals */}
                  <div className="relative inline-block mb-6 mt-2">
                    <img
                      src={tutor.image || "https://dummyimage.com/150x150/cccccc/000000&text=Tutor"}
                      alt={tutor.name}
                      className="w-32 h-32 rounded-full shadow-lg object-cover group-hover:scale-105 transition-transform duration-500 border-4 border-white ring-1 ring-slate-100"
                    />
                    {/* Status Dot */}
                    <div className="absolute bottom-2 right-2 bg-emerald-500 border-[3px] border-white w-5 h-5 rounded-full shadow-sm" />
                  </div>

                  {/* Rating & Exp Badge */}
                  <div className="flex items-center justify-center gap-3 mb-5 w-full">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100">
                      <Star size={12} fill="currentColor" />
                      {tutor.rating || "5.0"} <span className="text-yellow-600/60 font-medium">({tutor.reviewsCount || 10}+)</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                      <Award size={12} />
                      {tutor.experience || "3+ Years"} Exp
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="mb-4 px-2 w-full">
                    <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-[#0852A1] transition-colors">{tutor.name}</h3>
                    <p className="text-[#0852A1] font-bold text-sm tracking-wide uppercase opacity-90 line-clamp-1">{tutor.title || "Certified English Expert"}</p>
                  </div>

                  {/* Bio (Truncated) */}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 px-4 min-h-[40px]">
                    {tutor.bio || tutor.about || "Passionate about helping students achieve fluency and confidence in English language communication."}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8 w-full px-2">
                    {(Array.isArray(tutor.expertise) ? tutor.expertise : (tutor.expertise ? [tutor.expertise] : []))
                      .slice(0, 3) // Show max 3 tags to keep card clean
                      .map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/50 transition-colors">
                          {skill}
                        </span>
                      ))}
                  </div>

                  {/* Actions - Pushed to bottom */}
                  <div className="w-full flex flex-col gap-3 mt-auto relative z-10">
                    <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full">
                      <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0852A1] text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]">
                        <Calendar size={18} /> Schedule Trial
                      </button>
                    </Link>
                    <button
                      onClick={() => router.push(`/student/tutor/${tutor._id}`)}
                      className="w-full py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]">
                      View Full Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ================= PAGINATION (Only show if we are fetching lots of pages and user expanded view or if we want standard pagination) ================= */}
        {/* Note: If "View All" is toggled OFF, we hide pagination because we are limiting locally.
            If "View All" is ON, we show pagination controls. */}
        {pagination.totalPages > 1 && showAll && (
          <div className="flex justify-center items-center gap-4 mt-20">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="font-bold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              Page {page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-white border-t border-slate-100 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Can't find the right match?</h2>
        <p className="text-slate-500 mb-8 text-lg max-w-xl mx-auto">Our advisors are available 24/7 to help you choose the perfect tutor for your specific goals.</p>
        <Link href="/contact">
          <button className="px-12 py-4 border-2 border-slate-200 text-slate-900 rounded-full font-bold hover:bg-[#0852A1] hover:text-white hover:border-[#0852A1] transition-all cursor-pointer">
            Contact Support
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Tutors;