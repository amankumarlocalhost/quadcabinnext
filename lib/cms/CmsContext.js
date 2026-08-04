'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCmsPage } from './fetchCms.js';

const CmsContext = createContext({ page: null, global: null, loading: false });

// `initialPage`/`initialGlobal` come from a server-side fetch done in the
// route's page.js (see app/page.js etc.) so the CMS content is present in
// the very first server-rendered HTML — crawlers that don't execute JS
// still see real content, not just the static metadata. The effect below
// still re-fetches on mount/focus/visibility so the CMS admin's live
// preview keeps working after that first paint.
export function CmsPageProvider({ slug, initialPage = null, initialGlobal = null, children }) {
  const [value, setValue] = useState({
    page: initialPage,
    global: initialGlobal,
    loading: !initialPage && !initialGlobal,
  });
  const isFirstRun = useRef(true);
  useEffect(() => {
    let active = true;
    // On the very first run, `value` already holds the server-fetched
    // content for this exact slug (or is genuinely empty if the server
    // fetch failed) — clearing it here would flash real, already-visible
    // content to blank right after hydration for no reason. Only clear
    // eagerly on a later slug change, where the provider stays mounted
    // across a client-side route navigation and would otherwise show the
    // previous route's content while the new page's fetch is in flight.
    if (!isFirstRun.current) {
      setValue((prev) => ({ ...prev, page: null, loading: true }));
    }
    isFirstRun.current = false;
    const load = () => Promise.all([fetchCmsPage(slug), fetchCmsPage('global')]).then(([page, global]) => {
      if (active) setValue({ page, global, loading: false });
    });
    const handleFocus = () => load();
    const handleVisibility = () => { if (document.visibilityState === 'visible') load(); };
    load();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [slug]);
  useEffect(() => {
    if (value.page?.seo?.title) document.title = value.page.seo.title;
    if (value.page?.seo?.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value.page.seo.description);
    }
  }, [value.page]);
  const context = useMemo(() => value, [value]);
  return <CmsContext.Provider value={context}>{children}</CmsContext.Provider>;
}

export function useCmsSection(key, scope = 'page') {
  const context = useContext(CmsContext);
  const document = scope === 'global' ? context.global : context.page;
  return document?.sections?.find((section) => section.key === key && section.enabled)?.content || null;
}

export function useCmsDocument(scope = 'page') {
  const context = useContext(CmsContext);
  return scope === 'global' ? context.global : context.page;
}
