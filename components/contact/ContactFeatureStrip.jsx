import { IconShield, IconClock, IconSliders, IconHeadset } from '@/components/about/icons.jsx';
import { wrapClass } from '@/lib/ui/classNames.js';

const FEATURES = [
  { Icon: IconShield, title: 'Built to Last', desc: 'Engineered for tough environments' },
  { Icon: IconClock, title: 'Fast Deployment', desc: 'Factory-built for quick installation' },
  { Icon: IconSliders, title: 'Custom Solutions', desc: 'Designed around your requirements' },
  { Icon: IconHeadset, title: 'Dedicated Support', desc: 'Support from planning to delivery' },
];

export default function ContactFeatureStrip(){
  return (
    <section className="relative border-t border-b border-brand-line bg-brand-panel py-[32px] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(50%_60%_at_50%_0%,rgba(225,27,35,0.05),transparent_70%)]" />
      <div className={`${wrapClass} flex flex-wrap gap-x-[40px] gap-y-[24px]`}>
        {FEATURES.map(({ Icon, title, desc }, i) => (
          <div
            key={title}
            className="flex items-center gap-[14px] flex-1 min-w-[220px] pr-[40px] border-r border-white/10 last:border-r-0 max-[900px]:border-r-0 max-[900px]:min-w-[45%] animate-[t2-copy-in_0.6s_ease_both]"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <span className="shrink-0 w-[44px] h-[44px] rounded-[8px] border border-brand-line flex items-center justify-center text-brand-red">
              <Icon width={20} height={20} />
            </span>
            <div className="leading-[1.25]">
              <strong className="block font-barlow-condensed font-bold text-[14.5px] text-brand-white uppercase tracking-[0.01em]">{title}</strong>
              <span className="block text-[12.5px] text-brand-steel mt-[2px]">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
