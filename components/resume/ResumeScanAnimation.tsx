'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  TrendingUp,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  RotateCcw,
  FastForward,
  ShieldCheck,
  FileText,
  Search,
  Check,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  ListFilter,
  Eye,
} from 'lucide-react';
import { DetailedResumeAnalysis } from '@/lib/resume/analyzer';

interface ResumeScanAnimationProps {
  analysis: DetailedResumeAnalysis;
  targetRole: string;
  fileName?: string;
  fileSize?: string;
  onComplete: () => void;
  onSkip: () => void;
}

interface ScanStage {
  id: number;
  name: string;
  shortName: string;
  weight: string;
  color: string;
  targetZoneId: string;
  headline: string;
  subheadline: string;
  findingBadge: string;
}

interface ParsedResumeDocument {
  name: string;
  contactItems: string[];
  summary?: string;
  skills: { category?: string; items: string[] }[];
  allFoundSkills: string[];
  experience: { title: string; subtitle?: string; date?: string; bullets: string[] }[];
  projects: { title: string; tech?: string; bullets: string[] }[];
  education: { degree: string; institution?: string; year?: string; score?: string }[];
  certifications: string[];
  rawParagraphs: string[];
}

/**
 * Parses full raw resume text into structured sections so that 100% of the resume is visible.
 */
