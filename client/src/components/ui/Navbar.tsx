import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UsersRound,
  UserRound,
  Users,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../../services/auth.api";
import { removeToken } from "../../services/auth";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../services/notification.api";

type User = {
  name?: string;
  email?: string;
};

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }

    async function loadUnreadCount() {
      try {
        const result = await getNotifications(1, 100);

        const unreadCount = result.notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadNotificationCount(unreadCount);
      } catch {
        setUnreadNotificationCount(0);
      }
    }

    loadUnreadCount();
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedDesktop =
        desktopProfileRef.current &&
        desktopProfileRef.current.contains(target);

      const clickedMobile =
        mobileProfileRef.current &&
        mobileProfileRef.current.contains(target);

      if (!clickedDesktop && !clickedMobile) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    closeProfile();

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getUserInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name.trim().charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      removeToken();
      setUser(null);
      setProfileOpen(false);
      setMobileMenuOpen(false);
      navigate("/login", { replace: true });
    }
  };

  const navItems = [
    {
      label: "Home",
      id: "hero",
    },
    {
      label: "Features",
      id: "features",
    },
    {
      label: "How It Works",
      id: "workflow",
    },
    {
      label: "About",
      id: "about",
    },
    {
      label: "FAQs",
      id: "faqs",
    },
  ];

  const ProfileMenu = () => {
    if (!user || !profileOpen) {
      return null;
    }

    return (
      <div className="absolute right-0 top-[calc(100%+10px)] z-100 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
              {getUserInitial()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link
            to="/dashboard"
            onClick={closeProfile}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <UserRound size={18} />
            My Profile
          </Link>

          <button
            type="button"
            onClick={() => {
              closeProfile();
              navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Users size={18} />
            Switch Account
          </button>

          <Link
            to="/settings"
            onClick={closeProfile}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>

        <div className="border-t border-slate-100 p-2 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled ? "px-4 pt-4" : "px-0 pt-0"
      }`}
    >
      <nav
        className={`relative mx-auto flex items-center justify-between bg-white/90 backdrop-blur-xl transition-all duration-500 dark:bg-slate-950/90 ${
          isScrolled
            ? "max-w-6xl rounded-full border border-slate-200/80 px-4 py-2.5 shadow-lg shadow-slate-900/10 dark:border-slate-700/80 dark:shadow-black/20"
            : "w-full border-b border-transparent px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 shrink items-center gap-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <UsersRound size={21} />
            </div>

            <span
              className={`overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight text-slate-900 transition-all duration-300 dark:text-white ${
                isScrolled
                  ? "max-w-0 opacity-0 md:max-w-none md:opacity-100"
                  : "max-w-40 opacity-100"
              }`}
            >
              CommunityCare
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          ref={desktopProfileRef}
          className="relative hidden items-center gap-4 md:flex"
        >
          {user ? (
            <>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationsOpen((open) => !open)
                  }
                  className="relative mr-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="View notifications"
                  title="Notifications"
                >
                  <Bell size={19} />

                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
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

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProfileOpen((open) => !open);
                }}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800"
                title={user.name || user.email || "User"}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {getUserInitial()}
              </button>

              <Link
                to="/dashboard"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>

              <ProfileMenu />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div
          ref={mobileProfileRef}
          className="relative flex shrink-0 items-center gap-1 md:hidden"
        >
          {user ? (
            <>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
              </button>

              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="View notifications"
                title="Notifications"
              >
                <Bell size={20} />

                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
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

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProfileOpen((open) => !open);
                }}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800"
                title={user.name || user.email || "User"}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {getUserInitial()}
              </button>

              <ProfileMenu />
            </>
          ) : (
            <ThemeToggleButton
              theme={theme}
              toggleTheme={toggleTheme}
              mobile
            />
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="mt-2 rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-2 rounded-lg px-4 py-3 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeToggleButton({
  theme,
  toggleTheme,
  mobile = false,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
  mobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
        mobile ? "h-10 w-10" : "h-9 w-9"
      }`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={mobile ? 19 : 18} />
      ) : (
        <Sun size={mobile ? 19 : 18} />
      )}
    </button>
  );
}

export default Navbar;