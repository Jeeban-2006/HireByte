
"use client";

import type { Resume } from "@/lib/types/resume-types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtsScoreDisplay } from "@/components/ai/ATSScoreDisplay";
import { Bot, BrainCircuit, Loader2, PlusCircle, Trash2, User, GraduationCap, Briefcase, Wrench, Mic, FolderKanban, Award, Languages, Handshake, Ribbon, X } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { AtsScoreResumeOutput } from "@/lib/types/resume-types";
import { cn } from "@/lib/utils/general-utils";
import { useToast } from "@/hooks/use-toast";
import { DraggableResumeBuilder, DraggableResumeSection } from "@/components/resume/DraggableResumeBuilder";

const SpeechRecognition =
  (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));

interface ResumeBuilderProps {
  resumeData: Resume;
  setResumeData: (data: Resume | ((prevData: Resume) => Resume)) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  handleScore: () => void;
  isLoading: boolean;
  atsResult: AtsScoreResumeOutput | null;
  sectionOrder?: string[];
  setSectionOrder?: (order: string[]) => void;
}
/*
Order for the resume sections:

1. Contact
2. Summary
3. Skills
4. Education
5. Experience
6. Projects
7. Certifications
8. Languages

When mapping/rendering the sections in the JSX below, ensure the order is:
Contact, Summary, Skills, Education, Experience, Projects, Certifications, Languages.

*/

// Order: Contact, Summary, Skills, Education, Experience, Projects, Certifications, Languages

// 1. Contact Section (TO DO: insert Contact section UI here)
// Example placeholder code, update as necessary:





