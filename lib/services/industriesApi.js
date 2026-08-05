// Isomorphic fetch — no 'use client' directive — so app/industries/page.js
// (a Server Component) can call it for the initial SSR render, while
// lib/services/industriesService.js's client hook reuses it for live refresh.
import { API_BASE } from '@/lib/apiBase.js';

export async function getIndustriesPage() {
  const response = await fetch(`${API_BASE}/industries`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Industries content is unavailable.');
  const payload = await response.json();
  return payload.data;
}
