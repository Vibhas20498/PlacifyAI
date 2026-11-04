/**
 * PlacifyAI - AI Mock Interview System Types
 * Defines the complete data structures for interview configuration,
 * resume grounding, conversational sessions, multi-dimensional rubrics,
 * final reports, and weakness-specific practice roadmaps.
 */

export type InterviewRole =
  | 'Software Development Engineer'
  | 'Software Engineer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'AI/ML Engineer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Business Analyst'
  | string;

export type InterviewCompany =
  | 'General Placement'
  | 'TCS'
  | 'Infosys'
  | 'Capgemini'
  | 'Deloitte'
  | 'Accenture'
  | 'Cognizant'
  | 'Wipro'
  | string;

export type InterviewType =
  | 'technical'
  | 'hr'
  | 'behavioral'
  | 'coding'
  | 'resume-based'
  | 'project-deep-dive'
  | 'mixed';

export type InterviewDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface InterviewConfig {
  targetRole: InterviewRole;
  targetCompany: InterviewCompany;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number; // 5, 10, 15
  durationMinutes: number; // e.g. 15, 30, 45
  useAnalyzedResume: boolean;
  resumeText?: string;
  focusSkills: string[];
  focusProjects: boolean;
  practiceWeakAreas: boolean;
  includeCoding: boolean;
  feedbackTiming: 'realistic' | 'practice'; // 'realistic' (end only) or 'practice' (immediate)
  mode: 'text' | 'voice';
}

export interface GroundingReference {
  sourceType: 'resume_project' | 'resume_skill' | 'role_benchmark' | 'company_pattern' | 'previous_answer';
  sourceText: string;
  skillOrProject?: string;
}

export interface CodingMetadata {
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'sql';
  starterCode: string;
  problemStatement: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
}

export interface InterviewQuestion {
  id: string;
  index: number;
  question: string;
  type: 'technical' | 'hr' | 'behavioral' | 'coding' | 'resume' | 'follow-up';
  difficulty: InterviewDifficulty;
  category: string;
  groundingReference?: GroundingReference;
  codingMetadata?: CodingMetadata;
  rubricCriteria: string[];
}

export interface DimensionScores {
  technicalAccuracy: number; // 0-100
  depthAndCompleteness: number; // 0-100
  clarityAndCommunication: number; // 0-100
  starFormulationOrPracticality: number; // 0-100
}

export interface AnswerEvaluation {
  overallScore: number; // 0-100
  dimensionScores: DimensionScores;
  whatWentWell: string[];
  missingOrIncorrectConcepts: string[];
  specificSuggestions: string;
  sampleImprovedAnswer: string;
  conceptsToRevise: string[];
  followUpQuestion?: string;
  requiresFollowUp: boolean;
  aiProvider: 'gemini' | 'openai' | 'groq' | 'intelligent-engine';
}

export interface InterviewQA {
  question: InterviewQuestion;
  userAnswer: string;
  answeredAt: string;
  evaluation?: AnswerEvaluation;
}

export interface CategoryScore {
  category: string;
  score: number;
  questionsCount: number;
}

export interface InterviewReport {
  sessionId: string;
  overallScore: number;
  completionStatus: 'completed' | 'terminated_early';
  questionsAnswered: number;
  totalQuestions: number;
  categoryScores: CategoryScore[];
  strongestAreas: string[];
  weakestAreas: string[];
  interviewReadinessSummary: string;
  actionableInsights: string[];
  questionReviews: InterviewQA[];
}

export interface InterviewRoadmapTask {
  id: string;
  skillOrConcept: string;
  priority: 'high' | 'medium' | 'low';
  evidenceFromInterview: string;
  learningObjective: string;
  studyEffortHours: number;
  practiceActivity: string;
  exampleQuestionsToRetry: string[];
  completionCriteria: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface InterviewSession {
  id: string;
  userId?: string;
  userEmail?: string;
  config: InterviewConfig;
  status: 'setup' | 'active' | 'evaluating' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  qaHistory: InterviewQA[];
  report?: InterviewReport;
  roadmap?: InterviewRoadmapTask[];
  startedAt: string;
  completedAt?: string;
  timeRemainingSeconds: number;
}

export interface PastInterviewSummary {
  id: string;
  targetRole: string;
  targetCompany: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  overallScore: number;
  questionsAnswered: number;
  totalQuestions: number;
  completedAt: string;
  status: 'completed' | 'terminated_early';
  strongestCategory?: string;
  weakestCategory?: string;
}
