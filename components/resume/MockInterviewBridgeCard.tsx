'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mic,
  Sparkles,
  ArrowRight,
  Code2,
  FolderGit2,
  Briefcase,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { DetailedResumeAnalysis } from '@/lib/resume/analyzer';

interface MockInterviewBridgeCardProps {
  analysis: DetailedResumeAnalysis;
  targetRole: string;
  companyName?: string;
}

export function MockInterviewBridgeCard({
  analysis,
  targetRole,
  companyName = 'General Placement',
}: MockInterviewBridgeCardProps) {
  const router = useRouter();

  const skillsList = analysis.checks.keywordMatch.foundSkills.slice(0, 5);
  const projectsCount = analysis.checks.structureAndContact.hasProjects ? 2 : 1;

  const handleLaunchMockInterview = () => {
    // 1. Cache the active resume analysis in localStorage so mock interview engine can read it directly
    try {
      localStorage.setItem(
        'placify_last_resume_analysis',
        JSON.stringify({
          rawText: analysis.rawText,
          overallScore: analysis.overallScore,
          targetRole,
          companyName,
          skills: analysis.extractedProfile?.skills || analysis.checks.keywordMatch.foundSkills,
          bulletImprovements: analysis.bulletImprovements,
        })
      );
    } catch (e) {
      console.warn('Could not persist resume analysis to localStorage', e);
    }

    // 2. Navigate to mock interview with query params prefilling configuration
    const queryParams = new URLSearchParams({
      source: 'resume',
      role: targetRole,
      company: companyName,
      type: 'resume-based',
    });

    router.push(`/mock-interview?${queryParams.toString()}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black text-white p-6 sm:p-8 shadow-xl border border-gray-800">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Mic className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">AI Mock Interview Bridge</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  1-Click Direct Launch
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Practice answering high-stakes recruiter questions grounded in your actual projects & skills
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchMockInterview}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/10 self-start sm:self-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Signals Extracted */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Briefcase className="w-3.5 h-3.5 text-gray-300" />
              <span>Target Role & Company</span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {targetRole} <span className="text-gray-400 font-normal">({companyName})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Resume Stack</span>
            </div>
            <div className="text-xs font-medium text-gray-200 truncate">
              {skillsList.length > 0 ? skillsList.join(', ') : 'Fullstack Core Skills'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Technical Projects Analyzed</span>
            </div>
            <div className="text-sm font-bold text-white">
              {projectsCount} Projects{' '}
              <span className="text-xs font-normal text-emerald-300">(Deep Defense Ready)</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Teaser */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Questions generated directly from your experience bullets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>STAR-method real-time feedback & scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voice & text response modes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
