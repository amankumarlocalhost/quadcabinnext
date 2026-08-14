'use client';

import { useRouter } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import {
  pageHeroSectionClass, h1Class,
  wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass,
  industriesHighlightsClass, industriesHighlightItemClass,
} from '@/lib/ui/classNames.js';

export default function IndustriesHero({ data }){
  const router = useRouter();
  const legacy = useCmsSection('hero');
  const cms = data || legacy;

  return (
    <section id="industries-hero" className={`${pageHeroSectionClass} bg-brand-black pt-[78px] max-[900px]:pt-[100px] max-[900px]:min-h-0`}>
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_38%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.65)_brightness(0.58)_contrast(1.08)]"
        data-parallax-bg
        style={{ backgroundImage: `url('${cms?.backgroundImage?.url || 'https://images.pexels.com/photos/12444957/pexels-photo-12444957.jpeg?auto=compress&cs=tinysrgb&w=1920'}')` }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.72)_38%,rgba(5,5,5,0.32)_68%,rgba(5,5,5,0.78)_100%),linear-gradient(180deg,rgba(5,5,5,0.42)_0%,rgba(5,5,5,0.06)_28%,rgba(5,5,5,0.88)_100%)]" />
      </div>

      {/* subtle blueprint grid — extremely low-opacity technical texture */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(247,247,245,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(247,247,245,0.6)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(60%_70%_at_50%_40%,black,transparent)]" />
      {/* soft depth wash */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(46%_60%_at_16%_42%,rgba(225,27,35,0.07),transparent_70%),radial-gradient(55%_62%_at_84%_52%,rgba(225,27,35,0.05),transparent_72%)]" />

      <div className={`${wrapClass} relative flex items-center justify-between gap-[clamp(24px,3vw,48px)] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-[36px] max-[900px]:py-[40px]`}>
        <div className="relative z-2 max-w-[clamp(440px,42vw,600px)] max-[900px]:max-w-full">
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Industries We Serve'}</div>
          <h1 className={`${h1Class} [font-size:clamp(30px,5.6vw,54px)] mt-[12px]`} data-rise>
            {cms?.heading ? (
              <>{cms.heading.split(cms.highlightedText || 'Engineered')[0]}<span className="text-brand-red">{cms.highlightedText || 'Engineered'}</span>{cms.heading.split(cms.highlightedText || 'Engineered')[1]}</>
            ) : (
              <>Built for Every <span className="text-brand-red">Industry</span>.<br />Engineered for Every <span className="text-brand-red">Site</span>.</>
            )}
          </h1>
          <div aria-hidden="true" className="relative h-[3px] w-[220px] max-w-full mt-[14px] mb-[3px] bg-gradient-to-r from-brand-red via-brand-red to-transparent" data-rise>
            <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-brand-red/70 blur-lg" />
          </div>
          <p className="text-[17px] text-brand-off max-w-[clamp(380px,42vw,560px)] mt-[14px]" data-rise>
            {cms?.description || 'From construction and infrastructure to mining, manufacturing, and corporate projects, our modular cabins are engineered to deliver reliable space wherever your business operates.'}
          </p>
          <div className="flex gap-[16px] mt-[24px] flex-wrap" data-rise>
            <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/products')}>{cms?.primaryCta?.label || 'Explore Our Cabins'}</button>
            <button className={btnGhostClass} onClick={()=>router.push(cms?.secondaryCta?.href || '/contact')}>{cms?.secondaryCta?.label || 'Get a Free Quote'}</button>
          </div>

          <ul className={industriesHighlightsClass} data-rise>
            <li className={industriesHighlightItemClass}>One factory standard across all six sectors</li>
            <li className={industriesHighlightItemClass}>Engineered for terrain, load and climate on-site</li>
            <li className={industriesHighlightItemClass}>Same cabin platform, sector-specific fit-out</li>
          </ul>
        </div>

        {/* Right: cabin visual — held static with a soft ground shadow; only the
            outer wrapper carries the one-shot entrance fade/scale. */}
        <div
          aria-hidden="true"
          className="relative hidden min-[901px]:block shrink-0 w-[50vw] max-w-[720px] min-w-[340px] -mr-[3vw] max-[1200px]:mr-0 max-[1024px]:w-[40vw] max-[1024px]:min-w-[300px] animate-[t2-copy-in_0.9s_ease_both] [animation-delay:150ms]"
        >
          <div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[76%] h-[26px] rounded-full bg-black/60 blur-2xl" />
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(225,27,35,0.16),transparent_72%)] blur-2xl" />
          <img
            src="/images/cabin-industries-hero.png"
            alt="Quad Cabins two-storey modular unit"
            className="relative w-full h-auto object-contain [mask-image:radial-gradient(72%_78%_at_50%_48%,black_58%,transparent_100%)] [-webkit-mask-image:radial-gradient(72%_78%_at_50%_48%,black_58%,transparent_100%)] [filter:brightness(0.72)_contrast(1.05)_drop-shadow(0_36px_54px_rgba(0,0,0,0.65))]"
          />
        </div>

        {/* Mobile cabin visual — simplified, no floating cards */}
        <div className="min-[901px]:hidden relative w-full max-w-[420px] mx-auto animate-[t2-copy-in_0.8s_ease_both] [animation-delay:100ms]">
          <div className="absolute left-1/2 bottom-[4%] -translate-x-1/2 w-[70%] h-[18px] rounded-full bg-black/55 blur-xl" />
          <img
            src="/images/cabin-industries-hero.png"
            alt="Quad Cabins two-storey modular unit"
            className="relative w-full h-auto object-contain [mask-image:radial-gradient(72%_78%_at_50%_48%,black_58%,transparent_100%)] [-webkit-mask-image:radial-gradient(72%_78%_at_50%_48%,black_58%,transparent_100%)] [filter:brightness(0.72)_contrast(1.05)_drop-shadow(0_24px_36px_rgba(0,0,0,0.6))]"
          />
        </div>
      </div>
      <div className={`${scrollCueClass} max-[900px]:hidden`}><span>Scroll</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
