'use client';

import { memo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

// three.js + fiber + drei + postprocessing are a heavy parse/exec cost —
// dynamically imported with ssr:false so they never run during the server
// render (they touch `window` at module scope) and stay out of the initial
// page bundle. The backdrop photo fills the same frame underneath, so the
// brief gap before the canvas mounts is invisible.
const Experience = dynamic(() => import('@/journey/Experience.jsx'), { ssr: false });

// The 3D camera-flight canvas plus its background photo and fade veil.
// Memoized (no props) so unrelated HomePage state changes — menu toggle,
// toast — don't re-run reconciliation across this heavy subtree.
function JourneyStage(){
  const hero = useCmsSection('hero');

  // Kick off the 3D chunk's fetch the instant this component runs (module
  // scope of `Experience`'s own code, ~166KB gzipped) instead of waiting
  // for it to actually render — dynamic()'s own .preload() starts that
  // download in parallel with everything else happening on this first
  // paint, rather than serialized after it.
  useEffect(() => { Experience.preload?.(); }, []);

  return (
    <>
      <div
        data-hero-bg
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none opacity-0 will-change-[opacity] bg-[#050505]"
      >
        <Image
          src={hero?.backgroundImage?.url || '/images/site-bg.jpg'}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover [object-position:center_38%] [filter:saturate(0.72)_brightness(0.78)_contrast(1.04)]"
        />
        {/* layered depth wash, replaces the old ::after pseudo-element */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.35)_42%,rgba(5,5,5,0.15)_65%,rgba(5,5,5,0.45)_100%),linear-gradient(180deg,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.15)_26%,rgba(5,5,5,0.1)_55%,rgba(5,5,5,0.9)_100%)]"
        />
      </div>
      <Experience />
      <div data-stage-veil className="fixed inset-0 z-2 pointer-events-none bg-[linear-gradient(180deg,rgba(5,5,5,0.5)_0%,rgba(5,5,5,0.02)_20%,rgba(5,5,5,0.02)_72%,rgba(5,5,5,0.7)_100%)]" />
    </>
  );
}

export default memo(JourneyStage);
