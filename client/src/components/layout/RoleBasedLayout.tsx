import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "./DashboardLayout";
import AdminLayout from "./AdminLayout";
import ManagerLayout from "./ManagerLayout";
import TechnicianLayout from "./TechnicianLayout";

function RoleBasedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <AdminLayout />;
  }

  if (user.role === "MANAGER") {
    return <ManagerLayout />;
  }

  if (user.role === "TECHNICIAN") {
    return <TechnicianLayout />;
  }

  return <DashboardLayout />;
}

export default RoleBasedLayout;
