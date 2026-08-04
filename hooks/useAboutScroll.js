'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Static (non-3D) page: smooth-scroll + fade-up reveals + hero intro + parallax bg.
// `[data-reveal]` replaces the old `.reveal` styling class as a pure JS hook —
// styling itself lives entirely in each component's Tailwind classNames.
export function useAboutScroll(lenisRef){
  useEffect(()=>{
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const rafCb = (time)=>lenis.raf(time*1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    const intro = gsap.fromTo('[data-rise]',
      { opacity:0, y:36 },
      { opacity:1, y:0, duration:1, ease:'power3.out', stagger:0.12, delay:0.2 });

    const parallaxes = gsap.utils.toArray('[data-parallax-bg]').map(el=>{
      const trigger = el.closest('section') || el;
      return gsap.to(el, {
        yPercent: 18, ease:'none',
        scrollTrigger: { trigger, start:'top top', end:'bottom top', scrub:true },
      });
    });

    const reveals = [];
    gsap.utils.toArray('[data-reveal]').forEach(el=>{
      reveals.push(gsap.fromTo(el, { opacity:0, y:40 }, {
        opacity:1, y:0, duration:0.8, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 86%', toggleActions:'play none none reverse' },
      }));
    });

    return ()=>{
      intro.kill();
      parallaxes.forEach(p=>p.scrollTrigger?.kill());
      reveals.forEach(r=>r.scrollTrigger?.kill());
      gsap.ticker.remove(rafCb);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(s=>s.kill());
    };
  }, []);
}
