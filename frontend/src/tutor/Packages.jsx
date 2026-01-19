"use client";

import { useEffect, useState } from "react";
import { getTutorPackages } from "@/api/tutorApi";
import {
  BookOpen,
  Loader2,
  Package,
  Users,
  Clock,
  TrendingUp,
  Star,
  Eye,
  Edit,
} from "lucide-react";

const TutorPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getTutorPackages();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 md:pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                Course Packages
              </h1>
              <p className="text-slate-600">
                {packages.length > 0
                  ? `Manage your ${packages.length} package${packages.length > 1 ? 's' : ''}`
                  : "No packages available yet"
                }
              </p>
            </div>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">No Packages Yet</h3>
            <p className="text-slate-600 mb-6">Contact admin to create course packages</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className={`h-32 bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-500 to-blue-600' :
                    index % 3 === 1 ? 'from-purple-500 to-purple-600' :
                      'from-green-500 to-green-600'
                  } p-6 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider">
                      <BookOpen size={14} />
                      {pkg.category || "Package"}
                    </div>
                    {pkg.level && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        {pkg.level}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-white line-clamp-2">
                    {pkg.title}
                  </h2>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {pkg.description && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {pkg.description}
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                        <Clock size={12} />
                        <span>Duration</span>
                      </div>
                      <p className="font-black text-slate-900">{pkg.lessons || 0} Lessons</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                        <Users size={12} />
                        <span>Enrolled</span>
                      </div>
                      <p className="font-black text-slate-900">0 Students</p>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-blue-600">
                          ₹{pkg.price}
                        </span>
                        {pkg.discountPrice && pkg.discountPrice > pkg.price && (
                          <span className="text-sm text-slate-400 line-through">
                            ₹{pkg.discountPrice}
                          </span>
                        )}
                      </div>
                      {pkg.discountPrice && pkg.discountPrice > pkg.price && (
                        <p className="text-xs text-green-600 font-bold">
                          Save ₹{pkg.discountPrice - pkg.price}
                        </p>
                      )}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl font-bold transition-all group-hover:shadow-md">
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPackages;
