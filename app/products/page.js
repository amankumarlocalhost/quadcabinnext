import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import { getProductsPage } from '@/lib/services/productsApi.js';
import ProductsPageView from '@/components/products/ProductsPageView.jsx';
import { SITE_URL } from '@/lib/siteUrl.js';

const FALLBACK_TITLE = 'Portable Cabin Products';
const FALLBACK_DESCRIPTION = 'Explore the full Quad Cabins range — Site Office, Labour Accommodation, Conference and Storage.';

async function safeGetProductsPage() {
  try { return await getProductsPage(); } catch { return null; }
}

function absoluteUrl(value) {
  if (!value) return '';
  try { return new URL(value, SITE_URL).href; } catch { return ''; }
}

function buildProductsJsonLd(productsPage, title, description, canonical) {
  const categoryNames = new Map((productsPage?.categories || []).map((category) => [category.id, category.name]));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (productsPage?.products || []).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          model: product.modelNumber,
          description: product.description,
          category: categoryNames.get(product.categoryId) || product.name,
          image: (product.images || []).map((image) => absoluteUrl(image.url)),
          url: `${canonical}#${product.id}`,
          brand: { '@type': 'Brand', name: 'Quad Cabins' },
        },
      })),
    },
  };
}

export async function generateMetadata() {
  const [page, productsPage] = await Promise.all([fetchCmsPage('products'), safeGetProductsPage()]);
  const seo = page?.seo || productsPage?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl || '/products' },
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
  const [page, global, productsData] = await Promise.all([
    fetchCmsPage('products'),
    fetchCmsPage('global'),
    safeGetProductsPage(),
  ]);
  const seo = page?.seo || productsData?.seo || {};
  const title = seo.title || FALLBACK_TITLE;
  const description = seo.description || FALLBACK_DESCRIPTION;
  const canonical = absoluteUrl(seo.canonicalUrl || '/products');
  const jsonLd = buildProductsJsonLd(productsData, title, description, canonical);

  return (
    <CmsPageProvider slug="products" initialPage={page} initialGlobal={global}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductsPageView initialData={productsData} />
    </CmsPageProvider>
  );
}
