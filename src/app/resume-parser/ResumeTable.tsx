import { Fragment } from "react";
import type { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cn("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => (
            <Fragment key={idx}>
              • {x}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const education = resume.education || [];
  const experience = resume.experience || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  
  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>Profile</TableRowHeader>
        <TableRow label="Name" value={resume.personalInfo.name} />
        <TableRow label="Email" value={resume.personalInfo.email} />
        <TableRow label="Phone" value={resume.personalInfo.phone} />
        <TableRow label="Location" value={resume.personalInfo.address} />
        <TableRow label="LinkedIn" value={resume.personalInfo.linkedin} />
        <TableRow label="Portfolio" value={resume.personalInfo.portfolio} />
        <TableRow label="Summary" value={resume.summary} />
        <TableRowHeader>Education</TableRowHeader>
        {education.map((edu, idx) => (
          <Fragment key={idx}>
            <TableRow label="School" value={edu.school} />
            <TableRow label="Degree" value={edu.degree} />
            <TableRow label="Location" value={edu.location} />
            <TableRow label="Date" value={edu.graduationDate} />
            <TableRow
              label="Description"
              value=""
              className={
                education.length - 1 !== 0 &&
                idx !== education.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>Work Experience</TableRowHeader>
        {experience.map((exp, idx) => (
          <Fragment key={idx}>
            <TableRow label="Company" value={exp.company} />
            <TableRow label="Job Title" value={exp.jobTitle} />
            <TableRow label="Location" value={exp.location} />
            <TableRow label="Date" value={`${exp.startDate} - ${exp.endDate}`} />
            <TableRow
              label="Description"
              value={exp.description}
              className={
                experience.length - 1 !== 0 &&
                idx !== experience.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {projects.length > 0 && (
          <>
            <TableRowHeader>Projects</TableRowHeader>
            {projects.map((proj, idx) => (
              <Fragment key={idx}>
                <TableRow label="Name" value={proj.name} />
                <TableRow label="Description" value={proj.description} />
                <TableRow 
                  label="Link" 
                  value={proj.link || ""} 
                  className={
                    projects.length - 1 !== 0 &&
                    idx !== projects.length - 1 &&
                    "!border-b-4"
                  }
                />
              </Fragment>
            ))}
          </>
        )}
        <TableRowHeader>Skills</TableRowHeader>
        <TableRow label="Skills" value={skills.join(", ")} />
      </tbody>
    </table>
  );
};
