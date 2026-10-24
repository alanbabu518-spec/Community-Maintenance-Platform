import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Megaphone,
  IndianRupee,
  Menu,
  X,
  Home,
  LogOut,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "../ui/NotificationDropdown";
import { getNotifications } from "../../services/notification.api";

const navigationSections = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Services",
    items: [
      { name: "Maintenance", path: "/maintenance", icon: Wrench },
      { name: "Announcements", path: "/announcements", icon: Megaphone },
      { name: "Payment", path: "/Payment", icon: IndianRupee },
    ],
  },
];

function ResidentLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }

    try {
      const result = await getNotifications(1, 100);

      setUnreadNotificationCount(
        result.notifications.filter(
          (notification) => !notification.isRead,
        ).length,
      );
    } catch {
      // Keep the dashboard usable if notifications are unavailable.
    }
  }, [user]);

  useEffect(() => {
    void loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const pageTitles: Record<string, string> = {
    "/dashboard": "Resident Dashboard",
    "/maintenance": "Maintenance",
    "/announcements": "Announcements",
    "/profile": "My Profile",
    "/notifications": "Notifications",
    "/settings": "Settings",
    "/Payment": "Payments",
  };

  const pageTitle =
    pageTitles[location.pathname] ?? "Resident Dashboard";

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-4 py-5">
      {navigationSections.map((section) => (
        <div key={section.label} className="mb-6">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {section.label}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  const notificationButton = (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setNotificationsOpen((open) => !open)
        }
        aria-label={
          unreadNotificationCount > 0
            ? `View notifications, ${unreadNotificationCount} unread`
            : "View notifications"
        }
        aria-expanded={notificationsOpen}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Bell size={18} />

        {unreadNotificationCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {unreadNotificationCount > 99
              ? "99+"
              : unreadNotificationCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <NotificationDropdown
          onClose={() => setNotificationsOpen(false)}
          onUnreadCountChange={setUnreadNotificationCount}
        />
      )}
    </div>
  );

  const userSummary = (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
        {user?.name?.trim().charAt(0).toUpperCase() || "R"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {user?.name || "Resident"}
        </p>

        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          Resident
        </p>
      </div>
    </div>
  );

  const logoutButton = (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
    >
      <LogOut size={18} strokeWidth={2} />
      <span>Logout</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col xl:w-72">
          {/* Branding */}
          <div className="flex h-20 shrink-0 items-center border-b border-slate-200 px-5 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Home size={20} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  CommunityCare
                </h1>

                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Resident Portal
                </p>
              </div>
            </div>
          </div>

          {navigation}

          {/* User and logout at the bottom */}
          <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">
            {userSummary}
            {logoutButton}
          </div>
        </aside>

        {/* Main dashboard */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Dashboard header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                  aria-label="Open resident menu"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                    {pageTitle}
                  </h1>

                  <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                    CommunityCare Resident Portal
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex shrink-0 items-center gap-2">
                {notificationButton}
                {themeButton}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="w-full flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile slide-out sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            aria-label="Close menu"
          />

          <aside className="relative flex h-full w-[min(19rem,88vw)] flex-col bg-white shadow-2xl dark:bg-slate-950">
            {/* Mobile branding */}
            <div className="flex min-h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Home size={19} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    CommunityCare
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Resident Portal
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {navigation}

            {/* Mobile user and logout */}
            <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">
              {userSummary}
              {logoutButton}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ResidentLayout;