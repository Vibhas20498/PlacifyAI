'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { StructuredRAGAnalysis } from '@/lib/rag-engine/types';

interface RagIntelligenceCardProps {
  ragAnalysis: StructuredRAGAnalysis;
  targetRole: string;
}

export function RagIntelligenceCard({
  ragAnalysis,
  targetRole,
}: RagIntelligenceCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showRAGSources, setShowRAGSources] = useState(false);

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HERO RAG INTELLIGENCE BANNER */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  RAG Resume Intelligence & Reasoning Layer
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 animate-pulse">
                  Vector Augmented
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Contextual, explainable analysis grounded in {ragAnalysis.retrievedRAGSources.length} retrieved hiring rubrics for{' '}
                <strong className="text-sky-300">{targetRole}</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRAGSources(!showRAGSources)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>{showRAGSources ? 'Hide RAG Sources' : 'View Retrieved RAG Knowledge'}</span>
            {showRAGSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* WHY THIS SCORE EXPLANATION */}
        <div className="relative z-10 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Why Your Score is {ragAnalysis.deterministicScoreExplanation.atsScore}/100:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {ragAnalysis.deterministicScoreExplanation.whyThisScore}
          </p>
          {ragAnalysis.deterministicScoreExplanation.primaryScoreBlockers.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {ragAnalysis.deterministicScoreExplanation.primaryScoreBlockers.map((blocker, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-950/80 text-red-300 border border-red-800/60"
                >
                  ⚠ {blocker}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RETRIEVED RAG SOURCES DRAWER */}
        {showRAGSources && (
          <div className="relative z-10 p-4 rounded-2xl bg-slate-900/95 border border-sky-500/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300">
              <span>Retrieved Vector Knowledge Chunks ({ragAnalysis.retrievedRAGSources.length}):</span>
              <span className="text-[10px] text-slate-400 font-mono">Semantic Cosine Match</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ragAnalysis.retrievedRAGSources.map((source) => (
                <div
                  key={source.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="text-xs font-bold text-slate-200 truncate">{source.title}</div>
                    <span className="text-[10px] text-slate-400 block">{source.category}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 shrink-0">
                    {(source.relevance * 100).toFixed(0)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAILED GROUNDED RECOMMENDATIONS (Issue -> Why -> Recommendation -> Grounded Suggestion) */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <span>Grounded Bullet-Point Reasoning (Issue &rarr; Why &rarr; Recommendation)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Every improvement is reasoned using retrieved hiring rubrics and strictly respects verified facts from your resume.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-black">
            {ragAnalysis.bulletPointReasoning.length} Evaluated Bullets
          </span>
        </div>

        <div className="space-y-6">
          {ragAnalysis.bulletPointReasoning.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-4 transition-all hover:border-gray-300"
            >
              {/* ORIGINAL BULLET */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Original Sentence from Your Resume:
                </span>
                <p className="text-xs text-gray-800 bg-white p-3.5 rounded-xl border border-gray-200 font-mono leading-relaxed">
                  &ldquo;{item.originalBullet}&rdquo;
                </p>
              </div>

              {/* 3-PART REASONING GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1. ISSUE */}
                <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 space-y-1">
                  <div className="font-bold text-red-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Issue:</span>
                  </div>
                  <p className="text-red-800 leading-relaxed font-medium">
                    {item.issue}
                  </p>
                </div>

                {/* 2. REASON / WHY */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>Why it Matters:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {item.reason}
                  </p>
                </div>

                {/* 3. RECOMMENDATION */}
                <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 space-y-1">
                  <div className="font-bold text-sky-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>Recommendation:</span>
                  </div>
                  <p className="text-sky-900 leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>

              {/* GROUNDED SUGGESTED VERSION */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Suggested Grounded Version (Zero Hallucination Guarantee):</span>
                  </span>
                  {item.isQuantificationMissing && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Add Measured Metric
                    </span>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border-2 border-black/15 text-xs text-black font-semibold leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <span className="font-mono text-black">{item.suggestedVersion}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(idx, item.suggestedVersion)}
                    className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs self-end sm:self-auto"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* RAG CITATION PILLS */}
              {item.ragCitations.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] text-gray-500 font-semibold">RAG Citations:</span>
                  {item.ragCitations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-200/70 text-gray-700 border border-gray-300"
                    >
                      {cite.title} ({cite.category})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STRENGTHS & WEAKNESSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VERIFIED STRENGTHS */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="text-sm font-bold text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Strengths (Backed by Resume Evidence)</span>
            </h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {ragAnalysis.strengths.length} Strengths
            </span>
          </div>

          <div className="space-y-3">
            {ragAnalysis.strengths.map((str, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs">
                <div className="font-bold text-emerald-950">{str.title}</div>
                <p className="text-emerald-900 leading-relaxed">{str.description}</p>
                <div className="text-[11px] text-emerald-800 italic pt-1 border-t border-emerald-200/60">
                  Evidence: {str.evidenceFromResume}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IDENTIFIED WEAKNESSES */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="text-sm font-bold text-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Priority Weaknesses to Fix</span>
            </h4>
            <span className="text-xs font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              {ragAnalysis.weaknesses.length} Weaknesses
            </span>
          </div>

          <div className="space-y-3">
            {ragAnalysis.weaknesses.map((weak, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-red-950">{weak.title}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                    {weak.severity} Priority
                  </span>
                </div>
                <p className="text-red-900 leading-relaxed">{weak.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION-BY-SECTION HEALTH AUDIT */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-black flex items-center gap-2">
            <Layers className="w-4 h-4 text-black" />
            <span>Section-by-Section Health Audit</span>
          </h4>
          <span className="text-xs font-semibold text-gray-500">
            {ragAnalysis.sectionAnalysis.filter((s) => s.status === 'Strong').length} of {ragAnalysis.sectionAnalysis.length} Sections Optimal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ragAnalysis.sectionAnalysis.map((sec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                sec.status === 'Strong'
                  ? 'bg-gray-50 border-gray-200'
                  : sec.status === 'Needs Improvement'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-red-50/50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-black">{sec.sectionName}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sec.status === 'Strong'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sec.status === 'Needs Improvement'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {sec.status}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{sec.critique}</p>
              <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/50 font-medium">
                💡 {sec.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
