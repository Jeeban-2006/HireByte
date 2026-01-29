
import type { Resume } from "./types";

/**
 * Extracts all relevant text from a resume object and compiles it into a single string.
 * @param resume The resume data object.
 * @returns A single string containing all textual information from the resume.
 */
export function extractTextFromResume(resume: Resume): string {
  const parts: (string | undefined | null)[] = [];

  // Personal Info
  parts.push(resume.personalInfo.name);
  parts.push(resume.personalInfo.email);
  parts.push(resume.personalInfo.phone);
  parts.push(resume.personalInfo.address);
  parts.push(`LinkedIn: ${resume.personalInfo.linkedin}`);
  parts.push(`Portfolio: ${resume.personalInfo.portfolio}`);
  
  // Summary
  parts.push("\n## Summary\n");
  parts.push(resume.summary);

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    parts.push("\n## Experience\n");
    resume.experience.forEach(exp => {
      parts.push(`- ${exp.jobTitle} at ${exp.company} (${exp.location})`);
      parts.push(`  ${exp.startDate} - ${exp.endDate}`);
      parts.push(exp.description);
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    parts.push("\n## Education\n");
    resume.education.forEach(edu => {
      parts.push(`- ${edu.degree}, ${edu.school} (${edu.location})`);
      parts.push(`  Graduated: ${edu.graduationDate}`);
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    parts.push("\n## Skills\n");
    parts.push(resume.skills.join(", "));
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    parts.push("\n## Projects\n");
    resume.projects.forEach(proj => {
      parts.push(`- ${proj.name}: ${proj.description}`);
      if (proj.link) parts.push(`  Link: ${proj.link}`);
    });
  }
  
  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    parts.push("\n## Certifications\n");
    resume.certifications.forEach(cert => {
        parts.push(`- ${cert.name}, ${cert.authority} (${cert.date})`);
    });
  }
  
  // Awards
  if (resume.awards && resume.awards.length > 0) {
    parts.push("\n## Awards\n");
    resume.awards.forEach(award => {
        parts.push(`- ${award.name}`);
    });
  }
  
  // Volunteer Experience
  if (resume.volunteerExperience && resume.volunteerExperience.length > 0) {
    parts.push("\n## Volunteer Experience\n");
    resume.volunteerExperience.forEach(vol => {
        parts.push(`- ${vol.role} at ${vol.organization} (${vol.dates})`);
        parts.push(vol.description);
    });
  }
  
  // Languages
  if (resume.languages && resume.languages.length > 0) {
    parts.push("\n## Languages\n");
    resume.languages.forEach(lang => {
        parts.push(`- ${lang.name} (${lang.proficiency})`);
    });
  }

  return parts.filter(Boolean).join("\n");
}
