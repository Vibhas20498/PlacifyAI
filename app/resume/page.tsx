'use client';

import React, { useState, useEffect } from 'react';
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
  const [rewrittenBulletResult, setRewrittenBulletResult] = useState<{
    original: string;
    suggestions: { title: string; rewritten: string; explanation: string }[];
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSavedToProfile, setIsSavedToProfile] = useState(false);

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

  // Handle interactive bullet point rewriting
  const handleRewriteBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userBulletInput.trim()) return;
    const result = rewriteBulletSentence(userBulletInput);
    setRewrittenBulletResult(result);
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

          <div className="flex items-center gap-2">
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
              <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputTab('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inputTab === 'upload' ? 'bg-white text-black shadow-2xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Upload File (PDF / Word)
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab('paste')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    inputTab === 'paste' ? 'bg-white text-black shadow-2xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Paste Text Directly
                </button>
              </div>
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
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-baseline gap-2 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-200 self-start md:self-auto">
                    <span className="text-5xl font-extrabold tracking-tight text-black">
                      {analysis.overallScore}
                    </span>
                    <span className="text-xl font-semibold text-gray-400">/100</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Export ATS Resume PDF</span>
                  </button>
                </div>
              </div>

              {/* Top Action Items Checklist */}
              {analysis.keyActionItems.length > 0 && (
                <div className="space-y-2.5 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Top Recommendations to Boost Your Score</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {analysis.keyActionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 text-xs font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setAnalysisTab('rag-intelligence')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'rag-intelligence'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-sky-400" />
                <span>RAG Intelligence & Reasoning</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('overview')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'overview'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Overview & 4 Pillars</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('jd-match')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'jd-match'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Target Job (JD) Matcher</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('heatmap')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'heatmap'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Recruiter 6-Sec Heatmap</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('rewriter')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'rewriter'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Multi-Tone Rewriter</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('buzzwords')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'buzzwords'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fluff & Buzzword Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('editor')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'editor'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Live Resume Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisTab('versions')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  analysisTab === 'versions'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Version History & Delta</span>
              </button>
            </div>

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
                      Retrieving RAG Knowledge Base Rubrics & Grounding Recommendations...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 1: OVERVIEW & 4 PILLARS & BULLET REWRITES */}
            {analysisTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* 4 CORE CHECKS BREAKDOWN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CHECK 1: Keywords & Skills */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-black" />
                        <h3 className="text-sm font-bold text-black">1. Skills & Keyword Match</h3>
                      </div>
                      <span className="text-xs font-semibold text-black">
                        {analysis.checks.keywordMatch.matchedCount} of {analysis.checks.keywordMatch.totalTargetCount} Skills Found
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Recruiters and automated screening tools look for core skills related to <strong>{selectedRole}</strong>.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Skills Found in Your Resume:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.checks.keywordMatch.foundSkills.length > 0 ? (
                          analysis.checks.keywordMatch.foundSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 border border-gray-200 text-black"
                            >
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No standard role keywords detected yet.</span>
                        )}
                      </div>
                    </div>

                    {analysis.checks.keywordMatch.missingSkills.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-700">Recommended Skills to Add (If you know them):</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.keywordMatch.missingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-dashed border-gray-300 text-gray-600"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHECK 2: Measurable Numbers & Results */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-black" />
                        <h3 className="text-sm font-bold text-black">2. Measurable Impact & Numbers</h3>
                      </div>
                      <span className="text-xs font-semibold text-black">
                        {analysis.checks.measurableResults.metricsFoundCount} Metrics Found
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Bullet points that include numbers (percentages, speed improvements, user counts) stand out far more than generic statements.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Numbers & Scale Detected:</div>
                      {analysis.checks.measurableResults.metricsFoundList.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.measurableResults.metricsFoundList.map((m, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-black"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800">
                          No measurable numbers found. Try adding metrics like: <em>&quot;improved page load time by 30%&quot;</em> or <em>&quot;used by 500+ students&quot;</em>.
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      {analysis.checks.measurableResults.tip}
                    </div>
                  </div>

                  {/* CHECK 3: Action Verbs */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-black" />
                        <h3 className="text-sm font-bold text-black">3. Strong Action Verbs</h3>
                      </div>
                      <span className="text-xs font-semibold text-black">
                        {analysis.checks.actionVerbs.strongVerbsFound.length} Strong Verbs Used
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Starting project bullets with strong action words makes your contributions sound confident and impactful.
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Strong Action Words Found:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.checks.actionVerbs.strongVerbsFound.length > 0 ? (
                          analysis.checks.actionVerbs.strongVerbsFound.map((verb) => (
                            <span
                              key={verb}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800"
                            >
                              ✓ {verb}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No strong action verbs detected.</span>
                        )}
                      </div>
                    </div>

                    {analysis.checks.actionVerbs.weakPhrasesFound.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        <div className="text-xs font-semibold text-red-700">Weak Phrases to Replace:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.checks.actionVerbs.weakPhrasesFound.map((phrase) => (
                            <span
                              key={phrase}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 border border-red-200 text-red-700"
                            >
                              ✕ {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHECK 4: Structure & Completeness */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-black" />
                        <h3 className="text-sm font-bold text-black">4. Structure & Contact Info</h3>
                      </div>
                      <span className="text-xs font-semibold text-black">
                        {analysis.wordCount} Words Total
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Checks that critical contact details and standard sections are easily readable.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
                        {analysis.checks.structureAndContact.hasEmail ? (
                          <CheckCircle className="w-4 h-4 text-black" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasEmail ? 'text-black font-medium' : 'text-gray-400'}>
                          Email Address
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
                        {analysis.checks.structureAndContact.hasPhone ? (
                          <CheckCircle className="w-4 h-4 text-black" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasPhone ? 'text-black font-medium' : 'text-gray-400'}>
                          Phone Number
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
                        {analysis.checks.structureAndContact.hasUniversity ? (
                          <CheckCircle className="w-4 h-4 text-black" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasUniversity ? 'text-black font-medium' : 'text-gray-400'}>
                          College / University
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200">
                        {analysis.checks.structureAndContact.hasGithub ? (
                          <CheckCircle className="w-4 h-4 text-black" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={analysis.checks.structureAndContact.hasGithub ? 'text-black font-medium' : 'text-gray-400'}>
                          GitHub Link
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 pt-1">
                      Length Assessment:{' '}
                      <strong className="text-black">{analysis.checks.structureAndContact.wordCountAssessment}</strong> (Ideal: 350-750 words for 1 page).
                    </div>
                  </div>
                </div>

                {/* SECTION: BULLET POINT IMPROVEMENT EXAMPLES */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-black">
                        Recommended Bullet Point Rewrites (Before vs. After)
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Extracted directly from your resume and transformed with strong action verbs and measurable results for <strong>{selectedRole}</strong>.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-black shrink-0 w-fit">
                      {analysis.bulletImprovements.length} Tailored Suggestions
                    </span>
                  </div>

                  {analysis.bulletImprovements.length > 0 ? (
                    <div className="space-y-6">
                      {analysis.bulletImprovements.map((b) => (
                        <div key={b.id} className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-4 transition-all hover:border-gray-300">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-black">
                              Action Verb: <strong className="text-black">{b.actionVerbUsed}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(b.id, b.improved)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-2xs"
                            >
                              {copiedId === b.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-white" />
                                  <span>Copied to Clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Improved Bullet</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-gray-500 block">
                                Before (Original Sentence from Your Resume):
                              </span>
                              <p className="text-xs text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200 leading-relaxed font-mono">
                                {b.original}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-bold text-black flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-black" />
                                <span>After (Strong & Impact-Driven):</span>
                              </span>
                              <p className="text-xs font-semibold bg-white p-4 rounded-xl border-2 border-black/10 text-black leading-relaxed shadow-2xs">
                                {b.improved}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                              ✓
                            </div>
                            <div className="leading-relaxed">
                              <strong className="text-black">Why this works: </strong>
                              <span>{b.whatWasFixed}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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

                {/* INTERACTIVE WORKBENCH: "REWRITE MY BULLET POINT" */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
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
                          disabled={!userBulletInput.trim()}
                          className="px-5 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Improve Bullet</span>
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
