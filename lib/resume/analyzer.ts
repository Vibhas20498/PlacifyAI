import { ResumeAnalysisResult } from '../types';
import {
  parseResumeText,
  extractResumeBullets,
  ExtractedResumeEntities,
  COMPREHENSIVE_SKILLS_DICTIONARY,
  isSkillPresent,
} from './parser';

export const ROLE_KEYWORD_BENCHMARKS: Record<string, string[]> = {
  'Fullstack Software Engineer': [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'SQL', 'PostgreSQL', 'REST APIs',
    'Docker', 'Redis', 'Git', 'CI/CD', 'Tailwind CSS', 'JavaScript', 'HTML'
  ],
  'Backend Software Engineer': [
    'Python', 'FastAPI', 'Django', 'Java', 'Spring Boot', 'SQL', 'PostgreSQL',
    'Redis', 'Kafka', 'Docker', 'Kubernetes', 'REST APIs', 'Git', 'Linux'
  ],
  'Frontend Software Engineer': [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
    'Redux', 'REST APIs', 'Responsive Design', 'Git', 'Jest'
  ],
  'Data Analyst': [
    'SQL', 'Excel', 'Power BI', 'Tableau', 'Python', 'Pandas', 'Data Cleaning',
    'Data Visualization', 'Dashboards', 'ETL', 'Statistical Analysis', 'A/B Testing'
  ],
  'Data Scientist': [
    'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistical Modeling',
    'Machine Learning', 'Hypothesis Testing', 'Data Visualization', 'Matplotlib', 'Seaborn'
  ],
  'AI/ML Engineer': [
    'Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Deep Learning', 'NLP',
    'Computer Vision', 'LLMs', 'Model Deployment', 'Docker', 'FastAPI', 'MLOps', 'Git'
  ],
  'Power BI / Data Visualization': [
    'Power BI', 'DAX', 'Power Query', 'SQL', 'Data Modeling', 'Dashboards',
    'KPI Reporting', 'Excel', 'Data Warehousing', 'ETL', 'Tableau'
  ],
  'Data Engineer / ML Engineer': [
    'Python', 'SQL', 'PostgreSQL', 'Pandas', 'NumPy', 'PyTorch', 'TensorFlow',
    'Scikit-Learn', 'Apache Spark', 'Kafka', 'Docker', 'FastAPI', 'Git'
  ],
  'DevOps / Cloud Platform Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'GitHub Actions', 'Terraform',
    'Nginx', 'Bash', 'Git', 'Python', 'Monitoring'
  ],
};

export const STRONG_ACTION_VERBS = [
  'Architected', 'Built', 'Created', 'Designed', 'Developed', 'Engineered',
  'Implemented', 'Automated', 'Scaled', 'Optimized', 'Deployed', 'Integrated',
  'Constructed', 'Formulated', 'Streamlined', 'Accelerated', 'Delivered', 'Led', 'Spearheaded'
];

export const WEAK_PHRASES = [
  'Worked on', 'Helped with', 'Responsible for', 'Assisted in', 'Handled',
  'Participated in', 'Did', 'Made', 'Looked into', 'Maintained', 'Was part of',
  'Tried to', 'Tasked with', 'Was involved in', 'Set up'
];

export interface BulletImprovement {
  id: string;
  original: string;
  improved: string;
  whatWasFixed: string;
  actionVerbUsed: string;
}

export interface DetailedResumeAnalysis {
  overallScore: number;
  scoreCategory: 'Excellent' | 'Good' | 'Needs Work' | 'Incomplete';
  summaryText: string;
  fileName: string;
  fileSize: string;
  analyzedAt: string;
  wordCount: number;
  readingTimeMinutes: number;
  rawText: string;

  // 4 Core Check Categories
  checks: {
    keywordMatch: {
      score: number; // 0-100
      rating: 'Strong' | 'Average' | 'Low';
      foundSkills: string[];
      missingSkills: string[];
      matchedCount: number;
      totalTargetCount: number;
    };
    measurableResults: {
      score: number; // 0-100
      rating: 'Strong' | 'Average' | 'Low';
      metricsFoundCount: number;
      metricsFoundList: string[];
      tip: string;
    };
    actionVerbs: {
      score: number; // 0-100
      rating: 'Strong' | 'Average' | 'Low';
      strongVerbsFound: string[];
      weakPhrasesFound: string[];
      tip: string;
    };
    structureAndContact: {
      score: number; // 0-100
      hasEmail: boolean;
      hasPhone: boolean;
      hasUniversity: boolean;
      hasProjects: boolean;
      hasGithub: boolean;
      hasLinkedin: boolean;
      wordCountAssessment: 'Good' | 'Too Short' | 'Too Long';
    };
  };

  // Profile extracted details
  extractedProfile: {
    name?: string;
    email?: string;
    phone?: string;
    university?: string;
    degree?: string;
    cgpa?: number;
    skills: string[];
    githubUrl?: string;
    linkedinUrl?: string;
  };

  // Bullet improvements
  bulletImprovements: BulletImprovement[];

  // Top actionable recommendations in plain English
  keyActionItems: string[];

  // RAG Intelligence Layer payload
  ragAnalysis?: any;
}

/**
 * Transforms a single candidate resume bullet into a high-impact, ATS-optimized sentence.
 * Preserves the candidate's exact technologies, feature scope, and context while replacing
 * weak phrasing with powerful action verbs and quantifiable results.
 */
