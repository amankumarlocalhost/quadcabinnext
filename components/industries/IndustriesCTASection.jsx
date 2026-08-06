'use client';

import { useRouter } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import CTAIntro from '@/components/shared/CTAIntro.jsx';
import { btnPrimaryClass, btnGhostClass } from '@/lib/ui/classNames.js';

export default function IndustriesCTASection({ data }){
  const router = useRouter();
  const legacy = useCmsSection('cta');
  const cms = data || legacy;
  return (
    <CTAIntro
      id="industries-cta"
      eyebrow={cms?.eyebrow || "Don't See Your Sector?"}
      heading={cms?.heading || "We'll Still Build For It."}
      description={cms?.description || "Every cabin we ship starts as a custom spec conversation. Tell us your industry, your site conditions and your timeline — we'll configure a build around it."}
      headingMaxWidthClass="max-w-[clamp(600px,64vw,820px)]"
      descMaxWidthClass="max-w-[clamp(360px,44vw,560px)]"
    >
      <div className="flex gap-[16px] mt-[34px] flex-wrap justify-center">
        <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/contact')}>{cms?.primaryCta?.label || 'Request a Quote'}</button>
        <button className={btnGhostClass} onClick={()=>router.push(cms?.secondaryCta?.href || '/products')}>{cms?.secondaryCta?.label || 'Browse Cabins'}</button>
      </div>
    </CTAIntro>
  );
}
