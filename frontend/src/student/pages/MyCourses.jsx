import React, { useState } from 'react';
import Link from "next/link";
import { PlayCircle, CheckCircle, Clock, BookOpen, Search, Filter } from 'lucide-react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // Replace with your API call
        // const response = await fetch('/api/student/my-courses');
        // const data = await response.json();
        // setCourses(data);

        // Mock empty state for demo
        setCourses([]);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    filter === "all" ? courses : courses.filter((c) => c.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            My Learning Journey
          </h1>
          <p className="text-gray-500 mt-1">
            Pick up where you left off and reach your goals.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
          {["all", "ongoing", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === type
                  ? "bg-white text-[#0852A1] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES GRID / EMPTY STATE */}
      {isLoading ? (
        // LOADING SHIMMER
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 bg-gray-100 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* IMAGE & STATUS */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#0852A1] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                    {course.status}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  By {course.instructor}
                </p>
                {/* PROGRESS */}
                <div className="mt-6 space-y-2">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0852A1]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <Link href={`/student/courses/${course.id}`}>
                  <button
                    className={`p-3 rounded-xl transition-all ${
                      course.status === 'completed'
                        ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                        : 'bg-blue-50 text-[#0852A1] hover:bg-[#0852A1] hover:text-white'
                    }`}
                  >
                    <PlayCircle size={20} fill="currentColor" fillOpacity={0.1} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
       // Inside your empty state JSX:
<div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
    <Layout className="text-[#0852A1]" size={40} />
  </div>
  <h3 className="text-2xl font-black text-gray-900 mb-2">
    No Courses Yet
  </h3>
  <p className="text-gray-500 max-w-xs mx-auto mb-8">
    You haven't enrolled in any courses yet. Start your journey by exploring our catalog.
  </p>
  <Link
    to="/tutors"
    className="bg-[#0852A1] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 inline-block text-center"
  >
    Browse Courses
  </Link>
</div>
      )}
    </div>
  );
};

export default MyCourses;
