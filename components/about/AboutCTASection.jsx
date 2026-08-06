import { useCmsSection } from '@/lib/cms/CmsContext.js';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';
import CTAIntro from '@/components/shared/CTAIntro.jsx';

export default function AboutCTASection({ onSubmit }){
  const cms = useCmsSection('cta');
  return (
    <>
      <CTAIntro
        id="about-cta"
        eyebrow={cms?.eyebrow || 'Get Started'}
        heading={cms?.heading || "Let's Build Your Next Portable Cabin Together"}
        description={cms?.description || "Tell us about your site and we'll help you configure a portable cabin solution built around it — from a single site office to a full labour township."}
        headingMaxWidthClass="max-w-[clamp(560px,58vw,820px)]"
        descMaxWidthClass="max-w-[clamp(380px,42vw,560px)]"
      />

      <ContactFormSection onSubmit={onSubmit} hideHeading />
    </>
  );
}
