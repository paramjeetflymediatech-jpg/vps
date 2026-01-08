import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./common/ScrollToTop";

/* ================= PUBLIC PAGES ================= */
import Home from "./views/Home";
import Tutors from "./views/Tutors";
import BecomeTutor from "./views/BecomeTutor";
import Organizations from "./views/Organizations";
import Contact from "./views/contact";
import Demo from "./views/demo";

/* ================= AUTH PAGES ================= */
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import VerifyOtp from "./authentication/VerifyOtp";
import ResetPassword from "./authentication/ResetPassword";
import RegisterOtp from "./authentication/Registerotp";

/* TUTOR */
import TutorLogin from "./tutor/pages/TutorLogin";
import TutorDashboard from "./tutor/pages/Dashboard";
import Courses from "./tutor/Courses";
import Classes from "./tutor/Classes";
import Settings from "./tutor/Settings";
import TutorLayout from "./tutor/pages/TutorLayout";

/* ================= STUDENT ================= */
import StudentLayout from "./student/StudentLayout";
import StudentDashboard from "./student/pages/Dashboard";
import MyCourses from "./student/pages/MyCourses";
import ClassDeatail from "./student/pages/ClassDeatail";
import CourseDetails from "./student/pages/CourseDetails";
import StudentProfile from "./student/pages/Profile";
import StudentSettings from "./student/pages/Settings";

/* ================= DASHBOARD ================= */
import DashboardRedirect from "./views/DashboardRedirect";

/* ================= ADMIN ================= */
import ProtectedRoute from "./common/ProtectedRoute";
import Dashboard from "./tutor/pages/Dashboard";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* 🌐 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<Demo />} />
        </Route>

        {/* 🔐 AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-otp" element={<RegisterOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔁 DASHBOARD REDIRECT */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* 👨‍🏫 TUTOR */}
        <Route path="/tutor/login" element={<TutorLogin />} />

        {/* Tutor */}
        {/* 👨‍🏫 TUTOR DASHBOARD WITH LAYOUT */}
        <Route path="/tutor" element={<TutorLayout />}>
          <Route index element={<TutorDashboard />} />
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/:id" element={<ClassDeatail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="courses" element={<Courses />} />
        </Route>

        {/* 🎓 STUDENT DASHBOARD */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
