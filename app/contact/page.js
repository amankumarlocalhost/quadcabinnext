import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import ContactPageView from '@/components/contact/ContactPageView.jsx';

const FALLBACK_TITLE = 'Contact Us';
const FALLBACK_DESCRIPTION = 'Tell us about your site and timeline — our team will get back with a configuration and a quote, usually within one business day.';

export async function generateMetadata() {
  const page = await fetchCmsPage('contact');
  const seo = page?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl || '/contact' },
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
  const [page, global] = await Promise.all([fetchCmsPage('contact'), fetchCmsPage('global')]);
  return (
    <CmsPageProvider slug="contact" initialPage={page} initialGlobal={global}>
      <ContactPageView />
    </CmsPageProvider>
  );
}
