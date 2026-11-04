'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AnimatedTabs, TabItem } from '@/components/ui/AnimatedTabs';
import {
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  Filter,
  Check,
} from 'lucide-react';
import Link from 'next/link';

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

const FILTER_TABS: TabItem[] = [
  { id: 'all', label: 'All Deficits' },
  { id: 'Essential', label: 'Essential Priority', badge: 'High ROI' },
  { id: 'Competitive', label: 'Competitive' },
  { id: 'acquired', label: 'Verified Skills' },
];

export default function SkillGapPage() {
  const { skillGaps, profile, addVerifiedSkill } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentlyAcquired, setRecentlyAcquired] = useState<string[]>([]);

  // Filter skills
  const filteredGaps = skillGaps.filter((gap) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Essential' || activeFilter === 'Competitive') {
      return gap.importance === activeFilter;
    }
    return true;
  });

  const totalDeficitHours = skillGaps.reduce((acc, g) => acc + g.estimatedTimeToAcquireHours, 0);
  const essentialCount = skillGaps.filter((g) => g.importance === 'Essential').length;

  const handleMarkAcquired = (skill: string) => {
    addVerifiedSkill(skill);
    setRecentlyAcquired((prev) => [...prev, skill]);
  };

  return (
    <AppShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-5xl"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-black font-heading">
                Skill Gap Intelligence
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                1,500+ JD BENCHMARKS
              </span>
            </div>
            <p className="text-sm text-gray-500 font-sans">
              Priority competency deficits benchmarked against hiring requirements for <span className="font-semibold text-black">{profile.targetRole || 'Fullstack Software Engineer'}</span>.
            </p>
          </div>

          <Link
            href="/learning-roadmap"
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto group btn-press"
          >
            <span>Launch Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Metric Summary Strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs card-hover-lift flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Essential Deficits
              </span>
              <div className="text-3xl font-black text-black font-heading mt-1">
                <AnimatedCounter value={essentialCount} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Critical barrier to screening</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs card-hover-lift flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Est. Time to Bridge
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <AnimatedCounter value={totalDeficitHours} className="text-3xl font-black text-black font-heading" />
                <span className="text-sm font-semibold text-gray-400">hours</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Across all identified gaps</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-black flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs card-hover-lift flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Verified Skills
              </span>
              <div className="text-3xl font-black text-black font-heading mt-1">
                <AnimatedCounter value={profile.verifiedSkills.length} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Ready for technical defense</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 flex-wrap">
          <AnimatedTabs
            tabs={FILTER_TABS}
            activeTab={activeFilter}
            onChange={(id) => setActiveFilter(id)}
            layoutId="skillGapFilterTab"
            variant="pills"
          />

          <span className="text-xs text-gray-500 font-medium">
            Showing <strong>{filteredGaps.length}</strong> of {skillGaps.length} gaps
          </span>
        </motion.div>

        {/* Skill Gap Cards List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredGaps.map((gap) => {
              const gapPct = Math.max(gap.targetProficiency - gap.currentProficiency, 0);
              const isAcquired = profile.verifiedSkills.includes(gap.skill) || recentlyAcquired.includes(gap.skill);

              return (
                <motion.div
                  key={gap.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200/90 hover:border-black rounded-3xl p-6 transition-all space-y-4 shadow-2xs card-hover-lift"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-mono ${
                          gap.importance === 'Essential'
                            ? 'bg-black text-white shadow-xs'
                            : gap.importance === 'Competitive'
                            ? 'bg-gray-100 text-black border border-gray-300'
                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {gap.importance} Priority
                      </span>
                      <h3 className="text-base font-bold text-black font-heading">{gap.skill}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-black" />
                        ~{gap.estimatedTimeToAcquireHours} hrs to acquire
                      </span>
                      <span className="font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">
                        Demand: {gap.marketDemandScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Progress bars comparing Current vs Target */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-500">
                        Current Proficiency: <strong className="text-black font-semibold">{gap.currentProficiency}%</strong>
                      </span>
                      <span className="text-gray-500">
                        Target Proficiency: <strong className="text-black font-semibold">{gap.targetProficiency}%</strong>
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex relative">
                      <motion.div
                        className="h-full bg-black rounded-l-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${gap.currentProficiency}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="h-full bg-gray-300 pattern-hatched opacity-60"
                        initial={{ width: 0 }}
                        animate={{ width: `${gapPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500 font-medium">
                      Category: <span className="text-black font-semibold">{gap.category}</span> • Deficit Gap: <strong className="text-black font-mono">+{gapPct}%</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkAcquired(gap.skill)}
                        disabled={isAcquired}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isAcquired
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'border border-gray-200 text-gray-700 hover:text-black hover:border-black bg-white'
                        }`}
                      >
                        {isAcquired ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Acquired!</span>
                          </>
                        ) : (
                          <span>Mark as Acquired</span>
                        )}
                      </button>

                      <Link
                        href="/learning-roadmap"
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-1.5 shadow-2xs group btn-press"
                      >
                        <span>Study in Roadmap</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
