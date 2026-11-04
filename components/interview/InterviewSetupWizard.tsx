'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  Building2,
  Clock,
  HelpCircle,
  FileText,
  Sliders,
  Play,
  CheckCircle2,
  Zap,
  Mic,
  Code2,
  Target,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  InterviewConfig,
  InterviewRole,
  InterviewCompany,
  InterviewType,
  InterviewDifficulty,
} from '@/lib/interview/types';
import { UserProfile } from '@/lib/types';

interface InterviewSetupWizardProps {
  profile: UserProfile;
  onStartInterview: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const COMMON_ROLES: InterviewRole[] = [
  'Fullstack Software Engineer',
  'Software Development Engineer',
  'Backend Developer',
  'Frontend Software Engineer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Business Analyst',
];

const TARGET_COMPANIES: InterviewCompany[] = [
  'General Placement',
  'TCS',
  'Infosys',
  'Capgemini',
  'Deloitte',
  'Accenture',
  'Cognizant',
  'Wipro',
];

const INTERVIEW_TYPES: { id: InterviewType; label: string; desc: string; icon: any }[] = [
  { id: 'technical', label: 'Technical Core', desc: 'Core CS, architecture, algorithms, and stack defense', icon: Zap },
  { id: 'resume-based', label: 'Resume Grounded', desc: 'Deep dive into your actual projects, internships & skills', icon: FileText },
  { id: 'behavioral', label: 'HR & Behavioral', desc: 'STAR-method leadership, conflict, and teamwork scenarios', icon: Target },
  { id: 'coding', label: 'Live Coding Challenge', desc: 'Problem solving, time/space complexity and algorithms', icon: Code2 },
  { id: 'mixed', label: 'Full Placement Simulation', desc: 'Comprehensive mix of technical, resume, and HR rounds', icon: Sparkles },
];

export function InterviewSetupWizard({
  profile,
  onStartInterview,
  isLoading,
}: InterviewSetupWizardProps) {
  const [targetRole, setTargetRole] = useState<InterviewRole>(profile.targetRole || 'Fullstack Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  const [targetCompany, setTargetCompany] = useState<InterviewCompany>('General Placement');
  const [customCompany, setCustomCompany] = useState('');
  const [isCustomCompany, setIsCustomCompany] = useState(false);

  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  const [useAnalyzedResume, setUseAnalyzedResume] = useState(true);
  const [focusProjects, setFocusProjects] = useState(true);
  const [practiceWeakAreas, setPracticeWeakAreas] = useState(true);
  const [includeCoding, setIncludeCoding] = useState(true);
  const [feedbackTiming, setFeedbackTiming] = useState<'realistic' | 'practice'>('practice');
  const [mode, setMode] = useState<'text' | 'voice'>('text');

  const selectedRole = isCustomRole && customRole.trim() ? customRole.trim() : targetRole;
  const selectedCompany = isCustomCompany && customCompany.trim() ? customCompany.trim() : targetCompany;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const config: InterviewConfig = {
      targetRole: selectedRole,
      targetCompany: selectedCompany,
      interviewType,
      difficulty,
      questionCount,
      durationMinutes,
      useAnalyzedResume,
      focusSkills: profile.verifiedSkills || [],
      focusProjects,
      practiceWeakAreas,
      includeCoding: includeCoding || interviewType === 'coding',
      feedbackTiming,
      mode,
    };
    onStartInterview(config);
  };

  return (
    <form onSubmit={handleStart} className="space-y-8 max-w-4xl mx-auto">
      {/* Step 1: Target Role & Company */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs card-hover-lift">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
            01
          </div>
          <div>
            <h2 className="text-lg font-bold text-black font-heading">Target Role & Placement Company</h2>
            <p className="text-xs text-gray-500">
              Questions and evaluation benchmarks adapt to the company’s hiring pattern.
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Select Target Role</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ROLES.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => {
                  setTargetRole(role);
                  setIsCustomRole(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  !isCustomRole && targetRole === role
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                {role}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomRole(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isCustomRole
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              + Other Role
            </button>
          </div>
          {isCustomRole && (
            <input
              type="text"
              placeholder="e.g. Cloud Solutions Architect, DevOps Engineer"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-black focus:outline-none focus:border-black transition-colors"
              required
            />
          )}
        </div>

        {/* Company Selection */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Target Company / Placement Drive</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_COMPANIES.map((company) => (
              <button
                type="button"
                key={company}
                onClick={() => {
                  setTargetCompany(company);
                  setIsCustomCompany(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  !isCustomCompany && targetCompany === company
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                {company}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomCompany(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isCustomCompany
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              + Custom
            </button>
          </div>
          {isCustomCompany && (
            <input
              type="text"
              placeholder="e.g. Microsoft, Stripe, Uber, Goldman Sachs"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-black focus:outline-none focus:border-black transition-colors"
              required
            />
          )}
        </div>
      </div>

      {/* Step 2: Interview Type & Difficulty */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs card-hover-lift">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
            02
          </div>
          <div>
            <h2 className="text-lg font-bold text-black font-heading">Interview Type & Rigor</h2>
            <p className="text-xs text-gray-500">
              Select the interview format and difficulty level to test your readiness.
            </p>
          </div>
        </div>

        {/* Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {INTERVIEW_TYPES.map((t) => {
            const Icon = t.icon;
            const isSelected = interviewType === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setInterviewType(t.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-black bg-gray-50/80 shadow-xs ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-gray-500'}`} />
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <h3 className="text-xs font-bold text-black font-heading">{t.label}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Difficulty & Length Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as InterviewDifficulty[]).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                    difficulty === d
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
              Session Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 5, mins: 15, label: 'Quick (5 Qs)' },
                { count: 10, mins: 30, label: 'Standard (10 Qs)' },
                { count: 15, mins: 45, label: 'Full (15 Qs)' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.count}
                  onClick={() => {
                    setQuestionCount(opt.count);
                    setDurationMinutes(opt.mins);
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                    questionCount === opt.count
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Resume Grounding & Personalization */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs card-hover-lift">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
            03
          </div>
          <div>
            <h2 className="text-lg font-bold text-black font-heading">Resume Grounding & Intelligence</h2>
            <p className="text-xs text-gray-500">
              Personalize the interview using your verified skills, projects, and ATS score.
            </p>
          </div>
        </div>

        {/* Profile Verification Strip */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
              {profile.name ? profile.name.charAt(0) : 'C'}
            </div>
            <div>
              <div className="text-xs font-bold text-black flex items-center gap-2">
                <span>{profile.name || 'Candidate Profile'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ATS: {profile.resumeAtsScore || 68}/100
                </span>
              </div>
              <div className="text-[11px] text-gray-500 truncate max-w-sm">
                Skills: {profile.verifiedSkills?.slice(0, 5).join(', ') || 'Python, SQL, React'}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resume Calibrated
          </span>
        </div>

        {/* Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useAnalyzedResume}
              onChange={(e) => setUseAnalyzedResume(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-black focus:ring-black"
            />
            <div>
              <span className="text-xs font-bold text-black block">Ground in My Resume</span>
              <span className="text-[11px] text-gray-500">
                Ask questions challenging your stated projects and technologies.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={practiceWeakAreas}
              onChange={(e) => setPracticeWeakAreas(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-black focus:ring-black"
            />
            <div>
              <span className="text-xs font-bold text-black block">Probe Skill Gaps</span>
              <span className="text-[11px] text-gray-500">
                Focus on skills missing from your target role benchmarks.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCoding}
              onChange={(e) => setIncludeCoding(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-black focus:ring-black"
            />
            <div>
              <span className="text-xs font-bold text-black block">Include Algorithmic Question</span>
              <span className="text-[11px] text-gray-500">
                Integrates a live coding/complexity evaluation problem.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={mode === 'voice'}
              onChange={(e) => setMode(e.target.checked ? 'voice' : 'text')}
              className="mt-0.5 rounded border-gray-300 text-black focus:ring-black"
            />
            <div>
              <span className="text-xs font-bold text-black block flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-indigo-600" />
                <span>Enable Voice Audio Mode</span>
              </span>
              <span className="text-[11px] text-gray-500">
                Interviewer reads questions aloud and allows microphone speech input.
              </span>
            </div>
          </label>
        </div>

        {/* Feedback Timing Mode */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-black">Feedback Coaching Mode</h4>
            <p className="text-[11px] text-gray-500">Choose when evaluation scores and sample answers are revealed.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFeedbackTiming('practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                feedbackTiming === 'practice'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              Practice Mode (Immediate Coaching)
            </button>
            <button
              type="button"
              onClick={() => setFeedbackTiming('realistic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                feedbackTiming === 'realistic'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              Realistic Mode (End of Interview)
            </button>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="text-xs text-gray-500 flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Configured: {questionCount} Questions • ~{durationMinutes} Minutes</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 btn-press group"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Calibrating Interview Room...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Mock Interview</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
