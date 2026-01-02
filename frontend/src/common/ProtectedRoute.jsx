import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  // user = { id, name, role }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
