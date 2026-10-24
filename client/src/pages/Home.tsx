import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import ParticleSphere from "../components/ui/Particlesphere";
import {
  EASE,
  body,
  display,
  mono,
  h1,
  h2,
  h3,
  eyebrow,
  lead,
  container,
  sectionPad,
  card,
  btn,
} from "../components/ui/Tokens";

/* ---------- Hero motion ---------- */
// One orchestrated entrance. Transform is passed as a string so framer-motion
// can keep it hardware-accelerated; only transform + opacity animate.
function reveal(step: number, reduce: boolean | null) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, transform: "translateY(18px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.7, delay: 0.2 + step * 0.1, ease: EASE },
  };
}

/* ---------- Product preview (light register) ---------- */
function Pill({ tone, children }: { tone: "green" | "red" | "gray"; children: string }) {
  const tones = {
    green: "bg-[#e3f4ea] text-[#1f6b3b]",
    red: "bg-[#fbe6e6] text-[#9a2b2b]",
    gray: "bg-silver-border/50 text-slate-body",
  };
  return (
    <span className={`${mono} rounded-md px-2 py-1 text-micro leading-micro ${tones[tone]}`}>
      {children}
    </span>
  );
}

const requests = [
  { id: "CC-2041", name: "Water leakage", place: "Building A · Unit 204", tone: "gray" as const, status: "In progress", start: 8, width: 52 },
  { id: "CC-2038", name: "Corridor light", place: "Building B · Floor 3", tone: "red" as const, status: "Over limit", start: 22, width: 62 },
  { id: "CC-2030", name: "Gate sensor", place: "Main entrance", tone: "green" as const, status: "Complete", start: 2, width: 30 },
];

