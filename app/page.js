import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import HomePageView from '@/components/home/HomePageView.jsx';

const FALLBACK_TITLE = 'Quad Cabins — Smart Spaces. Stronger Projects.';
const FALLBACK_DESCRIPTION = 'Quad Cabins engineers portable and modular cabins for construction, industrial and infrastructure sites across India — built in the factory, delivered ready to work.';

export async function generateMetadata() {
  const page = await fetchCmsPage('home');
  const seo = page?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl || '/' },
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
  const [page, global] = await Promise.all([fetchCmsPage('home'), fetchCmsPage('global')]);
  return (
    <CmsPageProvider slug="home" initialPage={page} initialGlobal={global}>
      <HomePageView />
    </CmsPageProvider>
  );
}
