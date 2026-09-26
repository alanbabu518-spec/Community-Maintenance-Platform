import { Navigate } from "react-router-dom";

import { MorphingSpinner } from "./ui/MorphingSpinner";
import { useAuth } from "../context/AuthContext";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <MorphingSpinner size="lg" />

          <p className="flex gap-1 text-lg text-foreground">
            Loading
          </p>
        </div>
      </main>
    );
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