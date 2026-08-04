'use client';

import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass, h1Class } from '@/lib/ui/classNames.js';

export default function Hero({ heroRef, onGoTo }){
  const cms = useCmsSection('hero');
  return (
    <div
      data-hero-overlay
      className="fixed inset-0 z-12 pointer-events-none flex items-center will-change-[opacity,transform] max-[900px]:items-start"
      ref={heroRef}
    >
      <div className={`${wrapClass} flex flex-col items-start justify-center h-screen pt-[60px] max-[900px]:justify-start max-[900px]:pt-[100px]`}>
        <div className={`${eyebrowClass} opacity-0`} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'FACTORY-BUILT · SITE-READY'}</div>
        <h1
          data-rise
          className={`${h1Class} opacity-0 [font-size:clamp(34px,7.8vw,74px)] max-w-[900px] max-[480px]:[font-size:clamp(34px,10vw,48px)] max-[320px]:[font-size:clamp(28px,11vw,40px)]`}
        >
          {cms?.heading ? <>{cms.heading.split(cms.highlightedText || 'Stronger')[0]}<br /><span className="text-brand-red">{cms.highlightedText || 'Stronger'}</span>{cms.heading.split(cms.highlightedText || 'Stronger')[1]}</> : <>Smart Spaces.<br /><span className="text-brand-red">Stronger</span> Projects.</>}
        </h1>
        <p
          data-rise
          className="opacity-0 text-[18px] text-brand-off max-w-[460px] mt-[22px] [text-shadow:0_2px_18px_rgba(0,0,0,0.8)] max-[900px]:text-[15.5px] max-[480px]:text-[15px] max-[480px]:max-w-full"
        >
          {cms?.description || 'Quad Cabins engineers portable and modular cabins for construction, industrial and infrastructure sites across India — built in the factory, delivered ready to work.'}
        </p>
        <div data-hero-ctas data-rise className="opacity-0 pointer-events-auto flex gap-[16px] mt-[34px] flex-wrap">
          <button className={btnPrimaryClass} onClick={()=>onGoTo(cms?.primaryCta?.target || '#contact')}>{cms?.primaryCta?.label || 'Get a Free Quote'}</button>
          <button className={btnGhostClass} onClick={()=>onGoTo(cms?.secondaryCta?.target || '#site-office')}>{cms?.secondaryCta?.label || 'Explore Products'}</button>
        </div>
      </div>
      <div data-rise className={`${scrollCueClass} opacity-0`}><span>{cms?.scrollLabel || 'Scroll to step inside'}</span><span className={scrollCueLineClass}></span></div>
    </div>
  );
}
