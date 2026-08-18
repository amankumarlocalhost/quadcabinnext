'use client';

import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass, h1Class } from '@/lib/ui/classNames.js';

// Static hero — no 3D canvas. Copy on the left, the cabin photo held as a
// contained, framed image on the right (not stretched as a background),
// matching the split layout used on the Contact page hero.
export default function Hero({ onGoTo }){
  const cms = useCmsSection('hero');
  return (
    <section id="home-hero" className="relative overflow-hidden min-h-screen bg-brand-black flex items-center max-[900px]:items-start">
      {/* Atmospheric backdrop photo — the same site-bg.jpg that used to sit
          behind the 3D cabin canvas, kept here so the hero still has that
          backdrop even though the canvas itself is gone. */}
      <div
        aria-hidden="true"
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_38%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.72)_brightness(0.6)_contrast(1.04)] bg-[url('/images/site-bg.jpg')]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.55)_42%,rgba(5,5,5,0.4)_65%,rgba(5,5,5,0.6)_100%),linear-gradient(180deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.35)_26%,rgba(5,5,5,0.3)_55%,rgba(5,5,5,0.92)_100%)]"
        />
      </div>
      {/* subtle blueprint grid — same low-opacity technical texture as the other page heroes */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(247,247,245,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(247,247,245,0.6)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(60%_70%_at_36%_45%,black,transparent)]" />
      {/* soft depth wash behind the copy and the cabin photo */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(46%_60%_at_16%_42%,rgba(225,27,35,0.08),transparent_70%),radial-gradient(50%_60%_at_84%_46%,rgba(255,190,120,0.08),transparent_70%)]" />

      <div className={`${wrapClass} relative z-2 grid grid-cols-1 min-[901px]:[grid-template-columns:minmax(0,0.94fr)_minmax(0,1.06fr)] gap-[32px] min-[901px]:gap-[clamp(24px,3.5vw,56px)] items-center pt-[110px] pb-[40px] min-[901px]:pb-[64px]`}>
        <div>
          <div className={`${eyebrowClass} opacity-0`} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'FACTORY-BUILT · SITE-READY'}</div>
          <h1
            data-rise
            className={`${h1Class} opacity-0 [font-size:clamp(34px,6.4vw,66px)] max-[480px]:[font-size:clamp(34px,10vw,48px)] max-[320px]:[font-size:clamp(28px,11vw,40px)]`}
          >
            {cms?.heading ? <>{cms.heading.split(cms.highlightedText || 'Stronger')[0]}<br /><span className="text-brand-red">{cms.highlightedText || 'Stronger'}</span>{cms.heading.split(cms.highlightedText || 'Stronger')[1]}</> : <>Smart Spaces.<br /><span className="text-brand-red">Stronger</span> Projects.</>}
          </h1>
          <p
            data-rise
            className="opacity-0 text-[18px] text-brand-off max-w-[480px] mt-[22px] max-[900px]:text-[15.5px] max-[480px]:text-[15px] max-[480px]:max-w-full"
          >
            {cms?.description || 'Quad Cabins engineers portable and modular cabins for construction, industrial and infrastructure sites across India — built in the factory, delivered ready to work.'}
          </p>
          <div data-hero-ctas data-rise className="opacity-0 flex gap-[16px] mt-[34px] flex-wrap">
            <button className={btnPrimaryClass} onClick={()=>onGoTo(cms?.primaryCta?.target || '#contact')}>{cms?.primaryCta?.label || 'Get a Free Quote'}</button>
            <button className={btnGhostClass} onClick={()=>onGoTo(cms?.secondaryCta?.target || '#site-office')}>{cms?.secondaryCta?.label || 'Explore Products'}</button>
          </div>
        </div>

        {/* Cabin photo — contained and framed, not a background */}
        <div className="relative opacity-0" data-rise>
          <div aria-hidden="true" className="absolute left-1/2 bottom-[3%] -translate-x-1/2 w-[82%] h-[30px] rounded-full bg-black/60 blur-2xl" />
          <img
            src="/images/home-hero-bg.png"
            alt="Quad Cabins modular site office cabin"
            className="relative w-full h-auto rounded-[10px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] [filter:saturate(0.85)_brightness(0.8)_contrast(1.05)]"
          />
        </div>
      </div>
      <div data-rise className={`${scrollCueClass} opacity-0 max-[900px]:hidden`}><span>{cms?.scrollLabel || 'Scroll to explore'}</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