export function transformResumeBulletToImpact(
  originalBullet: string,
  index: number,
  targetRole: string = 'Fullstack Software Engineer',
  parsedSkills: string[] = []
): BulletImprovement {
  const trimmed = originalBullet.trim().replace(/^[-•*–—\d\.\)]+\s*/, '').trim();

  // 1. Detect weak openings and verbs
  const weakPatterns: { regex: RegExp; weakPhrase: string }[] = [
    { regex: /^(?:i\s+|we\s+)?worked\s+on\s+(?:building|developing|creating|implementing|setting\s+up|designing|making|writing)?\s*/i, weakPhrase: 'Worked on' },
    { regex: /^(?:i\s+|we\s+)?responsible\s+for\s+(?:building|developing|creating|implementing|setting\s+up|maintaining|writing)?\s*/i, weakPhrase: 'Responsible for' },
    { regex: /^(?:i\s+|we\s+)?helped\s+(?:with|to)?\s*(?:build|develop|create|fix|implement|maintain)?\s*/i, weakPhrase: 'Helped with' },
    { regex: /^(?:i\s+|we\s+)?assisted\s+(?:in|with)?\s*(?:building|developing|creating|implementing)?\s*/i, weakPhrase: 'Assisted with' },
    { regex: /^(?:i\s+|we\s+)?tasked\s+with\s+(?:building|developing|creating|maintaining)?\s*/i, weakPhrase: 'Tasked with' },
    { regex: /^(?:i\s+|we\s+)?participated\s+in\s+(?:building|developing|creating)?\s*/i, weakPhrase: 'Participated in' },
    { regex: /^(?:i\s+|we\s+)?was\s+involved\s+in\s+(?:building|developing|creating)?\s*/i, weakPhrase: 'Was involved in' },
    { regex: /^(?:i\s+|we\s+)?was\s+part\s+of\s+(?:the\s+team\s+that)?\s*/i, weakPhrase: 'Was part of' },
    { regex: /^(?:i\s+|we\s+)?handled\s+(?:the)?\s*/i, weakPhrase: 'Handled' },
    { regex: /^(?:i\s+|we\s+)?did\s+(?:the)?\s*/i, weakPhrase: 'Did' },
    { regex: /^(?:i\s+|we\s+)?made\s+(?:a|an|the)?\s*/i, weakPhrase: 'Made' },
    { regex: /^(?:i\s+|we\s+)?built\s+(?:a|an|the)?\s*/i, weakPhrase: 'Built' },
    { regex: /^(?:i\s+|we\s+)?created\s+(?:a|an|the)?\s*/i, weakPhrase: 'Created' },
    { regex: /^(?:i\s+|we\s+)?set\s+up\s+(?:a|an|the)?\s*/i, weakPhrase: 'Set up' },
    { regex: /^(?:i\s+|we\s+)?wrote\s+(?:a|an|the)?\s*/i, weakPhrase: 'Wrote' },
    { regex: /^(?:i\s+|we\s+)?used\s+(?:a|an|the)?\s*/i, weakPhrase: 'Used' },
    { regex: /^(?:i\s+|we\s+)?utilized\s+(?:a|an|the)?\s*/i, weakPhrase: 'Utilized' },
    { regex: /^(?:i\s+|we\s+)?configured\s+(?:a|an|the)?\s*/i, weakPhrase: 'Configured' },
    { regex: /^(?:i\s+|we\s+)?managed\s+(?:a|an|the)?\s*/i, weakPhrase: 'Managed' },
    { regex: /^(?:i\s+|we\s+)?developed\s+(?:a|an|the)?\s*/i, weakPhrase: 'Developed' },
    { regex: /^(?:i\s+|we\s+)?implemented\s+(?:a|an|the)?\s*/i, weakPhrase: 'Implemented' },
  ];

  let detectedWeak = '';
  let cleanedSubject = trimmed;

  for (const pat of weakPatterns) {
    if (pat.regex.test(cleanedSubject)) {
      detectedWeak = pat.weakPhrase;
      cleanedSubject = cleanedSubject.replace(pat.regex, '').trim();
      break;
    }
  }

  // Also strip any leading action verbs if weakPatterns didn't catch it
  const leadingVerbMatch = cleanedSubject.match(/^(?:i\s+|we\s+)?([a-zA-Z]+(?:ed|ing)?)\s+(?:a\s+|an\s+|the\s+)?/i);
  let existingLeadingVerb = '';
  if (leadingVerbMatch && leadingVerbMatch[1]) {
    const candidateVerb = leadingVerbMatch[1];
    const knownVerbs = [
      'architected', 'built', 'created', 'designed', 'developed', 'engineered',
      'implemented', 'automated', 'scaled', 'optimized', 'deployed', 'integrated',
      'constructed', 'formulated', 'streamlined', 'accelerated', 'delivered', 'led',
      'spearheaded', 'configured', 'managed', 'established', 'orchestrated', 'executed',
      'produced', 'maintained', 'programmed', 'coded', 'enhanced', 'reduced', 'boosted',
      'increased', 'decreased', 'secured', 'improved', 'wrote', 'used', 'utilized'
    ];
    if (knownVerbs.includes(candidateVerb.toLowerCase())) {
      existingLeadingVerb = candidateVerb.charAt(0).toUpperCase() + candidateVerb.slice(1).toLowerCase();
      cleanedSubject = cleanedSubject.replace(/^(?:i\s+|we\s+)?[a-zA-Z]+(?:ed|ing)?\s+(?:a\s+|an\s+|the\s+)?/i, '').trim();
    }
  }

  // Clean leading pronouns, verbs or articles if remaining
  cleanedSubject = cleanedSubject
    .replace(/^(?:i\s+|we\s+|a\s+|an\s+|the\s+)/i, '')
    .trim();

  // Ensure cleanedSubject is not empty
  if (cleanedSubject.length < 5) {
    cleanedSubject = trimmed;
  }

  // Detect domain context
  const lower = trimmed.toLowerCase();
  const isDatabase = /sql|postgres|mysql|mongo|redis|query|queries|schema|database|indexing|table|lookup/i.test(lower);
  const isDevops = /docker|kubernetes|aws|ci\/cd|github actions|jenkins|terraform|nginx|linux|deploy|deployment|pipeline|cloud|container/i.test(lower);
  const isFrontend = /react|next|vue|angular|tailwind|css|html|ui|ux|frontend|component|responsive|redux|zustand|web app/i.test(lower);
  const isDataML = /machine learning|deep learning|pytorch|tensorflow|scikit|pandas|numpy|nlp|cv|model|dataset|analytics|data science/i.test(lower);
  const isAuth = /auth|authentication|jwt|oauth|security|encryption|bcrypt|token|rbac|login/i.test(lower);
  const isApi = /api|rest|graphql|fastapi|express|spring|django|flask|endpoint|backend|microservice/i.test(lower);

  // Check if original bullet already contains a quantifiable metric
  const hasExistingMetric = /\b(?:\d+%(?:\.\d+)?|\$\d+|\d+\s*(?:ms|seconds|minutes|users|records|requests|queries|endpoints|stars|downloads))\b/i.test(trimmed);

  let strongVerb = 'Architected';
  let metricClause = 'reducing response latency by 40% and supporting 1,500+ daily active users';
  let fixRationale = '';

  if (isDatabase) {
    strongVerb = 'Optimized';
    metricClause = hasExistingMetric
      ? 'improving data throughput and database query reliability across production'
      : 'cutting query lookup time from 350ms to 65ms across 20,000+ database records';
  } else if (isDevops) {
    strongVerb = 'Automated';
    metricClause = hasExistingMetric
      ? 'ensuring automated staging builds and zero-downtime production deployment'
      : 'eliminating manual deployment friction and reducing build release cycle time by 60%';
  } else if (isDataML) {
    strongVerb = 'Formulated';
    metricClause = hasExistingMetric
      ? 'maintaining model inference precision across high-volume validation datasets'
      : 'achieving 93.8% model precision and accelerating data processing throughput by 50%';
  } else if (isAuth) {
    strongVerb = 'Architected';
    metricClause = hasExistingMetric
      ? 'enforcing strict role-based access control and token validation'
      : 'securing role-based access control with sub-45ms authentication verification for 3,000+ users';
  } else if (isFrontend) {
    strongVerb = 'Engineered';
    metricClause = hasExistingMetric
      ? 'delivering seamless responsive interaction across desktop and mobile devices'
      : 'improving Lighthouse performance score to 95+ and reducing page load times by 45%';
  } else if (isApi) {
    strongVerb = 'Engineered';
    metricClause = hasExistingMetric
      ? 'ensuring high-availability endpoint scaling and fault tolerance'
      : 'cutting endpoint response latency by 45% and supporting 5,000+ daily requests';
  } else {
    // General engineering
    strongVerb = index === 0 ? 'Architected' : index === 1 ? 'Engineered' : 'Developed';
    metricClause = hasExistingMetric
      ? 'enhancing system reliability and maintainability across releases'
      : 'improving workflow efficiency by 35% and supporting 1,200+ active users';
  }

  // If the candidate already used a strong verb, preserve it
  if (existingLeadingVerb && STRONG_ACTION_VERBS.includes(existingLeadingVerb)) {
    strongVerb = existingLeadingVerb;
  }

  // Format leading subject case (keep acronyms like REST, API, SQL, UI, ML uppercase)
  let formattedSubject = cleanedSubject.replace(/[.;,]+$/, '');
  const firstWord = formattedSubject.split(/\s+/)[0] || '';
  const isAcronym = /^[A-Z]{2,}/.test(firstWord);
  if (!isAcronym && formattedSubject.length > 0) {
    formattedSubject = formattedSubject.charAt(0).toLowerCase() + formattedSubject.slice(1);
  }

  // Formulate improved bullet sentence
  let improved = `${strongVerb} ${formattedSubject}, ${metricClause}.`;

  // Clean up double punctuation, double spaces, or awkward phrases
  improved = improved.replace(/\s+/g, ' ').replace(/\s+,/g, ',').replace(/\.\.+/g, '.').trim();

  // Create plain English explanation
  if (detectedWeak) {
    fixRationale = `Replaced passive phrase "${detectedWeak}" with strong action verb "${strongVerb}", and added measurable outcome (${metricClause.split(' and ')[0]}) to demonstrate tangible engineering value.`;
  } else {
    fixRationale = `Upgraded opening to impact verb "${strongVerb}" and backed with quantifiable metrics to demonstrate real-world project scale.`;
  }

  return {
    id: `bullet-${index + 1}`,
    original: trimmed,
    improved,
    whatWasFixed: fixRationale,
    actionVerbUsed: strongVerb,
  };
}

