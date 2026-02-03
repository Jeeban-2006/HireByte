"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/lib/types/resume-types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin, ExternalLink, Link as LinkIcon, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/general-utils";
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

      const sectionCount = sections.length;
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

      const checkPageBreak = (requiredSpace: number = 20) => {
        if (yPos + requiredSpace > 270) {
          pdf.addPage();
          yPos = 15;
        }
      };

      // Header
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

      // Render sections in order
      for (const sectionId of sections) {
        
        if (sectionId === 'summary' && resumeData.summary) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('PROFESSIONAL SUMMARY', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
          summaryLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += sectionGap;
        }
        else if (sectionId === 'experience' && resumeData.experience?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('WORK EXPERIENCE', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.experience.forEach((exp, index) => {
            checkPageBreak(20);
            
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
              const bullets = exp.description.split('\n').filter(line => line.trim()).slice(0, 3);
              bullets.forEach((bullet) => {
                checkPageBreak(5);
                const cleanBullet = bullet.replace(/^- /, '');
                const bulletLines = pdf.splitTextToSize(`• ${cleanBullet}`, contentWidth - 3);
                bulletLines.forEach((line: string) => {
                  pdf.text(line, margin + 3, yPos);
                  yPos += 5;
                });
              });
            }
            yPos += index < resumeData.experience.length - 1 ? 5 : sectionGap;
          });
        }
        else if (sectionId === 'education' && resumeData.education?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('EDUCATION', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.education.forEach((edu, index) => {
            checkPageBreak(15);
            
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
        else if (sectionId === 'projects' && resumeData.projects?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('PROJECTS', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.projects.forEach((proj, index) => {
            checkPageBreak(15);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(proj.name || '', margin, yPos);
            yPos += 5;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            if (proj.description) {
              const descriptions = Array.isArray(proj.description) ? proj.description : [proj.description as string];
              descriptions.filter((desc: string) => desc.trim()).forEach((desc: string) => {
                checkPageBreak(5);
                const bulletLines = pdf.splitTextToSize(`• ${desc}`, contentWidth - 3);
                bulletLines.forEach((line: string) => {
                  pdf.text(line, margin + 3, yPos);
                  yPos += 5;
                });
              });
            }
            yPos += index < resumeData.projects.length - 1 ? 5 : sectionGap;
          });
        }
        else if (sectionId === 'skills') {
          const skillCategories = Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'object'
            ? resumeData.skills as import('@/lib/types/resume-types').SkillCategory[]
            : [];

          if (skillCategories.length > 0 && skillCategories.some(cat => cat.category && cat.items?.some(item => item.trim()))) {
            checkPageBreak();
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('SKILLS', margin, yPos);
            yPos += 1;
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += baseSpacing;
            pdf.setFontSize(10);
            
            skillCategories.forEach((category) => {
              if (category.category && category.items?.some(item => item.trim())) {
                checkPageBreak(5);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${category.category}:`, margin, yPos);
                yPos += 5;
                
                pdf.setFont('helvetica', 'normal');
                const skillsText = category.items.filter(item => item.trim()).join(', ');
                const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
                skillsLines.forEach((line: string) => {
                  checkPageBreak(5);
                  pdf.text(line, margin, yPos);
                  yPos += 5;
                });
                yPos += 2;
              }
            });
            yPos += sectionGap - 2;
          }
        }
        else if (sectionId === 'certifications' && resumeData.certifications?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('CERTIFICATIONS', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.certifications.forEach((cert, index) => {
            checkPageBreak(10);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(cert.name || '', margin, yPos);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            if (cert.date) {
              const dateWidth = pdf.getTextWidth(cert.date);
              pdf.text(cert.date, pageWidth - margin - dateWidth, yPos);
            }
            yPos += 5;

            pdf.setFont('helvetica', 'italic');
            pdf.text(cert.authority || '', margin, yPos);
            yPos += index < resumeData.certifications.length - 1 ? 6 : sectionGap;
          });
        }
        else if (sectionId === 'awards' && resumeData.awards?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('AWARDS', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.awards.forEach((award, index) => {
            checkPageBreak(5);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`• ${award.name || ''}`, margin + 3, yPos);
            yPos += index < resumeData.awards.length - 1 ? 5 : sectionGap;
          });
        }
        else if (sectionId === 'volunteer' && resumeData.volunteerExperience?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('VOLUNTEER EXPERIENCE', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          resumeData.volunteerExperience.forEach((vol, index) => {
            checkPageBreak(15);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(vol.role || '', margin, yPos);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            if (vol.dates) {
              const dateWidth = pdf.getTextWidth(vol.dates);
              pdf.text(vol.dates, pageWidth - margin - dateWidth, yPos);
            }
            yPos += 5;

            pdf.setFont('helvetica', 'italic');
            pdf.text(vol.organization || '', margin, yPos);
            yPos += 5;

            pdf.setFont('helvetica', 'normal');
            if (vol.description) {
              const descLines = pdf.splitTextToSize(vol.description, contentWidth);
              descLines.forEach((line: string) => {
                checkPageBreak(5);
                pdf.text(line, margin, yPos);
                yPos += 5;
              });
            }
            yPos += index < resumeData.volunteerExperience.length - 1 ? 5 : sectionGap;
          });
        }
        else if (sectionId === 'languages' && resumeData.languages?.length > 0) {
          checkPageBreak();
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('LANGUAGES', margin, yPos);
          yPos += 1;
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += baseSpacing;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          const langText = resumeData.languages.map(lang => `${lang.name}: ${lang.proficiency}`).join(', ');
          const langLines = pdf.splitTextToSize(langText, contentWidth);
          langLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += sectionGap;
        }
        else if (sectionId.startsWith('custom-')) {
          const customSectionId = sectionId.replace('custom-', '');
          const customSection = resumeData.customSections?.find(s => s.id === customSectionId);
          

          if (customSection && customSection.items?.length > 0) {
            checkPageBreak();
            
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(customSection.title.toUpperCase(), margin, yPos);
            yPos += 1;
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += baseSpacing;
            
            customSection.items.forEach((item, itemIndex) => {
              checkPageBreak(10);
              
              if (customSection.type === 'categorical' && customSection.fields) {
                pdf.setFontSize(10);
                customSection.fields.forEach((field) => {
                  if (item[field]) {
                    pdf.setFont('helvetica', 'bold');
                    const fieldLabel = `${field}:`;
                    pdf.text(fieldLabel, margin, yPos);
                    
                    pdf.setFont('helvetica', 'normal');
                    const fieldValue = item[field] as string;
                    const valueX = margin + pdf.getTextWidth(fieldLabel) + 2;
                    const valueLines = pdf.splitTextToSize(fieldValue, contentWidth - (valueX - margin));
                    valueLines.forEach((line: string, lineIndex: number) => {
                      if (lineIndex > 0) {
                        yPos += 5;
                        pdf.text(line, margin, yPos);
                      } else {
                        pdf.text(line, valueX, yPos);
                      }
                    });
                    yPos += 5;
                  }
                });
                yPos += itemIndex < customSection.items.length - 1 ? 2 : 0;
              } else {
                // Points format
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                const content = item.content as string || '';
                const bulletLines = pdf.splitTextToSize(`• ${content}`, contentWidth - 3);
                bulletLines.forEach((line: string) => {
                  checkPageBreak(5);
                  pdf.text(line, margin + 3, yPos);
                  yPos += 5;
                });
              }
            });
            yPos += sectionGap;
          }
        }
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
            {/* Grid layout: PDF-safe, prevents date/location misalignment */}
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
              <h3 className="font-bold text-xs print:text-black">{exp.jobTitle}</h3>
              <span className="text-xs text-muted-foreground print:text-gray-700 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
            </div>
            {/* Grid for company + location alignment */}
            <div className="grid grid-cols-[1fr_auto] items-baseline text-muted-foreground print:text-gray-700 text-xs gap-1">
              <p className="italic">{exp.company}</p>
              <p className="italic text-xs whitespace-nowrap">{exp.location}</p>
            </div>
            <ul className="list-disc list-inside mt-0.5 text-muted-foreground/90 print:text-black text-xs leading-tight print:leading-tight">
              {exp.description.split('\n').slice(0, 2).map((line: string, i: number) => line && <li key={i} className="text-xs">{line.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ));
      
      case 'projects':
        return renderSection("Projects", resumeData.projects, (proj) => (
          <div key={proj.id} className="print:page-break-inside-avoid">
            {/* Grid layout: PDF-safe, maintains structure in print */}
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
              <h3 className="font-bold text-xs">{proj.name}</h3>
              {proj.link && (
                <>
                  {/* Screen: Interactive link with icon */}
                  <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className="screen:inline print:hidden text-xs text-primary hover:underline flex items-center gap-0.5 transition-colors whitespace-nowrap">
                    View <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  {/* Print: Clean text only, no URL rendered */}
                  <span className="screen:hidden print:inline text-xs text-gray-700 whitespace-nowrap">View</span>
                </>
              )}
            </div>
            {proj.description && (Array.isArray(proj.description) ? proj.description : [proj.description as string]).filter((point: string) => point.trim()).length > 0 && (
              <ul className="mt-0 space-y-0.5 list-none pl-0">
                {(Array.isArray(proj.description) ? proj.description : [proj.description as string]).filter((point: string) => point.trim()).map((point: string, idx: number) => (
                  <li key={idx} className="text-muted-foreground/90 text-xs print:text-black flex items-start gap-1">
                    <span className="select-none">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ));
      
      case 'education':
        return renderSection("Education", resumeData.education, (edu) => (
          <div key={edu.id} className="print:page-break-inside-avoid">
            {/* Grid layout: prevents flex issues in PDF, keeps right-alignment stable */}
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
              <h3 className="font-bold text-xs print:text-black">{edu.school}</h3>
              <span className="text-xs text-muted-foreground print:text-gray-700 whitespace-nowrap">{edu.graduationDate}</span>
            </div>
            {/* Grid for degree + location alignment */}
            <div className="grid grid-cols-[1fr_auto] items-start text-muted-foreground print:text-gray-700 text-xs gap-1">
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
          <div key={cert.id} className="print:page-break-inside-avoid">
            {/* Grid layout: maintains structure in PDF */}
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xs print:text-black">{cert.name}</h3>
                {cert.link && (
                  <>
                    {/* Screen: Interactive link */}
                    <a href={ensureUrlScheme(cert.link)} target="_blank" rel="noopener noreferrer" className="screen:inline print:hidden text-primary hover:underline flex items-center gap-1 transition-colors text-xs">
                      <LinkIcon className="h-3 w-3" /> View
                    </a>
                    {/* Print: Clean text only */}
                    <span className="screen:hidden print:inline text-xs text-gray-700">- View</span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground print:text-gray-700 whitespace-nowrap">{cert.date}</span>
            </div>
            <p className="italic text-muted-foreground print:text-gray-700 text-xs">{cert.authority}</p>
          </div>
        ));
      
      case 'awards':
        return renderSimpleListSection("Awards & Achievements", resumeData.awards, (award) => (
          <span key={award.id} className="flex items-center gap-2">
            <span className="print:text-black">{award.name}</span>
            {award.link && (
              <>
                {/* Screen: Interactive link */}
                <a href={ensureUrlScheme(award.link)} target="_blank" rel="noopener noreferrer" className="screen:inline print:hidden text-primary hover:underline flex items-center gap-1 transition-colors text-xs">
                  <LinkIcon className="h-3 w-3" /> View
                </a>
                {/* Print: Clean text only, no URL */}
                <span className="screen:hidden print:inline text-xs text-gray-700">- View</span>
              </>
            )}
          </span>
        ));
      
      case 'volunteer':
        return renderSection("Volunteer Experience", resumeData.volunteerExperience, (vol) => (
          <div key={vol.id} className="print:page-break-inside-avoid">
            {/* Grid layout: PDF-safe date alignment */}
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
              <h3 className="font-semibold text-xs print:text-black">{vol.role}</h3>
              <span className="text-xs text-muted-foreground print:text-gray-700 whitespace-nowrap">{vol.dates}</span>
            </div>
            <p className="italic text-muted-foreground print:text-gray-700 text-xs">{vol.organization}</p>
            <p className="mt-1 text-muted-foreground/90 print:text-black text-xs">{vol.description}</p>
          </div>
        ));
      
      case 'skills':
        const skillCategories = Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'object'
          ? resumeData.skills as import('@/lib/types/resume-types').SkillCategory[]
          : [];
        
        return skillCategories.length > 0 ? (
          <section key="skills" className="mb-4 md:mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Skills</h2>
            <div className="space-y-1">
              {skillCategories.map((category) => category.category && category.items && category.items.some(item => item.trim()) ? (
                <p key={category.id} className="text-xs">
                  <span className="font-semibold text-foreground">{category.category}: </span>
                  <span className="text-muted-foreground/90 print:text-black">
                    {category.items.filter(item => item.trim()).join(', ')}
                  </span>
                </p>
              ) : null)}
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
        // Handle custom sections
        if (sectionId.startsWith('custom-')) {
          const customSectionId = sectionId.replace('custom-', '');
          const customSection = resumeData.customSections?.find(s => s.id === customSectionId);
          
          if (customSection && (customSection.items || []).length > 0) {
            return (
              <section key={sectionId} className="mb-4 md:mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">
                  {customSection.title}
                </h2>
                <div className="space-y-2">
                  {(customSection.items || []).map((item, index) => (
                    <div key={index} className="mb-3 text-xs">
                      {customSection.type === 'categorical' && customSection.fields ? (
                        <div className="space-y-1">
                          {(customSection.fields || []).map((field, fieldIndex) => (
                            item[field] && (
                              <div key={fieldIndex} className="flex items-start gap-2">
                                <span className="font-semibold text-foreground min-w-[80px]">{field}:</span>
                                <span className="text-muted-foreground flex-1">{item[field]}</span>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">• {item.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }
        }
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
      className="bg-card text-card-foreground p-2 md:p-3 rounded-lg print:p-0 print:m-0 print:rounded-none print:bg-white print:text-black print:shadow-none md:shadow-2xl md:shadow-primary/10 md:transition-shadow md:duration-300 md:hover:shadow-primary/20"
      style={{
        overflow: 'hidden',
        position: 'relative',
        ...(pageCount > 1 ? {
          maxHeight: '1123px', // A4 height equivalent
          clipPath: 'inset(0)'
        } : {})
      }}
    >
      <div style={pageCount > 1 ? {
        transform: `translateY(-${(currentPage - 1) * 1123}px)`,
        transition: 'transform 0.3s ease-in-out',
        willChange: 'transform'
      } : undefined}>
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
            <>
              {/* Screen: Full interactive link */}
              <a
                href={ensureUrlScheme(resumeData.personalInfo.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="screen:flex print:hidden items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Linkedin className="h-3 w-3" /> LinkedIn
              </a>
              {/* Print: Clean text, no URL rendered */}
              <span className="screen:hidden print:inline-flex items-center gap-1.5 text-gray-700">
                <Linkedin className="h-3 w-3 print:hidden" />LinkedIn
              </span>
            </>
          )}
          {resumeData.personalInfo.github && (
            <>
              {/* Screen: Full interactive link */}
              <a
                href={ensureUrlScheme(resumeData.personalInfo.github)}
                target="_blank"
                rel="noopener noreferrer"
                className="screen:flex print:hidden items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Github className="h-3 w-3" /> GitHub
              </a>
              {/* Print: Clean text, no URL rendered */}
              <span className="screen:hidden print:inline-flex items-center gap-1.5 text-gray-700">
                <Github className="h-3 w-3 print:hidden" />GitHub
              </span>
            </>
          )}
          {resumeData.personalInfo.portfolio && (
            <>
              {/* Screen: Full interactive link */}
              <a
                href={ensureUrlScheme(resumeData.personalInfo.portfolio)}
                target="_blank"
                rel="noopener noreferrer"
                className="screen:flex print:hidden items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Globe className="h-3 w-3" /> Portfolio
              </a>
              {/* Print: Clean text, no URL rendered */}
              <span className="screen:hidden print:inline-flex items-center gap-1.5 text-gray-700">
                <Globe className="h-3 w-3 print:hidden" />Portfolio
              </span>
            </>
          )}
        </div>
      </header>

        <main className="text-xs print:text-xs leading-tight print:leading-tight">
          {sections.map((sectionId) => (
            <React.Fragment key={sectionId}>
              {renderSectionById(sectionId)}
            </React.Fragment>
          ))}
        </main>
      </div>
    </div>

    <div className="p-4 border-t no-print flex gap-2">
      <div className="flex-1">
        <Button 
          onClick={handlePrint}
          className="w-full download-pdf-btn bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
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
