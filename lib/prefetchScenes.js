'use client';

// Same dynamic-import specifiers next/dynamic uses for each page's 3D hero
// (JourneyStage.jsx, ProductsPageView.jsx, IndustriesHero.jsx, ContactHero.jsx).
// Calling import() with the same specifier here just warms the browser's
// network cache + webpack's module registry for that chunk — next/dynamic
// then resolves it instantly (no fetch/parse wait) once the visitor actually
// navigates to that page. Module-level flag so this only ever runs once per
// browser session, not on every route change.
let prefetched = false;

export function prefetchScenes(){
  if (prefetched || typeof window === 'undefined') return;
  prefetched = true;
  import('@/journey/Experience.jsx').catch(() => {});
  import('@/journey/contact/ContactCabinScene.jsx').catch(() => {});
  import('@/journey/showcase/IndustriesHeroCabin.jsx').catch(() => {});
  import('@/journey/showcase/ProductHeroCabin.jsx').catch(() => {});
}
