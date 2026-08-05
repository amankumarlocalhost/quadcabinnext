import { API_BASE } from '@/lib/apiBase.js';
import { SITE_URL } from '@/lib/siteUrl.js';

const STATIC_ROUTES = ['', '/products', '/about', '/contact', '/industries'];

async function fetchCmsPages() {
  try {
    const response = await fetch(`${API_BASE}/content`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const pages = await fetchCmsPages();
  const bySlug = new Map(pages.map((page) => [page.slug === 'home' ? '' : `/${page.slug}`, page]));

  return STATIC_ROUTES.map((route) => {
    const page = bySlug.get(route);
    return {
      url: `${SITE_URL}${route}`,
      lastModified: page?.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: page?.seo?.sitemap?.changeFrequency || 'weekly',
      priority: page?.seo?.sitemap?.priority ?? (route === '' ? 1 : 0.8),
    };
  });
}
