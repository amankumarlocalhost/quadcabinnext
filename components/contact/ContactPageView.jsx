'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';

import ContactHero from '@/components/contact/ContactHero.jsx';
import ContactMapSection from '@/components/contact/ContactMapSection.jsx';
import ContactFormSection from '@/components/contact/ContactFormSection.jsx';

import { useAboutScroll } from '@/hooks/useAboutScroll.js';
import { submitQuoteForm } from '@/lib/cms/quotes.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';

export default function ContactPageView(){
  const formContent = useCmsSection('forms', 'global');
  const router = useRouter();
  const lenisRef = useRef(null);
  const [toast, setToast] = useState(false);

  useAboutScroll(lenisRef);

  const goTo = (sel)=>{
    if(document.querySelector(sel)){
      lenisRef.current?.scrollTo(sel, { offset: -20 });
    } else {
      router.push('/');
      setTimeout(()=>document.querySelector(sel)?.scrollIntoView({ behavior:'smooth' }), 60);
    }
  };

  const submit = async (e)=>{
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await submitQuoteForm(form, 'contact');
      form.reset();
      setToast(true);
      setTimeout(()=>setToast(false), 3200);
    } catch (error) {
      window.alert(error.message);
    }
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
      <Toast show={toast} onClose={() => setToast(false)}>{formContent?.successMessage || "Quote request received — we'll call you shortly."}</Toast>
    </>
  );
}
