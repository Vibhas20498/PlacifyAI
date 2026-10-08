export interface RAGKnowledgeChunk {
  id: string;
  category: 'ATS Rubric' | 'Resume Writing' | 'Role Guideline' | 'Quantification' | 'Formatting';
  roleTarget?: 'Software Engineer' | 'Data Analyst' | 'Data Scientist' | 'AI/ML Engineer' | 'Power BI Specialist' | 'General';
  title: string;
  topic: string;
  content: string;
  keyActionVerbs?: string[];
  sampleWeakBullet?: string;
  sampleStrongBullet?: string;
  quantificationAdvice?: string;
  tags: string[];
}

export interface RetrievedChunkResult {
  chunk: RAGKnowledgeChunk;
  similarityScore: number;
  matchedTerms: string[];
}

export interface StructuredRAGAnalysis {
  overallSummary: string;
  deterministicScoreExplanation: {
    atsScore: number;
    scoreCategory: string;
    whyThisScore: string;
    primaryScoreBlockers: string[];
  };
  strengths: {
    title: string;
    description: string;
    evidenceFromResume: string;
  }[];
  weaknesses: {
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
  sectionAnalysis: {
    sectionName: string;
    status: 'Strong' | 'Needs Improvement' | 'Missing';
    critique: string;
    recommendation: string;
  }[];
  bulletPointReasoning: {
    originalBullet: string;
    issue: string;
    reason: string;
    recommendation: string;
    suggestedVersion: string;
    isQuantificationMissing: boolean;
    ragCitations: {
      title: string;
      category: string;
    }[];
  }[];
  jobMatchAnalysis?: {
    targetRoleOrCompany: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    skillsNotDemonstrated: string[];
    roleAlignmentAdvice: string[];
  };
  improvementPriority: {
    priorityNumber: number;
    actionItem: string;
    expectedImpact: string;
  }[];
  retrievedRAGSources: {
    id: string;
    title: string;
    category: string;
    relevance: number;
  }[];
}
