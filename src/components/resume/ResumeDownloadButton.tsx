'use client';

import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Resume } from '@/lib/types/resume-types';

interface ResumeDownloadButtonProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

export const ResumeDownloadButton = memo(function ResumeDownloadButton({ 
  resumeData, 
  sectionOrder 
}: ResumeDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Dynamic import jsPDF (reduces initial bundle size)
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

      // Helper function to add clickable links (PDF-safe, shows clean text)
      // Links will open in new tab/window when clicked in PDF
      const addLink = (text: string, url: string, x: number, y: number, fontSize = 9) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 86, 193);
        const textWidth = pdf.getTextWidth(text);
        // Add link with newWindow flag to open in new tab
        (pdf as any).link(x, y - 3, textWidth, fontSize * 0.35, { url: url });
        pdf.text(text, x, y);
        pdf.setTextColor(0, 0, 0);
        return textWidth;
      };

      // Header: Name
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      const name = resumeData.personalInfo.name || 'Your Name';
      const nameWidth = pdf.getTextWidth(name);
      pdf.text(name, (pageWidth - nameWidth) / 2, yPos);
      yPos += 7;

      // Contact Info - Single line with separators
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const contactParts = [];
      if (resumeData.personalInfo.address) contactParts.push(resumeData.personalInfo.address);
      if (resumeData.personalInfo.phone) contactParts.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.email) contactParts.push(resumeData.personalInfo.email);
      
      if (contactParts.length > 0) {
        const contactLine = contactParts.join(' | ');
        const contactWidth = pdf.getTextWidth(contactLine);
        pdf.text(contactLine, (pageWidth - contactWidth) / 2, yPos);
        yPos += 5;
      }

      // Links (LinkedIn, GitHub, Portfolio) - On separate line, blue clickable text
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
            pdf.setTextColor(0, 0, 0);
            pdf.text(' | ', linkX, yPos);
            linkX += pdf.getTextWidth(' | ');
          }
          const textWidth = addLink(link.text, link.url.startsWith('http') ? link.url : `https://${link.url}`, linkX, yPos, 9);
          linkX += textWidth;
        });
        pdf.setTextColor(0, 0, 0); // Reset to black
        yPos += 8;
      } else {
        yPos += 3;
      }

      // Summary
      if (resumeData.summary) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL SUMMARY', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
        summaryLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += sectionGap;
      }

      // Work Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('WORK EXPERIENCE', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

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

      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        resumeData.education.forEach((edu, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text(edu.school || '', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          const dateWidth = pdf.getTextWidth(edu.graduationDate || '');
          pdf.text(edu.graduationDate || '', pageWidth - margin - dateWidth, yPos);
          yPos += 5;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.text(edu.degree || '', margin, yPos);
          if (edu.location) {
            pdf.setFont('helvetica', 'italic');
            const locWidth = pdf.getTextWidth(edu.location);
            pdf.text(edu.location, pageWidth - margin - locWidth, yPos);
          }
          yPos += index < resumeData.education.length - 1 ? 6 : sectionGap;
        });
      }

      // Skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;
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

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROJECTS', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        resumeData.projects.forEach((proj, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(proj.name || '', margin, yPos);
          
          // Add "View" link if project has a link - shows as clean text in PDF
          if (proj.link && proj.link.trim()) {
            const nameWidth = pdf.getTextWidth(proj.name || '');
            pdf.setFontSize(9);
            // Ensure URL is properly formatted
            let projUrl = proj.link.trim();
            if (!projUrl.startsWith('http://') && !projUrl.startsWith('https://')) {
              projUrl = 'https://' + projUrl;
            }
            addLink(' [View]', projUrl, margin + nameWidth + 2, yPos, 9);
          }
          yPos += 5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          const descLines = pdf.splitTextToSize(proj.description || '', contentWidth);
          descLines.forEach((line: string) => {
            if (yPos > 280) {
              pdf.addPage();
              yPos = 15;
            }
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += index < resumeData.projects.length - 1 ? 4 : sectionGap;
        });
      }

      // Certifications
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CERTIFICATIONS', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        resumeData.certifications.forEach((cert, index) => {
          if (yPos > 275) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(cert.name || '', margin, yPos);
          
          // Add date on the right
          if (cert.date) {
            pdf.setFont('helvetica', 'normal');
            const dateWidth = pdf.getTextWidth(cert.date);
            pdf.text(cert.date, pageWidth - margin - dateWidth, yPos);
          }
          yPos += 4;

          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.text(cert.authority || '', margin, yPos);
          
          // Add certification link if available
          if (cert.link && cert.link.trim()) {
            const authorityWidth = pdf.getTextWidth(cert.authority || '');
            pdf.setFont('helvetica', 'normal');
            // Ensure URL is properly formatted
            let certUrl = cert.link.trim();
            if (!certUrl.startsWith('http://') && !certUrl.startsWith('https://')) {
              certUrl = 'https://' + certUrl;
            }
            addLink(' [View]', certUrl, margin + authorityWidth + 2, yPos, 9);
          }
          
          yPos += index < resumeData.certifications.length - 1 ? 6 : sectionGap;
        });
      }

      // Awards
      if (resumeData.awards && resumeData.awards.length > 0) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AWARDS & ACHIEVEMENTS', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        resumeData.awards.forEach((award, index) => {
          if (yPos > 275) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`• ${award.name || ''}`, margin, yPos);
          
          // Add award link if available
          if (award.link && award.link.trim()) {
            const nameWidth = pdf.getTextWidth(`• ${award.name || ''}`);
            // Ensure URL is properly formatted
            let awardUrl = award.link.trim();
            if (!awardUrl.startsWith('http://') && !awardUrl.startsWith('https://')) {
              awardUrl = 'https://' + awardUrl;
            }
            addLink(' [View]', awardUrl, margin + nameWidth + 2, yPos, 9);
          }
          
          yPos += index < resumeData.awards.length - 1 ? 5 : sectionGap;
        });
      }

      // Volunteer Experience
      if (resumeData.volunteerExperience && resumeData.volunteerExperience.length > 0) {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('VOLUNTEER EXPERIENCE', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        resumeData.volunteerExperience.forEach((vol, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(vol.role || '', margin, yPos);
          
          // Add dates on the right
          if ((vol as any).dates) {
            pdf.setFont('helvetica', 'normal');
            const dateWidth = pdf.getTextWidth((vol as any).dates);
            pdf.text((vol as any).dates, pageWidth - margin - dateWidth, yPos);
          }
          yPos += 5;

          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.text(vol.organization || '', margin, yPos);
          yPos += 4;

          if (vol.description) {
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(vol.description, contentWidth);
            descLines.forEach((line: string) => {
              if (yPos > 280) {
                pdf.addPage();
                yPos = 15;
              }
              pdf.text(line, margin, yPos);
              yPos += 5;
            });
          }
          
          yPos += index < resumeData.volunteerExperience.length - 1 ? 5 : sectionGap;
        });
      }

      // Languages
      if (resumeData.languages && resumeData.languages.length > 0) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('LANGUAGES', margin, yPos);
        // Add underline for section header
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
        yPos += baseSpacing + 1;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const languagesText = resumeData.languages
          .map((lang: any) => `${lang.name}: ${lang.proficiency}`)
          .join(', ');
        const langLines = pdf.splitTextToSize(languagesText, contentWidth);
        langLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
      }

      const fileName = `${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      pdf.save(fileName);

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
      <Download className="h-4 w-4" />
      {isGenerating ? 'Generating PDF...' : 'Download PDF'}
    </Button>
  );
});
