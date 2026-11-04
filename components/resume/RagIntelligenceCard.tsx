'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Target,
  Layers,
  HelpCircle,
  Zap,
  AlertCircle,
  ListOrdered,
  CheckCircle,
  TrendingUp,
  XCircle,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { StructuredRAGAnalysis } from '@/lib/rag-engine/types';

interface RagIntelligenceCardProps {
  ragAnalysis: StructuredRAGAnalysis;
  targetRole: string;
}

type RAGViewFilter = 'all' | 'blockers' | 'rewrites' | 'strengths-weaknesses' | 'sections';

export function RagIntelligenceCard({
  ragAnalysis,
  targetRole,
}: RagIntelligenceCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showRAGSources, setShowRAGSources] = useState(false);
  const [activeFilter, setActiveFilter] = useState<RAGViewFilter>('all');
  const [bulletOverrides, setBulletOverrides] = useState<
    Record<number, { text: string; provider?: string; metric?: string }>
  >({});
  const [isRegenerating, setIsRegenerating] = useState<Record<number, boolean>>({});

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleRegenerateWithAI = async (idx: number, originalBullet: string) => {
    setIsRegenerating((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await fetch('/api/resume/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: originalBullet,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.result?.correctedBullet) {
        setBulletOverrides((prev) => ({
          ...prev,
          [idx]: {
            text: data.result.correctedBullet,
            provider:
              data.result.aiProvider === 'gemini'
                ? 'Google Gemini AI'
                : data.result.aiProvider === 'openai'
                ? 'OpenAI GPT-4o'
                : data.result.aiProvider === 'groq'
                ? 'Groq Llama 3.3'
                : 'Placify AI Synthesizer',
            metric: data.result.metricAdded,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to regenerate bullet with AI:', err);
    } finally {
      setIsRegenerating((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const blockersCount = ragAnalysis.deterministicScoreExplanation.primaryScoreBlockers.length;
  const rewritesCount = ragAnalysis.bulletPointReasoning.length;
  const strengthsCount = ragAnalysis.strengths.length;
  const weaknessesCount = ragAnalysis.weaknesses.length;
  const sectionsCount = ragAnalysis.sectionAnalysis.length;

  return (
    <div className="space-y-8">
      {/* 1. GUIDED SUB-NAVIGATION BAR: WHAT TO READ FIRST */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <h3 className="text-sm font-extrabold text-black font-heading uppercase tracking-wide">
                AI Analysis Navigator • Choose What to Read
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Filter by category to focus on one result type at a time, or view all results separated below.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Role: {targetRole}
          </span>
        </div>

        {/* Filter Pills with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Results (Separated)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('blockers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'blockers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>1. Urgent Score Blockers ({blockersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('rewrites')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'rewrites'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Bullet Rewrites ({rewritesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('strengths-weaknesses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'strengths-weaknesses'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. Strengths & Gaps ({strengthsCount + weaknessesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('sections')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'sections'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Section Health ({sectionsCount})</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION 01: WHY THIS SCORE & URGENT SCORE BLOCKERS */}
      {(activeFilter === 'all' || activeFilter === 'blockers') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200 w-fit">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Result Section 01 // ATS Verdict & Primary Score Blockers</span>
          </div>

          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 border-l-8 border-l-rose-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-rose-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-950 font-heading">
                    Why Your Resume Scored {ragAnalysis.deterministicScoreExplanation.atsScore}/100
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 font-mono">
                    {ragAnalysis.deterministicScoreExplanation.scoreCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {ragAnalysis.deterministicScoreExplanation.whyThisScore}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRAGSources(!showRAGSources)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all flex items-center gap-2 shrink-0 self-start md:self-auto shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>{showRAGSources ? 'Hide Criteria' : `View ${ragAnalysis.retrievedRAGSources.length} Industry Hiring Standards`}</span>
                {showRAGSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Rubrics & Standards Knowledge Drawer */}
            {showRAGSources && (
              <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                  <span>Industry Hiring Standards & Screening Criteria Grounding This Evaluation:</span>
                  <span className="text-[10px] text-slate-400 font-mono">Benchmark Score</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ragAnalysis.retrievedRAGSources.map((source) => (
                    <div
                      key={source.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 truncate">{source.title}</div>
                        <span className="text-[10px] text-slate-400">{source.category}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 shrink-0">
                        {(source.relevance * 100).toFixed(0)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Blockers Cards */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical Issues Detected (Fix These First to Pass Screening):</span>
              </div>

              {ragAnalysis.deterministicScoreExplanation.primaryScoreBlockers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ragAnalysis.deterministicScoreExplanation.primaryScoreBlockers.map((blocker, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-200/90 flex items-start gap-3 shadow-2xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-rose-950 block">
                          Blocker #{i + 1}: Action Required
                        </span>
                        <p className="text-xs text-rose-900 font-medium leading-relaxed">
                          {blocker}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  ✓ No severe ATS screening blockers identified. Your structural foundation is solid.
                </div>
              )}
            </div>

            {/* Improvement Priority Roadmap */}
            {ragAnalysis.improvementPriority && ragAnalysis.improvementPriority.length > 0 && (
              <div className="pt-4 border-t border-rose-100 space-y-3">
                <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-indigo-600" />
                  <span>Recommended Sequence to Improve Your Score:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ragAnalysis.improvementPriority.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded-md">
                          Step 0{p.priorityNumber || idx + 1}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {p.expectedImpact}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {p.actionItem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SECTION 02: GROUNDED BULLET-BY-BULLET REWRITES */}
      {(activeFilter === 'all' || activeFilter === 'rewrites') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 w-fit">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Result Section 02 // Grounded Bullet Point Rewrites (Before vs After)</span>
          </div>

          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-indigo-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-heading">
                  High-Impact Bullet Point Transformations
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Extracted from your resume and rewritten with active metrics, quantifiable impact, and strong action verbs.
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono shrink-0">
                {ragAnalysis.bulletPointReasoning.length} Bullet Suggestions
              </span>
            </div>

            {/* Bullets List */}
            <div className="space-y-6">
              {ragAnalysis.bulletPointReasoning.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border-2 border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-4 shadow-sm hover:border-indigo-400 transition-all"
                >
                  {/* Item Badge & Metric Flag */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
                    <span className="text-xs font-extrabold bg-slate-900 text-white px-2.5 py-0.5 rounded-lg font-mono">
                      Bullet #{idx + 1}
                    </span>

                    {item.isQuantificationMissing && (
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        <span>Needs Measured Numbers (% or scale)</span>
                      </span>
                    )}
                  </div>

                  {/* 1. BEFORE: Original Bullet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Before (Original Sentence in Your Resume):</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border-2 border-rose-200 text-xs text-slate-800 font-mono leading-relaxed shadow-2xs">
                      &ldquo;{item.originalBullet}&rdquo;
                    </div>
                  </div>

                  {/* 2. THE DIAGNOSIS: Issue & Why it Matters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                      <span className="font-extrabold text-rose-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        <span>Identified Deficit:</span>
                      </span>
                      <p className="text-rose-900 font-medium leading-relaxed">
                        {item.issue}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                      <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                        <span>Why Recruiters Care:</span>
                      </span>
                      <p className="text-sky-900 font-medium leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  {/* 3. AFTER: Recommended Rewritten Version */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>After (Strong Accomplishment Statement):</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{bulletOverrides[idx]?.provider || 'AI Powered (Action-Oriented)'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                          100% Complete
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-500 space-y-3 shadow-sm">
                      <div className="text-xs font-bold text-emerald-950 leading-relaxed font-sans">
                        {bulletOverrides[idx]?.text || item.suggestedVersion}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/70">
                        <div className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                          <span>Metric Added:</span>
                          <strong className="text-emerald-950">
                            {bulletOverrides[idx]?.metric || 'Quantified outcome & scale'}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isRegenerating[idx]}
                            onClick={() => handleRegenerateWithAI(idx, item.originalBullet)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
                            title="Call AI to generate an alternative phrasing"
                          >
                            <RefreshCw
                              className={`w-3 h-3 text-emerald-700 ${
                                isRegenerating[idx] ? 'animate-spin' : ''
                              }`}
                            />
                            <span>{isRegenerating[idx] ? 'Regenerating...' : 'Regenerate with AI'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(idx, bulletOverrides[idx]?.text || item.suggestedVersion)
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm btn-press"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Bullet</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Standards Alignment */}
                  {item.ragCitations && item.ragCitations.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">Hiring Standard:</span>
                      {item.ragCitations.map((cite, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-300 text-slate-700 shadow-2xs"
                        >
                          📚 {cite.title} ({cite.category})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION 03: VERIFIED STRENGTHS & WEAKNESSES */}
      {(activeFilter === 'all' || activeFilter === 'strengths-weaknesses') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 w-fit">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Result Section 03 // Verified Strengths vs Priority Weaknesses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VERIFIED STRENGTHS */}
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-emerald-500">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-950 font-heading">
                    Verified Strengths
                  </h4>
                </div>
                <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-mono">
                  {ragAnalysis.strengths.length} Backed by Evidence
                </span>
              </div>

              <div className="space-y-3">
                {ragAnalysis.strengths.map((str, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200/80 space-y-2 text-xs shadow-2xs"
                  >
                    <div className="font-extrabold text-emerald-950 text-sm">{str.title}</div>
                    <p className="text-emerald-900 leading-relaxed font-medium">{str.description}</p>
                    <div className="text-[11px] text-emerald-950 bg-white/80 p-2.5 rounded-xl border border-emerald-200 font-mono">
                      <strong className="text-emerald-800">Evidence from Resume: </strong>
                      <span>{str.evidenceFromResume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IDENTIFIED WEAKNESSES */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-rose-500">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h4 className="text-base font-bold text-slate-950 font-heading">
                    Identified Weaknesses
                  </h4>
                </div>
                <span className="text-xs font-extrabold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 font-mono">
                  {ragAnalysis.weaknesses.length} Priority Deficits
                </span>
              </div>

              <div className="space-y-3">
                {ragAnalysis.weaknesses.map((weak, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-200/80 space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-extrabold text-rose-950 text-sm">{weak.title}</div>
                      <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-md bg-rose-600 text-white shrink-0">
                        {weak.severity} Priority
                      </span>
                    </div>
                    <p className="text-rose-900 leading-relaxed font-medium">{weak.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION 04: SECTION-BY-SECTION HEALTH AUDIT */}
      {(activeFilter === 'all' || activeFilter === 'sections') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-300 w-fit">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Result Section 04 // Section-by-Section Health Audit</span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-lg font-bold text-slate-950 font-heading">
                  Structural Section Presence & Quality
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifies that each essential resume section satisfies ATS screening standards.
                </p>
              </div>
              <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                {ragAnalysis.sectionAnalysis.filter((s) => s.status === 'Strong').length} of {ragAnalysis.sectionAnalysis.length} Optimal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ragAnalysis.sectionAnalysis.map((sec, idx) => {
                const isStrong = sec.status === 'Strong';
                const isNeedsImprovement = sec.status === 'Needs Improvement';

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border-2 space-y-2 text-xs transition-all shadow-2xs ${
                      isStrong
                        ? 'bg-emerald-50/60 border-emerald-300 border-l-4 border-l-emerald-600'
                        : isNeedsImprovement
                        ? 'bg-amber-50/60 border-amber-300 border-l-4 border-l-amber-500'
                        : 'bg-rose-50/60 border-rose-300 border-l-4 border-l-rose-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-950 text-sm">{sec.sectionName}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase ${
                          isStrong
                            ? 'bg-emerald-600 text-white'
                            : isNeedsImprovement
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {sec.status}
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-medium">{sec.critique}</p>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-700 font-semibold flex items-start gap-1.5">
                      <span>💡</span>
                      <span>{sec.recommendation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