/**
 * Extracts candidate's actual resume bullets and generates tailored before vs after rewrites.
 */
function generateRealBulletImprovements(
  rawText: string,
  parsed: ExtractedResumeEntities,
  targetRole: string
): BulletImprovement[] {
  const extractedBullets = extractResumeBullets(rawText);

  if (extractedBullets.length > 0) {
    // Take up to 4 real bullets directly from the user's resume
    const bulletsToImprove = extractedBullets.slice(0, 4);
    return bulletsToImprove.map((bullet, idx) =>
      transformResumeBulletToImpact(bullet, idx, targetRole, parsed.skills)
    );
  }

  // Strictly return empty array when no candidate bullets exist in resume (ZERO FAKE/DUMMY DATA)
  return [];
}

/**
 * Analyzes resume text and generates transparent ATS evaluation in plain English
 */
export function analyzeResumeContent(
  rawContent: string,
  targetRole: string = 'Fullstack Software Engineer',
  fileName: string = 'resume.pdf',
  fileSize: string = '150 KB'
): DetailedResumeAnalysis {
  const parsed = parseResumeText(rawContent);
  const text = parsed.rawText;
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // 1. Target Role Keywords Match
  const targetKeywords = ROLE_KEYWORD_BENCHMARKS[targetRole] || ROLE_KEYWORD_BENCHMARKS['Fullstack Software Engineer'];
  const foundSkills = targetKeywords.filter((kw) =>
    parsed.skills.some((s) => s.toLowerCase() === kw.toLowerCase()) || isSkillPresent(text, kw)
  );
  const missingSkills = targetKeywords.filter(
    (kw) => !foundSkills.includes(kw)
  );
  
  const roleMatchRatio = foundSkills.length / Math.max(1, targetKeywords.length);
  const additionalSkillsBonus = Math.min(20, Math.max(0, parsed.skills.length - foundSkills.length) * 3);
  const keywordScore = Math.min(100, Math.max(15, Math.round(roleMatchRatio * 80 + additionalSkillsBonus)));

  // 2. Measurable Results & Numbers Check
  const metricRegex = /(?:\b\d+(?:\.\d+)?%|\$\d[\d,]*(?:\.\d+)?|₹\d[\d,]*(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?\+?\s*(?:ms|seconds|sec|minutes|min|hours|days|x|users|active users|daily active users|requests|queries|students|endpoints|pts|stars|downloads|views|orders|records|datapoints|lines|req\/s|tps|qps|uptime)|\b(?:score\s+to|by|to)\s+\d+(?:\.\d+)?%?|\b\d{1,3}(?:,\d{3})+\+?)/gi;
  const metricsFoundList = Array.from(new Set(text.match(metricRegex) || []));
  const metricsCount = metricsFoundList.length;
  
  let measurableScore = 30;
  if (metricsCount === 1) measurableScore = 55;
  else if (metricsCount === 2) measurableScore = 68;
  else if (metricsCount === 3) measurableScore = 78;
  else if (metricsCount === 4) measurableScore = 86;
  else if (metricsCount === 5) measurableScore = 92;
  else if (metricsCount >= 6) measurableScore = Math.min(98, 92 + (metricsCount - 5) * 2);

  // 3. Action Verbs Check
  const strongVerbsFound: string[] = [];
  const weakPhrasesFound: string[] = [];

  for (const v of STRONG_ACTION_VERBS) {
    const regex = new RegExp(`\\b${v}\\b`, 'i');
    if (regex.test(text)) {
      strongVerbsFound.push(v);
    }
  }

  for (const w of WEAK_PHRASES) {
    const regex = new RegExp(`\\b${w}\\b`, 'i');
    if (regex.test(text)) {
      weakPhrasesFound.push(w);
    }
  }

  const actionScore = Math.min(
    98,
    Math.max(20, Math.round(45 + strongVerbsFound.length * 9 - weakPhrasesFound.length * 8))
  );

  // 4. Structure & Contact Info Check
  const hasEmail = Boolean(parsed.email);
  const hasPhone = Boolean(parsed.phone);
  const hasUniversity = Boolean(parsed.university);
  const hasDegree = Boolean(parsed.degree);
  const hasCgpa = Boolean(parsed.cgpa);
  const hasProjects = parsed.projectsCount > 0 || /(?:project|application|built|developed)/i.test(text);
  const hasGithub = Boolean(parsed.githubUrl);
  const hasLinkedin = Boolean(parsed.linkedinUrl);

  let structureScore = 20;
  if (hasEmail) structureScore += 15;
  if (hasPhone) structureScore += 10;
  if (hasUniversity) structureScore += 15;
  if (hasDegree) structureScore += 10;
  if (hasCgpa) structureScore += 10;
  if (hasGithub) structureScore += 10;
  if (hasLinkedin) structureScore += 10;
  if (hasProjects) structureScore += 10;

  let wordCountAssessment: 'Good' | 'Too Short' | 'Too Long' = 'Good';
  if (wordCount < 150) {
    wordCountAssessment = 'Too Short';
    structureScore -= 25;
  } else if (wordCount < 300) {
    wordCountAssessment = 'Too Short';
    structureScore -= 10;
  } else if (wordCount > 1000) {
    wordCountAssessment = 'Too Long';
    structureScore -= 15;
  } else if (wordCount > 800) {
    wordCountAssessment = 'Too Long';
    structureScore -= 5;
  }

  structureScore = Math.min(100, Math.max(20, structureScore));

  // Calculate Total Score (0-100)
  const overallScore = Math.min(
    98,
    Math.max(
      15,
      Math.round(
        keywordScore * 0.35 +
        measurableScore * 0.25 +
        actionScore * 0.25 +
        structureScore * 0.15
      )
    )
  );

  let scoreCategory: 'Excellent' | 'Good' | 'Needs Work' | 'Incomplete' = 'Good';
  if (overallScore >= 85) scoreCategory = 'Excellent';
  else if (overallScore >= 70) scoreCategory = 'Good';
  else if (overallScore >= 50) scoreCategory = 'Needs Work';
  else scoreCategory = 'Incomplete';

  // Plain English Summary Text
  let summaryText = '';
  if (overallScore >= 85) {
    summaryText = `Your resume is in great shape for ${targetRole} roles. It has strong action verbs and clear technical skills.`;
  } else if (overallScore >= 70) {
    summaryText = `Your resume has a solid baseline for ${targetRole}, but adding a few missing keywords and measurable numbers to your projects will make it much stronger.`;
  } else {
    summaryText = `Your resume needs some updates for ${targetRole} roles. Focus on including essential keywords and rewriting your project descriptions with numbers.`;
  }

  // Generate real bullet improvements tailored to candidate's ACTUAL resume bullets
  const bulletImprovements = generateRealBulletImprovements(rawContent, parsed, targetRole);

  // Key plain-English Action Items
  const keyActionItems: string[] = [];
  if (missingSkills.length > 0) {
    keyActionItems.push(`Add 2-3 missing skills like ${missingSkills.slice(0, 3).join(', ')} if you have experience with them.`);
  }
  if (metricsCount < 3) {
    keyActionItems.push('Add real numbers to your projects (e.g. number of users, speed improvements, percentage reduced).');
  }
  if (weakPhrasesFound.length > 0) {
    keyActionItems.push(`Replace weak phrases like "${weakPhrasesFound[0]}" with strong verbs like "Engineered", "Built", or "Automated".`);
  }
  if (!hasGithub) {
    keyActionItems.push('Add your GitHub profile link so recruiters can view your code repositories.');
  }
  if (!hasLinkedin) {
    keyActionItems.push('Include your LinkedIn profile link at the top of your resume.');
  }

  return {
    overallScore,
    scoreCategory,
    summaryText,
    fileName,
    fileSize,
    analyzedAt: new Date().toISOString(),
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
    rawText: text,
    checks: {
      keywordMatch: {
        score: keywordScore,
        rating: keywordScore >= 80 ? 'Strong' : keywordScore >= 60 ? 'Average' : 'Low',
        foundSkills,
        missingSkills,
        matchedCount: foundSkills.length,
        totalTargetCount: targetKeywords.length,
      },
      measurableResults: {
        score: measurableScore,
        rating: measurableScore >= 80 ? 'Strong' : measurableScore >= 60 ? 'Average' : 'Low',
        metricsFoundCount: metricsCount,
        metricsFoundList,
        tip: metricsCount < 3 ? 'Recruiters love seeing numbers (e.g., "reduced latency by 40%", "served 1,000+ users").' : 'Great job including measurable metrics in your accomplishments.',
      },
      actionVerbs: {
        score: actionScore,
        rating: actionScore >= 80 ? 'Strong' : actionScore >= 60 ? 'Average' : 'Low',
        strongVerbsFound,
        weakPhrasesFound,
        tip: weakPhrasesFound.length > 0 ? `Avoid passive phrases like "${weakPhrasesFound.join(', ')}". Start bullets with action words.` : 'You used strong action verbs at the start of your statements.',
      },
      structureAndContact: {
        score: Math.min(100, Math.max(40, structureScore)),
        hasEmail,
        hasPhone,
        hasUniversity,
        hasProjects,
        hasGithub,
        hasLinkedin,
        wordCountAssessment,
      },
    },
    extractedProfile: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      university: parsed.university,
      degree: parsed.degree,
      cgpa: parsed.cgpa,
      skills: parsed.skills,
      githubUrl: parsed.githubUrl,
      linkedinUrl: parsed.linkedinUrl,
    },
    bulletImprovements,
    keyActionItems,
  };
}

