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
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RedirectIfAuthenticated;