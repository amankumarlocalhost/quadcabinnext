'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 900px)';

function subscribe(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
  return () => {
    mql.removeEventListener ? mql.removeEventListener('change', onChange) : mql.removeListener(onChange);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

// The server has no viewport, so it always renders the desktop branch. React
// uses this same snapshot for the client's hydration pass, which keeps that
// first client render byte-identical to the SSR HTML; useSyncExternalStore
// then re-reads getSnapshot immediately after hydration commits and re-renders
// if we're actually on a narrow viewport. Reading matchMedia directly into
// useState instead (the previous approach) made the hydration render disagree
// with the server on phones and tore the tree apart with a hydration mismatch.
function getServerSnapshot() {
  return false;
}

// Mirrors the tablet/phone breakpoint (<=900px) used across the CSS, so any
// viewport that gets the compact layout is detected consistently in JS too.
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
