
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
  description: string[];
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

export interface CustomSectionItem {
  id: string;
  [key: string]: string; // Dynamic fields based on section type
}

export interface CustomSection {
  id: string;
  title: string;
  type: 'points' | 'categorical'; // points = bullet points, categorical = key-value pairs
  items: CustomSectionItem[];
  fields?: string[]; // For categorical type, defines the field names (e.g., ['Language', 'Proficiency'])
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Resume {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[] | SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  volunteerExperience: VolunteerExperience[];
  languages: Language[];
  customSections?: CustomSection[];
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
