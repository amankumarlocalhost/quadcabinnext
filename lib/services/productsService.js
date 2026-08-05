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
