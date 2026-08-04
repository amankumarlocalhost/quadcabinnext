'use client';

import { useRef, useState } from 'react';
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
import { submitQuoteForm } from '@/lib/cms/quotes.js';

export default function IndustriesPageView({ initialData = null }){
  const router = useRouter();
  const lenisRef = useRef(null);
  const industriesPage = useIndustriesPage(initialData);
  useIndustriesSeo(industriesPage);
  const [toast, setToast] = useState(false);

  useAboutScroll(lenisRef);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await submitQuoteForm(form, 'industries');
      form.reset();
      setToast(true);
      setTimeout(() => setToast(false), 3200);
    } catch (error) {
      window.alert(error.message);
    }
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
      <Toast show={toast} onClose={() => setToast(false)}>{"Thanks — we'll get back to you shortly."}</Toast>
    </>
  );
}
