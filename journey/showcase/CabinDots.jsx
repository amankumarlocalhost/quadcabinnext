'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { showcase } from './state.js';

const LABELS = ['Site Office', 'Labour', 'Conference', 'Storage'];

const MARK_INACTIVE = ['bg-brand-steel'];
const MARK_ACTIVE = ['bg-brand-red', 'shadow-[0_0_10px_var(--red)]'];
const LABEL_INACTIVE = ['text-brand-steel'];
const LABEL_ACTIVE = ['text-brand-white'];

export default function CabinDots({ categories, productsData }){
  const refs = useRef([]);
  const markRefs = useRef([]);
  const labelRefs = useRef([]);
  const productCategoryIds = new Set((productsData || []).map((product) => product.categoryId));
  const orderedCategories = (categories || []).filter((category) => productCategoryIds.has(category.id));
  const labels = orderedCategories.length
    ? orderedCategories.map((category) => category.name)
    : Array.isArray(productsData) ? productsData.map((product) => product.name || product.title)
    : LABELS;

  useEffect(()=>{
    const tick = ()=>{
      const active = Math.min(labels.length - 1, Math.max(0, Math.floor(showcase.p * labels.length)));
      refs.current.forEach((el, i)=>{
        if(!el) return;
        const isActive = i === active;
        el.classList.toggle('opacity-100', isActive);
        el.classList.toggle('opacity-40', !isActive);
        MARK_ACTIVE.forEach(c => markRefs.current[i]?.classList.toggle(c, isActive));
        MARK_INACTIVE.forEach(c => markRefs.current[i]?.classList.toggle(c, !isActive));
        LABEL_ACTIVE.forEach(c => labelRefs.current[i]?.classList.toggle(c, isActive));
        LABEL_INACTIVE.forEach(c => labelRefs.current[i]?.classList.toggle(c, !isActive));
      });
    };
    gsap.ticker.add(tick);
    return ()=>gsap.ticker.remove(tick);
  }, [labels.length]);

  return (
    <div className="fixed right-[34px] bottom-[30px] z-4 flex flex-col items-end gap-[11px] pointer-events-none max-[900px]:hidden">
      {labels.map((label, i)=>(
        <div
          className="flex items-center gap-[10px] opacity-40 transition-opacity duration-300 ease-in-out"
          key={label}
          ref={el=>refs.current[i]=el}
        >
          <span
            className="w-[7px] h-[7px] rounded-full bg-brand-steel transition-[background,box-shadow] duration-300 ease-in-out"
            ref={el=>markRefs.current[i]=el}
          />
          <span
            className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-brand-steel transition-colors duration-300 ease-in-out"
            ref={el=>labelRefs.current[i]=el}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