export function ResumeBuilder({
  resumeData,
  setResumeData,
  jobDescription,
  setJobDescription,
  handleScore,
  isLoading,
  atsResult,
  sectionOrder,
  setSectionOrder,
}: ResumeBuilderProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [hiddenSections, setHiddenSections] = useState<string[]>(resumeData.hiddenSections || []);
  const recognitionRef = useRef<any>(null);
  const fieldCacheRef = useRef<Record<string, string>>({});
  const activeFieldRef = useRef<string | null>(null);

  useEffect(() => {
    activeFieldRef.current = isListening;
  }, [isListening]);

  // Migrate project descriptions from string to array format
  useEffect(() => {
    if (resumeData.projects && resumeData.projects.length > 0) {
      const needsMigration = resumeData.projects.some(
        proj => typeof (proj as any).description === 'string'
      );
      
      if (needsMigration) {
        setResumeData(prevData => ({
          ...prevData,
          projects: prevData.projects?.map(proj => ({
            ...proj,
            description: typeof (proj as any).description === 'string'
              ? (proj as any).description.trim() ? [(proj as any).description] : [""]
              : Array.isArray(proj.description) ? proj.description : [""]
          }))
        }));
      }
    }
  }, []);


  const getFieldValue = useCallback((field: string): string => {
    if (!field) return "";
    const [fieldName, indexStr] = field.split('-');
    const index = indexStr ? parseInt(indexStr, 10) : -1;
    
    switch (fieldName) {
        case 'summary': return resumeData.summary;
        
        case 'project': return index !== -1 && resumeData.projects ? resumeData.projects[index].description.join('\n') : "";
        case 'experience': return index !== -1 ? resumeData.experience[index].description : "";
        case 'volunteer': return index !== -1 && resumeData.volunteerExperience ? resumeData.volunteerExperience[index].description : "";
        
        case 'jobDescription': return jobDescription;
        default: return "";
    }
  }, [resumeData, jobDescription]);

  const updateField = useCallback((field: string | null, newText: string) => {
    if (!field) return;

    const [fieldName, indexStr] = field.split('-');
    const index = indexStr ? parseInt(indexStr, 10) : -1;

    if (fieldName === 'jobDescription') {
      // This case doesn't modify resumeData, handled separately
      setJobDescription(newText);
      return;
    }

    setResumeData((prevData: Resume) => {
      const newResumeData: Resume = { ...prevData };
      switch (fieldName) {
      case 'summary':
          newResumeData.summary = newText;
          break;

          case 'project':
        if (index !== -1 && newResumeData.projects) {
        const newProjects = [...newResumeData.projects];
        const descriptionArray = newText.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        newProjects[index] = { ...newProjects[index], description: descriptionArray };
        newResumeData.projects = newProjects;
        }
        break;

      case 'experience':
          if (index !== -1) {
          const newExperience = [...newResumeData.experience];
          newExperience[index] = { ...newExperience[index], description: newText };
          newResumeData.experience = newExperience;
          }
          break;
      
      case 'volunteer':
          if (index !== -1 && newResumeData.volunteerExperience) {
          const newVolunteer = [...newResumeData.volunteerExperience];
          newVolunteer[index] = { ...newVolunteer[index], description: newText };
          newResumeData.volunteerExperience = newVolunteer;
          }
          break;
      }
      return newResumeData;
        });
  }, [setResumeData, setJobDescription]);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[Speech] Microphone permission granted");
      return true;
    } catch (error) {
      console.error("[Speech] Microphone permission denied:", error);
      return false;
    }
  };
  
  
  const toggleListening = useCallback(async (field: string) => {
    console.log("[Speech] Toggle listening called for field:", field);
    console.log("[Speech] Current listening state:", isListening);
  
    if (isListening) {
      console.log("[Speech] Stopping recognition...");
      recognitionRef.current?.stop();
      return;
    }
  
    // Browser support check
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
  
    if (!SR) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
  
    // ✅ Request microphone PERMISSION first
    const hasPermission = await requestMicPermission();
  
    if (!hasPermission) {
      toast({
        title: "Microphone Blocked",
        description: "Please allow microphone access in your browser settings.",
        variant: "destructive",
      });
      setMicPermissionDenied(true);
      return;
    }
  
    console.log("[Speech] Creating SpeechRecognition instance...");
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
  
    recognitionRef.current = recognition;
  
    recognition.onstart = () => {
      console.log("[Speech] Recognition started");
    };
  
    recognition.onresult = (event: any) => {
      console.log("[Speech] Recognition result received");
  
      const activeField = activeFieldRef.current;
      if (!activeField) return;
  
      const cachedText = fieldCacheRef.current[activeField] || "";
      let interimTranscript = "";
      let finalTranscript = "";
  
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
  
      const newText = cachedText + finalTranscript + interimTranscript;
      updateField(activeField, newText);
  
      if (finalTranscript.trim()) {
        fieldCacheRef.current[activeField] = cachedText + finalTranscript;
      }
    };
  
    recognition.onend = () => {
      console.log("[Speech] Recognition ended");
      activeFieldRef.current = null;
      setIsListening(null);
    };
  
    recognition.onerror = (event: any) => {
      console.error("[Speech] Recognition error:", event.error);
  
      if (event.error === "aborted") return;
      if (event.error === "not-allowed") setMicPermissionDenied(true);
  
      toast({
        title: "Speech Recognition Error",
        description: event.error,
        variant: "destructive",
      });
  
      setIsListening(null);
    };
  
    // Prepare before starting listening
    activeFieldRef.current = field;
    fieldCacheRef.current[field] = getFieldValue(field) || "";
  
    // Start recognition
    try {
      recognition.start();
      setIsListening(field);
      toast({
        title: "🎤 Listening...",
        description: "Speak now. Click again to stop.",
      });
    } catch (e) {
      console.error("[Speech] Start error:", e);
      setIsListening(null);
    }
  }, [isListening, getFieldValue, toast, updateField]);
  

  const handlePersonalInfoChange = useCallback((field: string, value: string) => {
    setResumeData(prevData => ({ ...prevData, personalInfo: { ...prevData.personalInfo, [field]: value } }));
  }, [setResumeData]);
  
  const handleSummaryChange = useCallback((value: string) => {
    setResumeData(prevData => ({ ...prevData, summary: value }));
  }, [setResumeData]);

  const handleExperienceChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newExperience = [...prevData.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prevData, experience: newExperience };
    });
  }, [setResumeData]);

  const addExperience = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      experience: [
        ...(prevData.experience || []),
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
    }));
  }, [setResumeData]);

  const removeExperience = useCallback((index: number) => {
    setResumeData(prevData => {
      const newExperience = prevData.experience.filter((_, i) => i !== index);
      return { ...prevData, experience: newExperience };
    });
  }, [setResumeData]);

  const handleEducationChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newEducation = [...prevData.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prevData, education: newEducation };
    });
  }, [setResumeData]);

  const addEducation = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      education: [
        ...(prevData.education || []),
        { id: crypto.randomUUID(), school: "", degree: "", location: "", graduationDate: "", grade: "" },
      ],
    }));
  }, [setResumeData]);

  const removeEducation = useCallback((index: number) => {
    setResumeData(prevData => {
      const newEducation = prevData.education.filter((_, i) => i !== index);
      return { ...prevData, education: newEducation };
    });
  }, [setResumeData]);

  const handleSkillCategoryChange = useCallback((index: number, field: 'category' | 'items', value: string | string[]) => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      const newSkills = [...skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prevData, skills: newSkills };
    });
  }, [setResumeData]);

  const handleSkillItemChange = useCallback((categoryIndex: number, itemIndex: number, value: string) => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      const newSkills = [...skills];
      const newItems = [...(newSkills[categoryIndex].items || [])];
      newItems[itemIndex] = value;
      newSkills[categoryIndex] = { ...newSkills[categoryIndex], items: newItems };
      return { ...prevData, skills: newSkills };
    });
  }, [setResumeData]);

  const addSkillCategory = useCallback(() => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      return {
        ...prevData,
        skills: [...skills, { id: crypto.randomUUID(), category: "", items: [""] }],
      };
    });
  }, [setResumeData]);

  const removeSkillCategory = useCallback((index: number) => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      return { ...prevData, skills: skills.filter((_, i) => i !== index) };
    });
  }, [setResumeData]);

  const addSkillItem = useCallback((categoryIndex: number) => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      const newSkills = [...skills];
      newSkills[categoryIndex] = {
        ...newSkills[categoryIndex],
        items: [...(newSkills[categoryIndex].items || []), ""]
      };
      return { ...prevData, skills: newSkills };
    });
  }, [setResumeData]);

  const removeSkillItem = useCallback((categoryIndex: number, itemIndex: number) => {
    setResumeData(prevData => {
      const skills = Array.isArray(prevData.skills) && prevData.skills.length > 0 && typeof prevData.skills[0] === 'object'
        ? prevData.skills as import('@/lib/types/resume-types').SkillCategory[]
        : [];
      const newSkills = [...skills];
      const newItems = newSkills[categoryIndex].items.filter((_, i) => i !== itemIndex);
      newSkills[categoryIndex] = {
        ...newSkills[categoryIndex],
        items: newItems.length > 0 ? newItems : [""]
      };
      return { ...prevData, skills: newSkills };
    });
  }, [setResumeData]);
  
  const handleProjectChange = useCallback((index: number, field: string, value: string | string[]) => {
    setResumeData(prevData => {
      const newProjects = [...(prevData.projects || [])];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prevData, projects: newProjects };
    });
  }, [setResumeData]);

  const addProject = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      projects: [
        ...(prevData.projects || []),
        { id: crypto.randomUUID(), name: "", description: [""], link: "" },
      ],
    }));
  }, [setResumeData]);

  const removeProject = useCallback((index: number) => {
    setResumeData(prevData => {
      const newProjects = (prevData.projects || []).filter((_, i) => i !== index);
      return { ...prevData, projects: newProjects };
    });
  }, [setResumeData]);

  const handleProjectDescriptionPointChange = useCallback((projectIndex: number, pointIndex: number, value: string) => {
    setResumeData(prevData => {
      const newProjects = [...(prevData.projects || [])];
      const newDescription = [...(newProjects[projectIndex].description || [])];
      newDescription[pointIndex] = value;
      newProjects[projectIndex] = { ...newProjects[projectIndex], description: newDescription };
      return { ...prevData, projects: newProjects };
    });
  }, [setResumeData]);

  const addProjectDescriptionPoint = useCallback((projectIndex: number) => {
    setResumeData(prevData => {
      const newProjects = [...(prevData.projects || [])];
      const newDescription = [...(newProjects[projectIndex].description || []), ""];
      newProjects[projectIndex] = { ...newProjects[projectIndex], description: newDescription };
      return { ...prevData, projects: newProjects };
    });
  }, [setResumeData]);

  const removeProjectDescriptionPoint = useCallback((projectIndex: number, pointIndex: number) => {
    setResumeData(prevData => {
      const newProjects = [...(prevData.projects || [])];
      const newDescription = newProjects[projectIndex].description.filter((_, i) => i !== pointIndex);
      // Ensure at least one empty point remains
      newProjects[projectIndex] = { 
        ...newProjects[projectIndex], 
        description: newDescription.length > 0 ? newDescription : [""] 
      };
      return { ...prevData, projects: newProjects };
    });
  }, [setResumeData]);

  const handleProjectDescriptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, projectIndex: number, pointIndex: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addProjectDescriptionPoint(projectIndex);
    }
  }, [addProjectDescriptionPoint]);
  
  const handleCertificationChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newCerts = [...(prevData.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prevData, certifications: newCerts };
    });
  }, [setResumeData]);

  const addCertification = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      certifications: [
        ...(prevData.certifications || []),
        { id: crypto.randomUUID(), name: "", authority: "", date: "", link: "" },
      ],
    }));
  }, [setResumeData]);
  
  const removeCertification = useCallback((index: number) => {
    setResumeData(prevData => {
      const newCerts = (prevData.certifications || []).filter((_, i) => i !== index);
      return { ...prevData, certifications: newCerts };
    });
  }, [setResumeData]);

  const handleAwardChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newAwards = [...(prevData.awards || [])];
      newAwards[index] = { ...newAwards[index], [field]: value };
      return { ...prevData, awards: newAwards };
    });
  }, [setResumeData]);

  const addAward = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      awards: [
        ...(prevData.awards || []),
        { id: crypto.randomUUID(), name: "", link: "" },
      ],
    }));
  }, [setResumeData]);
  
  const removeAward = useCallback((index: number) => {
    setResumeData(prevData => {
      const newAwards = (prevData.awards || []).filter((_, i) => i !== index);
      return { ...prevData, awards: newAwards };
    });
  }, [setResumeData]);
  
  const handleVolunteerChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newVol = [...(prevData.volunteerExperience || [])];
      newVol[index] = { ...newVol[index], [field]: value };
      return { ...prevData, volunteerExperience: newVol };
    });
  }, [setResumeData]);
  
  const addVolunteer = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      volunteerExperience: [
        ...(prevData.volunteerExperience || []),
        { id: crypto.randomUUID(), role: "", organization: "", dates: "", description: "" },
      ],
    }));
  }, [setResumeData]);
  
  const removeVolunteer = useCallback((index: number) => {
    setResumeData(prevData => {
      const newVol = (prevData.volunteerExperience || []).filter((_, i) => i !== index);
      return { ...prevData, volunteerExperience: newVol };
    });
  }, [setResumeData]);
  
  const handleLanguageChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prevData => {
      const newLang = [...(prevData.languages || [])];
      newLang[index] = { ...newLang[index], [field]: value };
      return { ...prevData, languages: newLang };
    });
  }, [setResumeData]);
  
  const addLanguage = useCallback(() => {
    setResumeData(prevData => ({
      ...prevData,
      languages: [
        ...(prevData.languages || []),
        { id: crypto.randomUUID(), name: "", proficiency: "" },
      ],
    }));
  }, [setResumeData]);
  
  const removeLanguage = useCallback((index: number) => {
    setResumeData(prevData => {
      const newLang = (prevData.languages || []).filter((_, i) => i !== index);
      return { ...prevData, languages: newLang };
    });
  }, [setResumeData]);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionType: string) => {
    setHiddenSections(prev => {
      const newHiddenSections = prev.includes(sectionType)
        ? prev.filter(s => s !== sectionType)
        : [...prev, sectionType];
      
      // Update resume data with new hiddenSections
      setResumeData(prevData => ({ ...prevData, hiddenSections: newHiddenSections }));
      
      return newHiddenSections;
    });
  }, [setResumeData]);

  const isSectionHidden = useCallback((sectionType: string) => {
    return hiddenSections.includes(sectionType);
  }, [hiddenSections]);

  // Default section order if not provided
  const defaultSectionOrder = [
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
    'ats-score'
  ];

  const currentSectionOrder = sectionOrder || defaultSectionOrder;

  // Handle section reorder
  const handleSectionsReorder = useCallback((newSections: DraggableResumeSection[]) => {
    const newOrder = newSections.map(s => s.type);
    if (setSectionOrder) {
      setSectionOrder(newOrder);
    }
    // Also update the resume data using functional form to avoid stale closures
    setResumeData(prevData => ({ ...prevData, sectionOrder: newOrder }));
  }, [setSectionOrder, setResumeData]);

  // Create section components mapping
  const sectionComponents: Record<string, React.ReactNode> = useMemo(() => ({
    'personal-info': (
      <AccordionItem value="personal-info" key="personal-info">
        <AccordionTrigger className="text-lg font-semibold"><User className="mr-3 h-5 w-5 text-primary accordion-icon"/>Personal Information</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="name">Full Name</Label><Input id="name" value={resumeData.personalInfo.name} onChange={(e) => handlePersonalInfoChange("name", e.target.value)} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handlePersonalInfoChange("email", e.target.value)} /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={resumeData.personalInfo.phone} onChange={(e) => handlePersonalInfoChange("phone", e.target.value)} /></div>
            <div><Label htmlFor="address">Address</Label><Input id="address" value={resumeData.personalInfo.address} onChange={(e) => handlePersonalInfoChange("address", e.target.value)} /></div>
            <div><Label htmlFor="linkedin">LinkedIn Profile</Label><Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourusername" /></div>
            <div><Label htmlFor="github">GitHub Profile</Label><Input id="github" value={resumeData.personalInfo.github || ""} onChange={(e) => handlePersonalInfoChange("github", e.target.value)} placeholder="https://github.com/yourusername" /></div>
            <div><Label htmlFor="portfolio">Portfolio/Website</Label><Input id="portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => handlePersonalInfoChange("portfolio", e.target.value)} placeholder="https://yourwebsite.com" /></div>
          </div>
        </AccordionContent>
      </AccordionItem>
    ),
    'summary': (
      <AccordionItem value="summary" key="summary">
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
    ),
    'skills': (
      <AccordionItem value="skills" key="skills">
        <AccordionTrigger className="text-lg font-semibold"><Wrench className="mr-3 h-5 w-5 text-primary accordion-icon"/>Skills</AccordionTrigger>
        <AccordionContent className="pt-2 space-y-4">
          {(Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'object'
            ? resumeData.skills as import('@/lib/types/resume-types').SkillCategory[]
            : [] as import('@/lib/types/resume-types').SkillCategory[]
          ).map((skillCat, catIndex) => (
            <div key={skillCat.id} className="p-4 border rounded-lg space-y-3 relative bg-background/50 transition-colors hover:border-primary/50">
              <div>
                <Label>Category Name</Label>
                <Input 
                  value={skillCat.category} 
                  onChange={(e) => handleSkillCategoryChange(catIndex, 'category', e.target.value)}
                  placeholder="e.g., Programming Languages, Frameworks, Tools"
                />
              </div>
              <div>
                <Label>Skills</Label>
                <div className="space-y-2">
                  {(skillCat.items || [""]).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <Input 
                        value={item} 
                        onChange={(e) => handleSkillItemChange(catIndex, itemIndex, e.target.value)}
                        placeholder="e.g., JavaScript, React, Python"
                        className="flex-1"
                      />
                      {skillCat.items.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground transition-colors hover:text-destructive" 
                          onClick={() => removeSkillItem(catIndex, itemIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addSkillItem(catIndex)}
                    className="mt-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4"/>Add Skill
                  </Button>
                </div>
              </div>
              {(Array.isArray(resumeData.skills) && resumeData.skills.length > 1) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" 
                  onClick={() => removeSkillCategory(catIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addSkillCategory} className="transition-transform hover:scale-105">
            <PlusCircle className="mr-2"/>Add Skill Category
          </Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'education': (
      <AccordionItem value="education" key="education">
        <AccordionTrigger className="text-lg font-semibold"><GraduationCap className="mr-3 h-5 w-5 text-primary accordion-icon"/>Education</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.education?.map((edu, index) => (
            <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>School/University</Label><Input value={edu.school} onChange={(e) => handleEducationChange(index, "school", e.target.value)} /></div>
                <div><Label>Degree & Major</Label><Input value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} /></div>
                <div><Label>Location</Label><Input value={edu.location} onChange={(e) => handleEducationChange(index, "location", e.target.value)} /></div>
                <div><Label>Graduation Date</Label><Input value={edu.graduationDate} onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)} /></div>
                <div><Label>CGPA/Percentage</Label><Input value={edu.grade || ""} onChange={(e) => handleEducationChange(index, "grade", e.target.value)} placeholder="e.g., 3.8/4.0 or 85%" /></div>
              </div>
              {resumeData.education.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addEducation} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Education</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'experience': (
      <AccordionItem value="experience" key="experience">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <Briefcase className="mr-3 h-5 w-5 text-primary accordion-icon"/>Work Experience
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('experience');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
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
              {resumeData.experience.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addExperience} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Experience</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'projects': (
      <AccordionItem value="projects" key="projects">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <FolderKanban className="mr-3 h-5 w-5 text-primary accordion-icon"/>Projects (optional)
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('projects');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.projects?.map((proj, index) => (
            <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
              <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => handleProjectChange(index, "name", e.target.value)} /></div>
              <div>
                <Label>Description (Bullet Points)</Label>
                <div className="space-y-2">
                  {(Array.isArray(proj.description) ? proj.description : (proj.description ? [proj.description as string] : [""])).map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground mt-2">•</span>
                      <Input 
                        value={point} 
                        onChange={(e) => handleProjectDescriptionPointChange(index, pointIndex, e.target.value)}
                        onKeyDown={(e) => handleProjectDescriptionKeyDown(e, index, pointIndex)}
                        placeholder={pointIndex === 0 ? "Describe your project... (Press Enter to add more points)" : "Add another point... (Press Enter for more)"}
                        className="flex-1"
                      />
                      {Array.isArray(proj.description) && proj.description.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground transition-colors hover:text-destructive" 
                          onClick={() => removeProjectDescriptionPoint(index, pointIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addProjectDescriptionPoint(index)}
                    className="mt-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4"/>Add Point
                  </Button>
                </div>
              </div>
              <div><Label>Demo Link</Label><Input value={proj.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} /></div>
              {resumeData.projects && resumeData.projects.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addProject} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Project</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'certifications': (
      <AccordionItem value="certifications" key="certifications">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <Ribbon className="mr-3 h-5 w-5 text-primary accordion-icon"/>Certifications & Training (optional)
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('certifications');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.certifications?.map((cert, index) => (
            <div key={cert.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Certification Name</Label><Input value={cert.name} onChange={(e) => handleCertificationChange(index, "name", e.target.value)} /></div>
                <div><Label>Issuing Authority</Label><Input value={cert.authority} onChange={(e) => handleCertificationChange(index, "authority", e.target.value)} /></div>
                <div><Label>Date Earned</Label><Input value={cert.date} onChange={(e) => handleCertificationChange(index, "date", e.target.value)} /></div>
                <div><Label>URL (optional)</Label><Input value={cert.link || ''} onChange={(e) => handleCertificationChange(index, "link", e.target.value)} placeholder="https://example.com/cert" /></div>
              </div>
              {resumeData.certifications && resumeData.certifications.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addCertification} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Certification</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'awards': (
      <AccordionItem value="awards" key="awards">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <Award className="mr-3 h-5 w-5 text-primary accordion-icon"/>Awards & Achievements (optional)
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('awards');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.awards?.map((award, index) => (
            <div key={award.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1"><Label>Award/Achievement</Label><Input value={award.name} onChange={(e) => handleAwardChange(index, "name", e.target.value)} /></div>
                <div className="md:col-span-1"><Label>URL (optional)</Label><Input value={award.link || ''} onChange={(e) => handleAwardChange(index, "link", e.target.value)} placeholder="https://example.com/award" /></div>
              </div>
              {resumeData.awards && resumeData.awards.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeAward(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addAward} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Award</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'volunteer': (
      <AccordionItem value="volunteer" key="volunteer">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <Handshake className="mr-3 h-5 w-5 text-primary accordion-icon"/>Volunteer Experience (optional)
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('volunteer');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.volunteerExperience?.map((vol, index) => (
            <div key={vol.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Role</Label><Input value={vol.role} onChange={(e) => handleVolunteerChange(index, "role", e.target.value)} /></div>
                <div><Label>Organization</Label><Input value={vol.organization} onChange={(e) => handleVolunteerChange(index, "organization", e.target.value)} /></div>
                 <div><Label>Dates</Label><Input value={vol.dates} onChange={(e) => handleVolunteerChange(index, "dates", e.target.value)} /></div>
              </div>
              <div className="relative">
                <Label>Description</Label>
                <Textarea value={vol.description} onChange={(e) => handleVolunteerChange(index, "description", e.target.value)} rows={3} placeholder="Skills demonstrated or impact created..." className="pr-10" />
                <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-1">
                    {SpeechRecognition && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary" onClick={() => toggleListening(`volunteer-${index}`)}>
                            {isListening === `volunteer-${index}` ? <Mic className={cn("h-4 w-4 text-primary animate-pulse-mic")} /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
              </div>
              {resumeData.volunteerExperience && resumeData.volunteerExperience.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeVolunteer(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addVolunteer} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Volunteer Role</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'languages': (
      <AccordionItem value="languages" key="languages">
        <AccordionTrigger className="text-lg font-semibold group">
          <div className="flex items-center flex-1">
            <Languages className="mr-3 h-5 w-5 text-primary accordion-icon"/>Languages (optional)
          </div>
          <div
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity mr-2 flex items-center justify-center cursor-pointer hover:bg-accent rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility('languages');
            }}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {resumeData.languages?.map((lang, index) => (
            <div key={lang.id} className="p-4 border rounded-lg space-y-4 relative bg-background/50 transition-colors hover:border-primary/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Language</Label><Input value={lang.name} onChange={(e) => handleLanguageChange(index, "name", e.target.value)} /></div>
                <div><Label>Proficiency</Label><Input value={lang.proficiency} onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)} /></div>
              </div>
              {resumeData.languages && resumeData.languages.length > 1 && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground transition-colors hover:text-destructive" onClick={() => removeLanguage(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addLanguage} className="transition-transform hover:scale-105"><PlusCircle className="mr-2"/>Add Language</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    'ats-score': (
      <AccordionItem value="ats-score" key="ats-score">
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
    ),
  }), [jobDescription, isListening, isLoading, atsResult, SpeechRecognition, handlePersonalInfoChange, handleSummaryChange, handleEducationChange, handleExperienceChange, handleSkillCategoryChange, handleSkillItemChange, addSkillCategory, removeSkillCategory, addSkillItem, removeSkillItem, handleProjectChange, handleProjectDescriptionPointChange, addProjectDescriptionPoint, removeProjectDescriptionPoint, handleProjectDescriptionKeyDown, handleCertificationChange, handleAwardChange, handleVolunteerChange, handleLanguageChange, addEducation, removeEducation, addExperience, removeExperience, addProject, removeProject, addCertification, removeCertification, addAward, removeAward, addVolunteer, removeVolunteer, addLanguage, removeLanguage, toggleListening, handleScore, setJobDescription, resumeData.personalInfo, resumeData.summary, resumeData.education, resumeData.experience, resumeData.skills, resumeData.projects, resumeData.certifications, resumeData.awards, resumeData.volunteerExperience, resumeData.languages]);

  // Create draggable sections based on current order
  const draggableSections: DraggableResumeSection[] = useMemo(() => {
    return currentSectionOrder
      .filter(sectionType => !hiddenSections.includes(sectionType))
      .map(sectionType => ({
        id: sectionType,
        type: sectionType,
        content: sectionComponents[sectionType] || null,
      }))
      .filter(section => section.content !== null);
  }, [currentSectionOrder, sectionComponents, hiddenSections]);

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
        {micPermissionDenied && SpeechRecognition && (
          <div className="mb-4 p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive mb-1">Microphone Access Required</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  To use speech-to-text, you need to allow microphone access. Click the lock/info icon in your browser's address bar and enable microphone permissions, then reload this page.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()} 
                  className="mt-2"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-muted">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Drag the sections by their grip icon to reorder them. The preview and PDF will update automatically.
          </p>
        </div>
        <Accordion type="single" collapsible defaultValue="personal-info" className="w-full">
          <DraggableResumeBuilder 
            sections={draggableSections}
            onSectionsReorder={handleSectionsReorder}
          />
        </Accordion>
        
        {hiddenSections.length > 0 && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-dashed border-muted">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Hidden Sections:</strong> Click to restore them to your resume
            </p>
            <div className="flex flex-wrap gap-2">
              {hiddenSections.map(sectionType => {
                const labels: Record<string, string> = {
                  experience: 'Work Experience',
                  projects: 'Projects',
                  certifications: 'Certifications',
                  awards: 'Awards',
                  volunteer: 'Volunteer Experience',
                  languages: 'Languages'
                };
                return (
                  <button
                    key={sectionType}
                    onClick={() => toggleSectionVisibility(sectionType)}
                    className="text-xs px-3 py-1.5 bg-background border border-muted rounded-md hover:bg-accent hover:border-primary transition-colors cursor-pointer"
                  >
                    + Restore {labels[sectionType]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
