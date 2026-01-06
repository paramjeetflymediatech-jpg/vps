import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation(); // 👈 CURRENT URL
  const token = getToken();
  const user = getUser();

  console.log("Current path:", location.pathname);
  console.log("Token:", token, "User:", user);

  // ❌ Not logged in
  if (!token || !user) {
    // 👉 If tutor route → redirect to tutor login
    if (location.pathname.startsWith("/tutor")) {
      return <Navigate to="/tutor/login" replace />;
    }

    // 👉 Default login
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
};

export default ProtectedRoute;
