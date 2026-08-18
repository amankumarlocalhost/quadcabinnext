'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Static (non-3D) home page: smooth-scroll + fade-up reveals + hero intro.
// Mirrors useAboutScroll.js — the old 3D camera-flight journey (pinned
// scroll track, phase HUD, footstep/door audio) has been removed.
export function useHomeScroll(lenisRef){
  useEffect(()=>{
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    lenisRef.current = lenis;
    // Force the page to actually start at the top — Lenis otherwise adopts
    // whatever the native scrollY already was at construction time.
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);
    const rafCb = (time)=>lenis.raf(time*1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    const intro = gsap.fromTo('[data-rise]',
      { opacity:0, y:36 },
      { opacity:1, y:0, duration:1, ease:'power3.out', stagger:0.12, delay:0.2 });

    const reveals = [];
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
      intro.kill();
      reveals.forEach(r=>r.scrollTrigger?.kill());
      gsap.ticker.remove(rafCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(s=>s.kill());
    };
  }, []);
}
