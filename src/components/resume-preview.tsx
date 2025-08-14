
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Resume } from "@/lib/types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin, ExternalLink, Link as LinkIcon, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  resumeData: Resume;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const handlePrint = () => {
    // Add meta tags to enhance PDF generation
    const meta = document.createElement('meta');
    meta.name = 'pdf-style';
    meta.content = 'color-links: true; pdf-output-intent: true;';
    document.head.appendChild(meta);
    
    // Print the document
    window.print();
    
    // Remove the meta tag after printing
    document.head.removeChild(meta);
  };

  const ensureUrlScheme = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  const renderSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!data || data.length === 0) return null;
    return (
      <section className="mb-4 md:mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">{title}</h2>
        <div className="space-y-3 md:space-y-4">
          {data.map(renderItem)}
        </div>
      </section>
    );
  };
  
  const renderSimpleListSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
     if (!data || data.length === 0) return null;
      return (
        <section className="mb-4 md:mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">{title}</h2>
          <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground/90">
            {data.map(renderItem)}
          </ul>
        </section>
      );
  }

  return (
    <Card className="shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20">
      <CardContent className="p-0">
        <div id="resume-preview" className="bg-card text-card-foreground p-6 md:p-8 rounded-lg md:aspect-[8.5/11]">
          <header className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{resumeData.personalInfo.name}</h1>
            <div className="flex justify-center items-center gap-x-3 md:gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground mt-2 flex-wrap">
              {resumeData.personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {resumeData.personalInfo.address}</span>}
              {resumeData.personalInfo.email && <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors break-all"><Mail className="h-3 w-3" /> {resumeData.personalInfo.email}</a>}
              {resumeData.personalInfo.phone && <a href={`tel:${resumeData.personalInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone className="h-3 w-3" /> {resumeData.personalInfo.phone}</a>}
              {resumeData.personalInfo.linkedin && <a href={ensureUrlScheme(resumeData.personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Linkedin className="h-3 w-3" /> LinkedIn</a>}
              {resumeData.personalInfo.github && <a href={ensureUrlScheme(resumeData.personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Github className="h-3 w-3" /> GitHub</a>}
              {resumeData.personalInfo.portfolio && <a href={ensureUrlScheme(resumeData.personalInfo.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-3 w-3" /> Portfolio</a>}
            </div>
          </header>

          <main className="text-sm">
            {resumeData.summary && (
              <section className="mb-4 md:mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Summary</h2>
                <p className="text-muted-foreground/90">{resumeData.summary}</p>
              </section>
            )}
            
            {renderSection("Experience", resumeData.experience, (exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{exp.jobTitle}</h3>
                  <span className="text-xs text-muted-foreground text-right">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-muted-foreground">
                    <p className="italic">{exp.company}</p>
                    <p className="italic text-xs">{exp.location}</p>
                </div>
                <ul className="list-disc list-inside mt-1 text-muted-foreground/90 whitespace-pre-wrap">
                  {exp.description.split('\n').map((line: string, i: number) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}

            {renderSection("Projects", resumeData.projects, (proj) => (
               <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{proj.name}</h3>
                  {proj.link && (
                      <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors">
                        View Project <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground/90">{proj.description}</p>
              </div>
            ))}

            {renderSection("Education", resumeData.education, (edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{edu.school}</h3>
                  <span className="text-xs text-muted-foreground">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-muted-foreground">
                  <div>
                    <p className="italic">{edu.degree}</p>
                    {edu.grade && (
                      <p className="text-xs mt-1">
                        <span className="font-medium">Grade:</span> {edu.grade}
                      </p>
                    )}
                  </div>
                  <p className="italic text-xs">{edu.location}</p>
                </div>
              </div>
            ))}
            
            {renderSection("Certifications", resumeData.certifications, (cert) => (
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
            ))}

            {renderSimpleListSection("Awards & Achievements", resumeData.awards, (award) => (
                 <li key={award.id} className="flex items-center gap-2">
                    <span>{award.name}</span>
                    {award.link && (
                        <a href={ensureUrlScheme(award.link)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 transition-colors">
                            <LinkIcon className="h-3 w-3" /> View
                        </a>
                    )}
                </li>
            ))}

            {renderSection("Volunteer Experience", resumeData.volunteerExperience, (vol) => (
                <div key={vol.id}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold">{vol.role}</h3>
                        <span className="text-xs text-muted-foreground">{vol.dates}</span>
                    </div>
                    <p className="italic text-muted-foreground">{vol.organization}</p>
                    <p className="mt-1 text-muted-foreground/90">{vol.description}</p>
                </div>
            ))}
            
            {resumeData.skills && resumeData.skills.length > 0 && (
                <section className="mb-4 md:mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2 screen-skills-display">
                    {resumeData.skills.map((skill) => (
                    skill && <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-primary/20">{skill}</span>
                    ))}
                </div>
                <div className="hidden print-skills-display">
                    <p className="text-muted-foreground/90">
                        {resumeData.skills.join(", ")}
                    </p>
                </div>
                </section>
            )}
            
            {resumeData.languages && resumeData.languages.length > 0 && (
                <section className="mb-4 md:mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Languages</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {resumeData.languages.map((lang) => (
                    lang.name && <div key={lang.id}><span className="font-semibold">{lang.name}:</span> <span className="text-muted-foreground">{lang.proficiency}</span></div>
                    ))}
                </div>
                </section>
            )}

          </main>
        </div>
        <div className="p-4 border-t no-print">
            <Button onClick={handlePrint} className="w-full transition-transform hover:scale-105 active:scale-100">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
