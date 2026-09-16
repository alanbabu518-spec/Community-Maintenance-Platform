import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Maintenance from "./pages/Maintenance";
import ReportIssue from "./pages/ReportIssue";
import MaintenanceDetails from "./pages/MaintenanceDetails";
import ErrorPage from "./components/ui/ErrorPage";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorPage
      errorCode="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist or may have been moved."
      onBack={() => navigate("/dashboard")}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance/new" element={<ReportIssue />} />
            <Route
              path="/maintenance/:id"
              element={
                <ProtectedRoute>
                  <MaintenanceDetails />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
