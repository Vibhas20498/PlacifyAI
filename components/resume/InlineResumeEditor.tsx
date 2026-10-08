'use client';

import React, { useState } from 'react';
import {
  Edit3,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Save,
  Check,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  DetailedResumeAnalysis,
  analyzeResumeContent,
  transformResumeBulletToImpact,
} from '@/lib/resume/analyzer';

interface InlineResumeEditorProps {
  initialAnalysis: DetailedResumeAnalysis;
  targetRole: string;
  onSaveUpdatedAnalysis?: (newAnalysis: DetailedResumeAnalysis) => void;
}

export function InlineResumeEditor({
  initialAnalysis,
  targetRole,
  onSaveUpdatedAnalysis,
}: InlineResumeEditorProps) {
  const [candidateName, setCandidateName] = useState(
    initialAnalysis.extractedProfile.name || 'Candidate Name'
  );
  const [candidateEmail, setCandidateEmail] = useState(
    initialAnalysis.extractedProfile.email || 'candidate@email.com'
  );
  const [skillsText, setSkillsText] = useState(
    initialAnalysis.checks.keywordMatch.foundSkills.join(', ') || 'React, TypeScript, Node.js, SQL, Git'
  );
  const [bullets, setBullets] = useState<string[]>(() =>
    initialAnalysis.bulletImprovements.length > 0
      ? initialAnalysis.bulletImprovements.map((b) => b.original)
      : [
          'Engineered web application microservices using React and TypeScript.',
          'Built backend REST APIs with Node.js and PostgreSQL database.',
          'Optimized database queries to improve application speed.',
        ]
  );

  const [isSaved, setIsSaved] = useState(false);

  // Compute live score based on current edits
  const currentFullText = `${candidateName}\n${candidateEmail}\nSkills: ${skillsText}\nProjects:\n${bullets.map((b) => `- ${b}`).join('\n')}`;
  const liveAnalysis = analyzeResumeContent(
    currentFullText,
    targetRole,
    initialAnalysis.fileName,
    initialAnalysis.fileSize
  );

  const scoreGain = liveAnalysis.overallScore - initialAnalysis.overallScore;

  const handleUpdateBullet = (index: number, newText: string) => {
    setBullets((prev) => {
      const copy = [...prev];
      copy[index] = newText;
      return copy;
    });
    setIsSaved(false);
  };

  const handleApplyAiRewrite = (index: number) => {
    const current = bullets[index];
    const imp = transformResumeBulletToImpact(current, index, targetRole);
    handleUpdateBullet(index, imp.improved);
  };

  const handleAddBullet = () => {
    setBullets((prev) => [
      ...prev,
      'Architected cloud deployment pipeline using Docker and GitHub Actions, ensuring 99.9% uptime.',
    ]);
    setIsSaved(false);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets((prev) => prev.filter((_, i) => i !== index));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (onSaveUpdatedAnalysis) {
      onSaveUpdatedAnalysis(liveAnalysis);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <Edit3 className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-black">
              Interactive Live Resume Editor
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-black border border-gray-300">
              Live Score Recalculator
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Edit your resume text directly and watch your ATS score and keyword match recalibrate in real time.
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Live ATS Score
            </div>
            <div className="text-xs font-bold flex items-center gap-1 justify-end">
              {scoreGain >= 0 ? (
                <span className="text-emerald-700 font-bold">+{scoreGain} pts gain</span>
              ) : (
                <span className="text-amber-700 font-bold">{scoreGain} pts</span>
              )}
            </div>
          </div>
          <div className="text-3xl font-black text-black font-mono">
            {liveAnalysis.overallScore}
          </div>
        </div>
      </div>

      {/* EDITABLE FIELDS */}
      <div className="space-y-5">
        {/* Name & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Candidate Name:</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-black font-semibold focus:border-black outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Email Address:</label>
            <input
              type="text"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-black focus:border-black outline-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">
            Technical Skills (Comma separated):
          </label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-black font-mono focus:border-black outline-none"
          />
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-0.5">
            <span>Detected: {liveAnalysis.checks.keywordMatch.matchedCount} target skills matched</span>
            <span className="text-emerald-700 font-semibold">
              Keyword Score: {liveAnalysis.checks.keywordMatch.score}%
            </span>
          </div>
        </div>

        {/* Project Bullets */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-black uppercase tracking-wider">
              Project & Experience Bullet Points ({bullets.length})
            </label>
            <button
              type="button"
              onClick={handleAddBullet}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="space-y-3">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">
                    Bullet Point {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyAiRewrite(idx)}
                      className="px-2.5 py-1 rounded-lg bg-black hover:bg-gray-800 text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Apply AI Impact Rewrite</span>
                    </button>
                    {bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={bullet}
                  onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-gray-200 text-xs text-black font-mono focus:border-black outline-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAVE BUTTON BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Edits recalibrate all 4 ATS pillars (Keywords, Metrics, Verbs, and Structure) instantly.
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Updated Analysis Saved!' : 'Save & Update ATS Score'}</span>
        </button>
      </div>
    </div>
  );
}
