import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";
import TechnicianLayout from "./components/layout/TechnicianLayout";

import ErrorPage from "./components/ui/ErrorPage";
import Loading from "./components/ui/Loading";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import GoogleSetup from "./pages/GoogleSetup";
import TechnicianDashboard from "./pages/TechnicianDashboard";

const Register = lazy(() => import("./pages/Register"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard"));

const Maintenance = lazy(() => import("./pages/Maintenance"));
const ReportIssue = lazy(() => import("./pages/ReportIssue"));
const MaintenanceDetails = lazy(() => import("./pages/MaintenanceDetails"));
const ManagerCommunity = lazy(() => import("./pages/ManagerCommunity"));

const UserManagement = lazy(() => import("./pages/UserManagement"));
const ManagerTechnicians = lazy(() => import("./pages/ManagerTechnicians"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));
const ManagerResidents = lazy(() => import("./pages/ManagerResidents"));

const AnnouncementDetails = lazy(
  () => import("./pages/AnnouncementDetailsPage"),
);

const CreateAnnouncement = lazy(() => import("./pages/CreateAnnouncement"));

const Communities = lazy(() => import("./pages/Communities"));
const CommunityDetails = lazy(() => import("./pages/CommunityDetails"));

const BuildingDetails = lazy(() => import("./pages/BuildingDetails"));

const Staff = lazy(() => import("./pages/Staff"));
const Managers = lazy(() => import("./pages/Managers"));
const Technicians = lazy(() => import("./pages/Technicians"));
const Residents = lazy(() => import("./pages/Residents"));

const AccessDenied = lazy(() => import("./pages/AccessDenied"));

function NotFoundPage() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading type="dashboard" />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
            />

            <Route
              path="/register"
              element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              }
            />

            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/google-setup" element={<GoogleSetup />} />

            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Maintenance />} />
            </Route>

            <Route
              path="/maintenance/:id"
              element={
                <ProtectedRoute>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MaintenanceDetails />} />
            </Route>

            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AnnouncementsPage />} />
            </Route>

            <Route
              path="/announcements/:id"
              element={
                <ProtectedRoute>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AnnouncementDetails />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/maintenance/new" element={<ReportIssue />} />

              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/announcements/new"
                element={<CreateAnnouncement />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/communities" element={<Communities />} />

              <Route
                path="/communities/:communityId"
                element={<CommunityDetails />}
              />

              <Route
                path="/buildings/:buildingId"
                element={<BuildingDetails />}
              />

              <Route path="/staff" element={<Staff />} />

              <Route path="/managers" element={<Managers />} />

              <Route path="/technicians" element={<Technicians />} />

              <Route path="/residents" element={<Residents />} />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["MANAGER"]}>
                  <RoleBasedLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />

              <Route path="/manager/community" element={<ManagerCommunity />} />

              <Route path="/manager/residents" element={<ManagerResidents />} />

              <Route
                path="/manager/technicians"
                element={<ManagerTechnicians />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
                  <TechnicianLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/technician/dashboard"
                element={<TechnicianDashboard />}
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
