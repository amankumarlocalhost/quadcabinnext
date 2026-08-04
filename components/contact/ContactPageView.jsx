'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';

import ContactHero from '@/components/contact/ContactHero.jsx';
import ContactMapSection from '@/components/contact/ContactMapSection.jsx';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';

import { useAboutScroll } from '@/hooks/useAboutScroll.js';
import { useQuoteStore } from '@/lib/store/quoteStore.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function ContactPageView(){
  const formContent = useCmsSection('forms', 'global');
  const router = useRouter();
  const lenisRef = useRef(null);
  const toast = useQuoteStore((s) => s.toast);
  const dismissToast = useQuoteStore((s) => s.dismissToast);
  const submitQuote = useQuoteStore((s) => s.submit);

  useAboutScroll(lenisRef);

  const goTo = (sel)=>{
    if(document.querySelector(sel)){
      lenisRef.current?.scrollTo(sel, { offset: -20 });
    } else {
      router.push('/');
      setTimeout(()=>document.querySelector(sel)?.scrollIntoView({ behavior:'smooth' }), 60);
    }
  };

  const submit = (e)=>{
    e.preventDefault();
    submitQuote(e.currentTarget, 'contact');
  };

  return (
    <>
      <Header onNavHome={()=>router.push('/')} />

      <main className="relative z-10">
        <ContactHero />
        <ContactMapSection />
        <ContactFormSection onSubmit={submit} />
      </main>

      <Footer />
      <Toast show={toast} onClose={dismissToast}>{formContent?.successMessage || "Quote request received — we'll call you shortly."}</Toast>
    </>
  );
}
