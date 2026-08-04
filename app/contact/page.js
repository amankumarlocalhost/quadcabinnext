import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import ContactPageView from '@/components/contact/ContactPageView.jsx';

const FALLBACK_TITLE = 'Contact Us';
const FALLBACK_DESCRIPTION = 'Tell us about your site and timeline — our team will get back with a configuration and a quote, usually within one business day.';

export async function generateMetadata() {
  const page = await fetchCmsPage('contact');
  return {
    title: page?.seo?.title || FALLBACK_TITLE,
    description: page?.seo?.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/contact' },
  };
}

export default async function Page() {
  const [page, global] = await Promise.all([fetchCmsPage('contact'), fetchCmsPage('global')]);
  return (
    <CmsPageProvider slug="contact" initialPage={page} initialGlobal={global}>
      <ContactPageView />
    </CmsPageProvider>
  );
}
