"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  Check,
  BookOpen,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import API from '@/api/axios.instance';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
      });
    }
    setLoading(false);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data if canceling
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);

      if (selectedFile) {
        data.append('avatar', selectedFile);
      }

      // Call API to update profile
      const res = await API.put('/auth/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success) {
        const updatedUser = res.data.user;
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        // Show success message in top-right corner
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  // Mock stats (can be made dynamic later)
  const stats = [
    { label: "Courses", value: "0", icon: <BookOpen className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Certificates", value: "0", icon: <Award className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Hours", value: "0h", icon: <Clock className="text-orange-600" />, bg: "bg-orange-50" },
    { label: "Score", value: "0", icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Success Message - Top Right Corner */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <Check size={20} />
            <span className="font-bold text-sm">Profile updated successfully!</span>
          </div>
        )}

        {/* Header Section */}
        <div className="relative">
          {/* Simplified Header - No gradient background */}

          {/* Profile Info */}
          <div className="px-4 sm:px-6 md:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative group">
                {previewUrl || user.avatar ? (
                  <img
                    src={previewUrl || (user.avatar?.startsWith('http') ? user.avatar : `http://localhost:8000/${user.avatar}`)}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl border-4 border-gray-200 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl border-4 border-gray-200 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-black">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 border-4 border-white rounded-full"></div>

                {/* Upload button when editing */}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 rounded-2xl sm:rounded-3xl flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <Edit3 size={24} className="mx-auto mb-1" />
                      <p className="text-xs font-bold">Change Photo</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">{user.name || 'User'}</h1>
                    <span className="inline-block mt-1 sm:mt-2 px-3 py-1 bg-blue-100 text-[#0852A1] text-xs font-bold uppercase rounded-full">
                      {user.role || 'Student'}
                    </span>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={isEditing ? handleSave : handleEditToggle}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#0852A1] text-white rounded-xl sm:rounded-2xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 size={18} /> Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Details Card */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 sm:mb-6">Profile Details</h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <User size={14} /> Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{formData.name.length}/50 characters</p>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-700 font-medium">{user.name || '-'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Mail size={14} /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-700 font-medium break-all">{user.email || '-'}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Phone size={14} /> Phone
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        maxLength={15}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{formData.phone.length}/15 characters</p>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-700 font-medium">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Joined Date (if available) */}
                {user.createdAt && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      <Calendar size={14} /> Member Since
                    </label>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Cancel button when editing */}
              {isEditing && (
                <button
                  onClick={handleEditToggle}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                    {stat.icon}
                  </div>
                  <p className="text-[10px] sm:text-xs uppercase font-black text-gray-400 tracking-wider mb-1">{stat.label}</p>
                  <h4 className="text-lg sm:text-xl font-black text-gray-800">{stat.value}</h4>
                </div>
              ))}
            </div>

            {/* Call to Action Card */}
            <div className="bg-gradient-to-r from-[#0852A1] to-indigo-600 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">Start Your Learning Journey!</h3>
              <p className="text-blue-100 text-sm mb-4 sm:mb-6">Explore our courses and begin mastering English today.</p>
              <button
                onClick={() => window.location.href = '/student/packages'}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#0852A1] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;