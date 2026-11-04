'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { RadarChart } from '@/components/ui/RadarChart';
import { SkillBarChart } from '@/components/ui/SkillBarChart';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { HorizontalOverviewNodePath } from '@/components/motif/NodePathMotif';
import { useUser } from '@/lib/store/user-context';
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { generateLinkedInJobsForRole, buildLinkedInJobSearchUrl } from '@/lib/linkedin/job-radar';

// Container & item animation variants for smooth staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DashboardPage() {
  const { profile, skillGaps, jobs, roadmap } = useUser();

  const completedRoadmapNodes = roadmap.filter((r) => r.status === 'completed').length;
  const totalRoadmapNodes = roadmap.length;

  const linkedInJobs = React.useMemo(() => {
    return generateLinkedInJobsForRole(
      profile.targetRole || 'Fullstack Software Engineer',
      profile.verifiedSkills || [],
      profile.resumeAtsScore || 70
    ).slice(0, 3);
  }, [profile.targetRole, profile.verifiedSkills, profile.resumeAtsScore]);

  return (
    <AppShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header with Title & Overall Readiness Hero */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-200/80"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-black font-heading">
                Placement Readiness
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Calibration
              </span>
            </div>
            <p className="text-sm text-gray-500 font-sans">
              AI-calibrated placement intelligence benchmarked for <span className="font-semibold text-black">{profile.targetRole || 'Fullstack Software Engineer'}</span>.
            </p>
          </div>

          {/* Radial Readiness Score Hero Badge */}
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200 shadow-2xs self-start md:self-auto card-hover-lift">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-black"
                  strokeWidth="3.5"
                  strokeDasharray={`${profile.careerReadinessScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${profile.careerReadinessScore}, 100` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatedCounter
                  value={profile.careerReadinessScore}
                  className="text-sm font-extrabold text-black"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <AnimatedCounter
                  value={profile.careerReadinessScore}
                  className="text-2xl font-black text-black tracking-tight"
                />
                <span className="text-xs font-semibold text-gray-400">/100</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Overall Index
              </span>
            </div>
          </div>
        </motion.div>

        {/* Incomplete Profile Setup Protocol Banner */}
        {(!profile.isOnboarded || !profile.university || profile.university === 'Engineering Institution') && (
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800"
          >
            {/* Subtle ambient lighting */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 font-mono">
                    Action Required • Setup Calibration
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white font-heading">
                  Complete Your Candidate Profile Benchmarking
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Calibrate your college tier, verified technical competencies, and algorithmic ratings to unlock precise multi-factor placement predictions.
                </p>
              </div>

              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-100 transition-all shrink-0 self-start md:self-auto shadow-md group btn-press"
              >
                <span>Launch 4-Step Setup Wizard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Readiness Overview 4-Card Grid */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black font-heading">Readiness Overview</h2>
              <p className="text-xs text-gray-500">Key algorithmic placement indicators at a glance</p>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 font-mono">
              UPDATED TODAY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Placement Probability"
              value={`${profile.placementProbability}%`}
              iconType="trending"
              href="/placement-prediction"
              subtitle="Multi-factor evaluation"
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
        </motion.section>

        {/* 7-Stage Career Journey Path */}
        <motion.section
          variants={itemVariants}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs card-hover-lift"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-black font-mono">
                  Stage 04 of 07
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs font-semibold text-emerald-600">On Track</span>
              </div>
              <h3 className="text-base font-bold text-black font-heading mt-0.5">
                Career Readiness Journey
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                You are currently ahead of 84% of candidates targeting <span className="font-semibold text-black">{profile.targetRole}</span> roles.
              </p>
            </div>
            <Link
              href="/learning-roadmap"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-gray-700 transition-colors group self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-gray-50"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="pt-2">
            <HorizontalOverviewNodePath currentStage={4} />
          </div>
        </motion.section>

        {/* Two-Column Breakdown: Radar Chart & Top Skill Gaps */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Readiness Radar */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs card-hover-lift">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-black font-heading">Skill Readiness Radar</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                  4 Core Signals
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Multi-axis proficiency mapping against industry standard</p>
            </div>

            <div className="my-6">
              <RadarChart
                data={[
                  { skill: 'Python', score: 95 },
                  { skill: 'SQL', score: 88 },
                  { skill: 'FastAPI', score: 82 },
                  { skill: 'TypeScript', score: 90 },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-black" />
                Verified Competencies: 8
              </span>
              <Link
                href="/skill-gap"
                className="font-semibold text-black hover:underline flex items-center gap-1 group"
              >
                <span>Manage Skills</span>
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Top Skill Gaps Bar Chart */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs card-hover-lift">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-black font-heading">Top Skill Deficits</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                  Market Benchmarked
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Highest-impact priority areas to bridge for +14% probability boost</p>
            </div>

            <div className="my-6 flex-1 flex flex-col justify-center">
              <SkillBarChart
                skills={[
                  { name: 'Docker & Containerization', gap: 65, priority: 'Essential' },
                  { name: 'Redis Caching', gap: 60, priority: 'Essential' },
                  { name: 'System Design Patterns', gap: 50, priority: 'Competitive' },
                  { name: 'Kafka Event Streaming', gap: 40, priority: 'Competitive' },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <span className="text-gray-500 font-medium">Target Role: {profile.targetRole}</span>
              <Link
                href="/learning-roadmap"
                className="font-semibold text-black hover:underline flex items-center gap-1 group"
              >
                <span>Bridge Gaps in Roadmap</span>
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* LinkedIn Live Role Matches for Selected Role */}
        <motion.section
          variants={itemVariants}
          className="bg-gradient-to-br from-white via-white to-blue-50/20 border border-blue-200/60 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs card-hover-lift"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white font-black text-lg shadow-sm">
                in
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-black font-heading">
                    LinkedIn Live Role Radar
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Active Listings
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time role matching synchronized with your target role:{' '}
                  <span className="font-semibold text-black">{profile.targetRole || 'Fullstack Software Engineer'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={buildLinkedInJobSearchUrl(profile.targetRole || 'Software Engineer')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all shadow-2xs"
              >
                <span>Search LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-all shadow-2xs group"
              >
                <span>Full Job Radar</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {linkedInJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#0A66C2] transition-all space-y-3 shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0"
                        style={{ backgroundColor: job.companyColor }}
                      >
                        {job.companyInitial}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black truncate max-w-[130px]">
                          {job.company}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {job.matchPercentage}% match
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-gray-900 mt-2.5 line-clamp-1 group-hover:text-[#0A66C2] transition-colors">
                    {job.title}
                  </h5>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.matchedSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-gray-400 font-mono">{job.postedTime}</span>
                  <a
                    href={job.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0A66C2] hover:text-[#004182] hover:underline"
                  >
                    <span>Apply on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Priority Action Items / AI Recommendations */}
        <motion.section
          variants={itemVariants}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-black font-heading">
                  High-Impact Placement Actions
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-white font-mono">
                  AI RECOMMENDATIONS
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ranked by predicted mathematical return on placement probability
              </p>
            </div>
            <Link
              href="/ai-coach"
              className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto group btn-press"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Coach</span>
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-black transition-all space-y-3 shadow-2xs group card-hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold bg-black text-white px-2.5 py-0.5 rounded-full font-mono tracking-tight shadow-xs">
                  +8.4% PROB
                </span>
                <span className="text-[11px] text-gray-500 font-semibold font-mono">1-2 Days</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-black font-heading group-hover:text-black">
                  Optimize Resume Bullet Points
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Inject quantifiable metrics and action-oriented achievements to elevate ATS score from 68 to 85+.
                </p>
              </div>
              <Link
                href="/resume"
                className="text-xs font-semibold text-black group-hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Open Resume Analyzer</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-black transition-all space-y-3 shadow-2xs group card-hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold bg-black text-white px-2.5 py-0.5 rounded-full font-mono tracking-tight shadow-xs">
                  +6.2% PROB
                </span>
                <span className="text-[11px] text-gray-500 font-semibold font-mono">3 Days</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-black font-heading group-hover:text-black">
                  Deploy Dockerized Backend
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Add multi-stage Dockerfile and GitHub Actions CI/CD to PlacifyAI repository with live healthcheck.
                </p>
              </div>
              <Link
                href="/learning-roadmap"
                className="text-xs font-semibold text-black group-hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Open DevOps Module</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-black transition-all space-y-3 shadow-2xs group card-hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold bg-black text-white px-2.5 py-0.5 rounded-full font-mono tracking-tight shadow-xs">
                  +5.5% PROB
                </span>
                <span className="text-[11px] text-gray-500 font-semibold font-mono">1 Week</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-black font-heading group-hover:text-black">
                  Mock Technical Interview
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Practice concurrency, Redis caching, and STAR behavioral defense with the AI voice interviewer.
                </p>
              </div>
              <Link
                href="/mock-interview"
                className="text-xs font-semibold text-black group-hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Start Mock Session</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
