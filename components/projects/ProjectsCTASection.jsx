'use client';

import { useRouter } from 'next/navigation';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class, btnPrimaryClass, btnGhostClass } from '@/lib/ui/classNames.js';

export default function ProjectsCTASection(){
  const router = useRouter();
  return (
    <section id="projects-cta" className="relative overflow-hidden min-h-[60vh]">
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(225,27,35,0.1),transparent_70%)] animate-[cta-pulse_6s_ease-in-out_infinite]" />
      <div className={wrapClass}>
        <div className="text-center" data-reveal>
          <div className={`${eyebrowClass} justify-center`}><span className={eyebrowBarClass}></span>Your Site Is Next</div>
          <h2 className={`${h2Class} [font-size:clamp(32px,5.6vw,60px)] max-w-[820px] mx-auto`}>Let&apos;s Add Your Project to the List.</h2>
          <p className="mt-[18px] mx-auto max-w-[560px] text-brand-off text-[18px]">
            Tell us your site and scale — we&apos;ll come back with a configuration and a quote,
            usually within one business day.
          </p>
          <div className="flex gap-[16px] mt-[34px] flex-wrap justify-center">
            <button className={btnPrimaryClass} onClick={()=>router.push('/contact')}>Request a Quote</button>
            <button className={btnGhostClass} onClick={()=>router.push('/industries')}>See Industries We Serve</button>
          </div>
        </div>
      </div>
    </section>
  );
}
