/**
 * PlacifyAI - Virtual AI Interviewer Engine
 * Natural Speech Synthesis (TTS), Dynamic Counter-Question Generation, and Multi-Turn Defense Evaluation.
 */

import { InterviewerPersona } from './types';

// ==========================================
// 1. SPEECH SYNTHESIS ENGINE (REALISTIC VOICE)
// ==========================================

export function cleanTextForSpeech(rawText: string): string {
  return rawText
    .replace(/[`*_#~]/g, '') // remove markdown symbols
    .replace(/\[.*?\]\(.*?\)/g, '') // remove markdown links
    .replace(/\(.*?\)/g, '') // remove parenthetical technical notes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speaks text using the browser's Web Speech API with tailored persona pitch & rate.
 * Returns a cancel function to stop speech at any moment.
 */
export function speakInterviewerText(
  text: string,
  persona?: InterviewerPersona,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return () => {};
  }

  // Cancel any prior speech
  window.speechSynthesis.cancel();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.pitch = persona?.pitch || 1.0;
  utterance.rate = persona?.rate || 1.0;

  // Attempt to select the most natural sounding English voice
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const isFemale = persona?.gender === 'female';
    
    // Priority: Natural / Neural > English locale matching gender
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (isFemale
            ? /female|zira|samantha|karen|victoria|moira|veena/i.test(v.name)
            : /male|david|rishi|ravi|alex|daniel|george/i.test(v.name))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('[SpeechSynthesis Notice]:', e);
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('[SpeechSynthesis Exception]:', err);
    if (onEnd) onEnd();
  }

  return () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
}

// ==========================================
// 2. DYNAMIC COUNTER-QUESTION GENERATION
// ==========================================

interface CounterGenerationContext {
  companyKey: string;
  round: 'technical' | 'hr';
  topic: string;
  originalQuestion: string;
  candidateAnswer: string;
  personaName: string;
}

interface CounterQuestionResult {
  counterQuestion: string;
  challengeAngle: string;
}

/**
 * Analyzes the candidate's answer and formulates an authentic follow-up cross-examination question.
 */
export function generateCounterQuestion(
  ctx: CounterGenerationContext
): CounterQuestionResult {
  const ans = ctx.candidateAnswer.toLowerCase();
  const wordCount = ans.split(/\s+/).filter(Boolean).length;

  // Check 1: Answer is too brief / lacking substance
  if (wordCount < 8) {
    return {
      counterQuestion: `${ctx.personaName}: That is exceptionally brief for an architectural interview. Could you explain the concrete components, protocols, and data structures involved in your design?`,
      challengeAngle: 'Demanding concrete technical depth and architecture specifics.',
    };
  }

  // TECHNICAL ROUND CROSS-EXAMINATIONS
  if (ctx.round === 'technical') {
    if (ans.includes('redis') || ans.includes('cache') || ans.includes('caching')) {
      return {
        counterQuestion: `${ctx.personaName}: You emphasized using Redis for caching. But what is your eviction strategy when memory pressure hits 90%, and how do you prevent a Cache Avalanche if hundreds of hot keys expire simultaneously at peak load?`,
        challengeAngle: 'Testing resilience against cache avalanche, thundering herds, and eviction limits.',
      };
    }

    if (ans.includes('sql') || ans.includes('index') || ans.includes('database') || ans.includes('postgres') || ans.includes('b-tree')) {
      return {
        counterQuestion: `${ctx.personaName}: Adding B-Tree indexes speeds up SELECT queries, but significantly degrades write and bulk INSERT throughput due to page splits. How do you decide when an index becomes a liability, and how do you monitor index bloat?`,
        challengeAngle: 'Probing the trade-off between read speed and write degradation.',
      };
    }

    if (ans.includes('kafka') || ans.includes('queue') || ans.includes('message') || ans.includes('event') || ans.includes('rabbitmq')) {
      return {
        counterQuestion: `${ctx.personaName}: In your event stream, what happens when a consumer crashes midway through processing an order payload before committing its offset? How do you guarantee idempotent processing without creating duplicate charges?`,
        challengeAngle: 'Challenging at-least-once message delivery and idempotency guarantees.',
      };
    }

    if (ans.includes('microservice') || ans.includes('api') || ans.includes('rest') || ans.includes('grpc') || ans.includes('http')) {
      return {
        counterQuestion: `${ctx.personaName}: When a downstream third-party service latency jumps from 100ms to 9 seconds, how do you prevent thread pool starvation from cascading back to your upstream gateway? Have you implemented bulkhead isolation?`,
        challengeAngle: 'Evaluating cascading failure mitigation and circuit breaker resilience.',
      };
    }

    if (ans.includes('lock') || ans.includes('transaction') || ans.includes('mutex') || ans.includes('acid') || ans.includes('concurrency')) {
      return {
        counterQuestion: `${ctx.personaName}: Pessimistic locking guarantees consistency, but severely caps throughput under high concurrency. Did you consider optimistic concurrency control with version stamps, and how would you handle high retry collision rates?`,
        challengeAngle: 'Testing locking granularity and high-concurrency contention.',
      };
    }

    if (ans.includes('docker') || ans.includes('kubernetes') || ans.includes('scale') || ans.includes('cluster') || ans.includes('distributed')) {
      return {
        counterQuestion: `${ctx.personaName}: When deploying across multiple container nodes, how do you handle state synchronization and split-brain scenarios if a temporary network partition isolates 3 of your nodes?`,
        challengeAngle: 'Assessing CAP theorem trade-offs and network partition tolerance.',
      };
    }

    // Default Technical Counter
    return {
      counterQuestion: `${ctx.personaName}: Your proposed approach is theoretically sound, but what is its single greatest bottleneck under 10x traffic, and what metric would alert your on-call team that this system is failing?`,
      challengeAngle: 'Testing capacity limits, failure modes, and operational observability.',
    };
  }

  // HR & LEADERSHIP ROUND CROSS-EXAMINATIONS
  if (ans.includes('disagree') || ans.includes('conflict') || ans.includes('argument') || ans.includes('debate')) {
    return {
      counterQuestion: `${ctx.personaName}: Suppose after presenting your data, the senior lead still rejects your proposal due to executive politics or existing contract commitments. How do you balance professional conviction with team loyalty?`,
      challengeAngle: 'Testing disagree-and-commit maturity and corporate diplomacy.',
    };
  }

  if (ans.includes('deadline') || ans.includes('pressure') || ans.includes('drop') || ans.includes('left') || ans.includes('stress')) {
    return {
      counterQuestion: `${ctx.personaName}: Stepping in to cover a colleague's work solves the immediate crisis, but risks masking systemic delivery issues. How did you escalate this to leadership so the team wasn't set up for burnout again?`,
      challengeAngle: 'Evaluating long-term team sustainability vs short-term heroics.',
    };
  }

  if (ans.includes('mvp') || ans.includes('speed') || ans.includes('fast') || ans.includes('compromise') || ans.includes('quick')) {
    return {
      counterQuestion: `${ctx.personaName}: Shipping quickly to validate the market is great, but tech debt accumulated during an MVP often becomes permanent. How did you ensure leadership allocated engineering bandwidth to refactor later?`,
      challengeAngle: 'Probing discipline in paying down technical debt post-launch.',
    };
  }

  // Default HR Counter
  return {
    counterQuestion: `${ctx.personaName}: Looking back on that experience with what you know today, what is one critical decision you would handle differently if you faced the exact same scenario tomorrow?`,
    challengeAngle: 'Testing retrospective self-awareness and continuous leadership growth.',
  };
}

// ==========================================
// 3. MULTI-TURN DEFENSE EVALUATION
// ==========================================

export interface MultiTurnEvaluationResult {
  score: number;
  feedback: string;
  breakdown: {
    technicalDepth: number;
    counterDefense: number;
    clarity: number;
  };
}

export function evaluateMultiTurnDefense(
  initialQuestion: string,
  initialAnswer: string,
  counterQuestion: string,
  counterAnswer: string,
  expectedPoints: string[],
  isHR: boolean
): MultiTurnEvaluationResult {
  const combined = `${initialAnswer} ${counterAnswer}`.toLowerCase();
  const initialWords = initialAnswer.trim().split(/\s+/).filter(Boolean).length;
  const counterWords = counterAnswer.trim().split(/\s+/).filter(Boolean).length;

  let depthScore = 20;
  let counterDefenseScore = 20;
  let clarityScore = 20;

  // Length heuristics
  if (initialWords >= 40) depthScore += 10;
  if (initialWords >= 70) depthScore += 10;

  if (counterWords >= 30) counterDefenseScore += 15;
  if (counterWords >= 60) counterDefenseScore += 15;

  // Keyword / expected points match
  let matchedPoints = 0;
  expectedPoints.forEach((point) => {
    const keyTerms = point.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    const hasMatch = keyTerms.some((term) => combined.includes(term));
    if (hasMatch) matchedPoints++;
  });

  const matchRatio = expectedPoints.length > 0 ? matchedPoints / expectedPoints.length : 0.6;
  depthScore += Math.round(matchRatio * 15);
  counterDefenseScore += Math.round(matchRatio * 15);

  // Cross-examination specific words
  const defenseKeyTerms = [
    'because', 'trade-off', 'fallback', 'metric', 'monitor', 'resilience',
    'sla', 'scale', 'mitigate', 'degrade', 'benchmark', 'timeout', 'retry',
    'idempotent', 'partition', 'cluster', 'refactor', 'prevent', 'retrospective'
  ];
  let defenseTermHits = 0;
  defenseKeyTerms.forEach((term) => {
    if (counterAnswer.toLowerCase().includes(term)) defenseTermHits++;
  });
  counterDefenseScore += Math.min(10, defenseTermHits * 2);

  // Normalize scores to max 100
  const finalDepth = Math.min(100, Math.max(30, depthScore));
  const finalDefense = Math.min(100, Math.max(30, counterDefenseScore));
  const finalClarity = Math.min(100, Math.max(40, clarityScore + (counterWords > 20 ? 25 : 10)));

  const finalScore = Math.round(finalDepth * 0.4 + finalDefense * 0.4 + finalClarity * 0.2);

  let feedback = '';
  if (finalScore >= 80) {
    feedback = `Exceptional architectural defense! Handled the interviewer's counter-question with authoritative trade-off clarity and concrete technical grounding.`;
  } else if (finalScore >= 68) {
    feedback = `Solid answer and composed rebuttal. Addressed the counter-challenge well, though citing concrete metrics (SLA, p99 latency, index sizes) would strengthen the defense.`;
  } else {
    feedback = `Passable start, but the counter-defense lacked technical specificity. Be sure to address failure modes, trade-offs, and operational monitoring explicitly.`;
  }

  return {
    score: finalScore,
    feedback,
    breakdown: {
      technicalDepth: finalDepth,
      counterDefense: finalDefense,
      clarity: finalClarity,
    },
  };
}
