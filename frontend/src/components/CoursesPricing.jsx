// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const pricingPlans = [
//   {
//     lessons: "8 Lessons",
//     price: 1,
//     badge: false,
//     features: [
//       "1-on-1 live sessions",
//       "Personalized learning plan",
//       "Flexible scheduling",
//       "Session recordings",
//       "Includes GST",
//     ],
//   },
//   {
//     lessons: "12 Lessons",
//     price: 3530,
//     badge: true, // ⭐ MOST POPULAR
//     features: [
//       "1-on-1 live sessions",
//       "Personalized learning plan",
//       "Flexible scheduling",
//       "Session recordings",
//       "Priority support",
//       "Includes GST",
//     ],
//   },
//   {
//     lessons: "16 Lessons",
//     price: 4720,
//     badge: false,
//     features: [
//       "1-on-1 live sessions",
//       "Personalized learning plan",
//       "Flexible scheduling",
//       "Session recordings",
//       "Extended practice sessions",
//       "Includes GST",
//     ],
//   },
// ];

// const CoursesPricing = () => {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // ✅ Safe client-side auth check
//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("token"));
//   }, []);

//   // ✅ Buy Now handler
//   const handleBuyNow = () => {
//     if (isLoggedIn) {
//       router.push("/payment/upi");
//     } else {
//       router.push("/login");
//     }
//   };

//   return (
//     <section className="bg-[#F8F3F3] py-20">
//       <div className="max-w-7xl mx-auto px-4">

//         {/* ===== HEADER ===== */}
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">
//             Simple & Transparent Pricing
//           </h2>
//           <p className="text-gray-600 text-sm leading-relaxed">
//             Choose the perfect lesson pack and start improving your English
//             with expert trainers. No hidden charges.
//           </p>
//         </div>

//         {/* ===== PRICING CARDS ===== */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {pricingPlans.map((plan, index) => (
//             <div
//               key={index}
//               className={`relative bg-white rounded-2xl shadow-lg p-8 text-center border transition
//                 ${
//                   plan.badge
//                     ? "border-[#0852A1] scale-105"
//                     : "border-gray-200"
//                 }`}
//             >
//               {/* BADGE */}
//               {plan.badge && (
//                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0852A1] text-white text-xs px-3 py-1 rounded-full font-semibold">
//                   Most Popular
//                 </span>
//               )}

//               {/* TITLE */}
//               <h3 className="text-xl font-bold text-gray-800 mb-4">
//                 {plan.lessons}
//               </h3>

//               {/* PRICE */}
//               <div className="mb-6">
//                 <span className="text-sm align-top">₹</span>
//                 <span className="text-4xl font-bold">{plan.price}</span>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Including GST
//                 </p>
//               </div>

//               {/* FEATURES */}
//               <ul className="space-y-3 text-sm text-gray-600 text-left mb-8">
//                 {plan.features.map((feature, i) => (
//                   <li key={i} className="flex items-start gap-2">
//                     <span className="text-[#0852A1] font-bold">✓</span>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>

//               {/* BUY BUTTON */}
//               <button
//                 onClick={handleBuyNow}
//                 className="w-full border border-[#0852A1]
//                            text-[#0852A1] py-2 rounded-full font-semibold
//                            hover:bg-[#0852A1] hover:text-white transition"
//               >
//                 Buy Now
//               </button>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default CoursesPricing;



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPackages } from "@/api/package.api";

const CoursesPricing = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Safe client-side auth check
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // ✅ Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // ✅ Buy Now handler with package details
  const handleBuyNow = (pkg) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const amount = pkg.price;
    const lessons = pkg.title; // Assuming title is like "8 Lessons"

    // Pass package id, amount, and lessons as query params
    router.push(`/payment/upi?packageId=${pkg._id}&amount=${amount}&lessons=${encodeURIComponent(lessons)}`);
  };

  if (loading) {
    return (
      <section className="bg-[#F8F3F3] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Loading packages...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F3F3] py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Simple & Transparent Pricing
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Choose the perfect lesson pack and start improving your English
            with expert trainers. No hidden charges.
          </p>
        </div>

        {/* ===== PRICING CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 text-center border transition
                ${
                  index === 1 // Assuming second one is most popular
                    ? "border-[#0852A1] scale-105"
                    : "border-gray-200"
                }`}
            >
              {/* BADGE */}
              {index === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0852A1] text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Most Popular
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {pkg.title}
              </h3>

              {/* PRICE */}
              <div className="mb-6">
                <span className="text-sm align-top">₹</span>
                <span className="text-4xl font-bold">{pkg.price}</span>
                <p className="text-sm text-gray-500 mt-1">
                  Including GST
                </p>
              </div>

              {/* FEATURES - Using default features or from description */}
              <ul className="space-y-3 text-sm text-gray-600 text-left mb-8">
                {pkg.description ? (
                  <li className="flex items-start gap-2">
                    <span className="text-[#0852A1] font-bold">✓</span>
                    {pkg.description}
                  </li>
                ) : (
                  [
                    "1-on-1 live sessions",
                    "Personalized learning plan",
                    "Flexible scheduling",
                    "Session recordings",
                    "Includes GST",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#0852A1] font-bold">✓</span>
                      {feature}
                    </li>
                  ))
                )}
              </ul>

              {/* BUY BUTTON */}
              <button
                onClick={() => handleBuyNow(pkg)}
                className="w-full border border-[#0852A1]
                           text-[#0852A1] py-2 rounded-full font-semibold
                           hover:bg-[#0852A1] hover:text-white transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoursesPricing;
