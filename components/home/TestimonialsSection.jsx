'use client';

import { useEffect, useState } from 'react';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

const testimonials = [
  {
    name: 'Rakesh Mehta',
    company: 'NH-27 Highway Works',
    photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    review: 'Site office cabins arrived fully finished and were operational within a day of delivery. Build quality is well above what we expected at this price.',
  },
  {
    name: 'Sunita Rao',
    company: 'Zenith Mining Co.',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    review: 'We needed a 40-bed labour camp on a tight deadline. Quad Cabins delivered on schedule and the units have held up through two monsoons.',
  },
  {
    name: 'Arvind Nair',
    company: 'Coastal Infra Ltd.',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    review: 'Customization was easy to work with — they adjusted the layout to fit our corridor site without any delay to the manufacturing timeline.',
  },
  {
    name: 'Deepak Sharma',
    company: 'Trackline Railways',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    review: 'Security cabins for our railway yard needed to survive extreme weather and constant vibration. Two years on, zero maintenance issues.',
  },
];

function Stars(){
  return (
    <div className="text-brand-yellow text-[16px] mb-[20px] tracking-[3px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

export default function TestimonialsSection(){
  const cms = useCmsSection('testimonials');
  const items = cms?.items?.length ? cms.items : testimonials;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeActive = active >= items.length ? 0 : active;
  const t = items[safeActive];

  useEffect(()=>{
    if (paused) return;
    const id = setInterval(()=>setActive(a => (a + 1) % items.length), 5000);
    return ()=>clearInterval(id);
  }, [paused, items.length]);

  const go = (dir)=>setActive(a => (a + dir + items.length) % items.length);

  return (
    <section id="testimonials" className="min-h-0 py-[110px] max-[900px]:py-[80px] max-[560px]:py-[64px]">
      <div
        className={`${wrapClass} flex items-center gap-[64px] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-0`}
        onMouseEnter={()=>setPaused(true)}
        onMouseLeave={()=>setPaused(false)}
      >
        <div className="flex-none [flex-basis:340px] max-[900px]:hidden">
          <div className="relative w-full">
            <div className="relative w-full overflow-hidden border border-brand-line aspect-[4/5] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <img key={t.photo?.url || t.photo} src={t.photo?.url || t.photo} alt={t.photo?.alt || t.name} className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.75)_brightness(0.8)_contrast(1.05)] animate-[t2-fade-in_0.5s_ease_both]" />
              {/* depth wash — replaces the old ::after pseudo-element */}
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.05)_0%,rgba(10,10,11,0.75)_100%)]" />
            </div>
            <span className="absolute z-2 font-anton text-brand-red leading-none left-[-6px] top-[-18px] text-[96px] [text-shadow:0_4px_18px_rgba(0,0,0,0.6)]">&ldquo;</span>
          </div>
          <div className="flex gap-[10px] mt-[16px]">
            {items.map((tt, i) => (
              <button
                key={tt.name}
                className={
                  'w-[52px] h-[52px] p-0 border cursor-pointer overflow-hidden transition-[opacity,border-color,transform] duration-[250ms] ease-in-out '
                  + (i === safeActive ? 'opacity-100 border-brand-red -translate-y-[3px]' : 'opacity-45 border-brand-line hover:opacity-75')
                }
                aria-label={`Show testimonial from ${tt.name}`}
                onClick={()=>setActive(i)}
              >
                <img className="w-full h-full object-cover [filter:saturate(0.6)_brightness(0.75)]" src={tt.photo?.url || tt.photo} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 max-[900px]:w-full">
          <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Client Testimonials'}</div>
          <h2 className={`${h2Class} mb-[28px] max-[900px]:mb-[22px]!`}>{cms?.heading || 'Trusted on site, project after project.'}</h2>

          <div className="animate-[t2-copy-in_0.5s_cubic-bezier(.2,.8,.2,1)_both]" key={safeActive}>
            <Stars />
            <p className="font-barlow-condensed text-[26px] leading-[1.5] text-brand-white max-w-[600px] mb-[26px] max-[900px]:text-[21px] max-[900px]:max-w-full max-[900px]:mb-[22px] max-[560px]:text-[19px]">{t.review}</p>
            <div className="flex items-center gap-[14px]">
              <img
                className="hidden max-[900px]:block w-[54px] h-[54px] max-[560px]:w-[48px] max-[560px]:h-[48px] flex-none rounded-full object-cover border-2 border-brand-red [filter:saturate(0.75)_brightness(0.85)] animate-[t2-fade-in_0.5s_ease_both]"
                src={t.photo?.url || t.photo}
                alt=""
              />
              <div>
                <div className="font-barlow-condensed font-bold uppercase text-[17px]">{t.name}</div>
                <div className="font-mono text-[12px] text-brand-steel mt-[4px]">{t.company}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[18px] mt-[40px] max-[900px]:w-full max-[900px]:gap-[14px] max-[560px]:mt-[26px]">
            <button
              className="w-[42px] h-[42px] rounded-full border border-brand-line flex-none text-brand-white text-[22px] leading-none cursor-pointer flex items-center justify-center transition-[background,border-color,transform] duration-200 ease-in-out bg-[rgba(10,10,11,0.6)] hover:bg-brand-red hover:border-brand-red hover:scale-[1.08] max-[560px]:w-[38px] max-[560px]:h-[38px] max-[560px]:text-[19px]"
              aria-label="Previous testimonial"
              onClick={()=>go(-1)}
            >
              &#8249;
            </button>
            <div className="flex gap-[8px] max-[900px]:flex-1 max-[900px]:justify-center max-[900px]:gap-[6px]">
              {items.map((tt, i) => (
                <button
                  key={tt.name}
                  className={'w-[32px] h-[4px] p-0 border-none cursor-pointer bg-brand-line relative overflow-hidden max-[900px]:flex-1 max-[900px]:max-w-[44px]'}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={()=>setActive(i)}
                >
                  <span
                    className="absolute inset-0 bg-brand-red w-0"
                    style={i === safeActive ? { animation: 't-fill 5s linear forwards', animationPlayState: paused ? 'paused' : 'running' } : undefined}
                  />
                </button>
              ))}
            </div>
            <button
              className="w-[42px] h-[42px] rounded-full border border-brand-line flex-none text-brand-white text-[22px] leading-none cursor-pointer flex items-center justify-center transition-[background,border-color,transform] duration-200 ease-in-out bg-[rgba(10,10,11,0.6)] hover:bg-brand-red hover:border-brand-red hover:scale-[1.08] max-[560px]:w-[38px] max-[560px]:h-[38px] max-[560px]:text-[19px]"
              aria-label="Next testimonial"
              onClick={()=>go(1)}
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