const events = [
  ["09:42", "Request assigned to technician"],
  ["09:15", "Photos added to CC-2041"],
  ["08:50", "CC-2038 passed response limit"],
  ["08:12", "CC-2030 marked resolved"],
];

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-silver-border bg-paper text-left">
      <div className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className={`${mono} mx-auto rounded-md bg-black/40 px-4 py-1 text-micro leading-micro text-mist`}>
          communitycare / dashboard
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px]">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-3 gap-4 border-b border-silver-border pb-6">
            {[
              ["Open", "12"],
              ["Resolved", "28"],
              ["Avg. response", "2.4h"],
            ].map(([labelText, value]) => (
              <div key={labelText}>
                <p className={`${body} text-caption leading-caption text-slate-body sm:text-body-sm`}>{labelText}</p>
                <p className={`${display} mt-1 text-heading-sm leading-heading-sm tracking-heading-sm text-midnight-ink sm:text-heading-lg sm:leading-heading-lg sm:tracking-heading-lg`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="divide-y divide-silver-border">
            {requests.map((r) => (
              <div key={r.id} className="grid items-center gap-3 py-4 sm:grid-cols-[1.3fr_1.2fr_auto]">
                <div>
                  <p className={`${body} text-body-sm font-medium leading-body-sm text-midnight-ink`}>{r.name}</p>
                  <p className={`${mono} mt-1 text-micro leading-micro text-fog`}>
                    {r.id} · {r.place}
                  </p>
                </div>
                <div className="relative hidden h-2 rounded-md bg-silver-border/50 sm:block">
                  <div
                    className="absolute top-0 h-2 rounded-md bg-signal-blue"
                    style={{ left: `${r.start}%`, width: `${r.width}%` }}
                  />
                </div>
                <Pill tone={r.tone}>{r.status}</Pill>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-t border-silver-border p-6 lg:border-l lg:border-t-0">
          <p className={`${mono} text-caption leading-caption text-fog`}>Event summary</p>
          <ul className="mt-5 space-y-5">
            {events.map(([time, text]) => (
              <li key={time} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-signal-blue" />
                <div>
                  <p className={`${mono} text-micro leading-micro text-fog`}>{time}</p>
                  <p className={`${body} mt-0.5 text-body-sm leading-body-sm text-slate-body`}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Content ---------- */
const features = [
  { icon: ClipboardPlus, title: "Report issues", text: "Residents describe the problem, set a priority, and attach photos in under a minute." },
  { icon: ClipboardCheck, title: "Track requests", text: "Follow each request from open to resolved, with every status change on record." },
  { icon: UserRoundCog, title: "Assign technicians", text: "Management hands work to the right technician and sees progress as it happens." },
  { icon: Megaphone, title: "Community updates", text: "Post announcements so residents know what is planned, what is fixed, and what is next." },
  { icon: Building2, title: "One place for everything", text: "Residents, buildings, units, technicians, and maintenance history live in a single platform." },
  { icon: Sparkles, title: "AI assistance", text: "Coming soon: request summaries and priority suggestions to help your team triage faster." },
];

const steps = [
  ["Submit", "Residents report an issue with details and photos."],
  ["Acknowledge", "Management reviews and confirms the request."],
  ["Assign", "The request goes to the right technician."],
  ["Work", "The technician fixes the issue."],
  ["Resolve", "Completed work is marked as resolved."],
  ["Close", "The request is closed and the record is kept."],
];

const roles = [
  ["Residents", "Report issues, attach photos, and follow each request."],
  ["Management", "Organize requests, assign technicians, and monitor progress."],
  ["Technicians", "See assigned work and move it toward resolution."],
];

/* ---------- Page ---------- */
function Home() {
  const reduce = useReducedMotion();
  const { hash } = useLocation();

  // Support links like /#features from other pages and the footer.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash]);

  return (
    <div className={`${body} min-h-screen bg-midnight-ink text-paper antialiased`}>
      <Navbar />

      <main>
        {/* HERO — dark, centred */}
        <section id="hero" className="relative scroll-mt-20 overflow-hidden bg-midnight-ink">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--surface-violet-wash)_0%,var(--color-midnight-ink)_62%)]" />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative aspect-square w-[min(110vw,820px)]"
              initial={reduce ? false : { opacity: 0, transform: "scale(0.94)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              transition={{ duration: 1.8, ease: EASE }}
            >
              <div className="absolute -inset-[10%] bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-arc-cyan)_12%,transparent)_0%,transparent_62%)]" />
              <ParticleSphere className="absolute inset-0 h-full w-full" />
            </motion.div>
          </div>

          <div className={`${container} relative flex min-h-[100svh] flex-col items-center justify-center py-32 text-center`}>
            <motion.p className={eyebrow.dark} {...reveal(0, reduce)}>
              Community maintenance
            </motion.p>

            <h1 className={`${h1} mt-5 max-w-4xl text-paper`}>
              <motion.span className="block" {...reveal(1, reduce)}>
                Keep your community
              </motion.span>
              <motion.span className="block" {...reveal(2, reduce)}>
                running smoothly.
              </motion.span>
            </h1>

            <motion.p className={`${lead.dark} mt-6 max-w-2xl`} {...reveal(3, reduce)}>
              CommunityCare lets residents and management report, assign, track,
              and resolve maintenance issues in one place.
            </motion.p>

            <motion.div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row" {...reveal(4, reduce)}>
              <Link to="/maintenance/new" className={btn.primary}>
                Report an issue
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className={btn.outlineDark}>
                Explore dashboard
              </Link>
            </motion.div>
          </div>
        </section>

        {/* GRADIENT TRANSITION — used once, dark → light */}
        <div aria-hidden="true" className="h-40 bg-gradient-to-b from-midnight-ink via-halo-violet to-paper" />

        {/* PRODUCT — light, left-aligned */}
        <section className="bg-paper pb-20 text-midnight-ink lg:pb-28">
          <div className={container}>
            <div className="max-w-2xl">
              <p className={eyebrow.light}>The dashboard</p>
              <h2 className={`${h2} mt-4`}>Every request, status, and update on one screen.</h2>
              <p className={`${lead.light} mt-5 max-w-xl`}>
                See what is open, what is overdue, and what changed today
                without chasing anyone for an update.
              </p>
            </div>
            <div className="mt-12">
              <ProductPreview />
            </div>
          </div>
        </section>

        {/* FEATURES — dark, centred header */}
        <section id="features" className="scroll-mt-20 bg-midnight-ink">
          <div className={`${container} ${sectionPad}`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className={eyebrow.dark}>Platform features</p>
              <h2 className={`${h2} mt-4 text-paper`}>Everything your community needs</h2>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className={`${card.dark} p-6 transition-colors duration-200 hover:border-halo-violet/60`}>
                  <Icon size={24} className="text-halo-violet" />
                  <h3 className={`${h3} mt-6 text-paper`}>{title}</h3>
                  <p className={`${body} mt-2 text-body-sm leading-body-sm text-halo-violet`}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW — light, left-aligned */}
        <section id="workflow" className="scroll-mt-20 bg-paper text-midnight-ink">
          <div className={`${container} ${sectionPad}`}>
            <div className="max-w-2xl">
              <p className={eyebrow.light}>How it works</p>
              <h2 className={`${h2} mt-4`}>From issue to resolution in six steps</h2>
            </div>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-silver-border bg-silver-border sm:grid-cols-2 lg:grid-cols-3">
              {steps.map(([title, text], i) => (
                <li key={title} className="bg-paper p-6">
                  <span className={`${mono} text-caption leading-caption text-signal-blue`}>Step {i + 1}</span>
                  <h3 className={`${h3} mt-3`}>{title}</h3>
                  <p className={`${body} mt-2 text-body-sm leading-body-sm text-slate-body`}>{text}</p>
                </li>
              ))}
            </ol>

            <div className={`${card.light} mt-10 flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center`}>
              <div>
                <p className={`${display} text-subheading leading-subheading tracking-subheading`}>Have a maintenance issue?</p>
                <p className={`${body} mt-2 text-body-sm leading-body-sm text-slate-body`}>
                  Submit a request and your community team takes it from there.
                </p>
              </div>
              <Link to="/maintenance/new" className={btn.primary}>
                Report an issue
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT — dark */}
        <section id="about" className="scroll-mt-20 bg-midnight-ink">
          <div className={`${container} ${sectionPad} grid items-start gap-14 lg:grid-cols-2`}>
            <div>
              <p className={eyebrow.dark}>About CommunityCare</p>
              <h2 className={`${h2} mt-4 text-paper`}>One platform for better community operations</h2>
              <p className={`${lead.dark} mt-6 max-w-xl`}>
                CommunityCare connects residents, management, and technicians
                through a single maintenance workflow.
              </p>
              <p className={`${body} mt-4 max-w-xl text-body-sm leading-body-sm text-mist`}>
                From the moment a resident reports an issue to the moment it is
                resolved, everyone sees the same status.
              </p>
            </div>

            <div className={`${card.dark} divide-y divide-slate-body/70`}>
              {roles.map(([title, text]) => (
                <div key={title} className="p-6">
                  <h3 className={`${h3} text-paper`}>{title}</h3>
                  <p className={`${body} mt-2 text-body-sm leading-body-sm text-halo-violet`}>{text}</p>
                </div>
              ))}
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