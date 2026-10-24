import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UsersRound,
  UserRound,
  Users,
  Settings,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../services/notification.api";
import LogoutButton from "../../features/auth/components/LogoutButton";
import { body, display, btn, navLink, focus } from "./Tokens";

const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How it works", id: "workflow" },
  { label: "About", id: "about" },
  { label: "FAQs", id: "faqs" },
];

const menuItem = `${body} flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-body-sm leading-body-sm text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper ${focus}`;

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const clusterRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: mark the section in the middle of the viewport.
  useEffect(() => {
    if (!onHome) {
      setActiveId("");
      return;
    }
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }

    let cancelled = false;

    const loadUnreadCount = async () => {
      try {
        const result = await getNotifications(1, 100);
        if (cancelled) return;
        setUnreadNotificationCount(
          result.notifications.filter((n) => !n.isRead).length,
        );
      } catch {
        if (!cancelled) setUnreadNotificationCount(0);
      }
    };

    loadUnreadCount();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!clusterRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    closeProfile();

    if (!onHome) {
      navigate(`/#${sectionId}`);
      return;
    }

    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getUserInitial = () =>
    user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  const themeLabel = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  const profileMenu =
    user && profileOpen ? (
      <div
        role="menu"
        className="absolute right-0 top-[calc(100%+12px)] z-100 w-72 overflow-hidden rounded-lg border border-slate-body bg-midnight-ink"
      >
        <div className="border-b border-slate-body/70 p-4">
          <div className="flex items-center gap-3">
            <div className={`${display} flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-paper text-body font-normal text-midnight-ink`}>
              {getUserInitial()}
            </div>
            <div className="min-w-0">
              <p className={`${body} truncate text-body-sm font-medium leading-body-sm text-paper`}>
                {user.name || "User"}
              </p>
              <p className={`${body} truncate text-caption leading-caption text-mist`}>
                {user.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link to="/dashboard" onClick={closeProfile} role="menuitem" className={menuItem}>
            <UserRound size={18} />
            My profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeProfile();
              navigate("/login");
            }}
            className={menuItem}
          >
            <Users size={18} />
            Switch account
          </button>
          <Link to="/settings" onClick={closeProfile} role="menuitem" className={menuItem}>
            <Settings size={18} />
            Settings
          </Link>
        </div>

        <div className="border-t border-slate-body/70 p-2">
          <LogoutButton />
        </div>
      </div>
    ) : null;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Background fades in on scroll — opacity only, stays composited */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b border-slate-body/50 bg-midnight-ink/85 backdrop-blur-md transition-opacity duration-300 ${
          isScrolled || mobileMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label="Main"
        className="relative mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`${btn.iconDark} md:hidden`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Wordmark only — no logo container, per the reference */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 rounded-lg ${focus}`}
          >
            <UsersRound size={22} className="text-paper" />
            <span className={`${display} text-subheading leading-none tracking-subheading text-paper`}>
              CommunityCare
            </span>
          </Link>
        </div>

        <div className="hidden items-center md:flex">
          {navItems.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={active ? "location" : undefined}
                className={`${navLink} ${active ? "text-paper" : "text-halo-violet"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div ref={clusterRef} className="relative flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={btn.iconDark}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className={`${btn.iconDark} relative`}
                  aria-label={
                    unreadNotificationCount > 0
                      ? `View notifications, ${unreadNotificationCount} unread`
                      : "View notifications"
                  }
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={19} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e5484d] px-1 text-[10px] font-bold leading-none text-paper">
                      {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
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
                className={`${body} flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-paper text-caption font-medium text-midnight-ink transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-95 ${focus}`}
                title={user.name || user.email || "User"}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                {getUserInitial()}
              </button>

              <Link to="/dashboard" className={`${btn.primary} ml-1 hidden !h-10 !px-4 md:inline-flex`}>
                Dashboard
              </Link>

              {profileMenu}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${navLink} hidden text-paper sm:inline-flex`}
              >
                Sign in
              </Link>
              <Link to="/register" className={`${btn.primary} !h-10 !px-4`}>
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="relative border-t border-slate-body/50 bg-midnight-ink px-5 pb-5 pt-3 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`${menuItem} ${activeId === item.id ? "bg-white/10 text-paper" : ""}`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <Link to="/dashboard" onClick={closeMobileMenu} className={`${btn.primary} mt-3`}>
                Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={closeMobileMenu} className={`${btn.outlineDark} mt-3`}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;