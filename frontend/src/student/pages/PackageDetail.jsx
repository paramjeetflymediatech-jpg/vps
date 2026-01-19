"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudentPackages } from "@/api/student.api";
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  IndianRupee,
  ArrowLeft,
  Clock,
} from "lucide-react";

const PackageDetail = ({ id }) => {
  const router = useRouter(); 
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getStudentPackages(); // reuse existing API
        console.log(res);
        const found = res.data.data.find((p) => p._id === id);
        console.log(found);
        if (!found) throw new Error("Package not found");
        setPkg(found);
      } catch (err) {
        console.error(err);
        setError("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBFCFF]">
        <Loader2 className="animate-spin text-[#6335F8]" size={40} />
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="pt-24 px-6 text-center text-red-600 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFF] pt-16 md:pt-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-black text-gray-600 hover:text-[#6335F8]"
        >
          <ArrowLeft size={16} /> Back to Packages
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-[#6335F8] uppercase tracking-widest">
            <BookOpen size={14} />
            {pkg.category || "Learning Package"}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {pkg.title}
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            {pkg.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            {pkg.level && (
              <span className="px-4 py-1 text-xs font-black rounded-full bg-blue-50 text-blue-600">
                {pkg.level}
              </span>
            )}
            {pkg.validity && (
              <span className="px-4 py-1 text-xs font-black rounded-full bg-green-50 text-green-600 flex items-center gap-1">
                <Clock size={12} /> {pkg.validity}
              </span>
            )}
          </div>
        </div>

        {/* CONTENT LIST */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            What’s Included
          </h2>

          <div className="space-y-4">
            {(pkg.contents || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={18} />
                  <span className="font-bold text-gray-800">{item.title}</span>
                </div>
                {item.duration && (
                  <span className="text-xs font-bold text-gray-500">
                    {item.duration}
                  </span>
                )}
              </div>
            ))}

            {!pkg.contents?.length && (
              <p className="text-sm text-gray-500">
                Package content will be available after enrollment.
              </p>
            )}
          </div>
        </div>

        {/* PRICE & CTA */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-1">
              <IndianRupee size={18} />
              <span className="text-3xl font-black text-gray-900">
                {pkg.price}
              </span>
            </div>
            {pkg.discountPrice && (
              <div className="text-sm text-gray-400 font-bold line-through">
                ₹{pkg.discountPrice}
              </div>
            )}
          </div>

          {/* <button className="px-10 py-4 rounded-2xl bg-[#6335F8] text-white font-black hover:opacity-90 active:scale-95 transition">
            Enroll Now
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
