'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { User, Save, CheckCircle, Plus, X, GraduationCap, Briefcase, Code, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { profile, updateProfile, addVerifiedSkill, removeVerifiedSkill } = useUser();
  const [formData, setFormData] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addVerifiedSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Career Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your academic credentials, verified skills, and career parameters.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors shadow-sm self-start sm:self-auto"
          >
            {savedSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Changes Saved!' : 'Save Profile'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 01: Core Academic & Personal Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
              <GraduationCap className="w-4 h-4 text-black" />
              <span>01 // Academic & Personal Credentials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">University / College</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">CGPA (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 02: Career Targets & Technical Metrics */}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                >
                  <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
                  <option value="Backend Software Engineer">Backend Software Engineer</option>
                  <option value="Frontend Software Engineer">Frontend Software Engineer</option>
                  <option value="Data Engineer / ML Engineer">Data Engineer / ML Engineer</option>
                  <option value="DevOps / Cloud Platform Engineer">DevOps / Cloud Platform Engineer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Code Signal Rating (300 - 850)</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={formData.codeSignalScore}
                  onChange={(e) => setFormData({ ...formData, codeSignalScore: parseInt(e.target.value) || 600 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="prodDeploy"
                  checked={formData.hasProductionDeployment}
                  onChange={(e) => setFormData({ ...formData, hasProductionDeployment: e.target.checked })}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                />
                <label htmlFor="prodDeploy" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Has Verified Production Deployment & Live CI/CD
                </label>
              </div>
            </div>
          </div>

          {/* Section 03: Skills Inventory */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
                <Code className="w-4 h-4 text-black" />
                <span>03 // Verified Skills Inventory</span>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {profile.verifiedSkills.length} verified
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.verifiedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-medium text-black"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeVerifiedSkill(skill)}
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
                placeholder="Add new skill (e.g. Docker, Redis, Kubernetes)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
