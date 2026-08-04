import { IconFactory, IconSliders, IconGem, IconClock } from './icons.jsx';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class, whoGridClass, iconCardClass, iconCardIconClass, iconCardTitleClass, iconCardDescClass } from '@/lib/ui/classNames.js';

const items = [
  { Icon: IconFactory, title: 'Premium Manufacturing', desc: 'Specialists in factory-built portable cabins, engineered for strength and finish.' },
  { Icon: IconSliders, title: 'Customized Solutions', desc: 'Layouts and specs tailored to your business, site, and scale of operation.' },
  { Icon: IconGem, title: 'Quality Materials', desc: 'Modern construction techniques and quality materials in every build.' },
  { Icon: IconClock, title: 'Reliable Delivery', desc: 'Focused on functionality, reliability, and delivery you can plan around.' },
];

export default function WhoWeAreSection(){
  const cms = useCmsSection('who-we-are');
  const iconMap = { factory:IconFactory, sliders:IconSliders, gem:IconGem, clock:IconClock };
  const contentItems = cms?.items?.map((item) => ({ ...item, Icon:iconMap[item.icon] || IconFactory, desc:item.description })) || items;
  return (
    <section id="who-we-are" className="min-h-0 relative overflow-hidden py-[100px]">
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-center bg-cover bg-no-repeat bg-[#050505] bg-[url('https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg?auto=compress&cs=tinysrgb&w=1600')] [filter:saturate(0.7)_brightness(0.4)_contrast(1.05)]"
        data-parallax-bg
      >
        {/* depth wash — replaces the old ::after pseudo-element */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.65)_30%,rgba(5,5,5,0.92)_100%)]" />
      </div>
      <div className={`${wrapClass} relative z-1 flex-col items-start`}>
        <div className={eyebrowClass} data-reveal><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Who We Are'}</div>
        <h2 className={`${h2Class} mb-[44px]`} data-reveal>{cms?.heading || 'What we bring to every project site.'}</h2>
        <div className={whoGridClass}>
          {contentItems.map((it, i) => (
            <div className={iconCardClass} data-reveal key={it.title} style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className={iconCardIconClass}><it.Icon /></div>
              <h3 className={iconCardTitleClass}>{it.title}</h3>
              <p className={iconCardDescClass}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
