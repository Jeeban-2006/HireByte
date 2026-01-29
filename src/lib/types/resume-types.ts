
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  github: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  graduationDate: string;
  grade: string; // Can store CGPA (e.g. "3.8/4.0") or percentage (e.g. "85%")
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  authority: string;
  date: string;
  link?: string;
}

export interface Award {
  id: string;
  name: string;
  link?: string;
}

export interface VolunteerExperience {
  id: string;
  role: string;
  organization: string;
  dates: string;
  description: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  volunteerExperience: VolunteerExperience[];
  languages: Language[];
  sectionOrder?: string[];
  hiddenSections?: string[];
}

export interface ResumeTextSections {
    skills: string;
    experience: string;
    other: string;
}

export interface AtsScoreResumeOutput {
  score: number;
  feedback: string;
}
