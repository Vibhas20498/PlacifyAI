import { ResumeAnalysisResult } from '../types';

export const SKILL_CANONICAL_ALIASES: Record<string, string[]> = {
  // Data Analysis, BI & Visualization
  'Excel': ['excel', 'ms excel', 'microsoft excel', 'ms-excel', 'advanced excel', 'excel vba', 'vlookup', 'xlookup', 'pivot tables', 'macros'],
  'Power BI': ['power bi', 'powerbi', 'power-bi', 'ms power bi', 'microsoft power bi', 'power bi desktop', 'powerbi desktop', 'power bi service', 'powerbi service'],
  'Tableau': ['tableau', 'tableau desktop', 'tableau server', 'tableau prep', 'tableau public'],
  'Data Cleaning': ['data cleaning', 'data cleansing', 'data wrangling', 'data munging', 'data preprocessing', 'data quality', 'data transformation'],
  'Data Visualization': ['data visualization', 'data visualisation', 'data viz', 'visualizations', 'visualisations', 'charts', 'graphing', 'data storytelling'],
  'Dashboards': ['dashboards', 'dashboard', 'dashboarding', 'interactive dashboards', 'kpi dashboards'],
  'ETL': ['etl', 'elt', 'etl pipelines', 'data pipelines', 'etl processes', 'extract transform load'],
  'DAX': ['dax', 'data analysis expressions'],
  'Power Query': ['power query', 'powerquery', 'm query', 'm language'],
  'Data Modeling': ['data modeling', 'data modelling', 'dimensional modeling', 'star schema', 'snowflake schema', 'er modeling', 'data schema'],
  'Statistical Analysis': ['statistical analysis', 'statistics', 'inferential statistics', 'descriptive statistics', 'statistical modeling', 'statistical tests', 'hypothesis testing', 'anova', 't-test', 'chi-square'],
  'A/B Testing': ['a/b testing', 'ab testing', 'split testing', 'experimentation'],
  'Matplotlib': ['matplotlib', 'plotly', 'bokeh'],
  'Seaborn': ['seaborn', 'ggplot2'],
  'KPI Reporting': ['kpi reporting', 'kpi', 'kpis', 'business intelligence', 'bi reporting', 'executive reporting'],
  'Data Warehousing': ['data warehousing', 'data warehouse', 'dwh', 'snowflake', 'bigquery', 'redshift', 'databricks', 'synapse'],
  'Hypothesis Testing': ['hypothesis testing', 'p-value', 'confidence intervals'],
  'Statistical Modeling': ['statistical modeling', 'statistical modelling', 'regression modeling', 'logistic regression', 'linear regression'],

  // AI / ML / Data Science
  'Python': ['python', 'python3', 'python 3', 'pyspark'],
  'Pandas': ['pandas'],
  'NumPy': ['numpy'],
  'Scikit-Learn': ['scikit-learn', 'scikit learn', 'sklearn'],
  'PyTorch': ['pytorch', 'torch'],
  'TensorFlow': ['tensorflow', 'tf'],
  'Deep Learning': ['deep learning', 'neural networks', 'ann', 'cnn', 'rnn', 'lstm', 'transformers'],
  'Machine Learning': ['machine learning', 'ml', 'supervised learning', 'unsupervised learning', 'random forest', 'xgboost', 'lightgbm'],
  'NLP': ['nlp', 'natural language processing', 'spacy', 'nltk', 'transformers', 'bert', 'llms', 'large language models', 'langchain', 'huggingface'],
  'Computer Vision': ['computer vision', 'cv', 'opencv', 'object detection', 'image segmentation', 'yolo'],
  'LLMs': ['llms', 'llm', 'large language models', 'generative ai', 'genai', 'prompt engineering', 'langchain', 'llamaindex', 'rag'],
  'Model Deployment': ['model deployment', 'model serving', 'fastapi', 'flask', 'triton', 'torchserve', 'onnx', 'docker', 'mlflow'],
  'MLOps': ['mlops', 'mlflow', 'weights & biases', 'wandb', 'dvc', 'kubeflow', 'sagemaker'],
  'Apache Spark': ['apache spark', 'spark', 'pyspark'],

  // Software Engineering & Fullstack
  'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sql server', 'ms sql', 't-sql', 'pl/sql', 'sqlite', 'oracle sql', 'nosql', 'bigquery', 'snowflake'],
  'PostgreSQL': ['postgresql', 'postgres'],
  'React': ['react', 'react.js', 'reactjs', 'react native'],
  'TypeScript': ['typescript', 'ts'],
  'JavaScript': ['javascript', 'js', 'es6', 'ecmascript'],
  'Node.js': ['node.js', 'nodejs', 'node'],
  'Next.js': ['next.js', 'nextjs', 'next'],
  'REST APIs': ['rest apis', 'rest api', 'rest', 'restful', 'restful apis', 'api development', 'endpoints'],
  'Docker': ['docker', 'dockerfile', 'containerization', 'containers'],
  'Redis': ['redis', 'caching'],
  'Git': ['git', 'github', 'gitlab', 'version control'],
  'CI/CD': ['ci/cd', 'cicd', 'github actions', 'jenkins', 'pipelines'],
  'Tailwind CSS': ['tailwind css', 'tailwind', 'tailwindcss'],
  'HTML': ['html', 'html5'],
  'CSS': ['css', 'css3'],
  'FastAPI': ['fastapi', 'fast api'],
  'Django': ['django', 'django rest framework', 'drf'],
  'Java': ['java', 'core java'],
  'Spring Boot': ['spring boot', 'springboot', 'spring framework'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services', 's3', 'ec2', 'lambda'],
  'Linux': ['linux', 'ubuntu', 'bash', 'shell scripting'],
  'Kafka': ['kafka', 'apache kafka'],
  'Redux': ['redux', 'redux toolkit'],
  'Jest': ['jest'],
  'Responsive Design': ['responsive design', 'mobile-first', 'responsive ui'],
  'Terraform': ['terraform', 'iac'],
  'GitHub Actions': ['github actions', 'gh actions'],
  'Nginx': ['nginx'],
  'Bash': ['bash', 'shell script', 'shell scripting'],
  'Monitoring': ['monitoring', 'grafana', 'prometheus', 'cloudwatch', 'datadog'],
};

