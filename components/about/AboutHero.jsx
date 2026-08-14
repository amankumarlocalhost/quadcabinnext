'use client';

import { useRouter } from 'next/navigation';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { IconShield, IconClock, IconSliders, IconMapPin } from '@/components/about/icons.jsx';
import {
  pageHeroSectionClass, h1Class,
  wrapClass, eyebrowClass, eyebrowBarClass, btnPrimaryClass, btnGhostClass, scrollCueClass, scrollCueLineClass,
} from '@/lib/ui/classNames.js';

// Floating spec cards anchored around the cabin — purely visual, not CMS-driven.
const SPEC_CARDS = [
  { Icon: IconShield, title: 'Built to Last', desc: 'Engineered for extreme conditions', pos: 'top-[2%] right-[0%] xl:right-[-2%]' },
  { Icon: IconClock, title: 'Fast Deployment', desc: 'Pre-fabricated, site-ready', pos: 'top-[46%] -left-[5%] xl:-left-[8%]' },
  { Icon: IconSliders, title: 'Custom Designed', desc: 'Tailored to your requirements', pos: 'bottom-[4%] right-[4%] xl:right-[1%]' },
];

const stats = [
  { Icon: IconBuilding, value: '6+', label: 'Industries Served' },
  { Icon: IconBox, value: '250+', label: 'Projects Delivered' },
  { Icon: IconMapPin, value: '15+', label: 'States Covered' },
  { Icon: IconGauge, value: '99%', label: 'On-Time Delivery' },
];

