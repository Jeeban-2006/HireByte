"use client";

import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { memo } from 'react';
import type { Resume } from '@/lib/types/resume-types';

// Register fonts if needed
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#555',
    gap: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: '#555',
  },
  contactSeparator: {
    fontSize: 9,
    color: '#555',
    marginHorizontal: 6,
  },
  contactLink: {
    fontSize: 9,
    color: '#0066cc',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 3,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.3,
  },
  experienceItem: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  companyInfo: {
    fontSize: 10,
    color: '#555',
    marginBottom: 3,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.3,
  },
  skillsList: {
    fontSize: 10,
    lineHeight: 1.3,
  },
  projectItem: {
    marginBottom: 7,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 9,
    color: '#0066cc',
  },
});

interface ResumePDFProps {
  resume: Resume;
  sectionOrder?: string[];
}

export const ResumePDF = memo(function ResumePDF({ resume, sectionOrder }: ResumePDFProps) {
  const defaultOrder = [
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'volunteerExperience',
    'languages',
  ];

  // Map kebab-case section names to camelCase
  const sectionNameMap: Record<string, string> = {
    'personal-info': 'personalInfo',
    'summary': 'summary',
    'skills': 'skills',
    'education': 'education',
    'experience': 'experience',
    'projects': 'projects',
    'certifications': 'certifications',
    'awards': 'awards',
    'volunteer': 'volunteerExperience',
    'languages': 'languages',
    'ats-score': '', // Skip this in PDF
    'job-description': '', // Skip this in PDF
  };

  // Convert the sectionOrder from kebab-case to camelCase and filter out non-PDF sections and hidden sections
  const hiddenSections = resume.hiddenSections || [];
  const mappedOrder = sectionOrder 
    ? sectionOrder
        .filter(section => !hiddenSections.includes(section))
        .map(section => sectionNameMap[section] || '')
        .filter(s => s !== '')
    : defaultOrder;

  const order = mappedOrder.length > 0 ? mappedOrder : defaultOrder;

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case 'personalInfo':
        const contactItems = [];
        
        if (resume.personalInfo.address) {
          contactItems.push(resume.personalInfo.address);
        }
        if (resume.personalInfo.email) {
          contactItems.push(resume.personalInfo.email);
        }
        if (resume.personalInfo.phone) {
          contactItems.push(resume.personalInfo.phone);
        }
        if (resume.personalInfo.linkedin) {
          contactItems.push({ type: 'link', url: resume.personalInfo.linkedin, text: 'LinkedIn' });
        }
        if (resume.personalInfo.github) {
          contactItems.push({ type: 'link', url: resume.personalInfo.github, text: 'GitHub' });
        }
        if (resume.personalInfo.portfolio) {
          contactItems.push({ type: 'link', url: resume.personalInfo.portfolio, text: 'Portfolio' });
        }

        return (
          <View style={styles.header} key="personalInfo">
            <Text style={styles.name}>{resume.personalInfo.name}</Text>
            <View style={styles.contactRow}>
              {contactItems.map((item, index) => (
                <View key={index} style={styles.contactItem}>
                  {index > 0 && <Text style={styles.contactSeparator}>•</Text>}
                  {typeof item === 'string' ? (
                    <Text style={styles.contactText}>{item}</Text>
                  ) : (
                    <Link src={item.url} style={styles.contactLink}>
                      {item.text}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          </View>
        );

      case 'summary':
        return resume.summary ? (
          <View style={styles.section} key="summary" wrap={false}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionContent}>{resume.summary}</Text>
          </View>
        ) : null;

      case 'experience':
        return resume.experience && resume.experience.length > 0 ? (
          <View style={styles.section} key="experience" wrap={false}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={styles.companyInfo}>
                  {exp.company} | {exp.location} | {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'education':
        return resume.education && resume.education.length > 0 ? (
          <View style={styles.section} key="education" wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.companyInfo}>
                  {edu.school} | {edu.location} | Graduated: {edu.graduationDate}
                </Text>
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return resume.skills && resume.skills.length > 0 ? (
          <View style={styles.section} key="skills" wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsList}>{resume.skills.join(' • ')}</Text>
          </View>
        ) : null;

      case 'projects':
        return resume.projects && resume.projects.length > 0 ? (
          <View style={styles.section} key="projects" wrap={false}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{proj.name}</Text>
                <Text style={styles.description}>{proj.description}</Text>
                {proj.link && (
                  <Link src={proj.link} style={styles.link}>
                    {proj.link}
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'certifications':
        return resume.certifications && resume.certifications.length > 0 ? (
          <View style={styles.section} key="certifications" wrap={false}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert, index) => (
              <View key={index}>
                <Text style={styles.sectionContent}>
                  • {cert.name} - {cert.authority} ({cert.date})
                </Text>
                {cert.link && (
                  <Link src={cert.link} style={styles.link}>
                    {cert.link}
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'awards':
        return resume.awards && resume.awards.length > 0 ? (
          <View style={styles.section} key="awards" wrap={false}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {resume.awards.map((award, index) => (
              <View key={index}>
                <Text style={styles.sectionContent}>
                  • {award.name}
                </Text>
                {award.link && (
                  <Link src={award.link} style={styles.link}>
                    {award.link}
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'volunteerExperience':
        return resume.volunteerExperience && resume.volunteerExperience.length > 0 ? (
          <View style={styles.section} key="volunteerExperience" wrap={false}>
            <Text style={styles.sectionTitle}>Volunteer Experience</Text>
            {resume.volunteerExperience.map((vol, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{vol.role}</Text>
                <Text style={styles.companyInfo}>
                  {vol.organization} | {vol.dates}
                </Text>
                {vol.description && (
                  <Text style={styles.description}>{vol.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'languages':
        return resume.languages && resume.languages.length > 0 ? (
          <View style={styles.section} key="languages" wrap={false}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {resume.languages.map((lang, index) => (
              <Text key={index} style={styles.sectionContent}>
                • {lang.name} ({lang.proficiency})
              </Text>
            ))}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {order.map((sectionType) => renderSection(sectionType))}
      </Page>
    </Document>
  );
});
