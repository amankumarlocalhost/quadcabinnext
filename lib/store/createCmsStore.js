// Vanilla (framework-agnostic) Zustand store factory for one CMS page's
// content. Deliberately a *factory*, not a module-level `create(...)`
// singleton: a singleton store would be shared by every concurrent request
// on a long-lived Next.js server process, so one visitor's page/slug could
// leak into another visitor's SSR output. CmsContext.js creates one instance
// per <CmsPageProvider> mount (i.e. per request / per client navigation) and
// hands it down through a thin Context — the Context only carries a
// reference to the store, all actual state lives in Zustand.
import { createStore } from 'zustand/vanilla';
import { fetchCmsPage } from '@/lib/cms/fetchCms.js';

export function createCmsStore({ slug, initialPage = null, initialGlobal = null }) {
  return createStore((set, get) => ({
    slug,
    page: initialPage,
    global: initialGlobal,
    loading: !initialPage && !initialGlobal,

    async refresh() {
      const [page, global] = await Promise.all([
        fetchCmsPage(get().slug, { fresh: true }),
        fetchCmsPage('global', { fresh: true }),
      ]);
      // A failed/blocked poll returns null (see fetchCmsPage's catch) — never
      // let that clobber content already on screen (from SSR or an earlier
      // successful poll) with nothing, which would flash every section back
      // to its hardcoded fallback text.
      set((state) => ({
        page: page ?? state.page,
        global: global ?? state.global,
        loading: false,
      }));
    },
  }));
}
