// Single source of truth for the backend API's base URL, shared by
// lib/cms/fetchCms.js, lib/cms/quotes.js, lib/services/productsApi.js and
// lib/services/industriesApi.js.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app/api/v1';

// Server-side fetches (SSR, revalidation) go straight to the backend — no
// browser involved, so no CORS. Client-side fetches (CmsContext's
// focus/visibility refresh, the quote form) are instead pointed at this
// app's own origin; next.config.js rewrites that path to the backend
// server-side, so the browser only ever talks to its own origin and the
// backend's missing Access-Control-Allow-Origin header never comes into play.
export const API_BASE = typeof window === 'undefined'
  ? API_URL.replace(/\/$/, '')
  : new URL(API_URL).pathname.replace(/\/$/, '');
