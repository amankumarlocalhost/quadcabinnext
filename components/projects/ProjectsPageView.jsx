'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

import ProjectsHero from '@/components/projects/ProjectsHero.jsx';
import ProjectsGallerySection from '@/components/projects/ProjectsGallerySection.jsx';
import ProjectsCTASection from '@/components/projects/ProjectsCTASection.jsx';

import { useAboutScroll } from '@/hooks/useAboutScroll.js';

// Not wired into app/ routing — matches the current React app, which keeps
// this page's route commented out in App.jsx (its ProjectsSection embedded
// on the homepage is the only live "projects" surface). Kept here so the
// component still exists 1:1, same as upstream.
export default function ProjectsPageView(){
  const router = useRouter();
  const lenisRef = useRef(null);

  useAboutScroll(lenisRef);

  return (
    <>
      <Header onNavHome={()=>router.push('/')} />

      <main className="relative z-10">
        <ProjectsHero />
        <ProjectsGallerySection />
        <ProjectsCTASection />
      </main>

      <Footer />
    </>
  );
}
