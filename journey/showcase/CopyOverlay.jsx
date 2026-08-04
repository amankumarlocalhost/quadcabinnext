'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { showcase, mapRange, smootherstep } from './state.js';
import { products } from '@/lib/data/products.js';

const PANELS = [
  {
    model: 'MODEL 01 / SO-SERIES',
    title: 'Site Office Cabin',
    desc: "A fully equipped mobile office for your project's command centre — wired, insulated and ready to plug in the moment it lands on site.",
    specs: ['Factory manufactured', 'Fast site delivery', 'Weatherproof & durable', 'Fully customizable'],
  },
  ...products.map(p => ({ model: p.model, title: p.title, desc: p.desc, specs: p.specs })),
];

export default function CopyOverlay({ onGoTo, productsData }){
  const panels = Array.isArray(productsData) ? productsData.map((p) => ({
    model:p.modelNumber || p.model, title:p.title, desc:p.description || p.desc,
    specs:p.features || p.specs || [], button:p.button,
  })) : PANELS;
  const refs = useRef([]);

  useEffect(()=>{
    const tick = ()=>{
      for(let i=0;i<panels.length;i++){
        const el = refs.current[i];
        if(!el) continue;
        const raw = showcase.p * panels.length - i;
        // Unlike the 3D models (which cross-dissolve for a cinematic handoff),
        // adjacent text panels must never both be partially visible at once —
        // overlapping copy reads as a garbled mess. So each panel's window is
        // kept entirely inside its own [0,1] segment with a quick in/out fade,
        // never bleeding into the neighbouring segment.
        // Cabin 0 additionally waits for the hero intro to finish fading.
        const rise = i === 0
          ? smootherstep(mapRange(raw, 0.03, 0.22))
          : smootherstep(mapRange(raw, 0, 0.12));
        const fall = smootherstep(mapRange(raw, 0.88, 1.0));
        const visible = rise * (1 - fall);
        el.style.opacity = visible.toFixed(3);
        el.style.visibility = visible > 0.01 ? 'visible' : 'hidden';
        // `transform` is set imperatively here every frame, so the panel's
        // vertical centering is authored as a plain inline style (not a
        // Tailwind translate-y utility) below — a class-based transform
        // would just get clobbered by this same assignment anyway, but
        // keeping the base state in inline `style` makes that explicit.
        el.style.transform = `translateY(${((1-visible)*28).toFixed(1)}px)`;
      }
    };
    gsap.ticker.add(tick);
    return ()=>gsap.ticker.remove(tick);
  }, [panels.length]);

  return (
    <div className="fixed inset-0 z-3 pointer-events-none max-[900px]:z-41">
      {panels.map((p, i)=>(
        <div
          className="absolute left-[34px] top-1/2 opacity-0 invisible pointer-events-auto will-change-[opacity,transform] border border-brand-line border-l-[3px] border-l-brand-red max-w-[460px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] bg-[rgba(230,230,228,0.92)] backdrop-blur-[10px] p-10 text-[#111]
            max-[900px]:left-[12px] max-[900px]:right-[12px] max-[900px]:top-auto max-[900px]:bottom-[12px] max-[900px]:max-w-full max-[900px]:p-[18px_18px_16px] max-[900px]:max-h-[48vh] max-[900px]:overflow-y-auto max-[900px]:border-l-0 max-[900px]:border-t-[3px] max-[900px]:border-t-brand-red max-[900px]:rounded-xl max-[900px]:shadow-[0_-18px_50px_-18px_rgba(0,0,0,0.75)]"
          key={i}
          ref={el=>refs.current[i]=el}
          style={{ transform: 'translateY(-50%)' }}
        >
          {/* accent bar — real element replacing the old ::before pseudo-element */}
          <span aria-hidden="true" className="absolute top-0 -left-[3px] w-[3px] h-[56px] bg-gradient-to-b from-brand-red to-transparent max-[900px]:hidden" />
          <div className="font-mono text-[12px] text-[#111] tracking-[0.1em] mb-[8px] max-[900px]:mb-[6px]">{p.model}</div>
          <h2 className="font-barlow-condensed font-bold tracking-[0.01em] uppercase leading-[0.95] text-[#111] [font-size:clamp(28px,3.8vw,46px)] mb-[14px] max-[900px]:text-[24px] max-[900px]:mb-[8px]">{p.title}</h2>
          <p className="text-[#111] text-[15.5px] leading-[1.6] mb-[22px] max-[900px]:text-[13.5px] max-[900px]:leading-[1.5] max-[900px]:mb-[14px]">{p.desc}</p>
          <ul className="list-none grid mb-[8px] [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-3.5 max-[900px]:grid-cols-2 max-[900px]:gap-x-[14px] max-[900px]:gap-y-2 max-[900px]:mb-[14px]">
            {p.specs.map(s => (
              <li key={s} className="font-barlow-condensed text-[15px] font-semibold tracking-[0.02em] text-[#111] flex items-center gap-[9px] uppercase max-[900px]:text-[12.5px] max-[900px]:gap-[7px] before:content-[''] before:w-[8px] before:h-[8px] before:bg-brand-red before:flex-none">
                {s}
              </li>
            ))}
          </ul>
          <button
            className="font-barlow-condensed font-bold text-[15px] tracking-[0.08em] uppercase cursor-pointer border-2 transition-all duration-[220ms] ease-in-out inline-flex items-center gap-[10px] p-[16px_30px] border-[#111] text-[#111] bg-transparent transition-[transform,background,color] hover:bg-[#111] hover:text-[#f7f7f5] hover:-translate-y-0.5 max-[900px]:p-[12px_20px] max-[900px]:text-[13px]"
            onClick={() => {
              const link = p.button?.link || '#contact';
              if (link.startsWith('#')) onGoTo(link);
              else window.location.href = link;
            }}
          >
            {p.button?.text || 'Enquire About This Cabin'}
          </button>
        </div>
      ))}
    </div>
  );
}
