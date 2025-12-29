// import { useState } from "react";

// const BecomeTutor = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     expertise: "",
//     experience: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Tutor Application:", form);
//     alert("Application submitted successfully!");
//   };

//   return (
//     <div className="w-full">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-white">
//         <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
//           <div>
//             <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
//               Become a Tutor at <br />
//               <span className="text-yellow-300">The English Raj</span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-200 max-w-xl">
//               Teach English to motivated learners across India & abroad.
//               Earn flexibly, teach confidently, and grow with us.
//             </p>

//             <ul className="mt-6 space-y-3 text-gray-100">
//               <li>✔ 100% Online Teaching</li>
//               <li>✔ Flexible Schedule</li>
//               <li>✔ Earn per session</li>
//               <li>✔ Dedicated Support Team</li>
//             </ul>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-8 text-gray-800">
//             <h3 className="text-2xl font-bold mb-4">
//               Quick Tutor Application
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0852A1]"
//               />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0852A1]"
//               />

//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={form.phone}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0852A1]"
//               />

//               <input
//                 type="text"
//                 name="expertise"
//                 placeholder="Expertise (e.g. Spoken English, IELTS)"
//                 value={form.expertise}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0852A1]"
//               />

//               <select
//                 name="experience"
//                 value={form.experience}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0852A1]"
//               >
//                 <option value="">Teaching Experience</option>
//                 <option>0-1 Years</option>
//                 <option>1-3 Years</option>
//                 <option>3-5 Years</option>
//                 <option>5+ Years</option>
//               </select>

//               <button
//                 type="submit"
//                 className="w-full bg-[#0852A1] hover:bg-[#063F7C] text-white py-3 rounded-lg font-semibold transition"
//               >
//                 Apply as Tutor
//               </button>
//             </form>
//           </div>

//         </div>
//       </section>

//       {/* ================= WHY JOIN ================= */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-12">
//             Why Teach with The English Raj?
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {[
//               { title: "Flexible Timings", icon: "⏰" },
//               { title: "Competitive Earnings", icon: "💰" },
//               { title: "1-on-1 Sessions", icon: "👩‍🏫" },
//               { title: "Growth Opportunities", icon: "🚀" },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-xl shadow-md"
//               >
//                 <div className="text-4xl mb-4">{item.icon}</div>
//                 <h4 className="font-semibold text-lg">{item.title}</h4>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-[#0852A1] py-16 text-center text-white">
//         <h2 className="text-3xl font-bold mb-4">
//           Ready to Inspire Learners?
//         </h2>
//         <p className="text-lg mb-6">
//           Join our growing community of expert tutors today.
//         </p>
//         <a
//           href="#"
//           className="inline-block bg-white text-[#0852A1] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
//         >
//           Apply Now
//         </a>
//       </section>

//     </div>
//   );
// };

// export default BecomeTutor;





import { useState } from "react";
import { applyTutorApi } from "../api/tutorApi";

const BecomeTutor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await applyTutorApi(form);

      setMessage(res.data.message || "Application submitted!");
      setForm({
        name: "",
        email: "",
        phone: "",
        expertise: "",
        experience: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Become a Tutor at <br />
              <span className="text-yellow-300">
                The English Raj
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-200">
              Teach English online, earn flexibly, and grow with us.
            </p>
          </div>

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-gray-800">
            <h3 className="text-2xl font-bold mb-4">
              Tutor Application
            </h3>

            {message && (
              <p className="mb-4 text-green-600 font-medium">
                {message}
              </p>
            )}

            {error && (
              <p className="mb-4 text-red-600 font-medium">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="text"
                name="expertise"
                placeholder="Expertise (e.g. Spoken English)"
                value={form.expertise}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
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
                className="w-full bg-[#0852A1] hover:bg-[#063F7C] text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Submitting..." : "Apply as Tutor"}
              </button>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default BecomeTutor;