export const COMPREHENSIVE_SKILLS_DICTIONARY: string[] = [
  ...Object.keys(SKILL_CANONICAL_ALIASES),
  'C++', 'C', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Scala', 'Dart', 'Shell',
  'Vue', 'Vue.js', 'Angular', 'Express', 'Express.js', 'Flask', 'Spring', 'Nest.js', 'Bootstrap', 'GraphQL', 'gRPC', 'ASP.NET',
  'GCP', 'Google Cloud Platform', 'Azure', 'Jenkins', 'Ansible', 'Prometheus', 'Grafana',
  'MySQL', 'MongoDB', 'Cassandra', 'Elasticsearch', 'DynamoDB', 'Supabase', 'Firebase', 'SQLite', 'Prisma', 'TypeORM', 'Hibernate', 'RabbitMQ',
  'OpenCV', 'LangChain', 'LlamaIndex', 'HuggingFace', 'XGBoost', 'Keras',
  'Data Structures', 'Algorithms', 'System Design', 'OOP', 'Object Oriented Programming', 'Microservices', 'Distributed Systems', 'Agile', 'Scrum', 'Unit Testing', 'PyTest', 'Cypress'
];

/**
 * Robust skill tester: matches canonical skills, multi-word phrases, abbreviations, and spaceless variations.
 */