export type BulletTone = 'scale' | 'product' | 'research' | 'leadership';

export interface MultiToneBulletSuggestion {
  original: string;
  tones: {
    tone: BulletTone;
    title: string;
    description: string;
    rewritten: string;
    highlightedFocus: string;
    actionVerb: string;
  }[];
}

export interface JobDescriptionMatchResult {
  matchScore: number;
  matchTier: 'Strong Match' | 'Competitive' | 'Needs Tailoring';
  jobTitle: string;
  companyName: string;
  mustHaveSkills: { skill: string; found: boolean }[];
  bonusSkills: { skill: string; found: boolean }[];
  matchedMustHaveCount: number;
  totalMustHaves: number;
  matchedBonusCount: number;
  totalBonuses: number;
  tailoringAdvice: string[];
}

export interface BuzzwordAuditResult {
  totalBuzzwordsFound: number;
  fluffScore: number; // 0-100 (100 = 0 fluff)
  detectedBuzzwords: {
    id: string;
    word: string;
    sentence: string;
    suggestedReplacement: string;
    reason: string;
  }[];
  formatRedFlags: {
    id: string;
    title: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
    recommendation: string;
  }[];
}

export interface RecruiterHeatmapData {
  readabilityScore: number;
  scanTimeSeconds: number;
  hotspots: {
    id: string;
    zoneName: string;
    importance: 'Critical (High Dwell)' | 'Important (Medium Dwell)' | 'Secondary (Low Dwell)';
    estimatedDwellMs: number;
    dwellPercentage: number;
    feedback: string;
    status: 'optimal' | 'needs-attention';
  }[];
  verdict: string;
}

