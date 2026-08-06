// Shared vanilla Zustand store factory behind useProductsPage/useIndustriesPage
// — both just fetch one JSON document, seed it from a server-rendered
// `initialData` prop, and poll for CMS live-preview updates. One store
// instance per hook call (see productsService.js/industriesService.js), not
// a module singleton, for the same SSR-isolation reason as createCmsStore.
import { createStore } from 'zustand/vanilla';

export function createListStore({ initialData = null, fetcher }) {
  return createStore((set) => ({
    data: initialData,
    loading: !initialData,
    error: null,

    async refresh() {
      try {
        const next = await fetcher({ fresh: true });
        set({ data: next, loading: false, error: null });
      } catch (error) {
        set({ loading: false, error });
      }
    },
  }));
}
