# Quad Cabins — Next.js

Migration of the Quad Cabins public site (originally Vite + React) to **Next.js (App Router)**, JavaScript only (no TypeScript), styled entirely with **Tailwind CSS v4** utility classes.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL if you have a CMS backend running
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm run start   # production build + serve
```

## What changed vs. the original Vite app

- **Routing**: `react-router-dom` → Next.js App Router (`app/page.js`, `app/products/page.js`, `app/about/page.js`, `app/contact/page.js`, `app/industries/page.js`).
- **Styling**: `src/index.css` (1360 lines of `@apply` component classes) is gone. Every component is styled with inline Tailwind utility `className`s. `app/globals.css` contains **only** the Tailwind import, the brand `@theme` design tokens, and `@keyframes` (Tailwind has no `className` form for keyframe bodies) — no hand-written component classes.
- **Fonts**: Google Fonts `<link>` → `next/font/google`.
- **3D scene**: The Three.js / React Three Fiber "journey" engine (`journey/`) is unchanged logic-wise; every file that renders a `<Canvas>` is loaded via `next/dynamic(..., { ssr: false })` since WebGL/`window` access can't run during Next's server render.
- **SEO**: Added `generateMetadata`-equivalent static `metadata` exports per route, `app/sitemap.js`, `app/robots.js`. The existing client-side JSON-LD/meta injection in `lib/services/productsService.js` and `industriesService.js` (driven by live CMS data) is preserved as-is.
- **CMS**: `lib/cms/CmsContext.js` keeps the exact same client-side fetch/refetch-on-focus behavior as the original — it's intentionally not converted to a server-side fetch, since the focus/visibility-triggered refetch is a runtime feature, not an SEO concern.
- **JS-only DOM hooks**: A few CSS classes in the original stylesheet were used purely as JavaScript `querySelector` hooks, not for styling (e.g. `.hero-bg`, `.stage-veil`, `.card` as a GSAP scroll-reveal target). Since there's no longer a shared stylesheet defining those class names, they were replaced with `data-*` attributes (`data-hero-bg`, `data-stage-veil`, `data-reveal`, `data-reveal-card`, etc.) — see `hooks/useJourneyScroll.js` and `hooks/useAboutScroll.js`.
- **Admin panel** (`admin-panel/` in the original repo) is **out of scope** for this migration — this is the public marketing site only.

## Project layout

- `app/` — routes, layouts, metadata, sitemap/robots
- `components/` — UI components, grouped the same way as the original `src/components/`
- `journey/` — the 3D scene/showcase engine (ported from `src/journey/`)
- `hooks/` — scroll/animation/CMS hooks
- `lib/cms/`, `lib/services/`, `lib/data/` — CMS context, product/industry data fetchers, static fallback data
- `lib/ui/classNames.js` — shared Tailwind utility-class **strings** (plain JS constants, not a stylesheet) reused across components that repeat the same look (buttons, cards, page-hero, etc.)
