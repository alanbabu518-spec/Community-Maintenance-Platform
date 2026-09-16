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
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../../services/auth.api";
import { removeToken } from "../../services/auth";

type User = {
  name?: string;
  email?: string;
};

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
      <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
              {getUserInitial()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user.email || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link
            to="/dashboard"
            onClick={closeProfile}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Users size={18} />
            Switch Account
          </button>

          <Link
            to="/settings"
            onClick={closeProfile}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
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
        className={`relative mx-auto flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? "max-w-6xl rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-lg shadow-slate-900/10 backdrop-blur-xl"
            : "w-full border-b border-transparent bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <UsersRound size={21} />
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
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
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          ref={desktopProfileRef}
          className="relative hidden items-center gap-2 md:flex"
        >
          {user ? (
            <>
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
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
          className="relative flex items-center md:hidden"
        >
          {user ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProfileOpen((open) => !open);
                }}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800"
                title={user.name || user.email || "User"}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {getUserInitial()}
              </button>

              <ProfileMenu />
            </>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
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
                  className="mt-2 rounded-lg px-4 py-3 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
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

export default Navbar;