function parseFullResumeContent(rawText: string, extractedProfile: any): ParsedResumeDocument {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const contactItems: string[] = [];
  if (extractedProfile?.email) contactItems.push(`✉️ ${extractedProfile.email}`);
  if (extractedProfile?.phone) contactItems.push(`📞 ${extractedProfile.phone}`);
  if (extractedProfile?.university) contactItems.push(`📍 ${extractedProfile.university}`);
  if (extractedProfile?.githubUrl) contactItems.push(`🐙 GitHub`);
  if (extractedProfile?.linkedinUrl) contactItems.push(`💼 LinkedIn`);

  const doc: ParsedResumeDocument = {
    name: extractedProfile?.name || (lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate Resume'),
    contactItems,
    skills: [],
    allFoundSkills: extractedProfile?.skills || [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    rawParagraphs: [],
  };

  type SectionType = 'none' | 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications';
  let currentSection: SectionType = 'none';

  const isHeader = (line: string): SectionType => {
    const l = line.toLowerCase().replace(/[:\-_#]/g, '').trim();
    if (/^(professional\s+summary|summary|profile|about\s+me|objective)$/i.test(l)) return 'summary';
    if (/^(technical\s+skills|skills\s*(&|and)?\s*abilities|core\s+competencies|skills|technologies|tools\s*(&|and)?\s*languages)$/i.test(l)) return 'skills';
    if (/^(work\s+experience|professional\s+experience|experience|employment\s+history|internships|work\s+history)$/i.test(l)) return 'experience';
    if (/^(projects|academic\s+projects|key\s+projects|personal\s+projects|technical\s+projects)$/i.test(l)) return 'projects';
    if (/^(education|academic\s+background|academics|qualifications|educational\s+qualifications)$/i.test(l)) return 'education';
    if (/^(certifications|certificates|achievements|awards|extracurricular\s+activities|leadership)$/i.test(l)) return 'certifications';
    return 'none';
  };

  let bufferBullets: string[] = [];
  let currentEntryTitle = '';
  let currentEntrySub = '';
  let currentEntryDate = '';

  const flushExperienceOrProject = () => {
    if (currentSection === 'experience' && (currentEntryTitle || bufferBullets.length > 0)) {
      doc.experience.push({
        title: currentEntryTitle || 'Software Engineering Role',
        subtitle: currentEntrySub,
        date: currentEntryDate,
        bullets: bufferBullets.length > 0 ? [...bufferBullets] : ['Executed core feature development and bug fixes.'],
      });
    } else if (currentSection === 'projects' && (currentEntryTitle || bufferBullets.length > 0)) {
      doc.projects.push({
        title: currentEntryTitle || 'Technical Project',
        tech: currentEntrySub,
        bullets: bufferBullets.length > 0 ? [...bufferBullets] : ['Built scalable software solution utilizing core tech stack.'],
      });
    }
    bufferBullets = [];
    currentEntryTitle = '';
    currentEntrySub = '';
    currentEntryDate = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const detectedSec = isHeader(line);

    if (detectedSec !== 'none') {
      flushExperienceOrProject();
      currentSection = detectedSec;
      continue;
    }

    if (currentSection === 'summary') {
      doc.summary = (doc.summary ? doc.summary + ' ' : '') + line;
    } else if (currentSection === 'skills') {
      if (line.includes(':')) {
        const [cat, itemsStr] = line.split(':');
        const items = itemsStr.split(/[,|•/]/).map((s) => s.trim()).filter(Boolean);
        doc.skills.push({ category: cat.trim(), items });
      } else {
        const items = line.split(/[,|•/]/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 0) {
          doc.skills.push({ category: 'Key Skills', items });
        }
      }
    } else if (currentSection === 'experience' || currentSection === 'projects') {
      const isBullet = /^[-•*–—\d\.\)]+\s*/.test(line);
      if (isBullet) {
        bufferBullets.push(line.replace(/^[-•*–—\d\.\)]+\s*/, '').trim());
      } else if (!currentEntryTitle) {
        currentEntryTitle = line;
      } else if (!currentEntrySub) {
        currentEntrySub = line;
      } else {
        bufferBullets.push(line);
      }
    } else if (currentSection === 'education') {
      if (line.toLowerCase().includes('b.tech') || line.toLowerCase().includes('bachelor') || line.toLowerCase().includes('degree') || line.toLowerCase().includes('university') || line.toLowerCase().includes('college')) {
        doc.education.push({
          degree: line,
          institution: extractedProfile?.university,
          score: extractedProfile?.cgpa ? `CGPA: ${extractedProfile.cgpa}/10` : undefined,
        });
      } else {
        doc.education.push({ degree: line });
      }
    } else if (currentSection === 'certifications') {
      doc.certifications.push(line.replace(/^[-•*–—\d\.\)]+\s*/, '').trim());
    } else {
      // Uncategorized lines
      if (i > 3) {
        doc.rawParagraphs.push(line);
      }
    }
  }

  flushExperienceOrProject();

  // Fallback: If no structured projects or experience were cleanly partitioned, populate from raw paragraphs & extractedProfile
  if (doc.projects.length === 0 && doc.experience.length === 0) {
    const rawBullets = lines.filter((l) => l.length > 30 && /^[-•*–—\d\.\)]+\s*/.test(l));
    if (rawBullets.length > 0) {
      doc.projects.push({
        title: 'Core Projects & Engineering Accomplishments',
        bullets: rawBullets.map((b) => b.replace(/^[-•*–—\d\.\)]+\s*/, '').trim()),
      });
    } else {
      const longLines = lines.filter((l) => l.length > 40 && !isHeader(l));
      if (longLines.length > 0) {
        doc.projects.push({
          title: 'Project Descriptions & Experience Details',
          bullets: longLines.slice(0, 10),
        });
      }
    }
  }

  // Fallback for education if empty
  if (doc.education.length === 0) {
    doc.education.push({
      degree: extractedProfile?.degree || 'Bachelor of Engineering / Technology',
      institution: extractedProfile?.university || 'University / College',
      score: extractedProfile?.cgpa ? `CGPA: ${extractedProfile.cgpa}/10` : undefined,
    });
  }

  // Fallback for skills if empty
  if (doc.skills.length === 0 && doc.allFoundSkills.length > 0) {
    doc.skills.push({
      category: 'Technical Stack',
      items: doc.allFoundSkills,
    });
  }

  return doc;
}

