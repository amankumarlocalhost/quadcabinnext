'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';

import IndustriesHero from '@/components/industries/IndustriesHero.jsx';
import IndustriesShowcase from '@/components/industries/IndustriesShowcase.jsx';
import IndustriesCTASection from '@/components/industries/IndustriesCTASection.jsx';

import { useAboutScroll } from '@/hooks/useAboutScroll.js';
import { useIndustriesPage, useIndustriesSeo } from '@/lib/services/industriesService.js';
import { useQuoteStore } from '@/lib/store/quoteStore.js';

export default function IndustriesPageView({ initialData = null }){
  const router = useRouter();
  const lenisRef = useRef(null);
  const industriesPage = useIndustriesPage(initialData);
  useIndustriesSeo(industriesPage);
  const toast = useQuoteStore((s) => s.toast);
  const dismissToast = useQuoteStore((s) => s.dismissToast);
  const submitQuote = useQuoteStore((s) => s.submit);

  useAboutScroll(lenisRef);

  const submit = (e) => {
    e.preventDefault();
    submitQuote(e.currentTarget, 'industries');
  };

  return (
    <>
      <Header onNavHome={()=>router.push('/')} />

      <main className="relative z-10">
        <IndustriesHero data={industriesPage?.hero} />
        <IndustriesShowcase data={industriesPage?.industries} />
        <IndustriesCTASection data={industriesPage?.closingCta} />
        <ContactFormSection onSubmit={submit} />
      </main>

      <Footer />
      <Toast show={toast} onClose={dismissToast}>{"Thanks — we'll get back to you shortly."}</Toast>
    </>
  );
}
