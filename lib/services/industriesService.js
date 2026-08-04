'use client';

// Client-side state for the /industries page now runs through Zustand
// (lib/store/createListStore.js) instead of a bare useState+useEffect pair —
// same pattern and same per-hook-call store instance (via useRef) as
// productsService.js, for the same SSR-isolation reason. useIndustriesPage's
// external signature is unchanged, so callers don't need to change.
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { createListStore } from '@/lib/store/createListStore.js';
import { getIndustriesPage } from './industriesApi.js';

export { getIndustriesPage };

// `initialData` comes from a server-side fetch in app/industries/page.js so
// the industries content is present in the first server-rendered HTML —
// see the equivalent CmsPageProvider(initialPage) pattern for the other
// routes. The store's refresh() still re-fetches on mount/focus/interval so
// the CMS admin's live preview keeps working after that first paint.
export function useIndustriesPage(initialData = null) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createListStore({ initialData, fetcher: getIndustriesPage });
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

export function useIndustriesSeo(data) {
  useEffect(() => {
    if (!data) return undefined;
    const title = data.seo?.title || 'Industries We Serve | Quad Cabins';
    const description = data.seo?.description || data.hero?.description || '';
    const canonical = absoluteUrl(data.seo?.canonicalUrl || '/industries');
    const image = absoluteUrl(data.seo?.image?.url || data.hero?.backgroundImage?.url);
    const imageAlt = data.seo?.image?.alt || data.hero?.backgroundImage?.alt || 'Quad Cabins industries';
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

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: (data.industries || []).map((industry, index) => ({
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
    let script = document.getElementById('industries-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'industries-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
    return () => script.remove();
  }, [data]);
}
