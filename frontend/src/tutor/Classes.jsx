"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  X,
  Loader2,
  Check,
  Video,
  Eye,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
} from "../api/classes.api";
import { getCourses, updateCourse } from "../api/course.api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Classes = () => {
  const [user, setUser] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    maxStudents: 50,
    meetingLink: "",
    schedule: [{ day: "Mon", startTime: "", endTime: "" }],
  });

  const handleMeetingLinkChange = (courseId, value) => {
    setMeetingLinks(prev => ({ ...prev, [courseId]: value }));
  };

  // Validate Google Meet link
  const isValidGoogleMeetLink = (url) => {
    const googleMeetPattern = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    return googleMeetPattern.test(url);
  };

  const saveMeetingLink = async (courseId) => {
    try {
      const meetingLink = meetingLinks[courseId]?.trim();

      if (!meetingLink) {
        setSuccessMessage('Please enter a meeting link');
        setIsError(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        return;
      }

      // Validate Google Meet URL
      if (!isValidGoogleMeetLink(meetingLink)) {
        setSuccessMessage('Please enter a valid Google Meet link (e.g., https://meet.google.com/xxx-yyyy-zzz)');
        setIsError(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        return;
      }

      // Check if link is already used by another course (excluding current course's original link)
      const currentCourse = assignedCourses.find(c => c._id === courseId);
      const duplicateCourse = assignedCourses.find(
        course => course._id !== courseId && course.meetingLink === meetingLink
      );

      if (duplicateCourse) {
        setSuccessMessage(`This meeting link is already used by "${duplicateCourse.title}". Please use a unique link for each course.`);
        setIsError(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        return;
      }

      const res = await updateCourse(courseId, { meetingLink });
      if (res?.data) {
        // Update local state
        setAssignedCourses(prev =>
          prev.map(course =>
            course._id === courseId
              ? { ...course, meetingLink }
              : course
          )
        );

        // Clear the input
        setMeetingLinks(prev => ({ ...prev, [courseId]: '' }));
        setEditingLinkId(null);

        // Show success notification
        setSuccessMessage('Meeting link saved successfully!');
        setIsError(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save meeting link', error);
      setSuccessMessage('Failed to save meeting link');
      setIsError(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchAssignedCourses();
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res?.data || []);
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  };

  const fetchAssignedCourses = async () => {
    if (!user?.id && !user?._id) return;

    try {
      setLoading(true);
      const tutorId = user.id || user._id;

      // Fetch courses where this tutor is assigned
      const res = await getCourses({ tutorId });

      if (res?.data) {
        const courses = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAssignedCourses(courses);

        // Initialize meetingLinks with existing links so input is editable
        const links = {};
        courses.forEach(course => {
          if (course.meetingLink) {
            links[course._id] = course.meetingLink;
          }
        });
        setMeetingLinks(links);
      }
    } catch (err) {
      console.error("Failed to load assigned courses", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 md:pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success/Error Message - Top Right Corner */}
        {showSuccess && (
          <div className={`fixed top-4 right-4 z-50 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right max-w-md`}>
            <Check size={20} />
            <span className="font-bold text-sm">{successMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            My Courses
          </h1>
          <p className="text-slate-600">
            {assignedCourses.length > 0
              ? `Managing ${assignedCourses.length} course${assignedCourses.length > 1 ? 's' : ''} assigned to you`
              : "No courses assigned yet. Contact admin to get started."
            }
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-slate-600 font-medium">Loading courses...</p>
            </div>
          </div>
        ) : assignedCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
            <Video size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2">No Courses Assigned</h3>
            <p className="text-slate-600">Contact your admin to get courses assigned to you</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on mobile/tablet */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm">
                  <div className="col-span-4">Course Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-4 text-center">Meeting Link</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-100">
                {assignedCourses.map((course, index) => (
                  <div
                    key={course._id}
                    className="px-6 py-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Course Details */}
                      <div className="col-span-4">
                        <h3 className="font-black text-slate-900 mb-1">{course.title}</h3>
                        {course.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                        )}
                        {course.expiryDate && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Valid until: {new Date(course.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-lg">
                          <IndianRupee size={14} className="text-blue-600" />
                          <span className="font-black text-blue-600">{course.price || 'Free'}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        {course.published ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold">
                            <CheckCircle size={14} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold">
                            <XCircle size={14} />
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Meeting Link */}
                      <div className="col-span-4">
                        {editingLinkId === course._id ? (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://meet.google.com/xxx-yyyy-zzz"
                              className="flex-1 px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              value={meetingLinks[course._id] || ""}
                              onChange={(e) => handleMeetingLinkChange(course._id, e.target.value)}
                            />
                            <button
                              onClick={() => saveMeetingLink(course._id)}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingLinkId(null);
                                setMeetingLinks(prev => ({ ...prev, [course._id]: course.meetingLink || '' }));
                              }}
                              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : course.meetingLink ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                              <Video size={14} className="text-green-600" />
                              <span className="text-sm text-green-700 font-medium truncate">
                                {course.meetingLink.substring(0, 30)}...
                              </span>
                            </div>
                            <button
                              onClick={() => setEditingLinkId(course._id)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              title="Edit link"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingLinkId(course._id)}
                            className="w-full px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition font-bold text-sm"
                          >
                            + Add Meeting Link
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile/Tablet Card View - Hidden on desktop */}
            <div className="lg:hidden space-y-4">
              {assignedCourses.map((course, index) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${index % 3 === 0 ? 'from-blue-500 to-blue-600' :
                    index % 3 === 1 ? 'from-purple-500 to-purple-600' :
                      'from-green-500 to-green-600'
                    } p-4`}>
                    <h3 className="font-black text-white text-lg mb-1">{course.title}</h3>
                    <div className="flex items-center gap-2">
                      {course.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold">
                          <CheckCircle size={12} />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold">
                          <XCircle size={12} />
                          Draft
                        </span>
                      )}
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold">
                        <IndianRupee size={12} />
                        {course.price || 'Free'}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Description */}
                    {course.description && (
                      <p className="text-sm text-slate-600">{course.description}</p>
                    )}

                    {/* Expiry Date */}
                    {course.expiryDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        Valid until: {new Date(course.expiryDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Meeting Link Section */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Meeting Link
                      </p>

                      {editingLinkId === course._id ? (
                        <div className="space-y-2">
                          <input
                            type="url"
                            placeholder="https://meet.google.com/xxx-yyyy-zzz"
                            className="w-full px-3 py-2 text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={meetingLinks[course._id] || ""}
                            onChange={(e) => handleMeetingLinkChange(course._id, e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveMeetingLink(course._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
                            >
                              <Check size={16} />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingLinkId(null);
                                setMeetingLinks(prev => ({ ...prev, [course._id]: course.meetingLink || '' }));
                              }}
                              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-bold"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : course.meetingLink ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                            <Video size={14} className="text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700 font-medium truncate flex-1">
                              {course.meetingLink}
                            </span>
                          </div>
                          <button
                            onClick={() => setEditingLinkId(course._id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                          >
                            <Edit3 size={16} />
                            Edit Link
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingLinkId(course._id)}
                          className="w-full px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition font-bold text-sm"
                        >
                          + Add Meeting Link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Classes;
