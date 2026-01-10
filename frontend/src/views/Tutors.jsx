import { useEffect, useState } from "react";
import { Search, Star, Calendar, Clock, Award, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion"; // Suggesting framer-motion for smooth UI
import tutorHeroImg from "../assets/tutorimg.jpg";
import tutorProfileImg from "../assets/tutor.png";

/* ================= TUTORS DATA ================= */
const tutorsData = [
  {
    id: 1,
    name: "Aneesha",
    title: "Expert IELTS & Business Linguist",
    rating: "4.9",
    reviews: "128",
    experience: "8+ Years",
    sessions: "3,000+",
    image: tutorProfileImg,
    skills: ["IELTS", "Business English", "Public Speaking", "Interviews"],
    about: `I have been teaching IELTS since 2017. After completing my post-graduation in English Literature & Linguistics from Panjab University, Chandigarh, I worked as an Assistant Professor (2021-2023). My sessions are personalized to help learners achieve salary hikes and settle confidently abroad.`,
  },
];

const Tutors = () => {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const filteredTutors = tutorsData.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.skills.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen font-sans">
      
      {/* ================= MODERN HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-br from-[#0B3C66] to-[#0852A1]">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 text-blue-100 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
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
              className="relative"
            >
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/10">
                <img src={tutorHeroImg.src} alt="Tutor" className="w-full h-full object-cover" />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl hidden md:block animate-bounce-slow">
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
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#0852A1] transition-all"
            />
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
            Find Mentors
          </button>
        </div>
      </div>

      {/* ================= TUTOR LISTINGS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Available Mentors</h2>
            <p className="text-slate-500 mt-1">Based on your interests and search</p>
          </div>
          <p className="text-sm font-bold text-[#0852A1]">{filteredTutors.length} Tutors found</p>
        </div>

        <div className="grid gap-12">
          {filteredTutors.map((tutor) => (
            <motion.div
              layout
              key={tutor.id}
              className="group bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="grid lg:grid-cols-12 gap-8 p-6">
                {/* Profile Visuals */}
                <div className="lg:col-span-3 text-center lg:border-r border-slate-100 lg:pr-8">
                  <div className="relative inline-block">
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-40 h-40 rounded-[2rem] shadow-md object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full" />
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star size={18} fill="currentColor" /> {tutor.rating} 
                      <span className="text-slate-400 text-xs font-normal">({tutor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Award size={16} className="text-[#0852A1]" />
                      {tutor.experience} Experience
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-black text-slate-900">{tutor.name}</h3>
                    <span className="bg-blue-50 text-[#0852A1] text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded">Pro Mentor</span>
                  </div>
                  <p className="text-[#0852A1] font-bold text-lg mb-4">{tutor.title}</p>
                  
                  <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {tutor.about}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tutor.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions / CTA */}
                <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-end gap-4 bg-slate-50 lg:bg-transparent p-6 lg:p-0 rounded-2xl">
                  <div className="text-center lg:text-right mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Successful Sessions</p>
                    <p className="text-4xl font-black text-slate-900">{tutor.sessions}</p>
                  </div>
                  
                  <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#0852A1] text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-blue-900/10">
                      <Calendar size={18} /> Schedule Call
                    </button>
                  </Link>
                  <button className="w-full py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    View Full Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-white border-t border-slate-100 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Can't find the right match?</h2>
        <p className="text-slate-500 mb-8">Our advisors can help you choose the perfect tutor for your goals.</p>
        <Link href="/contact">
  <button className="px-10 py-4 border-2  text-slate-900 rounded-full font-bold hover:bg-[#6335F8] hover:text-white transition-all cursor-pointer">
    Contact Support
  </button>
</Link>
      </section>
    </div>
  );
};

export default Tutors;