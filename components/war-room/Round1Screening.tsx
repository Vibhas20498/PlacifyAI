'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Filter,
} from 'lucide-react';
import { ScreeningQuestion, ScreeningCategory, CompanyDriveProfile } from '@/lib/placement-war-room/types';
import { MASTER_QUESTION_BANK, generateRandomizedScreeningPaper } from '@/lib/placement-war-room/drive-data';
import { CompanyLogo } from './CompanyLogos';

interface Round1ScreeningProps {
  company: CompanyDriveProfile;
  questions?: ScreeningQuestion[];
  onCompleteRound: (result: {
    score: number;
    totalPossible: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    passed: boolean;
    timeTakenSeconds: number;
  }) => void;
  tabSwitchViolations: number;
  onTabSwitchViolation: () => void;
}

const CATEGORY_ICONS: Record<ScreeningCategory, string> = {
  'Quantitative Aptitude': '📊',
  'Logical Reasoning': '🧠',
  'Verbal Ability': '📝',
  'Core CS & Technical Logic': '💻',
  'Situational Judgment': '🤝',
};

const TOTAL_EXAM_DURATION_SECONDS = 900; // 15 minutes realistic corporate recruitment timer (20 questions @ 45s/q)

export function Round1Screening({
  company,
  questions: passedQuestions,
  onCompleteRound,
  tabSwitchViolations,
  onTabSwitchViolation,
}: Round1ScreeningProps) {
  // Use passed randomized paper or generate fresh one
  const questions = useMemo(() => {
    return passedQuestions && passedQuestions.length > 0
      ? passedQuestions
      : generateRandomizedScreeningPaper(company.key);
  }, [passedQuestions, company.key]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_EXAM_DURATION_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Proctor: Detect tab switches and window blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onTabSwitchViolation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [onTabSwitchViolation]);

  // Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleSubmitExam();
      return;
    }
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const toggleFlag = (idx: number) => {
    setFlaggedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === undefined) {
        unansweredCount++;
      } else if (selected === q.correctOptionIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Real Indian Placement Exam Rule: +1 for correct, -0.25 negative marking for incorrect
    const rawScore = correctCount * 1.0 - wrongCount * 0.25;
    const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
    const totalPossible = questions.length;
    const percentage = Math.round((finalScore / totalPossible) * 100);
    const passed = percentage >= company.round1CutoffPercent;

    setTimeout(() => {
      onCompleteRound({
        score: finalScore,
        totalPossible,
        correctCount,
        wrongCount,
        unansweredCount,
        passed,
        timeTakenSeconds: TOTAL_EXAM_DURATION_SECONDS - secondsRemaining,
      });
    }, 600);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const currentQ = questions[currentIndex] || questions[0];

  // Distinct categories present in active paper
  const categoriesPresent = useMemo(() => {
    const set = new Set<ScreeningCategory>();
    questions.forEach((q) => set.add(q.category));
    return Array.from(set);
  }, [questions]);

  // Questions filtered for palette view
  const filteredIndices = useMemo(() => {
    if (selectedCategoryFilter === 'all') {
      return questions.map((_, i) => i);
    }
    return questions
      .map((q, i) => (q.category === selectedCategoryFilter ? i : -1))
      .filter((i) => i !== -1);
  }, [questions, selectedCategoryFilter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Proctor & Timer Header Bar with Official Company Logo */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
            <CompanyLogo companyKey={company.key} size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Round 1: Screening Test</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Cutoff: {company.round1CutoffPercent}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {questions.length} Questions • 15 Minutes • Sectional Aptitude, Logic, Verbal & Technical Core
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Proctor Tab Switch Alert Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              tabSwitchViolations === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              Proctor: {tabSwitchViolations}/3 Tab Switches
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              secondsRemaining < 60
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-gray-100 text-gray-900 border-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* SECTIONAL CATEGORY NAVIGATION BAR */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 sm:p-2.5 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              selectedCategoryFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <span>All Sections</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategoryFilter === 'all' ? 'bg-white/20' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {Object.keys(selectedAnswers).length}/{questions.length}
            </span>
          </button>

          {categoriesPresent.map((cat) => {
            const catQuestions = questions.filter((q) => q.category === cat);
            const answeredInCat = catQuestions.filter(
              (q) => selectedAnswers[questions.indexOf(q)] !== undefined
            ).length;
            const isSelected = selectedCategoryFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategoryFilter(cat);
                  // Jump to the first question in that section
                  const firstIdx = questions.findIndex((q) => q.category === cat);
                  if (firstIdx !== -1) setCurrentIndex(firstIdx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{CATEGORY_ICONS[cat] || '📌'}</span>
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {answeredInCat}/{catQuestions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Test Layout: Question Area + Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Active Question Card */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <span>{CATEGORY_ICONS[currentQ.category] || '📌'}</span>
                  <span>{currentQ.category}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
                <span className="text-emerald-700 font-semibold">+1.0 Mark</span>
                <span className="text-gray-300">•</span>
                <span className="text-rose-700 font-semibold">-0.25 Negative</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed">
                {currentQ.question}
              </p>

              {currentQ.codeSnippet && (
                <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                  {currentQ.codeSnippet}
                </pre>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-sm ring-2 ring-black/10'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => toggleFlag(currentIndex)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                  flaggedIndices.includes(currentIndex)
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {flaggedIndices.includes(currentIndex) ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl transition-colors"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitExam}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Round 1'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 col: Question Palette */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Question Palette
              </h3>
              <span className="text-[11px] font-mono font-bold text-gray-500">
                {Object.keys(selectedAnswers).length}/{questions.length} Answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {filteredIndices.map((idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedIndices.includes(idx);

                let bgClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                if (isAnswered) bgClass = 'bg-black text-white';
                if (isFlagged) bgClass = 'bg-amber-400 text-black font-bold';
                if (isCurrent) bgClass += ' ring-2 ring-black ring-offset-2';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-black" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-gray-100 border border-gray-300" />
                <span>Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-400" />
                <span>Marked for Review</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitExam}
              className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Finish & Submit Round 1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
