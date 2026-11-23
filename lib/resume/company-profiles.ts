/**
 * PlacifyAI - Company-Specific ATS Screening Profiles
 * Models real-world corporate ATS screening algorithms and recruiter preferences
 * across Indian Mass IT Recruiters, Tier-1 Product/FAANG, Management Consulting, and Tech Startups.
 */

export type CompanyProfileKey = 'general' | 'tcs-infosys' | 'faang-tier1' | 'consulting' | 'startups';

export interface CompanyScreeningCheck {
  id: string;
  label: string;
  passed: boolean;
  importance: 'critical' | 'recommended';
  detail: string;
  recommendation: string;
}

export interface CompanyProfileDetails {
  key: CompanyProfileKey;
  name: string;
  tagline: string;
  badgeColor: string;
  thresholdScore: number;
  weights: {
    keywords: number;
    metrics: number;
    verbs: number;
    structure: number;
  };
  keyEmphasis: string[];
}

export interface CompanyEvaluationResult {
  profile: CompanyProfileDetails;
  companyAtsScore: number;
  fitVerdict: 'Strong Candidate' | 'Competitive' | 'Borderline' | 'At Risk of ATS Filter';
  verdictColor: 'emerald' | 'blue' | 'amber' | 'rose';
  screeningChecks: CompanyScreeningCheck[];
  keyAdvice: string[];
}

export const COMPANY_PROFILES: Record<CompanyProfileKey, CompanyProfileDetails> = {
  'general': {
    key: 'general',
    name: 'General ATS Benchmark',
    tagline: 'Standard recruiter screening across mid-size companies & IT firms',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
    thresholdScore: 70,
    weights: { keywords: 0.35, metrics: 0.25, verbs: 0.25, structure: 0.15 },
    keyEmphasis: ['Balanced keyword coverage', 'Standard contact info', 'Clean single-page format'],
  },
  'tcs-infosys': {
    key: 'tcs-infosys',
    name: 'Mass IT Services (TCS, Infosys, Wipro, Accenture)',
    tagline: 'Rigid academic verification, CS core competencies & plain format parser',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    thresholdScore: 75,
    weights: { keywords: 0.35, metrics: 0.15, verbs: 0.20, structure: 0.30 },
    keyEmphasis: ['Explicit Degree & CGPA', 'Core CS Fundamentals (OOP, SQL, Java/Python, DSA)', 'Zero unparsable tables/graphics'],
  },
  'faang-tier1': {
    key: 'faang-tier1',
    name: 'Tier-1 Big Tech (Google, Amazon, Microsoft, Uber)',
    tagline: 'High engineering rigor, STAR metrics, latency/scale figures & GitHub code',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    thresholdScore: 85,
    weights: { keywords: 0.25, metrics: 0.35, verbs: 0.25, structure: 0.15 },
    keyEmphasis: ['Scale & latency metrics (% improvement, QPS, users)', 'High-impact verbs (Architected, Engineered, Optimized)', 'Public GitHub profile link'],
  },
  'consulting': {
    key: 'consulting',
    name: 'Management & Tech Consulting (Deloitte, PwC, EY)',
    tagline: 'Business outcomes, ROI quantification, leadership & executive clarity',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    thresholdScore: 80,
    weights: { keywords: 0.15, metrics: 0.30, verbs: 0.35, structure: 0.20 },
    keyEmphasis: ['Business value & revenue/efficiency impact', 'Leadership verbs (Led, Spearheaded, Coordinated)', 'Structured STAR bullet cadence'],
  },
  'startups': {
    key: 'startups',
    name: 'High-Growth Tech Startups (Zepto, Swiggy, CRED, Razorpay)',
    tagline: 'End-to-end shipping velocity, modern tech stack & live project links',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    thresholdScore: 78,
    weights: { keywords: 0.30, metrics: 0.25, verbs: 0.30, structure: 0.15 },
    keyEmphasis: ['Modern fullstack stack (Next.js, Node, Postgres, AWS/Cloud)', 'Rapid shipping verbs (Built from scratch, Shipped, Deployed)', 'Live project links / demos'],
  },
};

