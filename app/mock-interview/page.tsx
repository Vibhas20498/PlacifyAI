'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import {
  InterviewConfig,
  InterviewSession,
  InterviewReport,
  InterviewRoadmapTask,
  PastInterviewSummary,
} from '@/lib/interview/types';
import {
  startInterviewSession,
  submitInterviewAnswer,
  finishInterviewSession,
  getActiveSessionLocally,
  clearActiveSessionLocally,
  fetchPastInterviewHistory,
} from '@/lib/interview/client-service';
import { InterviewSetupWizard } from '@/components/interview/InterviewSetupWizard';
import { InterviewRoom } from '@/components/interview/InterviewRoom';
import { InterviewReportView } from '@/components/interview/InterviewReportView';
import { InterviewRoadmapView } from '@/components/interview/InterviewRoadmapView';
import { InterviewHistoryView } from '@/components/interview/InterviewHistoryView';
import {
  Mic,
  Award,
  Map,
  Clock,
  Sparkles,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

type InterviewViewTab = 'setup' | 'interview' | 'report' | 'roadmap' | 'history';

export default function MockInterviewPage() {
  const { profile, updateProfile } = useUser();

  const [activeTab, setActiveTab] = useState<InterviewViewTab>('setup');
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentReport, setCurrentReport] = useState<InterviewReport | null>(null);
  const [currentRoadmap, setCurrentRoadmap] = useState<InterviewRoadmapTask[]>([]);
  const [historyList, setHistoryList] = useState<PastInterviewSummary[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSessionToResume, setActiveSessionToResume] = useState<InterviewSession | null>(null);

  // 1. Initial check for in-progress session and past history
  useEffect(() => {
    // Check local storage for an active session to resume
    const cached = getActiveSessionLocally();
    if (cached && cached.status === 'active' && cached.currentQuestionIndex < cached.questions.length) {
      setActiveSessionToResume(cached);
    }

    // Load past interview history
    fetchPastInterviewHistory(profile.email).then((list) => {
      setHistoryList(list);
    });
  }, [profile.email]);

  // Handle Starting a New Interview Session
  const handleStartInterview = async (config: InterviewConfig) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Fetch stored resume text from localStorage if available
      let resumeText = '';
      try {
        const storedAnalysis = localStorage.getItem('placify_last_resume_analysis');
        if (storedAnalysis) {
          const parsed = JSON.parse(storedAnalysis);
          resumeText = parsed.rawText || '';
        }
      } catch {}

      const session = await startInterviewSession(config, profile, resumeText);
      setCurrentSession(session);
      setActiveSessionToResume(null);
      setActiveTab('interview');
    } catch (err: any) {
      console.error('[Start Interview Error]:', err);
      setErrorMessage(err.message || 'Failed to initialize mock interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resume In-Progress Interview
  const handleResumeSession = () => {
    if (activeSessionToResume) {
      setCurrentSession(activeSessionToResume);
      setActiveSessionToResume(null);
      setActiveTab('interview');
    }
  };

  // Dismiss In-Progress Session
  const handleDiscardSession = () => {
    clearActiveSessionLocally();
    setActiveSessionToResume(null);
  };

  // Handle Submitting Answer
  const handleSubmitAnswer = async (answer: string) => {
    if (!currentSession) return { isComplete: false };
    setIsEvaluating(true);

    try {
      const { updatedSession, evaluation, isComplete } = await submitInterviewAnswer(
        currentSession,
        answer
      );
      setCurrentSession(updatedSession);

      if (isComplete) {
        // Automatically finish session and generate report
        await handleFinishSession(updatedSession);
      }

      return { evaluation, isComplete };
    } catch (err: any) {
      console.error('[Submit Answer Error]:', err);
      setErrorMessage('Failed to evaluate answer. Please try again.');
      return { isComplete: false };
    } finally {
      setIsEvaluating(false);
    }
  };

  // Finish Interview & Compile Report + Roadmap
  const handleFinishSession = async (sessionToFinish?: InterviewSession) => {
    const s = sessionToFinish || currentSession;
    if (!s) return;
    setIsLoading(true);

    try {
      const { completedSession, report, roadmap } = await finishInterviewSession(s);
      setCurrentSession(completedSession);
      setCurrentReport(report);
      setCurrentRoadmap(roadmap);

      // Update user placement readiness and history
      if (report.overallScore > 0) {
        const scoreBonus = Math.min(10, Math.round(report.overallScore / 10));
        updateProfile(
          {
            careerReadinessScore: Math.min(98, (profile.careerReadinessScore || 70) + scoreBonus),
          },
          true
        );
      }

      // Refresh history list
      fetchPastInterviewHistory(profile.email).then((list) => setHistoryList(list));

      setActiveTab('report');
    } catch (err: any) {
      console.error('[Finish Interview Error]:', err);
      setErrorMessage('Failed to generate final report. Session saved locally.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save and Return to Setup
  const handleSaveAndExit = () => {
    setActiveTab('setup');
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Strip with Title & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-black font-heading">
                AI Placement Mock Interview
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Resume Grounded
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 font-sans">
              Personalized technical, behavioral, and coding simulations with multi-dimensional rubric scoring.
            </p>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl border border-gray-200/80 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'setup'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Interview Setup</span>
            </button>

            {currentSession && currentSession.status === 'active' && (
              <button
                type="button"
                onClick={() => setActiveTab('interview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'interview'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Live Interview</span>
              </button>
            )}

            {currentReport && (
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Evaluation Report</span>
              </button>
            )}

            {currentRoadmap.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'roadmap'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Practice Roadmap</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History ({historyList.length})</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-xs font-bold text-rose-900 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* In-Progress Session Recovery Banner */}
        {activeSessionToResume && activeTab === 'setup' && (
          <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover-lift">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-base">
                <Mic className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-heading">
                  Resume In-Progress Interview Session
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  You have an unfinished {activeSessionToResume.config.targetRole} interview ({activeSessionToResume.currentQuestionIndex + 1} of {activeSessionToResume.questions.length} questions).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleDiscardSession}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleResumeSession}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-100 transition-all shadow-xs"
              >
                Resume Session &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Active Tab View Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewSetupWizard
                profile={profile}
                onStartInterview={handleStartInterview}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {activeTab === 'interview' && currentSession && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewRoom
                session={currentSession}
                onSubmitAnswer={handleSubmitAnswer}
                onFinishEarly={() => handleFinishSession()}
                onSaveAndExit={handleSaveAndExit}
                isEvaluating={isEvaluating}
              />
            </motion.div>
          )}

          {activeTab === 'report' && currentReport && currentSession && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewReportView
                session={currentSession}
                report={currentReport}
                onViewRoadmap={() => setActiveTab('roadmap')}
                onRetakeInterview={() => setActiveTab('setup')}
              />
            </motion.div>
          )}

          {activeTab === 'roadmap' && currentSession && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewRoadmapView
                tasks={currentRoadmap}
                targetRole={currentSession.config.targetRole}
                onRetakeInterview={() => setActiveTab('setup')}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <InterviewHistoryView
                history={historyList}
                onStartNew={() => setActiveTab('setup')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
