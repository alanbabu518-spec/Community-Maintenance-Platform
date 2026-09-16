import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Wrench,
  Users,
  Megaphone,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/maintenance": "Maintenance",
    "/maintenance/new": "Report an Issue",
    "/technicians": "Technicians",
    "/announcements": "Announcements",
    "/announcements/new": "Create Announcement",
  };

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {pageTitle}
                  </h1>

                  <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                    Manage your community efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || ""}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            aria-label="Close menu"
          />

          <aside className="relative flex h-full w-72 flex-col bg-white shadow-2xl dark:bg-slate-950">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                CommunityCare
              </span>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Home size={19} />
                Home
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <LayoutDashboard size={19} />
                Dashboard
              </NavLink>

              <NavLink
                to="/maintenance"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Wrench size={19} />
                Maintenance
              </NavLink>

              <NavLink
                to="/technicians"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Users size={19} />
                Technicians
              </NavLink>

              <NavLink
                to="/announcements"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Megaphone size={19} />
                Announcements
              </NavLink>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;