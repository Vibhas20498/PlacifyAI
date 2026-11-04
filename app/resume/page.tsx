'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AnimatedTabs, TabItem } from '@/components/ui/AnimatedTabs';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { ResumeUploadDropzone } from '@/components/resume/ResumeUploadDropzone';
import {
  analyzeResumeContent,
  rewriteBulletSentence,
  DetailedResumeAnalysis,
  ROLE_KEYWORD_BENCHMARKS,
} from '@/lib/resume/analyzer';
import { parseResumeText } from '@/lib/resume/parser';
import { generateRAGResumeAnalysis } from '@/lib/rag-engine/resume-rag-service';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  Target,
  Copy,
  Check,
  TrendingUp,
  Sliders,
  HelpCircle,
  Briefcase,
  Layers,
  Wand2,
  PlusCircle,
  FileCode,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Search,
  Eye,
  Edit3,
  History,
  Download,
  Printer,
  ShieldCheck,
  Brain,
  Key,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

import { ResumeScanAnimation } from '@/components/resume/ResumeScanAnimation';
import { JobDescriptionMatcher } from '@/components/resume/JobDescriptionMatcher';
import { AtsPdfExportModal } from '@/components/resume/AtsPdfExportModal';
import { ResumeHeatmapOverlay } from '@/components/resume/ResumeHeatmapOverlay';
import { BuzzwordScannerCard } from '@/components/resume/BuzzwordScannerCard';
import { MultiToneRewriterCard } from '@/components/resume/MultiToneRewriterCard';
import { InlineResumeEditor } from '@/components/resume/InlineResumeEditor';
import { ResumeVersionComparator } from '@/components/resume/ResumeVersionComparator';
import { EcosystemBridgeCards } from '@/components/resume/EcosystemBridgeCards';
import { RagIntelligenceCard } from '@/components/resume/RagIntelligenceCard';

const RESUME_TABS: TabItem[] = [
  { id: 'rag-intelligence', label: 'AI Intelligence', icon: Brain, badge: 'AI' },
  { id: 'overview', label: 'Overview & 4 Pillars', icon: Layers },
  { id: 'jd-match', label: 'Target JD Matcher', icon: Briefcase },
  { id: 'heatmap', label: 'Recruiter Heatmap', icon: Eye },
  { id: 'rewriter', label: 'Multi-Tone Rewriter', icon: Wand2 },
  { id: 'buzzwords', label: 'Buzzword Audit', icon: ShieldCheck },
  { id: 'editor', label: 'Live Resume Editor', icon: Edit3 },
  { id: 'versions', label: 'Version History', icon: History },
];

const INPUT_TABS: TabItem[] = [
  { id: 'upload', label: 'Upload File (PDF / Word)', icon: Upload },
  { id: 'paste', label: 'Paste Text Directly', icon: FileText },
];

