// Minimal stroke-icon set — no external icon library in this project, so these
// are hand-drawn to match the thin, geometric line style used elsewhere (brackets, spec bullets).
const base = {
  width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
};

export const IconFactory = (p) => (
  <svg {...base} {...p}><path d="M3 21V10l6 4v-4l6 4V8l6 4v9H3Z"/><path d="M3 21h18"/><path d="M7 17v-3M12 17v-3M17 17v-3"/></svg>
);
export const IconSliders = (p) => (
  <svg {...base} {...p}><path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>
);
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
);
export const IconGem = (p) => (
  <svg {...base} {...p}><path d="M4 8l3-4h10l3 4-9 12L4 8Z"/><path d="M4 8h16M9 4l1 4-2 0 4 8 4-8-2 0 1-4"/></svg>
);
export const IconTag = (p) => (
  <svg {...base} {...p}><path d="M12 3h6a2 2 0 0 1 2 2v6l-9 9a2 2 0 0 1-3 0l-5-5a2 2 0 0 1 0-3l9-9Z"/><circle cx="16" cy="7" r="1.3"/></svg>
);
export const IconRain = (p) => (
  <svg {...base} {...p}><path d="M7 14a4 4 0 1 1 1-7.9A5.5 5.5 0 0 1 18 8a3.5 3.5 0 0 1-1 6.9H7Z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/></svg>
);
export const IconRuler = (p) => (
  <svg {...base} {...p}><path d="M3 16 16 3l5 5L8 21l-5-5Z"/><path d="M13 6l2 2M9 10l2 2M17 10l2 2"/></svg>
);
export const IconHeadset = (p) => (
  <svg {...base} {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.4"/><rect x="17" y="13" width="4" height="6" rx="1.4"/><path d="M19 19v1a3 3 0 0 1-3 3h-2"/></svg>
);
export const IconMapPin = (p) => (
  <svg {...base} {...p}><path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>
);
export const IconPhone = (p) => (
  <svg {...base} {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>
);
export const IconMail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 6l9 7 9-7"/></svg>
);
