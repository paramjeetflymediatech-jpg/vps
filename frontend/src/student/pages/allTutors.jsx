// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Search,
//   Heart,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   GraduationCap,
//   ArrowRight,
//   Filter,
//   CheckCircle2,
//   SlidersHorizontal,
// } from "lucide-react";
// import { getTutors } from "@/api/tutorApi";

// const AllTutors = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [favorites, setFavorites] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [tutors, setTutors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const tutorsPerPage = 6;
//   const brandColor = "#6335F8";

//   // Your Specific Categories
//   const categories = [
//     "All",
//     "Business English",
//     "IELTS Speaking",
//     "Interview skills",
//     "Grammar",
//     "Vocabulary"
//   ];

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const res = await getTutors();
//         const apiTutors = (res.data?.data || []).map((t, index) => ({
//           id: t._id || index,
//           name: t.name,
//           subject: t.expertise || categories[(index % (categories.length - 1)) + 1],
//           rating:
//             typeof t.rating === "number" && t.rating > 0
//               ? t.rating.toFixed(1)
//               : (4 + Math.random()).toFixed(1),
//           reviews:
//             typeof t.reviewsCount === "number" && t.reviewsCount > 0
//               ? t.reviewsCount
//               : Math.floor(Math.random() * 200) + 10,
//           price: Math.floor(Math.random() * 50) + 20,
//           image: `https://i.pravatar.cc/150?u=${t.email}`,
//           bio:
//             "Master your communication skills with personalized lessons tailored to your professional goals.",
//           isFeatured: index < 3,
//         }));
//         setTutors(apiTutors);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load tutors");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTutors();
//   }, []);

//   // Filter Logic: Search + Category
//   const filteredTutors = tutors.filter((t) => {
//     const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           t.subject.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = activeCategory === "All" || t.subject === activeCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const indexOfLast = currentPage * tutorsPerPage;
//   const indexOfFirst = indexOfLast - tutorsPerPage;
//   const currentTutors = filteredTutors.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

//   const toggleFavorite = (id) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-gray-500 text-sm">
//         Loading tutors...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500 text-sm font-medium">
//         {error}
//       </div>
//     );
//   }

//   if (!tutors.length) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-black mb-2">Tutors</h1>
//         <p className="text-gray-500 text-sm">No tutors available yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 bg-[#FDFDFF]">
      
//       {/* 1. HEADER SECTION */}
//       <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//         <div className="space-y-2">
//           <h1 className="text-4xl font-black text-gray-900 tracking-tight">
//             Find the perfect <span className="text-[#6335F8]">Tutor</span>
//           </h1>
//           <p className="text-gray-500 font-medium text-lg">
//             Expert-led sessions for career and language growth.
//           </p>
//         </div>

//         <div className="relative group w-full lg:w-96">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6335F8] transition-colors" size={20} />
//           <input
//             className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium transition-all focus:border-[#6335F8] outline-none shadow-sm"
//             placeholder="Search by name, skills, or subject..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//       </div>

//       {/* 2. CATEGORY FILTERS */}
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-2 text-gray-900 font-bold text-sm uppercase tracking-wider">
//           <SlidersHorizontal size={16} /> Filter by Specialty
//         </div>
//         <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setCurrentPage(1);
//               }}
//               className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-all
//               ${activeCategory === cat 
//                 ? "bg-[#6335F8] border-[#6335F8] text-white shadow-lg shadow-[#6335F8]/30" 
//                 : "bg-white border-gray-100 text-gray-500 hover:border-[#6335F8] hover:text-[#6335F8]"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 3. TUTORS GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {currentTutors.map((tutor) => (
//           <div
//             key={tutor.id}
//             className="group bg-white rounded-[2.5rem] p-6 border-2 border-transparent hover:border-[#6335F8]/10 hover:shadow-[0_20px_50px_rgba(99,53,248,0.08)] transition-all duration-500 relative"
//           >
//             {/* Featured Badge */}
//             {tutor.isFeatured && (
//               <div className="absolute top-6 left-6 z-10 bg-[#6335F8] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
//                 Featured
//               </div>
//             )}

