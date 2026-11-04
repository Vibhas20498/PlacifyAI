'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { calculatePlacementProbability } from '@/lib/scoring';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  TrendingUp,
  PlusCircle,
  MinusCircle,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  Award,
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

export default function PlacementPredictionPage() {
  const { profile } = useUser();
  const evaluation = calculatePlacementProbability(profile);

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
                Placement Probability & Factor Attribution
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SHAP EXPLAINABILITY
              </span>
            </div>
            <p className="text-sm text-gray-500 font-sans">
              Deterministic, explainable readiness analytics calculated via multi-factor candidate benchmarking for <span className="font-semibold text-black">{profile.targetRole || 'Fullstack Software Engineer'}</span>.
            </p>
          </div>
          <Link
            href="/what-if"
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto group btn-press"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Launch What-If Workbench</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Hero Score Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Placement Probability */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-3 shadow-2xs card-hover-lift relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Placement Probability
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <AnimatedCounter
                  value={evaluation.probability}
                  className="text-5xl font-black tracking-tight text-black font-heading"
                />
                <span className="text-2xl font-bold text-gray-400">%</span>
              </div>
            </div>

            {/* Confidence Interval Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-600 font-mono">
              <span>95% Confidence:</span>
              <strong className="text-black">[{evaluation.confidenceInterval[0]}%, {evaluation.confidenceInterval[1]}%]</strong>
            </div>

            {/* Micro progress indicator */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-black rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${evaluation.probability}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </div>
          </div>

          {/* Card 2: Peer Benchmark Percentile */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-3 shadow-2xs card-hover-lift">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Peer Benchmark Percentile
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <AnimatedCounter
                  value={evaluation.peerPercentile}
                  className="text-5xl font-black tracking-tight text-black font-heading"
                />
                <span className="text-2xl font-bold text-gray-400">th</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 font-medium leading-relaxed">
              Ahead of <strong className="text-black font-semibold">{evaluation.peerPercentile}%</strong> of benchmarked candidate profiles in your cohort.
            </div>

            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${evaluation.peerPercentile}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </div>
          </div>

          {/* Card 3: Composite Readiness Index */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-3 shadow-2xs card-hover-lift">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                Readiness Index
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <AnimatedCounter
                  value={evaluation.readinessScore}
                  className="text-5xl font-black tracking-tight text-black font-heading"
                />
                <span className="text-2xl font-bold text-gray-400">/100</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 font-medium leading-relaxed">
              Multi-factor composite score across projects, DSA, ATS, and GPA signals.
            </div>

            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${evaluation.readinessScore}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Factor Attribution Decomposition (Why is my score X%?) */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-black font-heading">
                  Granular Placement Drivers (SHAP Attribution)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono">
                  DECOMPOSED
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Factor breakdown revealing positive accelerators and key drag signals.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-gray-500 font-mono">Baseline Cohort Mean:</span>
              <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-bold font-mono">
                52%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {evaluation.shapFactors.map((factor, idx) => {
              const isPos = factor.impactType === 'positive';
              const barWidth = Math.min(Math.max(factor.impactValue * 7, 10), 100);

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-5 rounded-2xl border transition-all card-hover-lift shadow-2xs ${
                    isPos
                      ? 'border-gray-200 bg-gray-50/60 hover:bg-white hover:border-black'
                      : 'border-amber-200/80 bg-amber-50/30 hover:bg-white hover:border-amber-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {isPos ? (
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                          <PlusCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <MinusCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-black font-heading">{factor.displayName}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Animated impact bar */}
                      <div className="w-24 sm:w-32 bg-gray-200/80 h-2 rounded-full overflow-hidden hidden sm:block">
                        <motion.div
                          className={`h-full rounded-full ${isPos ? 'bg-black' : 'bg-amber-600'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * idx }}
                        />
                      </div>

                      <span
                        className={`text-xs font-mono font-extrabold px-3 py-0.5 rounded-full ${
                          isPos ? 'bg-black text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isPos ? `+${factor.impactValue}%` : `-${factor.impactValue}%`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pl-8">
                    {factor.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Feature Weights Matrix */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                Evaluation Factor Weights & Profile Signals
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Exact algorithmic weights used to calibrate candidate placement scoring.
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-400">Sum = 100%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 font-semibold">Factor Name</th>
                  <th className="py-3 font-semibold">Candidate Profile Value</th>
                  <th className="py-3 font-semibold">Weight Impact</th>
                  <th className="py-3 text-right font-semibold">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluation.featureWeights.map((fw) => (
                  <tr key={fw.name} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-semibold text-black">{fw.name}</td>
                    <td className="py-3.5 text-gray-800 font-medium font-mono">{fw.value}</td>
                    <td className="py-3.5 text-gray-500 font-medium font-mono">
                      <div className="flex items-center gap-2">
                        <span>{fw.weight}%</span>
                        <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full"
                            style={{ width: `${fw.weight * 3}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                          fw.impact === 'positive'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {fw.impact === 'positive' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Optimal</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Needs Work</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
