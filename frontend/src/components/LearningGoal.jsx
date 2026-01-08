import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= IMAGES ================= */
import phoneImg from "../assets/learning/phone.png";
import meetingImg from "../assets/learning/meeting.jpg";
import interviewImg from "../assets/learning/interview.jpg";
import presentationImg from "../assets/learning/presentation.jpg";
import speakingImg from "../assets/learning/speaking.jpg";
import IELTSImg from "../assets/learning/ielts.jpg";

/* ================= DATA ================= */
const goals = [
  {
    id: "meeting",
    label: "Office Meetings",
    image: meetingImg,
    desc: "Communicate clearly and confidently in office meetings",
  },
  {
    id: "interview",
    label: "Job Interviews",
    image: interviewImg,
    desc: "Crack interviews with confidence and clarity",
  },
  {
    id: "presentation",
    label: "Presentations",
    image: presentationImg,
    desc: "Deliver powerful and professional presentations",
  },
  {
    id: "speaking",
    label: "Public Speaking",
    image: speakingImg,
    desc: "Speak fluently in front of others without fear",
  },
 {
  id: "competitive-exams",
  label: "IELTS / CAT / SSC",
  image: IELTSImg, // you can change to a generic exam image
  desc: "Fluency, accuracy & confidence for IELTS, CAT & SSC exams",
},
];

/* ================= COMPONENT ================= */
const LearningGoal = () => {
  const [activeGoal, setActiveGoal] = useState(goals[0]);

  return (
    <section className="py-20 bg-white">
      <h3 className="text-4xl font-bold text-center mb-14 text-black">
        What’s your learning goal today?
      </h3>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

        {/* ================= LEFT STATIC IMAGE ================= */}
        <div className="flex justify-center">
          <img
            src={phoneImg.src}
            alt="Learning App"
            className="h-[480px] object-contain"
          />
        </div>

        {/* ================= CENTER BUTTONS ================= */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onMouseEnter={() => setActiveGoal(goal)}
              onClick={() => setActiveGoal(goal)}
              className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300
                ${
                  activeGoal.id === goal.id
                    ? "border-2 border-[#0852A1] text-[#0852A1] bg-[#0852A1]/5"
                    : "border border-gray-200 text-gray-700 hover:border-[#0852A1]"
                }`}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {/* ================= RIGHT ANIMATED IMAGE ================= */}
        <div className="relative h-[360px] flex items-end justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGoal.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <img
                src={activeGoal.image.src}
                alt={activeGoal.label}
                className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
              />
              <p className="mt-4 text-center text-gray-600 text-base">
                {activeGoal.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default LearningGoal;
