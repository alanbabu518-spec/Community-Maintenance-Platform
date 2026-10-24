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
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../services/notification.api";
import LogoutButton from "../../features/auth/components/LogoutButton";

/*
  Navbar — dark, matches the particle hero.
  • Transparent over the hero; midnight bar + hairline once scrolled
    (background fades with opacity only).
  • Desktop links from lg (1024px). Below that: logo on the left; actions and
    the three-line menu button on the right. The menu is a side drawer that
    slides in from the right (transform only, so it stays smooth).
  • Uses only the theme tokens from index.css.
*/

const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How it works", id: "workflow" },
  { label: "About", id: "about" },
  { label: "FAQs", id: "faqs" },
];

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff]";

const navLink = `font-f37-bolton-medium text-caption leading-caption uppercase tracking-eyebrow rounded-lg px-3 py-2 transition-colors duration-150 hover:text-paper ${focus}`;

// 44px touch target on phones, 40px from sm up
const iconBtn = `flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper sm:h-10 sm:w-10 ${focus}`;

const primaryBtn = `inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-signal-blue px-4 font-f37-bolton text-body-sm text-paper transition-[background-color,transform] duration-150 hover:bg-[color-mix(in_srgb,var(--color-signal-blue),white_14%)] active:scale-[0.97] ${focus}`;

const outlineBtn = `inline-flex h-12 items-center justify-center rounded-lg border border-slate-body px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,border-color] duration-150 hover:border-paper hover:bg-white/5 ${focus}`;

const menuItem = `flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left font-open-sauce-sans text-body-sm leading-body-sm text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper ${focus}`;

/* Original logo: UsersRound icon in a rounded tile + wordmark.
   The tile is white on the dark bar so the icon stays visible. */
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="CommunityCare home"
      className={`flex min-w-0 items-center gap-2 rounded-xl ${focus}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper text-midnight-ink">
        <UsersRound size={21} />
      </span>

      <span className="hidden font-f37-bolton text-[20px] font-medium leading-none tracking-[-0.02em] text-paper min-[360px]:inline sm:text-[22px]">
        CommunityCare
      </span>
    </Link>
  );
}

function Navbar() {
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const clusterRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpen = useRef(false);

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

  // Profile menu: close on outside click / Escape
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

  // Mobile menu: lock page scroll, close on Escape / route change / desktop width
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  // Move focus into the drawer when it opens, back to the menu button when it closes
  useEffect(() => {
    if (mobileMenuOpen) {
      wasMenuOpen.current = true;
      closeButtonRef.current?.focus();
    } else if (wasMenuOpen.current) {
      wasMenuOpen.current = false;
      menuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (query.matches) setMobileMenuOpen(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

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

  const profileMenu =
    user && profileOpen ? (
      <div
        role="menu"
        className="absolute right-0 top-[calc(100%+12px)] z-100 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-body bg-midnight-ink"
      >
        <div className="border-b border-slate-body/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-paper font-f37-bolton text-body text-midnight-ink">
              {getUserInitial()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-open-sauce-sans text-body-sm font-medium leading-body-sm text-paper">
                {user.name || "User"}
              </p>
              <p className="truncate font-open-sauce-sans text-caption leading-caption text-mist">
                {user.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link to="/dashboard" onClick={closeProfile} role="menuitem" className={menuItem}>
            <UserRound size={18} />
            My Profile
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
            Switch Account
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
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      {/* Background fades in on scroll — opacity only, so it stays composited */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b border-slate-body/50 bg-midnight-ink/85 backdrop-blur-md transition-opacity duration-300 ${
          isScrolled || mobileMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8"
      >
        <Logo onClick={closeMobileMenu} />

        {/* Desktop links */}
        <div className="hidden items-center lg:flex">
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

        {/* Actions */}
        <div ref={clusterRef} className="relative flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className={`${iconBtn} relative`}
                  aria-label={
                    unreadNotificationCount > 0
                      ? `View notifications, ${unreadNotificationCount} unread`
                      : "View notifications"
                  }
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={20} />

                  {unreadNotificationCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
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
                className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-paper font-open-sauce-sans text-caption font-medium text-midnight-ink transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-95 sm:h-10 sm:w-10 ${focus}`}
                title={user.name || user.email || "User"}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                {getUserInitial()}
              </button>

              <Link to="/dashboard" className={`${primaryBtn} ml-1 hidden lg:inline-flex`}>
                Dashboard
              </Link>

              {profileMenu}
            </>
          ) : (
            <>
              <Link to="/login" className={`${navLink} hidden text-paper min-[1024px]:inline-flex`}>
                Sign in
              </Link>

              {/* Desktop only — not shown on mobile */}
              <Link to="/register" className={`${primaryBtn} !hidden min-[1024px]:!inline-flex`}>
                Get started
              </Link>
            </>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`${iconBtn} lg:hidden`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Side menu (mobile / tablet): slides in from the right */}
      <div
        aria-hidden="true"
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-10 bg-midnight-ink/70 transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-20 flex w-[min(20rem,85vw)] flex-col border-l border-slate-body/50 bg-midnight-ink pt-[env(safe-area-inset-top)] transition-[translate,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
          mobileMenuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-body/50 px-4">
          <Logo onClick={closeMobileMenu} />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMobileMenu}
            className={iconBtn}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-3"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={activeId === item.id ? "location" : undefined}
              className={`${menuItem} ${activeId === item.id ? "bg-white/10 text-paper" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-body/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {user ? (
            <Link to="/dashboard" onClick={closeMobileMenu} className={`${primaryBtn} !h-12`}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className={outlineBtn}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className={`${primaryBtn} !h-12 w-full`}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;