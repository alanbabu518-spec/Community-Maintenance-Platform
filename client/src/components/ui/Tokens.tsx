/*
  Shared class recipes. Every colour, font and size comes from the @theme
  tokens in theme.css — no raw hex — so changing a token restyles the site.

  Fonts to load (index.html):
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
  Open Sauce Sans (free):  npm i @fontsource/open-sauce-sans
    then in main.tsx:  import "@fontsource/open-sauce-sans/300.css"; …/400.css; …/500.css
  F37 Bolton (licensed): add your @font-face; Inter 300 is used until then.
*/

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Type */
export const body = "font-open-sauce-sans";
export const display = "font-f37-bolton font-light";
export const mono = "font-ibm-plex-mono uppercase tracking-data";
export const label =
  "font-f37-bolton-medium text-caption leading-caption uppercase tracking-eyebrow";

export const h1 = `${display} text-heading leading-heading tracking-heading sm:text-heading-lg sm:leading-heading-lg sm:tracking-heading-lg lg:text-display lg:leading-display lg:tracking-display`;
export const h2 = `${display} text-subheading leading-subheading tracking-subheading sm:text-heading-sm sm:leading-heading-sm sm:tracking-heading-sm lg:text-heading lg:leading-heading lg:tracking-heading`;
export const h3 =
  "font-f37-bolton text-subheading leading-subheading tracking-subheading";

export const eyebrow = {
  dark: `${label} text-halo-violet`,
  light: `${label} text-signal-blue`,
};

export const lead = {
  dark: `${body} text-body leading-body text-halo-violet`,
  light: `${body} text-body leading-body text-slate-body`,
};

/* Layout */
export const container = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
export const sectionPad = "py-20 lg:py-28";

/* Surfaces */
export const card = {
  dark: "rounded-lg border border-slate-body/70 bg-midnight-ink",
  light: "rounded-lg border border-silver-border bg-paper",
};

/* Interaction */
export const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8bff]";

export const btn = {
  primary: `font-f37-bolton text-body-sm inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-signal-blue px-6 text-paper transition-[background-color,transform] duration-150 hover:bg-[color-mix(in_srgb,var(--color-signal-blue),white_14%)] active:scale-[0.97] ${focus}`,
  outlineDark: `font-f37-bolton text-body-sm inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-slate-body px-6 text-paper transition-[background-color,border-color,transform] duration-150 hover:border-paper hover:bg-white/5 active:scale-[0.97] ${focus}`,
  iconDark: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-halo-violet transition-colors duration-150 hover:bg-white/10 hover:text-paper ${focus}`,
};

/* Top navigation links (ghost, uppercase, per the reference) */
export const navLink = `${label} rounded-lg px-3 py-2 transition-colors duration-150 hover:text-paper ${focus}`;