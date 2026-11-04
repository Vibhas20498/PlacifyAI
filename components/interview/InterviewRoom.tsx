'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Play,
  ArrowRight,
  Pause,
  LogOut,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import {
  InterviewSession,
  InterviewQuestion,
  AnswerEvaluation,
} from '@/lib/interview/types';

interface InterviewRoomProps {
  session: InterviewSession;
  onSubmitAnswer: (answer: string) => Promise<{ evaluation?: AnswerEvaluation; isComplete: boolean }>;
  onFinishEarly: () => void;
  onSaveAndExit: () => void;
  isEvaluating: boolean;
}

export function InterviewRoom({
  session,
  onSubmitAnswer,
  onFinishEarly,
  onSaveAndExit,
  isEvaluating,
}: InterviewRoomProps) {
  const currentQIndex = session.currentQuestionIndex;
  const currentQuestion: InterviewQuestion | undefined = session.questions[currentQIndex];

  const [answerInput, setAnswerInput] = useState('');
  const [activeCode, setActiveCode] = useState(
    currentQuestion?.codingMetadata?.starterCode || ''
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentQuestion?.codingMetadata?.language || 'python'
  );

  // Voice Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text-to-Speech audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  // Practice mode drawer state
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showPracticeFeedback, setShowPracticeFeedback] = useState(false);

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(session.timeRemainingSeconds || 900);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Reset inputs when question changes
  useEffect(() => {
    if (currentQuestion) {
      setAnswerInput('');
      if (currentQuestion.codingMetadata) {
        setActiveCode(currentQuestion.codingMetadata.starterCode || '');
        setSelectedLanguage(currentQuestion.codingMetadata.language || 'python');
      }
      setShowPracticeFeedback(false);
      setCurrentEvaluation(null);

      // Auto-read question if voice mode is enabled
      if (session.config.mode === 'voice' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speakText(currentQuestion.question);
      }
    }
  }, [currentQIndex, currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (isTimerPaused || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, secondsRemaining]);

  // Speech Recognition initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setAnswerInput((prev) => `${prev} ${transcript}`.trim());
          }
        };

        recog.onerror = (err: any) => {
          console.warn('[Speech Recognition Warning]:', err);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }

      if ('speechSynthesis' in window) {
        setTtsSupported(true);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!currentQuestion) return;
    const finalAnswer = currentQuestion.type === 'coding'
      ? `${answerInput.trim()}\n\n[Code Solution in ${selectedLanguage}]:\n${activeCode}`
      : answerInput.trim();

    if (!finalAnswer || isEvaluating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const { evaluation, isComplete } = await onSubmitAnswer(finalAnswer);

    if (evaluation && session.config.feedbackTiming === 'practice' && !isComplete) {
      setCurrentEvaluation(evaluation);
      setShowPracticeFeedback(true);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalQuestions = session.questions.length;
  const progressPct = Math.round(((currentQIndex) / totalQuestions) * 100);

  if (!currentQuestion) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-700">Loading interview question...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-black font-heading">
              {session.config.targetRole}
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-mono font-medium text-gray-500">
            {session.config.targetCompany}
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
            {session.config.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
              secondsRemaining < 180
                ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                : 'bg-gray-50 text-gray-800 border-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Pause / Exit controls */}
          <button
            type="button"
            onClick={onSaveAndExit}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all shadow-2xs"
            title="Save and return to dashboard"
          >
            Save & Exit
          </button>

          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all shadow-2xs"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
          <span className="font-bold text-black">
            Question {currentQIndex + 1} of {totalQuestions}
          </span>
          <span>{progressPct}% Completed</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/80">
          <motion.div
            className="h-full bg-black rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Interview Question Card with AI Persona */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs card-hover-lift relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-base shadow-sm">
                AI
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-black font-heading">
                  AI Placement Interviewer
                </span>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQuestion.category}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Listening & Evaluating against {session.config.targetCompany} Rubrics
              </p>
            </div>
          </div>

          {/* Text-to-Speech audio button */}
          {ttsSupported && (
            <button
              type="button"
              onClick={() => speakText(currentQuestion.question)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
              title={isSpeaking ? 'Stop Audio' : 'Listen to Question'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Question Text */}
        <div className="pt-2">
          <h3 className="text-base sm:text-lg font-bold text-black leading-relaxed font-heading">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Resume Grounding Citation Badge */}
        {currentQuestion.groundingReference && (
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/90 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800">Resume Grounded Question: </span>
              <span className="text-gray-600 leading-relaxed">
                {currentQuestion.groundingReference.sourceText}
              </span>
            </div>
          </div>
        )}

        {/* Coding Challenge Metadata (if coding question) */}
        {currentQuestion.codingMetadata && (
          <div className="space-y-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-gray-700">
                Code Editor & Problem Workspace
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border border-gray-200 bg-white focus:outline-none"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            {/* Example block */}
            {currentQuestion.codingMetadata.examples?.[0] && (
              <div className="p-3 bg-gray-50 rounded-xl font-mono text-[11px] text-gray-700 space-y-1 border border-gray-200">
                <div>
                  <span className="font-bold text-black">Input: </span>
                  <span>{currentQuestion.codingMetadata.examples[0].input}</span>
                </div>
                <div>
                  <span className="font-bold text-black">Output: </span>
                  <span>{currentQuestion.codingMetadata.examples[0].output}</span>
                </div>
              </div>
            )}

            {/* Monospace Code Editor Area */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-inner">
              <div className="bg-slate-900 px-4 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>solution.{selectedLanguage === 'python' ? 'py' : 'js'}</span>
                <span>Type your code below</span>
              </div>
              <textarea
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                placeholder="Write your code implementation here..."
                rows={8}
                className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none leading-relaxed resize-y"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Answer Input Workspace */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>Your Response</span>
            <span className="text-gray-400 font-normal">
              (Use technical metrics & STAR format)
            </span>
          </label>

          {/* Voice Input Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-black'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Recording... Click to Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Answer with Voice</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Textarea */}
        <textarea
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak or type your answer clearly. Explain your technical choices, edge cases, trade-offs, and measurable impact..."
          rows={6}
          disabled={isEvaluating}
          className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all leading-relaxed resize-y"
        />

        {/* Actions & Submit Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="text-[11px] text-gray-400 font-mono">
            <span>{answerInput.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span className="hidden sm:inline"> • Press </span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded font-mono">
              Ctrl+Enter
            </kbd>
            <span className="hidden sm:inline"> to submit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAnswerInput('I would like to move to the next question.');
                handleSend();
              }}
              disabled={isEvaluating}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            >
              Skip Question
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!answerInput.trim() || isEvaluating}
              className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:hover:bg-black btn-press"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Coaching Drawer (Practice Mode) */}
      <AnimatePresence>
        {showPracticeFeedback && currentEvaluation && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="p-6 sm:p-7 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase font-mono text-emerald-400">
                  Practice Mode Feedback
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                  Score: {currentEvaluation.overallScore}/100
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPracticeFeedback(false)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Coaching Box
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Technical</div>
                <div className="text-base font-bold text-white mt-1">
                  {currentEvaluation.dimensionScores.technicalAccuracy}%
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Depth</div>
                <div className="text-base font-bold text-white mt-1">
                  {currentEvaluation.dimensionScores.depthAndCompleteness}%
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Clarity</div>
                <div className="text-base font-bold text-white mt-1">
                  {currentEvaluation.dimensionScores.clarityAndCommunication}%
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="text-[10px] text-slate-400 uppercase font-mono">STAR / Practical</div>
                <div className="text-base font-bold text-white mt-1">
                  {currentEvaluation.dimensionScores.starFormulationOrPracticality}%
                </div>
              </div>
            </div>

            {/* Strengths & Missing Concepts */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <h5 className="font-bold text-emerald-400">What went well:</h5>
                <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
                  {currentEvaluation.whatWentWell.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              {currentEvaluation.missingOrIncorrectConcepts.length > 0 && (
                <div>
                  <h5 className="font-bold text-amber-400">Missing concepts to address:</h5>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
                    {currentEvaluation.missingOrIncorrectConcepts.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Improved Answer */}
              {currentEvaluation.sampleImprovedAnswer && (
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase font-mono text-sky-400 block">
                    Exemplary Benchmark Answer:
                  </span>
                  <p className="text-slate-300 text-xs italic leading-relaxed">
                    "{currentEvaluation.sampleImprovedAnswer}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal to End Interview Early */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl border border-gray-200">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black font-heading">
                End Interview Session?
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                You have answered {currentQIndex} of {totalQuestions} questions. Ending now will generate your performance report and roadmap based on completed answers.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onFinishEarly();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
              >
                Yes, End & View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
