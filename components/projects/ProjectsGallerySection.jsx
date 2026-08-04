import { projects } from '@/lib/data/projects.js';
import { wrapClass, eyebrowClass, eyebrowBarClass, h2Class } from '@/lib/ui/classNames.js';

export default function ProjectsGallerySection(){
  return (
    <section id="projects-gallery">
      <div className={`${wrapClass} flex-col items-start`}>
        <div className={eyebrowClass} data-reveal><span className={eyebrowBarClass}></span>The Gallery</div>
        <h2 className={`${h2Class} mb-[44px]`} data-reveal>A few sites we&apos;ve shipped to.</h2>
        {/* `.gallery` carried no CSS rule in the original stylesheet (only
            `.gallery-slider` did) — reconstructed here as a plain flex-wrap
            grid of the same g-card visual used elsewhere on the site. */}
        <div className="flex flex-wrap gap-[14px]">
          {projects.map(({ tag, label, img }) => (
            <div className="group relative border border-brand-line overflow-hidden w-[300px] aspect-[3/4] [background:linear-gradient(155deg,var(--charcoal)_0%,#0d0d0e_60%)] shadow-[0_18px_40px_rgba(0,0,0,0.35)]" data-reveal key={tag}>
              <img
                className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.7)_brightness(0.72)_contrast(1.06)] scale-[1.05] transition-[transform,filter] duration-[600ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.14] group-hover:[filter:saturate(0.95)_brightness(0.82)_contrast(1.08)]"
                src={img}
                alt={label}
                loading="lazy"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.05)_0%,rgba(10,10,11,0.9)_100%)]" />
              <span className="absolute top-[14px] left-[14px] font-mono text-[11px] text-brand-red z-1">{tag}</span>
              <span className="absolute left-[14px] bottom-[14px] font-mono text-[11px] tracking-[0.08em] text-brand-off uppercase z-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
