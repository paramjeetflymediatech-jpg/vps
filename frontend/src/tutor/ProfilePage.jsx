"use client";

import { useEffect, useState } from "react";
import { getTutorById } from "../api/tutorApi";
import { profileUpdate } from "../api/auth.api";
export default function ProfilePage({ id }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  // Fetch current profile
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getTutorById(id);
      const data = res?.data.success ? res.data.data : [];
      if (res?.data.success) {
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
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (avatar) formData.append("avatar", avatar);

    const res = await profileUpdate(user._id, formData);
    console.log(res, "res");
    const data = res?.data.success ? res.data.user : [];
    if (res?.data.success) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      });
      if (data.avatar) {
        setImagePreview(data.avatar); // ✅ updated image
      }
      setUser(data);
    }
    setLoading(false);
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold">Update Profile</h1>
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={imagePreview || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Profile Photo */}
        <div>
          <label className="text-sm font-medium">Profile Photo </label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setAvatar(file);
              if (file) {
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {message && (
          <p className="text-sm text-center text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
