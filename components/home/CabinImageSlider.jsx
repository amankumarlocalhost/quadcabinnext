'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/useIsMobile.js';
import { cabinViewerClass, cabinVisualClass, cabinFrameClass } from '@/lib/ui/classNames.js';

/*
 * Admin-managed multi-image scroll walkthrough for a pinned product section.
 * Scrubbing the section scroll zooms into the current image, then crossfades
 * and zooms into the next — same "walking forward" feel as the original
 * 2-image exterior/interior effect, generalized to however many images the
 * admin has uploaded for this cabin.
 *
 * On mobile the section is no longer pinned/scrubbed (see CSS breakpoints),
 * so the scroll-linked zoom would just look glitchy there — it's swapped for
 * a lightweight swipeable strip showing the same images instead.
 */
export default function CabinImageSlider({ images, sectionId, fallbackAlt }){
  const list = (images || []).filter((img) => img.url || img.src);
  const viewerRef = useRef(null);
  const frameRefs = useRef([]);
  frameRefs.current = [];
  const mobile = useIsMobile();
  const swipeRef = useRef(null);
  const [active, setActive] = useState(0);

  // track which slide is centred so the "swipe to view" label can show a
  // live 1-of-N count instead of just a static hint
  useEffect(() => {
    const el = swipeRef.current;
    if (!mobile || !el) return undefined;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setActive((prev) => (prev === idx ? prev : idx));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [mobile, list.length]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const frames = frameRefs.current;
    if (mobile || !viewer || !frames.length) return undefined;

    const reveal = gsap.fromTo(viewer, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, ease: 'power2.out',
      scrollTrigger: { trigger: `#${sectionId}`, start: 'top bottom', end: 'top 55%', scrub: true },
    });

    const count = frames.length;
    const trigger = ScrollTrigger.create({
      trigger: `#${sectionId}`,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate(self){
        const p = self.progress * count;
        for (let i = 0; i < count; i += 1) {
          const frame = frames[i];
          if (!frame) continue;
          const local = p - i;
          const isLast = i === count - 1;
          // every image fades in the same way; only non-last images fade back
          // out again (into the next one) — the last image holds at full
          // opacity through the end of the scroll instead of fading to black.
          const fadeIn = Math.min(1, Math.max(0, 1 - Math.max(0, -local)));
          const fadeOut = isLast ? 1 : Math.min(1, Math.max(0, 1 - Math.max(0, local)));
          const opacity = Math.min(fadeIn, fadeOut);
          const scale = 1 + 0.4 * Math.min(1, Math.max(0, local));
          frame.style.opacity = opacity.toFixed(3);
          frame.style.transform = `scale(${scale.toFixed(3)})`;
          frame.style.zIndex = String(100 - Math.round(Math.abs(local) * 10));
        }
      },
    });

    return () => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      trigger.kill();
    };
  }, [sectionId, list.length, mobile]);

  if (!list.length) return <div className={`${cabinViewerClass} ${cabinVisualClass}`} ref={viewerRef} />;

  if (mobile) {
    return (
      <div
        className={`w-full relative h-[426px]! max-h-[426px]! [mask-image:none] [-webkit-mask-image:none] max-[480px]:h-[358px]! max-[480px]:max-h-[358px]!`}
        ref={viewerRef}
      >
        <div
          className="flex w-full h-full overflow-x-auto overflow-y-hidden [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={swipeRef}
        >
          {list.map((img, index) => (
            <div className="relative flex-none w-full h-full [scroll-snap-align:center] [scroll-snap-stop:always]" key={img.publicId || img.url || img.src || index}>
              <Image
                fill
                sizes="100vw"
                className="object-cover rounded-[2px]"
                src={img.url || img.src}
                alt={img.alt || fallbackAlt || 'Quad Cabins modular cabin'}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <div
            className="absolute top-[10px] right-[10px] z-2 pointer-events-none flex items-center gap-[6px] font-mono text-[10px] tracking-[0.1em] uppercase text-brand-white rounded-[20px] bg-[rgba(10,10,11,0.6)] border border-white/15 p-[6px_10px] backdrop-blur-[4px] animate-[cabin-swipe-nudge_1.8s_ease-in-out_1s_2]"
            aria-hidden="true"
          >
            <svg className="flex-none text-brand-red" width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M1 5.5h13M9.5 1 14 5.5 9.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Swipe</span>
            <span className="text-brand-steel">{active + 1}/{list.length}</span>
          </div>
        )}
        {list.length > 1 && (
          <div className="absolute left-0 right-0 bottom-[10px] z-2 pointer-events-none flex items-center justify-center gap-[6px]">
            {list.map((img, index) => (
              <span
                key={img.publicId || img.url || img.src || index}
                className={'w-[6px] h-[6px] rounded-full transition-[background,transform] duration-[250ms] ease-in-out ' + (index === active ? 'bg-brand-red scale-130' : 'bg-white/40')}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${cabinViewerClass} ${cabinVisualClass}`} ref={viewerRef}>
      {list.map((img, index) => (
        <Image
          key={img.publicId || img.url || img.src || index}
          fill
          sizes="(max-width: 900px) 100vw, 46vw"
          className={cabinFrameClass}
          ref={(el) => { if (el) frameRefs.current[index] = el; }}
          style={{ opacity: index === 0 ? 1 : 0 }}
          src={img.url || img.src}
          alt={img.alt || fallbackAlt || 'Quad Cabins modular cabin'}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
