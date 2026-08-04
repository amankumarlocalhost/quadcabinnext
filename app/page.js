import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import HomePageView from '@/components/home/HomePageView.jsx';

const FALLBACK_TITLE = 'Quad Cabins — Smart Spaces. Stronger Projects.';
const FALLBACK_DESCRIPTION = 'Quad Cabins engineers portable and modular cabins for construction, industrial and infrastructure sites across India — built in the factory, delivered ready to work.';

export async function generateMetadata() {
  const page = await fetchCmsPage('home');
  return {
    title: page?.seo?.title || FALLBACK_TITLE,
    description: page?.seo?.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/' },
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
