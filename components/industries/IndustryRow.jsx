'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCountUp } from '@/hooks/useCountUp.js';
import {
  wrapClass, splitWrapClass, btnPrimaryClass,
  industryMediaClass, industryMediaImgClass, idxBadgeClass, industryCopyClass, industryH2Class, industryDescClass,
  industryTagsClass, industryTagClass, industryStatRowClass, industryStatNumClass, industryStatLabelClass,
  eyebrowClass, eyebrowBarClass,
} from '@/lib/ui/classNames.js';

export default function IndustryRow({ idx, name, img, imageAlt, tagline, desc, stat, tags, reverse, ctaLabelTemplate, even }){
  const router = useRouter();
  const statRef = useRef(null);
  useCountUp(statRef);

  return (
    <section className={`py-[78px] ${even ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_60%)]' : ''}`}>
      <div className={`${wrapClass} ${splitWrapClass} min-[901px]:flex-nowrap gap-[60px]! max-[900px]:flex-col max-[900px]:items-stretch ${reverse ? 'min-[901px]:flex-row-reverse' : ''}`}>
        <div className={industryMediaClass} data-reveal>
          <img className={industryMediaImgClass} src={img} alt={imageAlt || name} loading="lazy" />
          {/* depth wash — replaces the old ::after pseudo-element */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(10,10,11,0.05)_0%,rgba(10,10,11,0.6)_100%)]" />
          <span className={idxBadgeClass}>{idx} / 06</span>
        </div>
        <div className={industryCopyClass} data-reveal>
          <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{name}</div>
          <h2 className={industryH2Class}>{tagline}</h2>
          <p className={industryDescClass}>{desc}</p>

          <div className={industryTagsClass}>
            {tags.map(t => <span className={industryTagClass} key={t}>{t}</span>)}
          </div>

          <div className={industryStatRowClass} ref={statRef}>
            <div className={industryStatNumClass}>
              <span data-count-to={stat.value} data-suffix={stat.suffix}>0{stat.suffix}</span>
            </div>
            <div className={industryStatLabelClass}>{stat.label}</div>
          </div>

          <button className={btnPrimaryClass} onClick={()=>router.push('/contact')}>{ctaLabelTemplate ? ctaLabelTemplate.replace('{name}', name) : `Get a Quote for ${name}`}</button>
        </div>
      </div>
    </section>
  );
}
