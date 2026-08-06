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
        // Panel is bottom-anchored (`bottom: clamp(...)` in the className,
        // not vertically centered), so this fade-in slide is a plain
        // translateY — no -50% centering offset to preserve.
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
          className="absolute left-[34px] bottom-[clamp(20px,6vh,64px)] opacity-0 invisible pointer-events-auto will-change-[opacity,transform] overflow-y-auto overflow-x-hidden rounded-[10px] max-w-[460px] max-h-[80vh] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.55)] bg-[rgba(247,247,245,0.96)] backdrop-blur-[18px] border border-black/8 p-[32px_36px] text-[#111]
            max-[900px]:left-[12px] max-[900px]:right-[12px] max-[900px]:bottom-[12px] max-[900px]:max-w-full max-[900px]:p-[18px_18px_16px] max-[900px]:max-h-[50vh] max-[900px]:rounded-2xl max-[900px]:shadow-[0_-18px_50px_-18px_rgba(0,0,0,0.5)]"
          key={i}
          ref={el=>refs.current[i]=el}
        >
          {/* ghost index numeral, bleeding off the top-right corner */}
          <span aria-hidden="true" className="absolute -top-[0.22em] -right-[0.06em] font-anton leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(0,0,0,0.07)] text-[120px] pointer-events-none select-none max-[900px]:text-[80px]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(60%_50%_at_0%_0%,rgba(225,27,35,0.07),transparent_70%)]" />
          {/* left accent rail */}
          <span aria-hidden="true" className="absolute left-0 top-[28px] bottom-[28px] w-[3px] bg-gradient-to-b from-brand-red via-brand-red to-transparent max-[900px]:hidden" />

          <div className="flex items-center gap-[10px] mb-[16px] max-[900px]:mb-[8px]">
            <span className="font-anton text-brand-red text-[14px] leading-none">{String(i + 1).padStart(2, '0')}</span>
            <span className="h-px flex-1 bg-black/12" />
            <span className="font-mono text-[10.5px] text-[#555] tracking-[0.14em] uppercase">{p.model}</span>
          </div>

          <h2 className="font-barlow-condensed font-bold tracking-[0.01em] uppercase leading-[0.95] text-[#111] [font-size:clamp(26px,3.4vw,40px)] mb-[12px] max-[900px]:text-[22px] max-[900px]:mb-[8px]">{p.title}</h2>
          <p className="text-[#333] text-[14.5px] leading-[1.55] mb-[18px] max-[900px]:text-[13px] max-[900px]:leading-[1.5] max-[900px]:mb-[12px]">{p.desc}</p>

          <div className="flex flex-wrap gap-[8px] mb-[22px] max-[900px]:gap-[6px] max-[900px]:mb-[14px]">
            {p.specs.map(s => (
              <span key={s} className="font-mono text-[10px] font-medium tracking-[0.05em] text-[#444] uppercase border border-black/12 rounded-full px-[12px] py-[6px] bg-black/[0.02] max-[900px]:text-[9.5px] max-[900px]:px-[10px] max-[900px]:py-[5px]">
                {s}
              </span>
            ))}
          </div>

          <button
            className="group relative font-barlow-condensed font-bold text-[13px] tracking-[0.08em] uppercase cursor-pointer rounded-[6px] bg-[#111] text-[#f7f7f5] transition-all duration-[220ms] ease-out inline-flex items-center gap-[10px] p-[13px_26px] hover:bg-brand-red hover:text-brand-white hover:-translate-y-[2px] hover:shadow-[0_16px_34px_-14px_rgba(225,27,35,0.5)] active:scale-[0.97] max-[900px]:p-[11px_18px] max-[900px]:text-[12px]"
            onClick={() => {
              const link = p.button?.link || '#contact';
              if (link.startsWith('#')) onGoTo(link);
              else window.location.href = link;
            }}
          >
            {p.button?.text || 'Enquire About This Cabin'}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-[3px]">→</span>
          </button>
        </div>
      ))}
    </div>
  );
}
