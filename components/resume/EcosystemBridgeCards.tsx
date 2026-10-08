'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Target,
  TrendingUp,
  MessageSquareCode,
  Sparkles,
  BookOpen,
  Bot,
  Zap,
} from 'lucide-react';
import { DetailedResumeAnalysis } from '@/lib/resume/analyzer';

interface EcosystemBridgeCardsProps {
  analysis: DetailedResumeAnalysis;
  targetRole: string;
}

export function EcosystemBridgeCards({
  analysis,
  targetRole,
}: EcosystemBridgeCardsProps) {
  const missingCount = analysis.checks.keywordMatch.missingSkills.length;
  const currentAts = analysis.overallScore;
  const estimatedProbGain = Math.round((currentAts / 100) * 25);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span>Next Steps: Placify AI Career Bridges</span>
          </h3>
          <p className="text-xs text-gray-500">
            Apply your verified resume signals across Placify AI&apos;s predictive and learning engines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BRIDGE 1: Skill Gap & Roadmap */}
        <Link
          href="/skill-gap"
          className="group bg-white p-5 rounded-3xl border border-gray-200 hover:border-black hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-black group-hover:text-black">
              Bridge to Skill Gap Analyzer
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              We identified <strong>{missingCount} missing skills</strong> for {targetRole}. Generate a 4-week custom learning roadmap to bridge them.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-bold text-black group-hover:underline gap-1">
            <span>Explore Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* BRIDGE 2: Placement Probability Simulation */}
        <Link
          href="/placement-prediction"
          className="group bg-white p-5 rounded-3xl border border-gray-200 hover:border-black hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-black group-hover:text-black">
              Bridge to Placement Prediction
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your ATS score of <strong>{currentAts}/100</strong> unlocks an estimated <strong>+{estimatedProbGain}% boost</strong> in tier-1 placement probability.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-bold text-black group-hover:underline gap-1">
            <span>Run Prediction Model</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* BRIDGE 3: AI Mock Interview Coach */}
        <Link
          href="/ai-coach"
          className="group bg-white p-5 rounded-3xl border border-gray-200 hover:border-black hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquareCode className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-black group-hover:text-black">
              Bridge to AI Mock Interview
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Start an interactive mock interview with questions tailored directly to the projects found in your resume.
            </p>
          </div>

          <div className="pt-2 flex items-center text-xs font-bold text-black group-hover:underline gap-1">
            <span>Start Tailored Interview</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
