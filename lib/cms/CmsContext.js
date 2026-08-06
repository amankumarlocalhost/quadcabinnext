'use client';

// State management for CMS page content now runs through Zustand
// (lib/store/createCmsStore.js) instead of plain useState-in-Context. A thin
// Context still exists here, but only to hand a *reference* to the current
// page's store instance down to descendants — it never carries the content
// itself, so unlike the old implementation a component reading one section
// no longer re-renders when some unrelated section changes (Zustand's
// `useStore(store, selector)` subscribes per-selector, not per-tree).
//
// The store is created fresh per <CmsPageProvider> mount rather than as a
// module-level singleton: Next.js can run this component's SSR pass on a
// long-lived server process shared by many concurrent requests, and a
// singleton would let one visitor's slug/content bleed into another's.
import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { createCmsStore } from '@/lib/store/createCmsStore.js';

const CmsStoreContext = createContext(null);

// Stable, never-mutated fallback for components that call useCmsSection /
// useCmsDocument outside a <CmsPageProvider> (e.g. the /industries route,
// which doesn't mount one) — mirrors the old default-context-value behavior
// of quietly returning null instead of throwing.
const EMPTY_STORE = createCmsStore({ slug: null });

// `initialPage`/`initialGlobal` come from a server-side fetch done in the
// route's page.js (see app/page.js etc.) so the CMS content is present in
// the very first server-rendered HTML — crawlers that don't execute JS still
// see real content, not just the static metadata. The store's `refresh()`
// still re-fetches on mount/focus/visibility so the CMS admin's live preview
// keeps working after that first paint.
export function CmsPageProvider({ slug, initialPage = null, initialGlobal = null, children }) {
  const storeRef = useRef(null);
  if (!storeRef.current || storeRef.current.getState().slug !== slug) {
    // First mount, or the provider stayed mounted across a client-side route
    // change to a different slug — either way, seed a fresh store from this
    // render's props so the new page's content is available synchronously
    // instead of flashing the previous route's content while refresh() runs.
    storeRef.current = createCmsStore({ slug, initialPage, initialGlobal });
  }
  const store = storeRef.current;

  useEffect(() => {
    let active = true;
    const load = () => { if (active) store.getState().refresh(); };
    const handleFocus = () => load();
    const handleVisibility = () => { if (document.visibilityState === 'visible') load(); };
    load();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    // Also poll while the tab is open and visible, so an admin edit shows up
    // on its own instead of requiring the visitor to switch tabs and back.
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, 10000);
    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [store]);

  useEffect(() => store.subscribe((state) => {
    const seo = state.page?.seo;
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    if (seo.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', seo.description);
    }
  }), [store]);

  return <CmsStoreContext.Provider value={store}>{children}</CmsStoreContext.Provider>;
}

export function useCmsSection(key, scope = 'page') {
  const store = useContext(CmsStoreContext) || EMPTY_STORE;
  return useStore(store, (state) => {
    const document = scope === 'global' ? state.global : state.page;
    return document?.sections?.find((section) => section.key === key && section.enabled)?.content || null;
  });
}

export function useCmsDocument(scope = 'page') {
  const store = useContext(CmsStoreContext) || EMPTY_STORE;
  return useStore(store, (state) => (scope === 'global' ? state.global : state.page));
}
