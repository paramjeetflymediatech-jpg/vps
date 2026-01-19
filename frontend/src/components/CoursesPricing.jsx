"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPackages } from "@/api/package.api";

const CoursesPricing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tutorId = searchParams.get("tutorId");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Auth check (client-side safe)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // ✅ Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getPackages();
        setPackages(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // ✅ Buy Now handler
  const handleBuyNow = (pkg) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Ensure the price is the lower of regular price or discount price (if valid)
    const hasValidDiscount = pkg.discountPrice && pkg.discountPrice < pkg.price;
    const amount = hasValidDiscount ? pkg.discountPrice : pkg.price;

    const lessons =
      pkg.lessons ? `${pkg.lessons} Lessons` : pkg.title || "Package";

    let url = `/payment/upi?packageId=${pkg._id}&amount=${amount}&lessons=${encodeURIComponent(
      lessons
    )}`;

    if (tutorId) {
      url += `&tutorId=${tutorId}`;
    }

    router.push(url);
  };

  if (loading) {
    return (
      <section className="py-20 text-center bg-[#F8F3F3]">
        <p className="text-gray-600">Loading plans...</p>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F3F3] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Simple & Transparent Pricing
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose the perfect lesson pack and start learning with expert
            trainers. No hidden charges.
          </p>
        </div>

        {/* ===== PRICING CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isPopular = index === 1;
            const hasDiscount =
              pkg.discountPrice && pkg.discountPrice < pkg.price;

            const discountPercentage = hasDiscount
              ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100)
              : 0;

            return (
              <div
                key={pkg._id}
                className={`relative bg-white rounded-2xl p-6 shadow-md transition-all
                ${isPopular
                    ? "border-2 border-[#0852A1] scale-105"
                    : "border border-gray-200"
                  }`}
              >
                {/* POPULAR BADGE */}
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0852A1] text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Most Popular
                  </span>
                )}

                {/* TITLE */}
                <h3 className="text-xl font-bold text-gray-800 text-center">
                  {pkg.lessons ? `${pkg.lessons} Lessons` : pkg.title}
                </h3>

                {/* META */}
                <div className="text-xs text-gray-500 text-center mt-2 mb-4 space-y-1">
                  {pkg.lessonDuration && (
                    <p>{pkg.lessonDuration} min per lesson</p>
                  )}
                  {pkg.accessDurationDays && (
                    <p>Access for {pkg.accessDurationDays} days</p>
                  )}
                </div>

                {/* PRICE */}
                <div className="mb-6 text-center">
                  {hasDiscount ? (
                    <>
                      <div className="text-3xl sm:text-4xl font-bold text-gray-800">
                        ₹{pkg.discountPrice}
                      </div>
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="flex justify-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ₹{pkg.price}
                          </span>
                          <span className="text-green-600 text-sm font-semibold">
                            {discountPercentage}% OFF
                          </span>
                        </div>
                        <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-wider font-bold">
                          Save ₹{pkg.price - pkg.discountPrice}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-bold text-[#0852A1]">
                      ₹{pkg.price}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    Inclusive of GST
                  </p>
                </div>

                {/* FEATURES */}
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  {pkg.description
                    ? pkg.description.split("\n").map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#0852A1] font-bold">✓</span>
                        {item}
                      </li>
                    ))
                    : [
                      "1-on-1 live sessions",
                      "Personalized learning plan",
                      "Flexible scheduling",
                      "Session recordings",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#0852A1] font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                </ul>

                {/* BUTTON */}
                <button
                  onClick={() => handleBuyNow(pkg)}
                  className="w-full border border-[#0852A1] text-[#0852A1] py-2.5 rounded-full font-semibold
                  hover:bg-[#0852A1] hover:text-white transition"
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CoursesPricing;