//             <div className="flex justify-between items-start mb-6 pt-2">
//               <div className="relative">
//                 <img
//                   src={tutor.image}
//                   className="w-24 h-24 rounded-3xl object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                   alt={tutor.name}
//                 />
//                 <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
//                    <CheckCircle2 size={20} className="text-[#6335F8] fill-white" />
//                 </div>
//               </div>
//               <button 
//                 onClick={() => toggleFavorite(tutor.id)}
//                 className={`p-3 rounded-2xl transition-all ${favorites.includes(tutor.id) ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-300 hover:text-red-400"}`}
//               >
//                 <Heart size={22} className={favorites.includes(tutor.id) ? "fill-current" : ""} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-xl font-black text-gray-900 leading-tight">
//                   {tutor.name}
//                 </h3>
//                 <div className="flex items-center text-sm font-bold text-[#6335F8] mt-1 uppercase tracking-wide">
//                   {tutor.subject}
//                 </div>
//               </div>

//               <p className="text-gray-500 text-sm font-medium line-clamp-2">
//                 {tutor.bio}
//               </p>

//               <div className="flex items-center justify-between py-4 border-y border-gray-50">
                
//                 <div className="flex flex-col items-end">
//                     <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rating</span>
//                     <div className="flex items-center gap-1">
//                       <Star size={16} className="fill-yellow-400 text-yellow-400" />
//                       <span className="text-lg font-black text-gray-900">{tutor.rating}</span>
//                     </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => router.push(`/student/tutor/${tutor.id}`)}
//                 className="w-full flex items-center justify-center gap-3 py-4 bg-[#6335F8] text-white rounded-[1.25rem] font-black text-sm transition-all hover:bg-[#4f27d4] hover:gap-5 shadow-lg shadow-[#6335F8]/20 active:scale-95"
//               >
//                View Profile<ArrowRight size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 4. PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex flex-col items-center gap-6 pt-10">
//           <div className="flex items-center gap-2 bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="p-3 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//             >
//               <ChevronLeft size={24} />
//             </button>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//                 <button
//                   key={n}
//                   onClick={() => setCurrentPage(n)}
//                   className={`w-12 h-12 text-sm font-black rounded-2xl transition-all ${
//                     currentPage === n
//                       ? "bg-[#6335F8] text-white"
//                       : "text-gray-400 hover:bg-gray-50"
//                   }`}
//                 >
//                   {n}
//                 </button>
//               ))}
//             </div>

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="p-3 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             Showing {currentTutors.length} of {filteredTutors.length} Experts
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTutors;



"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { getTutors } from "@/api/tutorApi";

