'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Building2,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  analyzeJobDescriptionMatch,
  JobDescriptionMatchResult,
  SAMPLE_JOB_DESCRIPTIONS,
} from '@/lib/resume/analyzer';

interface JobDescriptionMatcherProps {
  resumeText: string;
  targetRole: string;
  onAddSkillToResume?: (skill: string) => void;
}

export function JobDescriptionMatcher({
  resumeText,
  targetRole,
  onAddSkillToResume,
}: JobDescriptionMatcherProps) {
  const [jdText, setJdText] = useState(SAMPLE_JOB_DESCRIPTIONS[0].description);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_JOB_DESCRIPTIONS[0].id);
  const [matchResult, setMatchResult] = useState<JobDescriptionMatchResult>(() =>
    analyzeJobDescriptionMatch(resumeText, SAMPLE_JOB_DESCRIPTIONS[0].description, targetRole)
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_JOB_DESCRIPTIONS.find((s) => s.id === sampleId);
    if (!sample) return;
    setSelectedSampleId(sampleId);
    setJdText(sample.description);
    const result = analyzeJobDescriptionMatch(resumeText, sample.description, targetRole);
    setMatchResult(result);
  };

  const handleAnalyzeCustomJd = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeJobDescriptionMatch(resumeText, jdText, targetRole);
      setMatchResult(result);
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-black">
              Target Job Description Matcher
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-black border border-gray-300">
              Role Tailoring Matrix
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Paste any job posting to evaluate your resume against that specific company&apos;s ATS requirements.
          </p>
        </div>

        {/* Match Score Badge */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              JD ATS Match
            </div>
            <div className="text-xs font-bold text-black">
              {matchResult.matchTier}
            </div>
          </div>
          <div className="text-3xl font-black text-black font-mono">
            {matchResult.matchScore}%
          </div>
        </div>
      </div>

      {/* Preset JD Chips */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-black" />
          <span>Quick Preset Job Descriptions (Click to test):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_JOB_DESCRIPTIONS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedSampleId === sample.id
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:bg-gray-50'
              }`}
            >
              {sample.company} — {sample.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* JD Input Area */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 block">
          Job Description Text:
        </label>
        <textarea
          rows={5}
          value={jdText}
          onChange={(e) => {
            setJdText(e.target.value);
            setSelectedSampleId('');
          }}
          placeholder="Paste requirements, responsibilities, and qualifications from the target job posting here..."
          className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs text-black font-mono focus:border-black focus:ring-1 focus:ring-black outline-none leading-relaxed transition-all"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAnalyzeCustomJd}
            disabled={isAnalyzing || !jdText.trim()}
            className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Target className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? 'Matching Keywords...' : 'Recalculate Match Score'}</span>
          </button>
        </div>
      </div>

      {/* KEYWORD GAP MATRIX (Must-Haves vs Nice-to-Haves) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* MUST HAVE SKILLS */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black" />
              Must-Have Core Skills
            </span>
            <span className="text-xs font-bold text-black">
              {matchResult.matchedMustHaveCount} of {matchResult.totalMustHaves} Found
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matchResult.mustHaveSkills.map((item, idx) => (
              <div
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  item.found
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {item.found ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                )}
                <span>{item.skill}</span>
                {!item.found && onAddSkillToResume && (
                  <button
                    type="button"
                    title="Add this skill to your resume profile"
                    onClick={() => onAddSkillToResume(item.skill)}
                    className="ml-1 text-red-800 hover:text-black font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BONUS / SECONDARY SKILLS */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Bonus & Secondary Stack
            </span>
            <span className="text-xs font-bold text-gray-700">
              {matchResult.matchedBonusCount} of {matchResult.totalBonuses} Found
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matchResult.bonusSkills.map((item, idx) => (
              <div
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  item.found
                    ? 'bg-white text-black border-gray-300 font-semibold'
                    : 'bg-white text-gray-500 border-dashed border-gray-300'
                }`}
              >
                {item.found ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                ) : (
                  <span className="text-gray-400">+</span>
                )}
                <span>{item.skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TAILORING RECOMMENDATIONS */}
      {matchResult.tailoringAdvice.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span>Target Role Optimization Recommendations</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-amber-900 leading-relaxed">
            {matchResult.tailoringAdvice.map((advice, i) => (
              <li key={i}>{advice}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