export function ResumeScanAnimation({
  analysis,
  targetRole,
  fileName = 'Resume_Document.pdf',
  fileSize = '180 KB',
  onComplete,
  onSkip,
}: ResumeScanAnimationProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'verbatim'>('formatted');
  const [telemetryLogs, setTelemetryLogs] = useState<
    { id: string; time: string; type: 'info' | 'success' | 'warning' | 'calc'; text: string }[]
  >([]);

  const documentContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  // Parse candidate's 100% complete resume content
  const fullDocument = parseFullResumeContent(analysis.rawText || '', analysis.extractedProfile);

  // 5 Realistic Scanning Stages
  const stages: ScanStage[] = [
    {
      id: 0,
      name: 'Document Structure & Contact Hygiene',
      shortName: '1. Contact & Structure',
      weight: '15% Weight',
      color: 'slate',
      targetZoneId: 'zone-header',
      headline: 'Checking Header Hygiene & Single-Column Structure',
      subheadline: 'Validating contact clarity, email syntax, phone format, and recruiter link parsability.',
      findingBadge: analysis.checks.structureAndContact.hasEmail
        ? '✓ Contact info & social links validated'
        : '⚠️ Missing contact details detected',
    },
    {
      id: 1,
      name: 'Core Tech Stack & Keyword Matching',
      shortName: '2. Skills & Keywords',
      weight: '35% Weight',
      color: 'emerald',
      targetZoneId: 'zone-skills',
      headline: `Evaluating Skill Matches for ${targetRole}`,
      subheadline: `Comparing detected skills against benchmark requirements (${analysis.checks.keywordMatch.matchedCount} of ${analysis.checks.keywordMatch.totalTargetCount} target skills found).`,
      findingBadge: `${analysis.checks.keywordMatch.matchedCount} Target Skills Identified`,
    },
    {
      id: 2,
      name: 'Measurable Impact & STAR Metrics',
      shortName: '3. Numbers & Metrics',
      weight: '25% Weight',
      color: 'cyan',
      targetZoneId: 'zone-projects',
      headline: 'Scanning for Quantifiable Numbers, Latency & Scale',
      subheadline: 'Locating percentages (%), user counts, performance gains, and monetary achievements.',
      findingBadge: `${analysis.checks.measurableResults.metricsFoundCount} Measurable Metrics Found`,
    },
    {
      id: 3,
      name: 'Action Verbs & Leadership Vocabulary',
      shortName: '4. Action Verbs',
      weight: '25% Weight',
      color: 'purple',
      targetZoneId: 'zone-experience',
      headline: 'Analyzing Bullet Openers for Strong Power Verbs',
      subheadline: 'Filtering out weak passive phrases ("worked on", "responsible for") in favor of execution verbs.',
      findingBadge: `${analysis.checks.actionVerbs.strongVerbsFound.length} Power Action Verbs Located`,
    },
    {
      id: 4,
      name: 'ATS Score Calibration & Synthesis',
      shortName: '5. ATS Calibration',
      weight: 'Overall Synthesis',
      color: 'amber',
      targetZoneId: 'zone-all',
      headline: 'Final ATS Calibration & Benchmark Scoring Complete',
      subheadline: `Synthesized weighted score across all 4 evaluation pillars. Score: ${analysis.overallScore}/100 (${analysis.scoreCategory}).`,
      findingBadge: `Overall Score: ${analysis.overallScore}/100`,
    },
  ];

  const currentStage = stages[currentStageIndex];

  // Stage timer sequence
  useEffect(() => {
    if (isPaused || isCompleted) return;

    const stageDurations = [1400, 1600, 1700, 1700, 1500];
    const duration = stageDurations[currentStageIndex] || 1600;

    const timer = setTimeout(() => {
      if (currentStageIndex < stages.length - 1) {
        setCurrentStageIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStageIndex, isPaused, isCompleted, stages.length]);

  // Smooth auto-scroll document to active zone
  useEffect(() => {
    if (!documentContainerRef.current) return;
    const container = documentContainerRef.current;

    let targetEl: HTMLElement | null = null;
    if (currentStageIndex === 0) targetEl = headerRef.current;
    else if (currentStageIndex === 1) targetEl = skillsRef.current;
    else if (currentStageIndex === 2) targetEl = projectsRef.current;
    else if (currentStageIndex === 3) targetEl = experienceRef.current || projectsRef.current;
    else if (currentStageIndex === 4) targetEl = headerRef.current;

    if (targetEl) {
      const topPos = targetEl.offsetTop - container.offsetTop - 20;
      container.scrollTo({
        top: Math.max(0, topPos),
        behavior: 'smooth',
      });
    }
  }, [currentStageIndex]);

  // Rolling progress percentage
  useEffect(() => {
    const targetProgress = Math.min(100, Math.round(((currentStageIndex + 1) / stages.length) * 100));
    setProgressPercent(targetProgress);
  }, [currentStageIndex, stages.length]);

  // Rolling score counter animation
  useEffect(() => {
    const targetScore =
      currentStageIndex === 0
        ? Math.round(analysis.checks.structureAndContact.score * 0.15)
        : currentStageIndex === 1
        ? Math.round(analysis.checks.structureAndContact.score * 0.15 + analysis.checks.keywordMatch.score * 0.35)
        : currentStageIndex === 2
        ? Math.round(
            analysis.checks.structureAndContact.score * 0.15 +
              analysis.checks.keywordMatch.score * 0.35 +
              analysis.checks.measurableResults.score * 0.25
          )
        : currentStageIndex === 3
        ? Math.max(analysis.overallScore - 6, 25)
        : analysis.overallScore;

    const interval = setInterval(() => {
      setDisplayedScore((prev) => {
        if (prev < targetScore) {
          return Math.min(targetScore, prev + Math.ceil((targetScore - prev) / 4) + 1);
        } else if (prev > targetScore) {
          return Math.max(targetScore, prev - 1);
        }
        return prev;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [currentStageIndex, analysis]);

  // Append telemetry logs
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getSeconds()}.${Math.floor(now.getMilliseconds() / 100)}s`;

    if (currentStageIndex === 0) {
      setTelemetryLogs([
        {
          id: 'log-0',
          time: '0.2s',
          type: 'info',
          text: `Parsed complete document structure: ${analysis.wordCount} words from "${fileName}"`,
        },
        {
          id: 'log-1',
          time: '0.6s',
          type: 'success',
          text: analysis.extractedProfile.email
            ? `Extracted candidate contact: ${analysis.extractedProfile.email}`
            : 'Evaluating contact section parsability',
        },
      ]);
    } else if (currentStageIndex === 1) {
      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: 'log-2',
          time: timeStr,
          type: 'success',
          text: `Keywords: Found ${analysis.checks.keywordMatch.matchedCount} matching skills (${analysis.checks.keywordMatch.foundSkills.slice(0, 5).join(', ') || 'Core skills'})`,
        },
      ]);
    } else if (currentStageIndex === 2) {
      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: 'log-3',
          time: timeStr,
          type: analysis.checks.measurableResults.metricsFoundCount > 0 ? 'success' : 'warning',
          text:
            analysis.checks.measurableResults.metricsFoundCount > 0
              ? `Impact: Detected ${analysis.checks.measurableResults.metricsFoundCount} quantifiable metrics (${analysis.checks.measurableResults.metricsFoundList.slice(0, 3).join(', ')})`
              : 'Impact: No percentage or scale metrics found in bullets',
        },
      ]);
    } else if (currentStageIndex === 3) {
      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: 'log-4',
          time: timeStr,
          type: 'success',
          text: `Action Verbs: Found ${analysis.checks.actionVerbs.strongVerbsFound.length} strong verbs (${analysis.checks.actionVerbs.strongVerbsFound.slice(0, 4).join(', ') || 'Active openers'})`,
        },
      ]);
    } else if (currentStageIndex === 4) {
      setTelemetryLogs((prev) => [
        ...prev,
        {
          id: 'log-5',
          time: timeStr,
          type: 'calc',
          text: `ATS Score synthesized: ${analysis.overallScore}/100 (${analysis.scoreCategory})`,
        },
      ]);
    }
  }, [currentStageIndex, analysis, fileName]);

  // Coordinates for the floating magnifier lens across stages
  const magnifierPositions = [
    { x: '25%', y: '12%', scale: 1.05 }, // Stage 0: Top Header & Contact
    { x: '65%', y: '28%', scale: 1.12 }, // Stage 1: Skills & Keywords
    { x: '35%', y: '50%', scale: 1.1 },  // Stage 2: Projects & Metrics
    { x: '70%', y: '68%', scale: 1.1 },  // Stage 3: Experience & Action Verbs
    { x: '50%', y: '45%', scale: 1.0 },  // Stage 4: Central Synthesis Sweep
  ];

  const currentLensPos = magnifierPositions[currentStageIndex] || magnifierPositions[0];

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Background glowing grid effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP SCANNER HUD BAR */}
      <div className="relative z-10 p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/20">
            <Search className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Live ATS Resume Scanner
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Scanning Full Document
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluating <strong className="text-slate-200">{fileName}</strong> ({analysis.wordCount} words) against{' '}
              <strong className="text-sky-300">{targetRole}</strong>
            </p>
          </div>
        </div>

        {/* View Mode, Stage Pills & Skip Button */}
        <div className="flex items-center flex-wrap gap-2.5 self-end md:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'formatted'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Full ATS Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('verbatim')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'verbatim'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Verbatim Document</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {stages.map((stg, idx) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => setCurrentStageIndex(idx)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  currentStageIndex === idx
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : currentStageIndex > idx
                    ? 'text-emerald-400 hover:text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {stg.id + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* STAGE PROGRESS BAR */}
      <div className="w-full bg-slate-900 h-1.5 overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"
          initial={{ width: '10%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
        />
      </div>

      {/* MAIN TWO-COLUMN INSPECTION ARENA */}
      <div className="relative z-10 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: THE COMPLETE RESUME DOCUMENT WITH FLOATING MAGNIFYING GLASS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold flex items-center gap-1.5 text-slate-300">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Full Uploaded Resume ({viewMode === 'formatted' ? 'All Sections Rendered' : 'Complete Raw Text'})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Active Focus: {currentStage.shortName}
            </span>
          </div>

          {/* SIMULATED A4 RESUME SHEET CONTAINER (Full Height with Smooth Auto-Scroll) */}
          <div
            ref={documentContainerRef}
            className="relative bg-white text-slate-900 rounded-2xl border-2 border-slate-300 shadow-2xl p-6 sm:p-8 h-[650px] overflow-y-auto select-text font-sans scroll-smooth"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#94a3b8 #f1f5f9',
            }}
          >
            {/* LASER SCANNING BEAM SWEEP */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.9)] z-20 pointer-events-none"
              animate={{
                top: ['5%', '95%', '5%'],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* FLOATING MAGNIFYING GLASS */}
            <motion.div
              className="absolute z-30 pointer-events-none"
              animate={{
                left: currentLensPos.x,
                top: currentLensPos.y,
                scale: currentLensPos.scale,
              }}
              transition={{
                type: 'spring',
                stiffness: 65,
                damping: 18,
                mass: 0.8,
              }}
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                {/* Metallic lens rim with glowing ring */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[4px] border-slate-900 bg-sky-400/10 backdrop-blur-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(56,189,248,0.4)] relative flex items-center justify-center">
                  {/* Glass highlight glare */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />

                  {/* High-tech reticle crosshairs */}
                  <div className="w-10 h-10 rounded-full border border-sky-400/40 border-dashed animate-spin flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                  </div>

                  {/* Crosshair ticks */}
                  <div className="absolute inset-x-2 top-1/2 h-[1px] bg-sky-400/30" />
                  <div className="absolute inset-y-2 left-1/2 w-[1px] bg-sky-400/30" />

                  {/* Live magnifying HUD pill floating above lens */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-sky-400/60 text-[10px] font-mono text-sky-300 font-bold shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span>INSPECTING: {progressPercent}%</span>
                  </div>
                </div>

                {/* Angled 3D Magnifier Handle */}
                <div className="absolute -bottom-9 -right-6 w-4 h-14 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full rotate-[-45deg] origin-top border border-slate-700 shadow-xl" />
              </div>
            </motion.div>

            {/* DOCUMENT CONTENTS: FORMATTED MODE */}
            {viewMode === 'formatted' ? (
              <div className="space-y-6 text-left">
                {/* 1. HEADER SECTION */}
                <div
                  ref={headerRef}
                  id="zone-header"
                  className={`p-4 rounded-xl transition-all duration-500 border ${
                    currentStageIndex === 0
                      ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400/40 shadow-sm'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
                      {fullDocument.name}
                    </h1>
                    {currentStageIndex === 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold animate-pulse">
                        Header Validated
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 font-medium flex flex-wrap gap-x-4 gap-y-1.5 mt-2 border-b border-slate-200 pb-3">
                    {fullDocument.contactItems.map((item, idx) => (
                      <span key={idx} className="font-semibold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. SUMMARY (IF PRESENT) */}
                {fullDocument.summary && (
                  <div className="space-y-1 px-4">
                    <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {fullDocument.summary}
                    </p>
                  </div>
                )}

                {/* 3. TECHNICAL SKILLS SECTION */}
                <div
                  ref={skillsRef}
                  id="zone-skills"
                  className={`p-4 rounded-xl transition-all duration-500 border space-y-2 ${
                    currentStageIndex === 1
                      ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/40 shadow-sm'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-slate-700" />
                      Technical Skills & Competencies
                    </span>
                    {currentStageIndex === 1 && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        ✓ {analysis.checks.keywordMatch.matchedCount} Target Skills Matched
                      </span>
                    )}
                  </div>

                  {fullDocument.skills.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {fullDocument.skills.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                          {group.category && group.category !== 'Key Skills' && (
                            <span className="text-[11px] font-bold text-slate-700 block">
                              {group.category}:
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {group.items.map((skill, sIdx) => {
                              const isMatchedRoleKeyword = analysis.checks.keywordMatch.foundSkills.some(
                                (f) => f.toLowerCase() === skill.toLowerCase()
                              );

                              return (
                                <span
                                  key={sIdx}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all duration-300 ${
                                    currentStageIndex === 1 && isMatchedRoleKeyword
                                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400 scale-105'
                                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fullDocument.allFoundSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all duration-300 ${
                            currentStageIndex === 1
                              ? 'bg-emerald-600 text-white shadow-sm scale-105'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. PROJECTS SECTION */}
                {fullDocument.projects.length > 0 && (
                  <div
                    ref={projectsRef}
                    id="zone-projects"
                    className={`p-4 rounded-xl transition-all duration-500 border space-y-3 ${
                      currentStageIndex === 2
                        ? 'bg-cyan-50/90 border-cyan-300 ring-2 ring-cyan-400/40 shadow-sm'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-slate-700" />
                        Projects & Portfolio ({fullDocument.projects.length} Entries)
                      </span>
                      {currentStageIndex === 2 && (
                        <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 border border-cyan-300 px-2.5 py-0.5 rounded-full">
                          Scanning STAR Metrics (%, users, latency)
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {fullDocument.projects.map((proj, pIdx) => (
                        <div key={pIdx} className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs font-bold text-slate-950">
                              {proj.title}
                            </span>
                            {proj.tech && (
                              <span className="text-[11px] text-slate-500 font-mono">
                                [{proj.tech}]
                              </span>
                            )}
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {proj.bullets.map((bullet, bIdx) => {
                              const firstWord = bullet.trim().split(/\s+/)[0] || '';
                              const rest = bullet.slice(firstWord.length);

                              return (
                                <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="text-slate-400 font-bold mt-0.5">•</span>
                                  <span>
                                    <strong
                                      className={`transition-colors duration-300 ${
                                        currentStageIndex === 3
                                          ? 'text-purple-700 bg-purple-100 px-1 rounded'
                                          : 'text-slate-900'
                                      }`}
                                    >
                                      {firstWord}
                                    </strong>
                                    <span
                                      className={
                                        currentStageIndex === 2
                                          ? 'bg-cyan-50/80 text-slate-900'
                                          : 'text-slate-700'
                                      }
                                    >
                                      {rest}
                                    </span>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. EXPERIENCE & WORK HISTORY SECTION */}
                {fullDocument.experience.length > 0 && (
                  <div
                    ref={experienceRef}
                    id="zone-experience"
                    className={`p-4 rounded-xl transition-all duration-500 border space-y-3 ${
                      currentStageIndex === 3
                        ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-400/40 shadow-sm'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-700" />
                        Experience & Employment History ({fullDocument.experience.length} Entries)
                      </span>
                      {currentStageIndex === 3 && (
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full">
                          Spotlighting Power Action Verbs
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {fullDocument.experience.map((exp, eIdx) => (
                        <div key={eIdx} className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-slate-950 block">
                                {exp.title}
                              </span>
                              {exp.subtitle && (
                                <span className="text-[11px] text-slate-600 font-medium">
                                  {exp.subtitle}
                                </span>
                              )}
                            </div>
                            {exp.date && (
                              <span className="text-[11px] text-slate-500 font-medium shrink-0">
                                {exp.date}
                              </span>
                            )}
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {exp.bullets.map((bullet, bIdx) => {
                              const firstWord = bullet.trim().split(/\s+/)[0] || '';
                              const rest = bullet.slice(firstWord.length);

                              return (
                                <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="text-slate-400 font-bold mt-0.5">•</span>
                                  <span>
                                    <strong
                                      className={`transition-colors duration-300 ${
                                        currentStageIndex === 3
                                          ? 'text-purple-700 bg-purple-100 px-1 rounded'
                                          : 'text-slate-900'
                                      }`}
                                    >
                                      {firstWord}
                                    </strong>
                                    <span
                                      className={
                                        currentStageIndex === 2
                                          ? 'bg-cyan-50/80 text-slate-900'
                                          : 'text-slate-700'
                                      }
                                    >
                                      {rest}
                                    </span>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. EDUCATION & CREDENTIALS SECTION */}
                <div
                  ref={educationRef}
                  id="zone-education"
                  className="p-4 rounded-xl border border-transparent space-y-2"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
                      Education & Academic Background
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {fullDocument.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-baseline text-xs text-slate-800">
                        <div>
                          <strong className="text-slate-950 font-bold">{edu.degree}</strong>
                          {edu.institution && (
                            <span className="text-slate-600"> — {edu.institution}</span>
                          )}
                        </div>
                        {edu.score && (
                          <span className="font-bold text-slate-900 shrink-0">{edu.score}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. CERTIFICATIONS & ACHIEVEMENTS (IF PRESENT) */}
                {fullDocument.certifications.length > 0 && (
                  <div className="p-4 rounded-xl border border-transparent space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-slate-700" />
                        Certifications & Achievements
                      </span>
                    </div>

                    <ul className="space-y-1 text-xs text-slate-700 pt-1">
                      {fullDocument.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 8. UNCATEGORIZED PARAGRAPHS (IF ANY EXTRA CONTENT REMAINS) */}
                {fullDocument.rawParagraphs.length > 0 && (
                  <div className="p-4 rounded-xl border-t border-slate-200 space-y-1 text-xs text-slate-600">
                    {fullDocument.rawParagraphs.map((para, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* VERBATIM DOCUMENT TEXT VIEW (Exact Line-by-Line Document Content) */
              <div className="space-y-2 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text p-2">
                {analysis.rawText || 'No raw document text available.'}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE TELEMETRY & EVALUATION DASHBOARD (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* CURRENT ACTIVE EVALUATION CARD */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Active Evaluation Stage
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {currentStage.weight}
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {currentStage.headline}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentStage.subheadline}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{currentStage.findingBadge}</span>
            </div>
          </div>

          {/* LIVE ATS GAUGE & 4 PILLARS BREAKDOWN */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-300">Live Calibrated ATS Score</div>
                <div className="text-[11px] text-slate-500">Continuous 4-pillar calculation</div>
              </div>

              {/* LIVE SPEEDOMETER NUMBER */}
              <div className="flex items-baseline gap-1 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-3xl font-black text-white font-mono">
                  {displayedScore}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/100</span>
              </div>
            </div>

            {/* 4 PILLARS LIVE PROGRESS BARS */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              {/* 1. Keywords (35%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">1. Role Keywords Match (35%)</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {currentStageIndex >= 1
                      ? `${analysis.checks.keywordMatch.score}%`
                      : 'Scanning...'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${currentStageIndex >= 1 ? analysis.checks.keywordMatch.score : 20}%`,
                    }}
                  />
                </div>
              </div>

              {/* 2. STAR Metrics (25%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">2. Quantifiable Impact (25%)</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {currentStageIndex >= 2
                      ? `${analysis.checks.measurableResults.score}%`
                      : 'Scanning...'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{
                      width: `${currentStageIndex >= 2 ? analysis.checks.measurableResults.score : 15}%`,
                    }}
                  />
                </div>
              </div>

              {/* 3. Action Verbs (25%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">3. Action Verbs Power (25%)</span>
                  <span className="text-purple-400 font-mono font-bold">
                    {currentStageIndex >= 3
                      ? `${analysis.checks.actionVerbs.score}%`
                      : 'Scanning...'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-purple-400 transition-all duration-500"
                    style={{
                      width: `${currentStageIndex >= 3 ? analysis.checks.actionVerbs.score : 10}%`,
                    }}
                  />
                </div>
              </div>

              {/* 4. Structure & Contact (15%) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">4. Structure & Parsability (15%)</span>
                  <span className="text-slate-300 font-mono font-bold">
                    {currentStageIndex >= 0
                      ? `${analysis.checks.structureAndContact.score}%`
                      : 'Scanning...'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-slate-300 transition-all duration-500"
                    style={{
                      width: `${analysis.checks.structureAndContact.score}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME TELEMETRY EVENT STREAM */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>SCANNER TELEMETRY LOG</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px] pr-1">
              {telemetryLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-slate-300 leading-tight">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-300'
                        : log.type === 'warning'
                        ? 'text-amber-300'
                        : log.type === 'calc'
                        ? 'text-sky-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL REVEAL ACTION BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onComplete}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 hover:brightness-110 animate-bounce'
                  : 'bg-white text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isCompleted
                  ? 'View Full ATS Report & Bullet Point Rewrites'
                  : 'Proceed to Full Results'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
