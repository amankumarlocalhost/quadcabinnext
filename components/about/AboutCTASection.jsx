import { useCmsSection } from '@/lib/cms/CmsContext.js';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

export default function AboutCTASection({ onSubmit }){
  const cms = useCmsSection('cta');
  return (
    <>
      <section id="about-cta" className="relative overflow-hidden min-h-[60vh]">
        {/* pulsing radial glow — replaces the old ::before pseudo-element */}
        <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(225,27,35,0.1),transparent_70%)] animate-[cta-pulse_6s_ease-in-out_infinite]" />
        <div className={wrapClass}>
          <div className="text-center" data-reveal>
            <div className={`${eyebrowClass} justify-center`}><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'Get Started'}</div>
            <h2 className={`${h2Class} [font-size:clamp(32px,5.6vw,60px)] max-w-[clamp(560px,58vw,820px)] mx-auto`}>{cms?.heading || "Let's Build Your Next Portable Cabin Together"}</h2>
            <p className="mt-[18px] mx-auto max-w-[clamp(380px,42vw,560px)] text-brand-off text-[18px]">
              {cms?.description || "Tell us about your site and we'll help you configure a portable cabin solution built around it — from a single site office to a full labour township."}
            </p>
          </div>
        </div>
      </section>

      <ContactFormSection onSubmit={onSubmit} hideHeading />
    </>
  );
}
