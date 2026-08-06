'use client';

import { useRouter } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class, btnPrimaryClass, btnGhostClass } from '@/lib/ui/classNames.js';

export default function IndustriesCTASection({ data }){
  const router = useRouter();
  const legacy = useCmsSection('cta');
  const cms = data || legacy;
  return (
    <section id="industries-cta" className="relative overflow-hidden min-h-[60vh]">
      {/* pulsing radial glow — replaces the old ::before pseudo-element */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(225,27,35,0.1),transparent_70%)] animate-[cta-pulse_6s_ease-in-out_infinite]" />
      <div className={wrapClass}>
        <div className="text-center" data-reveal>
          <div className={`${eyebrowClass} justify-center`}><span className={eyebrowBarClass}></span>{cms?.eyebrow || "Don't See Your Sector?"}</div>
          <h2 className={`${h2Class} [font-size:clamp(32px,5.6vw,60px)] max-w-[clamp(600px,64vw,820px)] mx-auto`}>{cms?.heading || "We'll Still Build For It."}</h2>
          <p className="mt-[18px] mx-auto max-w-[clamp(360px,44vw,560px)] text-brand-off text-[18px]">
            {cms?.description || "Every cabin we ship starts as a custom spec conversation. Tell us your industry, your site conditions and your timeline — we'll configure a build around it."}
          </p>
          <div className="flex gap-[16px] mt-[34px] flex-wrap justify-center">
            <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/contact')}>{cms?.primaryCta?.label || 'Request a Quote'}</button>
            <button className={btnGhostClass} onClick={()=>router.push(cms?.secondaryCta?.href || '/products')}>{cms?.secondaryCta?.label || 'Browse Cabins'}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
