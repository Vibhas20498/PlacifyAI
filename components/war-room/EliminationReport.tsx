'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  RotateCcw,
  Target,
  ArrowRight,
  TrendingDown,
  BookOpen,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { CompanyDriveProfile, WarRoomStage } from '@/lib/placement-war-room/types';

interface EliminationReportProps {
  company: CompanyDriveProfile;
  eliminatedStage: WarRoomStage;
  eliminationReason: string;
  onRestart: () => void;
}

export function EliminationReport({
  company,
  eliminatedStage,
  eliminationReason,
  onRestart,
}: EliminationReportProps) {
  const stageNames: Record<WarRoomStage, string> = {
    'company-selection': 'Registration',
    'round-1-screening': 'Round 1: Online Screening Test',
    'round-2-coding': 'Round 2: Live Speed Coding Elimination',
    'round-3-technical': 'Round 3: Technical & Project Defense',
    'round-4-hr': 'Round 4: HR & Cultural Alignment',
    'verdict-offer': 'Offer Letter',
    'verdict-eliminated': 'Elimination',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Elimination Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-3 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Placement Elimination Notice
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">
            Eliminated at {stageNames[eliminatedStage] || 'Selection Stage'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            You fell just short of the competitive hiring bar for <strong>{company.name}</strong> ({company.roleTitle}).
          </p>
        </div>
      </motion.div>

      {/* Diagnostic Gap Details */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Diagnostic Cutoff Gap Analysis
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm text-gray-800 leading-relaxed">
            {eliminationReason}
          </div>
        </div>

        {/* Why this matters in campus drives */}
        <div className="space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
          <div className="font-bold text-gray-900">Placement Cell Insight:</div>
          <p className="leading-relaxed">
            In competitive drives like {company.name}, recruiters receive thousands of candidate applications and use automated elimination filters to trim the applicant pool to the top percentile before manual interview rounds.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry This Drive with New Paper</span>
          </button>

          <Link
            href="/skill-gap"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Bridge to Skill Gap Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
