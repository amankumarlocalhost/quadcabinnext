import { industries } from '@/lib/data/industries.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, sectionClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

export default function IndustriesSection(){
  const cms = useCmsSection('industries');
  const items = cms?.items || industries;
  return (
    <section id="industries" className={sectionClass}>
      <div className={`${wrapClass} flex-col items-start`}>
        <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'WHERE WE WORK'}</div>
        <h2 className={`${h2Class} [font-size:clamp(32px,5vw,58px)] mb-[8px]`}>{cms?.heading || 'Industries Served'}</h2>
        <p className="text-brand-off max-w-[520px] mb-[44px]">{cms?.description || "Every cabin in our range is built to survive the site it's dropped onto."}</p>
        <div className="grid w-full bg-transparent border-none [grid-template-columns:repeat(3,minmax(0,1fr))] gap-[10px] max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {items.map(({ idx, name, img, image }) => (
            <div
              className="group relative overflow-hidden flex flex-col justify-between p-[30px_22px] min-h-[190px]"
              key={idx}
              data-reveal-tile
            >
              <img
                className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.55)_brightness(0.55)_contrast(1.05)] scale-[1.06] transition-[transform,filter] duration-[600ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.16] group-hover:[filter:saturate(0.8)_brightness(0.65)_contrast(1.08)]"
                src={image?.url || img}
                alt={image?.alt || name}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 transition-[background] duration-[250ms] ease-in-out bg-[linear-gradient(180deg,rgba(10,10,11,0.35)_0%,rgba(10,10,11,0.85)_100%)] group-hover:bg-[linear-gradient(180deg,rgba(225,27,35,0.18)_0%,rgba(10,10,11,0.78)_100%)]"
              />
              <span className="relative z-1 font-mono text-[12px] text-brand-red">{idx}</span>
              <span className="relative z-1 font-barlow-condensed font-bold text-[21px] uppercase mt-[26px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
