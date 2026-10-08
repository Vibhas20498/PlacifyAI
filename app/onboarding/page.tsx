'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/store/user-context';
import { calculatePlacementProbability } from '@/lib/ml-engine';
import { ResumeUploadDropzone } from '@/components/resume/ResumeUploadDropzone';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Plus,
  X,
  Database,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Zap,
  FileText,
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python',
  'SQL',
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'FastAPI',
  'Java',
  'C++',
  'Docker',
  'Kubernetes',
  'Redis',
  'PostgreSQL',
  'MongoDB',
  'Git',
  'AWS',
  'System Design',
  'Data Structures & Algorithms',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, saveProfileToSupabase } = useUser();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [autoFilledAlert, setAutoFilledAlert] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: profile.name && profile.name !== 'Candidate' ? profile.name : '',
    email: profile.email || '',
    university: profile.isOnboarded && profile.university && profile.university !== 'Engineering Institution' ? profile.university : '',
    degree: profile.isOnboarded ? (profile.degree || '') : '',
    cgpa: profile.isOnboarded && profile.cgpa > 0 ? String(profile.cgpa) : '',
    tier: (profile.tier || 2) as 1 | 2 | 3,
    graduationYear: profile.graduationYear || 2026,
    experienceMonths: profile.isOnboarded ? (profile.experienceMonths || 0) : 0,
    targetRole: profile.targetRole || 'Fullstack Software Engineer',
    codeSignalScore: profile.isOnboarded && profile.codeSignalScore > 0 ? String(profile.codeSignalScore) : '',
    projectsCount: profile.isOnboarded && profile.projectsCount > 0 ? String(profile.projectsCount) : '',
    hasProductionDeployment: profile.isOnboarded ? (profile.hasProductionDeployment || false) : false,
    githubUrl: profile.isOnboarded ? (profile.githubUrl || '') : '',
    linkedinUrl: profile.isOnboarded ? (profile.linkedinUrl || '') : '',
    verifiedSkills: profile.isOnboarded && profile.verifiedSkills?.length > 0 ? profile.verifiedSkills : [] as string[],
  });

  // Resume Auto-Fill Extractor Handler
  const handleResumeParsed = (extracted: any, analysis: any) => {
    setFormData((prev) => {
      const mergedSkills = Array.from(new Set([...prev.verifiedSkills, ...(extracted.skills || [])]));
      return {
        ...prev,
        name: prev.name || extracted.name || '',
        university: extracted.university || prev.university,
        degree: extracted.degree || prev.degree,
        cgpa: extracted.cgpa ? String(extracted.cgpa) : prev.cgpa,
        tier: extracted.tier || prev.tier,
        graduationYear: extracted.graduationYear || prev.graduationYear,
        experienceMonths: extracted.experienceMonths || prev.experienceMonths,
        verifiedSkills: mergedSkills.length > 0 ? mergedSkills : prev.verifiedSkills,
        projectsCount: extracted.projectsCount ? String(extracted.projectsCount) : prev.projectsCount,
        hasProductionDeployment: extracted.hasProductionDeployment ?? prev.hasProductionDeployment,
        githubUrl: extracted.githubUrl || prev.githubUrl,
        linkedinUrl: extracted.linkedinUrl || prev.linkedinUrl,
      };
    });

    if (analysis?.overallScore) {
      updateProfile({ resumeAtsScore: analysis.overallScore }, false);
    }

    setAutoFilledAlert(`Auto-extracted ${extracted.skills?.length || 0} verified skills, academic credentials, and links. Review details below.`);
  };

  // Sync profile details when loaded from auth context / Supabase
  React.useEffect(() => {
    if (profile.email) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || (profile.name && profile.name !== 'Candidate' ? profile.name : ''),
        email: profile.email || prev.email,
        targetRole: prev.targetRole || profile.targetRole || 'Fullstack Software Engineer',
        university: profile.isOnboarded ? (profile.university || '') : prev.university,
        degree: profile.isOnboarded ? (profile.degree || '') : prev.degree,
        cgpa: profile.isOnboarded && profile.cgpa > 0 ? String(profile.cgpa) : prev.cgpa,
        codeSignalScore: profile.isOnboarded && profile.codeSignalScore > 0 ? String(profile.codeSignalScore) : prev.codeSignalScore,
        projectsCount: profile.isOnboarded && profile.projectsCount > 0 ? String(profile.projectsCount) : prev.projectsCount,
        githubUrl: profile.isOnboarded ? (profile.githubUrl || '') : prev.githubUrl,
        linkedinUrl: profile.isOnboarded ? (profile.linkedinUrl || '') : prev.linkedinUrl,
        verifiedSkills: profile.isOnboarded && Array.isArray(profile.verifiedSkills) ? profile.verifiedSkills : prev.verifiedSkills,
      }));
    }
  }, [profile.email, profile.name, profile.targetRole, profile.isOnboarded, profile.university, profile.degree, profile.cgpa, profile.codeSignalScore, profile.projectsCount, profile.githubUrl, profile.linkedinUrl, profile.verifiedSkills]);

  // Real-time calculation preview based on current onboarding state
  const parsedCgpa = parseFloat(formData.cgpa) || 7.5;
  const parsedCodeSignal = parseInt(formData.codeSignalScore) || 500;
  const parsedProjects = parseInt(formData.projectsCount) || 0;
  const parsedExp = Number(formData.experienceMonths) || 0;

  const liveProb = calculatePlacementProbability({
    cgpa: parsedCgpa,
    codeSignalScore: parsedCodeSignal,
    verifiedSkills: formData.verifiedSkills,
    projectsCount: parsedProjects,
    hasProductionDeployment: formData.hasProductionDeployment,
    experienceMonths: parsedExp,
    tier: formData.tier,
    resumeAtsScore: 70,
  });

  const handleToggleSkill = (skill: string) => {
    if (formData.verifiedSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        verifiedSkills: prev.verifiedSkills.filter((s) => s !== skill),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        verifiedSkills: [...prev.verifiedSkills, skill],
      }));
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.verifiedSkills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        verifiedSkills: [...prev.verifiedSkills, customSkill.trim()],
      }));
      setCustomSkill('');
    }
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalProfile = {
        ...profile,
        ...formData,
        cgpa: parseFloat(formData.cgpa) || 7.5,
        codeSignalScore: parseInt(formData.codeSignalScore) || 500,
        projectsCount: parseInt(formData.projectsCount) || 0,
        experienceMonths: parseInt(String(formData.experienceMonths)) || 0,
        graduationYear: parseInt(String(formData.graduationYear)) || 2026,
        isOnboarded: true,
        placementProbability: liveProb.probability,
        careerReadinessScore: liveProb.readinessScore,
      };

      await updateProfile(finalProfile, true);
      router.push('/dashboard');
    } catch (err) {
      console.error('[Onboarding Submission Error]:', err);
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 border-b border-gray-200 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-black">Placify AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Profile Setup Protocol</span>
          <span className="text-xs font-bold bg-black text-white px-2.5 py-0.5 rounded-full">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Form */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              {[
                { num: 1, label: 'Academic' },
                { num: 2, label: 'Role Targets' },
                { num: 3, label: 'Skills & Work' },
                { num: 4, label: 'Benchmarks' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s.num
                        ? 'bg-black text-white ring-4 ring-gray-100'
                        : step > s.num
                        ? 'bg-gray-200 text-black'
                        : 'border border-gray-300 text-gray-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline-block font-medium ${
                      step === s.num ? 'text-black font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Academic & Personal Credentials */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Academic & Personal Credentials
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your resume to auto-fill your credentials, or enter them manually.
                  </p>
                </div>

                {/* 1-Click Fast Track Resume Dropzone */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-black uppercase tracking-wider">
                        Fast-Track: Auto-Fill Profile from Resume
                      </span>
                    </div>
                    <span className="text-xs bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-gray-600 font-semibold">
                      Optional
                    </span>
                  </div>

                  <ResumeUploadDropzone
                    compact
                    targetRole={formData.targetRole}
                    userEmail={formData.email}
                    onParsed={handleResumeParsed}
                  />

                  {autoFilledAlert && (
                    <div className="p-3 rounded-xl bg-gray-100 border border-gray-300 text-xs text-black flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                      <span>{autoFilledAlert}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or Review & Fill Manually</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">College / University Name</label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="e.g. IIT Bombay, NIT Trichy, BITS Pilani..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Degree & Branch</label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        placeholder="e.g. B.Tech in Computer Science"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Graduation Year</label>
                      <input
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">CGPA (0.0 - 10.0)</label>
                        <span className="text-xs font-bold text-black">
                          {formData.cgpa ? `${parseFloat(formData.cgpa).toFixed(1)} / 10.0` : 'Required'}
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="0.0"
                        max="10.0"
                        required
                        placeholder="e.g. 8.4"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Institutional Tier</label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: (parseInt(e.target.value) || 2) as 1 | 2 | 3 })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                      >
                        <option value={1}>Tier 1 (IIT / NIT / BITS / Top Universities)</option>
                        <option value={2}>Tier 2 (State & Autonomous Colleges)</option>
                        <option value={3}>Tier 3 (Affiliated Engineering Institutes)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.name.trim() || !formData.university.trim() || !formData.cgpa}
                    className="px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    <span>Next: Target Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Target Roles & Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Target Role & Aspirations
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Select your primary engineering specialization to benchmark against matching market syllabi.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Primary Target Role</label>
                    <select
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                    >
                      <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
                      <option value="Backend Software Engineer">Backend Software Engineer</option>
                      <option value="Frontend Software Engineer">Frontend Software Engineer</option>
                      <option value="Data Engineer / ML Engineer">Data Engineer / ML Engineer</option>
                      <option value="DevOps / Cloud Platform Engineer">DevOps / Cloud Platform Engineer</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Internship / Professional Experience (Months)</label>
                    <input
                      type="number"
                      min="0"
                      max="48"
                      value={formData.experienceMonths}
                      onChange={(e) => setFormData({ ...formData, experienceMonths: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-mono focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <span>Next: Skills & Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Verified Technical Skills & Projects */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Technical Skills & Projects
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Select competencies you are comfortable defending in technical interviews.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">Click to Select Known Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.map((skill) => {
                        const isSelected = formData.verifiedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-black text-white border border-black font-semibold'
                                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add other skill (e.g. GraphQL, Tailwind, PyTorch)..."
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSkill();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Verified Projects Count</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        value={formData.projectsCount}
                        onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                        <input
                          type="checkbox"
                          checked={formData.hasProductionDeployment}
                          onChange={(e) => setFormData({ ...formData, hasProductionDeployment: e.target.checked })}
                          className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                        />
                        <div>
                          <div className="text-xs font-bold text-black">Live Production Deployment</div>
                          <div className="text-xs text-gray-500">Live public URLs & CI/CD</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <span>Next: Coding Benchmarks</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Coding Benchmarks & Portfolio Links */}
            {step === 4 && (
              <form onSubmit={handleCompleteOnboarding} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Coding Benchmarks & Verification
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your algorithmic problem solving ratings and portfolio links.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-700">Code Signal / DSA Rating (300 - 850)</label>
                      <span className="text-xs font-bold text-black">
                        {formData.codeSignalScore ? `${formData.codeSignalScore} / 850` : 'Optional / Baseline'}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="300"
                      max="850"
                      placeholder="e.g. 680"
                      value={formData.codeSignalScore}
                      onChange={(e) => setFormData({ ...formData, codeSignalScore: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">
                      {formData.codeSignalScore
                        ? `Equivalent: ~${Math.max(0, Math.round((parseInt(formData.codeSignalScore) - 400) / 2.5))} LeetCode medium problems solved.`
                        : 'Enter your CodeSignal rating or contest percentile.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>GitHub Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/your-username"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>LinkedIn Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Saving to Supabase...' : 'Complete Profile & Launch Dashboard'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Live Calibrated AI Score Preview Card */}
          <div className="lg:col-span-4 bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-6 sticky top-24">
            <div className="space-y-1 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-black">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Live Calibration Preview</span>
              </div>
              <p className="text-xs text-gray-500">
                Calculated dynamically via multi-factor readiness scoring as you input your credentials.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Estimated Placement Probability
                </span>
                <div className="text-4xl font-extrabold tracking-tight text-black">
                  {liveProb.probability}%
                </div>
                <span className="text-xs text-gray-500 block">
                  Peer Percentile: {liveProb.peerPercentile}th
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Career Readiness Score
                </span>
                <div className="text-4xl font-extrabold tracking-tight text-black">
                  {liveProb.readinessScore}/100
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 text-xs">
                <div className="font-semibold text-black">Profile Signals Snapshot:</div>
                <div className="flex justify-between text-gray-600">
                  <span>CGPA:</span>
                  <span className="text-black font-semibold">{formData.cgpa ? `${parseFloat(formData.cgpa).toFixed(1)} / 10.0` : 'Not set'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Code Signal:</span>
                  <span className="text-black font-semibold">{formData.codeSignalScore ? `${formData.codeSignalScore}/850` : 'Not set'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Verified Skills:</span>
                  <span className="text-black font-semibold">{formData.verifiedSkills.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Production Live:</span>
                  <span className="text-black font-semibold">{formData.hasProductionDeployment ? 'Yes (+8%)' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center border-t border-gray-200 pt-3 flex items-center justify-center gap-1.5">
              <Database className="w-3 h-3" />
              <span>Direct Supabase Persistence</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 sm:px-12 text-center text-xs text-gray-500">
        PlacifyAI — Career Intelligence & Placement Precision Analytics.
      </footer>
    </div>
  );
}
