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
