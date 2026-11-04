'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Target,
  TrendingUp,
  Map,
  MessageSquare,
  SlidersHorizontal,
  FileDown,
  CheckCircle2,
  Menu,
  X,
  Compass,
  Zap,
  BarChart3,
  Bot,
  BrainCircuit,
} from 'lucide-react';
import { HeroNodePath } from '@/components/motif/NodePathMotif';
import {
  FloatingSkillBadge,
  FloatingInsightCard,
  AmbientGlowOrbs,
  SubtleGridPattern,
} from '@/components/ui/FloatingElements';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AnimatedTabs, TabItem } from '@/components/ui/AnimatedTabs';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'prediction' | 'resume' | 'skillgap' | 'whatif'>('prediction');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Upload Resume & Calibrate',
      desc: 'Drop your resume (PDF/DOCX) or paste text. Our universal parser and entity extractor parse your skills, education, and bullet points without data loss.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Run AI Career & ATS Analysis',
      desc: 'Deterministic 4-pillar ATS evaluation combined with semantic retrieval against role-specific hiring rubrics.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Decompose Factors & Skill Gaps',
      desc: 'Identify high-demand competency deficits and inspect positive placement drivers vs. bottleneck penalties.',
      icon: Map,
    },
    {
      num: '04',
      title: 'Simulate What-If Scenarios',
      desc: 'Test hypothetical trajectories — adding LeetCode problems, fullstack deployments, or certifications — to forecast placement probability shifts.',
      icon: TrendingUp,
    },
  ];

  const previewTabs: TabItem[] = [
    { id: 'prediction', label: 'Placement Prediction', icon: TrendingUp },
    { id: 'resume', label: 'AI Resume Intelligence', icon: BrainCircuit, badge: 'AI' },
    { id: 'skillgap', label: 'Skill Gap Engine', icon: Target },
    { id: 'whatif', label: 'What-If Workbench', icon: SlidersHorizontal },
  ];

  // Motion variants for hero
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <AmbientGlowOrbs />

      {/* Top Navigation */}
      <header
        className={`h-16 fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-gray-200/90 shadow-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-black font-sans">
            Placify AI
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
          <a href="#how-it-works" className="hover:text-black transition-colors">
            How It Works
          </a>
          <a href="#platform-preview" className="hover:text-black transition-colors">
            Platform Capabilities
          </a>
          <a
            href="/PLACIFYAI_PROJECT_SPECIFICATION.md"
            download="PLACIFYAI_PROJECT_SPECIFICATION.md"
            className="flex items-center gap-1.5 hover:text-black transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Architecture Spec</span>
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-gray-700 hover:text-black px-3 py-2 rounded-xl hover:bg-gray-100/60 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Dashboard
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-6 z-40 space-y-4 shadow-xl"
          >
            <nav className="flex flex-col space-y-3 text-sm font-semibold">
              <a
                href="#how-it-works"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-xl"
              >
                How It Works
              </a>
              <a
                href="#platform-preview"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-xl"
              >
                Platform Capabilities
              </a>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileNavOpen(false)}
                className="p-3 text-center rounded-xl bg-black text-white"
              >
                Get Started Free
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto">
        <SubtleGridPattern />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Tagline Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200/90 bg-white/80 backdrop-blur-md text-xs font-semibold text-gray-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Explainable AI & Career Intelligence</span>
                <span className="text-gray-300">|</span>
                <span className="text-[11px] font-mono text-gray-500">v2.4 Live</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-black leading-[1.05] font-sans"
            >
              Know where you stand.
              <br />
              <span className="bg-gradient-to-r from-black via-gray-900 to-gray-700 bg-clip-text text-transparent">
                Know what to improve.
              </span>
              <br />
              <span className="text-gray-500">Know what comes next.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-normal"
            >
              Placify AI benchmarks your technical skills, resume bullets, and project scale to estimate placement probability, detect skill gaps, and guide your milestones with zero hallucinations.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/register"
                className="px-7 py-4 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2.5 group shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Your Career Readiness</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-4 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-black text-sm font-semibold hover:bg-gray-100/90 transition-all shadow-2xs"
              >
                See How It Works
              </a>
            </motion.div>

            {/* Grounding Notice */}
            <motion.div variants={itemVariants} className="text-xs text-gray-400 font-medium pt-1 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span>Calibrated algorithmic estimates — never arbitrary claims or black-box predictions.</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Graphic & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Floating Badges around the Visual */}
            <div className="absolute -top-4 -left-6 z-20 hidden sm:block">
              <FloatingSkillBadge name="Python & PyTorch" category="Core ML" delay={0.2} duration={5} />
            </div>

            <div className="absolute top-28 -right-6 z-20 hidden sm:block">
              <FloatingInsightCard
                type="probability"
                title="Placement"
                value="88%"
                subtitle="Calibrated probability estimate"
                delay={0.4}
                duration={6}
              />
            </div>

            <div className="absolute bottom-16 -left-8 z-20 hidden sm:block">
              <FloatingInsightCard
                type="ats"
                title="ATS Match"
                value="94/100"
                subtitle="AI benchmark analysis verified"
                delay={0.6}
                duration={7}
              />
            </div>

            <div className="absolute -bottom-4 right-4 z-20 hidden sm:block">
              <FloatingSkillBadge name="Docker & AWS" category="DevOps" delay={0.8} duration={5.5} yOffset={10} />
            </div>

            {/* Central Node Path Canvas Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-7 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/90 shadow-xl shadow-black/[0.04] w-full max-w-[460px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100 mb-2 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-black uppercase tracking-wider">
                    Pipeline Active
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">AI // Career Intelligence</span>
              </div>

              <HeroNodePath interactive={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section className="border-y border-gray-200/80 bg-gray-50/70 backdrop-blur-sm py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-sans">
              <AnimatedCounter value={1500} suffix="+" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Benchmark Role JDs
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-sans">
              <AnimatedCounter value={40} suffix="ms" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Vector Retrieval Speed
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-sans">
              <AnimatedCounter value={94.2} decimals={1} suffix="%" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Calibration Precision
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-sans">
              <AnimatedCounter value={100} suffix="%" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Deterministic & Grounded
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Platform Capabilities Preview Section */}
      <section id="platform-preview" className="px-6 sm:px-12 py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-black">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Platform Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Engineered for Precision Career Decisions
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Switch between core intelligence modules to see how PlacifyAI guides your preparation.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex justify-center mb-8">
          <AnimatedTabs
            tabs={previewTabs}
            activeTab={activePreviewTab}
            onChange={(id) => setActivePreviewTab(id as any)}
            layoutId="landingPreviewTab"
          />
        </div>

        {/* Tab Content Display */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activePreviewTab === 'prediction' && (
              <motion.div
                key="preview-prediction"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Placement Probability & Factor Attribution
                    </h3>
                    <p className="text-xs text-gray-500">
                      Calculates calibrated placement odds with granular positive drivers and bottleneck penalties.
                    </p>
                  </div>
                  <span className="text-2xl font-black text-black bg-gray-100 px-4 py-2 rounded-2xl shrink-0">
                    88% Probability
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-1">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Peer Percentile</span>
                    <div className="text-2xl font-extrabold text-black">84th</div>
                    <p className="text-[11px] text-gray-500">Ahead of 84% candidate benchmarks</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-1">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Top Positive Driver</span>
                    <div className="text-2xl font-extrabold text-emerald-700">+12.4%</div>
                    <p className="text-[11px] text-gray-500">Production Docker + CI/CD verified</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-1">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Primary Bottleneck</span>
                    <div className="text-2xl font-extrabold text-amber-700">-6.8%</div>
                    <p className="text-[11px] text-gray-500">Lack of measured latency/scale metrics</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/placement-prediction"
                    className="text-xs font-semibold text-black hover:underline flex items-center gap-1.5"
                  >
                    <span>Open Live Placement Prediction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {activePreviewTab === 'resume' && (
              <motion.div
                key="preview-resume"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        AI Grounded Resume Intelligence
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        Zero Hallucinations
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Issue &rarr; Why it matters &rarr; Recommendation &rarr; Suggested Grounded Version
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    Cosine Match: 89%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-slate-400">
                    Original Bullet: &ldquo;Worked on a machine learning project using Python.&rdquo;
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold bg-slate-950 p-3.5 rounded-xl border border-emerald-900/40">
                    Grounded Rewrite: &ldquo;Engineered machine learning project using Python [Specify measured impact if available, e.g. reducing response latency by 35% or supporting 1,500+ active users].&rdquo;
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/resume"
                    className="text-xs font-semibold text-white hover:text-sky-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Full Resume Analyzer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {activePreviewTab === 'skillgap' && (
              <motion.div
                key="preview-skillgap"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Skill Gap Prioritization Matrix
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ranks missing competencies by industry demand and estimated hours to acquire.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black text-white">
                    4 High-Impact Gaps
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-black block">Docker & Containerization</strong>
                      <span className="text-gray-500">Current: 20% &bull; Target: 85% (~12 hrs)</span>
                    </div>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Critical Gap</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-black block">Redis Caching & Latency</strong>
                      <span className="text-gray-500">Current: 30% &bull; Target: 90% (~8 hrs)</span>
                    </div>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">High Priority</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/skill-gap"
                    className="text-xs font-semibold text-black hover:underline flex items-center gap-1.5"
                  >
                    <span>Open Skill Gap Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {activePreviewTab === 'whatif' && (
              <motion.div
                key="preview-whatif"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      What-If Sensitivity Workbench
                    </h3>
                    <p className="text-xs text-gray-500">
                      Simulate how hypothetical milestones shift your calibrated placement odds.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    +14.2% Net Gain Projected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <span className="font-bold text-black block">Adjust LeetCode Practice (+50 problems)</span>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-black h-full w-3/4 rounded-full" />
                    </div>
                    <span className="text-gray-500 text-[11px] block">Yields +4.5% probability gain</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <span className="font-bold text-black block">Deploy Fullstack Project to Cloud</span>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-full rounded-full" />
                    </div>
                    <span className="text-gray-500 text-[11px] block">Yields +6.2% probability gain</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/what-if"
                    className="text-xs font-semibold text-black hover:underline flex items-center gap-1.5"
                  >
                    <span>Launch What-If Workbench</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* "How it works" Timeline Section */}
      <section id="how-it-works" className="px-6 sm:px-12 py-24 bg-gray-50/70 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold font-mono">
              The Placement Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
              A Clear Path from Resume to Offer Letter
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Every step is backed by measurable metrics and transparent AI reasoning.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-12 border-l-2 border-gray-200 space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative group">
                  {/* Node circle on timeline */}
                  <div className="absolute -left-[45px] sm:-left-[61px] top-4 w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-black text-xs font-bold shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <Icon className="w-4 h-4 text-black" />
                  </div>

                  {/* Step Card */}
                  <div className="bg-white border border-gray-200 group-hover:border-black rounded-2xl p-6 sm:p-7 transition-all duration-200 card-hover-lift">
                    <div className="text-xs text-gray-400 font-bold font-mono mb-1">
                      {step.num}
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1.5 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="px-6 sm:px-12 py-24 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-black">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Your Career Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black">
          Take control of your placement readiness today.
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Benchmark your skills with calibrated multi-factor analytics, discover missing keywords, and follow a personalized engineering roadmap.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="font-sans font-bold text-black">Placify AI</span>
          <span>&copy; 2026. Precision Career Intelligence.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-black font-medium transition-colors">Dashboard</Link>
          <Link href="/resume" className="hover:text-black font-medium transition-colors">Resume Analyzer</Link>
          <Link href="/profile" className="hover:text-black font-medium transition-colors">Profile</Link>
          <a href="/PLACIFYAI_PROJECT_SPECIFICATION.md" download className="hover:text-black font-medium transition-colors">Spec Dossier</a>
        </div>
      </footer>
    </div>
  );
}