export const SAMPLE_JOB_DESCRIPTIONS: {
  id: string;
  title: string;
  company: string;
  description: string;
}[] = [
  {
    id: 'google-sde1',
    title: 'Software Development Engineer I (Fullstack / Backend)',
    company: 'Google',
    description: `We are looking for a Software Engineer to join our core engineering team.
Requirements:
- Strong programming skills in TypeScript, React, Node.js, Python, or Go.
- Experience building RESTful APIs, distributed microservices, and database systems (PostgreSQL, Redis, SQL).
- Solid foundation in Data Structures, Algorithms, and System Design.
- Experience with Docker, Kubernetes, CI/CD pipelines, and cloud platforms (GCP / AWS).
- Passion for optimizing web performance, latency, and high scalability (10,000+ requests/sec).`,
  },
  {
    id: 'amazon-backend',
    title: 'Backend Software Development Engineer',
    company: 'Amazon',
    description: `Amazon is hiring Backend Engineers to build high-scale e-commerce logistics services.
Requirements:
- Proficiency in Java, Spring Boot, Python, or C++.
- Deep experience with relational and NoSQL databases: PostgreSQL, DynamoDB, Redis.
- Knowledge of asynchronous messaging systems (Kafka, RabbitMQ, SQS).
- Containerization and cloud infrastructure: Docker, AWS ECS/EKS, Terraform.
- Track record of writing unit tests, measuring query latency, and driving 99.99% system availability.`,
  },
  {
    id: 'meta-frontend',
    title: 'Frontend UI/UX Software Engineer',
    company: 'Meta',
    description: `Join Meta's product engineering team creating responsive user experiences for billions.
Requirements:
- Advanced expertise in modern React, Next.js, TypeScript, HTML5, CSS3, and Tailwind CSS.
- Strong knowledge of client-side state management (Redux, Zustand, React Query).
- Deep focus on Lighthouse web vitals, bundle optimization, accessibility (a11y), and responsive design.
- Experience consuming REST and GraphQL APIs.
- Testing frameworks: Jest, React Testing Library, Cypress.`,
  },
  {
    id: 'openai-ml',
    title: 'AI / Machine Learning Engineer',
    company: 'OpenAI / AI Labs',
    description: `We are seeking an ML Engineer to scale large-scale generative AI and inference pipelines.
Requirements:
- Deep fluency in Python, PyTorch, TensorFlow, HuggingFace, and Scikit-Learn.
- Experience processing large datasets with Pandas, NumPy, and Apache Spark.
- Experience fine-tuning LLMs, retrieval-augmented generation (RAG), and vector databases.
- Strong knowledge of mathematical modeling, loss optimization, and evaluation metrics (F1, BLEU, ROC-AUC).
- Experience deploying ML models via FastAPI and Docker on GPU clusters.`,
  },
];

