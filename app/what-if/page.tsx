'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { simulateWhatIf } from '@/lib/ml-engine';
import { SlidersHorizontal, ArrowRight, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';

export default function WhatIfSimulatorPage() {
  const { profile } = useUser();

  const [extraLeetcode, setExtraLeetcode] = useState(40);
  const [extraProjects, setExtraProjects] = useState(1);
  const [enableProdDeploy, setEnableProdDeploy] = useState(true);
  const [atsScoreDelta, setAtsScoreDelta] = useState(15);
  const [cgpaDelta, setCgpaDelta] = useState(0.2);

  const simulation = simulateWhatIf(profile, {
    extraLeetcodeCount: extraLeetcode,
    extraProjectsCount: extraProjects,
    enableProductionDeploy: enableProdDeploy,
    atsScoreDelta: atsScoreDelta,
    cgpaDelta: cgpaDelta,
  });

  const handleReset = () => {
    setExtraLeetcode(0);
    setExtraProjects(0);
    setEnableProdDeploy(profile.hasProductionDeployment);
    setAtsScoreDelta(0);
    setCgpaDelta(0);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              What-If Sensitivity Simulator
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Test hypothetical improvements to quantify their exact mathematical impact on placement probability.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        </div>

        {/* Live Simulation Result Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
              Current Baseline Probability
            </span>
            <div className="text-4xl font-extrabold font-mono text-gray-400">
              {simulation.baseProbability}%
            </div>
            <div className="text-xs text-gray-400 font-mono">Present Profile</div>
          </div>

          <div className="bg-black text-white rounded-2xl p-6 text-center space-y-2 shadow-lg">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              Simulated Projected Probability
            </span>
            <div className="text-5xl font-extrabold font-mono text-white">
              {simulation.simulatedProbability}%
            </div>
            <div className="text-xs text-gray-300 font-mono">
              Hypothetical Trajectory
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
              Net Probability Gain
            </span>
            <div className="text-4xl font-extrabold font-mono text-black">
              {simulation.delta >= 0 ? `+${simulation.delta}%` : `${simulation.delta}%`}
            </div>
            <div className="text-xs font-mono font-semibold bg-gray-100 inline-block px-2 py-0.5 rounded text-black">
              {simulation.delta > 0 ? 'Substantial Boost' : 'Baseline State'}
            </div>
          </div>
        </div>

        {/* Interactive Sliders Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-black pb-3 border-b border-gray-100">
            Adjust Hypothetical Signals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slider 1: Extra Leetcode Problems */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Solve Extra DSA Problems</span>
                <span className="font-mono font-bold text-black">+{extraLeetcode} Problems</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="10"
                value={extraLeetcode}
                onChange={(e) => setExtraLeetcode(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0</span>
                <span>+75</span>
                <span>+150</span>
              </div>
            </div>

            {/* Slider 2: Resume ATS Score Improvement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Resume ATS Keyword & Impact Boost</span>
                <span className="font-mono font-bold text-black">+{atsScoreDelta} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={atsScoreDelta}
                onChange={(e) => setAtsScoreDelta(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0 pts</span>
                <span>+15 pts</span>
                <span>+30 pts</span>
              </div>
            </div>

            {/* Slider 3: Extra Fullstack Projects */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">Build Additional Projects</span>
                <span className="font-mono font-bold text-black">+{extraProjects} Projects</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={extraProjects}
                onChange={(e) => setExtraProjects(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0</span>
                <span>+1 Project</span>
                <span>+3 Projects</span>
              </div>
            </div>

            {/* Toggle 4: Production Deployment & CI/CD */}
            <div className="space-y-3 flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-black transition-colors">
                <input
                  type="checkbox"
                  checked={enableProdDeploy}
                  onChange={(e) => setEnableProdDeploy(e.target.checked)}
                  className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black"
                />
                <div>
                  <div className="text-xs font-bold text-black">Deploy Projects to Cloud with CI/CD</div>
                  <div className="text-[11px] text-gray-500">Live URL, Docker container, automated tests</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
