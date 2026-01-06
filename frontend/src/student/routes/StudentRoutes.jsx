import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Wrapper
import AppLayout from './layouts/AppLayout';

// Page Components
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Sabhi student pages is "AppLayout" ke andar render honge */}
      <Route element={<AppLayout />}>
        
        {/* Default redirect: Jab koi /student par aaye to dashboard dikhao */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<MyCourses />} />
        
        {/* Dynamic Route for individual course details */}
        <Route path="courses/:courseId" element={<CourseDetails />} />
        
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Future routes like Live Sessions or Quizzes can be added here */}
        <Route path="live" element={<div className="p-8 text-center font-bold">Live Sessions Coming Soon!</div>} />
        <Route path="schedule" element={<div className="p-8 text-center font-bold">Schedule Coming Soon!</div>} />
        
      </Route>

      {/* 404 Page (Optional) */}
      <Route path="*" element={<div className="h-screen flex items-center justify-center">Page Not Found</div>} />
    </Routes>
  );
};

export default StudentRoutes;