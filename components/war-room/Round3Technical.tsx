'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Mic,
  MicOff,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Award,
} from 'lucide-react';
import { CompanyDriveProfile, TechnicalInterviewQuestion } from '@/lib/placement-war-room/types';
import { MASTER_TECHNICAL_QUESTIONS } from '@/lib/placement-war-room/drive-data';
import { getCompanyInterviewer } from '@/lib/placement-war-room/interviewer-personas';
import {
  speakInterviewerText,
  generateCounterQuestion,
  evaluateMultiTurnDefense,
  MultiTurnEvaluationResult,
} from '@/lib/placement-war-room/interviewer-engine';
import { VirtualInterviewerTile } from './VirtualInterviewerTile';

interface Round3TechnicalProps {
  company: CompanyDriveProfile;
  candidateName?: string;
  onCompleteRound: (result: {
    answers: { questionId: string; answerText: string; feedback: string; score: number }[];
    averageScore: number;
    passed: boolean;
  }) => void;
}

type QuestionTurnStage =
  | 'initial-answering'
  | 'analyzing-counter'
  | 'counter-answering'
  | 'turn-evaluated';

export function Round3Technical({
  company,
  candidateName = 'Placement Aspirant',
  onCompleteRound,
}: Round3TechnicalProps) {
  const persona = getCompanyInterviewer(company.key, 'technical');
  const questions = MASTER_TECHNICAL_QUESTIONS[company.key] || MASTER_TECHNICAL_QUESTIONS['tcs-digital'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [stage, setStage] = useState<QuestionTurnStage>('initial-answering');

  // Answers state
  const [initialAnswer, setInitialAnswer] = useState('');
  const [counterQuestion, setCounterQuestion] = useState('');
  const [counterChallengeAngle, setCounterChallengeAngle] = useState('');
  const [counterAnswer, setCounterAnswer] = useState('');

  // Audio / Voice state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const recognitionRef = useRef<any>(null);
  const stopSpeechRef = useRef<(() => void) | null>(null);

  // Evaluation state
  const [currentEvaluation, setCurrentEvaluation] = useState<MultiTurnEvaluationResult | null>(null);
  const [allEvaluatedResults, setAllEvaluatedResults] = useState<Record<string, any>>({});

  const currentQ = questions[currentIdx] || questions[0];
  const initialWordCount = initialAnswer.trim().split(/\s+/).filter(Boolean).length;
  const counterWordCount = counterAnswer.trim().split(/\s+/).filter(Boolean).length;

  // Speak text helper
  const triggerSpeech = (text: string) => {
    if (isMuted) return;
    if (stopSpeechRef.current) stopSpeechRef.current();

    setSpeechText(text);
    const cancelFn = speakInterviewerText(
      text,
      persona,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
    stopSpeechRef.current = cancelFn;
  };

  // On question change or mount: speak initial question
  useEffect(() => {
    setInitialAnswer('');
    setCounterQuestion('');
    setCounterAnswer('');
    setCurrentEvaluation(null);
    setStage('initial-answering');

    const fullPrompt = `${currentQ.question}`;
    triggerSpeech(fullPrompt);

    return () => {
      if (stopSpeechRef.current) stopSpeechRef.current();
    };
  }, [currentIdx, currentQ.id]);

  // Speech-to-Text Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recog = new SpeechRec();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            if (stage === 'counter-answering') {
              setCounterAnswer((prev) => `${prev} ${transcript}`.trim());
            } else {
              setInitialAnswer((prev) => `${prev} ${transcript}`.trim());
            }
          }
        };

        recog.onerror = () => setIsListening(false);
        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      }
    }
  }, [stage]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (isSpeaking && stopSpeechRef.current) {
          stopSpeechRef.current();
          setIsSpeaking(false);
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition error:', e);
      }
    }
  };

  // Step 1: Submit Initial Defense -> Interviewer generates Counter-Question
  const handleProceedToCounter = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setStage('analyzing-counter');

    setTimeout(() => {
      const counterResult = generateCounterQuestion({
        companyKey: company.key,
        round: 'technical',
        topic: currentQ.topic,
        originalQuestion: currentQ.question,
        candidateAnswer: initialAnswer,
        personaName: persona.name,
      });

      setCounterQuestion(counterResult.counterQuestion);
      setCounterChallengeAngle(counterResult.challengeAngle);
      setStage('counter-answering');

      // Speak counter-question out loud!
      triggerSpeech(counterResult.counterQuestion);
    }, 1200);
  };

  // Step 2: Submit Counter-Rebuttal -> Evaluate defense
  const handleEvaluateTurn = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking && stopSpeechRef.current) {
      stopSpeechRef.current();
      setIsSpeaking(false);
    }

    const evalResult = evaluateMultiTurnDefense(
      currentQ.question,
      initialAnswer,
      counterQuestion,
      counterAnswer,
      currentQ.sampleExpectedPoints,
      false
    );

    setCurrentEvaluation(evalResult);
    setStage('turn-evaluated');

    const combinedAnswerRecord = {
      questionId: currentQ.id,
      answerText: `[Initial Defense]: ${initialAnswer}\n\n[Cross-Exam Counter]: ${counterQuestion}\n\n[Rebuttal Defense]: ${counterAnswer}`,
      feedback: evalResult.feedback,
      score: evalResult.score,
    };

    setAllEvaluatedResults((prev) => ({
      ...prev,
      [currentQ.id]: combinedAnswerRecord,
    }));
  };

  // Step 3: Advance to next question or complete round
  const handleAdvance = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate overall technical score
      const results = Object.values(allEvaluatedResults);
      const totalScore = results.reduce((sum, item: any) => sum + item.score, 0);
      const averageScore = Math.round(totalScore / results.length);
      const passed = averageScore >= company.round3PassingScore;

      onCompleteRound({
        answers: results as any,
        averageScore,
        passed,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm">
            R3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">
                Round 3: Live Technical & Architecture Defense
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Cutoff Bar: {company.round3PassingScore}/100
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live Video Interview with {persona.name} • System Design, Trade-offs & Cross-Examination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            Defense Topic {currentIdx + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* VIRTUAL INTERVIEWER DUAL VIDEO TILE */}
      <VirtualInterviewerTile
        persona={persona}
        currentSpeechText={speechText}
        isSpeaking={isSpeaking}
        isListening={isListening}
        isAnalyzing={stage === 'analyzing-counter'}
        isCounterQuestionActive={stage === 'counter-answering'}
        onReplaySpeech={() =>
          triggerSpeech(
            stage === 'counter-answering' ? counterQuestion : currentQ.question
          )
        }
        onToggleMute={() => {
          if (!isMuted && stopSpeechRef.current) stopSpeechRef.current();
          setIsMuted(!isMuted);
        }}
        isMuted={isMuted}
        candidateName={candidateName}
      />

      {/* QUESTION & MULTI-TURN RESPONSE WORKSPACE */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Core Topic Info */}
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-mono uppercase">
              Topic: {currentQ.topic}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {currentQ.question}
          </h3>

          <div className="flex items-start gap-2 bg-purple-50/60 p-3 rounded-2xl border border-purple-100 text-xs text-purple-950">
            <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p>
              <strong>Interviewer Evaluation Focus:</strong> {currentQ.contextTip}
            </p>
          </div>
        </div>

        {/* STEP 1: INITIAL TECHNICAL RESPONSE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-gray-800 flex items-center gap-1.5">
              <span>Step 1: Your Initial Architecture & System Proposal</span>
              <span className="text-gray-400 font-normal">(Voice or Text)</span>
            </label>

            {/* Voice Dictation Toggle */}
            <button
              type="button"
              onClick={toggleListening}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isListening && stage === 'initial-answering'
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {isListening && stage === 'initial-answering' ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Dictating</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-blue-600" />
                  <span>Speak Answer (Mic)</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={initialAnswer}
            onChange={(e) => setInitialAnswer(e.target.value)}
            disabled={stage !== 'initial-answering'}
            rows={5}
            placeholder="Explain your technical design, chosen database/cache structures, concurrency model, and architectural trade-offs..."
            className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/10 resize-none disabled:bg-gray-50 disabled:text-gray-600"
          />

          {stage === 'initial-answering' && (
            <div className="flex items-center justify-between pt-1">
              <span
                className={`text-xs font-mono ${
                  initialWordCount < 20 ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {initialWordCount} words {initialWordCount < 20 && '(Minimum ~20 words recommended)'}
              </span>

              <button
                type="button"
                disabled={initialWordCount < 10}
                onClick={handleProceedToCounter}
                className="px-5 py-2.5 text-xs font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Initial Proposal & Hear Counter-Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: THE INTERVIEWER COUNTER-QUESTION (CROSS-EXAMINATION) */}
        {(stage === 'counter-answering' || stage === 'turn-evaluated') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-800">
                    Live Counter-Challenge by {persona.name}
                  </span>
                </div>
                <p className="text-xs text-rose-700">{counterChallengeAngle}</p>
              </div>

              <button
                type="button"
                onClick={() => triggerSpeech(counterQuestion)}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-800 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 flex items-center gap-1 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            </div>

            <p className="text-sm font-semibold text-rose-950 bg-white/80 p-3.5 rounded-xl border border-rose-100 leading-relaxed">
              {counterQuestion}
            </p>

            {/* Rebuttal Defense Input */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-gray-800 flex items-center gap-1.5">
                  <span>Step 2: Defend Your Decision & Justify The Trade-Off:</span>
                </label>

                <button
                  type="button"
                  onClick={toggleListening}
                  className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    isListening && stage === 'counter-answering'
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {isListening && stage === 'counter-answering' ? (
                    <>
                      <MicOff className="w-3 h-3" />
                      <span>Stop Dictating</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-rose-600" />
                      <span>Speak Rebuttal (Mic)</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={counterAnswer}
                onChange={(e) => setCounterAnswer(e.target.value)}
                disabled={stage !== 'counter-answering'}
                rows={4}
                placeholder="Address the failure scenario directly: mention fallback plans, cache stampede prevention (jitter TTL / locks), circuit breakers, or retry policies..."
                className="w-full p-4 rounded-xl border border-rose-200 text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white resize-none disabled:bg-gray-50"
              />

              {stage === 'counter-answering' && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-gray-500">
                    {counterWordCount} words entered
                  </span>

                  <button
                    type="button"
                    disabled={counterWordCount < 8}
                    onClick={handleEvaluateTurn}
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Submit Complete Defense & Score</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: SCORE BREAKDOWN & FEEDBACK */}
        {stage === 'turn-evaluated' && currentEvaluation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Defense Evaluation Result
                </span>
              </div>

              <div className="text-sm font-black font-mono px-3 py-1 rounded-xl bg-black text-white">
                {currentEvaluation.score} / 100
              </div>
            </div>

            {/* Sub-Score Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Technical Depth</div>
                <div className="text-sm font-bold text-gray-900">
                  {currentEvaluation.breakdown.technicalDepth}%
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Counter-Rebuttal</div>
                <div className="text-sm font-bold text-gray-900">
                  {currentEvaluation.breakdown.counterDefense}%
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Architectural Clarity</div>
                <div className="text-sm font-bold text-gray-900">
                  {currentEvaluation.breakdown.clarity}%
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200 leading-relaxed">
              <strong>Panel Feedback:</strong> {currentEvaluation.feedback}
            </p>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAdvance}
                className="px-6 py-2.5 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIdx < questions.length - 1
                    ? 'Next Technical Topic'
                    : 'Complete Round 3 & Advance to HR'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
