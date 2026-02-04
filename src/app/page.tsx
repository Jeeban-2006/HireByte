
"use client";

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { UpcomingUpdatesSection } from '@/components/layout/UpcomingUpdatesSection';
import { Footer } from '@/components/layout/Footer';
import type { ResumeBuilderSectionRef } from '@/components/resume/ResumeBuilderSection';

// Lazy load heavy components
const ATSTestingSection = lazy(() => import('@/components/layout/ATSTestingSection').then(mod => ({ default: mod.ATSTestingSection })));
const ResumeBuilderSection = lazy(() => import('@/components/resume/ResumeBuilderSection').then(mod => ({ default: mod.ResumeBuilderSection })));


export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const atsTestingRef = useRef<HTMLDivElement>(null);
  const resumeBuilderRef = useRef<HTMLDivElement>(null);
  const upcomingUpdatesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const resumeBuilderSectionRef = useRef<ResumeBuilderSectionRef>(null);

  useEffect(() => {
    // Show splash for 1.5 seconds then fade out for faster initial render
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToATS = () => scrollToSection(atsTestingRef);
  const scrollToBuilder = () => scrollToSection(resumeBuilderRef);
  const scrollToUpdates = () => scrollToSection(upcomingUpdatesRef);
  const scrollToTop = () => scrollToSection(heroRef);

  const handleAutofillFromATS = async (resumeText: string) => {
    if (resumeBuilderSectionRef.current?.handleAutofill) {
      await resumeBuilderSectionRef.current.handleAutofill(resumeText);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navigation 
          onScrollToATS={scrollToATS}
          onScrollToBuilder={scrollToBuilder}
          onScrollToUpdates={scrollToUpdates}
        />
        
        <main className="min-h-screen" itemScope itemType="https://schema.org/WebApplication">
          <meta itemProp="name" content="HireByte - AI Resume Builder" />
          <meta itemProp="description" content="Free AI-powered resume builder with ATS compatibility checking" />
          <meta itemProp="url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://hirebyte.netlify.app"} />
          
          <div ref={heroRef}>
            <HeroSection 
              onScrollToATS={scrollToATS}
              onScrollToBuilder={scrollToBuilder}
              onScrollToUpdates={scrollToUpdates}
            />
          </div>
          
          <FeaturesSection />
          
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <section ref={atsTestingRef} className="section-transition" aria-labelledby="ats-testing-heading">
              <h2 id="ats-testing-heading" className="sr-only">ATS Resume Testing and Analysis</h2>
              <ATSTestingSection 
                onScrollToBuilder={scrollToBuilder}
                onAutofillResume={handleAutofillFromATS}
              />
            </section>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>}>
            <section ref={resumeBuilderRef} className="section-transition" aria-labelledby="resume-builder-heading">
              <h2 id="resume-builder-heading" className="sr-only">Professional Resume Builder</h2>
              <ResumeBuilderSection 
                ref={resumeBuilderSectionRef}
                onBackToTop={scrollToTop}
              />
            </section>
          </Suspense>
          
          <section ref={upcomingUpdatesRef} className="section-transition" aria-labelledby="next-up-heading">
            <h2 id="next-up-heading" className="sr-only">Next Up - Upcoming Features</h2>
            <UpcomingUpdatesSection />
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
