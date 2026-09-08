'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { Briefcase, Building2, MapPin, CheckCircle2, XCircle, ArrowUpRight, Sparkles, Send } from 'lucide-react';

export default function JobAnalyzerPage() {
  const { jobs, profile } = useUser();
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [tailoringCover, setTailoringCover] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  const handleGenerateCoverNote = () => {
    setTailoringCover(true);
    setTimeout(() => {
      setCoverNote(
        `Dear Hiring Team at ${selectedJob.company},\n\nI am writing to express my strong interest in the ${selectedJob.title} position. With a solid foundation in ${selectedJob.matchedSkills.join(', ')} and a proven track record of reducing API latency by 95% in high-throughput backend services, I am confident in contributing immediately to your engineering workflows.\n\nMy profile demonstrates verified placement readiness of ${profile.careerReadinessScore}/100 and a strong Code Signal rating of ${profile.codeSignalScore}/850.\n\nSincerely,\n${profile.name}`
      );
      setTailoringCover(false);
    }, 800);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Job Analyzer & Match Intelligence
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Semantic alignment matrix comparing your profile with active market roles.
            </p>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Job Listings List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-black font-mono uppercase tracking-wider text-gray-500">
              Active Target Listings ({jobs.length})
            </h3>

            <div className="space-y-3">
              {jobs.map((job) => {
                const isSelected = selectedJob.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      setCoverNote('');
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-black bg-gray-50 ring-1 ring-black'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-black">{job.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{job.company}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black text-white">
                          {job.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>{job.salaryRange}</span>
                      <span className="font-mono text-[11px]">{job.postedDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Details & Semantic Gap Breakdown */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Selected Role Breakdown
                </span>
                <h2 className="text-2xl font-bold text-black mt-1">{selectedJob.title}</h2>
                <div className="text-xs font-medium text-gray-600 mt-1">
                  {selectedJob.company} — {selectedJob.location} • {selectedJob.salaryRange}
                </div>
              </div>
              <span className="text-3xl font-extrabold font-mono text-black">
                {selectedJob.matchScore}%
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-semibold text-gray-500 uppercase">Role Overview</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedJob.description}
              </p>
            </div>

            {/* Matched vs Missing Skills Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Matched Skills ({selectedJob.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.matchedSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-black">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span>Missing Gaps ({selectedJob.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.missingSkills.length > 0 ? (
                    selectedJob.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-500 line-through">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">Full 100% skill coverage!</span>
                  )}
                </div>
              </div>
            </div>

            {/* RAG Cover Note Tailor */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">RAG Application Note Generator</span>
                <button
                  onClick={handleGenerateCoverNote}
                  disabled={tailoringCover}
                  className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tailoringCover ? 'Tailoring Note...' : 'Generate Grounded Cover Note'}</span>
                </button>
              </div>

              {coverNote && (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => alert('Application submitted successfully with tailored note!')}
                      className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
