'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { Map, CheckCircle2, Circle, Clock, ExternalLink, BookOpen, Video, Code, Award } from 'lucide-react';

export default function LearningRoadmapPage() {
  const { roadmap, toggleRoadmapNode, profile } = useUser();

  const completedCount = roadmap.filter((r) => r.status === 'completed').length;
  const progressPct = Math.round((completedCount / roadmap.length) * 100);

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Learning Roadmap Route
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sequenced curriculum path tailored for <strong>{profile.targetRole}</strong> placement benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-gray-500">
              Progress: {completedCount}/{roadmap.length} Modules ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Roadmap Milestones Feed */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-200 space-y-8">
          {roadmap.map((node) => {
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in-progress';

            return (
              <div key={node.id} className="relative group">
                {/* Node Status Indicator on vertical line */}
                <button
                  onClick={() => toggleRoadmapNode(node.id)}
                  className={`absolute -left-[37px] sm:-left-[45px] top-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-black text-white'
                      : isInProgress
                      ? 'bg-white border-2 border-black text-black ring-4 ring-gray-100'
                      : 'bg-white border border-gray-300 text-gray-400'
                  }`}
                  title="Click to toggle status"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="font-mono text-xs font-bold">{node.stageNumber}</span>
                  )}
                </button>

                {/* Milestone Card */}
                <div className="bg-white border border-gray-200 group-hover:border-black rounded-2xl p-6 transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-black text-white'
                            : isInProgress
                            ? 'bg-gray-200 text-black'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {node.status.replace('-', ' ')}
                      </span>
                      <h3 className="text-lg font-bold text-black">{node.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{node.durationWeeks} Weeks Estimated</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Learning Outcomes */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 font-mono uppercase">
                      Core Learning Outcomes
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                      {node.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curated Resources */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 font-mono uppercase">
                      Curated RAG Syllabi & Practice References
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.curatedResources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-black transition-colors"
                        >
                          <BookOpen className="w-3 h-3 text-gray-600" />
                          <span>{res.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({res.source})</span>
                        </a>
                      ))}
                    </div>
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
