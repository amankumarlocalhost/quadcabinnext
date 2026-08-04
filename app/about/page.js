import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import AboutPageView from '@/components/about/AboutPageView.jsx';

const FALLBACK_TITLE = 'About Us';
const FALLBACK_DESCRIPTION = "We design and manufacture premium portable and modular cabins for India's toughest project sites — engineered in the factory, delivered ready to work.";

export async function generateMetadata() {
  const page = await fetchCmsPage('about');
  return {
    title: page?.seo?.title || FALLBACK_TITLE,
    description: page?.seo?.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/about' },
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
