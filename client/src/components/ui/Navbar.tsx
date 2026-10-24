import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UsersRound } from "lucide-react";

/* Public landing-page navigation. Keep this navbar identical for every visitor. */
const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How it works", id: "workflow" },
  { label: "About", id: "about" },
  { label: "FAQs", id: "faqs" },
];

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff]";
const navLink = `rounded-lg px-3 py-2 font-f37-bolton-medium text-caption uppercase leading-caption tracking-eyebrow text-halo-violet transition-colors duration-150 hover:text-paper ${focus}`;
const iconBtn = `flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper sm:h-10 sm:w-10 ${focus}`;
const primaryBtn = `inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-signal-blue px-4 font-f37-bolton text-body-sm text-paper transition-[background-color,transform] duration-150 hover:bg-[color-mix(in_srgb,var(--color-signal-blue),white_14%)] active:scale-[0.97] ${focus}`;
const outlineBtn = `inline-flex h-12 items-center justify-center rounded-lg border border-slate-body px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,border-color] duration-150 hover:border-paper hover:bg-white/5 ${focus}`;
const menuItem = `flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left font-open-sauce-sans text-body-sm leading-body-sm text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper ${focus}`;

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
      <span className="hidden min-[360px]:inline font-f37-bolton text-[20px] font-medium leading-none tracking-[-0.02em] text-paper sm:text-[22px]">
        CommunityCare
      </span>
    </Link>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    if (!onHome) {
      navigate(`/#${sectionId}`);
      return;
    }
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b border-slate-body/50 bg-midnight-ink/85 backdrop-blur-md transition-opacity duration-300 ${
          isScrolled || mobileMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 w-full max-w-300 items-center justify-between gap-3 px-4 sm:h-18 sm:px-8"
      >
        <Logo onClick={closeMobileMenu} />

        <div className="hidden items-center lg:flex">
          {navItems.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={active ? "location" : undefined}
                className={`${navLink} ${active ? "text-paper" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/login"
            className={`${navLink} hidden text-paper min-[1024px]:inline-flex`}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className={`${primaryBtn} hidden! min-[1024px]:inline-flex!`}
          >
            Get started
          </Link>
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
            className={`${primaryBtn} h-12! w-full`}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;