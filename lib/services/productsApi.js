// Isomorphic fetch — no 'use client' directive — so app/products/page.js
// (a Server Component) can call it for the initial SSR render, while
// lib/services/productsService.js's client hook reuses it for live refresh.
import { API_BASE } from '@/lib/apiBase.js';

export async function getProductsPage() {
  const response = await fetch(`${API_BASE}/products`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Products content is unavailable.');
  const payload = await response.json();
  return payload.data;
}
