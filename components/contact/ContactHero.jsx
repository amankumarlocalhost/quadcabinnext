'use client';

import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { IconPhone, IconMail, IconMapPin, IconClock } from '@/components/about/icons.jsx';
import {
  wrapClass, eyebrowClass, eyebrowBarClass, h1Class, btnPrimaryClass,
  contactFormFieldClass, contactFormFullClass,
} from '@/lib/ui/classNames.js';

const DEFAULT_PRODUCTS = ['Site Office Cabin', 'Labour Accommodation', 'Conference Cabin', 'Storage Cabin', 'Custom Modular Cabin', 'Other'];

export default function ContactHero({ onSubmit }){
  const cms = useCmsSection('hero');
  const forms = useCmsSection('forms', 'global');
  const quickContact = cms?.quickContact;

  const cards = [
    { Icon: IconPhone, label: 'Call Us', value: quickContact?.[0]?.value || '+91 78996 524335', href: quickContact?.[0]?.href || 'tel:+917899652435' },
    { Icon: IconMail, label: 'Email Us', value: quickContact?.[1]?.value || 'sales@quadcabins.in', href: quickContact?.[1]?.href || 'mailto:sales@quadcabins.in' },
    { Icon: IconMapPin, label: 'Our Office', value: quickContact?.[2]?.value || 'Northeast India · Pan-India Delivery' },
    { Icon: IconClock, label: 'Working Hours', value: 'Mon – Sat · 9:00 AM – 6:00 PM' },
  ];

  const products = forms?.products?.length ? forms.products : DEFAULT_PRODUCTS;

  // Backend only accepts name/phone/email/product/message — fold the extra
  // Company and Location fields into the message body before handing off to
  // the shared submit flow, so no data the visitor typed is silently dropped.
  const handleSubmit = (e) => {
    const form = e.currentTarget;
    const company = form.company?.value?.trim();
    const location = form.location?.value?.trim();
    const extra = [location && `Location: ${location}`, company && `Company: ${company}`].filter(Boolean).join('\n');
    if (extra && form.message) form.message.value = form.message.value ? `${extra}\n${form.message.value}` : extra;
    onSubmit(e);
  };

  return (
    <section id="contact-hero" className="relative overflow-hidden min-h-screen pt-[118px] pb-[56px] max-[900px]:pt-[112px] max-[900px]:min-h-0 max-[900px]:pb-[48px]">
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_38%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.85)_brightness(0.72)_contrast(1.05)] bg-[url('/images/contact-hero-bg.png')]"
        data-parallax-bg
        style={cms?.backgroundImage?.url ? { backgroundImage:`url('${cms.backgroundImage.url}')` } : undefined}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.6)_42%,rgba(5,5,5,0.2)_72%,rgba(5,5,5,0.45)_100%),linear-gradient(180deg,rgba(5,5,5,0.36)_0%,rgba(5,5,5,0.05)_25%,rgba(5,5,5,0.78)_100%)]" />
      </div>

      {/* subtle blueprint grid */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none opacity-[0.045] bg-[linear-gradient(rgba(247,247,245,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(247,247,245,0.6)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(60%_70%_at_30%_40%,black,transparent)]" />
      {/* soft depth wash */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(46%_60%_at_14%_46%,rgba(225,27,35,0.07),transparent_70%),radial-gradient(50%_58%_at_88%_48%,rgba(225,27,35,0.06),transparent_72%)]" />

      <div className={`${wrapClass} relative z-2 grid [grid-template-columns:minmax(0,0.92fr)_minmax(0,1.08fr)] gap-[56px] items-center max-[1024px]:gap-[36px] max-[900px]:grid-cols-1 max-[900px]:gap-[32px]`}>
        {/* Left: contact information */}
        <div>
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Get In Touch'}</div>
          <h1 className={`${h1Class} [font-size:clamp(32px,5.4vw,56px)] mt-[12px]`} data-rise>
            {cms?.heading ? (
              <>{cms.heading.split(cms.highlightedText || 'Smart Spaces')[0]}<span className="text-brand-red">{cms.highlightedText || 'Smart Spaces'}</span>{cms.heading.split(cms.highlightedText || 'Smart Spaces')[1]}</>
            ) : (
              <>Let&apos;s Build<br /><span className="text-brand-red">Smart Spaces</span><br />Together.</>
            )}
          </h1>
          <p className="text-[17px] text-brand-off max-w-[480px] mt-[16px] leading-[1.6]" data-rise>
            {cms?.description || "Have a project in mind or need more information about our cabins? Tell us what you need and our team will help you find the right modular solution."}
          </p>

          <div className="grid grid-cols-2 gap-[12px] mt-[28px] max-[480px]:grid-cols-1" data-rise>
            {cards.map(({ Icon, label, value, href }) => (
              <div key={label} className="group rounded-[10px] border border-white/10 bg-white/[0.03] backdrop-blur-[8px] px-[16px] py-[14px] transition-all duration-[250ms] ease-in-out hover:bg-white/[0.06] hover:border-brand-red/45 hover:-translate-y-[2px]">
                <Icon width={18} height={18} className="text-brand-red mb-[8px]" />
                <span className="block font-mono text-[9.5px] uppercase text-brand-steel tracking-[0.12em]">{label}</span>
                {href
                  ? <a className="block font-barlow-condensed font-semibold text-[16px] text-brand-white no-underline mt-[3px] transition-colors duration-300 ease-in-out group-hover:text-brand-red" href={href}>{value}</a>
                  : <span className="block font-barlow-condensed font-semibold text-[16px] text-brand-white mt-[3px]">{value}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right: contact form card */}
        <div
          className="relative rounded-[10px] border border-white/12 bg-[linear-gradient(155deg,rgba(28,28,31,0.82),rgba(10,10,11,0.82))] backdrop-blur-[20px] p-[32px] max-[480px]:p-[22px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.06)] border-t-[3px] border-t-brand-red"
          data-rise
        >
          <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-brand-red flex items-center gap-[10px] mb-[10px]"><span className="w-[26px] h-[2px] bg-brand-red"></span>Send Us a Message</div>
          <p className="text-[14.5px] text-brand-off mb-[24px]">Tell us about your project and we&apos;ll get back to you shortly.</p>

          <form className="grid grid-cols-2 gap-[14px] max-[480px]:grid-cols-1" onSubmit={handleSubmit}>
            <input className={contactFormFieldClass} name="name" type="text" placeholder="Full name" required />
            <input className={contactFormFieldClass} name="email" type="email" placeholder="Email address" required />
            <input className={contactFormFieldClass} name="phone" type="tel" placeholder="Phone number" required />
            <input className={contactFormFieldClass} name="company" type="text" placeholder="Company / organization" />
            <select className={`${contactFormFieldClass} ${contactFormFullClass}`} name="product" required defaultValue="">
              <option value="" disabled>Select service</option>
              {products.map((product) => <option key={product}>{product}</option>)}
            </select>
            <input className={`${contactFormFieldClass} ${contactFormFullClass}`} name="location" type="text" placeholder="Project location" />
            <textarea className={`${contactFormFieldClass} ${contactFormFullClass}`} name="message" rows="4" placeholder="Project requirements / message"></textarea>
            <button type="submit" className={`${btnPrimaryClass} ${contactFormFullClass} justify-center`}>Send Message →</button>
          </form>

          <p className="text-[12px] text-brand-steel mt-[16px] leading-[1.5]">Your information is secure and will only be used to contact you about your project.</p>
        </div>
      </div>
    </section>
  );
}
