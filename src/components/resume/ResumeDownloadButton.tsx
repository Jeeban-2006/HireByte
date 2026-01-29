'use client';

import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Resume } from '@/lib/types/resume-types';

interface ResumeDownloadButtonProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

// Import PDF components dynamically
let PDFDownloadLink: any = null;
let ResumePDF: any = null;

if (typeof window !== 'undefined') {
  import('@react-pdf/renderer').then((mod) => {
    PDFDownloadLink = mod.PDFDownloadLink;
  });
  import('@/components/resume/ResumePDF').then((mod) => {
    ResumePDF = mod.ResumePDF;
  });
}

export const ResumeDownloadButton = memo(function ResumeDownloadButton({ 
  resumeData, 
  sectionOrder 
}: ResumeDownloadButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isComponentsLoaded, setIsComponentsLoaded] = useState(false);

  const handleClick = useCallback(async () => {
    if (!isComponentsLoaded) {
      // Load components
      const [pdfMod, resumePDFMod] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/resume/ResumePDF')
      ]);
      PDFDownloadLink = pdfMod.PDFDownloadLink;
      ResumePDF = resumePDFMod.ResumePDF;
      setIsComponentsLoaded(true);
    }
    setIsReady(true);
  }, [isComponentsLoaded]);

  const fileName = `${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'resume'}.pdf`;

  // Only render PDFDownloadLink when user clicks the button and components are loaded
  if (!isReady || !isComponentsLoaded || !PDFDownloadLink || !ResumePDF) {
    return (
      <Button onClick={handleClick} className="gap-2">
        <Download className="h-4 w-4" />
        {isReady && !isComponentsLoaded ? 'Loading...' : 'Prepare Download'}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ResumePDF resume={resumeData} sectionOrder={sectionOrder} />}
      fileName={fileName}
      className="inline-block"
    >
      {({ loading }: any) => (
        <Button disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
});
