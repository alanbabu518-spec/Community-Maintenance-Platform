import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/maintenance": "Maintenance",
    "/technicians": "Technicians",
    "/announcements": "Announcements",
  };

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <div>
                  <p className="text-xs font-medium text-slate-400 lg:hidden">
                    CommunityCare
                  </p>

                  <h2 className="text-lg font-semibold text-slate-900">
                    {pageTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name ?? "User"}
                  </p>

                  <p className="text-xs text-slate-500">{user?.role ?? ""}</p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
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
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close navigation menu"
          />

          <aside className="relative flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <h1 className="text-lg font-bold text-slate-900">
                CommunityCare
              </h1>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close navigation menu"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 p-4">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu
              </p>

              <div className="space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/maintenance"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Maintenance
                </NavLink>

                <NavLink
                  to="/technicians"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Technicians
                </NavLink>

                <NavLink
                  to="/announcements"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  Announcements
                </NavLink>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
