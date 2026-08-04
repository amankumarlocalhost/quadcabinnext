'use client';

import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, statsGridClass, statItemClass, statNumClass, statLabelClass } from '@/lib/ui/classNames.js';

const stats = [
  { to: 250, suffix: '+', label: 'Projects Completed' },
  { to: 180, suffix: '+', label: 'Happy Clients' },
  { to: 12, suffix: '+', label: 'Years of Experience' },
  { to: 60, suffix: '+', label: 'Skilled Professionals' },
];

export default function StatsSection(){
  const cms = useCmsSection('stats');
  const contentStats = cms?.items?.map((item) => ({ to:item.value, suffix:item.suffix, label:item.label })) || stats;
  const ref = useRef(null);
  useCountUp(ref);
  return (
    <section id="stats" className="min-h-0 py-[90px] bg-[linear-gradient(180deg,rgba(225,27,35,0.05),transparent_60%)]">
      <div className={`${wrapClass} ${statsGridClass}`} ref={ref}>
        {contentStats.map(s => (
          <div className={statItemClass} data-reveal key={s.label}>
            <div className={statNumClass}><span data-count-to={s.to} data-suffix={s.suffix}>0{s.suffix}</span></div>
            <div className={statLabelClass}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
