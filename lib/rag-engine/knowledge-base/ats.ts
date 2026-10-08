import { RAGKnowledgeChunk } from '../types';

export const ATS_KNOWLEDGE_CHUNKS: RAGKnowledgeChunk[] = [
  {
    id: 'ats-format-single-column',
    category: 'ATS Rubric',
    roleTarget: 'General',
    title: 'ATS Single-Column Parsing Standard',
    topic: 'Layout & Hierarchy',
    content: `Modern Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS) parse resumes sequentially from top to bottom. Multi-column layouts, sidebars, graphic tables, and text boxes often scramble reading order—causing skills and job dates to be misattributed or omitted entirely. Use a single-column layout with standard section headings (Summary, Technical Skills, Experience, Projects, Education).`,
    tags: ['single-column', 'layout', 'parsing', 'tables', 'sidebars', 'format', 'ats'],
  },
  {
    id: 'ats-keyword-optimization',
    category: 'ATS Rubric',
    roleTarget: 'General',
    title: 'ATS Keyword Matching & Semantic Density',
    topic: 'Keyword Optimization',
    content: `ATS algorithms match candidate resumes against target job descriptions using exact-string matching and semantic keyword clusters. Skills should be mentioned both in a dedicated 'Technical Skills' inventory and reinforced within bullet points demonstrating practical application. Avoid keyword stuffing (listing skills in white text or repeating lists) as modern ATS parsers flag unnatural density.`,
    tags: ['keywords', 'exact-match', 'semantic-density', 'matching', 'skills-inventory'],
  },
  {
    id: 'ats-section-naming-hygiene',
    category: 'ATS Rubric',
    roleTarget: 'General',
    title: 'Standard Section Heading Conventions',
    topic: 'Section Structure',
    content: `ATS parsers use semantic regex to recognize standard section titles. Creative headings such as 'Where I Have Been' or 'My Toolkit' frequently fail parser detection. Always use standard recognized headings: 'Work Experience', 'Technical Projects', 'Education', 'Technical Skills', 'Certifications', and 'Professional Summary'.`,
    tags: ['section-headings', 'naming', 'conventions', 'experience', 'projects', 'education'],
  },
  {
    id: 'ats-contact-information-hygiene',
    category: 'ATS Rubric',
    roleTarget: 'General',
    title: 'Contact Information Placement and Formatting',
    topic: 'Contact Hygiene',
    content: `Contact details must reside in the document body rather than inside header or footer zones, because many legacy ATS parsers completely ignore PDF header/footer metadata. Always provide: full name, active professional email (e.g. name@domain.com), telephone number with country code, location (City, State/Country), clickable LinkedIn profile, and active GitHub URL.`,
    tags: ['contact-info', 'email', 'phone', 'github', 'linkedin', 'header-footer'],
  },
  {
    id: 'ats-word-count-economy',
    category: 'Formatting',
    roleTarget: 'General',
    title: 'Resume Length & Word Count Economy',
    topic: 'Document Length',
    content: `For students, recent graduates, and early-career engineers (<5 years experience), the optimal resume length is strictly 1 page (approximately 380 to 650 words). Resumes with under 250 words appear incomplete and lack depth, while multi-page resumes for junior candidates are penalized by human recruiters during the 6-second initial scan.`,
    tags: ['length', 'word-count', '1-page', 'junior', 'early-career'],
  },
  {
    id: 'ats-date-and-chronology-standards',
    category: 'ATS Rubric',
    roleTarget: 'General',
    title: 'Date and Chronology Formatting',
    topic: 'Chronology',
    content: `List all work experience and educational credentials in reverse chronological order (most recent first). Format dates consistently using standard conventions: 'Month Year – Month Year' (e.g., 'May 2024 – Aug 2024' or '05/2024 – 08/2024') or 'Present' for ongoing positions. Inconsistent or missing date formats confuse ATS experience tenure calculations.`,
    tags: ['dates', 'chronology', 'reverse-chronological', 'tenure'],
  }
];
