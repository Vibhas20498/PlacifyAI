'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { FileText, Upload, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const { profile, updateResumeAts } = useUser();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedApplied, setOptimizedApplied] = useState(false);

  const criteria = [
    { name: 'Quantifiable Impact', score: optimizedApplied ? 90 : 62, target: 85, weight: 'High' },
    { name: 'Action Verbs Strength', score: optimizedApplied ? 94 : 75, target: 80, weight: 'Medium' },
    { name: 'Target Keyword Match', score: optimizedApplied ? 88 : 65, target: 80, weight: 'High' },
    { name: 'Formatting & ATS Cleanliness', score: 95, target: 90, weight: 'Low' },
    { name: 'Brevity & Density', score: 80, target: 75, weight: 'Medium' },
  ];

  const bulletCritiques = [
    {
      id: 'crit-1',
      role: 'PlacifyAI Fullstack Project',
      original: 'Built a backend API for dashboard data with Python and database.',
      optimized: 'Architected an asynchronous FastAPI service utilizing composite B-Tree indexing and Redis caching, slashing p99 dashboard latency by 95% (850ms to 38ms).',
      gain: '+8 pts',
      rationale: 'Injected quantifiable latency metrics (95% drop, 850ms to 38ms) and named concrete architectural tooling (FastAPI, B-Tree, Redis). Grounded in Google XYZ formula.',
    },
    {
      id: 'crit-2',
      role: 'Internship at TechCorp',
      original: 'Worked on bugs and frontend user interfaces in React.',
      optimized: 'Engineered 14 responsive React/TypeScript UI modules adhering to WCAG 2.1 accessibility standards, decreasing customer onboarding drop-off by 22%.',
      gain: '+6 pts',
      rationale: 'Replaced passive verb "worked on" with active "Engineered", added concrete scale figures (14 modules, 22% drop-off decrease).',
    }
  ];

  const handleApplyOptimizations = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizedApplied(true);
      updateResumeAts(88);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Resume Analyzer & ATS Optimizer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              RAG-grounded resume parser and Google XYZ impact optimizer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApplyOptimizations}
              disabled={isOptimizing || optimizedApplied}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
                optimizedApplied
                  ? 'bg-gray-100 text-black border border-gray-200 cursor-default'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isOptimizing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : optimizedApplied ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isOptimizing ? 'Optimizing via RAG...' : optimizedApplied ? 'Optimizations Applied (88/100)' : 'Apply AI STAR Optimizations'}</span>
            </button>
          </div>
        </div>

        {/* ATS Score & Criteria Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Score Card */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
              Overall ATS Score
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl font-extrabold font-mono text-black">
                {profile.resumeAtsScore}
              </span>
              <span className="text-2xl font-mono text-gray-400">/100</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 border border-gray-200 text-black">
              {profile.resumeAtsScore >= 80 ? 'Top 15% Candidate' : 'ATS Keyword Gap Detected'}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
              Evaluated against 1,200+ Tier-1 hiring rubrics for <strong>{profile.targetRole}</strong>.
            </p>
          </div>

          {/* Criteria Progress Bars */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-black">5-Factor ATS Evaluation</h3>
            <div className="space-y-4">
              {criteria.map((crit) => (
                <div key={crit.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{crit.name}</span>
                    <span className="font-mono text-gray-600 font-semibold">{crit.score}% (Target: {crit.target}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${crit.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STAR-Method Rewriting Feed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-black">RAG-Grounded Bullet Point Improvements</h3>
              <p className="text-xs text-gray-500">
                Transforms weak descriptions into high-converting STAR (Situation, Task, Action, Result) statements.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-gray-400">
              {bulletCritiques.length} suggestions
            </span>
          </div>

          <div className="space-y-6">
            {bulletCritiques.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    {item.role}
                  </span>
                  <span className="text-xs font-mono font-bold text-black bg-gray-200 px-2 py-0.5 rounded">
                    {item.gain}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    <strong className="text-red-700 font-medium">Before:</strong>
                    <p className="line-through text-gray-400 mt-0.5">{item.original}</p>
                  </div>
                  <div className="text-xs text-black">
                    <strong className="text-black font-semibold">After (STAR Optimized):</strong>
                    <p className="font-medium mt-0.5 bg-white p-2.5 rounded-xl border border-gray-200 text-gray-900 leading-relaxed">
                      {item.optimized}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 bg-white/80 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                  <span>{item.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
