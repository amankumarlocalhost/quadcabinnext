import { CmsPageProvider } from '@/lib/cms/CmsContext.js';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';
import { getProductsPage } from '@/lib/services/productsApi.js';
import ProductsPageView from '@/components/products/ProductsPageView.jsx';

const FALLBACK_TITLE = 'Portable Cabin Products';
const FALLBACK_DESCRIPTION = 'Explore the full Quad Cabins range — Site Office, Labour Accommodation, Conference and Storage.';

async function safeGetProductsPage() {
  try { return await getProductsPage(); } catch { return null; }
}

export async function generateMetadata() {
  const [page, productsPage] = await Promise.all([fetchCmsPage('products'), safeGetProductsPage()]);
  return {
    title: page?.seo?.title || productsPage?.seo?.title || FALLBACK_TITLE,
    description: page?.seo?.description || productsPage?.seo?.description || FALLBACK_DESCRIPTION,
    alternates: { canonical: '/products' },
  };
}

export default async function Page() {
  const [page, global, productsData] = await Promise.all([
    fetchCmsPage('products'),
    fetchCmsPage('global'),
    safeGetProductsPage(),
  ]);
  return (
    <CmsPageProvider slug="products" initialPage={page} initialGlobal={global}>
      <ProductsPageView initialData={productsData} />
    </CmsPageProvider>
  );
}
