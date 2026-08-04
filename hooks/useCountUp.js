'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Animates every [data-count-to] number inside containerRef once it enters the viewport.
export function useCountUp(containerRef){
  useEffect(()=>{
    const root = containerRef.current;
    if(!root) return;
    const nodes = Array.from(root.querySelectorAll('[data-count-to]'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.countTo);
        const suffix = el.dataset.suffix || '';
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: ()=>{ el.textContent = Math.round(proxy.val) + suffix; },
        });
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    nodes.forEach(n => io.observe(n));
    return ()=>io.disconnect();
  }, []);
}
