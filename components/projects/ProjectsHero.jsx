'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp.js';
import {
  pageHeroSectionClass, pageHeroBgClass, pageHeroBgOverlayClass, pageHeroCopyClass, pageHeroH1Class, pageHeroSubClass, pageHeroCtasClass,
  wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass,
  trustStripClass, trustItemClass, trustNumClass, trustLabelClass,
} from '@/lib/ui/classNames.js';

const trust = [
  { to: 250, suffix: '+', label: 'Projects Delivered' },
  { to: 15, suffix: '+', label: 'States Covered' },
  { to: 40, suffix: '+', label: 'Repeat Clients' },
  { to: 7, suffix: 'd', label: 'Avg. Dispatch Time' },
];

export default function ProjectsHero(){
  const router = useRouter();
  const statsRef = useRef(null);
  useCountUp(statsRef);

  return (
    <section id="projects-hero" className={pageHeroSectionClass}>
      <div
        className={pageHeroBgClass}
        data-parallax-bg
        style={{ backgroundImage: "url('https://images.pexels.com/photos/13774993/pexels-photo-13774993.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
      >
        <div aria-hidden="true" className={pageHeroBgOverlayClass} />
      </div>
      <div className={wrapClass}>
        <div className={pageHeroCopyClass}>
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>Delivered &amp; Deployed</div>
          <h1 className={pageHeroH1Class} data-rise>Real Sites. <span className="text-brand-red">Real Cabins.</span> Real Fast.</h1>
          <p className={pageHeroSubClass} data-rise>
            From highway corridors to mining camps, here&apos;s a look at where our cabins have already
            landed — craned in, connected, and working from day one.
          </p>
          <div className={pageHeroCtasClass} data-rise>
            <button className={btnPrimaryClass} onClick={()=>router.push('/contact')}>Start Your Project</button>
            <button className={btnGhostClass} onClick={()=>router.push('/products')}>Explore Products</button>
          </div>

          <div className={trustStripClass} data-rise ref={statsRef}>
            {trust.map(t => (
              <div className={trustItemClass} key={t.label}>
                <div className={trustNumClass}><span data-count-to={t.to} data-suffix={t.suffix}>0{t.suffix}</span></div>
                <div className={trustLabelClass}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={scrollCueClass}><span>Scroll</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
