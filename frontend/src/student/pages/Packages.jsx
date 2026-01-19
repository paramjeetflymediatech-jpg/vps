// "use client";

// import { useEffect, useState } from "react";
// import { getStudentPackages } from "@/api/student.api";
// import { BookOpen, Loader2 } from "lucide-react";

// const StudentPackages = () => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const res = await getStudentPackages();
//         setPackages(res.data.data || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load packages");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="animate-spin text-[#0852A1]" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="p-6 text-red-500 text-sm font-medium">{error}</div>;
//   }

//   if (!packages.length) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-black mb-2">Packages</h1>
//         <p className="text-gray-500 text-sm">No packages available yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl md:text-3xl font-black text-gray-900">
//           Packages
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {packages.map((pkg) => (
//           <div
//             key={pkg._id}
//             className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between"
//           >
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-xs font-bold text-[#0852A1] uppercase tracking-wide">
//                 <BookOpen size={14} />
//                 {pkg.category || "English Package"}
//               </div>
//               <h2 className="text-lg font-black text-gray-900 line-clamp-2">
//                 {pkg.title}
//               </h2>
//               {pkg.description && (
//                 <p className="text-sm text-gray-600 line-clamp-3">
//                   {pkg.description}
//                 </p>
//               )}
//               {pkg.level && (
//                 <p className="text-xs inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold mt-1">
//                   {pkg.level}
//                 </p>
//               )}
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
//               <div>
//                 <div className="text-xl font-black text-[#0852A1]">
//                   ₹{pkg.price}
//                 </div>
//                 {pkg.discountPrice && (
//                   <div className="text-xs text-gray-400 line-through">
//                     ₹{pkg.discountPrice}
//                   </div>
//                 )}
//               </div>

//               <button
//                 className="px-4 py-2 rounded-xl bg-[#0852A1] text-white text-sm font-bold hover:bg-blue-700 transition"
//               >
//                 View Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StudentPackages;

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentPackages } from "@/api/student.api";
import {
  BookOpen,
  Loader2,
  IndianRupee,
  Rocket,
  CheckCircle2,
} from "lucide-react";

const StudentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getStudentPackages();
        setPackages(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  /* ---------- LOADING STATE ---------- */
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FBFCFF]">
        <Loader2 className="animate-spin text-[#6335F8] mb-2" size={40} />
        <p className="text-sm font-bold text-gray-500">
          Loading your offers...
        </p>
      </div>
    );
  }

  /* ---------- ERROR STATE ---------- */
  if (error) {
    return (
      <div className="pt-24 px-6 flex justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium text-sm">
          {error}
        </div>
      </div>
    );
  }

  /* ---------- EMPTY STATE ---------- */
  if (!packages.length) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] pt-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <Rocket className="mx-auto text-gray-300 mb-4" size={48} />
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            No Packages Found
          </h1>
          <p className="text-gray-500 text-sm">
            Check back later for new learning bundles!
          </p>
        </div>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <div className="min-h-screen bg-[#FBFCFF]">
      {/* pt-24: Ensures the content starts below the fixed mobile header.
          md:pt-10: Standard padding for desktop.
      */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 pt-16 md:pt-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Learning Packages
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Premium bundles designed to accelerate your progress.
          </p>
        </div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-[#6335F8]/5 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#6335F8] uppercase tracking-widest">
                    <BookOpen size={14} />
                    {pkg.category || "English Package"}
                  </div>
                  {pkg.level && (
                    <span className="text-[10px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-black uppercase">
                      {pkg.level}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#6335F8] transition-colors">
                    {pkg.title}
                  </h2>
                  {pkg.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Features Placeholder (Optional UI Polish) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Lifetime Access
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Certificate of Completion
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{pkg.price}
                    </span>
                  </div>
                  {pkg.discountPrice && (
                    <div className="text-xs text-gray-400 line-through font-bold">
                      ₹{pkg.discountPrice}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/student/packages/${pkg._id}`)}
                  className="px-6 py-3 rounded-xl bg-purple-50 text-[#6335F8] text-sm font-black hover:bg-[#6335F8] hover:text-white transition-all shadow-sm active:scale-95"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPackages;
