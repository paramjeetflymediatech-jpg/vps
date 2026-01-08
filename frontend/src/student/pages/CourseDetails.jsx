import React, { useState } from 'react';

import { 
  PlayCircle, 
  FileText, 
  Clock, 
  Globe, 
  Users, 
  Star, 
  CheckCircle2,
  ChevronRight,
  Lock
} from 'lucide-react';

const CourseDetails = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const syllabus = [
    { title: "Introduction to English Grammar", duration: "15:00", completed: true },
    { title: "Mastering Tenses - Present & Past", duration: "45:20", completed: true },
    { title: "Active & Passive Voice Pro", duration: "32:10", completed: false },
    { title: "Business Communication Basics", duration: "28:45", completed: false },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <span className="hover:text-[#0852A1] cursor-pointer">Courses</span>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">English Speaking Masterclass</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Video / Banner Container */}
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              alt="Course Preview" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 backdrop-blur-md p-6 rounded-full text-white hover:scale-110 transition-transform">
                <PlayCircle size={60} fill="currentColor" className="text-white" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="bg-[#0852A1] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Preview Lesson</span>
            </div>
          </div>

          {/* Course Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {['overview', 'curriculum', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold capitalize transition-all relative ${
                    activeTab === tab ? 'text-[#0852A1]' : 'text-gray-400'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0852A1] rounded-t-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-gray-900">English Speaking Masterclass: 2026 Edition</h1>
              <p className="text-gray-600 leading-relaxed text-lg">
                This course is designed for intermediate learners who want to achieve native-level fluency. 
                We focus on real-world conversations, accent reduction, and professional vocabulary.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[
                  "Master advanced grammar structures",
                  "Speak fluently in professional meetings",
                  "Understand 95% of English movies",
                  "Perfect your British & American accent"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Curriculum */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              {syllabus.map((lesson, i) => (
                <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${lesson.completed ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100 hover:border-[#0852A1]'}`}>
                  <div className="flex items-center gap-4">
                    {lesson.completed ? (
                      <CheckCircle2 className="text-[#0852A1]" size={22} />
                    ) : (
                      <Lock className="text-gray-300" size={22} />
                    )}
                    <div>
                      <h4 className={`font-bold ${lesson.completed ? 'text-gray-900' : 'text-gray-500'}`}>{lesson.title}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {lesson.duration} mins
                      </p>
                    </div>
                  </div>
                  <button className={`text-xs font-bold px-4 py-2 rounded-lg ${lesson.completed ? 'bg-white text-[#0852A1] shadow-sm' : 'text-gray-400'}`}>
                    {lesson.completed ? 'Watch Again' : 'Locked'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (Purchase/Enrolled Card) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl sticky top-24 space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">₹4,999</span>
              <span className="text-gray-400 line-through">₹9,999</span>
              <span className="text-green-500 font-bold text-sm">50% OFF</span>
            </div>

            <div className="space-y-3">
              <button className="w-full py-4 bg-[#0852A1] text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Enroll Now
              </button>
              <button className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
                Try Free Demo
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <p className="font-bold text-gray-800 text-sm">This course includes:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <PlayCircle size={18} className="text-[#0852A1]" /> 45 hours of HD video
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FileText size={18} className="text-[#0852A1]" /> 12 downloadable resources
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users size={18} className="text-[#0852A1]" /> Interactive Student Community
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Globe size={18} className="text-[#0852A1]" /> Lifetime access
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?u=instructor" className="w-12 h-12 rounded-full object-cover" alt="Instructor" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Instructor</p>
                  <h4 className="font-bold text-gray-900">Dr. Sarah Mitchell</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;