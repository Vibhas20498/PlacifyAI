'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Map,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Layers,
} from 'lucide-react';
import { InterviewReport, InterviewSession } from '@/lib/interview/types';

interface InterviewReportViewProps {
  session: InterviewSession;
  report: InterviewReport;
  onViewRoadmap: () => void;
  onRetakeInterview: () => void;
}

export function InterviewReportView({
  session,
  report,
  onViewRoadmap,
  onRetakeInterview,
}: InterviewReportViewProps) {
  const [expandedQIndex, setExpandedQIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedQIndex((prev) => (prev === idx ? null : idx));
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner: Score & Readiness Overview */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs card-hover-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                PLACEMENT EVALUATION REPORT
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {session.config.targetRole} • {session.config.targetCompany}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-heading">
              Interview Performance Breakdown
            </h1>
            <p className="text-xs text-gray-500">
              Assessed against standard tier-1 recruitment benchmarks and role requirements.
            </p>
          </div>

          {/* Radial Score Gauge */}
          <div className="flex items-center gap-4 bg-gray-50/80 px-6 py-4 rounded-3xl border border-gray-200 self-start sm:self-auto">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className={report.overallScore >= 75 ? 'text-black' : 'text-amber-600'}
                  strokeWidth="3.5"
                  strokeDasharray={`${report.overallScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${report.overallScore}, 100` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute font-extrabold text-xl text-black font-mono">
                {report.overallScore}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-black uppercase tracking-wider font-mono">
                Overall Score
              </div>
              <div className="text-[11px] text-gray-500">
                {report.questionsAnswered} of {report.totalQuestions} Questions Answered
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Summary */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-black">Readiness Calibration: </span>
            <span>{report.interviewReadinessSummary}</span>
          </div>
        </div>

        {/* Strengths & Urgent Deficits Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Strongest */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Competencies:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.strongestAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold"
                >
                  ✓ {area}
                </span>
              ))}
            </div>
          </div>

          {/* Weakest */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Priority Practice Deficits:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.weakestAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 text-[11px] font-semibold"
                >
                  ! {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance Scores */}
      {report.categoryScores.length > 0 && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-black font-heading">
                Domain Score Breakdown
              </h3>
              <p className="text-xs text-gray-500">
                Evaluation across tested competencies for {session.config.targetRole}.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-400">
              {report.categoryScores.length} Tested Categories
            </span>
          </div>

          <div className="space-y-4">
            {report.categoryScores.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black">{cat.category}</span>
                  <span className="font-mono font-bold text-black">{cat.score}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/80">
                  <motion.div
                    className={`h-full rounded-full ${
                      cat.score >= 80 ? 'bg-black' : cat.score >= 65 ? 'bg-gray-800' : 'bg-amber-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question-by-Question Detailed Review */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-black font-heading">
              Question-by-Question Evaluation
            </h3>
            <p className="text-xs text-gray-500">
              Click each card to expand answers, rubric scores, and improved benchmark solutions.
            </p>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            {report.questionReviews.length} Answers Analyzed
          </span>
        </div>

        <div className="space-y-4">
          {report.questionReviews.map((qa, idx) => {
            const isExpanded = expandedQIndex === idx;
            const evalData = qa.evaluation;
            const score = evalData?.overallScore || 65;

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-black">
                          {qa.question.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {qa.question.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                        {qa.question.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${getScoreBadgeColor(
                        score
                      )}`}
                    >
                      {score}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-gray-50/70 border-t border-gray-200 space-y-4 text-xs">
                    {/* Candidate's submitted response */}
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-500 block mb-1">
                        Your Submitted Answer:
                      </span>
                      <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-line">
                        {qa.userAnswer}
                      </div>
                    </div>

                    {/* Dimension Scores Bar Grid */}
                    {evalData?.dimensionScores && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-mono block">Accuracy</span>
                          <span className="text-xs font-bold text-black">
                            {evalData.dimensionScores.technicalAccuracy}%
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-mono block">Depth</span>
                          <span className="text-xs font-bold text-black">
                            {evalData.dimensionScores.depthAndCompleteness}%
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-mono block">Clarity</span>
                          <span className="text-xs font-bold text-black">
                            {evalData.dimensionScores.clarityAndCommunication}%
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-mono block">Practical/STAR</span>
                          <span className="text-xs font-bold text-black">
                            {evalData.dimensionScores.starFormulationOrPracticality}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* What went well */}
                    {evalData?.whatWentWell && evalData.whatWentWell.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 block mb-1">
                          Key Strengths:
                        </span>
                        <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                          {evalData.whatWentWell.map((w, wIdx) => (
                            <li key={wIdx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing concepts */}
                    {evalData?.missingOrIncorrectConcepts && evalData.missingOrIncorrectConcepts.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-700 block mb-1">
                          Missing Concepts / Misunderstandings:
                        </span>
                        <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                          {evalData.missingOrIncorrectConcepts.map((m, mIdx) => (
                            <li key={mIdx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sample improved answer */}
                    {evalData?.sampleImprovedAnswer && (
                      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-black block">
                          Benchmark Exemplary Answer:
                        </span>
                        <p className="text-gray-700 italic leading-relaxed">
                          "{evalData.sampleImprovedAnswer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: View Roadmap / Retake */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onRetakeInterview}
          className="px-6 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-800 hover:border-black transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Mock Interview</span>
        </button>

        <button
          type="button"
          onClick={onViewRoadmap}
          className="px-8 py-3.5 rounded-2xl bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group btn-press"
        >
          <Map className="w-4 h-4" />
          <span>Open Personalized Practice Roadmap</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
