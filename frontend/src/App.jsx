
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./common/ScrollToTop";

/* ================= PUBLIC PAGES ================= */
import Home from "./Home/Home";
import Tutors from "./pages/Tutors";
import BecomeTutor from "./pages/BecomeTutor";
import Organizations from "./pages/Organizations";

/* ================= AUTH PAGES ================= */
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import VerifyOtp from "./authentication/VerifyOtp";
import ResetPassword from "./authentication/ResetPassword";
import RegisterOtp from "./authentication/Registerotp";

/* ================= DASHBOARD ================= */
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import Profile from "./dashboard/pages/Profile";
import BookNow from "./dashboard/pages/BookNow";
import TutorsDashboard from "./dashboard/pages/Tutors";
import TutorProfile from "./dashboard/pages/TutorProfile";
import Payments from "./dashboard/pages/Payments";
import Faq from "./dashboard/pages/Faq";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>  {/* ✅ Sirf Routes - NO BrowserRouter */}
        {/* 🌐 PUBLIC PAGES (Header + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/organizations" element={<Organizations />} />
        </Route>

        {/* 🔐 AUTH PAGES (NO Header / Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-otp" element={<RegisterOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-Otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🚀 DASHBOARD (JWT PROTECTED) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="book" element={<BookNow />} />
          <Route path="tutors" element={<TutorsDashboard />} />
          <Route path="tutors/:id" element={<TutorProfile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="faq" element={<Faq />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
