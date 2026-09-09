'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Target,
  TrendingUp,
  Map,
  MessageSquare,
  Mic,
  SlidersHorizontal,
  FileDown,
  CheckCircle2,
} from 'lucide-react';
import { HeroNodePath } from '@/components/motif/NodePathMotif';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Upload Resume',
      desc: 'Drop your resume and let AI extract skills, experience, and projects automatically.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Analyze Skills',
      desc: 'Score your resume and match it semantically against any target job description.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Bridge Skill Gaps',
      desc: 'Discover missing competencies ranked by market demand and follow our sequenced roadmap.',
      icon: Map,
    },
    {
      num: '04',
      title: 'Predict Placement & Simulate',
      desc: 'Calculate calibrated placement probability with SHAP factor breakdown and What-If simulation.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Top Navigation */}
      <header className="h-16 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md z-40 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-black">Placify AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="/PLACIFYAI_PROJECT_SPECIFICATION.md"
            download="PLACIFYAI_PROJECT_SPECIFICATION.md"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:text-black hover:border-black transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            Download Spec Dossier
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 sm:px-12 pt-12 sm:pt-20 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700">
              <Shield className="w-3.5 h-3.5 text-black" />
              <span>AI-powered · Explainable · Never a black box</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black leading-[1.08] font-sans">
              Know where you stand.
              <br />
              Know what to improve.
              <br />
              <span className="text-gray-900">Know what comes next.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Placify AI analyzes your resume, skills, and target roles to estimate placement probability, surface skill gaps, and build a personalized roadmap — all backed by explainable AI and grounded RAG intelligence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2 group shadow-sm"
              >
                <span>Analyze My Career</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl border border-gray-300 text-black text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                I have an account
              </Link>
            </div>

            <div className="text-xs text-gray-400 font-mono pt-1">
              Estimates only — not a guarantee of employment.
            </div>
          </div>

          {/* Right Column: Signature Node-Path Diagram Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="p-6 bg-gray-50/60 rounded-3xl border border-gray-200/80 shadow-sm w-full max-w-[460px]">
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 pb-2 border-b border-gray-200 mb-2">
                <span>01 // JOURNEY ARCHITECTURE</span>
                <span className="text-black font-semibold">Active Pipeline</span>
              </div>
              <HeroNodePath interactive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="h-px bg-gray-200 w-full" />
      </div>

      {/* "How it works" Section */}
      <section className="px-6 sm:px-12 py-20 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
            How it works
          </h2>
          <p className="text-base text-gray-600">
            A clear path from resume to placement-ready.
          </p>
        </div>

        <div className="relative pl-8 sm:pl-12 border-l-2 border-gray-200 space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                {/* Node circle on timeline */}
                <div className="absolute -left-[45px] sm:-left-[61px] top-4 w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-black font-mono text-xs font-bold shadow-sm">
                  <Icon className="w-4 h-4 text-black" />
                </div>

                {/* Step Card */}
                <div className="bg-white border border-gray-200 group-hover:border-black rounded-2xl p-6 sm:p-7 transition-all duration-200">
                  <div className="font-mono text-xs text-gray-400 font-semibold mb-1">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Intelligence Features Grid */}
      <section className="px-6 sm:px-12 py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold">
              Precision Tooling
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
              Scientific Intelligence Engine
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Deterministic machine learning and vector retrieval built for measurable career progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-black" />
              </div>
              <h4 className="text-lg font-bold text-black">XGBoost ML Probability</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calculates calibrated probability with SHAP factor explainability decomposed into positive and negative drivers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-black" />
              </div>
              <h4 className="text-lg font-bold text-black">RAG Career Coach</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Multi-turn conversational advisor grounded in FAANG hiring rubrics, system design standards, and verified ATS guidelines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-black" />
              </div>
              <h4 className="text-lg font-bold text-black">What-If Simulator</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Interactive sensitivity workbench to project how changes in CGPA, DSA count, or cloud deployments shift placement probability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Dossier */}
      <section className="px-6 sm:px-12 py-20 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
          Take control of your placement readiness today.
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Join thousands of engineering students benchmarking their skills with precision analytics.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-all shadow-md"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="font-sans font-bold text-black">Placify AI</span>
          <span>© 2026. Swiss Editorial Career Intelligence.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
          <Link href="/profile" className="hover:text-black">Profile</Link>
          <a href="/PLACIFYAI_PROJECT_SPECIFICATION.md" download className="hover:text-black">Spec Dossier</a>
        </div>
      </footer>
    </div>
  );
}
