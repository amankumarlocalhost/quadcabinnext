'use client';

import { useEffect, useRef } from 'react';
import { projects } from '@/lib/data/projects.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, sectionClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

export default function ProjectsSection(){
  const cms = useCmsSection('projects');
  const items = cms?.items || projects;
  const trackRef = useRef(null);

  const scrollByCard = (dir)=>{
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 14 : 300;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    if (dir > 0 && atEnd){
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step * dir, behavior: 'smooth' });
    }
  };

  useEffect(()=>{
    const id = setInterval(()=>scrollByCard(1), 3800);
    return ()=>clearInterval(id);
  }, []);

  return (
    <section id="projects" className={sectionClass}>
      <div className={`${wrapClass} flex-col items-start`}>
        <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'DELIVERED & DEPLOYED'}</div>
        <h2 className={`${h2Class} [font-size:clamp(32px,5vw,58px)] mb-[44px]`}>{cms?.heading || 'Projects & Gallery'}</h2>

        <div className="relative w-full">
          <div
            className="flex w-full overflow-x-auto gap-[14px] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] p-[2px_2px_6px] [mask-image:linear-gradient(90deg,transparent_0,#000_3%,#000_97%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0,#000_3%,#000_97%,transparent_100%)] [&::-webkit-scrollbar]:hidden"
            ref={trackRef}
          >
            {items.map(({ tag, label, img, image }) => (
              <div
                className="group relative flex-none border border-brand-line overflow-hidden w-[300px] max-[640px]:w-[230px] max-[576px]:w-[min(72vw,260px)] max-[480px]:w-[200px] max-[320px]:w-[170px] aspect-[3/4] [scroll-snap-align:start] [background:linear-gradient(155deg,var(--charcoal)_0%,#0d0d0e_60%)] shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                key={tag}
                data-reveal-gcard
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.7)_brightness(0.72)_contrast(1.06)] scale-[1.05] transition-[transform,filter] duration-[600ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.14] group-hover:[filter:saturate(0.95)_brightness(0.82)_contrast(1.08)]"
                  src={image?.url || img}
                  alt={image?.alt || label}
                  loading="lazy"
                />
                {/* depth wash — replaces the old ::before pseudo-element */}
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.05)_0%,rgba(10,10,11,0.9)_100%)]" />
                <span className="absolute top-[14px] left-[14px] font-mono text-[11px] text-brand-red z-1">{tag}</span>
                <span className="absolute left-[14px] bottom-[14px] font-mono text-[11px] tracking-[0.08em] text-brand-off uppercase z-1">{label}</span>
              </div>
            ))}
          </div>
          <button
            className="absolute top-1/2 -translate-y-1/2 z-2 rounded-full border border-brand-line text-brand-white text-[24px] leading-none cursor-pointer flex items-center justify-center transition-[background,border-color,transform] duration-200 ease-in-out w-[44px] h-[44px] bg-[rgba(10,10,11,0.75)] backdrop-blur-[8px] -left-[6px] hover:bg-brand-red hover:border-brand-red hover:[transform:translateY(-50%)_scale(1.08)] max-[640px]:w-[36px] max-[640px]:h-[36px] max-[640px]:text-[18px]"
            aria-label="Previous project"
            onClick={()=>scrollByCard(-1)}
          >
            &#8249;
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 z-2 rounded-full border border-brand-line text-brand-white text-[24px] leading-none cursor-pointer flex items-center justify-center transition-[background,border-color,transform] duration-200 ease-in-out w-[44px] h-[44px] bg-[rgba(10,10,11,0.75)] backdrop-blur-[8px] -right-[6px] hover:bg-brand-red hover:border-brand-red hover:[transform:translateY(-50%)_scale(1.08)] max-[640px]:w-[36px] max-[640px]:h-[36px] max-[640px]:text-[18px]"
            aria-label="Next project"
            onClick={()=>scrollByCard(1)}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
