import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { showcase } from './state.js';

gsap.registerPlugin(ScrollTrigger);

// Page-scoped Lenis + ScrollTrigger driving `showcase.target` — mirrors
// useJourneyScroll.js but fully independent so it can never leak into (or
// be affected by) the home page's journey/Lenis instance.
export function useShowcaseScroll({ trackRef, heroRef, productsData }){
  const segmentCount = Array.isArray(productsData) ? Math.max(1, productsData.length) : 4;
  // productsData is refetched (and re-created as a new array) every few
  // seconds by the CMS polling in productsService.js — reading it through a
  // ref keeps that polling from re-running this effect and resetting the
  // scroll/pin state (which looked like the page auto-advancing on its own).
  const productsDataRef = useRef(productsData);
  productsDataRef.current = productsData;
  useEffect(()=>{
    showcase.target = 0;
    showcase.p = 0;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const rafCb = (time)=>lenis.raf(time*1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    let mainLoopOn = true;
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self)=>{
        showcase.target = self.progress;
        const shouldRun = self.progress < 0.999 || self.progress > 0.001;
        if(shouldRun !== mainLoopOn){
          mainLoopOn = shouldRun;
          showcase.mainLoop?.('always');
        }
        if(heroRef?.current){
          const k = Math.min(1, self.progress / 0.05);
          heroRef.current.style.opacity = String(1 - k);
          heroRef.current.style.transform = `translateY(${-k*40}px)`;
          heroRef.current.style.visibility = k >= 1 ? 'hidden' : 'visible';
        }
      },
    });

    return ()=>{
      st.kill();
      gsap.ticker.remove(rafCb);
      lenis.destroy();
    };
  }, [segmentCount]);
}
