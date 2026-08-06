'use client';

// Prefetching the JS chunk (prefetchScenes.js) removes the download/parse
// wait, but the visible "model takes a moment to appear" delay on a fresh
// page is mostly the browser compiling that scene's WebGL shaders for the
// very first time in a brand-new context (postprocessing — Bloom/N8AO/etc —
// is the expensive part). Chrome caches compiled shaders on disk, keyed by
// source, independent of which context compiled them — so mounting each
// scene once, off-screen and invisible, warms that cache ahead of time. The
// real mount later (when the visitor actually opens that page) then hits a
// warm cache instead of compiling from scratch.
//
// Home's Experience.jsx is deliberately excluded: its root node is
// `fixed inset-0 w-screen h-screen`, which needs a CSS containing-block
// trick to contain off-screen safely, and home is the site's usual entry
// page anyway (already warmed normally on a real first visit there).
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

const SCENE_LOADERS = {
  '/products': () => import('@/journey/showcase/ProductHeroCabin.jsx'),
  '/industries': () => import('@/journey/showcase/IndustriesHeroCabin.jsx'),
  '/contact': () => import('@/journey/contact/ContactCabinScene.jsx'),
};

const MOUNT_MS = 1500; // enough time to create the gl context and compile shaders

let warmedOnce = false;

export function warmScenes(currentPath){
  if (warmedOnce || typeof window === 'undefined') return;
  warmedOnce = true;

  const targets = Object.keys(SCENE_LOADERS).filter((p) => p !== currentPath);
  if (!targets.length) return;

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:320px;height:320px;opacity:0;pointer-events:none;overflow:hidden;';
  document.body.appendChild(container);
  const root = createRoot(container);

  let i = 0;
  function next(){
    if (i >= targets.length) {
      root.unmount();
      container.remove();
      return;
    }
    const path = targets[i];
    i += 1;
    SCENE_LOADERS[path]().then((mod) => {
      root.render(createElement(mod.default));
      setTimeout(next, MOUNT_MS);
    }).catch(() => { setTimeout(next, 0); });
  }
  const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
  schedule(next);
}
