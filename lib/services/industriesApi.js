// Isomorphic fetch — no 'use client' directive — so app/industries/page.js
// (a Server Component) can call it for the initial SSR render, while
// lib/services/industriesService.js's client hook reuses it for live refresh.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

export async function getIndustriesPage() {
  const response = await fetch(`${API_BASE}/industries`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Industries content is unavailable.');
  const payload = await response.json();
  return payload.data;
}
