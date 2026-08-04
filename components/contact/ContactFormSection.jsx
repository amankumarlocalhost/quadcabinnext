import { IconHeadset, IconClock, IconFactory } from '@/components/about/icons.jsx';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import {
  wrapClass, eyebrowClass, eyebrowBarClass, h2Class, btnPrimaryClass,
  contactGridFormClass, contactFormFieldClass, contactFormFullClass,
  iconCardClass, iconCardIconClass, iconCardTitleClass, iconCardDescClass,
} from '@/lib/ui/classNames.js';

const infoCards = [
  { Icon: IconHeadset, title: 'Sales Support', desc: 'Speak with our team about specs, pricing and lead times.' },
  { Icon: IconClock, title: 'Response Time', desc: "We typically reply within one business day, quote included." },
  { Icon: IconFactory, title: 'Factory Visits', desc: 'Book a walkthrough of the works before you place an order.' },
];

export default function ContactFormSection({ onSubmit, hideHeading = false }){
  const cms = useCmsSection('form');
  const forms = useCmsSection('forms', 'global');
  const iconMap = { headset:IconHeadset, clock:IconClock, factory:IconFactory };
  const cards = cms?.infoCards?.map((item) => ({ ...item, Icon:iconMap[item.icon] || IconHeadset, desc:item.description })) || infoCards;
  return (
    <section id="contact-form" className="relative overflow-hidden py-[80px] pb-[140px]">
      {/* radial glow wash — replaces the old ::before pseudo-element */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(60%_55%_at_88%_12%,rgba(225,27,35,0.07),transparent_70%)]" />
      <div className={`${wrapClass} flex flex-col items-start`}>
        {!hideHeading && (
          <>
            <div className={eyebrowClass} data-reveal><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Send a Message'}</div>
            <h2 className={`${h2Class} mb-[44px]`} data-reveal>{cms?.heading || 'Request a quote for your site.'}</h2>
          </>
        )}

        <div className="grid w-full items-start [grid-template-columns:minmax(0,1.15fr)_minmax(0,0.85fr)] gap-[40px] max-[900px]:grid-cols-1 max-[900px]:gap-[28px]">
          <form className={contactGridFormClass} data-reveal onSubmit={onSubmit}>
            <input className={contactFormFieldClass} name="name" type="text" placeholder={forms?.namePlaceholder || 'Full name'} required />
            <input className={contactFormFieldClass} name="phone" type="tel" placeholder={forms?.phonePlaceholder || 'Phone number'} required />
            <input className={`${contactFormFieldClass} ${contactFormFullClass}`} name="email" type="email" placeholder={forms?.emailPlaceholder || 'Email address'} required />
            <select className={`${contactFormFieldClass} ${contactFormFullClass}`} name="product" required defaultValue="">
              <option value="" disabled>{forms?.productLabel || 'Select product'}</option>
              {(forms?.products || ['Site Office Cabin','Labour Accommodation Cabin','Conference Cabin','Storage Cabin','Security Cabin','Portable Toilets','FRP Cabin','Custom Modular Cabin']).map((product) => <option key={product}>{product}</option>)}
            </select>
            <textarea className={`${contactFormFieldClass} ${contactFormFullClass}`} name="message" rows="4" placeholder={forms?.messagePlaceholder || 'Project location & requirement'}></textarea>
            <button type="submit" className={`${btnPrimaryClass} ${contactFormFullClass}`}>{forms?.submitLabel || 'Contact Us'}</button>
          </form>

          <div className="flex flex-col gap-px bg-brand-line border border-brand-line">
            {cards.map((c, i) => (
              <div className={`${iconCardClass} p-[28px_24px]`} data-reveal key={c.title} style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className={iconCardIconClass}><c.Icon /></div>
                <h3 className={iconCardTitleClass}>{c.title}</h3>
                <p className={iconCardDescClass}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
