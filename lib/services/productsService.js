'use client';

// Client-side state for the /products catalog now runs through Zustand
// (lib/store/createListStore.js) instead of a bare useState+useEffect pair.
// A fresh store is created per hook call (via useRef) rather than reused as
// a module singleton, so a long-lived Next.js server process can't leak one
// request's data into a concurrent request's SSR output — see the same note
// in lib/cms/CmsContext.js. useProductsPage's external signature is
// unchanged (still just returns the data, not the whole store), so callers
// don't need to change.
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { createListStore } from '@/lib/store/createListStore.js';
import { getProductsPage } from './productsApi.js';

export { getProductsPage };

// `initialData` comes from a server-side fetch in app/products/page.js so
// the product catalog is present in the first server-rendered HTML — see
// the equivalent CmsPageProvider(initialPage) pattern used elsewhere. The
// store's refresh() still re-fetches on mount/focus/interval so the CMS
// admin's live preview keeps working after that first paint.
export function useProductsPage(initialData = null) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createListStore({ initialData, fetcher: getProductsPage });
  }
  const store = storeRef.current;

  useEffect(() => {
    let active = true;
    const load = () => { if (active) store.getState().refresh(); };
    const onFocus = () => load();
    load();
    const timer = window.setInterval(load, 10000);
    window.addEventListener('focus', onFocus);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', onFocus); };
  }, [store]);

  return useStore(store, (state) => state.data);
}

function absoluteUrl(value) {
  if (!value) return '';
  try { return new URL(value, window.location.origin).href; } catch { return ''; }
}

function setMeta(attribute, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function useProductsSeo(data) {
  useEffect(() => {
    if (!data) return undefined;
    const title = data.seo?.title || 'Portable Cabin Products | Quad Cabins';
    const description = data.seo?.description || data.hero?.description || '';
    const canonical = absoluteUrl(data.seo?.canonicalUrl || '/products');
    const image = absoluteUrl(data.seo?.image?.url || data.products?.[0]?.images?.[0]?.url);
    const imageAlt = data.seo?.image?.alt || data.products?.[0]?.images?.[0]?.alt || data.products?.[0]?.title || 'Quad Cabins products';
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', data.seo?.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:site_name', 'Quad Cabins');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);

    let canonicalElement = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical);

    const categoryNames = new Map((data.categories || []).map((category) => [category.id, category.name]));
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: (data.products || []).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            model: product.modelNumber,
            description: product.description,
            category: categoryNames.get(product.categoryId) || product.name,
            image: (product.images || []).map((item) => absoluteUrl(item.url)),
            url: `${canonical}#${product.id}`,
            brand: { '@type': 'Brand', name: 'Quad Cabins' },
          },
        })),
      },
    };
    let script = document.getElementById('products-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'products-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
    return () => script.remove();
  }, [data]);
}
