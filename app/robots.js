import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import { SITE_URL } from '@/lib/siteUrl.js';

export default async function robots() {
  const global = await fetchCmsPage('global');
  const extraRules = global?.robotsTxt?.extraRules || [];

  return {
    rules: [{ userAgent: '*', allow: '/', ...(extraRules.length ? { disallow: extraRules } : {}) }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
