'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import {
  User,
  Save,
  CheckCircle2,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  Code,
  Sparkles,
  Globe,
  Github,
  Linkedin,
  ShieldCheck,
  RefreshCw,
  Sliders,
  TrendingUp,
  Database,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, updateProfile, isSavingProfile, addVerifiedSkill, removeVerifiedSkill } = useUser();
  const [formData, setFormData] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sync formData when profile changes externally (e.g. Supabase hydration)
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateProfile(formData, true);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skillName = newSkill.trim();
      addVerifiedSkill(skillName);
      setFormData((prev) => ({
        ...prev,
        verifiedSkills: prev.verifiedSkills.includes(skillName)
          ? prev.verifiedSkills
          : [...prev.verifiedSkills, skillName],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    removeVerifiedSkill(skillToRemove);
    setFormData((prev) => ({
      ...prev,
      verifiedSkills: prev.verifiedSkills.filter((s) => s !== skillToRemove),
    }));
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Candidate Career Profile
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-gray-100 border border-gray-200 text-black">
                <Database className="w-3 h-3 text-black" />
                Supabase Synced
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Configure your academic credentials, verified skills, and technical signals for precision placement prediction.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saveStatus === 'saving' || isSavingProfile}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm self-start sm:self-auto ${
              saveStatus === 'saved'
                ? 'bg-gray-100 text-black border border-gray-300'
                : 'bg-black text-white hover:bg-gray-800 disabled:opacity-50'
            }`}
          >
            {saveStatus === 'saving' || isSavingProfile ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle2 className="w-4 h-4 text-black" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {saveStatus === 'saving' || isSavingProfile
                ? 'Saving to Supabase...'
                : saveStatus === 'saved'
                ? 'Profile Saved!'
                : 'Save Profile Changes'}
            </span>
          </button>
        </div>

        {/* Live Placement Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-wider">
              Calibrated Probability
            </span>
            <div className="text-2xl font-bold font-mono text-black">
              {profile.placementProbability}%
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-wider">
              Career Readiness Index
            </span>
            <div className="text-2xl font-bold font-mono text-black">
              {profile.careerReadinessScore}/100
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-wider">
              Verified Skills Count
            </span>
            <div className="text-2xl font-bold font-mono text-black">
              {profile.verifiedSkills.length} Competencies
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 01: Personal & Academic Credentials */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
              <GraduationCap className="w-4 h-4 text-black" />
              <span>01 // Academic & Personal Credentials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email Address (Registered Account)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 font-mono text-gray-700 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">University / College</label>
                <input
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g. IIT Bombay, NIT Trichy, BITS Pilani..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Institution Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: (parseInt(e.target.value) || 2) as 1 | 2 | 3 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                  >
                    <option value={1}>Tier 1 (IIT / NIT / Top Universities)</option>
                    <option value={2}>Tier 2 (State & Autonomous Colleges)</option>
                    <option value={3}>Tier 3 (Affiliated Institutes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Experience (Months)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.experienceMonths}
                    onChange={(e) => setFormData({ ...formData, experienceMonths: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02: Target Role & Technical Benchmarks */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
              <Briefcase className="w-4 h-4 text-black" />
              <span>02 // Target Role & Technical Benchmarks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Target Role Title</label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                >
                  <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
                  <option value="Backend Software Engineer">Backend Software Engineer</option>
                  <option value="Frontend Software Engineer">Frontend Software Engineer</option>
                  <option value="Data Engineer / ML Engineer">Data Engineer / ML Engineer</option>
                  <option value="DevOps / Cloud Platform Engineer">DevOps / Cloud Platform Engineer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Code Signal / DSA Rating (300 - 850)</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={formData.codeSignalScore}
                  onChange={(e) => setFormData({ ...formData, codeSignalScore: parseInt(e.target.value) || 600 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Verified Projects Count</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.projectsCount}
                  onChange={(e) => setFormData({ ...formData, projectsCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Resume ATS Base Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.resumeAtsScore}
                  onChange={(e) => setFormData({ ...formData, resumeAtsScore: parseInt(e.target.value) || 65 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                  <input
                    type="checkbox"
                    checked={formData.hasProductionDeployment}
                    onChange={(e) => setFormData({ ...formData, hasProductionDeployment: e.target.checked })}
                    className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                  />
                  <div>
                    <div className="text-xs font-bold text-black">
                      Verified Production Deployment & Automated CI/CD
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Projects feature public live URLs, Docker containers, and GitHub Actions pipelines (+8% ML probability boost).
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 03: Portfolio Links & External Handles */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
              <Globe className="w-4 h-4 text-black" />
              <span>03 // Portfolio & Repositories</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-black" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-black" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 04: Skills Inventory */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
                <Code className="w-4 h-4 text-black" />
                <span>04 // Verified Technical Skills Inventory</span>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {formData.verifiedSkills.length} competencies
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.verifiedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-medium text-black"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new skill (e.g. Docker, Redis, Kubernetes, Next.js, PyTorch)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
