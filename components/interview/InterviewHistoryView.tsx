'use client';

import React from 'react';
import {
  Clock,
  Briefcase,
  Building2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { PastInterviewSummary } from '@/lib/interview/types';

interface InterviewHistoryViewProps {
  history: PastInterviewSummary[];
  onStartNew: () => void;
}

export function InterviewHistoryView({
  history,
  onStartNew,
}: InterviewHistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-5 bg-white border border-gray-200/90 rounded-3xl shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-black font-heading">No Past Interviews Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            You haven't completed any mock interview sessions yet. Launch your first personalized simulation to receive rubric evaluations and practice roadmaps.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartNew}
          className="px-6 py-3 rounded-2xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all shadow-xs"
        >
          Launch First Mock Interview
        </button>
      </div>
    );
  }

  const averageScore = Math.round(
    history.reduce((sum, h) => sum + (h.overallScore || 0), 0) / history.length
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Stat Strip */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-black font-heading">
            Mock Interview History & Progress
          </h2>
          <p className="text-xs text-gray-500">
            Track evaluation trajectories across past placement simulations.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs text-gray-400 font-mono uppercase">Sessions</div>
            <div className="text-lg font-bold text-black font-mono">{history.length}</div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <div className="text-xs text-gray-400 font-mono uppercase">Average Score</div>
            <div className="text-lg font-bold text-black font-mono">{averageScore}%</div>
          </div>
        </div>
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover-lift"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-black font-heading">
                  {item.targetRole}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  {item.targetCompany}
                </span>
                <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {item.difficulty}
                </span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-3">
                <span>
                  {new Date(item.completedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>
                  {item.questionsAnswered} of {item.totalQuestions} Questions
                </span>
                {item.strongestCategory && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      Top: {item.strongestCategory}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-base font-bold font-mono text-black">
                  {item.overallScore}%
                </span>
                <span className="text-[10px] font-mono text-gray-400 block uppercase">
                  Score
                </span>
              </div>

              <button
                type="button"
                onClick={onStartNew}
                className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all shadow-2xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
