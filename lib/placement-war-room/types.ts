/**
 * PlacifyAI - Campus Placement Drive War Room Types
 * Multi-Round Elimination Simulator Architecture
 */

export type DriveCompanyKey = 'tcs-digital' | 'infosys-sp' | 'google-sde' | 'deloitte-usi' | 'zepto-startup';

export type WarRoomStage = 
  | 'company-selection'
  | 'round-1-screening'
  | 'round-2-coding'
  | 'round-3-technical'
  | 'round-4-hr'
  | 'verdict-offer'
  | 'verdict-eliminated';

export interface CompanyDriveProfile {
  key: DriveCompanyKey;
  name: string;
  roleTitle: string;
  packageLPA: string;
  baseLPA: string;
  joiningBonus: string;
  tagline: string;
  tier: 'Mass IT Prime (7-9 LPA)' | 'Specialist Coder (9-13 LPA)' | 'Tier-1 FAANG (30+ LPA)' | 'Consulting (8-10 LPA)' | 'High-Growth Tech (14-18 LPA)';
  selectionRatio: string; // e.g. "Top 4% shortlisted"
  badgeColor: string;
  round1CutoffPercent: number; // e.g. 65%
  round2RequiredTestCases: number; // e.g. 4 of 5
  round3PassingScore: number; // e.g. 70
  round4PassingScore: number; // e.g. 70
  features: string[];
}

// ROUND 1: Screening Test (Aptitude + CS Core)
export interface ScreeningQuestion {
  id: string;
  category: 'Quantitative Aptitude' | 'Logical Reasoning' | 'Core CS & DBMS' | 'Data Structures & Algorithms';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// ROUND 2: Live Speed Coding
export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  functionName: string;
  testCases: {
    id: number;
    input: any[];
    expectedOutput: any;
    isHidden: boolean;
    displayInput: string;
    displayExpected: string;
  }[];
}

// ROUND 3: Technical Round
export interface TechnicalInterviewQuestion {
  id: string;
  topic: string;
  question: string;
  contextTip: string;
  sampleExpectedPoints: string[];
}

// ROUND 4: HR Round
export interface HRInterviewQuestion {
  id: string;
  theme: string;
  scenario: string;
  evaluates: string;
  idealResponseCriteria: string[];
}

// PROCTOR & DRIVE SESSION STATE
export interface PlacementDriveSession {
  company: CompanyDriveProfile;
  candidateName: string;
  collegeName: string;
  currentStage: WarRoomStage;
  startTime: number;
  tabSwitchViolations: number;
  maxViolationsAllowed: number;
  
  // Round 1 Score
  round1: {
    score: number;
    totalPossible: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    passed: boolean;
    timeTakenSeconds: number;
  } | null;

  // Round 2 Score
  round2: {
    problemId: string;
    passedCases: number;
    totalCases: number;
    language: 'javascript' | 'python' | 'java' | 'cpp';
    userCode: string;
    passed: boolean;
    timeTakenSeconds: number;
    runtimeMs: number;
  } | null;

  // Round 3 Score
  round3: {
    answers: { questionId: string; answerText: string; feedback: string; score: number }[];
    averageScore: number;
    passed: boolean;
  } | null;

  // Round 4 Score
  round4: {
    answers: { questionId: string; answerText: string; feedback: string; score: number }[];
    averageScore: number;
    passed: boolean;
  } | null;

  // Final Verdict
  finalResult: {
    eliminatedAtStage?: WarRoomStage;
    eliminationReason?: string;
    offerDetails?: {
      offerId: string;
      candidateName: string;
      roleTitle: string;
      companyName: string;
      annualCTC: string;
      basePay: string;
      joiningBonus: string;
      retentionBonus: string;
      joiningDate: string;
      percentileRank: number;
    };
  } | null;
}