const AllTutors = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tutorsPerPage = 6;
  const brandColor = "#6335F8";

  const categories = [
    "All",
    "Business English",
    "IELTS Speaking",
    "Interview skills",
    "Grammar",
    "Vocabulary",
  ];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutors();
        const apiTutors = (res.data?.data || []).map((t, index) => ({
          id: t._id || index,
          name: t.name,
          subject:
            t.expertise || categories[(index % (categories.length - 1)) + 1],
          rating:
            typeof t.rating === "number" && t.rating > 0
              ? t.rating.toFixed(1)
              : (4 + Math.random()).toFixed(1),
          reviews:
            typeof t.reviewsCount === "number" && t.reviewsCount > 0
              ? t.reviewsCount
              : Math.floor(Math.random() * 200) + 10,
          price: Math.floor(Math.random() * 50) + 20,
          image: `https://i.pravatar.cc/150?u=${t.email}`,
          bio:
            "Master your communication skills with personalized lessons tailored to your professional goals.",
          isFeatured: index < 3,
        }));
        setTutors(apiTutors);
      } catch (err) {
        console.error(err);
        setError("Failed to load tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Filter tutors by search and category
  const filteredTutors = tutors.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.subject === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLast = currentPage * tutorsPerPage;
  const indexOfFirst = indexOfLast - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm">
        Loading tutors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-sm font-medium">{error}</div>
    );
  }

  if (!tutors.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-black mb-2">Tutors</h1>
        <p className="text-gray-500 text-sm">No tutors available yet.</p>
      </div>
    );
  }

  return (
    // <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 md:p-8 bg-[#FDFDFF]">

    //   {/* HEADER */}
    //   <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
    //     <div className="space-y-2">
    //       <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
    //         Find the perfect <span className="text-[#6335F8]">Tutor</span>
    //       </h1>
    //       <p className="text-gray-500 font-medium text-sm sm:text-lg">
    //         Expert-led sessions for career and language growth.
    //       </p>
    //     </div>

    //     <div className="relative group w-full lg:w-96">
    //       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6335F8] transition-colors" size={20} />
    //       <input
    //         className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm sm:text-base font-medium transition-all focus:border-[#6335F8] outline-none shadow-sm"
    //         placeholder="Search by name, skills, or subject..."
    //         value={searchTerm}
    //         onChange={(e) => {
    //           setSearchTerm(e.target.value);
    //           setCurrentPage(1);
    //         }}
    //       />
    //     </div>
    //   </div>

    //   {/* CATEGORY FILTERS */}
    //   <div className="flex flex-col gap-4">
    //     <div className="flex items-center gap-2 text-gray-900 font-bold text-sm uppercase tracking-wider">
    //       <SlidersHorizontal size={16} /> Filter by Specialty
    //     </div>
    //     <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
    //       {categories.map((cat) => (
    //         <button
    //           key={cat}
    //           onClick={() => {
    //             setActiveCategory(cat);
    //             setCurrentPage(1);
    //           }}
    //           className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-all
    //           ${activeCategory === cat
    //             ? "bg-[#6335F8] border-[#6335F8] text-white shadow-lg shadow-[#6335F8]/30"
    //             : "bg-white border-gray-100 text-gray-500 hover:border-[#6335F8] hover:text-[#6335F8]"
    //           }`}
    //         >
    //           {cat}
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   {/* TUTORS GRID */}
    //   <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
    //     {currentTutors.map((tutor) => (
    //       <div
    //         key={tutor.id}
    //         className="group bg-white rounded-[2rem] p-4 sm:p-6 border-2 border-transparent hover:border-[#6335F8]/10 hover:shadow-[0_20px_50px_rgba(99,53,248,0.08)] transition-all duration-500 relative"
    //       >
    //         {/* Featured Badge */}
    //         {tutor.isFeatured && (
    //           <div className="absolute top-4 left-4 z-10 bg-[#6335F8] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
    //             Featured
    //           </div>
    //         )}

    //         <div className="flex justify-between items-start mb-4 sm:mb-6 pt-2">
    //           <div className="relative">
    //             <img
    //               src={tutor.image}
    //               className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
    //               alt={tutor.name}
    //             />
    //             <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
    //               <CheckCircle2 size={20} className="text-[#6335F8] fill-white" />
    //             </div>
    //           </div>
    //           <button
    //             onClick={() => toggleFavorite(tutor.id)}
    //             className={`p-3 rounded-2xl transition-all ${favorites.includes(tutor.id) ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-300 hover:text-red-400"}`}
    //           >
    //             <Heart size={22} className={favorites.includes(tutor.id) ? "fill-current" : ""} />
    //           </button>
    //         </div>

    //         <div className="space-y-3 sm:space-y-4">
    //           <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">{tutor.name}</h3>
    //           <div className="flex items-center text-sm font-bold text-[#6335F8] mt-1 uppercase tracking-wide">{tutor.subject}</div>
    //           <p className="text-gray-500 text-sm font-medium line-clamp-2">{tutor.bio}</p>

    //           <div className="flex items-center justify-between py-3 sm:py-4 border-y border-gray-50">
    //             <div className="flex flex-col items-end">
    //               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rating</span>
    //               <div className="flex items-center gap-1">
    //                 <Star size={16} className="fill-yellow-400 text-yellow-400" />
    //                 <span className="text-lg font-black text-gray-900">{tutor.rating}</span>
    //               </div>
    //             </div>
    //           </div>

    //           <button
    //             onClick={() => router.push(`/student/tutor/${tutor.id}`)}
    //             className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 bg-[#6335F8] text-white rounded-[1.25rem] font-black text-sm sm:text-base transition-all hover:bg-[#4f27d4] hover:gap-5 shadow-lg shadow-[#6335F8]/20 active:scale-95"
    //           >
    //             View Profile <ArrowRight size={18} />
    //           </button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* PAGINATION */}
    //   {totalPages > 1 && (
    //     <div className="flex flex-col items-center gap-4 sm:gap-6 pt-6 sm:pt-10">
    //       <div className="flex items-center gap-2 bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
    //         <button
    //           disabled={currentPage === 1}
    //           onClick={() => setCurrentPage((p) => p - 1)}
    //           className="p-3 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
    //         >
    //           <ChevronLeft size={24} />
    //         </button>

    //         <div className="flex items-center gap-1">
    //           {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
    //             <button
    //               key={n}
    //               onClick={() => setCurrentPage(n)}
    //               className={`w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base font-black rounded-2xl transition-all ${
    //                 currentPage === n
    //                   ? "bg-[#6335F8] text-white"
    //                   : "text-gray-400 hover:bg-gray-50"
    //               }`}
    //             >
    //               {n}
    //             </button>
    //           ))}
    //         </div>

    //         <button
    //           disabled={currentPage === totalPages}
    //           onClick={() => setCurrentPage((p) => p + 1)}
    //           className="p-3 text-gray-400 hover:text-[#6335F8] disabled:opacity-20 transition-colors"
    //         >
    //           <ChevronRight size={24} />
    //         </button>
    //       </div>

    //       <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">
    //         Showing {currentTutors.length} of {filteredTutors.length} Experts
    //       </p>
    //     </div>
    //   )}
    // </div>


<div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 md:px-8 bg-[#FDFDFF] overflow-x-hidden">

  {/* ================= HEADER ================= */}
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
    <div className="space-y-2">
<h1 className="mt-20 sm:mt-10 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">        Find the perfect <span className="text-[#6335F8]">Tutor</span>
      </h1>
      <p className="text-gray-500 font-medium text-sm sm:text-lg">
        Expert-led sessions for career and language growth.
      </p>
    </div>

    {/* Search */}
    <div className="relative w-full lg:w-96">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-sm sm:text-base font-medium focus:border-[#6335F8] outline-none"
        placeholder="Search tutors..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  </div>

  {/* ================= FILTERS (WRAP, NO SCROLL) ================= */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider">
      <SlidersHorizontal size={14} /> Filter by Specialty
    </div>

    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActiveCategory(cat);
            setCurrentPage(1);
          }}
          className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition
            ${
              activeCategory === cat
                ? "bg-[#6335F8] border-[#6335F8] text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#6335F8]"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>

  {/* ================= TUTORS GRID (SMALL ON MOBILE) ================= */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
    {currentTutors.map((tutor) => (
      <div
        key={tutor.id}
        className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover"
            />
            <div>
              <h3 className="text-sm sm:text-lg font-black text-gray-900">
                {tutor.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold text-[#6335F8] uppercase">
                {tutor.subject}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(tutor.id)}
            className={`p-2 rounded-xl ${
              favorites.includes(tutor.id)
                ? "bg-red-50 text-red-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Heart
              size={18}
              className={favorites.includes(tutor.id) ? "fill-current" : ""}
            />
          </button>
        </div>

        {/* Bio */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-4">
          {tutor.bio}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-black">{tutor.rating}</span>
          </div>

          <button
            onClick={() => router.push(`/student/tutor/${tutor.id}`)}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-[#6335F8] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#4f27d4] transition"
          >
            View
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* ================= PAGINATION (NO SCROLL) ================= */}
  {totalPages > 1 && (
    <div className="flex flex-col items-center gap-4 pt-8">
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`w-9 h-9 sm:w-11 sm:h-11 text-xs sm:text-sm font-black rounded-xl ${
              currentPage === n
                ? "bg-[#6335F8] text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Showing {currentTutors.length} of {filteredTutors.length} Tutors
      </p>
    </div>
  )}
</div>


  );
};

export default AllTutors;
