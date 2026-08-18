'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHomeScroll } from '@/hooks/useHomeScroll.js';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Toast from '@/components/layout/Toast.jsx';

import Hero from '@/components/home/Hero.jsx';
import SiteOfficeSection from '@/components/home/SiteOfficeSection.jsx';
import ProductSection from '@/components/home/ProductSection.jsx';
import IndustriesSection from '@/components/home/IndustriesSection.jsx';
import ProjectsSection from '@/components/home/ProjectsSection.jsx';
import TestimonialsSection from '@/components/home/TestimonialsSection.jsx';
import ContactSection from '@/components/home/ContactSection.jsx';

import { products } from '@/lib/data/products.js';
import { useCmsSection } from '@/lib/cms/CmsContext.js';
import { useQuoteStore } from '@/lib/store/quoteStore.js';

gsap.registerPlugin(ScrollTrigger);

export default function HomePageView() {
  const productContent = useCmsSection('products');
  const formContent = useCmsSection('forms', 'global');
  const cmsProducts = productContent?.items;
  const siteOffice = cmsProducts?.find((product) => product.id === 'site-office');
  const followingProducts = cmsProducts?.filter((product) => product.id !== 'site-office') || products;
  const lenisRef = useRef(null);

  const toast = useQuoteStore((s) => s.toast);
  const dismissToast = useQuoteStore((s) => s.dismissToast);
  const submitQuote = useQuoteStore((s) => s.submit);

  // Always start from the top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, {
        immediate: true,
      });
    });
  }, []);

  useHomeScroll(lenisRef);

  const goTo = (sel) => {
    lenisRef.current?.scrollTo(sel, {
      offset: -20,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    submitQuote(e.currentTarget, 'home');
  };

  return (
    <>
      <Header onNavHome={() => lenisRef.current?.scrollTo(0)} />

      <Hero onGoTo={goTo} />

      {/* Main Content */}
      {/* This multi-layer `background` shorthand (gradient + fixed photo + a
          `url()` containing querystring characters) is too fragile to
          express safely as a Tailwind arbitrary-value className — the
          underscore-for-space escaping Tailwind relies on collides with the
          URL's own characters. Kept as inline style as a deliberate, narrow
          exception; every other style on this page is a Tailwind className. */}
      <main
        className="relative z-10"
        style={{
          background: "linear-gradient(180deg, transparent 0, rgba(5,5,5,0.6) 55vh, rgba(5,5,5,0.85) 100%), url('https://images.unsplash.com/photo-1722079358008-2c72a8973998?fm=jpg&q=80&w=2400&auto=format&fit=crop') center 35% / cover no-repeat fixed, #050505",
        }}
      >
        <SiteOfficeSection onGoTo={goTo} content={siteOffice} enquiryLabel={productContent?.enquiryLabel} />

        {followingProducts.map((p, index) => (
          <ProductSection
            key={p.id}
            {...p}
            desc={p.desc || p.description}
            right={p.right ?? index % 2 === 0}
            images={p.images}
            enquiryLabel={productContent?.enquiryLabel}
            onGoTo={goTo}
          />
        ))}

        <IndustriesSection />
        <ProjectsSection />
        <TestimonialsSection />

        <ContactSection onSubmit={submit} />
      </main>

      <Footer />

      <Toast show={toast} onClose={dismissToast}>
        {formContent?.successMessage || "Quote request received — we'll call you shortly."}
      </Toast>
    </>
  );
}