/**
 * FEATURE 1: Matches resume text against any target job description
 */
export function analyzeJobDescriptionMatch(
  resumeText: string,
  jdText: string,
  targetRole: string = 'Fullstack Software Engineer'
): JobDescriptionMatchResult {
  const rLower = resumeText.toLowerCase();
  const jLower = jdText.toLowerCase();

  // Extract skills from comprehensive dictionary present in the JD
  const foundInJd = COMPREHENSIVE_SKILLS_DICTIONARY.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(jLower);
  });

  // Split into must-have vs bonus (or benchmark fallback)
  let mustHaveCandidate = foundInJd.slice(0, 8);
  let bonusCandidate = foundInJd.slice(8, 14);

  if (mustHaveCandidate.length < 4) {
    const defaultBenchmark = ROLE_KEYWORD_BENCHMARKS[targetRole] || ROLE_KEYWORD_BENCHMARKS['Fullstack Software Engineer'];
    mustHaveCandidate = defaultBenchmark.slice(0, 8);
    bonusCandidate = defaultBenchmark.slice(8);
  }

  const mustHaveSkills = mustHaveCandidate.map((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const found = new RegExp(`\\b${escaped}\\b`, 'i').test(rLower);
    return { skill, found };
  });

  const bonusSkills = bonusCandidate.map((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const found = new RegExp(`\\b${escaped}\\b`, 'i').test(rLower);
    return { skill, found };
  });

  const matchedMustHaveCount = mustHaveSkills.filter((s) => s.found).length;
  const matchedBonusCount = bonusSkills.filter((s) => s.found).length;

  const mustHaveRatio = mustHaveSkills.length > 0 ? matchedMustHaveCount / mustHaveSkills.length : 0.8;
  const bonusRatio = bonusSkills.length > 0 ? matchedBonusCount / bonusSkills.length : 0.5;

  const rawScore = Math.round(mustHaveRatio * 75 + bonusRatio * 25);
  const matchScore = Math.max(20, Math.min(98, rawScore));

  const matchTier: JobDescriptionMatchResult['matchTier'] =
    matchScore >= 80 ? 'Strong Match' : matchScore >= 60 ? 'Competitive' : 'Needs Tailoring';

  // Identify company or title from JD
  const titleMatch = jdText.match(/(?:title|role|position)[:\s]*([^\n]+)/i);
  const companyMatch = jdText.match(/(?:at|company|team)[:\s]*([^\n]+)/i);

  const jobTitle = titleMatch ? titleMatch[1].trim() : targetRole;
  const companyName = companyMatch ? companyMatch[1].trim() : 'Target Company';

  const tailoringAdvice: string[] = [];
  const missingMusts = mustHaveSkills.filter((s) => !s.found).map((s) => s.skill);
  if (missingMusts.length > 0) {
    tailoringAdvice.push(`Add these ${missingMusts.length} high-priority missing skills: ${missingMusts.slice(0, 4).join(', ')}.`);
  }
  if (!rLower.includes('scale') && !rLower.includes('latency') && !rLower.includes('%')) {
    tailoringAdvice.push('Incorporate quantifiable metrics (e.g. latency gains, user scale) to mirror the JD requirements.');
  }
  if (mustHaveSkills.some((s) => s.skill === 'Docker' && !s.found)) {
    tailoringAdvice.push('Highlight containerization or CI/CD deployment in your project bullet points.');
  }

  return {
    matchScore,
    matchTier,
    jobTitle,
    companyName,
    mustHaveSkills,
    bonusSkills,
    matchedMustHaveCount,
    totalMustHaves: mustHaveSkills.length,
    matchedBonusCount,
    totalBonuses: bonusSkills.length,
    tailoringAdvice,
  };
}

/**
 * FEATURE 4: Buzzword & Cliché Fluff Detector (Red Flag Scanner)
 */
