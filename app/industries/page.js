import IndustriesPageView from '@/components/industries/IndustriesPageView.jsx';
import { getIndustriesPage } from '@/lib/services/industriesApi.js';

// Matches the original app: the /industries route is NOT wrapped in a
// CmsPageProvider (unlike home/products/about/contact) — its content comes
// from useIndustriesPage()/useIndustriesSeo() (services/industriesService.js)
// instead of the generic CMS page-content context. It still gets the same
// server-fetched-initial-data treatment so the content is in the first
// server-rendered HTML rather than only appearing after client hydration.
const FALLBACK_TITLE = 'Industries We Serve';
const FALLBACK_DESCRIPTION = "Six sectors, one manufacturing standard. Whatever your site throws at it, there's a Quad Cabins unit already built to take it.";

async function safeGetIndustriesPage() {
  try { return await getIndustriesPage(); } catch { return null; }
}

export async function generateMetadata() {
  const data = await safeGetIndustriesPage();
  return {
    title: data?.seo?.title || FALLBACK_TITLE,
    description: data?.seo?.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/industries' },
  };
}

export default async function Page() {
  const data = await safeGetIndustriesPage();
  return <IndustriesPageView initialData={data} />;
}
