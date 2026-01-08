import { useState } from "react";
import { motion } from "framer-motion"; // Optional: For smooth animations
import { CheckCircle, Globe, DollarSign, Clock, BookOpen, Star } from "lucide-react"; // Icons
import { applyTutorApi } from "../api/tutorApi"; 
import tutorHeroImg from "../assets/tutor-teaching.jpg"; // Path apne folder ke hisaab se check kar lein

const BecomeTutor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Submitting tutor application:", form); 

    try {
      await applyTutorApi(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-r from-[#0B3C66] to-[#0852A1] overflow-hidden py-24 lg:py-32">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#0852A1] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-yellow-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Content */}
          <div className="text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-bold tracking-wide uppercase mb-6">
              Join Our Global Faculty
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
              Teach English. <br />
              <span className="text-yellow-400 font-serif italic">Impact Lives.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-lg">
              Join India's most prestigious English communication platform. Work from anywhere, earn competitively, and mentor the next generation of global leaders.
            </p>
            
            <div className="grid grid-cols-2 gap-6 border-t border-slate-700 pt-10">
              <div>
                <h4 className="text-3xl font-bold text-white">100+</h4>
                <p className="text-slate-400">Expert Tutors</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-white">10,000+</h4>
                <p className="text-slate-400">Global Students</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 text-slate-800 relative overflow-hidden">
             {/* Form State Container */}
             <div className="relative min-h-[480px]">
                {!submitted ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h3 className="text-2xl font-bold mb-2">Apply for Tutor Position</h3>
                    <p className="text-slate-500 mb-8">Fill in your details and our team will reach out.</p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0852A1] outline-none transition-all"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0852A1] outline-none transition-all"
                        />
                      </div>
                      
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (WhatsApp preferred)"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0852A1] outline-none transition-all"
                      />

                      <input
                        type="text"
                        name="expertise"
                        placeholder="Area of Expertise (e.g. IELTS, Business English)"
                        value={form.expertise}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0852A1] outline-none transition-all"
                      />

                      <select
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0852A1] outline-none transition-all appearance-none"
                      >
                        <option value="">Teaching Experience</option>
                        <option>0-1 Years</option>
                        <option>1-3 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0852A1] hover:bg-[#387DC6] cursor-pointer text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                      >
                        {loading ? "Processing..." : "Start Your Journey"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-[480px] animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h3>
                    <p className="text-slate-600">
                      Thank you for your interest in <strong>The English Raj</strong>. <br /> Our HR team will review your profile and send a mail on your e-mail id within 48 business hours.
                    </p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* ================= PERKS SECTION ================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Why Teach with Us?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide the tools and the students; you provide the inspiration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <DollarSign className="text-green-500" />, title: "Premium Pay", desc: "Top-tier compensation based on your expertise and session ratings." },
              { icon: <Clock className="text-blue-500" />, title: "Flexible Hours", desc: "Choose your own schedule. Teach 2 hours a day or 10—it's up to you." },
              { icon: <Globe className="text-purple-500" />, title: "Global Reach", desc: "Interact with professionals and students from all over the world." },
              { icon: <BookOpen className="text-orange-500" />, title: "Rich Resources", desc: "Access our exclusive library of curriculum and teaching aids." },
              { icon: <Star className="text-yellow-500" />, title: "Growth Path", desc: "Move up to Senior Mentor or Corporate Trainer roles." },
              { icon: <CheckCircle className="text-emerald-500" />, title: "Fast Payouts", desc: "Reliable and transparent monthly payment cycles." },
            ].map((perk, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6">
                  {perk.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{perk.title}</h4>
                <p className="text-slate-600 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS SECTION ================= */}
      {/* <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                <img 
                   src="https://images.unsplash.com/photo-1544717297-fa154da09f5b?auto=format&fit=crop&q=80&w=800" 
                   alt="Teacher coaching student" 
                   className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
                />
             </div>

             <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#0B3C66] to-[#0852A1] p-6 rounded-2xl hidden md:block">
                <p className="font-bold text-slate-900 italic text-white">"Teaching at The English Raj is the best career move I ever made."</p>
                <p className="text-sm mt-2 font-medium text-white">— Sarah M., Senior Tutor</p>
             </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-10">Simple Hiring Process</h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Submit Application", desc: "Fill out the form with your details and experience." },
                { step: "02", title: "Video Interview", desc: "A brief conversation with our recruitment leads." },
                { step: "03", title: "Demo Session", desc: "Showcase your teaching style in a 15-minute demo." },
                { step: "04", title: "Onboarding", desc: "Get trained on our platform and start teaching!" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-3xl font-black text-slate-200">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

     <section className="py-16 md:py-24 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
    
    {/* LEFT SIDE - IMAGE SECTION */}
    <div className="relative order-2 lg:order-1">
      <div className="aspect-square bg-slate-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border border-slate-200">
                <img 
                   src={tutorHeroImg.src} // Local imported image yahan use karein
                   alt="Teacher coaching student" 
                   className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
                />
      </div>

      {/* Decorative label - Mobile par hidden ya chota rakhein */}
      <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-gradient-to-r from-[#0B3C66] to-[#0852A1] p-5 md:p-8 rounded-2xl shadow-2xl max-w-[85%] sm:max-w-xs z-10 hidden sm:block">
        <p className="font-bold italic text-white text-sm md:text-lg leading-relaxed">
          "Teaching at The English Raj is the best career move I ever made."
        </p>
        <p className="text-xs md:text-sm mt-3 font-medium text-blue-100 opacity-90">
          — Sarah Senior Tutor
        </p>
      </div>
    </div>

    {/* RIGHT SIDE - CONTENT SECTION */}
    <div className="order-1 lg:order-2">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 md:mb-12 leading-tight">
        Simple Hiring Process
      </h2>
      
      <div className="space-y-6 md:space-y-10">
        {[
          { step: "01", title: "Submit Application", desc: "Fill out the form with your details and experience." },
          { step: "02", title: "Video Interview", desc: "A brief conversation with our recruitment leads." },
          { step: "03", title: "Demo Session", desc: "Showcase your teaching style in a 15-minute demo." },
          { step: "04", title: "Onboarding", desc: "Get trained on our platform and start teaching!" },
        ].map((item, i) => (
          <div key={i} className="flex gap-5 md:gap-8 group">
            <span className="text-2xl md:text-4xl font-black text-slate-200 group-hover:text-[#0852A1] transition-colors duration-300">
              {item.step}
            </span>
            <div className="border-l-2 border-slate-100 pl-6 group-hover:border-[#0852A1] transition-colors">
              <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>


      {/* ================= FINAL CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to define the future of English education?</h2>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-[#0852A1] px-10 py-4 rounded-full font-bold text-lg hover:bg-[yellow-400] hover:text-slate-900 transition-all"
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default BecomeTutor;
