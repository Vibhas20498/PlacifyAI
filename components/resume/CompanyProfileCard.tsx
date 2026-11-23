'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Target,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  CompanyProfileKey,
  COMPANY_PROFILES,
  CompanyEvaluationResult,
} from '@/lib/resume/company-profiles';

interface CompanyProfileCardProps {
  currentProfileKey: CompanyProfileKey;
  onSelectProfile: (key: CompanyProfileKey) => void;
  evaluation: CompanyEvaluationResult;
}

export function CompanyProfileCard({
  currentProfileKey,
  onSelectProfile,
  evaluation,
}: CompanyProfileCardProps) {
  const profileList = Object.values(COMPANY_PROFILES);

  const verdictStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const verdictBadges = {
    emerald: 'bg-emerald-500 text-white',
    blue: 'bg-blue-600 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-500 text-white',
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Company-Specific ATS Screening Profile</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                Recruiter Bar Simulator
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Simulate how different corporate ATS filters evaluate your resume
            </p>
          </div>
        </div>

        {/* Company ATS Score Indicator */}
        <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-gray-400">Company ATS Score</div>
            <div className="text-xs font-medium text-gray-600">
              Cutoff Bar: <span className="font-bold text-gray-900">{evaluation.profile.thresholdScore}/100</span>
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
              verdictBadges[evaluation.verdictColor]
            }`}
          >
            {evaluation.companyAtsScore}
          </div>
        </div>
      </div>

      {/* Company Profile Selector Pills */}
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Select Target Company Hiring Benchmark:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {profileList.map((p) => {
              const isSelected = p.key === currentProfileKey;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => onSelectProfile(p.key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'border-black bg-black text-white shadow-sm ring-2 ring-black/10'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{p.name.split('(')[0].trim()}</div>
                  <div
                    className={`text-[10px] line-clamp-1 ${
                      isSelected ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {p.name.includes('(') ? `(${p.name.split('(')[1]}` : 'General Placement'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Profile Banner & Verdict */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            verdictStyles[evaluation.verdictColor]
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{evaluation.profile.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-white/70 border border-current">
                {evaluation.fitVerdict}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">{evaluation.profile.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
            {evaluation.profile.keyEmphasis.map((emp, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/60 border border-current/20"
              >
                {emp}
              </span>
            ))}
          </div>
        </div>

        {/* Company Screening Checks Checklist */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>Automated Screening Bar Checks</span>
            <span className="text-gray-400 font-normal">
              {evaluation.screeningChecks.filter((c) => c.passed).length} /{' '}
              {evaluation.screeningChecks.length} Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evaluation.screeningChecks.map((check) => (
              <div
                key={check.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                  check.passed
                    ? 'bg-emerald-50/40 border-emerald-200 text-gray-800'
                    : check.importance === 'critical'
                    ? 'bg-rose-50/40 border-rose-200 text-gray-800'
                    : 'bg-amber-50/40 border-amber-200 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : check.importance === 'critical' ? (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={check.passed ? 'text-emerald-950' : 'text-gray-900'}>
                      {check.label}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      check.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : check.importance === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {check.passed ? 'Passed' : check.importance === 'critical' ? 'Critical Missing' : 'Recommended'}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 pl-5">{check.detail}</div>

                {!check.passed && (
                  <div className="text-[11px] text-gray-800 font-medium bg-white/80 p-2 rounded-xl border border-gray-100 pl-2 mt-1">
                    <span className="font-bold text-black">Action:</span> {check.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Advice */}
        {evaluation.keyAdvice.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Tailoring Summary for {evaluation.profile.name}</span>
            </div>
            <ul className="space-y-1 text-xs text-gray-600">
              {evaluation.keyAdvice.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-black font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