export function scanForBuzzwordsAndRedFlags(resumeText: string): BuzzwordAuditResult {
  const text = resumeText || '';
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter((s) => s.trim().length > 10);

  const buzzwordRules: { word: string; regex: RegExp; replacement: string; reason: string }[] = [
    {
      word: 'Hardworking',
      regex: /\bhardworking\b/i,
      replacement: 'Results-driven with proven delivery of',
      reason: 'Vague personality trait; replace with concrete technical output.',
    },
    {
      word: 'Team player',
      regex: /\bteam\s+player\b/i,
      replacement: 'Collaborated across frontend and backend teams to deliver',
      reason: 'Overused cliché; recruiters look for specific cross-functional impact.',
    },
    {
      word: 'Go-getter',
      regex: /\bgo-?getter\b/i,
      replacement: 'Proactively spearheaded',
      reason: 'Informal slang; replace with leadership action verbs.',
    },
    {
      word: 'Quick learner',
      regex: /\bquick\s+learner\b/i,
      replacement: 'Rapidly onboarded and deployed production code in',
      reason: 'Unsubstantiated claim; demonstrate fast ramp-up through delivered projects.',
    },
    {
      word: 'Results-driven',
      regex: /\bresults-?driven\b/i,
      replacement: 'Achieved quantifiable performance gains including',
      reason: 'Generic buzzword; replace with exact metrics and percentages.',
    },
    {
      word: 'Detail-oriented',
      regex: /\bdetail-?oriented\b/i,
      replacement: 'Maintained 99.9% uptime with rigorous unit testing',
      reason: 'Empty adjective; show attention to detail through testing and zero bugs.',
    },
    {
      word: 'Passionate developer',
      regex: /\bpassionate\s+(?:developer|engineer|coder)\b/i,
      replacement: 'Software engineer with verified open-source contributions',
      reason: 'Overused in student summaries; technical proof is much stronger.',
    },
    {
      word: 'Good communication skills',
      regex: /\bgood\s+communication\s+skills?\b/i,
      replacement: 'Authored technical design specifications and led code reviews',
      reason: 'Subjective claim; cite design docs, pull requests, or sprint leadership.',
    },
    {
      word: 'Self-motivated',
      regex: /\bself-?motivated\b/i,
      replacement: 'Independently architected and shipped',
      reason: 'Passive descriptor; emphasize end-to-end project ownership instead.',
    },
    {
      word: 'Dynamic',
      regex: /\bdynamic\b/i,
      replacement: 'Responsive, event-driven',
      reason: 'Vague marketing buzzword when used to describe candidate qualities.',
    },
  ];

  const detectedBuzzwords: BuzzwordAuditResult['detectedBuzzwords'] = [];

  for (const rule of buzzwordRules) {
    for (const sent of sentences) {
      if (rule.regex.test(sent)) {
        detectedBuzzwords.push({
          id: `buzz-${detectedBuzzwords.length + 1}`,
          word: rule.word,
          sentence: sent.trim(),
          suggestedReplacement: rule.replacement,
          reason: rule.reason,
        });
        break; // one instance per rule to prevent duplicate bloat
      }
    }
  }

  // Format Red Flags
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasMetrics = /\b(?:\d+%(?:\.\d+)?|\$\d+|\d+\s*(?:ms|seconds|minutes|users|records|requests))\b/i.test(text);
  const hasGithub = /github\.com/i.test(text);

  const formatRedFlags: BuzzwordAuditResult['formatRedFlags'] = [
    {
      id: 'flag-contact',
      title: 'Contact Information Completeness',
      status: hasEmail && hasPhone ? 'pass' : 'fail',
      description: hasEmail && hasPhone ? 'Email and phone number are clearly parsable.' : 'Missing email or telephone number in header.',
      recommendation: 'Ensure your email and phone number are in plain text at the very top.',
    },
    {
      id: 'flag-length',
      title: 'Document Word Count & Page Economy',
      status: wordCount >= 250 && wordCount <= 850 ? 'pass' : wordCount < 250 ? 'warning' : 'warning',
      description: `${wordCount} words total (${wordCount < 250 ? 'Too short' : wordCount > 850 ? 'Exceeds 1-page economy' : 'Optimal 1-page length'}).`,
      recommendation: 'Target 350 - 650 words to fit cleanly on a standard 1-page format without dense blocks.',
    },
    {
      id: 'flag-metrics',
      title: 'STAR Measurable Data Points',
      status: hasMetrics ? 'pass' : 'warning',
      description: hasMetrics ? 'Quantifiable metrics and scale figures detected.' : 'No percentages, user counts, or latency numbers found.',
      recommendation: 'Add numbers to every project bullet (e.g. "reduced latency by 40%", "served 1,500+ users").',
    },
    {
      id: 'flag-github',
      title: 'Public Code Portfolio (GitHub / GitLab)',
      status: hasGithub ? 'pass' : 'warning',
      description: hasGithub ? 'GitHub repository link present.' : 'No public code repository profile link found.',
      recommendation: 'Include your GitHub URL in the header so technical screeners can review your code.',
    },
  ];

  const penalty = detectedBuzzwords.length * 15;
  const fluffScore = Math.max(10, 100 - penalty);

  return {
    totalBuzzwordsFound: detectedBuzzwords.length,
    fluffScore,
    detectedBuzzwords,
    formatRedFlags,
  };
}

/**
 * FEATURE 5: Multi-Tone Bullet Rewriter (Custom Persona Sliders)
 */
export function rewriteBulletWithPersonaTone(inputSentence: string): MultiToneBulletSuggestion {
  const trimmed = inputSentence.trim().replace(/^[-•*–—\d\.\)]+\s*/, '').trim();

  // Subject extraction
  const cleaned = trimmed
    .replace(/^(?:i\s+|we\s+)?(?:worked\s+on|responsible\s+for|helped\s+with|assisted|tasked\s+with|did|made|built|created|developed|implemented)\s+(?:a|an|the)?\s*/i, '')
    .trim();

  const baseSubject = cleaned.length > 5 ? cleaned : trimmed;

  return {
    original: trimmed,
    tones: [
      {
        tone: 'scale',
        title: 'Scale & Latency (Backend / Systems Focus)',
        description: 'Optimized for high-throughput, query optimization, and latency reductions.',
        actionVerb: 'Architected',
        highlightedFocus: '45ms latency & 50k requests/sec',
        rewritten: `Architected high-throughput backend microservices for ${baseSubject}, cutting database query lookup times by 45% and reliably handling 50,000+ daily API requests.`,
      },
      {
        tone: 'product',
        title: 'Product & Conversion (Frontend / Fullstack Focus)',
        description: 'Emphasizes responsive UI, Lighthouse score, user retention, and accessibility.',
        actionVerb: 'Engineered',
        highlightedFocus: '95+ Lighthouse score & 35% engagement',
        rewritten: `Engineered responsive, accessible user interfaces for ${baseSubject} with React and Tailwind CSS, elevating Lighthouse performance scores to 95+ and increasing user retention by 35%.`,
      },
      {
        tone: 'research',
        title: 'Research & Accuracy (AI / ML / Data Focus)',
        description: 'Focuses on dataset scale, inference acceleration, F1-score, and validation precision.',
        actionVerb: 'Formulated',
        highlightedFocus: '94.2% precision & 3x throughput',
        rewritten: `Formulated data pipelines and predictive modeling for ${baseSubject}, achieving 94.2% validation precision and accelerating batch data inference throughput by 3x.`,
      },
      {
        tone: 'leadership',
        title: 'Leadership & End-to-End Ownership (Founding / Senior Focus)',
        description: 'Highlights cross-functional delivery, technical architecture, and team ownership.',
        actionVerb: 'Spearheaded',
        highlightedFocus: '0-to-1 launch & 2-week early delivery',
        rewritten: `Spearheaded end-to-end architecture and deployment of ${baseSubject}, coordinating sprint milestones to deliver production release 2 weeks ahead of schedule.`,
      },
    ],
  };
}

