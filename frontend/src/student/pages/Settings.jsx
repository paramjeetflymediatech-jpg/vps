import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Camera, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Tab Navigation (Scrollable on mobile) */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap lg:w-full ${
                activeTab === tab.id 
                ? 'bg-[#0852A1] text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100 lg:border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-10">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Profile Photo Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-50">
                <div className="relative group">
                  <img 
                    src="https://i.pravatar.cc/150?u=rahul" 
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-50"
                    alt="Profile"
                  />
                  <button className="absolute -bottom-2 -right-2 p-2 bg-[#0852A1] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-900">Profile Picture</h3>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB. Recommended 400x400.</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <input type="text" defaultValue="Rahul Sharma" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-gray-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <input type="email" defaultValue="rahul@example.com" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-gray-800" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Bio</label>
                  <textarea rows="3" placeholder="Tell us about your learning goals..." className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-gray-800"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <ShieldCheck className="text-[#0852A1]" size={24} />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Two-Factor Authentication</h4>
                  <p className="text-xs text-blue-700">Recommended for maximum account safety.</p>
                </div>
                <button className="ml-auto text-xs font-black text-[#0852A1] uppercase tracking-wider">Enable</button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</label>
                  <input type="password" placeholder="Min. 8 characters" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {[
                { title: 'Course Updates', desc: 'Notify me about new lessons and assignments.', icon: <Smartphone /> },
                { title: 'Live Session Reminders', desc: 'Get alerts before your live classes start.', icon: <Bell /> },
                { title: 'Newsletter', desc: 'Receive weekly English tips and platform updates.', icon: <Globe /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0852A1]"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Save Button Container */}
          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
            {isSaved ? (
              <div className="flex items-center gap-2 text-green-600 font-bold animate-bounce">
                <CheckCircle2 size={18} />
                <span className="text-sm">Changes Saved!</span>
              </div>
            ) : <div />}
            <button 
              onClick={handleSave}
              className="px-10 py-4 bg-[#0852A1] text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;