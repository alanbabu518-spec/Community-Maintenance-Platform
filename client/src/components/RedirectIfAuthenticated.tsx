import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "MANAGER") {
      return <Navigate to="/manager/dashboard" replace />;
    }

    if (user.role === "TECHNICIAN") {
      return <Navigate to="/technician/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RedirectIfAuthenticated;