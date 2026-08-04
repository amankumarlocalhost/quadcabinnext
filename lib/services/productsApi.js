// Isomorphic fetch — no 'use client' directive — so app/products/page.js
// (a Server Component) can call it for the initial SSR render, while
// lib/services/productsService.js's client hook reuses it for live refresh.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app').replace(/\/$/, '');

export async function getProductsPage() {
  const response = await fetch(`${API_BASE}/products`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Products content is unavailable.');
  const payload = await response.json();
  return payload.data;
}
