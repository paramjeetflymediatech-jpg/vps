"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CheckCircle2,
  BarChart3,
  Users2,
  Award,
  Zap,
} from "lucide-react";

/* ================= DATA ================= */

const stats = [
  {
    value: "95%",
    label: "Improvement Rate",
    icon: <Zap className="w-5 h-5" />,
  },
  { value: "10+ Yrs", label: "Expertise", icon: <Award className="w-5 h-5" /> },
  { value: "50+", label: "Modules", icon: <BarChart3 className="w-5 h-5" /> },
  { value: "24/7", label: "Support", icon: <Users2 className="w-5 h-5" /> },
];

const programs = [
  {
    title: "Executive Presence & Leadership",
    desc: "Refine high-stakes negotiation skills, boardroom communication, and global leadership etiquette for your C-suite and management.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    tags: ["Leadership", "Public Speaking"],
  },
  {
    title: "Global Customer Excellence",
    desc: "Equip your frontline teams with voice & accent neutralization, cross-cultural empathy, and professional conflict resolution.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    tags: ["Support", "Soft Skills"],
  },
];

const steps = [
  {
    title: "Audit",
    desc: "Deep dive into your team's communication gaps.",
    icon: "01",
  },
  {
    title: "Curate",
    desc: "Custom curriculum designed for your industry.",
    icon: "02",
  },
  {
    title: "Deploy",
    desc: "Live sessions led by world-class instructors.",
    icon: "03",
  },
  {
    title: "Measure",
    desc: "Data-backed ROI and performance reporting.",
    icon: "04",
  },
];

/* ================= COMPONENT ================= */

const Organizations = () => {
  const router = useRouter();

  // 1. Check if user is logged in (Assuming token-based auth)
  const isLoggedIn = !!localStorage.getItem("token");

  // 2. Navigation Handler
  const handleDemoClick = () => {
    if (isLoggedIn) {
      // If logged in, go to the demo booking form or dashboard
      router.push("/contact");
    } else {
      // If not logged in, go to login
      router.push("/login");
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0852A1]/5 -skew-x-12 transform translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase mb-6">
                Enterprise Solutions
              </span>
              <h1 className="text-5xl md:text-5xl font-extrabold text-slate-900 leading-[1.1]">
                Empower Your Team with{" "}
                <span className="text-[#0852A1]">Global Fluency.</span>
              </h1>
              <p className="mt-8 text-xl text-slate-600 leading-relaxed">
                We bridge the communication gap for modern enterprises. From
                executive coaching to large-scale customer support training.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {/* UPDATED BUTTON LOGIC */}
                <button
                  onClick={handleDemoClick}
                  className="flex items-center justify-center gap-2 bg-[#0852A1] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#063d7a] transition-all shadow-lg shadow-blue-900/20"
                >
                  Book Corporate Demo <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push("/contact")}
                  className="flex items-center justify-center gap-2 border-2 border-slate-200 bg-white text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  View Case Studies
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Team Training"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>

              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">100%</p>
                    <p className="text-sm text-slate-500">
                      Curriculum Customization
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ... (Stats and Programs sections remain the same) ... */}

      {/* ================= CTA SECTION ================= */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#0852A1] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                Ready to elevate your <br className="hidden md:block" />{" "}
                organization's voice?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Join 500+ forward-thinking companies already using our training
                to scale their global operations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push("/contact")}
                  className="bg-white text-[#0852A1] px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
                >
                  Contact Sales Team
                </button>
                {/* UPDATED CTA BUTTON LOGIC */}
                <button
                  onClick={() => router.push("/demo")}
                  className="bg-blue-600/30 text-white backdrop-blur-sm border border-white/20 px-10 py-4 rounded-2xl font-bold hover:bg-blue-600/40 transition-all"
                >
                  Request a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organizations;
