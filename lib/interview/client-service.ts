/**
 * PlacifyAI - Mock Interview Client Service
 * Coordinates interview session lifecycle, API communications,
 * resilient localStorage persistence (survives page refreshes),
 * and integration with the candidate profile and learning roadmap.
 */

import {
  InterviewConfig,
  InterviewSession,
  InterviewQA,
  InterviewReport,
  InterviewRoadmapTask,
  PastInterviewSummary,
} from './types';
import { UserProfile, RoadmapNode } from '@/lib/types';

const STORAGE_ACTIVE_SESSION_KEY = 'placify_active_interview_session';
const STORAGE_PAST_SESSIONS_KEY = 'placify_past_interview_sessions';

export async function startInterviewSession(
  config: InterviewConfig,
  profile?: UserProfile,
  resumeText?: string
): Promise<InterviewSession> {
  const res = await fetch('/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...config,
      profile,
      resumeText,
      userId: profile?.id,
      userEmail: profile?.email,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to start interview (HTTP ${res.status})`);
  }

  const data = await res.json();
  const session: InterviewSession = data.session;

  // Persist to localStorage for crash resilience
  saveActiveSessionLocally(session);
  return session;
}

export async function submitInterviewAnswer(
  session: InterviewSession,
  answer: string
): Promise<{
  updatedSession: InterviewSession;
  evaluation?: any;
  isComplete: boolean;
}> {
  const currentQ = session.questions[session.currentQuestionIndex];
  if (!currentQ) throw new Error('No active question in session');

  const history = session.qaHistory.map((qa) => ({
    question: qa.question.question,
    answer: qa.userAnswer,
  }));

  const res = await fetch('/api/interview/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: currentQ,
      answer,
      history,
      config: session.config,
    }),
  });

  let evaluation = undefined;
  if (res.ok) {
    const data = await res.json();
    evaluation = data.evaluation;
  }

  const qaItem: InterviewQA = {
    question: currentQ,
    userAnswer: answer,
    answeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    evaluation,
  };

  const nextIndex = session.currentQuestionIndex + 1;
  const isComplete = nextIndex >= session.questions.length;

  const updatedSession: InterviewSession = {
    ...session,
    currentQuestionIndex: nextIndex,
    qaHistory: [...session.qaHistory, qaItem],
    status: isComplete ? 'completed' : 'active',
  };

  saveActiveSessionLocally(updatedSession);
  return { updatedSession, evaluation, isComplete };
}

export async function finishInterviewSession(
  session: InterviewSession
): Promise<{
  completedSession: InterviewSession;
  report: InterviewReport;
  roadmap: InterviewRoadmapTask[];
}> {
  const res = await fetch('/api/interview/finish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to finish interview (HTTP ${res.status})`);
  }

  const data = await res.json();
  const completedSession: InterviewSession = data.session;

  // Clear active session and archive into past sessions
  clearActiveSessionLocally();
  archiveCompletedSessionLocally(completedSession);

  return {
    completedSession,
    report: data.report,
    roadmap: data.roadmap,
  };
}

export function saveActiveSessionLocally(session: InterviewSession): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('[LocalStorage Save Error]:', err);
  }
}

export function getActiveSessionLocally(): InterviewSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveSessionLocally(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_SESSION_KEY);
  } catch {}
}

export function archiveCompletedSessionLocally(session: InterviewSession): void {
  try {
    const raw = localStorage.getItem(STORAGE_PAST_SESSIONS_KEY);
    const list: PastInterviewSummary[] = raw ? JSON.parse(raw) : [];

    const summary: PastInterviewSummary = {
      id: session.id,
      targetRole: session.config.targetRole,
      targetCompany: session.config.targetCompany,
      interviewType: session.config.interviewType,
      difficulty: session.config.difficulty,
      overallScore: session.report?.overallScore || 0,
      questionsAnswered: session.report?.questionsAnswered || session.qaHistory.length,
      totalQuestions: session.questions.length,
      completedAt: session.completedAt || new Date().toISOString(),
      status: session.status === 'completed' ? 'completed' : 'terminated_early',
      strongestCategory: session.report?.strongestAreas?.[0],
      weakestCategory: session.report?.weakestAreas?.[0],
    };

    // Keep top 30
    const filtered = [summary, ...list.filter((s) => s.id !== summary.id)].slice(0, 30);
    localStorage.setItem(STORAGE_PAST_SESSIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[LocalStorage Archive Error]:', err);
  }
}

export async function fetchPastInterviewHistory(email?: string): Promise<PastInterviewSummary[]> {
  // 1. First load from localStorage for instant display
  let localHistory: PastInterviewSummary[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_PAST_SESSIONS_KEY);
    if (raw) localHistory = JSON.parse(raw);
  } catch {}

  // 2. Fetch from backend/Supabase if user email available
  if (email) {
    try {
      const res = await fetch(`/api/interview/history?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history) && data.history.length > 0) {
          // Merge unique by ID
          const combined = [...data.history];
          localHistory.forEach((loc) => {
            if (!combined.some((c) => c.id === loc.id)) {
              combined.push(loc);
            }
          });
          return combined;
        }
      }
    } catch (err) {
      console.warn('[Fetch History Network Warning]:', err);
    }
  }

  return localHistory;
}

/**
 * Converts an interview practice task into a full RoadmapNode for the candidate's learning roadmap
 */
export function convertTaskToRoadmapNode(task: InterviewRoadmapTask, existingCount: number): RoadmapNode {
  return {
    id: `node-interview-${Date.now().toString(36)}`,
    stageNumber: existingCount + 1,
    title: `Interview Practice: ${task.skillOrConcept}`,
    category: 'Interview Mastery',
    durationWeeks: Math.max(1, Math.ceil(task.studyEffortHours / 5)),
    status: 'in-progress',
    description: `${task.learningObjective} (Identified from mock interview evidence: ${task.evidenceFromInterview})`,
    learningOutcomes: [
      task.practiceActivity,
      `Criteria: ${task.completionCriteria}`,
      `Retry challenge: ${task.exampleQuestionsToRetry[0] || 'Explain technical trade-offs'}`,
    ],
    curatedResources: [
      {
        title: `${task.skillOrConcept} Practice Guide`,
        type: 'Documentation',
        url: '/mock-interview',
        source: 'PlacifyAI Interview Engine',
      },
    ],
  };
}
