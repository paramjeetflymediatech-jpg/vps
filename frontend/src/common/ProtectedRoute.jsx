import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const user = getUser();

  // ❌ Not logged in
  if (!token || !user) {
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
