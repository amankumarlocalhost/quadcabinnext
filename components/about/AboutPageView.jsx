'use client';

import { useRef, useState } from 'react';
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
import { submitQuoteForm } from '@/lib/cms/quotes.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function AboutPageView(){
  const formContent = useCmsSection('forms', 'global');
  const router = useRouter();
  const lenisRef = useRef(null);
  const [toast, setToast] = useState(false);

  useAboutScroll(lenisRef);

  const submit = async (e)=>{
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await submitQuoteForm(form, 'about');
      form.reset();
      setToast(true);
      setTimeout(()=>setToast(false), 3200);
    } catch (error) {
      window.alert(error.message);
    }
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
      <Toast show={toast} onClose={() => setToast(false)}>{formContent?.successMessage || 'Thanks — we will get back to you shortly.'}</Toast>
    </>
  );
}
