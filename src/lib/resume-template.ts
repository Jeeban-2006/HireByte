import type { Resume } from "./types";

export const initialResumeData: Resume = {
  personalInfo: {
    name: "Alex Doe",
    email: "alex.doe@email.com",
    phone: "(123) 456-7890",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexdoe",
    github: "github.com/alexdoe",
    portfolio: "alexdoe.dev",
  },
  summary:
    "Innovative Full Stack Developer with 5+ years of experience in building and maintaining responsive web applications. Proficient in JavaScript, React, Node.js, and modern cloud technologies. Seeking to leverage technical skills to contribute to a dynamic engineering team.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: `- Led the development of a new customer-facing portal, resulting in a 20% increase in user engagement.
- Implemented a CI/CD pipeline using Jenkins and Docker, reducing deployment time by 50%.
- Mentored junior developers and conducted code reviews to ensure code quality and best practices.`,
    },
    {
        id: "exp2",
        jobTitle: "Software Engineer",
        company: "Innovate Co.",
        location: "Palo Alto, CA",
        startDate: "Jun 2018",
        endDate: "Dec 2020",
        description: `- Developed and maintained features for a SaaS platform using React and Node.js.
- Collaborated with product managers and designers to translate requirements into technical solutions.
- Improved application performance by optimizing database queries and frontend rendering.`,
      },
  ],
  education: [
    {
      id: "edu1",
      school: "State University",
      degree: "Bachelor of Science in Computer Science",
      location: "San Jose, CA",
      graduationDate: "May 2018",
      grade: "3.8/4.0",
    },
  ],
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Node.js",
    "Express.js",
    "HTML5 & CSS3",
    "SQL",
    "NoSQL",
    "AWS",
    "Docker",
    "Git",
    "Agile Methodologies",
  ],
  projects: [
    {
      id: "proj1",
      name: "E-commerce Platform",
      description: "A full-featured e-commerce platform with a custom CMS and payment integration.",
      link: "https://example.com/ecommerce",
    },
    {
      id: "proj2",
      name: "Data Visualization Dashboard",
      description: "An interactive dashboard for visualizing complex datasets using D3.js and React.",
      link: "https://example.com/dashboard",
    }
  ],
  certifications: [
      { id: "cert1", name: "Certified Kubernetes Application Developer", authority: "The Linux Foundation", date: "Feb 2023", link: "https://example.com/cert" }
  ],
  awards: [
      { id: "award1", name: "Employee of the Quarter - Q4 2022", link: "https://example.com/award" }
  ],
  volunteerExperience: [
      { id: "vol1", role: "Mentor", organization: "Code for America", dates: "2022 - Present", description: "Mentored aspiring developers in web development fundamentals."}
  ],
  languages: [
      { id: "lang1", name: "English", proficiency: "Native" },
      { id: "lang2", name: "Spanish", proficiency: "Professional Working Proficiency" }
  ]
};
