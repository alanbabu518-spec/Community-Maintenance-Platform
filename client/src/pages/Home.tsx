import { useEffect, useRef, useState, type ReactNode } from "react";
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

/* ---------- Scroll reveal ----------
   Apple-style: a critically damped spring (no overshoot) because nothing was
   flicked; small travel; plays once. Reduced motion → a short cross-fade. */
function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={
        reduce
          ? { duration: 0.2 }
          : { type: "spring", bounce: 0, duration: 0.6, delay: index * 0.06 }
      }
    >
      {children}
    </motion.div>
  );
}

/* Dark → light fade: smoothstep-eased stops, mixed in OKLab, so there is no
   visible band edge or "grey" midpoint (avoids an abrupt brightness jump). */
const FADE_STEPS = [0, 0.043, 0.156, 0.316, 0.5, 0.684, 0.844, 0.957, 1];
const EASED_FADE = `linear-gradient(in oklab to bottom, ${FADE_STEPS.map(
  (mix, i) =>
    `color-mix(in oklab, var(--color-slate-50) ${mix * 100}%, var(--color-midnight-ink)) ${i * 12.5}%`,
).join(", ")})`;

/* ---------- Shared styles for the sections below the hero ---------- */
// Same type system as the hero: F37 Bolton headings, uppercase eyebrow,
// Open Sauce body, 8px radii, hairline borders, no shadows.
const eyebrow =
  "font-f37-bolton-medium text-caption leading-caption uppercase tracking-eyebrow text-signal-blue dark:text-halo-violet";

const title =
  "text-balance font-f37-bolton font-light text-subheading leading-subheading tracking-subheading text-midnight-ink dark:text-paper sm:text-heading-sm sm:leading-heading-sm sm:tracking-heading-sm lg:text-heading lg:leading-heading lg:tracking-heading";

const lead =
  "text-pretty text-body-sm leading-body-sm text-slate-body dark:text-halo-violet sm:text-body sm:leading-body";

const card =
  "rounded-lg border border-silver-border bg-paper transition-colors duration-200 hover:border-signal-blue/40 dark:border-slate-body/70 dark:bg-midnight-ink dark:hover:border-halo-violet/50";

const cardTitle =
  "font-f37-bolton text-[22px] font-normal leading-snug tracking-[-0.01em] text-midnight-ink dark:text-paper";

const cardText =
  "text-pretty text-body-sm leading-body-sm text-slate-body dark:text-halo-violet";

const iconChip =
  "flex h-11 w-11 items-center justify-center rounded-lg bg-signal-blue/10 text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-white/5 dark:text-halo-violet dark:ring-white/10";

