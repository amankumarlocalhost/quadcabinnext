'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';

import AboutHero from '@/components/about/AboutHero.jsx';
import OurStorySection from '@/components/about/OurStorySection.jsx';
import WhoWeAreSection from '@/components/about/WhoWeAreSection.jsx';
import WhyChooseUsSection from '@/components/about/WhyChooseUsSection.jsx';
import StatsSection from '@/components/about/StatsSection.jsx';
import AboutCTASection from '@/components/about/AboutCTASection.jsx';

import { useAboutScroll } from '@/hooks/useAboutScroll.js';
import { useQuoteStore } from '@/lib/store/quoteStore.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function AboutPageView(){
  const formContent = useCmsSection('forms', 'global');
  const router = useRouter();
  const lenisRef = useRef(null);
  const toast = useQuoteStore((s) => s.toast);
  const dismissToast = useQuoteStore((s) => s.dismissToast);
  const submitQuote = useQuoteStore((s) => s.submit);

  useAboutScroll(lenisRef);

  const submit = (e)=>{
    e.preventDefault();
    submitQuote(e.currentTarget, 'about');
  };

  const goTo = (sel)=>{
    if(document.querySelector(sel)){
      lenisRef.current?.scrollTo(sel, { offset: -20 });
    } else {
      router.push('/');
      setTimeout(()=>document.querySelector(sel)?.scrollIntoView({ behavior:'smooth' }), 60);
    }
  };

  return (
    <>
      <Header onNavHome={()=>router.push('/')} />

      <main className="relative z-10">
        <AboutHero onGoTo={goTo} />
        <OurStorySection />
        <WhoWeAreSection />
        <WhyChooseUsSection />
        <StatsSection />
        <AboutCTASection onSubmit={submit} />
      </main>

      <Footer />
      <Toast show={toast} onClose={dismissToast}>{formContent?.successMessage || 'Thanks — we will get back to you shortly.'}</Toast>
    </>
  );
}
