import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorPage from "./components/ui/ErrorPage";
import Loading from "./components/ui/Loading";
import UserManagement from "./pages/UserManagement";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const Register = lazy(() => import("./pages/Register"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const ReportIssue = lazy(() => import("./pages/ReportIssue"));
const MaintenanceDetails = lazy(() => import("./pages/MaintenanceDetails"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));
const AnnouncementDetails = lazy(
  () => import("./pages/AnnouncementDetailsPage"),
);
const CreateAnnouncement = lazy(() => import("./pages/CreateAnnouncement"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));

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
        <Suspense fallback={<Loading type="dashboard" />}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/"
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
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/maintenance/new" element={<ReportIssue />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
              <Route
                path="/announcements/:id"
                element={<AnnouncementDetails />}
              />
              <Route
                path="/announcements/new"
                element={<CreateAnnouncement />}
              />
            </Route>

            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
