"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import type { Resume, AtsScoreResumeOutput } from '@/lib/types/resume-types';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initialResumeData } from '@/lib/templates/resume-template-builder';

// Dynamically import ResumePreview to avoid SSR issues with @react-pdf/renderer
const ResumePreview = dynamic(() => import('@/components/resume/ResumePreview').then(mod => ({ default: mod.ResumePreview })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px] bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="text-slate-600 dark:text-slate-400">Loading preview...</div>
    </div>
  )
});

const RESUME_STORAGE_KEY = 'firebase-studio-resume-data';

interface ResumeBuilderSectionProps {
  onBackToTop: () => void;
}

export interface ResumeBuilderSectionRef {
  handleAutofill: (resumeText: string) => Promise<void>;
}

export const ResumeBuilderSection = forwardRef<ResumeBuilderSectionRef, ResumeBuilderSectionProps>(
  function ResumeBuilderSection({ onBackToTop }, ref) {
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const [resumeData, setResumeData] = useState<Resume>(() => {
    if (typeof window === 'undefined') {
      return initialResumeData;
    }
    try {
      const savedResume = window.localStorage.getItem(RESUME_STORAGE_KEY);
      return savedResume ? JSON.parse(savedResume) : initialResumeData;
    } catch (error) {
      console.error("Error loading resume from localStorage", error);
      return initialResumeData;
    }
  });

  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'personal-info',
    'summary',
    'skills',
    'education',
    'experience',
    'projects',
    'certifications',
    'awards',
    'volunteer',
    'languages',
    'job-description'
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResumeOutput | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  // Expose handleAutofill method to parent via ref
  useImperativeHandle(ref, () => ({
    handleAutofill: async (resumeText: string) => {
      try {
        // Call the parse-resume API
        const response = await fetch('/api/ai/parse-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeText }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse resume');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          // Completely replace resume data with parsed data (no cache/default values)
          setResumeData({
            personalInfo: result.data.personalInfo || {
              name: '',
              email: '',
              phone: '',
              address: '',
              linkedin: '',
              portfolio: '',
              github: '',
            },
            summary: result.data.summary || '',
            experience: result.data.experience || [],
            education: result.data.education || [],
            skills: result.data.skills || [],
            projects: result.data.projects || [],
            certifications: result.data.certifications || [],
            awards: result.data.awards || [],
            volunteerExperience: result.data.volunteerExperience || [],
            languages: result.data.languages || [],
            sectionOrder: undefined,
            hiddenSections: undefined,
          });
        }
      } catch (error) {
        console.error('Error parsing resume:', error);
        throw error;
      }
    },
  }), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error("Error saving resume to localStorage", error);
    }
  }, [resumeData]);

  const handleGetAtsScore = async (jobDesc: string) => {
    if (!jobDesc.trim()) {
      toast({
        variant: 'destructive',
        title: 'Job Description Required',
        description: 'Please provide a job description to analyze your resume.',
      });
      return;
    }

    setIsLoading(true);
    setJobDescription(jobDesc);
    
    try {
      // Extract resume text
      const resumeText = `
Name: ${resumeData.personalInfo.name}

SUMMARY:
${resumeData.summary || 'N/A'}

Contact: ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}



EDUCATION:
${resumeData.education.map(edu => `${edu.degree} from ${edu.school} (${edu.graduationDate})`).join('\n')}


EXPERIENCE:
${resumeData.experience.map(exp => `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}`).join('\n\n')}


SKILLS:
${resumeData.skills.join(', ')}
      `.trim();

      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDesc,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const result = await response.json();
      setAtsResult(result);
      
      toast({
        title: 'Analysis Complete!',
        description: 'Your resume has been scored successfully.',
      });
    } catch (error) {
      console.error('Error getting ATS score:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="resume-builder" 
      className={`py-32 relative transition-all duration-1000 ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
                <FileText className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Resume workspace</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Build Your Perfect Resume
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Create a professional, ATS-optimized resume in minutes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Professional template
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left - Resume Builder */}
            <div className="space-y-8 print:hidden">
              <div className="bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                <ResumeBuilder 
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  handleScore={() => handleGetAtsScore(jobDescription)}
                  isLoading={isLoading}
                  atsResult={atsResult}
                  sectionOrder={sectionOrder}
                  setSectionOrder={setSectionOrder}
                />
              </div>
            </div>
            
            {/* Right - Resume Preview with Canvas */}
            <div className="space-y-8 print:w-full print:p-0 print:m-0">
              <div className="relative">
                {/* Canvas with subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/30 pointer-events-none rounded-2xl" />
                <ResumePreview resumeData={resumeData} sectionOrder={sectionOrder} />
              </div>

              {/* AI Suggestions Mini Panel */}
              {atsResult && (
                <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">AI Suggestions</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                        Score: {atsResult.score}/100 • 
                        {atsResult.score >= 75 ? " Excellent match!" : 
                         atsResult.score >= 50 ? " Good, but can improve" : 
                         " Needs improvement"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </section>
  );
});