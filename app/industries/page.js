import IndustriesPageView from '@/components/industries/IndustriesPageView.jsx';
import { getIndustriesPage } from '@/lib/services/industriesApi.js';
import { SITE_URL } from '@/lib/siteUrl.js';

// Matches the original app: the /industries route is NOT wrapped in a
// CmsPageProvider (unlike home/products/about/contact) — its content comes
// from useIndustriesPage() (services/industriesService.js) instead of the
// generic CMS page-content context. It still gets the same
// server-fetched-initial-data treatment so the content is in the first
// server-rendered HTML rather than only appearing after client hydration.
const FALLBACK_TITLE = 'Industries We Serve';
const FALLBACK_DESCRIPTION = "Six sectors, one manufacturing standard. Whatever your site throws at it, there's a Quad Cabins unit already built to take it.";

async function safeGetIndustriesPage() {
  try { return await getIndustriesPage(); } catch { return null; }
}

function absoluteUrl(value) {
  if (!value) return '';
  try { return new URL(value, SITE_URL).href; } catch { return ''; }
}

function buildIndustriesJsonLd(data, title, description, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (data?.industries || []).map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: industry.name,
          description: industry.description,
          image: absoluteUrl(industry.image?.url),
          url: `${canonical}#${industry.id}`,
          provider: { '@type': 'Organization', name: 'Quad Cabins' },
        },
      })),
    },
  };
}

export async function generateMetadata() {
  const data = await safeGetIndustriesPage();
  const seo = data?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl || '/industries' },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.og?.title || title,
      description: seo.og?.description || description,
      images: seo.og?.image?.url ? [seo.og.image.url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter?.title || seo.og?.title || title,
      description: seo.twitter?.description || seo.og?.description || description,
      images: seo.twitter?.image?.url ? [seo.twitter.image.url] : undefined,
    },
  };
}

export default async function Page() {
  const data = await safeGetIndustriesPage();
  const seo = data?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  const canonical = absoluteUrl(seo.canonicalUrl || '/industries');
  const jsonLd = buildIndustriesJsonLd(data, title, description, canonical);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IndustriesPageView initialData={data} />
    </>
  );
}
