'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';

// three.js + fiber + drei + postprocessing are a heavy parse/exec cost —
// dynamically imported client-only, same as the home page's Experience canvas.
const ProductHeroCabin = dynamic(() => import('@/journey/showcase/ProductHeroCabin.jsx'), { ssr: false });

import Scene from '@/journey/showcase/Scene.jsx';
import CopyOverlay from '@/journey/showcase/CopyOverlay.jsx';
import CabinDots from '@/journey/showcase/CabinDots.jsx';
import { useShowcaseScroll } from '@/journey/showcase/useShowcaseScroll.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { useProductsPage, useProductsSeo } from '@/lib/services/productsService.js';
import { submitQuoteForm } from '@/lib/cms/quotes.js';
import {
  wrapClass, eyebrowClass, eyebrowBarClass, h1Class, h2Class, scrollCueClass, scrollCueLineClass,
  cardClass, btnPrimaryClass, btnGhostClass,
} from '@/lib/ui/classNames.js';

export default function ProductsPageView({ initialData = null }){
  const legacyIntro = useCmsSection('intro');
  const legacyProducts = useCmsSection('products');
  const legacyCta = useCmsSection('cta');
  const productsPage = useProductsPage(initialData);
  useProductsSeo(productsPage);
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
  const [toast, setToast] = useState(false);

  useShowcaseScroll({ trackRef, heroRef, productsData });

  const goTo = (sel)=>{
    router.push('/');
    setTimeout(()=>{
      document.querySelector(sel)?.scrollIntoView({ behavior:'smooth' });
    }, 60);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await submitQuoteForm(form, 'products');
      form.reset();
      setToast(true);
      setTimeout(() => setToast(false), 3200);
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <>
      <Scene productsData={productsData} heroMedia={intro?.backgroundMedia} />

      <Header onNavHome={()=>router.push('/')} />

      <div
        className="fixed inset-0 z-2 flex items-center pointer-events-none will-change-[opacity,transform] pt-[150px] max-[900px]:pt-[130px]"
        ref={heroRef}
      >
        {/* soft depth wash — replaces the old ::before pseudo-element */}
        <div aria-hidden="true" className="absolute inset-0 -z-1 pointer-events-none bg-[radial-gradient(48%_60%_at_18%_46%,rgba(225,27,35,0.05),transparent_70%),radial-gradient(55%_65%_at_82%_50%,rgba(255,255,255,0.045),transparent_72%)]" />
        <div className={`${wrapClass} max-[900px]:px-[20px] flex items-center justify-between gap-[56px] min-[901px]:max-[1366px]:gap-[30px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:justify-center max-[900px]:gap-[22px]`}>
          <div className="max-w-[600px] pointer-events-auto">
            <div className={eyebrowClass}><span className={eyebrowBarClass}></span>{intro?.smallTitle || 'Our Cabins'}</div>
            <h1 className={`${h1Class} [font-size:clamp(34px,7.4vw,72px)] max-w-[760px] mt-[14px] max-[900px]:mt-[10px]`}>
              {intro?.mainHeading ? <>{intro.mainHeading.split(intro.highlightedText || 'walk-around')[0]}<span className="text-brand-red">{intro.highlightedText || 'walk-around'}</span>{intro.mainHeading.split(intro.highlightedText || 'walk-around')[1]}</> : <>Four cabins.<br/>One <span className="text-brand-red">walk-around</span>.</>}
            </h1>
            <p className="text-[17px] text-brand-off max-w-[460px] mt-[18px]">{intro?.description || 'Explore the full Quad Cabins range — Site Office, Labour Accommodation, Conference and Storage.'}</p>
            <div className="flex mt-[26px] border-t border-white/14 max-w-[460px] min-[901px]:max-[1366px]:max-w-[400px] max-[900px]:hidden">
              <div className="flex-1 border-l border-white/14 pt-[14px] px-[14px] first:border-l-0 first:pl-0"><strong className="block font-anton text-[24px] text-brand-white leading-none">360°</strong><span className="block mt-[6px] font-mono text-[9.5px] tracking-[0.08em] uppercase text-brand-steel leading-[1.4]">Drag to rotate</span></div>
              <div className="flex-1 border-l border-white/14 pt-[14px] px-[14px]"><strong className="block font-anton text-[24px] text-brand-white leading-none">4</strong><span className="block mt-[6px] font-mono text-[9.5px] tracking-[0.08em] uppercase text-brand-steel leading-[1.4]">Cabin ranges</span></div>
              <div className="flex-1 border-l border-white/14 pt-[14px] px-[14px]"><strong className="block font-anton text-[24px] text-brand-white leading-none">PBR</strong><span className="block mt-[6px] font-mono text-[9.5px] tracking-[0.08em] uppercase text-brand-steel leading-[1.4]">Real-material render</span></div>
            </div>
            <div
              className={`${scrollCueClass} static items-start transform-none mt-[34px] max-[900px]:mt-[18px]`}
              role="link"
              onClick={() => document.querySelector('#showcase-track-anchor')?.scrollIntoView({ behavior:'smooth' })}
            >
              <span>{intro?.cta?.text || intro?.scrollLabel || 'Scroll to explore'}</span>
              <span className={scrollCueLineClass}></span>
            </div>
          </div>
          <div className="relative flex-none pointer-events-auto w-[min(42vw,600px)] min-[901px]:max-[1366px]:w-[min(38vw,460px)] max-[900px]:pointer-events-auto max-[900px]:self-center max-[900px]:w-[min(92vw,430px)] [@media(max-width:900px)_and_(max-height:640px)]:hidden">
            <div aria-hidden="true" className="absolute -z-1 pointer-events-none [inset:-14%] bg-[radial-gradient(58%_58%_at_50%_52%,rgba(225,27,35,0.16),transparent_68%)] blur-[6px]" />
            <div className="relative aspect-[5/4] max-[900px]:max-h-[38vh] [&>canvas]:w-full! [&>canvas]:h-full! [&>canvas]:block [filter:saturate(0.92)_contrast(1.06)_brightness(0.96)]">
              <ProductHeroCabin />
              <span className="absolute left-1/2 bottom-[16px] -translate-x-1/2 pointer-events-none select-none font-mono text-[10px] tracking-[0.16em] uppercase text-brand-off/80 border border-white/16 rounded-full px-[14px] py-[7px] bg-[rgba(10,10,11,0.45)] backdrop-blur-[6px] opacity-0 animate-[hint-fade_0.6s_ease_forwards] [animation-delay:1.1s]">Drag to rotate</span>
            </div>
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
                <a className="font-barlow-condensed font-bold text-[15px] tracking-[0.08em] uppercase cursor-pointer border-2 transition-all duration-[220ms] ease-in-out inline-flex items-center gap-[10px] p-[16px_30px] border-[#111] text-[#111] bg-transparent hover:bg-[#111] hover:text-[#f7f7f5]" href={cta?.secondaryButton?.link || 'tel:+910000000000'}>{cta?.secondaryButton?.text || 'Call the works'}</a>
              </div>
            </div>
          </div>
        </section>

        <ContactFormSection onSubmit={submit} />
      </main>

      <Footer />
      <Toast show={toast} onClose={() => setToast(false)}>{"Thanks — we'll get back to you shortly."}</Toast>
    </>
  );
}
