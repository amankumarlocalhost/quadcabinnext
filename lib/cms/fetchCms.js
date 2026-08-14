// Isomorphic CMS fetch helper — no 'use client' directive, so it can run
// both in Server Components (for the initial SSR render crawlers see) and
// be imported by client code (CmsContext's live-refresh effect).
import { API_BASE } from '@/lib/apiBase.js';

export const CMS_API_BASE = API_BASE;

export async function fetchCmsPage(slug, { fresh = false } = {}) {
  // `fresh: true` is for the client-side live-refresh path (createCmsStore's
  // refresh()) — bypasses the ISR cache entirely so admin edits show up on
  // the next poll instead of waiting out the server-side revalidation
  // window. Server-rendered page.js calls keep the default (cached, fast
  // first paint) since they don't pass this. Kept in step with the backend's
  // own Cache-Control window (src/utils/cache.js) so a fresh SSR visit can't
  // be staler than a poll would be.
  const cacheOpt = fresh ? { cache: 'no-store' } : { next: { revalidate: 10 } };
  return fetch(`${CMS_API_BASE}/content/${slug}`, cacheOpt)
    .then(async (response) => {
      if (!response.ok) throw new Error(`CMS content unavailable: ${slug}`);
      const payload = await response.json();
      return payload.data;
    })
    .catch(() => null);
}
