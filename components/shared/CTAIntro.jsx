import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

// Shared "pulsing glow + centered eyebrow/heading/description" shell used by
// the page-level CTA sections (About, Industries). Each page supplies its
// own copy, its own heading/description max-width, and whatever comes after
// the description (buttons, a form, etc.) via children.
export default function CTAIntro({ id, eyebrow, heading, description, headingMaxWidthClass, descMaxWidthClass, children }){
  return (
    <section id={id} className="relative overflow-hidden min-h-[60vh]">
      {/* pulsing radial glow — replaces the old ::before pseudo-element */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(225,27,35,0.1),transparent_70%)] animate-[cta-pulse_6s_ease-in-out_infinite]" />
      <div className={wrapClass}>
        <div className="text-center" data-reveal>
          <div className={`${eyebrowClass} justify-center`}><span className={eyebrowBarClass}></span>{eyebrow}</div>
          <h2 className={`${h2Class} [font-size:clamp(32px,5.6vw,60px)] ${headingMaxWidthClass} mx-auto`}>{heading}</h2>
          <p className={`mt-[18px] mx-auto ${descMaxWidthClass} text-brand-off text-[18px]`}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
