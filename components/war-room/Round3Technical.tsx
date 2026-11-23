'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Target,
  Layers,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { CompanyDriveProfile, TechnicalInterviewQuestion } from '@/lib/placement-war-room/types';
import { MASTER_TECHNICAL_QUESTIONS } from '@/lib/placement-war-room/drive-data';
import { evaluateInterviewResponse } from '@/lib/placement-war-room/engine';

interface Round3TechnicalProps {
  company: CompanyDriveProfile;
  onCompleteRound: (result: {
    answers: { questionId: string; answerText: string; feedback: string; score: number }[];
    averageScore: number;
    passed: boolean;
  }) => void;
}

export function Round3Technical({ company, onCompleteRound }: Round3TechnicalProps) {
  const questions = MASTER_TECHNICAL_QUESTIONS[company.key] || MASTER_TECHNICAL_QUESTIONS['tcs-digital'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluatedResults, setEvaluatedResults] = useState<Record<string, any>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentQ = questions[currentIdx];
  const currentText = answers[currentQ.id] || '';
  const wordsCount = currentText.split(/\s+/).filter(Boolean).length;

  const handleEvaluateAndNext = () => {
    setIsEvaluating(true);
    const evalRes = evaluateInterviewResponse(currentText, currentQ.sampleExpectedPoints, false);
    
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
      // Calculate overall technical score
      const allResults = Object.values(updatedEvaluations);
      const totalScore = allResults.reduce((sum, item: any) => sum + item.score, 0);
      const averageScore = Math.round(totalScore / allResults.length);
      const passed = averageScore >= company.round3PassingScore;

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
            R3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Round 3: Technical & Project Defense</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Passing Bar: {company.round3PassingScore}/100
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {company.name} • System Design, Trade-offs & Architecture Defense
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-500 self-end sm:self-auto">
          Question {currentIdx + 1} of {questions.length}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono uppercase">
              Topic: {currentQ.topic}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {currentQ.question}
          </h3>
          <div className="flex items-start gap-2 bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs text-purple-900">
            <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p><strong>Recruiter Context Tip:</strong> {currentQ.contextTip}</p>
          </div>
        </div>

        {/* Answer Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-gray-700">Your Technical Response (STAR Method):</label>
            <span className={`font-mono ${wordsCount < 20 ? 'text-amber-600' : 'text-gray-400'}`}>
              {wordsCount} words {wordsCount < 20 && '(Minimum ~25 words recommended)'}
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
            placeholder="Structure your answer: 1. Architecture context, 2. The technical decision or trade-off made, 3. The quantifiable result or scalability outcome..."
            className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
          />
        </div>

        {/* Key Points Checklist */}
        <div className="space-y-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Key concepts senior interviewers look for:
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {currentQ.sampleExpectedPoints.map((pt, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700"
              >
                ✓ {pt}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={wordsCount < 10 || isEvaluating}
            onClick={handleEvaluateAndNext}
            className="px-6 py-2.5 text-xs font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentIdx < questions.length - 1 ? 'Evaluate & Next Question' : 'Submit Round 3 & Advance'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
