// "use client";

// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// // import heroBg from "@/assets/home-bg/englsih-raj.jpg";
// import heroBg from "../assets/home-bg/englsih-raj.jpg";

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0 },
// };

// import React, { useState, useEffect } from "react";

// const Home = () => {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("token"));
//   }, []);

//   const handleBookNow = () => {
//     router.push(isLoggedIn ? "/tutors" : "/register");
//   };

//   return (
//     <div className="w-full overflow-hidden">

//       {/* ================= HERO SECTION ================= */}
//       <section
//         className="relative min-h-screen flex items-center"
//         style={{
//           backgroundImage: `url(${heroBg.src})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

//           {/* ================= MAIN CONTENT ================= */}
//           <motion.div
//             variants={fadeUp}
//             initial="hidden"
//             animate="visible"
//             transition={{ duration: 0.8 }}
//             className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl
//                        p-6 sm:p-8 lg:p-10
//                        max-w-full lg:max-w-2xl"
//           >
//             {/* Title */}
//             <h1 className="text-xl sm:text-2xl lg:text-1xl font-bold text-gray-900">
//               The English Raj
//             </h1>

//             <h2 className=" mt-1 text-base sm:text-md lg:text-lg font-semibold text-[#0852A1]">
//               Conquer the world with your English
//             </h2>

//             {/* About */}
//             <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900">
//               About Us
//             </h3>

//             <p className="mt-1 text-gray-800 text-sm sm:text-base leading-relaxed">
//               Our students continue to carve their niche in diverse fields,
//               supported by our adept team of professionals.
//             </p>

//             <p className="mt-2 text-gray-800 text-sm sm:text-base leading-relaxed">
//               Whether you are a working professional, a beginner, a student
//               aspiring to study abroad, or a graduate preparing for interviews —
//               <span className="font-semibold text-[#0852A1]">
//                 {" "}your progress begins here.
//               </span>
//             </p>

//             {/* Expertise */}
//             <h3 className="mt-2 text-base sm:text-lg font-bold text-gray-900">
//               Our Expertise
//             </h3>

//             <div className="mt-3 flex flex-wrap gap-2 sm:gap-2">
//               {[
//                 "IELTS Preparation",
//                 "English Phonetics",
//                 "Public Speaking",
//                 "Grammatical Accuracy",
//                 "Interview Preparation",
//                 "Business English",
//                 "Creative Writing",
//               ].map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1.5 sm:px-3 sm:py-2
//                              text-xs sm:text-sm
//                              rounded-full
//                              bg-blue-100 text-[#0852A1] font-medium"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>

//             {/* CTA */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleBookNow}
//               className="mt-8 w-full sm:w-auto
//                          bg-[#0852A1] hover:bg-[#063F7C]
//                          text-white px-8 py-3
//                          rounded-full text-sm font-semibold"
//             >
//               ACTIVATE
//             </motion.button>
//           </motion.div>
//         </div>
//       </section>

//       {/* ================= STATS SECTION ================= */}
//       <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] py-12 sm:py-14">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
//                         grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
//           {[
//             { value: "1,000+", label: "Successful Learners", icon: "🎯" },
//             { value: "95%", label: "Satisfaction Rate", icon: "⭐" },
//             { value: "3x Faster", label: "Speaking Improvement", icon: "🚀" },
//           ].map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.15 }}
//               viewport={{ once: true }}
//               className="bg-white rounded-xl p-5 sm:p-6 shadow-lg flex items-center gap-4"
//             >
//               <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-2xl">
//                 {stat.icon}
//               </div>
//               <div>
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//                   {stat.value}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {stat.label}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//     </div>
//   );
// };

// export default Home;



"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import heroBg from "../assets/home-bg/englsih-raj.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleBookNow = () => {
    // 🚫 Not logged in → register
    if (!isLoggedIn) {
      router.push("/register");
      return;
    }

    // ✅ Logged in → UPI payment
    const upiId = "nshpental-1@okaxis"; // 🔴 replace with real UPI ID
    const name = "The English Raj";
    const amount = "499"; // can be dynamic
    const note = "Session Activation";

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // 📱 Mobile → open UPI app
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = upiUrl;
    } 
    // 💻 Desktop → QR page
    else {
      router.push("/payment/upi");
    }
  };

  return (
    <div className="w-full overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${heroBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl
                       p-6 sm:p-8 lg:p-10
                       max-w-full lg:max-w-2xl"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              The English Raj
            </h1>

            <h2 className="mt-1 text-base sm:text-md lg:text-lg font-semibold text-[#0852A1]">
              Conquer the world with your English
            </h2>

            <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900">
              About Us
            </h3>

            <p className="mt-1 text-gray-800 text-sm sm:text-base leading-relaxed">
              Our students continue to carve their niche in diverse fields,
              supported by our adept team of professionals.
            </p>

            <p className="mt-2 text-gray-800 text-sm sm:text-base leading-relaxed">
              Whether you are a working professional, a beginner, a student
              aspiring to study abroad, or a graduate preparing for interviews —
              <span className="font-semibold text-[#0852A1]">
                {" "}your progress begins here.
              </span>
            </p>

            <h3 className="mt-2 text-base sm:text-lg font-bold text-gray-900">
              Our Expertise
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "IELTS Preparation",
                "English Phonetics",
                "Public Speaking",
                "Grammatical Accuracy",
                "Interview Preparation",
                "Business English",
                "Creative Writing",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1.5 sm:px-3 sm:py-2
                             text-xs sm:text-sm
                             rounded-full
                             bg-blue-100 text-[#0852A1] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookNow}
              className="mt-8 w-full sm:w-auto
                         bg-[#0852A1] hover:bg-[#063F7C]
                         text-white px-8 py-3
                         rounded-full text-sm font-semibold"
            >
              ACTIVATE
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { value: "1,000+", label: "Successful Learners", icon: "🎯" },
            { value: "95%", label: "Satisfaction Rate", icon: "⭐" },
            { value: "3x Faster", label: "Speaking Improvement", icon: "🚀" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-2xl">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
