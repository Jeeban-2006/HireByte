
"use client";

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { HeroSection } from '@/components/layout/HeroSection';
import { ATSTestingSection } from '@/components/layout/ATSTestingSection';
import { ResumeBuilderSection, type ResumeBuilderSectionRef } from '@/components/resume/ResumeBuilderSection';
import { AIResumeDialog } from '@/components/ai/AIResumeDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const atsTestingRef = useRef<HTMLDivElement>(null);
  const resumeBuilderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const resumeBuilderSectionRef = useRef<ResumeBuilderSectionRef>(null);

  useEffect(() => {
    // Show splash for 3 seconds then fade out
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
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
  const scrollToTop = () => scrollToSection(heroRef);
  const openAIDialog = () => setShowComingSoon(true);

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
          onOpenAIDialog={openAIDialog}
        />
        
        <main className="min-h-screen" itemScope itemType="https://schema.org/WebApplication">
          <meta itemProp="name" content="HireByte - AI Resume Builder" />
          <meta itemProp="description" content="Free AI-powered resume builder with ATS compatibility checking" />
          <meta itemProp="url" content={process.env.NEXT_PUBLIC_SITE_URL || "https://hirebyte.netlify.app"} />
          
          <div ref={heroRef}>
            <HeroSection 
              onScrollToATS={scrollToATS}
              onScrollToBuilder={scrollToBuilder}
              onOpenAIDialog={openAIDialog}
            />
          </div>
          
          <section ref={atsTestingRef} className="section-transition" aria-labelledby="ats-testing-heading">
            <h2 id="ats-testing-heading" className="sr-only">ATS Resume Testing and Analysis</h2>
            <ATSTestingSection 
              onScrollToBuilder={scrollToBuilder}
              onAutofillResume={handleAutofillFromATS}
            />
          </section>
          
          <section ref={resumeBuilderRef} className="section-transition" aria-labelledby="resume-builder-heading">
            <h2 id="resume-builder-heading" className="sr-only">Professional Resume Builder</h2>
            <ResumeBuilderSection 
              ref={resumeBuilderSectionRef}
              onBackToTop={scrollToTop}
            />
          </section>
        </main>
      </div>
      
      <AIResumeDialog 
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
      />

      <AlertDialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <AlertDialogContent className="border-primary/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Coming Soon! 🚀</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4">
              The AI Resume Creation feature is coming soon. We're working hard to bring you an amazing experience to create professional resumes through conversation with our AI assistant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction className="mt-4">Got it!</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
