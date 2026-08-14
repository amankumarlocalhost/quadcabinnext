'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';

import Scene from '@/journey/showcase/Scene.jsx';
import CopyOverlay from '@/journey/showcase/CopyOverlay.jsx';
import CabinDots from '@/journey/showcase/CabinDots.jsx';
import { useShowcaseScroll } from '@/journey/showcase/useShowcaseScroll.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { useProductsPage } from '@/lib/services/productsService.js';
import { useQuoteStore } from '@/lib/store/quoteStore.js';
import { IconSliders, IconFactory, IconClock } from '@/components/about/icons.jsx';
import {
  wrapClass, eyebrowClass, eyebrowBarClass, h1Class, h2Class, scrollCueClass, scrollCueLineClass,
  cardClass, btnPrimaryClass, btnGhostClass, cardBtnGhostClass,
} from '@/lib/ui/classNames.js';

// Hero-only feature row — mirrors the three facts the old stat strip showed
// (cabin range count / factory-built / delivery speed), just re-skinned with
// icons to match the redesigned hero's premium-industrial look.
const HERO_FEATURES = [
  { Icon: IconSliders, value: '4', label: 'Cabin Ranges' },
  { Icon: IconFactory, value: '100%', label: 'Factory Built' },
  { Icon: IconClock, value: 'Fast', label: 'Site Delivery' },
];

const playIcon = (
  <svg width="9" height="10" viewBox="0 0 9 10" fill="currentColor" aria-hidden="true"><path d="M0 0l9 5-9 5V0Z" /></svg>
);

