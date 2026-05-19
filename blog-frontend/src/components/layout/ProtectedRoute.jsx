import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui";

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner center />;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Account suspended → redirect to unauthorized
  if (user.status === "suspended")
    return <Navigate to="/unauthorized" replace />;

  // ✅ Role not allowed → redirect to unauthorized (not home)
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
