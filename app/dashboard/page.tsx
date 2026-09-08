'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { RadarChart } from '@/components/ui/RadarChart';
import { SkillBarChart } from '@/components/ui/SkillBarChart';
import { HorizontalOverviewNodePath } from '@/components/motif/NodePathMotif';
import { useUser } from '@/lib/store/user-context';
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { profile, skillGaps, jobs, roadmap } = useUser();

  const completedRoadmapNodes = roadmap.filter((r) => r.status === 'completed').length;
  const totalRoadmapNodes = roadmap.length;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header with Title & Overall Readiness */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Placement Readiness
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your AI-estimated placement intelligence overview.
            </p>
          </div>

          <div className="flex items-baseline sm:items-end flex-col sm:text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold font-mono text-black">
                {profile.careerReadinessScore}
              </span>
              <span className="text-xl font-medium font-mono text-gray-400">/100</span>
            </div>
            <span className="text-xs font-medium text-gray-500 font-sans">
              Overall readiness
            </span>
          </div>
        </div>

        {/* Readiness Overview 4-Card Grid */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-black">Readiness Overview</h2>
            <p className="text-xs text-gray-500">Key placement indicators at a glance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Placement Probability"
              value={`${profile.placementProbability}%`}
              iconType="trending"
              href="/placement-prediction"
              subtitle="XGBoost ML prediction"
            />
            <StatCard
              label="Resume Score"
              value={`${profile.resumeAtsScore}/100`}
              iconType="file"
              href="/resume"
              subtitle="ATS criteria evaluated"
            />
            <StatCard
              label="Avg Job Match"
              value="82%"
              iconType="briefcase"
              href="/job-analyzer"
              subtitle="Across active listings"
            />
            <StatCard
              label="Skill Readiness"
              value="93%"
              iconType="target"
              href="/skill-gap"
              subtitle="Target role coverage"
            />
          </div>
        </section>

        {/* 7-Stage Career Journey Path */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black">01 // Career Readiness Journey</h3>
              <p className="text-xs text-gray-500">
                You are ahead of 84% of candidates targeting {profile.targetRole} roles.
              </p>
            </div>
            <Link
              href="/learning-roadmap"
              className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <HorizontalOverviewNodePath currentStage={4} />
        </section>

        {/* Two-Column Breakdown: Radar Chart & Top Skill Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Readiness Radar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-black">Skill Readiness</h3>
              <p className="text-xs text-gray-500">Per-skill readiness across your target role</p>
            </div>

            <div className="my-4">
              <RadarChart
                data={[
                  { skill: 'Python', score: 95 },
                  { skill: 'SQL', score: 88 },
                  { skill: 'FastAPI', score: 82 },
                  { skill: 'TypeScript', score: 90 },
                ]}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-black" />
                Verified Competencies: 8
              </span>
              <Link href="/skill-gap" className="font-semibold text-black hover:underline">
                Manage Skills →
              </Link>
            </div>
          </div>

          {/* Top Skill Gaps Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-black">Top Skill Gaps</h3>
              <p className="text-xs text-gray-500">Highest-impact areas to improve</p>
            </div>

            <div className="my-4 flex-1 flex flex-col justify-center">
              <SkillBarChart
                skills={[
                  { name: 'Docker & Containerization', gap: 65, priority: 'Essential' },
                  { name: 'Redis Caching', gap: 60, priority: 'Essential' },
                  { name: 'System Design Patterns', gap: 50, priority: 'Competitive' },
                  { name: 'Kafka Event Streaming', gap: 40, priority: 'Competitive' },
                ]}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="text-gray-500">Target Role: {profile.targetRole}</span>
              <Link href="/learning-roadmap" className="font-semibold text-black hover:underline">
                Bridge Gaps in Roadmap →
              </Link>
            </div>
          </div>
        </div>

        {/* Priority Action Items / RAG Grounded Recommendations */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-black">High-Impact Placement Actions</h3>
              <p className="text-xs text-gray-500">
                Ranked by predicted ROI on placement probability
              </p>
            </div>
            <Link
              href="/ai-coach"
              className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI Coach</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded">
                  +8.4% PROB
                </span>
                <span className="text-xs text-gray-500 font-mono">1-2 Days</span>
              </div>
              <h4 className="text-sm font-bold text-black">Optimize Resume Bullet Points</h4>
              <p className="text-xs text-gray-600">
                Inject quantifiable metrics (XYZ formula) to elevate ATS score from 68 to 85+.
              </p>
              <Link href="/resume" className="text-xs font-semibold text-black hover:underline inline-block pt-1">
                Open Resume Analyzer →
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded">
                  +6.2% PROB
                </span>
                <span className="text-xs text-gray-500 font-mono">3 Days</span>
              </div>
              <h4 className="text-sm font-bold text-black">Deploy Dockerized Backend</h4>
              <p className="text-xs text-gray-600">
                Add multi-stage Dockerfile and GitHub Actions CI/CD to PlacifyAI repository.
              </p>
              <Link href="/learning-roadmap" className="text-xs font-semibold text-black hover:underline inline-block pt-1">
                Open DevOps Module →
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded">
                  +5.5% PROB
                </span>
                <span className="text-xs text-gray-500 font-mono">1 Week</span>
              </div>
              <h4 className="text-sm font-bold text-black">Mock Technical Interview</h4>
              <p className="text-xs text-gray-600">
                Practice concurrency, Redis caching, and STAR behavioral defense with AI interviewer.
              </p>
              <Link href="/mock-interview" className="text-xs font-semibold text-black hover:underline inline-block pt-1">
                Start Mock Session →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
