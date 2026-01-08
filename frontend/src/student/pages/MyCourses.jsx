import React, { useState } from 'react';
import Link from "next/link";
import { PlayCircle, CheckCircle, Clock, BookOpen, Search, Filter } from 'lucide-react';

const MyCourses = () => {
  const [filter, setFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Advanced English Speaking Masterclass",
      instructor: "Dr. Sarah Mitchell",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
      progress: 75,
      lessons: 24,
      status: "ongoing"
    },
    {
      id: 2,
      title: "Business Communication & Email Etiquette",
      instructor: "James Wilson",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      progress: 100,
      lessons: 15,
      status: "completed"
    },
    {
      id: 3,
      title: "IELTS Preparation: 8+ Band Strategy",
      instructor: "Emma Watson",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
      progress: 30,
      lessons: 40,
      status: "ongoing"
    }
  ];

  const filteredCourses = filter === 'all' ? courses : courses.filter(c => c.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">My Learning Journey</h1>
          <p className="text-gray-500 mt-1">Pick up where you left off and reach your goals.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
          {['all', 'ongoing', 'completed'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === type ? 'bg-white text-[#0852A1] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredCourses.map((course) => (
          <div key={course.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            
            {/* Image & Overlay */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={course.title} 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute top-4 left-4">
                {course.status === 'completed' ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                    <CheckCircle size={12} /> Completed
                  </span>
                ) : (
                  <span className="bg-[#0852A1] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                    In Progress
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-[#0852A1] transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 font-medium">By {course.instructor}</p>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-[#0852A1]">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-[#0852A1]'}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Bottom Info & Action */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessons} Lessons</span>
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
          </div>
        ))}

        {/* Empty State (Optional) */}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-400">No courses found in this category</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;