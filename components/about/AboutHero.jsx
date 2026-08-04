'use client';

import { useRouter } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import {
  pageHeroSectionClass, pageHeroCopyClass, pageHeroH1Class, pageHeroSubClass, pageHeroCtasClass,
  wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass,
} from '@/lib/ui/classNames.js';

export default function AboutHero({ onGoTo }){
  const router = useRouter();
  const cms = useCmsSection('hero');
  return (
    <section id="about-hero" className={pageHeroSectionClass}>
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_42%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.7)_brightness(0.55)_contrast(1.05)] bg-[url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600')]"
        data-parallax-bg
        style={cms?.backgroundImage?.url ? { backgroundImage:`url('${cms.backgroundImage.url}')` } : undefined}
      >
        {/* depth wash — replaces the old ::after pseudo-element */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.55)_45%,rgba(5,5,5,0.35)_70%,rgba(5,5,5,0.75)_100%),linear-gradient(180deg,rgba(5,5,5,0.4)_0%,rgba(5,5,5,0.15)_30%,rgba(5,5,5,0.9)_100%)]" />
      </div>
      <div className={wrapClass}>
        <div className={pageHeroCopyClass}>
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'About Quad Cabins'}</div>
          <h1 className={pageHeroH1Class} data-rise>{cms?.heading ? <>{cms.heading.split(cms.highlightedText || 'Portable Spaces')[0]}<span className="text-brand-red">{cms.highlightedText || 'Portable Spaces'}</span>{cms.heading.split(cms.highlightedText || 'Portable Spaces')[1]}</> : <>Building Smart <span className="text-brand-red">Portable Spaces</span> for Every Business</>}</h1>
          <p className={pageHeroSubClass} data-rise>
            {cms?.description || "We design and manufacture premium portable and modular cabins for India's toughest project sites — engineered in the factory, delivered ready to work."}
          </p>
          <div className={pageHeroCtasClass} data-rise>
            <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/products')}>{cms?.primaryCta?.label || 'Explore Products'}</button>
            <button className={btnGhostClass} onClick={()=>onGoTo(cms?.secondaryCta?.target || '#about-cta')}>{cms?.secondaryCta?.label || 'Contact Us'}</button>
          </div>
        </div>
      </div>
      <div className={scrollCueClass}><span>Scroll</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
