"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentPackages } from "@/api/student.api";
import { BookOpen, Loader2, Rocket, CheckCircle2 } from "lucide-react";

const StudentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getStudentPackages({ userId: user.id });
        setPackages(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FBFCFF]">
        <Loader2 className="animate-spin text-[#6335F8] mb-2" size={40} />
        <p className="text-sm font-bold text-gray-500">
          Loading your packages...
        </p>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="pt-24 px-6 flex justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium text-sm">
          {error}
        </div>
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (!packages.length) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <Rocket className="mx-auto text-gray-300 mb-4" size={48} />
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            No Packages Found
          </h1>
          <p className="text-gray-500 text-sm">Please check back later.</p>
        </div>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <div className="min-h-screen bg-[#FBFCFF]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 pt-16 md:pt-10 space-y-8">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Learning Packages
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Choose the best plan for your learning journey
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              {/* TOP */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#6335F8] uppercase tracking-widest">
                    <BookOpen size={14} />
                    {pkg.category || "English Package"}
                  </div>

                  {pkg.isPaymentDone && (
                    <span className="text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-black uppercase">
                      Subscribed
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-black text-gray-900">
                    {pkg.title}
                  </h2>

                  {pkg.description && (
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {pkg.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Lifetime Access
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Certificate Included
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    ₹{pkg.price}
                  </div>
                  {pkg.discountPrice && (
                    <div className="text-xs text-gray-400 line-through font-bold">
                      ₹{pkg.discountPrice}
                    </div>
                  )}
                </div>

                {pkg.isPaymentDone ? (
                  <button
                    disabled
                    className="px-6 py-3 rounded-xl bg-green-50 text-green-600 text-sm font-black cursor-not-allowed"
                  >
                    Subscribed
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/student/packages/${pkg._id}`)}
                    className="px-6 py-3 rounded-xl bg-purple-50 text-[#6335F8] text-sm font-black hover:bg-[#6335F8] hover:text-white transition-all active:scale-95"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPackages;
