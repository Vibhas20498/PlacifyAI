'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { CompanyDriveProfile, HRInterviewQuestion } from '@/lib/placement-war-room/types';
import { MASTER_HR_QUESTIONS } from '@/lib/placement-war-room/drive-data';
import { evaluateInterviewResponse } from '@/lib/placement-war-room/engine';

interface Round4HRProps {
  company: CompanyDriveProfile;
  onCompleteRound: (result: {
    answers: { questionId: string; answerText: string; feedback: string; score: number }[];
    averageScore: number;
    passed: boolean;
  }) => void;
}

export function Round4HR({ company, onCompleteRound }: Round4HRProps) {
  const questions = MASTER_HR_QUESTIONS[company.key] || MASTER_HR_QUESTIONS['tcs-digital'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluatedResults, setEvaluatedResults] = useState<Record<string, any>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQ = questions[currentIdx];
  const currentText = answers[currentQ.id] || '';
  const wordsCount = currentText.split(/\s+/).filter(Boolean).length;

  const handleEvaluateAndNext = () => {
    setIsEvaluating(true);
    const evalRes = evaluateInterviewResponse(currentText, currentQ.idealResponseCriteria, true);

    const updatedEvaluations = {
      ...evaluatedResults,
      [currentQ.id]: {
        questionId: currentQ.id,
        answerText: currentText,
        feedback: evalRes.feedback,
        score: evalRes.score,
      },
    };
    setEvaluatedResults(updatedEvaluations);
    setIsEvaluating(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const allResults = Object.values(updatedEvaluations);
      const totalScore = allResults.reduce((sum, item: any) => sum + item.score, 0);
      const averageScore = Math.round(totalScore / allResults.length);
      const passed = averageScore >= company.round4PassingScore;

      onCompleteRound({
        answers: allResults as any,
        averageScore,
        passed,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
            R4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Round 4: HR & Cultural Alignment Round</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Final Decision Round • Bar: {company.round4PassingScore}/100
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {company.name} • Executive Leadership, Ethics, and Conflict Scenarios
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-500 self-end sm:self-auto">
          Final Round
        </div>
      </div>

      {/* Main HR Scenario Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono uppercase">
              Theme: {currentQ.theme}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {currentQ.scenario}
          </h3>

          <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700">
            <HeartHandshake className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
            <p><strong>What the panel evaluates:</strong> {currentQ.evaluates}</p>
          </div>
        </div>

        {/* Answer Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-gray-700">Your Behavioral Response (STAR Framework):</label>
            <span className={`font-mono ${wordsCount < 20 ? 'text-amber-600' : 'text-gray-400'}`}>
              {wordsCount} words
            </span>
          </div>

          <textarea
            value={currentText}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [currentQ.id]: e.target.value,
              }))
            }
            rows={7}
            placeholder="Describe: Situation/Task (the challenge faced), Action (your personal role, communication, and emotional maturity), and Result (the positive organizational impact)..."
            className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
          />
        </div>

        {/* Ideal Response Checklist */}
        <div className="space-y-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Key behavioral signals evaluated:
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {currentQ.idealResponseCriteria.map((c, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700"
              >
                ✓ {c}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Final Round Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={wordsCount < 10 || isEvaluating}
            onClick={handleEvaluateAndNext}
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isEvaluating ? 'Evaluating Final Placement Verdict...' : 'Submit HR Round & Generate Decision'}</span>
            <Award className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