export default function ResumeAnalyzerPage() {
  const { profile, updateResumeAts, updateProfile } = useUser();

  // Input & state controls
  const [selectedRole, setSelectedRole] = useState(profile.targetRole || 'Fullstack Software Engineer');
  const [inputTab, setInputTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<
    'rag-intelligence' | 'overview' | 'jd-match' | 'heatmap' | 'rewriter' | 'buzzwords' | 'editor' | 'versions'
  >('rag-intelligence');

  const [analysis, setAnalysis] = useState<DetailedResumeAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive bullet point rewriter state
  const [userBulletInput, setUserBulletInput] = useState('');
  const [isRewritingBullet, setIsRewritingBullet] = useState(false);
  const [rewrittenBulletResult, setRewrittenBulletResult] = useState<{
    original: string;
    suggestions: { title: string; rewritten: string; explanation: string }[];
  } | null>(null);

  // Bullet improvements dynamic AI overrides
  const [overrideImprovements, setOverrideImprovements] = useState<
    Record<string, { improved: string; actionVerb?: string; why?: string }>
  >({});
  const [isRegeneratingImprovement, setIsRegeneratingImprovement] = useState<Record<string, boolean>>({});
  const [serverAIProvider, setServerAIProvider] = useState<'gemini' | 'openai' | 'groq' | 'none'>('none');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSavedToProfile, setIsSavedToProfile] = useState(false);

  // Check backend AI configuration status
  useEffect(() => {
    fetch('/api/resume/ai-rewrite')
      .then((res) => res.json())
      .then((data) => {
        if (data?.provider) setServerAIProvider(data.provider);
      })
      .catch(() => {});
  }, []);

  // Auto-generate RAG reasoning if missing
  useEffect(() => {
    if (analysis && !analysis.ragAnalysis && (analysis.rawText || pastedText)) {
      const text = analysis.rawText || pastedText;
      const parsedEnt = parseResumeText(text);
      generateRAGResumeAnalysis({
        rawText: text,
        parsedEntities: parsedEnt,
        deterministicAnalysis: analysis,
        targetRole: selectedRole,
      }).then((rag) => {
        setAnalysis((prev) => (prev ? { ...prev, ragAnalysis: rag } : prev));
      });
    }
  }, [analysis, selectedRole, pastedText]);

  // Handle file dropzone completion
  const handleFileParsed = async (
    extracted: any,
    rawAnalysis: any,
    detailedAnalysis?: DetailedResumeAnalysis,
    fullText?: string
  ) => {
    let detailed: DetailedResumeAnalysis;
    if (detailedAnalysis) {
      detailed = detailedAnalysis;
    } else {
      const textToAnalyze = fullText || extracted.rawText || '';
      detailed = analyzeResumeContent(
        textToAnalyze,
        selectedRole,
        rawAnalysis?.fileName || 'uploaded-resume.pdf',
        rawAnalysis?.fileSize || '180 KB'
      );
    }

    if (!detailed.ragAnalysis && (fullText || detailed.rawText)) {
      const text = fullText || detailed.rawText;
      const parsedEnt = parseResumeText(text);
      detailed.ragAnalysis = await generateRAGResumeAnalysis({
        rawText: text,
        parsedEntities: parsedEnt,
        deterministicAnalysis: detailed,
        targetRole: selectedRole,
      });
    }

    setAnalysis(detailed);
    setIsScanning(true);
    updateResumeAts(detailed.overallScore);
    setIsSavedToProfile(false);
  };

  // Handle pasted text submission
  const handleAnalyzePastedText = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      setErrorMessage('Please paste at least a few sentences of your resume (minimum 50 characters).');
      return;
    }
    setErrorMessage('');
    setIsAnalyzingText(true);

    try {
      const detailed = analyzeResumeContent(
        pastedText,
        selectedRole,
        'Pasted Resume Text',
        `${Math.round(pastedText.length / 1000)} KB`
      );
      const parsedEnt = parseResumeText(pastedText);
      const ragAnalysis = await generateRAGResumeAnalysis({
        rawText: pastedText,
        parsedEntities: parsedEnt,
        deterministicAnalysis: detailed,
        targetRole: selectedRole,
      });
      detailed.ragAnalysis = ragAnalysis;

      setAnalysis(detailed);
      setIsAnalyzingText(false);
      setIsScanning(true);
      setIsSavedToProfile(false);
      updateResumeAts(detailed.overallScore);
    } catch (err) {
      console.error(err);
      setIsAnalyzingText(false);
    }
  };

  // Handle interactive bullet point rewriting with AI
  const handleRewriteBullet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userBulletInput.trim()) return;
    setIsRewritingBullet(true);

    try {
      const res = await fetch('/api/resume/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: userBulletInput,
          targetRole: selectedRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        const r = data.result;
        const providerName =
          r.aiProvider === 'gemini'
            ? 'Google Gemini AI'
            : r.aiProvider === 'openai'
            ? 'OpenAI GPT-4o'
            : r.aiProvider === 'groq'
            ? 'Groq Llama 3.3'
            : 'Placify AI Synthesizer';

        // Also get multi-tone suggestion for comparison
        const multi = rewriteBulletSentence(userBulletInput);

        setRewrittenBulletResult({
          original: r.original,
          suggestions: [
            {
              title: `Primary AI Accomplishment (${providerName})`,
              rewritten: r.correctedBullet,
              explanation: `${r.whyItWorked} (Metric: ${r.metricAdded})`,
            },
            ...multi.suggestions.slice(0, 1).map((s) => ({
              title: `Alternative Framing: ${s.title}`,
              rewritten: s.rewritten,
              explanation: s.explanation,
            })),
          ],
        });
      } else {
        const local = rewriteBulletSentence(userBulletInput);
        setRewrittenBulletResult(local);
      }
    } catch (err) {
      console.error('Error rewriting bullet with AI:', err);
      const local = rewriteBulletSentence(userBulletInput);
      setRewrittenBulletResult(local);
    } finally {
      setIsRewritingBullet(false);
    }
  };

  // Regenerate an individual bullet improvement using the AI API
  const handleRegenerateImprovement = async (id: string, original: string) => {
    setIsRegeneratingImprovement((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/resume/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: original,
          targetRole: selectedRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.correctedBullet) {
        setOverrideImprovements((prev) => ({
          ...prev,
          [id]: {
            improved: data.result.correctedBullet,
            actionVerb: data.result.actionVerb,
            why: `${data.result.whyItWorked} (Metric: ${data.result.metricAdded})`,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to regenerate improvement with AI:', err);
    } finally {
      setIsRegeneratingImprovement((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Save detected skills and score to user profile
  const handleSaveToProfile = async () => {
    if (!analysis) return;
    try {
      const newSkills = Array.from(new Set([...profile.verifiedSkills, ...analysis.checks.keywordMatch.foundSkills]));
      await updateProfile(
        {
          verifiedSkills: newSkills,
          resumeAtsScore: analysis.overallScore,
        },
        true
      );
      setIsSavedToProfile(true);
      setTimeout(() => setIsSavedToProfile(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResetAnalysis = () => {
    setAnalysis(null);
    setIsScanning(false);
    setPastedText('');
    setRewrittenBulletResult(null);
    setUserBulletInput('');
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Resume Analyzer & ATS Optimizer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Evaluate your resume against target job requirements, discover missing keywords, and get stronger bullet points.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {serverAIProvider === 'gemini'
                  ? 'AI Engine: Active'
                  : serverAIProvider === 'openai'
                  ? 'AI Engine: OpenAI (Active)'
                  : 'AI Engine: Active (Ready-to-Paste)'}
              </span>
            </div>

            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Target Role:</span>
            <select
              value={selectedRole}
              onChange={async (e) => {
                const newRole = e.target.value;
                setSelectedRole(newRole);
                if (analysis) {
                  const textToAnalyze = analysis.rawText || pastedText || '';
                  const reAnalysis = analyzeResumeContent(
                    textToAnalyze,
                    newRole,
                    analysis.fileName,
                    analysis.fileSize
                  );
                  const parsedEnt = parseResumeText(textToAnalyze);
                  const rag = await generateRAGResumeAnalysis({
                    rawText: textToAnalyze,
                    parsedEntities: parsedEnt,
                    deterministicAnalysis: reAnalysis,
                    targetRole: newRole,
                  });
                  reAnalysis.ragAnalysis = rag;
                  setAnalysis(reAnalysis);
                  updateResumeAts(reAnalysis.overallScore);
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-black focus:border-black outline-none shadow-2xs"
            >
              <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
              <option value="Backend Software Engineer">Backend Software Engineer</option>
              <option value="Frontend Software Engineer">Frontend Software Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Power BI / Data Visualization">Power BI / Data Visualization</option>
              <option value="Data Engineer / ML Engineer">Data Engineer / ML Engineer</option>
              <option value="DevOps / Cloud Platform Engineer">DevOps / Cloud Platform Engineer</option>
            </select>
          </div>
        </div>

        {/* INPUT SECTION: Upload or Paste Resume */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-black">
                {analysis ? 'Analyzed Document' : 'Step 1: Provide Your Resume'}
              </h2>
              <p className="text-xs text-gray-500">
                {analysis
                  ? `Showing results for ${analysis.fileName} (${analysis.wordCount} words)`
                  : 'Choose how you want to check your resume'}
              </p>
            </div>

            {/* Switch tabs if not analyzed */}
            {!analysis && (
              <AnimatedTabs
                tabs={INPUT_TABS}
                activeTab={inputTab}
                onChange={(id) => setInputTab(id as 'upload' | 'paste')}
                layoutId="resumeInputTab"
                variant="pills"
              />
            )}

            {analysis && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ATS PDF</span>
                </button>
                {!isScanning && (
                  <button
                    type="button"
                    onClick={() => setIsScanning(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Search className="w-3.5 h-3.5 text-black" />
                    <span>Watch Scanner Animation</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetAnalysis}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all"
                >
                  Analyze Different Resume
                </button>
              </div>
            )}
          </div>

          {/* Form / Dropzone if not analyzed */}
          {!analysis && (
            <div>
              {inputTab === 'upload' ? (
                <ResumeUploadDropzone
                  targetRole={selectedRole}
                  userEmail={profile.email}
                  onParsed={handleFileParsed}
                />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Paste Your Resume Text (or Project Bullet Points)
                    </label>
                    <textarea
                      rows={8}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your education, skills, work experience, and project descriptions here..."
                      className="w-full p-4 rounded-2xl border border-gray-200 text-xs text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAnalyzePastedText}
                      disabled={isAnalyzingText || !pastedText.trim()}
                      className="px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      {isAnalyzingText ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>{isAnalyzingText ? 'Analyzing Resume...' : 'Analyze Resume'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LIVE SCANNER ANIMATION (Shown immediately upon upload/parsing or on replay) */}
        {analysis && isScanning && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ResumeScanAnimation
              analysis={analysis}
              targetRole={selectedRole}
              fileName={analysis.fileName}
              fileSize={analysis.fileSize}
              onComplete={() => setIsScanning(false)}
              onSkip={() => setIsScanning(false)}
            />
          </div>
        )}

        {/* EMPTY STATE (Before uploading/pasting resume) */}
        {!analysis && (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto shadow-2xs">
              <FileText className="w-7 h-7 text-black" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-black">No Resume Analyzed Yet</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upload your resume file or paste text above to get an instant breakdown of your score, missing skills for <strong>{selectedRole}</strong>, and tips to make your project bullets stand out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left pt-2">
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-black flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-black" />
                  <span>Keyword Check</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Find out which required technical skills are present or missing.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-black flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-black" />
                  <span>Impact & Numbers</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Check if your project bullets have measurable numbers and percentages.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-black flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-black" />
                  <span>Bullet Improver</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Transform weak, passive bullet points into strong accomplishment statements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SECTION (Rendered only when a real resume is analyzed and not actively scanning) */}
        {analysis && !isScanning && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* SCORE HERO BANNER */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Overall Resume Score
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                        analysis.overallScore >= 80
                          ? 'bg-black text-white'
                          : analysis.overallScore >= 65
                          ? 'bg-gray-100 text-black border border-gray-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {analysis.scoreCategory} ({analysis.overallScore}/100)
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 max-w-xl leading-relaxed">
                    {analysis.summaryText}
                  </p>
                </div>

                {/* Score Number Gauge & Quick Action */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center gap-4 bg-gray-50/90 px-6 py-4 rounded-2xl border border-gray-200 self-start md:self-auto card-hover-lift shadow-2xs">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          className="text-black"
                          strokeWidth="3.5"
                          strokeDasharray={`${analysis.overallScore}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${analysis.overallScore}, 100` }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AnimatedCounter
                          value={analysis.overallScore}
                          className="text-sm font-extrabold text-black"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <AnimatedCounter
                          value={analysis.overallScore}
                          className="text-3xl font-black text-black tracking-tight"
                        />
                        <span className="text-base font-semibold text-gray-400">/100</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        ATS Evaluated
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1.5 transition-colors pt-0.5 group"
                  >
                    <Printer className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                    <span>Export ATS Resume PDF</span>
                  </button>
                </div>
              </div>

              {/* GUIDED REVIEW SEQUENCE: WHAT TO READ FIRST */}
              <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-sm font-extrabold text-white font-heading uppercase tracking-wider">
                      Recommended Review Sequence • What to Read First
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    3 HIGH-IMPACT STEPS
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Step 1: Fix Blockers */}
                  <button
                    type="button"
                    onClick={() => setAnalysisTab('rag-intelligence')}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/80 text-left transition-all group card-hover-lift"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        Priority 1 • Start Here
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                      Fix Urgent Score Blockers
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Resolve the {analysis.checks.actionVerbs.weakPhrasesFound.length + (analysis.checks.measurableResults.metricsFoundCount === 0 ? 1 : 0)} critical ATS flags dragging your score down.
                    </p>
                  </button>

                  {/* Step 2: Apply Rewritten Bullets */}
                  <button
                    type="button"
                    onClick={() => setAnalysisTab('rewriter')}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/80 text-left transition-all group card-hover-lift"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Priority 2 • Fast Wins
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Copy Optimized Bullet Points
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Replace passive sentences with high-impact, quantifiable accomplishment statements.
                    </p>
                  </button>

                  {/* Step 3: Match Role Keywords */}
                  <button
                    type="button"
                    onClick={() => setAnalysisTab('jd-match')}
                    className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/80 text-left transition-all group card-hover-lift"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Priority 3 • Screening
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Target Job (JD) Matcher
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Inject {analysis.checks.keywordMatch.missingSkills.slice(0, 3).join(', ') || 'essential skills'} into your profile & projects.
                    </p>
                  </button>
                </div>

                {/* Top Action Items Checklist */}
                {analysis.keyActionItems.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block font-mono">
                      Quick Action Summary:
                    </span>
                    <ul className="space-y-1">
                      {analysis.keyActionItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Profile Save Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-gray-500">
                  Detected <strong>{analysis.checks.keywordMatch.foundSkills.length} skills</strong> ready to sync with your candidate profile.
                </div>
                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSavedToProfile
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isSavedToProfile ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved to Your Profile!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Score & Skills to My Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ADVANCED 8-FEATURE TOOL NAVIGATION TABS */}
            <AnimatedTabs
              tabs={RESUME_TABS}
              activeTab={analysisTab}
              onChange={(id) => setAnalysisTab(id)}
              layoutId="resumeAnalysisTab"
              variant="pills"
              className="w-full"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={analysisTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* TAB CONTENT 0: RAG INTELLIGENCE & REASONING LAYER */}
                {analysisTab === 'rag-intelligence' && (
              <div className="animate-in fade-in duration-200">
                {analysis.ragAnalysis ? (
                  <RagIntelligenceCard
                    ragAnalysis={analysis.ragAnalysis}
                    targetRole={selectedRole}
                  />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-black" />
                    <p className="text-sm font-semibold text-black">
                      Synthesizing AI Career Intelligence & Hiring Benchmarks...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 1: OVERVIEW & 4 PILLARS & BULLET REWRITES */}
            {analysisTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* SECTION 01 RIBBON */}
                <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-cyan-800 bg-cyan-50 px-3.5 py-1.5 rounded-xl border border-cyan-200 w-fit">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <span>Overview Section 01 // The 4 ATS Scoring Pillars</span>
                </div>

                {/* 4 CORE CHECKS BREAKDOWN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CHECK 1: Keywords & Skills */}
                  <div className="bg-white border-2 border-cyan-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-cyan-600">
                    <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-700" />
                        <h3 className="text-sm font-bold text-slate-950">1. Skills & Keyword Match</h3>
                      </div>
                      <span className="text-xs font-extrabold text-cyan-900 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200 font-mono">
                        {analysis.checks.keywordMatch.matchedCount} of {analysis.checks.keywordMatch.totalTargetCount} Skills Found
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Recruiters and automated screening tools look for core skills related to <strong>{selectedRole}</strong>.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900">Skills Found in Your Resume:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.checks.keywordMatch.foundSkills.length > 0 ? (
                          analysis.checks.keywordMatch.foundSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-900"
                            >
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No standard role keywords detected yet.</span>
                        )}
                      </div>
                    </div>

                    {analysis.checks.keywordMatch.missingSkills.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-cyan-100">
                        <div className="text-xs font-bold text-amber-900">Recommended Skills to Add (If you know them):</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.keywordMatch.missingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 border border-dashed border-amber-300 text-amber-900"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHECK 2: Measurable Numbers & Results */}
                  <div className="bg-white border-2 border-indigo-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-indigo-600">
                    <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-700" />
                        <h3 className="text-sm font-bold text-slate-950">2. Measurable Impact & Numbers</h3>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                        {analysis.checks.measurableResults.metricsFoundCount} Metrics Found
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Bullet points that include numbers (percentages, speed improvements, user counts) stand out far more than generic statements.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900">Numbers & Scale Detected:</div>
                      {analysis.checks.measurableResults.metricsFoundList.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.measurableResults.metricsFoundList.map((m, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 border border-indigo-300 text-indigo-900"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium">
                          No measurable numbers found. Try adding metrics like: <em>&quot;improved page load time by 30%&quot;</em> or <em>&quot;used by 500+ students&quot;</em>.
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 pt-2 border-t border-indigo-100 font-medium">
                      💡 {analysis.checks.measurableResults.tip}
                    </div>
                  </div>

                  {/* CHECK 3: Action Verbs */}
                  <div className="bg-white border-2 border-emerald-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-emerald-600">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <h3 className="text-sm font-bold text-slate-950">3. Strong Action Verbs</h3>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                        {analysis.checks.actionVerbs.strongVerbsFound.length} Strong Verbs Used
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Starting project bullets with strong action words makes your contributions sound confident and impactful.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900">Strong Action Words Found:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.checks.actionVerbs.strongVerbsFound.length > 0 ? (
                          analysis.checks.actionVerbs.strongVerbsFound.map((verb) => (
                            <span
                              key={verb}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-950"
                            >
                              ✓ {verb}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No strong action verbs detected.</span>
                        )}
                      </div>
                    </div>

                    {analysis.checks.actionVerbs.weakPhrasesFound.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                        <div className="text-xs font-bold text-rose-800">Weak Phrases to Replace:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.actionVerbs.weakPhrasesFound.map((phrase) => (
                            <span
                              key={phrase}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-800"
                            >
                              ✕ {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHECK 4: Structure & Completeness */}
                  <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm border-l-8 border-l-slate-900">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-900" />
                        <h3 className="text-sm font-bold text-slate-950">4. Structure & Contact Info</h3>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
                        {analysis.wordCount} Words Total
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Checks that critical contact details and standard sections are easily readable.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {analysis.checks.structureAndContact.hasEmail ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasEmail ? 'text-slate-950 font-bold' : 'text-slate-400'}>
                          Email Address
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {analysis.checks.structureAndContact.hasPhone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasPhone ? 'text-slate-950 font-bold' : 'text-slate-400'}>
                          Phone Number
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {analysis.checks.structureAndContact.hasUniversity ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasUniversity ? 'text-slate-950 font-bold' : 'text-slate-400'}>
                          College / University
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {analysis.checks.structureAndContact.hasGithub ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasGithub ? 'text-slate-950 font-bold' : 'text-slate-400'}>
                          GitHub Link
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 pt-1 font-medium">
                      Length Assessment:{' '}
                      <strong className="text-slate-950 font-bold">{analysis.checks.structureAndContact.wordCountAssessment}</strong> (Ideal: 350-750 words for 1 page).
                    </div>
                  </div>
                </div>

                {/* SECTION 02 RIBBON */}
                <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-indigo-800 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 w-fit">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Overview Section 02 // Recommended Bullet Point Rewrites</span>
                </div>

                {/* SECTION: BULLET POINT IMPROVEMENT EXAMPLES */}
                <div className="bg-white border-2 border-indigo-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-indigo-600">
                  <div className="pb-3 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 font-heading">
                        Recommended Bullet Point Rewrites (Before vs. After)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Extracted directly from your resume and transformed with strong action verbs and measurable results for <strong>{selectedRole}</strong>.
                      </p>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono shrink-0 w-fit">
                      {analysis.bulletImprovements.length} Tailored Suggestions
                    </span>
                  </div>

                  {analysis.bulletImprovements.length > 0 ? (
                    <div className="space-y-6">
                      {analysis.bulletImprovements.map((b) => {
                        const override = overrideImprovements[b.id];
                        const displayImproved = override?.improved || b.improved;
                        const displayActionVerb = override?.actionVerb || b.actionVerbUsed;
                        const displayWhy = override?.why || b.whatWasFixed;
                        const isRegen = isRegeneratingImprovement[b.id];

                        return (
                          <div key={b.id} className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 bg-slate-50/50 space-y-4 transition-all hover:border-indigo-400 shadow-sm">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-white border border-slate-300 text-slate-900 font-mono">
                                Action Verb: <strong className="text-indigo-600 font-black">{displayActionVerb}</strong>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isRegen}
                                  onClick={() => handleRegenerateImprovement(b.id, b.original)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50 transition-colors shadow-2xs disabled:opacity-50"
                                  title="Regenerate this bullet point with AI"
                                >
                                  <RefreshCw className={`w-3 h-3 text-indigo-600 ${isRegen ? 'animate-spin' : ''}`} />
                                  <span>{isRegen ? 'Regenerating...' : 'Regenerate with AI'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyText(b.id, displayImproved)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors shadow-2xs btn-press"
                                >
                                  {copiedId === b.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Bullet</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block font-mono">
                                  Before (Original Sentence from Your Resume):
                                </span>
                                <p className="text-xs text-slate-800 bg-white p-4 rounded-2xl border-2 border-rose-200 leading-relaxed font-mono shadow-2xs">
                                  &ldquo;{b.original}&rdquo;
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>After (100% Ready-to-Paste Accomplishment):</span>
                                </span>
                                <p className="text-xs font-bold bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-500 text-emerald-950 leading-relaxed shadow-sm">
                                  {displayImproved}
                                </p>
                              </div>
                            </div>

                            <div className="text-xs text-sky-950 bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200 flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                                ✓
                              </div>
                              <div className="leading-relaxed">
                                <strong className="text-sky-900">Why this works: </strong>
                                <span>{displayWhy}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mx-auto">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-black">No Project Bullet Points Found in Document</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                          We could not detect any distinct project descriptions or experience sentences in this uploaded document.
                          Use the <strong>Interactive Bullet Point Improver</strong> below to paste any bullet from your resume and get instant ATS-optimized rewrites.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 03 RIBBON */}
                <div className="flex items-center gap-2 text-xs font-extrabold font-mono tracking-wider uppercase text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-300 w-fit">
                  <Wand2 className="w-4 h-4 text-slate-700" />
                  <span>Overview Section 03 // Interactive Bullet Point Workbench</span>
                </div>

                {/* INTERACTIVE WORKBENCH: "REWRITE MY BULLET POINT" */}
                <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-slate-900">
                  <div className="pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-black" />
                      <h3 className="text-base font-bold text-black">Interactive Bullet Point Improver</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Paste any line from your resume below and click Improve to get instant professional suggestions.
                    </p>
                  </div>

                  <form onSubmit={handleRewriteBullet} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Enter or paste a bullet point from your resume:</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={userBulletInput}
                          onChange={(e) => setUserBulletInput(e.target.value)}
                          placeholder="e.g. Made an online store with React and Node to sell books..."
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!userBulletInput.trim() || isRewritingBullet}
                          className="px-5 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
                        >
                          {isRewritingBullet ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Improving with AI...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Improve Bullet with AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {rewrittenBulletResult && (
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-700">Choose an Improved Version:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rewrittenBulletResult.suggestions.map((s, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <span className="text-xs font-bold text-black block">{s.title}</span>
                              <p className="text-xs font-medium text-black bg-white p-3 rounded-xl border border-gray-200 leading-relaxed shadow-2xs">
                                {s.rewritten}
                              </p>
                              <p className="text-[11px] text-gray-500 leading-relaxed">
                                {s.explanation}
                              </p>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleCopyText(`rewritten-${idx}`, s.rewritten)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-2xs"
                              >
                                {copiedId === `rewritten-${idx}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-white" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-white" />
                                    <span>Copy Text</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: TARGET JOB (JD) MATCHER */}
            {analysisTab === 'jd-match' && (
              <div className="animate-in fade-in duration-200">
                <JobDescriptionMatcher
                  resumeText={analysis.rawText || pastedText}
                  targetRole={selectedRole}
                  onAddSkillToResume={async (skill) => {
                    const newSkills = Array.from(new Set([...profile.verifiedSkills, skill]));
                    await updateProfile({ verifiedSkills: newSkills });
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT 3: RECRUITER 6-SEC EYE-TRACKING HEATMAP */}
            {analysisTab === 'heatmap' && (
              <div className="animate-in fade-in duration-200">
                <ResumeHeatmapOverlay
                  analysis={analysis}
                  rawText={analysis.rawText || pastedText}
                />
              </div>
            )}

            {/* TAB CONTENT 4: MULTI-TONE BULLET REWRITER */}
            {analysisTab === 'rewriter' && (
              <div className="animate-in fade-in duration-200">
                <MultiToneRewriterCard
                  bulletList={
                    analysis.bulletImprovements.length > 0
                      ? analysis.bulletImprovements.map((b) => b.original)
                      : [
                          'Engineered fullstack web applications using React and Node.js.',
                          'Optimized database queries to improve page load speed.',
                          'Deployed cloud microservices on AWS with Docker.',
                        ]
                  }
                />
              </div>
            )}

            {/* TAB CONTENT 5: BUZZWORD & FLUFF AUDITOR */}
            {analysisTab === 'buzzwords' && (
              <div className="animate-in fade-in duration-200">
                <BuzzwordScannerCard rawText={analysis.rawText || pastedText} />
              </div>
            )}

            {/* TAB CONTENT 6: INTERACTIVE LIVE RESUME EDITOR */}
            {analysisTab === 'editor' && (
              <div className="animate-in fade-in duration-200">
                <InlineResumeEditor
                  initialAnalysis={analysis}
                  targetRole={selectedRole}
                  onSaveUpdatedAnalysis={(newA) => {
                    setAnalysis(newA);
                    updateResumeAts(newA.overallScore);
                  }}
                />
              </div>
            )}

            {/* TAB CONTENT 7: VERSION HISTORY & DELTA COMPARATOR */}
            {analysisTab === 'versions' && (
              <div className="animate-in fade-in duration-200">
                <ResumeVersionComparator currentAnalysis={analysis} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* PLACIFY ECOSYSTEM CAREER BRIDGES */}
        <EcosystemBridgeCards
          analysis={analysis}
          targetRole={selectedRole}
        />
          </div>
        )}

        {/* ATS PDF EXPORT MODAL */}
        {analysis && (
          <AtsPdfExportModal
            analysis={analysis}
            targetRole={selectedRole}
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
        )}

      </div>
    </AppShell>
  );
}
