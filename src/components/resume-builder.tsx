
"use client";

import type { Resume } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtsScoreDisplay } from "@/components/ats-score-display";
import { Bot, BrainCircuit, Loader2, PlusCircle, Trash2, User, GraduationCap, Briefcase, Wrench, Mic, FolderKanban, Award, Languages, Handshake, Ribbon } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";
import { cn } from "@/lib/utils";

const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

interface ResumeBuilderProps {
  resumeData: Resume;
  setResumeData: (data: Resume) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  handleScore: () => void;
  isLoading: boolean;
  atsResult: AtsScoreResumeOutput | null;
}

export function ResumeBuilder({
  resumeData,
  setResumeData,
  jobDescription,
  setJobDescription,
  handleScore,
  isLoading,
  atsResult,
}: ResumeBuilderProps) {
  const [isListening, setIsListening] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const fieldCacheRef = useRef<Record<string, string>>({});
  const activeFieldRef = useRef<string | null>(null);

  useEffect(() => {
    activeFieldRef.current = isListening;
  }, [isListening]);


  const getFieldValue = useCallback((field: string): string => {
    if (!field) return "";
    const [fieldName, indexStr] = field.split('-');
    const index = indexStr ? parseInt(indexStr, 10) : -1;
    
    switch (fieldName) {
        case 'summary': return resumeData.summary;
        case 'experience': return index !== -1 ? resumeData.experience[index].description : "";
        case 'project': return index !== -1 && resumeData.projects ? resumeData.projects[index].description : "";
        case 'skills': return (resumeData.skills || []).join(", ");
        case 'jobDescription': return jobDescription;
        default: return "";
    }
  }, [resumeData, jobDescription]);

  const updateField = useCallback((field: string | null, newText: string) => {
    if (!field) return;

    const [fieldName, indexStr] = field.split('-');
    const index = indexStr ? parseInt(indexStr, 10) : -1;

    setResumeData(currentData => {
        const newResumeData = { ...currentData };
        switch (fieldName) {
        case 'summary':
            newResumeData.summary = newText;
            break;
        case 'experience':
            if (index !== -1) {
            const newExperience = [...newResumeData.experience];
            newExperience[index] = { ...newExperience[index], description: newText };
            newResumeData.experience = newExperience;
            }
            break;
        case 'project':
            if (index !== -1 && newResumeData.projects) {
            const newProjects = [...newResumeData.projects];
            newProjects[index] = { ...newProjects[index], description: newText };
            newResumeData.projects = newProjects;
            }
            break;
        case 'skills':
            newResumeData.skills = newText.split(",").map(s => s.trim());
            break;
        case 'jobDescription':
            // This case doesn't modify resumeData, handled separately
            break;
        }
        return newResumeData;
    });

    if (fieldName === 'jobDescription') {
        setJobDescription(newText);
    }
  }, [setResumeData, setJobDescription]);
  
  const toggleListening = useCallback((field: string) => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const currentText = getFieldValue(field);
    fieldCacheRef.current[field] = currentText ? currentText.trim() + " " : "";

    setIsListening(field);
    try {
        recognitionRef.current?.start();
    } catch (e) {
        console.error("Error starting speech recognition:", e);
        if (activeFieldRef.current) {
          delete fieldCacheRef.current[activeFieldRef.current];
        }
        setIsListening(null);
    }
  }, [isListening, getFieldValue]);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const activeField = activeFieldRef.current;
      if (!activeField) return;

      const originalText = fieldCacheRef.current[activeField] ?? '';
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const newText = originalText + finalTranscript + interimTranscript;
      updateField(activeField, newText);
      
      if (finalTranscript.trim()) {
        const updatedCacheText = (originalText + finalTranscript).trim() + ' ';
        fieldCacheRef.current[activeField] = updatedCacheText;
      }
    };
    
    recognition.onend = () => {
      if (activeFieldRef.current) {
         delete fieldCacheRef.current[activeFieldRef.current];
      }
      setIsListening(null);
    };
    
    recognition.onerror = (event: any) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      console.error("Speech recognition error", event.error);
      setIsListening(null);
    };

    recognitionRef.current = recognition;
    
    return () => {
        recognitionRef.current?.abort();
    }
  }, [updateField]);


  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [field]: value } });
  };
  
  const handleSummaryChange = (value: string) => {
    setResumeData({ ...resumeData, summary: value });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...(resumeData.experience || []),
        {
          id: crypto.randomUUID(),
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setResumeData({ ...resumeData, education: newEducation });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...(resumeData.education || []),
        { id: crypto.randomUUID(), school: "", degree: "", location: "", graduationDate: "" },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEducation });
  };

  const handleSkillsChange = (value: string) => {
    setResumeData({ ...resumeData, skills: value.split(",").map((s) => s.trim()) });
  };
  
  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...(resumeData.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...(resumeData.projects || []),
        { id: crypto.randomUUID(), name: "", description: "", link: "" },
      ],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = (resumeData.projects || []).filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: newProjects });
  };
  
  const handleCertificationChange = (index: number, field: string, value: string) => {
    const newCerts = [...(resumeData.certifications || [])];
    newCerts[index] = { ...newCerts[index], [field]: value };
    setResumeData({ ...resumeData, certifications: newCerts });
  };

  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...(resumeData.certifications || []),
        { id: crypto.randomUUID(), name: "", authority: "", date: "", link: "" },
      ],
    });
  };
  
  const removeCertification = (index: number) => {
    const newCerts = (resumeData.certifications || []).filter((_, i) => i !== index);
    setResumeData({ ...resumeData, certifications: newCerts });
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    const newAwards = [...(resumeData.awards || [])];
    newAwards[index] = { ...newAwards[index], [field]: value };
    setResumeData({ ...resumeData, awards: newAwards });
  };

  const addAward = () => {
    setResumeData({
      ...resumeData,
      awards: [
        ...(resumeData.awards || []),
        { id: crypto.randomUUID(), name: "", link: "" },
      ],
    });
  };
  
  const removeAward = (index: number) => {
    const newAwards = (resumeData.awards || []).filter((_, i) => i !== index);
    setResumeData({ ...resumeData, awards: newAwards });
  };
  
  const handleVolunteerChange = (index: number, field: string, value: string) => {
    const newVol = [...(resumeData.volunteerExperience || [])];
    newVol[index] = { ...newVol[index], [field]: value };
    setResumeData({ ...resumeData, volunteerExperience: newVol });
  };
  
  const addVolunteer = () => {
    setResumeData({
      ...resumeData,
      volunteerExperience: [
        ...(resumeData.volunteerExperience || []),
        { id: crypto.randomUUID(), role: "", organization: "", dates: "", description: "" },
      ],
    });
  };
  
  const removeVolunteer = (index: number) => {
    const newVol = (resumeData.volunteerExperience || []).filter((_, i) => i !== index);
    setResumeData({ ...resumeData, volunteerExperience: newVol });
  };
  
  const handleLanguageChange = (index: number, field: string, value: string) => {
    const newLang = [...(resumeData.languages || [])];
    newLang[index] = { ...newLang[index], [field]: value };
    setResumeData({ ...resumeData, languages: newLang });
  };
  
  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [
        ...(resumeData.languages || []),
        { id: crypto.randomUUID(), name: "", proficiency: "" },
      ],
    });
  };
  
  const removeLanguage = (index: number) => {
    const newLang = (resumeData.languages || []).filter((_, i) => i !== index);
    setResumeData({ ...resumeData, languages: newLang });
  };

  return (
    <Card className="shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-3xl">Resume Editor</CardTitle>
            <CardDescription>Fill out the sections below to create your resume.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="personal-info" className="w-full">
          <AccordionItem value="personal-info">
            <AccordionTrigger className="text-lg font-semibold"><User className="mr-3 h-5 w-5 text-primary accordion-icon"/>Personal Information</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={resumeData.personalInfo.name} onChange={(e) => handlePersonalInfoChange("name", e.target.value)} /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handlePersonalInfoChange("email", e.target.value)} /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={resumeData.personalInfo.phone} onChange={(e) => handlePersonalInfoChange("phone", e.target.value)} /></div>
                <div><Label htmlFor="address">Address</Label><Input id="address" value={resumeData.personalInfo.address} onChange={(e) => handlePersonalInfoChange("address", e.target.value)} /></div>
                <div><Label htmlFor="linkedin">LinkedIn Profile</Label><Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)} /></div>
                <div><Label htmlFor="portfolio">Portfolio/Website</Label><Input id="portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => handlePersonalInfoChange("portfolio", e.target.value)} /></div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold"><Briefcase className="mr-3 h-5 w-5 text-primary accordion-icon"/>Professional Summary</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
                <div className="relative">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea id="summary" value={resumeData.summary} onChange={(e) => handleSummaryChange(e.target.value)} placeholder="Write a brief professional summary..." rows={4} className="pr-10"/>
                    <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1">
                        {SpeechRecognition && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening('summary')}>
                                {isListening === 'summary' ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-semibold"><Briefcase className="mr-3 h-5 w-5 text-primary accordion-icon"/>Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.experience?.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Job Title</Label><Input value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)} /></div>
                    <div><Label>Company</Label><Input value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} /></div>
                    <div><Label>Location</Label><Input value={exp.location} onChange={(e) => handleExperienceChange(index, "location", e.target.value)} /></div>
                    <div><Label>Start Date</Label><Input value={exp.startDate} onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} /></div>
                    <div><Label>End Date</Label><Input value={exp.endDate} onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} /></div>
                  </div>
                  <div className="relative">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={(e) => handleExperienceChange(index, "description", e.target.value)} rows={3} placeholder="- Key achievement 1..." className="pr-10"/>
                     <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1">
                        {SpeechRecognition && (
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening(`experience-${index}`)}>
                                {isListening === `experience-${index}` ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addExperience} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Experience</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-semibold"><GraduationCap className="mr-3 h-5 w-5 text-primary accordion-icon"/>Education</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.education?.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>School/University</Label><Input value={edu.school} onChange={(e) => handleEducationChange(index, "school", e.target.value)} /></div>
                    <div><Label>Degree & Major</Label><Input value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} /></div>
                    <div><Label>Location</Label><Input value={edu.location} onChange={(e) => handleEducationChange(index, "location", e.target.value)} /></div>
                    <div><Label>Graduation Date</Label><Input value={edu.graduationDate} onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)} /></div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addEducation} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Education</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="projects">
            <AccordionTrigger className="text-lg font-semibold"><FolderKanban className="mr-3 h-5 w-5 text-primary accordion-icon"/>Projects (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.projects?.map((proj, index) => (
                <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => handleProjectChange(index, "name", e.target.value)} /></div>
                  <div className="relative">
                    <Label>Description</Label>
                    <Textarea value={proj.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} rows={3} placeholder="Describe your project..." className="pr-10" />
                    <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1">
                        {SpeechRecognition && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening(`project-${index}`)}>
                                {isListening === `project-${index}` ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>
                  </div>
                  <div><Label>Demo Link</Label><Input value={proj.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} /></div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addProject} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Project</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-semibold"><Wrench className="mr-3 h-5 w-5 text-primary accordion-icon"/>Skills</AccordionTrigger>
            <AccordionContent className="pt-2">
                <div className="relative">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea id="skills" value={(resumeData.skills || []).join(", ")} onChange={(e) => handleSkillsChange(e.target.value)} className="pr-10"/>
                     <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1">
                        {SpeechRecognition && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening('skills')}>
                                {isListening === 'skills' ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="certifications">
            <AccordionTrigger className="text-lg font-semibold"><Ribbon className="mr-3 h-5 w-5 text-primary accordion-icon"/>Certifications & Training (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.certifications?.map((cert, index) => (
                <div key={cert.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Certification Name</Label><Input value={cert.name} onChange={(e) => handleCertificationChange(index, "name", e.target.value)} /></div>
                    <div><Label>Issuing Authority</Label><Input value={cert.authority} onChange={(e) => handleCertificationChange(index, "authority", e.target.value)} /></div>
                    <div><Label>Date Earned</Label><Input value={cert.date} onChange={(e) => handleCertificationChange(index, "date", e.target.value)} /></div>
                    <div><Label>URL (optional)</Label><Input value={cert.link || ''} onChange={(e) => handleCertificationChange(index, "link", e.target.value)} placeholder="https://example.com/cert" /></div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addCertification} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Certification</Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="awards">
            <AccordionTrigger className="text-lg font-semibold"><Award className="mr-3 h-5 w-5 text-primary accordion-icon"/>Awards & Achievements (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.awards?.map((award, index) => (
                <div key={award.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1"><Label>Award/Achievement</Label><Input value={award.name} onChange={(e) => handleAwardChange(index, "name", e.target.value)} /></div>
                    <div className="md:col-span-1"><Label>URL (optional)</Label><Input value={award.link || ''} onChange={(e) => handleAwardChange(index, "link", e.target.value)} placeholder="https://example.com/award" /></div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeAward(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addAward} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Award</Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="volunteer">
            <AccordionTrigger className="text-lg font-semibold"><Handshake className="mr-3 h-5 w-5 text-primary accordion-icon"/>Volunteer Experience (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.volunteerExperience?.map((vol, index) => (
                <div key={vol.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Role</Label><Input value={vol.role} onChange={(e) => handleVolunteerChange(index, "role", e.target.value)} /></div>
                    <div><Label>Organization</Label><Input value={vol.organization} onChange={(e) => handleVolunteerChange(index, "organization", e.target.value)} /></div>
                     <div><Label>Dates</Label><Input value={vol.dates} onChange={(e) => handleVolunteerChange(index, "dates", e.target.value)} /></div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={vol.description} onChange={(e) => handleVolunteerChange(index, "description", e.target.value)} rows={3} placeholder="Skills demonstrated or impact created..." />
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeVolunteer(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addVolunteer} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Volunteer Role</Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="languages">
            <AccordionTrigger className="text-lg font-semibold"><Languages className="mr-3 h-5 w-5 text-primary accordion-icon"/>Languages (optional)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {resumeData.languages?.map((lang, index) => (
                <div key={lang.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Language</Label><Input value={lang.name} onChange={(e) => handleLanguageChange(index, "name", e.target.value)} /></div>
                    <div><Label>Proficiency</Label><Input value={lang.proficiency} onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)} /></div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeLanguage(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addLanguage} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Language</Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ats-score">
            <AccordionTrigger className="text-lg font-semibold"><BrainCircuit className="mr-3 h-5 w-5 text-primary accordion-icon"/>ATS Score Analysis</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="relative">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={6} className="pr-10"/>
                 {SpeechRecognition && (
                    <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening('jobDescription')}>
                        {isListening === 'jobDescription' ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                    </Button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleScore} disabled={isLoading || !jobDescription} className="w-full bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent)/0.9)] transition-transform hover:scale-105 active:scale-100">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Analyzing..." : "Analyze and Score Built Resume"}
                </Button>
              </div>

              {isLoading && <p className="text-center text-sm text-muted-foreground">Analyzing your resume. This may take a moment...</p>}
              {atsResult && <AtsScoreDisplay result={atsResult} />}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
