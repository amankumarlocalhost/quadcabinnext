'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { journey, mapRange } from '@/journey/scrollState.js';

const PHASES = [
  [0.00, 'EXTERIOR'],
  [0.30, 'THRESHOLD'],
  [0.58, 'RECEPTION'],
  [0.85, 'EXIT'],
];

// Drives the smooth scroll (Lenis), the camera-flight ScrollTrigger, the
// hero/HUD fades, and the on-scroll reveal animations for the page below.
// All the old `.hero-bg` / `.stage-veil` / `.card` / `.industry-tile` /
// `.g-card` CSS-class selectors are replaced with `data-*` attribute hooks
// (`[data-hero-bg]`, `[data-stage-veil]`, `[data-reveal-card]`, etc.) since
// those classes no longer exist as styling classes in the Tailwind version —
// components must carry the matching data attribute for this hook to find them.
export function useJourneyScroll({ trackRef, heroRef, plateRef, lenisRef }){
  useEffect(()=>{
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    lenisRef.current = lenis;
    // Force the page to actually start at the top — Lenis otherwise adopts
    // whatever the native scrollY already was at construction time (stale
    // browser scroll-restoration on a fresh navigation, or leftover offset
    // from the previous page), which read as "landing mid-page".
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);
    const rafCb = (time)=>lenis.raf(time*1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    let stage = document.getElementById('stage');
    const veil = document.querySelector('[data-stage-veil]');
    const heroBg = document.querySelector('[data-hero-bg]');

    // Phone hero layout: the copy sits in the top half (see the
    // hero-overlay mobile layout), so the cabin canvas is pushed below it
    // while the hero is on screen, easing back to full frame as the camera
    // flight begins. The offset is measured from where the CTA row actually
    // ends (not a fixed vh guess), so the cabin clears the copy on any
    // screen height; when there isn't enough room left below the copy, the
    // cabin scales down toward its base instead of sliding under the text.
    // Runs every frame (via the hud ticker) because the lazy-loaded canvas
    // mounts after this effect.
    const mobileQ = window.matchMedia('(max-width:900px)');
    // vertical band of the unshifted canvas the cabin roughly occupies
    const BAND_TOP = 0.40, BAND_BOTTOM = 0.68, MARGIN = 48;
    const applyStageShift = ()=>{
      stage ||= document.getElementById('stage');
      if(!stage) return;
      if(mobileQ.matches){
        // hold the cabin inside its box below the copy until the hero text
        // has fully faded (0.09), then release it to full frame for the
        // door fly-through — never a half-shifted cabin behind the text.
        const k = 1 - mapRange(journey.target, 0.09, 0.2);
        if(k > 0.001){
          const vh = window.innerHeight;
          const ctas = document.querySelector('[data-hero-overlay] [data-hero-ctas]');
          const copyBottom = ctas ? ctas.getBoundingClientRect().bottom : vh*0.52;
          const wantTop = copyBottom + MARGIN;
          const maxShift = Math.max(vh*(1 - BAND_BOTTOM) - MARGIN, 0);
          const shift = Math.min(Math.max(wantTop - BAND_TOP*vh, 0), maxShift);
          let scale = 1;
          if(BAND_TOP*vh + shift < wantTop){
            scale = Math.min(1, Math.max(0.5,
              (BAND_BOTTOM*vh + shift - wantTop) / ((BAND_BOTTOM - BAND_TOP)*vh)));
          }
          stage.style.transformOrigin = `50% ${BAND_BOTTOM*100}%`;
          stage.style.transform =
            `translateY(${(k*shift).toFixed(1)}px) scale(${(1 - k*(1 - scale)).toFixed(3)})`;
        } else if(stage.style.transform){
          stage.style.transform = '';
        }
      } else if(stage.style.transform){
        stage.style.transform = '';
      }
    };

    let mainLoopOn = true;
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self)=>{
        journey.target = self.progress;
        // pause the hero canvas once it's fully handed over to the HTML content
        const shouldRun = self.progress < 0.999;
        if(shouldRun !== mainLoopOn){
          mainLoopOn = shouldRun;
          journey.mainLoop?.(shouldRun ? 'always' : 'never');
        }
        // hero copy fades up and away as the flight begins
        if(heroRef.current){
          const k = mapRange(self.progress, 0, 0.09);
          heroRef.current.style.opacity = String(1 - k);
          heroRef.current.style.transform = `translateY(${-k*60}px)`;
          heroRef.current.style.visibility = k >= 1 ? 'hidden' : 'visible';
        }
        // canvas hands over to the HTML content at the very end
        const fade = 1 - mapRange(self.progress, 0.965, 1);
        if(stage) stage.style.opacity = String(fade);
        if(veil) veil.style.opacity = String(fade);
        // the site photo dims as you close in on the door and is gone once inside
        if(heroBg) heroBg.style.opacity = String(Math.min(fade, 1 - mapRange(self.progress, 0.3, 0.5)*0.85));
      },
    });

    // HUD: phase label. Uses the raw (Lenis-smoothed) target so it keeps
    // updating even after the hero canvas frame loop is paused.
    const hud = ()=>{
      applyStageShift();
      const p = Math.min(journey.p > 0.95 ? journey.target : journey.p, 1);
      if(plateRef.current){
        let label = PHASES[0][1];
        for(const [t,name] of PHASES) if(p >= t) label = name;
        if(plateRef.current.textContent !== label) plateRef.current.textContent = label;
      }
    };
    gsap.ticker.add(hud);

    // load: backdrop fades up. The hero text ([data-rise]) is no longer
    // driven by its own timeline here — Experience.jsx ties it to the same
    // `journey.loaded` tween that lights up the 3D cabin, so both arrive on
    // screen together instead of the text beating the model in.
    const introBg = gsap.fromTo('[data-hero-bg]', { opacity:0 }, { opacity:1, duration:2.0, ease:'power2.inOut', delay:0.2 });

    // content reveals after the journey
    const reveals = [];
    gsap.utils.toArray('[data-reveal-card], [data-reveal-block]').forEach(el=>{
      reveals.push(gsap.fromTo(el, {opacity:0, y:40}, {
        opacity:1, y:0, duration:0.8, ease:'power2.out',
        scrollTrigger:{trigger:el, start:'top 82%', toggleActions:'play none none reverse'}
      }));
    });
    gsap.utils.toArray('[data-reveal-tile]').forEach((tile,i)=>{
      reveals.push(gsap.fromTo(tile, {opacity:0, y:24}, {
        opacity:1, y:0, duration:0.6, delay:i*0.05, ease:'power2.out',
        scrollTrigger:{trigger:tile, start:'top 90%', toggleActions:'play none none reverse'}
      }));
    });
    gsap.utils.toArray('[data-reveal-gcard]').forEach((g,i)=>{
      reveals.push(gsap.fromTo(g, {opacity:0, scale:0.9}, {
        opacity:1, scale:1, duration:0.6, delay:i*0.04, ease:'power2.out',
        scrollTrigger:{trigger:g, start:'top 92%', toggleActions:'play none none reverse'}
      }));
    });

    return ()=>{
      if(stage) stage.style.transform = '';
      st.kill();
      reveals.forEach(r=>r.scrollTrigger?.kill());
      introBg.kill();
      gsap.ticker.remove(hud);
      gsap.ticker.remove(rafCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(s=>s.kill());
    };
  }, []);
}
