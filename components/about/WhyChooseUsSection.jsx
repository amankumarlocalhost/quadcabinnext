import { IconGem, IconSliders, IconFactory, IconClock, IconTag, IconRain, IconRuler, IconHeadset } from './icons.jsx';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class, featureGridClass, featureCardClass, featureCardTitleClass } from '@/lib/ui/classNames.js';

const features = [
  { Icon: IconGem, title: 'Premium Quality Materials' },
  { Icon: IconSliders, title: 'Fully Customizable Designs' },
  { Icon: IconFactory, title: 'Fast Manufacturing' },
  { Icon: IconClock, title: 'On-Time Delivery' },
  { Icon: IconTag, title: 'Affordable Pricing' },
  { Icon: IconRain, title: 'Weather-Resistant Construction' },
  { Icon: IconRuler, title: 'Expert Engineering' },
  { Icon: IconHeadset, title: 'Dedicated Customer Support' },
];

export default function WhyChooseUsSection(){
  const cms = useCmsSection('why-choose-us');
  const contentFeatures = cms?.items?.map((title, index) => ({ ...features[index % features.length], title })) || features;
  return (
    <section id="why-choose-us" className="min-h-0 py-[100px]">
      <div className={`${wrapClass} flex-col items-start`}>
        <div className={eyebrowClass} data-reveal><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Why Choose Us'}</div>
        <h2 className={`${h2Class} mb-[44px]`} data-reveal>{cms?.heading || 'Built different, from the ground up.'}</h2>
        <div className={featureGridClass}>
          {contentFeatures.map((f, i) => (
            <div className={featureCardClass} data-reveal key={f.title} style={{ transitionDelay: `${(i % 4) * 0.05}s` }}>
              <div className="text-brand-red"><f.Icon /></div>
              <span className={featureCardTitleClass}>{f.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
