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
    "Favorites",
    "Business English",
    "IELTS Speaking",
    "Interview skills",
    "Grammar",
    "Vocabulary",
  ];

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('tutorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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
          image: t.avatar
            ? (t.avatar.startsWith('http') ? t.avatar : `http://localhost:8000/${t.avatar}`)
            : `https://i.pravatar.cc/150?u=${t.email}`,
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

    let matchesCategory = true;
    if (activeCategory === "Favorites") {
      matchesCategory = favorites.includes(t.id);
    } else if (activeCategory !== "All") {
      matchesCategory = t.subject === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const indexOfLast = currentPage * tutorsPerPage;
  const indexOfFirst = indexOfLast - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      // Save to localStorage
      localStorage.setItem('tutorFavorites', JSON.stringify(newFavorites));

      return newFavorites;
    });
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
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 md:px-8 bg-[#FDFDFF]  h-screen ">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="mt-17 sm:mt-10 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">  Find the perfect <span className="text-[#6335F8]">Tutor</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-lg">
            Expert-led sessions for career and language growth.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-96 ">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-sm sm:text-base font-medium focus:border-[#6335F8] outline-none "
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
            ${activeCategory === cat
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
      {currentTutors.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-2xl border border-gray-200 mb-50 sm:mb-0">
            <p className="text-gray-900 font-bold text-base sm:text-lg">
              No tutors available for this course.
            </p>
          </div>
        </div>
      ) : (
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
                  className={`p-2 rounded-xl ${favorites.includes(tutor.id)
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
      )}


      {/* ================= PAGINATION (NO SCROLL) ================= */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-9 h-9 sm:w-11 sm:h-11 text-xs sm:text-sm font-black rounded-xl ${currentPage === n
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
