import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Riya Sharma",
    role: "IELTS Student",
    feedback:
      "The English Raj completely transformed my confidence. The one-on-one sessions helped me score 7.5 in IELTS. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Working Professional",
    feedback:
      "I struggled with spoken English at work. Thanks to The English Raj, I now communicate confidently in meetings and interviews.",
    rating: 5,
  },
  {
    name: "Neha Kapoor",
    role: "College Student",
    feedback:
      "The tutors are extremely supportive and friendly. Live sessions, feedback, and structured lessons make learning enjoyable.",
    rating: 4,
  },
  {
    name: "Rahul Mehta",
    role: "Entrepreneur",
    feedback:
      "Business English sessions helped me pitch confidently to international clients. Best decision I made!",
    rating: 5,
  },
];

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".testimonial-card",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      {/* ===== HEADER ===== */}
      <div className="text-center mb-14">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-800"
        >
          What Our Learners Say
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 max-w-2xl mx-auto"
        >
          Trusted by learners across India and beyond.  
          Discover how <span className="font-semibold text-[#0852A1]">The English Raj</span> is helping people speak English fluently with confidence.
        </motion.p>
      </div>

      {/* ===== TESTIMONIAL GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="testimonial-card bg-white rounded-xl shadow-md p-6 border hover:shadow-xl"
          >
            {/* Stars */}
            <div className="flex mb-3">
              {Array.from({ length: item.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              “{item.feedback}”
            </p>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800">
                {item.name}
              </h4>
              <p className="text-xs text-gray-500">
                {item.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