export function isSkillPresent(rawText: string, skillName: string): boolean {
  if (!rawText || !skillName) return false;
  
  const lowerText = rawText.toLowerCase();
  const lowerSkill = skillName.toLowerCase();
  const textNoSpaces = lowerText.replace(/[^a-z0-9+#]/g, '');

  const aliases = SKILL_CANONICAL_ALIASES[skillName] || [lowerSkill];

  for (const alias of aliases) {
    const lowerAlias = alias.toLowerCase();

    // 1. Exact word boundary regex match
    const escaped = lowerAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const wordBoundaryRegex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (wordBoundaryRegex.test(lowerText)) {
      return true;
    }

    // 2. Multi-word phrase substring match
    if (lowerAlias.length > 3 && lowerText.includes(lowerAlias)) {
      return true;
    }

    // 3. Spaceless match for compound tokens (e.g. "powerbi" vs "power bi", "msexcel" vs "ms excel")
    const aliasNoSpaces = lowerAlias.replace(/[^a-z0-9+#]/g, '');
    if (aliasNoSpaces.length >= 4 && textNoSpaces.includes(aliasNoSpaces)) {
      return true;
    }
  }

  return false;
}

export const ACTION_VERBS = {
  strong: [
    'Architected', 'Engineered', 'Developed', 'Spearheaded', 'Optimized', 'Orchestrated',
    'Designed', 'Implemented', 'Constructed', 'Formulated', 'Streamlined', 'Accelerated',
    'Automated', 'Scaled', 'Deployed', 'Overhauled', 'Transformed', 'Pioneered', 'Delivered'
  ],
  weak: [
    'Worked on', 'Helped with', 'Responsible for', 'Assisted', 'Handled', 'Participated in',
    'Did', 'Made', 'Looked into', 'Maintained', 'Was part of', 'Tried to'
  ]
};

export interface ExtractedResumeEntities {
  name?: string;
  email?: string;
  phone?: string;
  university?: string;
  degree?: string;
  cgpa?: number;
  tier?: 1 | 2 | 3;
  graduationYear?: number;
  experienceMonths?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  projectsCount: number;
  hasProductionDeployment: boolean;
  rawText: string;
}

/**
 * Extracts plain text and key career signals from raw text or buffer data.
 */
export function parseResumeText(rawContent: string): ExtractedResumeEntities {
  const text = rawContent.replace(/\r\n/g, '\n').replace(/\t/g, ' ');

  // 1. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : undefined;

  // 2. Phone extraction
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // 3. GitHub & LinkedIn profile URLs
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUrl = githubMatch ? `https://github.com/${githubMatch[1]}` : undefined;

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : undefined;

  // 4. University / College Detection
  let university: string | undefined;
  let tier: 1 | 2 | 3 = 2;

  const tier1Regex = /(Indian Institute of Technology|National Institute of Technology|BITS Pilani|IIIT|IIT|NIT|Birla Institute)/i;
  const universityRegex = /(?:Indian Institute of Technology|National Institute of Technology|BITS Pilani|IIIT\s+[A-Za-z]+|IIT\s+[A-Za-z]+|NIT\s+[A-Za-z]+|[A-Z][a-zA-Z\s,]+(?:University|Institute of Technology|Engineering College|Institute of Science|College of Engineering|Autonomous College))/;
  
  const uniMatch = text.match(universityRegex);
  if (uniMatch) {
    university = uniMatch[0].trim();
    if (tier1Regex.test(university)) {
      tier = 1;
    }
  }

  // 5. Degree & Branch Detection
  let degree: string | undefined;
  const degreeRegex = /(B\.?Tech|B\.?E\.?|M\.?Tech|BCA|MCA|B\.?S\.?|M\.?S\.?|Bachelor of Technology|Bachelor of Engineering)(?:\s+(?:in|of)?\s+([A-Za-z\s&]+))?/i;
  const degreeMatch = text.match(degreeRegex);
  if (degreeMatch) {
    const degType = degreeMatch[1];
    const branch = degreeMatch[2] ? degreeMatch[2].trim() : 'Computer Science';
    degree = `${degType} in ${branch.replace(/,\s*.*$/, '')}`;
  }

  // 6. CGPA / GPA Detection (0.0 to 10.0 scale)
  let cgpa: number | undefined;
  const cgpaRegex = /(?:CGPA|GPA|Score|Pointer)[:\s]*([0-9]\.[0-9]{1,2})(?:\s*\/\s*10(?:\.0)?)?/i;
  const directCgpaRegex = /\b([7-9]\.[0-9]{1,2})\s*\/\s*10(?:\.0)?\b/;
  
  const cgpaMatch = text.match(cgpaRegex) || text.match(directCgpaRegex);
  if (cgpaMatch) {
    const val = parseFloat(cgpaMatch[1]);
    if (val >= 4.0 && val <= 10.0) {
      cgpa = val;
    }
  }

  // 7. Graduation Year
  let graduationYear: number | undefined;
  const yearMatch = text.match(/\b(202[0-9])\b/g);
  if (yearMatch) {
    const years = yearMatch.map(Number).filter((y) => y >= 2020 && y <= 2030);
    if (years.length > 0) {
      graduationYear = Math.max(...years);
    }
  }

  // 8. Verified Skills Scanner using isSkillPresent
  const matchedSkills = new Set<string>();
  
  // Check all canonical skills first
  for (const skill of Object.keys(SKILL_CANONICAL_ALIASES)) {
    if (isSkillPresent(text, skill)) {
      matchedSkills.add(skill);
    }
  }

  // Check additional dictionary skills
  for (const skill of COMPREHENSIVE_SKILLS_DICTIONARY) {
    if (!matchedSkills.has(skill) && isSkillPresent(text, skill)) {
      matchedSkills.add(skill);
    }
  }

  // Normalize specific duplicates (e.g., React.js -> React)
  if (matchedSkills.has('React.js')) matchedSkills.add('React');
  if (matchedSkills.has('Node.js')) matchedSkills.add('Node.js');
  if (matchedSkills.has('Postgres')) matchedSkills.add('PostgreSQL');

  const skillsList = Array.from(matchedSkills);

  // 9. Projects Count & Live Production Deployment
  const projectMentions = (text.match(/(?:project|application|system|pipeline|platform|dashboard|service)\b/gi) || []).length;
  const projectsCount = Math.min(8, Math.max(1, Math.round(projectMentions / 4)));

  const hasProductionDeployment = /(?:deployed|vercel|aws|docker|kubernetes|live url|production|render|heroku|ci\/cd)/i.test(text);

  // 10. Experience in months
  let experienceMonths = 0;
  if (/intern(?:ship)?/i.test(text)) {
    experienceMonths = 3;
    const internMentions = (text.match(/intern/gi) || []).length;
    if (internMentions >= 2) experienceMonths = 6;
  }
  if (/software engineer|developer|full\s*stack/i.test(text) && !/seeking|aspiring/i.test(text)) {
    experienceMonths = Math.max(experienceMonths, 6);
  }

  // 11. Candidate Name (if at the top)
  let name: string | undefined;
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 35 && !/@|github|linkedin|http|phone|resume|curriculum/i.test(firstLine)) {
      name = firstLine;
    }
  }

  return {
    name,
    email,
    phone,
    university,
    degree,
    cgpa,
    tier,
    graduationYear,
    experienceMonths,
    githubUrl,
    linkedinUrl,
    skills: skillsList,
    projectsCount,
    hasProductionDeployment,
    rawText: text,
  };
}

/**
 * Extracts real bullet points and project/experience sentences directly from candidate resume text
 */
export function extractResumeBullets(rawText: string): string[] {
  if (!rawText || rawText.trim().length === 0) return [];

  const text = rawText.replace(/\r\n/g, '\n').replace(/\t/g, ' ');
  const rawLines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const candidateBullets: string[] = [];
  const headerRegex = /^(?:education|skills|technical skills|skills & abilities|core competencies|tools|languages|frameworks|projects|academic projects|personal projects|technical projects|experience|work experience|employment history|professional experience|certifications|achievements|awards|contact|contact information|summary|professional summary|objective|profile|references|publications)\b[:\s\-–—]*$/i;
  const contactInfoRegex = /(@|github\.com|linkedin\.com|https?:\/\/|\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|portfolio|email:|phone:|mobile:)/i;
  const educationDegreeRegex = /(?:b\.?tech|b\.?e\.?|m\.?tech|bca|mca|b\.?s\.?|m\.?s\.?|bachelor of|master of|diploma in|university|institute of|college of|engineering college|cgpa[:\s]|gpa[:\s]|\/\s*10(?:\.0)?|\bpointer\b)/i;
  const pureSkillListRegex = /^(?:languages|frontend|backend|frameworks|libraries|databases|tools|cloud|devops|operating systems|platforms|technologies)[:\-]\s*/i;
  const dateOnlyRegex = /^(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}\s*[-–—]\s*(?:\d{4}|present|current|ongoing))\s*$/i;

  for (const line of rawLines) {
    // 1. Skip section headers
    if (headerRegex.test(line)) continue;
    // 2. Skip contact info lines
    if (contactInfoRegex.test(line)) continue;
    // 3. Skip education/degree lines
    if (educationDegreeRegex.test(line)) continue;
    // 4. Skip pure skill category lists
    if (pureSkillListRegex.test(line)) continue;
    // 5. Skip date-only lines
    if (dateOnlyRegex.test(line)) continue;

    // Check if line starts with bullet marker
    const bulletMatch = line.match(/^(?:[•●▪▫–\-\*→>]|\(?\d{1,2}[\.\)]|\[\d{1,2}\])\s*(.+)$/);
    let candidate = bulletMatch ? bulletMatch[1].trim() : line.trim();

    // Clean any leading dashes or symbols
    candidate = candidate.replace(/^[-•*–—]+\s*/, '').trim();

    // Helper: is the line a pure skill/tag list (e.g. "React, Node, SQL, Git, HTML")?
    const commaCount = (candidate.match(/,/g) || []).length;
    const isPureCommaList = commaCount >= 3 && !/\b(?:using|with|to|and|for|by|in|at|on)\b/i.test(candidate);
    if (isPureCommaList) continue;

    // Helper: is the line a project title line without action (e.g. "Library Management System (React, Node)")?
    const isProjectTitleOnly = !bulletMatch && /^[A-Za-z0-9\s\-–—]+(?:\s*\([A-Za-z0-9\s,./#+-]+\))?\s*$/i.test(candidate) && !/\b(?:using|built|developed|created|worked|implemented|designed|manage|optimized|automated|tracking|serving|to|for)\b/i.test(candidate);
    if (isProjectTitleOnly) continue;

    // If candidate line has multiple sentences, split them
    if (candidate.length > 200 || candidate.includes('. ')) {
      const sentences = candidate.split(/(?<=[.!?])\s+(?=[A-Z])/);
      for (const sent of sentences) {
        const s = sent.replace(/^[-•*–—\d\.\)]+\s*/, '').trim();
        if (s.length >= 18 && s.length <= 350) {
          const words = s.split(/\s+/).filter((w) => w.length > 0);
          const hasActionWord = /\b(?:using|with|to|and|for|by|in|built|developed|created|worked|implemented|designed|manage|optimized|automated|tested|deployed|added|fixed|handled|assisted|led)\b/i.test(s);
          if (words.length >= 3 && hasActionWord && !headerRegex.test(s) && !contactInfoRegex.test(s) && !educationDegreeRegex.test(s)) {
            candidateBullets.push(s);
          }
        }
      }
    } else if (candidate.length >= 18 && candidate.length <= 350) {
      // Must not be a pure job title line
      if (!/^(?:software engineer|web developer|frontend developer|backend developer|intern|full stack developer|sde|project manager)\s*(?:[-–|@]\s*.*)?$/i.test(candidate)) {
        const words = candidate.split(/\s+/).filter((w) => w.length > 0);
        const hasActionWord = /\b(?:using|with|to|and|for|by|in|built|developed|created|worked|implemented|designed|manage|optimized|automated|tested|deployed|added|fixed|handled|assisted|led)\b/i.test(candidate);
        if (words.length >= 3 && hasActionWord) {
          candidateBullets.push(candidate);
        }
      }
    }
  }

  // Deduplicate candidate bullets
  const uniqueBullets = Array.from(new Set(candidateBullets));

  // Score candidate bullets by improvement potential (weak starters and missing metrics prioritized)
  const weakStarters = [
    'worked on', 'responsible for', 'helped with', 'helped to', 'assisted in', 'assisted with',
    'handled', 'participated in', 'did', 'made', 'created', 'built', 'developed', 'set up',
    'wrote', 'implemented', 'designed', 'maintained', 'fixed', 'tasked with', 'looked into',
    'was part of', 'was involved in', 'used', 'utilized', 'configured', 'managed'
  ];

  const scoredBullets = uniqueBullets.map((bullet) => {
    let score = 0;
    const lower = bullet.toLowerCase();
    for (const w of weakStarters) {
      if (lower.startsWith(w) || lower.includes(` ${w} `)) {
        score += 5;
        break;
      }
    }
    // Boost if it mentions tech stack
    for (const skill of COMPREHENSIVE_SKILLS_DICTIONARY) {
      if (new RegExp(`\\b${skill.replace(/[+#]/g, '\\$&')}\\b`, 'i').test(bullet)) {
        score += 2;
        break;
      }
    }
    // Prioritize bullets that lack metrics
    if (!/\d+[%kKxXms]|\d+\+|\$\d+/.test(bullet)) {
      score += 3;
    }
    return { bullet, score };
  });

  // Sort by score descending
  scoredBullets.sort((a, b) => b.score - a.score);

  return scoredBullets.map((s) => s.bullet);
}

