'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSceneReadyStore } from '@/lib/store/sceneReadyStore.js';
import { prefetchScenes } from '@/lib/prefetchScenes.js';
import { warmScenes } from '@/lib/warmScenes.js';

// Routes whose hero mounts a dynamically-imported r3f <Canvas> — the loader
// only waits on useSceneReadyStore for these; other routes (e.g. /about)
// have no 3D to wait for and would otherwise hang until the safety timeout.
const PAGES_WITH_SCENE = new Set(['/', '/products', '/contact', '/industries']);

const MIN_VISIBLE_MS = 450; // avoids a flash-of-loader on instant/cached loads
const MAX_WAIT_MS = 4500; // safety net so a slow/failed 3D mount can't hang the page forever

// Module-level, not state: PageLoader lives in the root layout and never
// remounts across client-side navigations, so this simply stays true for
// the rest of the browser tab's life once the first page has fully loaded.
// Every navigation after that is treated as already-warm — no full-screen
// loader again, just the page's own instant render (+ the small in-frame
// CabinLoading spinner if that page's 3D chunk somehow isn't prefetched yet).
let siteLoadedOnce = false;

export default function PageLoader(){
  const pathname = usePathname();
  const sceneReady = useSceneReadyStore((s) => s.ready);
  const resetScene = useSceneReadyStore((s) => s.reset);
  const [visible, setVisible] = useState(!siteLoadedOnce);
  const [leaving, setLeaving] = useState(false);
  const shownAtRef = useRef(0);

  // Stop the browser from "helpfully" restoring a previous scroll position
  // on navigation — each page's own Lenis instance already forces itself
  // to 0 on mount (see useJourneyScroll/useAboutScroll/useShowcaseScroll),
  // this just makes sure the browser doesn't fight that.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // New page: show the loader again (first load of this tab only) and
  // reset the scene-ready signal.
  useEffect(() => {
    if (siteLoadedOnce) return undefined;
    resetScene();
    shownAtRef.current = Date.now();
    setLeaving(false);
    setVisible(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!visible || leaving) return undefined;
    const needsScene = PAGES_WITH_SCENE.has(pathname);
    if (needsScene && !sceneReady) return undefined;

    let cancelled = false;
    const fontsReady = document.fonts?.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve();
    const windowLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([fontsReady, windowLoaded]).then(() => {
      if (cancelled) return;
      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(() => {
        if (cancelled) return;
        siteLoadedOnce = true;
        setLeaving(true);
        document.body.style.overflow = '';
        // Content's ready — use idle time to warm the other pages' 3D
        // chunks (download) and shaders (compile) so navigating there
        // later is close to instant (that's also why the loader never
        // shows again below).
        const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
        schedule(prefetchScenes);
        schedule(() => warmScenes(pathname));
        setTimeout(() => { if (!cancelled) setVisible(false); }, 550);
      }, remaining);
    });

    return () => { cancelled = true; };
  }, [pathname, visible, leaving, sceneReady]);

  // Absolute safety net — never let a stuck 3D mount hold the page hostage.
  useEffect(() => {
    if (siteLoadedOnce) return undefined;
    const timer = setTimeout(() => {
      siteLoadedOnce = true;
      setLeaving(true);
      document.body.style.overflow = '';
      setTimeout(() => setVisible(false), 550);
    }, MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={
        'fixed inset-0 z-[999] flex flex-col items-center justify-center gap-[22px] bg-brand-black/80 backdrop-blur-[6px] transition-[opacity,filter] duration-[550ms] ease-in-out '
        + (leaving ? 'opacity-0 pointer-events-none [filter:blur(6px)]' : 'opacity-100 pointer-events-auto')
      }
      aria-hidden={leaving}
    >
      <img src="/images/QC_Logo_on_Black (1).png" alt="" className="h-[64px] w-auto animate-pulse [animation-duration:1.6s]" />
      <div className="relative w-[46px] h-[46px]">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-red animate-spin [animation-duration:0.8s]" />
      </div>
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-brand-steel">Loading</span>
    </div>
  );
}
