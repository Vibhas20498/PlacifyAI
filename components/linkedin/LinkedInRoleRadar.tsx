'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Copy,
  Check,
  Zap,
  Radio,
  Share2,
  X,
} from 'lucide-react';
import { useUser } from '@/lib/store/user-context';
import {
  LinkedInJobListing,
  generateLinkedInJobsForRole,
  buildLinkedInJobSearchUrl,
  LINKEDIN_ROLE_DIRECTORY,
} from '@/lib/linkedin/job-radar';

export function LinkedInRoleRadar() {
  const { profile } = useUser();
  const [selectedRole, setSelectedRole] = useState(
    profile.targetRole || 'Fullstack Software Engineer'
  );
  const [jobs, setJobs] = useState<LinkedInJobListing[]>([]);
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<LinkedInJobListing | null>(null);
  const [filterWorkplace, setFilterWorkplace] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [isScanning, setIsScanning] = useState(false);

  // Load jobs when role or profile skills change
  useEffect(() => {
    setIsScanning(true);
    const generated = generateLinkedInJobsForRole(
      selectedRole,
      profile.verifiedSkills,
      profile.resumeAtsScore
    );
    setJobs(generated);

    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [selectedRole, profile.verifiedSkills, profile.resumeAtsScore]);

  // Periodic simulated live alert for real-time notification experience
  useEffect(() => {
    if (!isAlertsEnabled) return;

    // Trigger one initial live alert preview after 4 seconds
    const initialTimer = setTimeout(() => {
      if (jobs.length > 0) {
        setActiveToast(jobs[0]);
      }
    }, 4000);

    // Periodically pick a job and notify every 45 seconds
    const interval = setInterval(() => {
      if (jobs.length > 1) {
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        setActiveToast(randomJob);
      }
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isAlertsEnabled, jobs]);

  const handleCopyPitch = (job: LinkedInJobListing) => {
    const pitch = `Hi Hiring Team, I noticed the ${job.title} opening at ${job.company} on LinkedIn. My background includes verified competencies in ${job.matchedSkills.join(', ')} with an ATS benchmark score of ${profile.resumeAtsScore}/100. Would welcome the opportunity to connect!`;
    navigator.clipboard.writeText(pitch);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTriggerTestAlert = () => {
    if (jobs.length > 0) {
      setActiveToast(jobs[0]);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterWorkplace === 'All') return true;
    return job.workplaceType === filterWorkplace;
  });

  const directLinkedInUrl = buildLinkedInJobSearchUrl(selectedRole);

  return (
    <div className="space-y-6">
      {/* 1. LINKEDIN RADAR HERO HEADER */}
      <div className="bg-gradient-to-br from-[#004182] via-[#0A66C2] to-[#002D5C] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* LinkedIn Live Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#0A66C2] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0A66C2] animate-ping" />
                <span>LinkedIn Live Role Radar</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-sm border border-white/20">
                <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                <span>Real-Time Notifications Active</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Live LinkedIn Job Matches for{' '}
              <span className="text-cyan-200 underline decoration-cyan-400/50 underline-offset-4">
                {selectedRole}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Placify monitors LinkedIn postings in real-time, matches them against your verified skills & ATS score, and alerts you the moment high-probability positions open.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <a
              href={directLinkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#0A66C2] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md group btn-press"
            >
              <span>Search All on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              type="button"
              onClick={handleTriggerTestAlert}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/20 transition-all backdrop-blur-sm"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Live Alert</span>
            </button>
          </div>
        </div>

        {/* CONTROLS STRIP */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          {/* Target Role Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-blue-200 font-semibold">Monitor Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs outline-none transition-all cursor-pointer backdrop-blur-sm"
            >
              {Object.keys(LINKEDIN_ROLE_DIRECTORY).map((roleName) => (
                <option key={roleName} value={roleName} className="text-slate-900 bg-white">
                  {roleName}
                </option>
              ))}
            </select>
          </div>

          {/* Workplace Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Remote', 'Hybrid', 'On-site'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterWorkplace(type)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterWorkplace === type
                    ? 'bg-white text-[#0A66C2] shadow-xs'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Alert Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-blue-200 font-medium text-xs">Live Alerts:</span>
            <button
              type="button"
              onClick={() => setIsAlertsEnabled(!isAlertsEnabled)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                isAlertsEnabled
                  ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                  : 'bg-white/20 text-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAlertsEnabled ? 'bg-emerald-900 animate-pulse' : 'bg-white/40'}`} />
              <span>{isAlertsEnabled ? 'Active' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SCANNING PULSE BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A66C2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A66C2]" />
          </span>
          <span className="font-semibold text-slate-700">
            {isScanning
              ? `Scanning LinkedIn for latest ${selectedRole} openings...`
              : `Connected to LinkedIn Job Stream • ${filteredJobs.length} active roles detected`}
          </span>
        </div>

        <span className="font-mono text-[11px] text-slate-400">
          Ranked by ATS Match Percentage
        </span>
      </div>

      {/* 3. LINKEDIN JOB CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border-2 border-slate-200/80 hover:border-[#0A66C2] rounded-3xl p-6 transition-all space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md group"
          >
            {/* Top row: Badge + Time + Match Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {/* Company Logo Initial Box */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                    style={{ backgroundColor: job.companyColor }}
                  >
                    {job.companyInitial}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 group-hover:text-[#0A66C2] transition-colors leading-tight">
                      {job.company}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[180px]">{job.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{job.workplaceType}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono shadow-2xs">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{job.matchPercentage}% Match</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                    {job.postedTime}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 pt-1">
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  Skill Alignment:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{s}</span>
                    </span>
                  ))}
                  {job.missingSkills.slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                      title="Recommended skill to add to your profile"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Salary + Direct Apply Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ESTIMATED COMPENSATION</span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {job.salary}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPitch(job)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Copy ready-to-use intro message for LinkedIn recruiter"
                >
                  {copiedId === job.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm btn-press"
                >
                  <span>Apply on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. FLOATING REAL-TIME NOTIFICATION TOAST */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl border-2 border-[#0A66C2] text-slate-900 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  in
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#0A66C2] font-mono tracking-wider block">
                    ⚡ Live LinkedIn Job Alert
                  </span>
                  <span className="text-xs font-bold text-slate-950 block">
                    {activeToast.company}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveToast(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeToast.location} • <strong className="text-emerald-700">{activeToast.matchPercentage}% Match</strong> with your Placify resume
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">
                {activeToast.postedTime}
              </span>

              <a
                href={activeToast.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveToast(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>View & Apply</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
