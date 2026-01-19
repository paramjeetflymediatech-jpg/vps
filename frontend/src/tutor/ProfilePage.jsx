"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTutorById } from "../api/tutorApi";
import { profileUpdate } from "../api/auth.api";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Check,
  Camera,
  Award,
  BookOpen,
  Star,
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch current profile
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const res = await getTutorById(id);
        const data = res?.data?.data;
        if (res?.data?.success && data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
          setUser(data);
          if (data.avatar) {
            setImagePreview(data.avatar);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setAvatar(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (avatar) formData.append("avatar", avatar);

      const res = await profileUpdate(user._id, formData);
      const data = res?.data.success ? res.data.user : [];

      if (res?.data.success) {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
        if (data.avatar) {
          setImagePreview(data.avatar);
        }
        setUser(data);

        const newdata = {
          id: data._id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          role: data.role,
          organizationId: data.organizationId,
        };
        localStorage.setItem("user", JSON.stringify(newdata));

        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 md:pt-6 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <Check size={20} />
            <span className="font-bold text-sm">Profile updated successfully!</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Tutor Profile
          </h1>
          <p className="text-slate-600">Manage your profile information and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">

          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 h-full">
              {/* Avatar */}
              <div className="relative group mb-6">
                {imagePreview ? (
                  <img
                    src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:8000/${imagePreview}`}
                    alt="Profile"
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black border-4 border-blue-100 shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                )}

                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <Camera size={24} className="mx-auto mb-1" />
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

              {/* Name & Role */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  {user?.name || 'Tutor'}
                </h2>
                <p className="text-sm text-slate-500 font-medium">{user?.role || 'Tutor'}</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Courses</span>
                  </div>
                  <span className="font-black text-blue-600">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Rating</span>
                  </div>
                  <span className="font-black text-purple-600">4.9</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-slate-700">Experience</span>
                  </div>
                  <span className="font-black text-green-600">2+ yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setAvatar(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <User size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium px-4 py-3 bg-slate-50 rounded-xl">
                      {user?.name || '-'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium px-4 py-3 bg-slate-50 rounded-xl break-all">
                      {user?.email || '-'}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={15}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium px-4 py-3 bg-slate-50 rounded-xl">
                      {user?.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
