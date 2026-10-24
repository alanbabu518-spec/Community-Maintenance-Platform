import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ClipboardPlus,
  ClipboardCheck,
  UserRoundCog,
  Megaphone,
  Building2,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/ui/Navbar";
import FAQs from "../components/ui/text-reveal-faqs";
import Footer from "../components/ui/Footer";
import ParticleDrift from "../components/ui/Particledrift";

/* ---------- Hero helpers (only used by the hero section) ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;

// One orchestrated entrance; only transform + opacity animate.
function reveal(step: number, reduce: boolean | null) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, transform: "translateY(18px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.7, delay: 0.2 + step * 0.1, ease: EASE },
  };
}

// Reads theme colours so the canvas matches your tokens.
function useToken(name: string, fallback: string) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (v) setValue(v);
  }, [name]);
  return value;
}

function HeroParticles({ reduce }: { reduce: boolean | null }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [density, setDensity] = useState(240);
  const base = useToken("--color-halo-violet", "#afb4db");
  const accent = useToken("--color-arc-cyan", "#34fcff");

  useEffect(() => {
    // Fewer particles on phones — the link pass is O(n²) per frame.
    setDensity(window.innerWidth < 640 ? 110 : 240);

    const el = holder.current;
    if (!el) return;
    // Stop the WebGL loop while the hero is off-screen.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={holder}
      aria-hidden="true"
      className="absolute inset-0"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {visible && (
        <ParticleDrift
          background="transparent"
          baseColor={base}
          accentColor={accent}
          density={density}
          dotSize={4}
          speed={reduce ? 0 : 30}
          direction={180}
          hover={150}
          linkDistance={150}
          linkThickness={1}
          style={{ minWidth: 0, minHeight: 0 }}
        />
      )}
    </motion.div>
  );
}

function Home() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        {/* ===================== HERO (new) ===================== */}
        <section
          id="hero"
          className="relative scroll-mt-16 overflow-hidden bg-midnight-ink text-paper"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--surface-violet-wash)_0%,var(--color-midnight-ink)_62%)]" />

          <HeroParticles reduce={reduce} />

          {/* Soft scrim keeps the headline readable over the particles */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-midnight-ink)_75%,transparent)_0%,transparent_65%)]" />

          {/* pointer-events-none lets the canvas receive hover; buttons opt back in */}
          <div className="pointer-events-none relative mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-5 py-32 text-center sm:px-8">
            <motion.p
              className="font-f37-bolton-medium text-caption leading-caption uppercase tracking-eyebrow text-halo-violet"
              {...reveal(0, reduce)}
            >
              Smarter community maintenance
            </motion.p>

            <h1 className="mt-5 max-w-4xl font-f37-bolton text-heading font-light leading-heading tracking-heading text-paper sm:text-heading-lg sm:leading-heading-lg sm:tracking-heading-lg lg:text-display lg:leading-display lg:tracking-display">
              <motion.span className="block" {...reveal(1, reduce)}>
                Keep your community
              </motion.span>
              <motion.span className="block" {...reveal(2, reduce)}>
                running smoothly.
              </motion.span>
            </h1>

            <motion.p
              className="mt-6 max-w-2xl font-open-sauce-sans text-body leading-body text-halo-violet"
              {...reveal(3, reduce)}
            >
              CommunityCare makes it simple for residents and management teams
              to report, organize, assign, track, and resolve maintenance
              issues in one place.
            </motion.p>

            <motion.div
              className="pointer-events-auto mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
              {...reveal(4, reduce)}
            >
              <Link
                to="/maintenance/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-signal-blue px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,transform] duration-150 hover:bg-[color-mix(in_srgb,var(--color-signal-blue),white_14%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff] active:scale-[0.97]"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-body px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,border-color,transform] duration-150 hover:border-paper hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff] active:scale-[0.97]"
              >
                Explore Dashboard
              </Link>
            </motion.div>
          </div>
        </section>
        {/* =================== END HERO =================== */}

        <section
          id="features"
          className="scroll-mt-16 border-t border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                Platform Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Everything your community needs
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                From reporting maintenance problems to keeping residents
                informed, CommunityCare brings everyday community operations
                together.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <ClipboardPlus size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Report Issues
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Residents can quickly report maintenance problems with
                  descriptions, priorities, and supporting photos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <ClipboardCheck size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Track Requests
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Follow every maintenance request through its complete
                  lifecycle from open to resolved.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <UserRoundCog size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Smart Assignment
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Management teams can assign maintenance requests to
                  technicians and monitor their progress.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <Megaphone size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Community Updates
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Share important announcements and keep residents updated
                  about community activities.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <Building2 size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  Centralized Management
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Organize residents, buildings, units, technicians, and
                  maintenance activity from one centralized platform.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-within:border-violet-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                  <Sparkles size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  AI-Powered Assistance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Future AI capabilities can help summarize requests,
                  prioritize issues, and assist community management teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="scroll-mt-16 border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                From issue to resolution
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                CommunityCare keeps every maintenance request moving through a
                clear and transparent workflow.
              </p>
            </div>

            <div className="mt-14">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                {[
                  ["01", "Submit", "Residents report an issue with details and photos."],
                  ["02", "Acknowledge", "Management reviews and acknowledges the request."],
                  ["03", "Assign", "The request is assigned to the appropriate technician."],
                  ["04", "Work", "The technician works on the reported maintenance issue."],
                  ["05", "Resolve", "The completed maintenance work is marked as resolved."],
                  ["06", "Close", "The request is closed after the issue has been completed."],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition-colors hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal-blue/10 text-sm font-bold text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-signal-blue/15 dark:text-cyan-300">
                      {number}
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Have a maintenance issue?
                    </p>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Submit a request and let your community team take care
                      of the rest.
                    </p>
                  </div>

                  <Link
                    to="/maintenance/new"
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-signal-blue px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff]"
                  >
                    Report an Issue
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-16 border-t border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                  About CommunityCare
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  One platform for better community operations
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  CommunityCare connects residents, management teams, and
                  technicians through a centralized maintenance platform
                  designed to make everyday community operations simpler,
                  clearer, and more organized.
                </p>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  From the moment a resident reports an issue to the moment it
                  is resolved, everyone involved can follow the same workflow
                  and stay informed.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Residents
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Report issues, attach photos, and track maintenance
                    requests.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Organize requests, assign technicians, and monitor
                    progress.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Technicians
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    View assigned work and keep maintenance requests moving
                    toward resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQs />
      </main>

      <Footer />
    </div>
  );
}

export default Home;