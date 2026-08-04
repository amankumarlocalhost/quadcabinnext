import { wrapClass } from '@/lib/ui/classNames.js';

const ADDRESS = '4th Floor, Royal Plaza, GS Road, Ganeshguri, Guwahati - 781006';

export default function ContactMapSection(){
  return (
    <section id="contact-map" className="min-h-0 border-t border-b border-brand-line bg-brand-panel relative overflow-hidden py-[100px]">
      {/* radial glow wash — replaces the old ::before pseudo-element */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(55%_60%_at_12%_30%,rgba(225,27,35,0.07),transparent_70%)]" />
      <div className={`${wrapClass} grid items-center relative z-1 [grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[56px] max-[900px]:grid-cols-1 max-[900px]:gap-[32px]`}>
        <div className="group" data-reveal>
          <h2 className="font-anton font-normal tracking-[0.01em] uppercase leading-[0.95] [font-size:clamp(30px,3.8vw,46px)]">Location</h2>
          <div className="w-[56px] h-[3px] bg-brand-red transition-[width] duration-300 ease-in-out my-[18px] mb-[26px] group-hover:w-[84px]"></div>
          <p className="text-brand-off text-[16.5px] leading-[1.85]">
            4th Floor, Royal Plaza,<br/>
            Opposite City Center Mall, Ganeshguri,<br/>
            G.S. Road, Guwahati - 781006
          </p>
        </div>
        <div
          className="w-full border border-brand-line overflow-hidden relative transition-[filter,border-color,transform] duration-[350ms] ease-in-out h-[420px] max-[992px]:h-[clamp(260px,38vh,420px)] max-[900px]:h-[320px] [filter:saturate(0.85)] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] hover:[filter:saturate(1)] hover:border-brand-red/45 hover:-translate-y-1"
          data-reveal
        >
          {/* corner brackets — replace the old ::before/::after pseudo-elements */}
          <span aria-hidden="true" className="absolute top-0 left-0 w-[44px] h-[44px] pointer-events-none border-t-2 border-l-2 border-brand-red z-1" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 w-[44px] h-[44px] pointer-events-none border-b-2 border-r-2 border-brand-red z-1" />
          <iframe
            className="block"
            title="Quad Cabins Location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
