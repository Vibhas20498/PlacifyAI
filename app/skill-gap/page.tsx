'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { Target, Clock, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SkillGapPage() {
  const { skillGaps, profile, addVerifiedSkill } = useUser();

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Skill Gap Intelligence
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Priority competency deficits benchmarked against 1,500+ job descriptions for <strong>{profile.targetRole}</strong>.
            </p>
          </div>
          <Link
            href="/learning-roadmap"
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Launch Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skill Gap Cards List */}
        <div className="space-y-4">
          {skillGaps.map((gap) => {
            const gapPct = gap.targetProficiency - gap.currentProficiency;
            return (
              <div
                key={gap.id}
                className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                        gap.importance === 'Essential'
                          ? 'bg-black text-white'
                          : gap.importance === 'Competitive'
                          ? 'bg-gray-100 text-black border border-gray-300'
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {gap.importance} Priority
                    </span>
                    <h3 className="text-base font-bold text-black">{gap.skill}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      ~{gap.estimatedTimeToAcquireHours} hrs to acquire
                    </span>
                    <span className="font-semibold text-black">
                      Demand: {gap.marketDemandScore}/100
                    </span>
                  </div>
                </div>

                {/* Progress bars comparing Current vs Target */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Current Proficiency: <strong className="text-black font-mono">{gap.currentProficiency}%</strong>
                    </span>
                    <span className="text-gray-500">
                      Market Target: <strong className="text-black font-mono">{gap.targetProficiency}%</strong>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-black rounded-l-full"
                      style={{ width: `${gap.currentProficiency}%` }}
                    />
                    <div
                      className="h-full pattern-hatched opacity-50"
                      style={{ width: `${gapPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500 font-mono">
                    Category: {gap.category} • Deficit Gap: {gapPct}%
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addVerifiedSkill(gap.skill)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-colors"
                    >
                      Mark as Acquired
                    </button>
                    <Link
                      href="/learning-roadmap"
                      className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Study in Roadmap</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
