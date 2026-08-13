'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import {
  pageHeroSectionClass, pageHeroBgClass, pageHeroBgOverlayClass, pageHeroCopyClass, pageHeroH1Class, pageHeroSubClass, pageHeroCtasClass,
  pageHeroFlexClass, wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass,
  trustStripClass, trustItemClass, trustNumClass, trustLabelClass,
  industriesHighlightsClass, industriesHighlightItemClass,
  industriesHeroVisualClass, industriesHeroFrameClass,
} from '@/lib/ui/classNames.js';

const trust = [
  { to: 6, suffix: '', label: 'Industries Served' },
  { to: 250, suffix: '+', label: 'Projects Delivered' },
  { to: 15, suffix: '+', label: 'States Covered' },
  { to: 99, suffix: '%', label: 'On-Time Delivery' },
];

export default function IndustriesHero({ data }){
  const router = useRouter();
  const legacy = useCmsSection('hero');
  const cms = data || legacy;
  const contentTrust = cms?.stats?.map((item) => ({ to:item.value, suffix:item.suffix, label:item.label })) || trust;
  const statsRef = useRef(null);
  useCountUp(statsRef);

  return (
    <section id="industries-hero" className={`${pageHeroSectionClass} pt-[78px] max-[900px]:pt-[100px]`}>
      <div
        className={pageHeroBgClass}
        data-parallax-bg
        style={{ backgroundImage: `url('${cms?.backgroundImage?.url || 'https://images.pexels.com/photos/12444957/pexels-photo-12444957.jpeg?auto=compress&cs=tinysrgb&w=1920'}')` }}
      >
        <div aria-hidden="true" className={pageHeroBgOverlayClass} />
      </div>
      {/* soft depth wash — replaces the old #industries-hero::before pseudo-element */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(46%_60%_at_16%_42%,rgba(225,27,35,0.055),transparent_70%),radial-gradient(55%_62%_at_84%_52%,rgba(232,180,0,0.045),transparent_72%)]" />
      <div className={`${wrapClass} ${pageHeroFlexClass}`}>
        <div className={`${pageHeroCopyClass} max-w-[clamp(440px,42vw,600px)] max-[900px]:max-w-full`}>
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Industries We Serve'}</div>
          <h1 className={pageHeroH1Class} data-rise>{cms?.heading ? <>{cms.heading.split(cms.highlightedText || 'Engineered')[0]}<span className="text-brand-red">{cms.highlightedText || 'Engineered'}</span>{cms.heading.split(cms.highlightedText || 'Engineered')[1]}</> : <>Built for Every Site. <span className="text-brand-red">Engineered</span> for Every Sector.</>}</h1>
          <p className={pageHeroSubClass} data-rise>
            {cms?.description || "Six sectors, one manufacturing standard. Whatever your site throws at it, there's a Quad Cabins unit already built to take it — and a factory ready to ship the next one."}
          </p>
          <div className={pageHeroCtasClass} data-rise>
            <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/products')}>{cms?.primaryCta?.label || 'See Our Cabins'}</button>
            <button className={btnGhostClass} onClick={()=>router.push(cms?.secondaryCta?.href || '/contact')}>{cms?.secondaryCta?.label || 'Get a Quote'}</button>
          </div>

          <div className={trustStripClass} data-rise ref={statsRef}>
            {contentTrust.map(t => (
              <div className={trustItemClass} key={t.label}>
                <div className={trustNumClass}><span data-count-to={t.to} data-suffix={t.suffix}>0{t.suffix}</span></div>
                <div className={trustLabelClass}>{t.label}</div>
              </div>
            ))}
          </div>

          <ul className={industriesHighlightsClass} data-rise>
            <li className={industriesHighlightItemClass}>One factory standard across all six sectors</li>
            <li className={industriesHighlightItemClass}>Engineered for terrain, load and climate on-site</li>
            <li className={industriesHighlightItemClass}>Same cabin platform, sector-specific fit-out</li>
          </ul>
        </div>

        <div className={industriesHeroVisualClass} data-rise>
          <div aria-hidden="true" className="absolute -z-1 pointer-events-none [inset:-16%] bg-[radial-gradient(58%_58%_at_50%_55%,rgba(225,27,35,0.14),transparent_68%)] blur-[6px]" />
          <div className={industriesHeroFrameClass}>
            <img src="/images/industries-hero-cabin.png" alt="Quad Cabins site office cabin" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      <div className={scrollCueClass}><span>Scroll</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
