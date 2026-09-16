import { Link } from "react-router-dom";
import { ArrowUpRight, UsersRound } from "lucide-react";
import SocialButtons from "./SocialButtons";

function Footer() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
                <UsersRound size={22} />
              </div>

              <span className="text-lg font-bold tracking-tight text-white">
                CommunityCare
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Making community maintenance simpler through better
              communication and organized workflows.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <SocialButtons />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("workflow")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                How It Works
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("faqs")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                FAQs
              </button>

              <Link
                to="/dashboard"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Community
            </h3>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                About Us
              </button>

              <Link
                to="/maintenance"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Maintenance
              </Link>

              <Link
                to="/maintenance/new"
                className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                Report an Issue
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => scrollToSection("faqs")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Help Center
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("workflow")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Maintenance Guide
              </button>

              <span className="block text-sm text-slate-500">
                Documentation
              </span>

              <span className="block text-sm text-slate-500">
                Support
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>

            <div className="mt-4 space-y-2.5">
              <a
                href="#"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Terms of Service
              </a>

              <a
                href="#"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Cookie Settings
              </a>

              <a
                href="#"
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                Security
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2026 CommunityCare. All rights reserved.
          </p>

          <p className="text-xs text-slate-600">
            Built for better communities.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;