const statIconBase = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IconBuilding(p){ return <svg {...statIconBase} {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-4h6v4M8 7h1M15 7h1M8 11h1M15 11h1M8 15h1M15 15h1" /></svg>; }
function IconBox(p){ return <svg {...statIconBase} {...p}><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v9l8 4 8-4V8M12 12v9" /></svg>; }
function IconGauge(p){ return <svg {...statIconBase} {...p}><path d="M4 15a8 8 0 1 1 16 0" /><path d="M12 15l4-5" /><circle cx="12" cy="15" r="1.2" /></svg>; }

export default function AboutHero({ onGoTo }){
  const router = useRouter();
  const cms = useCmsSection('hero');

  return (
    <section id="about-hero" className={`${pageHeroSectionClass} bg-brand-black`}>
      <div
        className="absolute z-0 will-change-transform [inset:-10%_-5%] bg-[position:center_38%] bg-cover bg-no-repeat bg-[#050505] [filter:saturate(0.55)_brightness(0.4)_contrast(1.08)] bg-[url('https://images.pexels.com/photos/12444957/pexels-photo-12444957.jpeg?auto=compress&cs=tinysrgb&w=1920')]"
        data-parallax-bg
        style={cms?.backgroundImage?.url ? { backgroundImage:`url('${cms.backgroundImage.url}')` } : undefined}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.78)_38%,rgba(5,5,5,0.4)_68%,rgba(5,5,5,0.82)_100%),linear-gradient(180deg,rgba(5,5,5,0.48)_0%,rgba(5,5,5,0.08)_28%,rgba(5,5,5,0.9)_100%)]" />
      </div>

      {/* subtle blueprint grid — extremely low-opacity technical texture */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(247,247,245,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(247,247,245,0.6)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(60%_70%_at_50%_40%,black,transparent)]" />
      {/* soft depth wash + warm light behind the cabin */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(46%_60%_at_16%_42%,rgba(225,27,35,0.07),transparent_70%),radial-gradient(46%_58%_at_86%_46%,rgba(255,190,120,0.09),transparent_70%)]" />

      <div className="relative z-2 w-full flex flex-col">
      <div className={`${wrapClass} relative flex items-center justify-between gap-[clamp(24px,3vw,48px)] pt-[78px] pb-[120px] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-[32px] max-[900px]:pt-[100px] max-[900px]:pb-0`}>
        <div className="relative z-2 max-w-[clamp(440px,42vw,600px)] max-[900px]:max-w-full">
          <div className={eyebrowClass} data-rise><span className={eyebrowBarClass}></span>{cms?.eyebrow || 'About Quad Cabins'}</div>
          <h1 className={`${h1Class} [font-size:clamp(30px,5.6vw,54px)] mt-[12px]`} data-rise>
            {cms?.heading ? (
              <>{cms.heading.split(cms.highlightedText || 'Portable Spaces')[0]}<span className="text-brand-red">{cms.highlightedText || 'Portable Spaces'}</span>{cms.heading.split(cms.highlightedText || 'Portable Spaces')[1]}</>
            ) : (
              <>Building Smart<br /><span className="text-brand-red">Portable Spaces</span><br />for Every Business</>
            )}
          </h1>
          <div aria-hidden="true" className="relative h-[3px] w-[220px] max-w-full mt-[14px] mb-[3px] bg-gradient-to-r from-brand-red via-brand-red to-transparent" data-rise>
            <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-brand-red/70 blur-lg" />
          </div>
          <p className="text-[17px] text-brand-off max-w-[clamp(380px,42vw,560px)] mt-[14px]" data-rise>
            {cms?.description || "We design and manufacture premium portable and modular cabins engineered for demanding project sites — built in the factory and delivered ready to work."}
          </p>
          <div className="flex gap-[16px] mt-[24px] flex-wrap" data-rise>
            <button className={btnPrimaryClass} onClick={()=>router.push(cms?.primaryCta?.href || '/products')}>{cms?.primaryCta?.label || 'Explore Products'}</button>
            <button className={btnGhostClass} onClick={()=>onGoTo(cms?.secondaryCta?.target || '#about-cta')}>{cms?.secondaryCta?.label || 'Contact Us'}</button>
          </div>
        </div>

        {/* Right: cabin visual — transparent cutout, held static with a soft ground
            shadow and surrounded by small spec cards. Only the outer wrapper
            carries the one-shot entrance fade/scale. */}
        <div
          aria-hidden="true"
          className="relative hidden min-[901px]:block shrink-0 w-[52vw] max-w-[760px] min-w-[340px] -mr-[3vw] max-[1200px]:mr-0 max-[1024px]:w-[42vw] max-[1024px]:min-w-[300px] animate-[t2-copy-in_0.9s_ease_both] [animation-delay:150ms]"
        >
          <div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[76%] h-[26px] rounded-full bg-black/60 blur-2xl" />
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(255,190,120,0.12),transparent_72%)] blur-2xl" />
          <img
            src="/images/cabin-about-hero.png"
            alt="Quad Cabins modular site office cabin"
            className="relative w-full h-auto object-contain [filter:saturate(0.95)_brightness(0.92)_contrast(1.05)_drop-shadow(0_36px_54px_rgba(0,0,0,0.65))]"
          />

          {SPEC_CARDS.map(({ Icon, title, desc, pos }, i) => (
            <div
              key={title}
              className={`hidden xl:flex absolute ${pos} items-start gap-[10px] w-[168px] px-[14px] py-[12px] rounded-[6px] border border-white/12 bg-brand-panel/85 backdrop-blur-[10px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.7)] animate-[t2-copy-in_0.6s_ease_both]`}
              style={{ animationDelay: `${420 + i * 140}ms` }}
            >
              <span aria-hidden="true" className="absolute left-0 top-[14%] bottom-[14%] w-[2px] bg-brand-red" />
              <Icon width={18} height={18} className="text-brand-red shrink-0 mt-[1px]" />
              <div className="leading-[1.25]">
                <strong className="block font-barlow-condensed font-bold text-[13px] text-brand-white uppercase tracking-[0.01em]">{title}</strong>
                <span className="block font-mono text-[9.5px] tracking-[0.03em] text-brand-steel mt-[3px]">{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cabin visual — simplified, no floating cards */}
        <div className="min-[901px]:hidden relative w-full max-w-[420px] mx-auto animate-[t2-copy-in_0.8s_ease_both] [animation-delay:100ms]">
          <div className="absolute left-1/2 bottom-[4%] -translate-x-1/2 w-[70%] h-[18px] rounded-full bg-black/55 blur-xl" />
          <img
            src="/images/cabin-about-hero.png"
            alt="Quad Cabins modular site office cabin"
            className="relative w-full h-auto object-contain [filter:saturate(0.95)_brightness(0.92)_contrast(1.05)_drop-shadow(0_24px_36px_rgba(0,0,0,0.6))]"
          />
        </div>
      </div>

      {/* Bottom metrics bar — sits inside the hero, above the fold */}
      <div className={`${wrapClass} relative mt-[24px] mb-[32px] min-[901px]:absolute min-[901px]:left-0 min-[901px]:right-0 min-[901px]:bottom-[26px] min-[901px]:mt-0 min-[901px]:mb-0`} data-rise>
        <div className="flex flex-wrap items-center gap-x-[36px] gap-y-[16px] rounded-[8px] border border-white/10 bg-brand-panel/60 backdrop-blur-[10px] px-[26px] py-[18px] max-[900px]:px-[18px] max-[900px]:py-[16px] max-[900px]:gap-x-[22px]">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-[12px] pr-[36px] border-r border-white/12 last:border-r-0 last:pr-0 max-[900px]:pr-[22px]">
              <Icon className="text-brand-red shrink-0" />
              <div className="leading-[1.2]">
                <strong className="block font-anton text-brand-white [font-size:clamp(18px,2vw,24px)]">{value}</strong>
                <span className="block font-mono text-[9.5px] tracking-[0.06em] uppercase text-brand-steel mt-[3px]">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className={`${scrollCueClass} max-[900px]:hidden bottom-[128px]`}><span>Scroll</span><span className={scrollCueLineClass}></span></div>
    </section>
  );
}
