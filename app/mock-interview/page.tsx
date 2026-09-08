'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { INITIAL_INTERVIEW_SESSION } from '@/lib/mock-data';
import { InterviewMessage } from '@/lib/types';
import { Mic, MicOff, Send, Sparkles, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function MockInterviewPage() {
  const { profile } = useUser();
  const [sessionMessages, setSessionMessages] = useState<InterviewMessage[]>(INITIAL_INTERVIEW_SESSION);
  const [userInput, setUserInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSendAnswer = () => {
    if (!userInput.trim() || isEvaluating) return;

    const userMsg: InterviewMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rubricEvaluation: {
        clarityScore: 88,
        technicalAccuracyScore: 92,
        starFormulationScore: 85,
        feedback:
          'Strong technical articulation. You addressed concurrency handling and cache invalidation clearly with appropriate time/space trade-offs.',
        groundedCitations: [
          'Tier-1 Backend Hiring Rubric (Section 03: Concurrency & Caching)',
          'Amazon STAR Leadership Standard'
        ]
      }
    };

    setSessionMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsEvaluating(true);

    setTimeout(() => {
      const aiFollowUp: InterviewMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Well articulated. Let us move to a live system design scenario: If you had to design a distributed rate limiter handling 50,000 requests per second across 4 microservices, what algorithm and data store would you select?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSessionMessages((prev) => [...prev, aiFollowUp]);
      setIsEvaluating(false);
    }, 1000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Mock Interview Practice Simulator
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              RAG-grounded live interview assessment with rubric scoring and STAR feedback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold bg-gray-100 px-3 py-1.5 rounded-full text-black border border-gray-200">
              Role: {profile.targetRole}
            </span>
          </div>
        </div>

        {/* Interview Session Feed */}
        <div className="space-y-6">
          {sessionMessages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} className="space-y-3">
                <div className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 font-bold text-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                      isAi
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-black text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="text-[10px] font-mono text-gray-400 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 text-black flex items-center justify-center shrink-0 font-bold text-xs">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Rubric Evaluation Card for User Response */}
                {msg.rubricEvaluation && (
                  <div className="ml-11 max-w-[85%] bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        AI Rubric Evaluation
                      </span>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-black font-semibold">
                          Clarity: {msg.rubricEvaluation.clarityScore}%
                        </span>
                        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-black font-semibold">
                          Accuracy: {msg.rubricEvaluation.technicalAccuracyScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {msg.rubricEvaluation.feedback}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.rubricEvaluation.groundedCitations.map((citation, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600"
                        >
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 sticky bottom-4 shadow-sm">
          <textarea
            rows={3}
            placeholder="Type your structured STAR response or speak your answer..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full text-xs outline-none resize-none placeholder-gray-400"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isRecording
                  ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
                  : 'border-gray-200 text-gray-700 hover:text-black hover:bg-gray-50'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
            </button>

            <button
              onClick={handleSendAnswer}
              disabled={!userInput.trim() || isEvaluating}
              className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isEvaluating ? 'Evaluating...' : 'Submit Answer'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
