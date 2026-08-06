'use client';

// Tiny signal the full-page loader (components/layout/PageLoader.jsx) waits
// on for pages whose hero is a dynamically-imported r3f <Canvas> (home,
// products, industries, contact). Ephemeral client-only UI state, same
// singleton rationale as quoteStore.js — no SSR cross-request risk.
import { create } from 'zustand';

export const useSceneReadyStore = create((set) => ({
  ready: false,
  markSceneReady: () => set({ ready: true }),
  reset: () => set({ ready: false }),
}));
