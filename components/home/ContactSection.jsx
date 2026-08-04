import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { wrapClass, h2Class, btnPrimaryClass, contactFormClass, contactFormFieldClass, contactFormFullClass } from '@/lib/ui/classNames.js';

export default function ContactSection({ onSubmit }){
  const cms = useCmsSection('contact');
  const forms = useCmsSection('forms', 'global');
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center text-center">
      <div className={`${wrapClass} flex flex-col items-center`}>
        <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-brand-red flex items-center gap-[10px] mb-[18px]"><span className="w-[26px] h-[2px] bg-brand-red"></span>{cms?.eyebrow || "LET'S BUILD YOUR SITE"}</div>
        <h2 className={`${h2Class} [font-size:clamp(34px,6vw,72px)] max-w-[840px]`}>{cms?.heading || <>Need a portable cabin<br />for your project?</>}</h2>
        <p className="text-brand-off text-[18px] mt-[18px] max-w-[520px]">{cms?.description || "Tell us your site and scale — we'll come back with a configuration and a quote, fast."}</p>
        <form className={contactFormClass} onSubmit={onSubmit}>
          <input className={contactFormFieldClass} name="name" type="text" placeholder={forms?.namePlaceholder || 'Full name'} required />
          <input className={contactFormFieldClass} name="phone" type="tel" placeholder={forms?.phonePlaceholder || 'Phone number'} required />
          <input className={`${contactFormFieldClass} ${contactFormFullClass}`} name="email" type="email" placeholder={forms?.emailPlaceholder || 'Email address'} required />
          <select className={`${contactFormFieldClass} ${contactFormFullClass}`} name="product" required defaultValue="">
            <option value="" disabled>{forms?.productLabel || 'Select product'}</option>
            {(forms?.products || ['Site Office Cabin','Labour Accommodation Cabin','Conference Cabin','Storage Cabin','Security Cabin','Portable Toilets','FRP Cabin','Custom Modular Cabin']).map((product) => <option key={product}>{product}</option>)}
          </select>
          <textarea className={`${contactFormFieldClass} ${contactFormFullClass}`} name="message" rows="3" placeholder={forms?.messagePlaceholder || 'Project location & requirement'}></textarea>
          <button type="submit" className={`${btnPrimaryClass} ${contactFormFullClass} mt-[6px]`}>{forms?.submitLabel || 'Contact Us'}</button>
        </form>
      </div>
    </section>
  );
}
