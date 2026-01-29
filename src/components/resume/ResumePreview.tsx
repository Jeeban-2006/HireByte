"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/lib/types/resume-types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin, ExternalLink, Link as LinkIcon, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/general-utils";
import { ResumeDownloadButton } from "@/components/resume/ResumeDownloadButton";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ResumePreviewProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

export function ResumePreview({ resumeData, sectionOrder }: ResumePreviewProps) {
  const defaultSectionOrder = [
    'summary',
    'experience',
    'projects',
    'education',
    'skills',
    'certifications',
    'awards',
    'volunteer',
    'languages'
  ];
  
  const hiddenSections = resumeData.hiddenSections || [];
  const sections = (sectionOrder?.filter(s => s !== 'personal-info' && s !== 'job-description' && !hiddenSections.includes(s)) || defaultSectionOrder)
    .filter(s => !hiddenSections.includes(s));

  const handlePrint = async () => {
    try {
      const button = document.querySelector('.download-pdf-btn') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const sectionCount = [
        resumeData.summary,
        resumeData.experience?.length,
        resumeData.education?.length,
        resumeData.projects?.length,
        resumeData.skills?.length,
        resumeData.certifications?.length,
      ].filter(Boolean).length;

      const baseSpacing = sectionCount > 4 ? 5 : 7;
      const sectionGap = sectionCount > 4 ? 6 : 8;
      
      let yPos = 15;
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);

      const addLink = (text: string, url: string, x: number, y: number, fontSize = 9) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 86, 193);
        const textWidth = pdf.getTextWidth(text);
        (pdf as any).textWithLink(text, x, y, { url: url });
        pdf.setTextColor(0, 0, 0);
        return textWidth;
      };

      const nameFontSize = sectionCount < 3 ? 24 : 20;
      pdf.setFontSize(nameFontSize);
      pdf.setFont('helvetica', 'bold');
      const name = resumeData.personalInfo.name || 'Your Name';
      const nameWidth = pdf.getTextWidth(name);
      pdf.text(name, (pageWidth - nameWidth) / 2, yPos);
      yPos += sectionCount < 3 ? 8 : 7;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const contactInfo = [];
      if (resumeData.personalInfo.address) contactInfo.push(resumeData.personalInfo.address);
      if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
      
      if (contactInfo.length > 0) {
        const contactLine = contactInfo.join(' | ');
        const contactWidth = pdf.getTextWidth(contactLine);
        pdf.text(contactLine, (pageWidth - contactWidth) / 2, yPos);
        yPos += 5;
      }

      const links = [];
      if (resumeData.personalInfo.linkedin) links.push({ text: 'LinkedIn', url: resumeData.personalInfo.linkedin });
      if (resumeData.personalInfo.github) links.push({ text: 'GitHub', url: resumeData.personalInfo.github });
      if (resumeData.personalInfo.portfolio) links.push({ text: 'Portfolio', url: resumeData.personalInfo.portfolio });
      
      if (links.length > 0) {
        const linksText = links.map(l => l.text).join(' | ');
        const linksWidth = pdf.getTextWidth(linksText);
        let linkX = (pageWidth - linksWidth) / 2;
        links.forEach((link, index) => {
          if (index > 0) {
            pdf.text(' | ', linkX, yPos);
            linkX += pdf.getTextWidth(' | ');
          }
          const textWidth = addLink(link.text, link.url.startsWith('http') ? link.url : `https://${link.url}`, linkX, yPos);
          linkX += textWidth;
        });
        yPos += 7;
      } else {
        yPos += 2;
      }

      if (resumeData.summary) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL SUMMARY', margin, yPos);
        yPos += baseSpacing;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
        summaryLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += sectionGap;
      }

      if (resumeData.experience && resumeData.experience.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('WORK EXPERIENCE', margin, yPos);
        yPos += baseSpacing;

        const expCount = resumeData.experience.length;
        const bulletLimit = expCount > 2 ? 2 : 3;

        resumeData.experience.forEach((exp, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(exp.jobTitle || '', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
          const dateWidth = pdf.getTextWidth(dateText);
          pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
          yPos += 5;

          pdf.setFont('helvetica', 'italic');
          pdf.text(exp.company || '', margin, yPos);
          if (exp.location) {
            const locWidth = pdf.getTextWidth(exp.location);
            pdf.text(exp.location, pageWidth - margin - locWidth, yPos);
          }
          yPos += 5;

          pdf.setFont('helvetica', 'normal');
          if (exp.description) {
            const bullets = exp.description.split('\n').filter(line => line.trim());
            bullets.slice(0, bulletLimit).forEach((bullet) => {
              const cleanBullet = bullet.replace(/^- /, '');
              const bulletLines = pdf.splitTextToSize(`• ${cleanBullet}`, contentWidth - 3);
              bulletLines.forEach((line: string) => {
                if (yPos > 280) {
                  pdf.addPage();
                  yPos = 15;
                }
                pdf.text(line, margin + 3, yPos);
                yPos += 5;
              });
            });
          }
          yPos += index < expCount - 1 ? 5 : sectionGap;
        });
      }

      if (resumeData.education && resumeData.education.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', margin, yPos);
        yPos += baseSpacing;

        resumeData.education.forEach((edu, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(edu.degree || '', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          const dateWidth = pdf.getTextWidth(edu.graduationDate || '');
          pdf.text(edu.graduationDate || '', pageWidth - margin - dateWidth, yPos);
          yPos += 5;

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text(edu.school || '', margin, yPos);
          if (edu.location) {
            const locWidth = pdf.getTextWidth(edu.location);
            pdf.text(edu.location, pageWidth - margin - locWidth, yPos);
          }
          yPos += index < resumeData.education.length - 1 ? 6 : sectionGap;
        });
      }

      if (resumeData.skills && resumeData.skills.length > 0) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', margin, yPos);
        yPos += baseSpacing;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const skillsText = resumeData.skills.filter(s => s).join(', ');
        const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
        skillsLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += sectionGap;
      }

      const fileName = `${resumeData.personalInfo.name || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);

      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      const button = document.querySelector('.download-pdf-btn') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download PDF';
      }
    }
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate page count based on actual A4 dimensions
  useEffect(() => {
    const calculatePageCount = () => {
      const previewElement = document.getElementById('resume-preview-content');
      if (previewElement) {
        const height = previewElement.scrollHeight;
        // A4 dimensions at 96 DPI: 794px × 1123px
        // Account for padding (p-2 md:p-3 = 8-12px on each side)
        // Content height per page: ~1100px (with margins)
        const pageHeight = 1100;
        const calculatedPages = Math.max(1, Math.ceil(height / pageHeight));
        
        // Only update if the change is significant (prevents random jumps)
        if (Math.abs(calculatedPages - pageCount) >= 1) {
          setPageCount(calculatedPages);
          // Reset to page 1 if current page exceeds new page count
          if (currentPage > calculatedPages) {
            setCurrentPage(1);
          }
        }
      }
    };

    // Debounce the calculation to prevent rapid updates
    const timer = setTimeout(calculatePageCount, 300);
    return () => clearTimeout(timer);
  }, [resumeData, sectionOrder, pageCount, currentPage]);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const ensureUrlScheme = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  }

  const renderSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!data || data.length === 0) return null;
    return (
      <section key={title} className="mb-1.5 print:mb-1 print:page-break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">{title}</h2>
        <div className="space-y-1 print:space-y-0.5">
          {data.map((item, index) => (
            <React.Fragment key={item.id || item.name || index}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  };

  const renderSimpleListSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!data || data.length === 0) return null;
    return (
      <section key={title} className="mb-1.5 print:mb-1 print:page-break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">{title}</h2>
        <ul className="list-disc list-inside mt-0 text-xs text-muted-foreground/90 print:text-xs print:mt-0">
          {data.map((item, index) => (
            <li key={item.id || item.name || index}>{renderItem(item, index)}</li>
          ))}
        </ul>
      </section>
    );
  };

  const renderSectionById = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return resumeData.summary ? (
          <section key="summary" className="mb-1.5 print:mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">Summary</h2>
            <p className="text-muted-foreground/90 text-xs leading-tight print:leading-tight print:text-xs">{resumeData.summary}</p>
          </section>
        ) : null;
      
      case 'experience':
        return renderSection("Experience", resumeData.experience, (exp) => (
          <div key={exp.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{exp.jobTitle}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-muted-foreground text-xs gap-1">
              <p className="italic">{exp.company}</p>
              <p className="italic text-xs whitespace-nowrap">{exp.location}</p>
            </div>
            <ul className="list-disc list-inside mt-0.5 text-muted-foreground/90 text-xs leading-tight print:text-black">
              {exp.description.split('\n').slice(0, 2).map((line: string, i: number) => line && <li key={i} className="text-xs">{line.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ));
      
      case 'projects':
        return renderSection("Projects", resumeData.projects, (proj) => (
          <div key={proj.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{proj.name}</h3>
              {proj.link && (
                <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5 transition-colors whitespace-nowrap">
                  View <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <p className="mt-0 text-muted-foreground/90 text-xs">{proj.description}</p>
          </div>
        ));
      
      case 'education':
        return renderSection("Education", resumeData.education, (edu) => (
          <div key={edu.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{edu.school}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{edu.graduationDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-muted-foreground text-xs gap-1">
              <div>
                <p className="italic text-xs">{edu.degree}</p>
                {edu.grade && (
                  <p className="text-xs mt-0">
                    <span className="font-medium">Grade:</span> {edu.grade}
                  </p>
                )}
              </div>
              <p className="italic text-xs whitespace-nowrap">{edu.location}</p>
            </div>
          </div>
        ));
      
      case 'certifications':
        return renderSection("Certifications", resumeData.certifications, (cert) => (
          <div key={cert.id}>
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{cert.name}</h3>
                {cert.link && (
                  <a href={ensureUrlScheme(cert.link)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 transition-colors">
                    <LinkIcon className="h-3 w-3" /> View
                  </a>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{cert.date}</span>
            </div>
            <p className="italic text-muted-foreground">{cert.authority}</p>
          </div>
        ));
      
      case 'awards':
        return renderSimpleListSection("Awards & Achievements", resumeData.awards, (award) => (
          <span key={award.id} className="flex items-center gap-2">
            <span>{award.name}</span>
            {award.link && (
              <a href={ensureUrlScheme(award.link)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 transition-colors">
                <LinkIcon className="h-3 w-3" /> View
              </a>
            )}
          </span>
        ));
      
      case 'volunteer':
        return renderSection("Volunteer Experience", resumeData.volunteerExperience, (vol) => (
          <div key={vol.id}>
            <div className="flex justify-between items-baseline">
              <h3 className="font-semibold">{vol.role}</h3>
              <span className="text-xs text-muted-foreground">{vol.dates}</span>
            </div>
            <p className="italic text-muted-foreground">{vol.organization}</p>
            <p className="mt-1 text-muted-foreground/90">{vol.description}</p>
          </div>
        ));
      
      case 'skills':
        return resumeData.skills && resumeData.skills.length > 0 ? (
          <section key="skills" className="mb-4 md:mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2 screen-skills-display">
              {resumeData.skills.map((skill) => (
                skill && <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-primary/20">{skill}</span>
              ))}
            </div>
            <div className="hidden print-skills-display">
              <p className="text-muted-foreground/90">{resumeData.skills.join(", ")}</p>
            </div>
          </section>
        ) : null;
      
      case 'languages':
        return resumeData.languages && resumeData.languages.length > 0 ? (
          <section key="languages" className="mb-4 md:mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Languages</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {resumeData.languages.map((lang) => (
                lang.name && <div key={lang.id}><span className="font-semibold">{lang.name}:</span> <span className="text-muted-foreground">{lang.proficiency}</span></div>
              ))}
            </div>
          </section>
        ) : null;
      
      default:
        return null;
    }
  };

 return (
  <>
    {/* Page Count Indicator with Navigation */}
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
          </span>
        </div>
        
        {/* Page Navigation */}
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 border-slate-300 dark:border-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="h-8 px-2 border-slate-300 dark:border-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {pageCount > 1 ? 'Navigate between pages' : 'Preview shows actual page count'}
      </span>
    </div>

    <div
      id="resume-preview-content"
      className="bg-card text-card-foreground p-2 md:p-3 rounded-lg print:p-0 print:m-0 print:rounded-none print:bg-white print:text-black print:shadow-none md:shadow-2xl md:shadow-primary/10 md:transition-shadow md:duration-300 md:hover:shadow-primary/20 overflow-hidden"
      style={{
        maxHeight: pageCount > 1 ? '1123px' : 'none',
        position: 'relative'
      }}
    >
      <header className="text-center mb-1 print:mb-1">
        <h1 className="text-base md:text-lg font-bold font-headline tracking-tight print:text-base print:mb-0">
          {resumeData.personalInfo.name}
        </h1>
        <div className="flex justify-center items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mt-0 flex-wrap print:gap-x-1 print:text-xs print:mt-0">
          {resumeData.personalInfo.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {resumeData.personalInfo.address}
            </span>
          )}
          {resumeData.personalInfo.email && (
            <a
              href={`mailto:${resumeData.personalInfo.email}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors break-all"
            >
              <Mail className="h-3 w-3" /> {resumeData.personalInfo.email}
            </a>
          )}
          {resumeData.personalInfo.phone && (
            <a
              href={`tel:${resumeData.personalInfo.phone}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Phone className="h-3 w-3" /> {resumeData.personalInfo.phone}
            </a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a
              href={ensureUrlScheme(resumeData.personalInfo.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Linkedin className="h-3 w-3" /> LinkedIn
            </a>
          )}
          {resumeData.personalInfo.github && (
            <a
              href={ensureUrlScheme(resumeData.personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Github className="h-3 w-3" /> GitHub
            </a>
          )}
          {resumeData.personalInfo.portfolio && (
            <a
              href={ensureUrlScheme(resumeData.personalInfo.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Globe className="h-3 w-3" /> Portfolio
            </a>
          )}
        </div>
      </header>

      <main 
        className="text-xs print:text-xs leading-tight print:leading-tight relative"
        style={pageCount > 1 ? {
          transform: `translateY(-${(currentPage - 1) * 1123}px)`,
          transition: 'transform 0.3s ease-in-out'
        } : undefined}
      >
        {sections.map((sectionId, index) => (
          <React.Fragment key={sectionId}>
            {renderSectionById(sectionId)}
            {/* Add visual page break indicator if content is getting long */}
            {index === Math.floor(sections.length / 2) && pageCount > 1 && (
              <div className="my-4 border-t-2 border-dashed border-slate-300 dark:border-slate-700 relative print:hidden">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-slate-500 dark:text-slate-400">
                  Page Break
                </span>
              </div>
            )}
          </React.Fragment>
        ))}
      </main>
    </div>

    <div className="p-4 border-t no-print flex gap-2">
      <div className="flex-1">
        <ResumeDownloadButton resumeData={resumeData} sectionOrder={sectionOrder} />
      </div>
    </div>

    {/* Scroll to top arrow */}
    {showScrollTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    )}
  </>
  );
}
