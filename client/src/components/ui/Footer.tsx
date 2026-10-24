import { Link } from "react-router-dom";
import { ArrowUpRight, UsersRound } from "lucide-react";
import SocialButtons from "./SocialButtons";
import { body, display, mono, container, focus } from "./Tokens";

const linkClass = `${body} inline-flex items-center gap-1 rounded-md text-body-sm leading-body-sm text-halo-violet transition-colors duration-150 hover:text-paper ${focus}`;
const headingClass = `${mono} text-caption leading-caption text-mist`;

type FooterLink = { label: string; to: string; external?: boolean };
type Column = { title: string; links: FooterLink[]; muted?: string[] };

// Section links use /#id so they work from other pages (Home scrolls to the hash).
const columns: Column[] = [
  {
    title: "Platform",
    links: [
      { label: "Features", to: "/#features" },
      { label: "How it works", to: "/#workflow" },
      { label: "FAQs", to: "/#faqs" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "About us", to: "/#about" },
      { label: "Maintenance", to: "/maintenance" },
      { label: "Report an issue", to: "/maintenance/new", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", to: "/#faqs" },
      { label: "Maintenance guide", to: "/#workflow" },
    ],
    muted: ["Documentation", "Support"],
  },
];

const legal = ["Privacy policy", "Terms of service", "Cookie settings", "Security"];

function Footer() {
  return (
    <footer className={`${body} border-t border-slate-body/60 bg-midnight-ink text-paper`}>
      <div className={`${container} py-14`}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Link to="/" className={`inline-flex items-center gap-2 rounded-lg ${focus}`}>
              <UsersRound size={22} className="text-paper" />
              <span className={`${display} text-subheading leading-none tracking-subheading`}>
                CommunityCare
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-body-sm leading-body-sm text-halo-violet">
              Making community maintenance simpler through better communication
              and organized workflows.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <SocialButtons />
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className={headingClass}>{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                      {link.external && <ArrowUpRight size={14} />}
                    </Link>
                  </li>
                ))}
                {column.muted?.map((label) => (
                  <li key={label} className="text-body-sm leading-body-sm text-mist">
                    {label}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Legal">
            <h3 className={headingClass}>Legal</h3>
            <ul className="mt-5 space-y-3">
              {legal.map((label) => (
                <li key={label}>
                  <a href="#" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-body/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption leading-caption text-mist">© 2026 CommunityCare. All rights reserved.</p>
          <p className="text-caption leading-caption text-mist">Built for better communities.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;