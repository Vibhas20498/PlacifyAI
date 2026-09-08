export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetRole: string;
  cgpa: number;
  university: string;
  tier: 1 | 2 | 3;
  graduationYear: number;
  experienceMonths: number;
  githubUrl: string;
  linkedinUrl: string;
  verifiedSkills: string[];
  pendingSkills: string[];
  projectsCount: number;
  hasProductionDeployment: boolean;
  codeSignalScore: number;
  resumeAtsScore: number;
  placementProbability: number;
  careerReadinessScore: number;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  tag?: string;
  caption: string;
  iconName: string;
  route: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  criteriaScores: {
    impact: number;
    actionVerbs: number;
    keywordAlignment: number;
    formatting: number;
    brevity: number;
  };
  detectedSkills: string[];
  missingKeywords: string[];
  criticalImprovements: {
    id: string;
    section: string;
    original: string;
    optimized: string;
    rationale: string;
  }[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Remote' | 'Contract';
  salaryRange: string;
  matchScore: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  postedDate: string;
}

export interface SkillGapItem {
  id: string;
  skill: string;
  category: string;
  importance: 'Essential' | 'Competitive' | 'Optional';
  currentProficiency: number; // 0 to 100
  targetProficiency: number; // 0 to 100
  marketDemandScore: number; // 0 to 100
  estimatedTimeToAcquireHours: number;
  recommendedRoadmapNodeId: string;
}

export interface ShapFactor {
  feature: string;
  displayName: string;
  impactValue: number; // e.g. +14.2% or -6.4%
  impactType: 'positive' | 'negative';
  description: string;
}

export interface RoadmapNode {
  id: string;
  stageNumber: number;
  title: string;
  category: 'Foundation' | 'Core DSA' | 'System Architecture' | 'Applied Projects' | 'Interview Mastery';
  durationWeeks: number;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  learningOutcomes: string[];
  curatedResources: {
    title: string;
    type: 'Documentation' | 'Video Lecture' | 'Practice Kata' | 'Whitepaper';
    url: string;
    source: string;
  }[];
}

export interface RAGKnowledgeDoc {
  id: string;
  title: string;
  source: string;
  category: 'Hiring Rubric' | 'ATS Guide' | 'System Design' | 'DSA Syllabus' | 'Interview Transcript';
  snippet: string;
  relevanceScore: number;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  rubricEvaluation?: {
    clarityScore: number;
    technicalAccuracyScore: number;
    starFormulationScore: number;
    feedback: string;
    groundedCitations: string[];
  };
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  groundedSources?: {
    title: string;
    sourceDoc: string;
    category: string;
  }[];
}