// Bottom trust strip — matches the reference layout's closing row of quick
// credibility facts. Icons drawn inline (same thin-line style as
// components/about/icons.jsx) since none of the existing set fit these.
const iconBase = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconBuilding = (p) => <svg {...iconBase} {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-4h6v4M8 7h1M15 7h1M8 11h1M15 11h1M8 15h1M15 15h1" /></svg>;
const IconUsers = (p) => <svg {...iconBase} {...p}><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /><circle cx="17" cy="8" r="2.5" /><path d="M17 5c1.7 0 3 1.5 3 3.3M21 20c0-2.6-2-4.8-4.6-5.6" /></svg>;
const IconGlobe = (p) => <svg {...iconBase} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" /></svg>;
const IconDiamond = (p) => <svg {...iconBase} {...p}><path d="M4 8l3-4h10l3 4-9 12L4 8Z" /><path d="M4 8h16M9 4l1 4-2 0 4 8 4-8-2 0 1-4" /></svg>;

const TRUST_ITEMS = [
  { Icon: IconBuilding, value: '4 Cabin Types', label: 'Site Office · Labour · Conference · Storage' },
  { Icon: IconUsers, value: '100+', label: 'Projects Delivered' },
  { Icon: IconGlobe, value: 'Pan India', label: 'Presence' },
  { Icon: IconDiamond, value: 'Premium', label: 'Modular Solutions' },
];

export default function ProductsPageView({ initialData = null }){
  const legacyIntro = useCmsSection('intro');
  const legacyProducts = useCmsSection('products');
  const legacyCta = useCmsSection('cta');
  const productsPage = useProductsPage(initialData);
  const intro = productsPage?.hero || {
    smallTitle: legacyIntro?.eyebrow, mainHeading: legacyIntro?.heading,
    highlightedText: legacyIntro?.highlightedText, description: legacyIntro?.description,
    scrollLabel: legacyIntro?.scrollLabel,
  };
  const categories = productsPage?.categories;
  const rawProducts = productsPage?.products || legacyProducts?.items;
  const categoryOrder = new Map((categories || []).map((category, order) => [category.id, order]));
  const productsData = rawProducts && [...rawProducts].sort((a, b) =>
    (categoryOrder.get(a.categoryId) ?? a.order ?? 0) - (categoryOrder.get(b.categoryId) ?? b.order ?? 0)
    || (a.order ?? 0) - (b.order ?? 0));
  const cta = productsPage?.closingCta || {
    smallTitle: legacyCta?.eyebrow, heading: legacyCta?.heading, description: legacyCta?.description,
    primaryButton: { text: legacyCta?.primaryCta?.label, link: legacyCta?.primaryCta?.href },
    secondaryButton: { text: legacyCta?.secondaryCta?.label, link: legacyCta?.secondaryCta?.href },
  };
  const router = useRouter();
  const trackRef = useRef(null);
  const heroRef = useRef(null);
  const toast = useQuoteStore((s) => s.toast);
  const dismissToast = useQuoteStore((s) => s.dismissToast);
  const submitQuote = useQuoteStore((s) => s.submit);

  useShowcaseScroll({ trackRef, heroRef, productsData });

  const goTo = (sel)=>{
    router.push('/');
    setTimeout(()=>{
      document.querySelector(sel)?.scrollIntoView({ behavior:'smooth' });
    }, 60);
  };

  const submit = (e) => {
    e.preventDefault();
    submitQuote(e.currentTarget, 'products');
  };

  return (
    <>
      <Scene productsData={productsData} heroMedia={intro?.backgroundMedia} />

      <Header onNavHome={()=>router.push('/')} />

      <div
        className="fixed inset-0 z-2 flex items-center pointer-events-none will-change-[opacity,transform] pt-[78px] pb-[96px] max-[900px]:pt-[78px] max-[900px]:pb-[20px] [@media(max-height:760px)]:pb-[70px]"
        ref={heroRef}
      >
        {/* soft depth wash — replaces the old ::before pseudo-element */}
        <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(48%_60%_at_18%_46%,rgba(225,27,35,0.05),transparent_70%),radial-gradient(55%_65%_at_82%_50%,rgba(255,255,255,0.045),transparent_72%)]" />
        <div className={`${wrapClass} max-[900px]:px-[20px] relative flex items-center justify-between gap-[clamp(30px,3.5vw,56px)] max-[900px]:flex-col max-[900px]:items-start max-[900px]:justify-center max-[900px]:gap-[18px]`}>
          <div className="max-w-[560px] pointer-events-auto">
            <div className={`${eyebrowClass} animate-[t2-copy-in_0.7s_ease_both]`}><span className={eyebrowBarClass}></span>{intro?.smallTitle || 'Our Cabins'}</div>
            <h1 className={`${h1Class} [font-size:clamp(32px,5.6vw,58px)] max-w-[560px] mt-[10px] max-[900px]:mt-[8px] animate-[t2-copy-in_0.7s_ease_both] [animation-delay:80ms]`}>
              {intro?.mainHeading
                ? <>{intro.mainHeading.split(intro.highlightedText || 'walk-around')[0]}<br /><span className="text-brand-red">{intro.highlightedText || 'walk-around'}</span>{intro.mainHeading.split(intro.highlightedText || 'walk-around')[1]}</>
                : <>Four Cabins.<br/><span className="text-brand-red">One Walk-Around.</span></>}
            </h1>
            <div aria-hidden="true" className="relative h-[3px] w-[220px] max-w-full mt-[8px] mb-[3px] bg-gradient-to-r from-brand-red via-brand-red to-transparent animate-[t2-copy-in_0.7s_ease_both] [animation-delay:110ms]">
              <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-brand-red/70 blur-lg" />
            </div>
            <p className="text-[16px] text-brand-off max-w-[clamp(300px,32vw,420px)] mt-[12px] animate-[t2-copy-in_0.7s_ease_both] [animation-delay:140ms]">{intro?.description || 'Explore the full Quad Cabins range — Site Office, Labour Accommodation, Conference and Storage.'}</p>

            <div className="flex flex-wrap divide-x divide-white/14 mt-[20px] animate-[t2-copy-in_0.7s_ease_both] [animation-delay:200ms]">
              {HERO_FEATURES.map(({ Icon, value, label }) => (
                <div key={label} className="flex items-center gap-[10px] px-[18px] first:pl-0">
                  <Icon width={19} height={19} className="text-brand-red shrink-0" />
                  <div className="leading-[1.2]">
                    <strong className="block font-barlow-condensed font-bold text-[15px] text-brand-white">{value}</strong>
                    <span className="block font-mono text-[9.5px] tracking-[0.08em] uppercase text-brand-steel mt-[2px]">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-[16px] mt-[24px] flex-wrap pointer-events-auto animate-[t2-copy-in_0.7s_ease_both] [animation-delay:260ms]">
              <button
                className={btnPrimaryClass}
                onClick={() => document.querySelector('#showcase-track-anchor')?.scrollIntoView({ behavior:'smooth' })}
              >
                {intro?.primaryCta?.label || 'Explore Cabins'}
              </button>
              <button
                className={`${btnGhostClass} after:content-none`}
                onClick={() => document.querySelector('#showcase-track-anchor')?.scrollIntoView({ behavior:'smooth' })}
              >
                <span className="flex items-center justify-center w-[22px] h-[22px] rounded-full border border-current shrink-0">{playIcon}</span>
                {intro?.cta?.text || intro?.scrollLabel || 'Watch Walk-Around'}
              </button>
            </div>
          </div>

          {/* Right: provided cabin image — the DOM carousel (Scene.jsx) is fully
              faded out at rest (its groups only rise in once scroll begins), so
              there's nothing beneath this to conflict with. */}
          <div
            aria-hidden="true"
            className="hidden min-[901px]:block pointer-events-none absolute right-[60px] top-1/2 -translate-y-1/2 -mt-[10px] w-[48.4vw] max-w-[790px] min-w-[375px] animate-[t2-copy-in_0.9s_ease_both] [animation-delay:120ms]"
          >
            <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[74%] h-[20px] rounded-full bg-black/55 blur-2xl" />
            <img
              src="/images/cabin-hero.png"
              alt="Quad Cabins modular site office cabin"
              className="relative w-full h-auto object-contain [filter:saturate(0.85)_brightness(0.8)_contrast(1.05)_drop-shadow(0_28px_42px_rgba(0,0,0,0.6))]"
            />
          </div>
        </div>

        {/* Bottom trust strip — closing row of quick credibility facts */}
        <div className={`hidden min-[901px]:block ${wrapClass} absolute left-1/2 -translate-x-1/2 bottom-[26px] pointer-events-auto animate-[t2-copy-in_0.7s_ease_both] [animation-delay:320ms]`}>
          <div className="flex flex-wrap items-center gap-x-[30px] gap-y-[14px]">
            {TRUST_ITEMS.map(({ Icon, value, label }) => (
              <div key={label} className="flex items-center gap-[12px] pr-[30px] border-r border-white/14 last:border-r-0 last:pr-0">
                <Icon className="text-brand-red shrink-0" />
                <div className="leading-[1.2]">
                  <strong className="block font-barlow-condensed font-bold text-[14px] text-brand-white uppercase tracking-[0.02em]">{value}</strong>
                  <span className="block font-mono text-[9px] tracking-[0.05em] uppercase text-brand-steel mt-[2px] max-w-[190px]">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CopyOverlay onGoTo={goTo} productsData={productsData} />
      <CabinDots categories={categories} productsData={productsData} />

      <div id="showcase-track-anchor" className="h-[1600vh] relative z-5 pointer-events-none" ref={trackRef}></div>

      <main
        className="relative z-10 -mt-[55vh]"
        style={cta?.backgroundMedia?.type === 'image' ? {
          background: `linear-gradient(180deg, transparent 0, rgba(5,5,5,.6) 55vh, rgba(5,5,5,.85) 100%), url("${cta.backgroundMedia.url}") center 35% / cover no-repeat fixed, #050505`,
        } : undefined}
      >
        <section className="relative min-h-[70vh]">
          {/* radial glow wash — replaces the old ::before pseudo-element */}
          <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(225,27,35,0.06),transparent_70%)]" />
          {cta?.backgroundMedia?.type === 'video' && <video className="absolute inset-0 -z-2 w-full h-full object-cover [filter:brightness(.55)_saturate(.75)]" src={cta.backgroundMedia.url} poster={cta.backgroundMedia.poster} autoPlay muted loop playsInline />}
          <div className={`${wrapClass} flex justify-center`}>
            <div className={`${cardClass} mx-auto text-center max-w-[640px] shadow-[0_50px_110px_-40px_rgba(0,0,0,0.7)]`}>
              <div className={`${eyebrowClass} justify-center`}><span className={eyebrowBarClass}></span>{cta?.smallTitle || 'Get Started'}</div>
              <h2 className="font-barlow-condensed font-bold text-[#111] [font-size:clamp(30px,4.2vw,52px)] mb-[16px]">{cta?.heading || 'Plan your site setup.'}</h2>
              <p className="text-[#111] text-[16px] leading-[1.6] mb-[26px]">{cta?.description || 'Offices, security posts, bunk houses and store rooms — configured to your site, delivered across the region.'}</p>
              <div className="flex gap-[16px] mt-[34px] flex-wrap justify-center">
                <a className={btnPrimaryClass} href={cta?.primaryButton?.link || 'mailto:sales@quadcabins.in'}>{cta?.primaryButton?.text || 'Request a quote'}</a>
                <a className={cardBtnGhostClass} href={cta?.secondaryButton?.link || 'tel:+910000000000'}>{cta?.secondaryButton?.text || 'Call the works'}</a>
              </div>
            </div>
          </div>
        </section>

        <ContactFormSection onSubmit={submit} />
      </main>

      <Footer />
      <Toast show={toast} onClose={dismissToast}>{"Thanks — we'll get back to you shortly."}</Toast>
    </>
  );
}