/**
 * FEATURE 3: Recruiter 6-Second Eye-Tracking Heatmap Calculation
 */
export function calculateRecruiterScanHeatmap(
  rawText: string,
  analysis: DetailedResumeAnalysis
): RecruiterHeatmapData {
  const hasEmail = analysis.checks.structureAndContact.hasEmail;
  const hasGithub = analysis.checks.structureAndContact.hasGithub;
  const keywordsCount = analysis.checks.keywordMatch.matchedCount;
  const metricsCount = analysis.checks.measurableResults.metricsFoundCount;
  const strongVerbsCount = analysis.checks.actionVerbs.strongVerbsFound.length;

  const hotspots: RecruiterHeatmapData['hotspots'] = [
    {
      id: 'hot-header',
      zoneName: 'Header & Contact Information (Top 15% of Page)',
      importance: 'Critical (High Dwell)',
      estimatedDwellMs: 1400,
      dwellPercentage: 23,
      status: hasEmail && hasGithub ? 'optimal' : 'needs-attention',
      feedback: hasEmail && hasGithub
        ? 'Optimal: Name, clickable GitHub, and email immediately establish technical credibility.'
        : 'Needs Attention: Add GitHub link to capture screener attention in the first 2 seconds.',
    },
    {
      id: 'hot-skills',
      zoneName: 'Technical Skills Block (Upper 35% of Page)',
      importance: 'Critical (High Dwell)',
      estimatedDwellMs: 1800,
      dwellPercentage: 29,
      status: keywordsCount >= 8 ? 'optimal' : 'needs-attention',
      feedback: keywordsCount >= 8
        ? `Strong: ${keywordsCount} keywords categorized cleanly for instant keyword parsing.`
        : 'Needs Attention: Move high-demand target role frameworks to the top line of this section.',
    },
    {
      id: 'hot-lead-bullets',
      zoneName: 'First 2 Project Bullet Points (Center 50% of Page)',
      importance: 'Critical (High Dwell)',
      estimatedDwellMs: 1600,
      dwellPercentage: 26,
      status: metricsCount >= 3 && strongVerbsCount >= 3 ? 'optimal' : 'needs-attention',
      feedback: metricsCount >= 3
        ? 'High Impact: Recruiter eyes immediately catch bold metrics and numbers.'
        : 'Needs Attention: Ensure the very first bullet point of your primary project contains a % or user metric.',
    },
    {
      id: 'hot-education',
      zoneName: 'Education & Degree Credentials (Lower 75% of Page)',
      importance: 'Important (Medium Dwell)',
      estimatedDwellMs: 900,
      dwellPercentage: 15,
      status: analysis.checks.structureAndContact.hasUniversity ? 'optimal' : 'needs-attention',
      feedback: 'Good: Degree, college tier, and graduation year are quickly scannable.',
    },
    {
      id: 'hot-periphery',
      zoneName: 'Lower Margins & Extracurriculars (Bottom 90% of Page)',
      importance: 'Secondary (Low Dwell)',
      estimatedDwellMs: 400,
      dwellPercentage: 7,
      status: 'optimal',
      feedback: 'Secondary: Recruiters only scan here if upper sections pass preliminary screening.',
    },
  ];

  const readabilityScore = Math.min(
    98,
    Math.round(
      (hasEmail ? 25 : 10) +
      Math.min(35, keywordsCount * 3.5) +
      Math.min(25, metricsCount * 5) +
      (hasGithub ? 15 : 5)
    )
  );

  return {
    readabilityScore,
    scanTimeSeconds: 6.2,
    hotspots,
    verdict: readabilityScore >= 80
      ? 'Exceptional 6-Second Visual Hierarchy: Key technical skills and impact numbers are front-loaded in high-dwell zones.'
      : 'Moderate Visual Flow: Move your most impactful bullet points higher so recruiters see proof in their initial 6-second scan.',
  };
}

/**
 * Interactive Bullet Rewriter
 */
export function rewriteBulletSentence(inputSentence: string): {
  original: string;
  suggestions: {
    title: string;
    rewritten: string;
    explanation: string;
  }[];
} {
  const multi = rewriteBulletWithPersonaTone(inputSentence);
  return {
    original: multi.original,
    suggestions: multi.tones.slice(0, 2).map((t) => ({
      title: t.title,
      rewritten: t.rewritten,
      explanation: `${t.description} (Focus: ${t.highlightedFocus})`,
    })),
  };
}

// Backward-compatibility wrapper for existing API routes
export function analyzeResume(
  rawContent: string,
  targetRole: string = 'Fullstack Software Engineer',
  fileName: string = 'resume.pdf',
  fileSize: string = '184 KB'
): ResumeAnalysisResult {
  const result = analyzeResumeContent(rawContent, targetRole, fileName, fileSize);

  return {
    overallScore: result.overallScore,
    fileName: result.fileName,
    fileSize: result.fileSize,
    parsedAt: result.analyzedAt,
    criteriaScores: {
      impact: result.checks.measurableResults.score,
      actionVerbs: result.checks.actionVerbs.score,
      keywordAlignment: result.checks.keywordMatch.score,
      formatting: result.checks.structureAndContact.score,
      brevity: result.checks.structureAndContact.score,
    },
    detectedSkills: result.checks.keywordMatch.foundSkills,
    missingKeywords: result.checks.keywordMatch.missingSkills,
    extractedProfile: {
      name: result.extractedProfile.name,
      email: result.extractedProfile.email,
      university: result.extractedProfile.university,
      degree: result.extractedProfile.degree,
      cgpa: result.extractedProfile.cgpa,
      skills: result.extractedProfile.skills,
      githubUrl: result.extractedProfile.githubUrl,
      linkedinUrl: result.extractedProfile.linkedinUrl,
    },
    criticalImprovements: result.bulletImprovements.map((b) => ({
      id: b.id,
      section: 'Project Description',
      original: b.original,
      optimized: b.improved,
      gain: '+6 pts',
      rationale: b.whatWasFixed,
    })),
  };
}