/**
 * Runs company-specific screening rules on parsed resume data.
 */
export function evaluateCompanyProfile(
  rawText: string,
  parsedProfile: {
    skills?: string[];
    cgpa?: number | string;
    degree?: string;
    university?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    email?: string;
    phone?: string;
  } | undefined,
  baseKeywordScore: number,
  baseMetricScore: number,
  baseVerbScore: number,
  baseStructureScore: number,
  profileKey: CompanyProfileKey = 'general'
): CompanyEvaluationResult {
  const profile = COMPANY_PROFILES[profileKey] || COMPANY_PROFILES['general'];
  const text = rawText.toLowerCase();

  const screeningChecks: CompanyScreeningCheck[] = [];
  const keyAdvice: string[] = [];

  // 1. Core CS Fundamentals (Especially critical for TCS/Infosys)
  const hasCoreCS = /(?:oop|object-oriented|dbms|database management|sql|mysql|postgresql|data structures|algorithms|dsa|operating systems|computer networks)\b/i.test(rawText);
  const csLanguages = /(?:java|python|c\+\+|c#|javascript|typescript)\b/i.test(rawText);

  // 2. Metrics count check
  const metricMatches = (rawText.match(/(?:\d+%(?:\.\d+)?|\$\d+|\b\d+\s*(?:ms|sec|users|records|requests|orders|qps|stars|downloads)\b)/gi) || []).length;

  // 3. GitHub / Live link check
  const hasGithub = Boolean(parsedProfile?.githubUrl) || /github\.com/i.test(rawText);
  const hasLiveDemo = /(?:vercel\.app|netlify\.app|heroku\.com|deployed|live demo|demo link)\b/i.test(rawText);

  // 4. Degree & CGPA check
  const hasDegree = Boolean(parsedProfile?.degree) || /(?:b\.tech|bachelor|b\.e\.|mca|bca|m\.tech|b\.sc)\b/i.test(rawText);
  const hasCgpa = Boolean(parsedProfile?.cgpa) || /(?:cgpa|gpa|percentage|%|\b[6-9]\.\d{1,2}\b)/i.test(rawText);

  // 5. Heavy verbs check
  const hasTier1Verbs = /(?:architected|orchestrated|engineered|containerized|optimized|benchmarked|automated|refactored)\b/i.test(rawText);
  const hasConsultingVerbs = /(?:spearheaded|orchestrated|streamlined|formulated|negotiated|delivered|advised|standardized)\b/i.test(rawText);
  const hasStartupVerbs = /(?:built|shipped|scaled|deployed|bootstrapped|integrated|prototyped)\b/i.test(rawText);

  // 6. Corporate buzzwords check
  const buzzwordsFound = (rawText.match(/\b(hardworking|team player|quick learner|self-motivated|dynamic|go-getter|detail-oriented)\b/gi) || []);

  // Compute profile-specific weighted score
  let weightedScore = Math.round(
    baseKeywordScore * profile.weights.keywords +
    baseMetricScore * profile.weights.metrics +
    baseVerbScore * profile.weights.verbs +
    baseStructureScore * profile.weights.structure
  );

  // Apply Company Profile Rules
  if (profileKey === 'tcs-infosys') {
    screeningChecks.push({
      id: 'tcs-academics',
      label: 'Degree & Branch Transparency',
      passed: hasDegree,
      importance: 'critical',
      detail: hasDegree ? 'Degree detected (B.Tech/BE/MCA/BCA)' : 'Degree missing or unparsable',
      recommendation: 'Explicitly state your Degree, Branch (e.g. Computer Science & Engg), and Year of Graduation.',
    });

    screeningChecks.push({
      id: 'tcs-cgpa',
      label: 'CGPA / Academic Score Clarity',
      passed: hasCgpa,
      importance: 'critical',
      detail: hasCgpa ? 'CGPA or academic percentage detected' : 'No explicit CGPA / percentage found',
      recommendation: 'TCS & Infosys ATS filters reject candidates without a visible CGPA/percentage (e.g. "CGPA: 8.4/10").',
    });

    screeningChecks.push({
      id: 'tcs-cs-core',
      label: 'Core CS Foundations (OOP, SQL, DSA)',
      passed: hasCoreCS && csLanguages,
      importance: 'critical',
      detail: hasCoreCS && csLanguages ? 'Core CS subjects & languages detected' : 'Missing foundational CS subject keywords',
      recommendation: 'Include keywords: Data Structures, OOPs, SQL/DBMS, and at least one core language (Java, Python, C++).',
    });

    if (!hasDegree || !hasCgpa) weightedScore -= 12;
    if (!hasCoreCS) weightedScore -= 8;
  } else if (profileKey === 'faang-tier1') {
    screeningChecks.push({
      id: 'faang-metrics',
      label: 'Quantifiable Engineering Metrics (Scale / Latency)',
      passed: metricMatches >= 3,
      importance: 'critical',
      detail: `${metricMatches} metric data points found (Need 3+ for FAANG)`,
      recommendation: 'Add metrics: latency reduction (% or ms), throughput (QPS/RPS), user counts, or database query optimizations.',
    });

    screeningChecks.push({
      id: 'faang-github',
      label: 'Public Code Repository (GitHub)',
      passed: hasGithub,
      importance: 'critical',
      detail: hasGithub ? 'GitHub profile present' : 'No GitHub repository link found in header',
      recommendation: 'FAANG screeners verify actual source code. Add your github.com/username in the header.',
    });

    screeningChecks.push({
      id: 'faang-verbs',
      label: 'Senior Engineering Action Verbs',
      passed: hasTier1Verbs,
      importance: 'recommended',
      detail: hasTier1Verbs ? 'Strong technical verbs found' : 'Weak or passive phrasing in project bullets',
      recommendation: 'Replace generic verbs with: Architected, Engineered, Optimized, Containerized, Benchmarked.',
    });

    screeningChecks.push({
      id: 'faang-buzzwords',
      label: 'Zero Fluff Buzzword Policy',
      passed: buzzwordsFound.length === 0,
      importance: 'recommended',
      detail: buzzwordsFound.length === 0 ? 'No empty buzzwords detected' : `Found buzzwords: ${buzzwordsFound.join(', ')}`,
      recommendation: 'FAANG reviewers discard soft fluff like "hardworking" or "team player". Delete them.',
    });

    if (metricMatches < 2) weightedScore -= 14;
    if (!hasGithub) weightedScore -= 10;
    if (buzzwordsFound.length > 0) weightedScore -= 5;
  } else if (profileKey === 'consulting') {
    screeningChecks.push({
      id: 'consulting-impact',
      label: 'Business Value & Process Efficiency',
      passed: metricMatches >= 2,
      importance: 'critical',
      detail: metricMatches >= 2 ? 'Business/efficiency impact numbers present' : 'Needs more quantified business metrics',
      recommendation: 'Frame accomplishments in terms of time saved, cost reduced, or process throughput enhanced.',
    });

    screeningChecks.push({
      id: 'consulting-verbs',
      label: 'Executive & Leadership Action Verbs',
      passed: hasConsultingVerbs,
      importance: 'critical',
      detail: hasConsultingVerbs ? 'Leadership verbs detected' : 'Bullets lack executive command verbs',
      recommendation: 'Use command verbs: Spearheaded, Streamlined, Coordinated, Formulated, Accelerated.',
    });

    screeningChecks.push({
      id: 'consulting-structure',
      label: 'STAR Structured Formatting',
      passed: baseStructureScore >= 80,
      importance: 'recommended',
      detail: baseStructureScore >= 80 ? 'Clean executive formatting' : 'Format needs crisper section alignment',
      recommendation: 'Ensure each bullet follows Situation/Task ➔ Action ➔ Result clearly.',
    });

    if (!hasConsultingVerbs) weightedScore -= 10;
    if (metricMatches < 2) weightedScore -= 8;
  } else if (profileKey === 'startups') {
    screeningChecks.push({
      id: 'startup-shipping',
      label: 'Shipped Products & Velocity Verbs',
      passed: hasStartupVerbs,
      importance: 'critical',
      detail: hasStartupVerbs ? 'Shipping velocity verbs present' : 'Missing product shipping action words',
      recommendation: 'Use builder verbs: "Built from scratch", "Shipped MVP", "Deployed to production", "Integrated API".',
    });

    screeningChecks.push({
      id: 'startup-live',
      label: 'Live Deployed URLs / Prototypes',
      passed: hasLiveDemo || hasGithub,
      importance: 'recommended',
      detail: hasLiveDemo || hasGithub ? 'Live demo or repository link found' : 'No clickable live demo or repo found',
      recommendation: 'Founders love clickable links! Add live Vercel/Netlify URLs to your top projects.',
    });

    screeningChecks.push({
      id: 'startup-stack',
      label: 'Modern Fullstack / Cloud Technologies',
      passed: /(?:next\.js|react|typescript|tailwind|fastapi|docker|supabase|prisma|graphql|redis|ai|llm)\b/i.test(rawText),
      importance: 'critical',
      detail: 'Modern startup tech stack assessed',
      recommendation: 'Highlight experience with high-velocity stacks: Next.js, TypeScript, Tailwind, PostgreSQL, Docker.',
    });

    if (!hasStartupVerbs) weightedScore -= 8;
  } else {
    // General benchmark
    const hasContact = Boolean(parsedProfile?.email && parsedProfile?.phone) || (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText) && /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(rawText));
    screeningChecks.push({
      id: 'gen-contact',
      label: 'Complete Header Contact Details',
      passed: hasContact,
      importance: 'critical',
      detail: hasContact ? 'Email & phone verified' : 'Missing contact information',
      recommendation: 'Ensure your email and telephone number are at the top of page 1.',
    });

    screeningChecks.push({
      id: 'gen-metrics',
      label: 'Quantifiable Project Metrics',
      passed: metricMatches >= 2,
      importance: 'recommended',
      detail: `${metricMatches} metric data points found`,
      recommendation: 'Add at least 2 measurable percentage or user count results to your projects.',
    });
  }

  // Bound weighted score
  const companyAtsScore = Math.min(98, Math.max(25, weightedScore));

  let fitVerdict: CompanyEvaluationResult['fitVerdict'] = 'Competitive';
  let verdictColor: CompanyEvaluationResult['verdictColor'] = 'blue';

  if (companyAtsScore >= profile.thresholdScore + 5) {
    fitVerdict = 'Strong Candidate';
    verdictColor = 'emerald';
  } else if (companyAtsScore >= profile.thresholdScore) {
    fitVerdict = 'Competitive';
    verdictColor = 'blue';
  } else if (companyAtsScore >= profile.thresholdScore - 10) {
    fitVerdict = 'Borderline';
    verdictColor = 'amber';
  } else {
    fitVerdict = 'At Risk of ATS Filter';
    verdictColor = 'rose';
  }

  // Generate top actionable advice
  const failedChecks = screeningChecks.filter((c) => !c.passed);
  if (failedChecks.length > 0) {
    failedChecks.forEach((fc) => keyAdvice.push(fc.recommendation));
  } else {
    keyAdvice.push(`Your resume satisfies all primary ATS screening benchmarks for ${profile.name}.`);
  }

  return {
    profile,
    companyAtsScore,
    fitVerdict,
    verdictColor,
    screeningChecks,
    keyAdvice,
  };
}
