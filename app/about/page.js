import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import AboutPageView from '@/components/about/AboutPageView.jsx';

const FALLBACK_TITLE = 'About Us';
const FALLBACK_DESCRIPTION = "We design and manufacture premium portable and modular cabins for India's toughest project sites — engineered in the factory, delivered ready to work.";

export async function generateMetadata() {
  const page = await fetchCmsPage('about');
  const seo = page?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl || '/about' },
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
  const [page, global] = await Promise.all([fetchCmsPage('about'), fetchCmsPage('global')]);
  return (
    <CmsPageProvider slug="about" initialPage={page} initialGlobal={global}>
      <AboutPageView />
    </CmsPageProvider>
  );
}
