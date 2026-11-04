'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { simulateWhatIf } from '@/lib/ml-engine';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  SlidersHorizontal,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Code2,
  FileCheck,
  FolderGit2,
  CloudLightning,
  ChevronRight,
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

export default function WhatIfSimulatorPage() {
  const { profile } = useUser();

  const [extraLeetcode, setExtraLeetcode] = useState(40);
  const [extraProjects, setExtraProjects] = useState(1);
  const [enableProdDeploy, setEnableProdDeploy] = useState(true);
  const [atsScoreDelta, setAtsScoreDelta] = useState(15);
  const [cgpaDelta, setCgpaDelta] = useState(0.2);
  const [isResetting, setIsResetting] = useState(false);

  const simulation = simulateWhatIf(profile, {
    extraLeetcodeCount: extraLeetcode,
    extraProjectsCount: extraProjects,
    enableProductionDeploy: enableProdDeploy,
    atsScoreDelta: atsScoreDelta,
    cgpaDelta: cgpaDelta,
  });

  const handleReset = () => {
    setIsResetting(true);
    setExtraLeetcode(0);
    setExtraProjects(0);
    setEnableProdDeploy(profile.hasProductionDeployment);
    setAtsScoreDelta(0);
    setCgpaDelta(0);
    setTimeout(() => setIsResetting(false), 500);
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
                What-If Sensitivity Simulator
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PREDICTIVE SENSITIVITY
              </span>
            </div>
            <p className="text-sm text-gray-500 font-sans">
              Test hypothetical career improvements to quantify their exact mathematical impact on placement probability for <span className="font-semibold text-black">{profile.targetRole || 'Fullstack Software Engineer'}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black hover:border-black bg-white transition-all flex items-center gap-2 self-start sm:self-auto shadow-2xs group btn-press"
          >
            <RotateCcw className={`w-3.5 h-3.5 transition-transform ${isResetting ? 'rotate-180 duration-500' : 'group-hover:-rotate-45'}`} />
            <span>Reset Sliders</span>
          </button>
        </motion.div>

        {/* Live Simulation Result Display */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Baseline Probability Card */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-3 shadow-2xs card-hover-lift">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              Current Baseline
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <AnimatedCounter
                value={simulation.baseProbability}
                className="text-4xl font-extrabold tracking-tight text-gray-400 font-heading"
              />
              <span className="text-xl font-bold text-gray-300">%</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
              <span>Present Profile State</span>
            </div>
          </div>

          {/* Simulated Projected Probability Card (Hero Dark Glass) */}
          <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 text-center space-y-3 shadow-xl border border-slate-800 card-hover-lift">
            {/* Ambient lighting glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulated Projected Probability</span>
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <AnimatedCounter
                  value={simulation.simulatedProbability}
                  className="text-5xl font-black tracking-tight text-white font-heading"
                />
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Hypothetical Trajectory
              </div>
            </div>
          </div>

          {/* Net Probability Gain */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-3 shadow-2xs card-hover-lift">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              Net Probability Gain
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black tracking-tight text-black font-heading">
                {simulation.delta >= 0 ? `+${simulation.delta}%` : `${simulation.delta}%`}
              </span>
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  simulation.delta > 0
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {simulation.delta > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>+{simulation.delta}% Boost Projected</span>
                  </>
                ) : (
                  <span>Baseline Calibration</span>
                )}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Sliders Panel */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-7 shadow-2xs"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-black font-heading">
                Adjust Hypothetical Signals
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag the sliders to simulate targeted preparation milestones
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-400">REAL-TIME SIMULATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slider 1: Extra Leetcode Problems */}
            <div className="space-y-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-black" />
                  <span>Solve Extra DSA Problems</span>
                </span>
                <span className="font-mono font-extrabold text-black bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  +{extraLeetcode} Problems
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="10"
                value={extraLeetcode}
                onChange={(e) => setExtraLeetcode(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>0</span>
                <span>+75</span>
                <span>+150 Problems</span>
              </div>
            </div>

            {/* Slider 2: Resume ATS Score Improvement */}
            <div className="space-y-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-black" />
                  <span>Resume ATS Keyword & Impact Boost</span>
                </span>
                <span className="font-mono font-extrabold text-black bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  +{atsScoreDelta} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={atsScoreDelta}
                onChange={(e) => setAtsScoreDelta(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>0 pts</span>
                <span>+15 pts</span>
                <span>+30 pts</span>
              </div>
            </div>

            {/* Slider 3: Extra Fullstack Projects */}
            <div className="space-y-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-black" />
                  <span>Build Additional Fullstack Projects</span>
                </span>
                <span className="font-mono font-extrabold text-black bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  +{extraProjects} Projects
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={extraProjects}
                onChange={(e) => setExtraProjects(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>0</span>
                <span>+1 Project</span>
                <span>+3 Projects</span>
              </div>
            </div>

            {/* Toggle 4: Production Deployment & CI/CD */}
            <div className="space-y-3 flex flex-col justify-center">
              <label className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl border border-gray-200 bg-gray-50/70 hover:border-black hover:bg-white transition-all card-hover-lift shadow-2xs">
                <input
                  type="checkbox"
                  checked={enableProdDeploy}
                  onChange={(e) => setEnableProdDeploy(e.target.checked)}
                  className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black accent-black cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-black flex items-center gap-1.5">
                    <CloudLightning className="w-3.5 h-3.5 text-black" />
                    <span>Deploy Projects to Cloud with CI/CD</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Live production URL, Docker container, and automated health checks
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Action Bridge */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-gray-500 font-medium">
              Want to turn this hypothetical plan into actionable daily tasks?
            </span>
            <Link
              href="/learning-roadmap"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline group"
            >
              <span>Map Milestones into Learning Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
