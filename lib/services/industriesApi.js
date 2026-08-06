// Isomorphic fetch — no 'use client' directive — so app/industries/page.js
// (a Server Component) can call it for the initial SSR render, while
// lib/services/industriesService.js's client hook reuses it for live refresh.
import { API_BASE } from '@/lib/apiBase.js';

export async function getIndustriesPage({ fresh = false } = {}) {
  // fresh:true is the client-side live-refresh path (industriesService.js) —
  // bypasses the 60s ISR cache so admin edits show up on the next poll
  // instead of waiting out the server-side revalidation window.
  const cacheOpt = fresh ? { cache: 'no-store' } : { next: { revalidate: 60 } };
  const response = await fetch(`${API_BASE}/industries`, cacheOpt);
  if (!response.ok) throw new Error('Industries content is unavailable.');
  const payload = await response.json();
  return payload.data;
}
