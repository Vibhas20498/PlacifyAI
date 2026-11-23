'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { CompanyDriveProfile, CodingProblem } from '@/lib/placement-war-room/types';
import { MASTER_CODING_PROBLEMS } from '@/lib/placement-war-room/drive-data';
import { executeCodingSolution } from '@/lib/placement-war-room/engine';

interface Round2CodingProps {
  company: CompanyDriveProfile;
  onCompleteRound: (result: {
    problemId: string;
    passedCases: number;
    totalCases: number;
    language: 'javascript' | 'python' | 'java' | 'cpp';
    userCode: string;
    passed: boolean;
    timeTakenSeconds: number;
    runtimeMs: number;
  }) => void;
  tabSwitchViolations: number;
  onTabSwitchViolation: () => void;
}

export function Round2Coding({
  company,
  onCompleteRound,
  tabSwitchViolations,
  onTabSwitchViolation,
}: Round2CodingProps) {
  const problem = MASTER_CODING_PROBLEMS[company.key] || MASTER_CODING_PROBLEMS['tcs-digital'];
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes coding limit
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    passedCases: number;
    totalCases: number;
    results: any[];
    totalRuntimeMs: number;
    overallPassed: boolean;
  } | null>(null);

  // Switch starter code when language changes
  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java' | 'cpp') => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang]);
    setExecutionResult(null);
  };

  // Proctor: Detect tab switches
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
      handleFinalSubmit();
      return;
    }
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleRunPublicCases = async () => {
    setIsRunning(true);
    const result = await executeCodingSolution(problem, language, code);
    setExecutionResult(result);
    setIsRunning(false);
  };

  const handleFinalSubmit = async () => {
    setIsRunning(true);
    const result = await executeCodingSolution(problem, language, code);
    setExecutionResult(result);
    setIsRunning(false);

    const passed = result.passedCases >= company.round2RequiredTestCases;

    setTimeout(() => {
      onCompleteRound({
        problemId: problem.id,
        passedCases: result.passedCases,
        totalCases: result.totalCases,
        language,
        userCode: code,
        passed,
        timeTakenSeconds: 600 - secondsRemaining,
        runtimeMs: result.totalRuntimeMs,
      });
    }, 800);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Proctor & Timer Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
            R2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Round 2: Live Speed Coding Elimination</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Need {company.round2RequiredTestCases} of 5 Test Cases
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {company.name} • Algorithmic Challenge with Hidden Edge Constraints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              tabSwitchViolations === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Proctor: {tabSwitchViolations}/3 Tab Violations</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-mono font-bold text-gray-900">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Description & In-Browser Code IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Problem Statement */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-900">{problem.title}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : problem.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>

              {/* Examples */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Example Test Cases:
                </div>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div>
                      <span className="font-bold text-gray-700">Input: </span>
                      <code className="text-black font-mono text-[11px]">{ex.input}</code>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Output: </span>
                      <code className="text-black font-mono text-[11px]">{ex.output}</code>
                    </div>
                    {ex.explanation && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Constraints & Complexity:
                </div>
                <ul className="space-y-1 text-xs text-gray-600">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-gray-400">•</span>
                      <code className="font-mono text-[11px] bg-gray-100 px-1 py-0.5 rounded text-gray-800">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): In-Browser IDE & Test Case Runner */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-sm">
            {/* Editor Top Bar: Language & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-bold text-gray-800">Language:</span>
                <select
                  value={language}
                  onChange={(e: any) => handleLanguageChange(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="javascript">JavaScript (ES6)</option>
                  <option value="python">Python 3</option>
                  <option value="java">Java 17</option>
                  <option value="cpp">C++ (GCC)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleLanguageChange(language)}
                className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                title="Reset code to original starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Template</span>
              </button>
            </div>

            {/* Code Editor Textarea */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-[#0d1117] shadow-inner">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-gray-800 text-[10px] text-gray-400 font-mono">
                <span>solution.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}</span>
                <span>In-Browser Live Execution Engine</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {/* Actions: Run Public Cases vs Final Submit */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunPublicCases}
                className="px-4 py-2 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Test Cases</span>
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={handleFinalSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isRunning ? 'Running All 5 Test Cases...' : 'Submit Final Solution'}</span>
              </button>
            </div>

            {/* Test Case Execution Output Tray */}
            {executionResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-gray-100 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">Test Case Results:</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        executionResult.passedCases >= company.round2RequiredTestCases
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {executionResult.passedCases} / {executionResult.totalCases} Passed (Need {company.round2RequiredTestCases})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    Execution Runtime: {executionResult.totalRuntimeMs} ms
                  </span>
                </div>

                <div className="space-y-2">
                  {executionResult.results.map((r, i) => (
                    <div
                      key={r.testCaseId}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                        r.passed
                          ? 'bg-emerald-50/60 border-emerald-200 text-gray-900'
                          : 'bg-rose-50/60 border-rose-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {r.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-bold">Case {i + 1}:</span>
                        <span className="font-mono text-[11px] text-gray-600 truncate">
                          {r.displayInput}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {r.error ? (
                          <span className="text-[10px] text-rose-600 font-medium truncate max-w-[200px]">
                            {r.error}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">
                            {r.runtimeMs} ms
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
