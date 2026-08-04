// Isomorphic CMS fetch helper — no 'use client' directive, so it can run
// both in Server Components (for the initial SSR render crawlers see) and
// be imported by client code (CmsContext's live-refresh effect).
export const CMS_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://quadcabinbackend.vercel.app').replace(/\/$/, '');

export async function fetchCmsPage(slug) {
  return fetch(`${CMS_API_BASE}/content/${slug}`, { next: { revalidate: 60 } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`CMS content unavailable: ${slug}`);
      const payload = await response.json();
      return payload.data;
    })
    .catch(() => null);
}
