import React from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Edit3,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const Profile = () => {
  // Mock data for display
  const user = {
    name: "Rahul Sharma",
    role: "Advanced Learner",
    email: "rahul.sharma@example.com",
    location: "Mumbai, India",
    joined: "January 2024",
    bio: "Passionate about mastering English for international business. Currently focusing on accent reduction and advanced grammar.",
    stats: [
      { label: "Courses Done", value: "08", icon: <BookOpen className="text-blue-600" />, bg: "bg-blue-50" },
      { label: "Certificates", value: "04", icon: <Award className="text-purple-600" />, bg: "bg-purple-50" },
      { label: "Hours Learnt", value: "124h", icon: <Clock className="text-orange-600" />, bg: "bg-orange-50" },
      { label: "Skill Score", value: "850", icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50" },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* 1. TOP HERO SECTION */}
      <div className="relative group">
        {/* Cover Image Placeholder */}
        <div className="h-40 md:h-60 w-full bg-gradient-to-r from-[#0852A1] to-indigo-600 rounded-[2.5rem] shadow-lg"></div>
        
        {/* Profile Info Overlay */}
        <div className="px-6 md:px-12 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?u=rahul" 
              alt="Profile" 
              className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] border-8 border-white shadow-xl object-cover"
            />
            <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left pb-4 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
              <span className="px-3 py-1 bg-blue-100 text-[#0852A1] text-[10px] font-black uppercase rounded-full self-center md:self-auto">
                {user.role}
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><Mail size={16} /> {user.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {user.location}</span>
            </div>
          </div>

          <button className="mb-4 flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: About & Skills */}
        <div className="lg:col-span-1 space-y-8">
          {/* About Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-4">About Me</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {user.bio}
            </p>
            <div className="mt-6 flex gap-3">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <button key={i} className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#0852A1] rounded-xl transition-colors">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Skill Proficiency</h3>
            <div className="space-y-6">
              {[
                { name: 'Vocabulary', level: '85%', color: 'bg-blue-500' },
                { name: 'Grammar', level: '70%', color: 'bg-purple-500' },
                { name: 'Pronunciation', level: '60%', color: 'bg-orange-500' },
              ].map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>{skill.name}</span>
                    <span className="text-gray-900">{skill.level}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color} transition-all duration-1000`} style={{ width: skill.level }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Stats & Badges */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">{stat.label}</p>
                <h4 className="text-xl font-black text-gray-800">{stat.value}</h4>
              </div>
            ))}
          </div>

          {/* Recent Achievement / Learning Activity Placeholder */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">Recent Achievements</h3>
              <button className="text-xs font-black text-[#0852A1] uppercase tracking-wider hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Fast Learner', date: 'Earned 2 days ago', desc: 'Completed 5 lessons in 24 hours', icon: '⚡' },
                { title: '7-Day Streak', date: 'Earned yesterday', desc: 'Active for a full week!', icon: '🔥' },
              ].map((badge, i) => (
                <div key={i} className="flex gap-4 p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{badge.title}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{badge.desc}</p>
                    <p className="text-[10px] text-[#0852A1] font-bold mt-1 uppercase tracking-tighter">{badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges / Certifications Container */}
          <div className="bg-[#0852A1] p-8 rounded-[2rem] shadow-xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-black text-white leading-tight">Ready to graduate?</h3>
              <p className="text-blue-100 text-sm mt-2 opacity-80">Finish your final exam and unlock your professional certificate.</p>
              <button className="mt-6 px-8 py-3 bg-white text-[#0852A1] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Take Final Test
              </button>
            </div>
            <Award className="text-white opacity-10 absolute -right-4 -bottom-4" size={200} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;