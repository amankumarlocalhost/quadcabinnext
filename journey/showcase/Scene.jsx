'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { showcase, mapRange, smootherstep } from './state.js';
import { products, siteOfficeImages } from '@/lib/data/products.js';

// Same cabin order as CopyOverlay's PANELS and CabinDots' LABELS —
// Site Office, Labour, Conference, Storage.
const GROUPS = [siteOfficeImages, ...products.map(p => p.images)];
export default function Scene({ productsData, heroMedia }){
  const cmsGroups = productsData?.map((product) => [...(product.images || [])]
    .filter((item) => item.url || item.src)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({ src:item.url || item.src, alt:item.alt })));
  const groups = Array.isArray(productsData) ? cmsGroups : GROUPS;
  const segmentCount = groups.length;
  const stageRef = useRef(null);
  const groupRefs = useRef([]);
  const cardRefs = useRef(groups.map(g => g.map(() => null)));

  useEffect(()=>{
    // The old WebGL showcase advanced this shared loading value from its
    // renderer. The current DOM image carousel has no renderer, so leaving it
    // at zero keeps the carousel stage permanently transparent even though all
    // of its images have loaded successfully.
    const entrance = gsap.fromTo(
      showcase,
      { loaded:0 },
      { loaded:1, duration:0.9, ease:'power2.out' },
    );

    let last = performance.now();
    const tick = ()=>{
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 1/20);
      last = now;
      // smoothed progress, same damping the old R3F Choreographer applied
      // per-frame — without it showcase.p never advances toward .target.
      showcase.p += (showcase.target - showcase.p) * (1 - Math.exp(-3.2 * dt));

      if(stageRef.current){
        stageRef.current.style.opacity = String(showcase.loaded);
        stageRef.current.style.transform = `scale(${0.96 + 0.04 * showcase.loaded})`;
      }

      for(let i=0;i<segmentCount;i++){
        const groupEl = groupRefs.current[i];
        if(!groupEl) continue;

        const raw = showcase.p * segmentCount - i; // continuous, unclamped
        // Group 0 waits for the hero intro copy to finish fading (mirrors
        // CopyOverlay's cabin-0 special case) so the carousel doesn't stack
        // underneath the intro text at scroll start.
        const rise = i === 0
          ? smootherstep(mapRange(raw, 0.03, 0.22))
          : smootherstep(mapRange(raw, -0.14, 0.05));
        const fall = smootherstep(mapRange(raw, 0.82, 1.0));
        const visible = rise * (1 - fall);

        const isVisible = visible > 0.003;
        groupEl.style.display = isVisible ? 'block' : 'none';
        if(!isVisible) continue;

        groupEl.style.opacity = visible.toFixed(3);
        groupEl.style.transform = `translateY(${((1-visible)*40).toFixed(1)}px) scale(${(0.9 + 0.1*visible).toFixed(3)})`;

        const cards = cardRefs.current[i];
        // cards finish their slide within the first 75% of this group's scroll
        // window, and hold on the last image for the remainder — so the
        // product's images fully cycle before the crossfade to the next
        // product (which starts around raw ~0.82) begins.
        const continuous = Math.min(1, Math.max(0, raw / 0.75)) * Math.max(0, cards.length - 1);
        for(let idx=0; idx<cards.length; idx++){
          const card = cards[idx];
          if(!card) continue;
          const offset = idx - continuous;
          const abs = Math.abs(offset);
          // tight, evenly-overlapping deck: the centred card pops slightly
          // forward, side cards settle at one uniform size (no per-distance
          // shrink), only the very edge cards fade out.
          const near = Math.min(abs, 1);
          const scale = 1.14 - near * 0.28;
          // asymmetric fade: the left side (negative offset) sits toward the
          // copy panel, so it fades out quickly instead of peeking out from
          // behind the panel edge; the right side has open space to fade later.
          const leftFade = offset < 0 ? Math.max(0, 1 - Math.max(0, -offset - 0.9) * 1.8) : 1;
          const rightFade = offset > 0 ? Math.max(0, 1 - Math.max(0, offset - 3.2) * 1.3) : 1;
          const opacity = Math.min(leftFade, rightFade);
          const z = Math.round(100 - abs * 10);

          card.style.setProperty('--offset', offset.toFixed(3));
          card.style.setProperty('--abs-offset', abs.toFixed(3));
          card.style.opacity = opacity.toFixed(3);
          card.style.zIndex = String(z);
          card.style.transform =
            `translate(-50%,-50%) translateX(calc(var(--offset) * 58%)) scale(${scale.toFixed(3)})`;
          card.style.pointerEvents = abs < 0.5 ? 'auto' : 'none';
        }
      }
    };
    gsap.ticker.add(tick);
    return ()=>{
      entrance.kill();
      gsap.ticker.remove(tick);
    };
  }, [segmentCount]);

  return (
    <div id="showcase-stage" className="fixed inset-0 z-0 bg-brand-black">
      <div
        className="absolute inset-0 z-0 bg-[url('https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-[position:center_38%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.55)_brightness(0.4)_contrast(1.08)]"
        style={heroMedia?.type === 'image' ? { backgroundImage:`url("${heroMedia.url}")` } : undefined}
      >
        {/* layered depth wash, replaces the old ::after pseudo-element */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_62%_58%,rgba(225,27,35,0.1),transparent_60%),radial-gradient(140%_100%_at_50%_100%,rgba(255,255,255,0.04),transparent_55%),linear-gradient(180deg,rgba(5,5,5,0.7)_0%,rgba(5,5,5,0.3)_35%,rgba(5,5,5,0.2)_58%,rgba(5,5,5,0.9)_100%)]"
        />
        {heroMedia?.type === 'video' && (
          <video className="w-full h-full object-cover block" src={heroMedia.url} poster={heroMedia.poster} autoPlay muted loop playsInline />
        )}
      </div>
      <div
        className="relative z-1 w-full h-full [transform-origin:center_center] will-change-[opacity,transform]"
        ref={stageRef}
      >
        {groups.map((images, gi)=>(
          <div className="absolute inset-0 [perspective:1400px] will-change-[opacity,transform]" key={gi} ref={el=>groupRefs.current[gi]=el}>
            {images.map((img, ii)=>(
              <div
                className="absolute top-1/2 left-1/2 min-[901px]:left-[66%] overflow-hidden rounded-[22px] w-[min(26.4vw,352px)] h-[min(62vh,560px)] max-[900px]:top-[34%] max-[900px]:w-[min(76vw,360px)] max-[900px]:h-[min(41vh,400px)] max-[900px]:rounded-2xl max-[560px]:w-[min(82vw,330px)] max-[560px]:h-[min(38vh,340px)] max-[560px]:rounded-[14px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.65),0_6px_18px_-6px_rgba(0,0,0,0.5)] will-change-[transform,opacity]"
                key={`${img.src}-${ii}`}
                ref={el=>{ cardRefs.current[gi] ||= []; cardRefs.current[gi][ii] = el; }}
              >
                <img className="w-full h-full object-cover block [filter:saturate(1.02)_contrast(1.02)]" src={img.src} alt={img.alt} loading={gi===0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