const primaryButton =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-signal-blue px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,scale] duration-100 ease-out hover:bg-[color-mix(in_srgb,var(--color-signal-blue),white_14%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff] active:scale-[0.97]";

const container = "mx-auto max-w-300 px-5 py-20 sm:px-8 lg:py-24";

/* ---------- Content ---------- */
const features = [
  { icon: ClipboardPlus, title: "Report Issues", text: "Residents can quickly report maintenance problems with descriptions, priorities, and supporting photos." },
  { icon: ClipboardCheck, title: "Track Requests", text: "Follow every maintenance request through its complete lifecycle from open to resolved." },
  { icon: UserRoundCog, title: "Smart Assignment", text: "Management teams can assign maintenance requests to technicians and monitor their progress." },
  { icon: Megaphone, title: "Community Updates", text: "Share important announcements and keep residents updated about community activities." },
  { icon: Building2, title: "Centralized Management", text: "Organize residents, buildings, units, technicians, and maintenance activity from one centralized platform." },
  { icon: Sparkles, title: "AI-Powered Assistance", text: "Future AI capabilities can help summarize requests, prioritize issues, and assist community management teams." },
];

const steps = [
  ["01", "Submit", "Residents report an issue with details and photos."],
  ["02", "Acknowledge", "Management reviews and acknowledges the request."],
  ["03", "Assign", "The request is assigned to the appropriate technician."],
  ["04", "Work", "The technician works on the reported maintenance issue."],
  ["05", "Resolve", "The completed maintenance work is marked as resolved."],
  ["06", "Close", "The request is closed after the issue has been completed."],
];

const roles = [
  ["Residents", "Report issues, attach photos, and track maintenance requests."],
  ["Management", "Organize requests, assign technicians, and monitor progress."],
  ["Technicians", "View assigned work and keep maintenance requests moving toward resolution."],
];

function Home() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-white font-open-sauce-sans text-slate-900 antialiased [font-optical-sizing:auto] dark:bg-midnight-ink dark:text-white">
      <Navbar />

      <main>
        {/* ===================== HERO ===================== */}
        <section
          id="hero"
          className="relative scroll-mt-16 overflow-hidden bg-midnight-ink text-paper"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--surface-violet-wash)_0%,var(--color-midnight-ink)_62%)]" />

          <HeroParticles reduce={reduce} />

          {/* Soft scrim keeps the headline readable over the particles */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-midnight-ink)_75%,transparent)_0%,transparent_65%)]" />

          {/* pointer-events-none lets the canvas receive hover; buttons opt back in */}
          <div className="pointer-events-none relative mx-auto flex min-h-screen max-w-300 flex-col items-center justify-center px-5 py-32 text-center sm:px-8">
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
              <Link to="/maintenance/new" className={primaryButton}>
                Report an Issue
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-body px-6 font-f37-bolton text-body-sm text-paper transition-[background-color,border-color,scale] duration-100 ease-out hover:border-paper hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff] active:scale-[0.97]"
              >
                Explore Dashboard
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Smooth dark → light transition (below the hero, so no white inside it).
            Hidden in dark mode, where both sides are the same midnight colour. */}
        <div
          aria-hidden="true"
          className="h-40 sm:h-56 dark:hidden"
          style={{ backgroundImage: EASED_FADE }}
        />

        {/* ===================== FEATURES ===================== */}
        <section
          id="features"
          className="scroll-mt-16 bg-slate-50 dark:bg-midnight-ink"
        >
          <div className={container}>
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className={eyebrow}>Platform Features</p>

              <h2 className={`${title} mt-3`}>Everything your community needs</h2>

              <p className={`${lead} mt-4`}>
                From reporting maintenance problems to keeping residents
                informed, CommunityCare brings everyday community operations
                together.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title: featureTitle, text }, i) => (
                <Reveal key={featureTitle} index={i % 3} className="h-full">
                <div className={`${card} h-full p-6`}>
                  <div className={iconChip}>
                    <Icon size={21} />
                  </div>

                  <h3 className={`${cardTitle} mt-5`}>{featureTitle}</h3>
                  <p className={`${cardText} mt-2`}>{text}</p>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== WORKFLOW ===================== */}
        <section
          id="workflow"
          className="scroll-mt-16 bg-white dark:border-t dark:border-slate-body/40 dark:bg-midnight-ink"
        >
          <div className={container}>
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className={eyebrow}>How It Works</p>

              <h2 className={`${title} mt-3`}>From issue to resolution</h2>

              <p className={`${lead} mt-4`}>
                CommunityCare keeps every maintenance request moving through a
                clear and transparent workflow.
              </p>
            </Reveal>

            <div className="mt-14">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {steps.map(([number, stepTitle, description], i) => (
                  <Reveal key={number} index={i % 6} className="h-full">
                  <div className={`${card} h-full p-6 text-center`}>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-signal-blue/10 font-ibm-plex-mono text-body-sm tracking-data text-signal-blue ring-1 ring-inset ring-signal-blue/20 dark:bg-white/5 dark:text-halo-violet dark:ring-white/10">
                      {number}
                    </div>

                    <h3 className="mt-5 font-f37-bolton text-body font-medium leading-body text-midnight-ink dark:text-paper">
                      {stepTitle}
                    </h3>

                    <p className="mt-2 text-caption leading-6 text-slate-body dark:text-halo-violet">
                      {description}
                    </p>
                  </div>
                  </Reveal>
                ))}
              </div>

              <Reveal className="mt-10 rounded-lg border border-silver-border bg-slate-50 p-6 dark:border-slate-body/70 dark:bg-midnight-ink sm:p-8">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <p className="font-f37-bolton text-[24px] font-light leading-snug tracking-[-0.02em] text-midnight-ink dark:text-paper">
                      Have a maintenance issue?
                    </p>

                    <p className="mt-1 text-body-sm leading-body-sm text-slate-body dark:text-halo-violet">
                      Submit a request and let your community team take care
                      of the rest.
                    </p>
                  </div>

                  <Link to="/maintenance/new" className={primaryButton}>
                    Report an Issue
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== ABOUT ===================== */}
        <section
          id="about"
          className="scroll-mt-16 bg-slate-50 dark:border-t dark:border-slate-body/40 dark:bg-midnight-ink"
        >
          <div className={container}>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <p className={eyebrow}>About CommunityCare</p>

                <h2 className={`${title} mt-3`}>
                  One platform for better community operations
                </h2>

                <p className={`${lead} mt-5 max-w-xl`}>
                  CommunityCare connects residents, management teams, and
                  technicians through a centralized maintenance platform
                  designed to make everyday community operations simpler,
                  clearer, and more organized.
                </p>

                <p className="mt-4 max-w-xl text-body-sm leading-body-sm text-slate-body dark:text-mist">
                  From the moment a resident reports an issue to the moment it
                  is resolved, everyone involved can follow the same workflow
                  and stay informed.
                </p>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {roles.map(([roleTitle, text], i) => (
                  <Reveal key={roleTitle} index={i} className="h-full">
                    <div className={`${card} h-full p-5`}>
                      <p className={cardTitle}>{roleTitle}</p>
                      <p className={`${cardText} mt-2`}>{text}</p>
                    </div>
                  </Reveal>
                ))}
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