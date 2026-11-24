'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  User,
  Zap,
} from 'lucide-react';
import { InterviewerPersona } from '@/lib/placement-war-room/types';
import { CompanyLogo } from './CompanyLogos';
import { RealisticAIAvatarRig } from './RealisticAIAvatarRig';

interface VirtualInterviewerTileProps {
  persona: InterviewerPersona;
  currentSpeechText: string;
  isSpeaking: boolean;
  isListening: boolean;
  isAnalyzing: boolean;
  isCounterQuestionActive: boolean;
  onReplaySpeech: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  candidateName?: string;
}

export function VirtualInterviewerTile({
  persona,
  currentSpeechText,
  isSpeaking,
  isListening,
  isAnalyzing,
  isCounterQuestionActive,
  onReplaySpeech,
  onToggleMute,
  isMuted,
  candidateName = 'Candidate',
}: VirtualInterviewerTileProps) {
  const [avatarMode, setAvatarMode] = useState<'animated-rig' | 'studio-feed'>('animated-rig');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toggle user candidate webcam preview
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.warn('Webcam permission not granted or available:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Dual Video Grid (Google Meet / Teams Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main 2 cols: Interviewer Video Tile */}
        <div className="md:col-span-2 relative bg-gray-950 rounded-3xl overflow-hidden border border-gray-800 shadow-xl aspect-16/10 flex flex-col justify-between">
          {/* Animated AI Avatar Rig OR Studio Feed */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {avatarMode === 'animated-rig' ? (
              <RealisticAIAvatarRig
                persona={persona}
                isSpeaking={isSpeaking}
                isListening={isListening}
                isAnalyzing={isAnalyzing}
                isCounterQuestionActive={isCounterQuestionActive}
              />
            ) : (
              <>
                <motion.img
                  src={persona.avatarUrl}
                  alt={persona.name}
                  className="w-full h-full object-cover object-top opacity-90"
                  animate={{
                    scale: isSpeaking ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: isSpeaking ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-gray-950/40" />

                {/* Audio Wave Ring Pulse when speaking */}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0.2, scale: 0.95 }}
                    animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.98, 1.03, 0.98] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute inset-0 border-2 border-emerald-400/50 rounded-3xl pointer-events-none"
                  />
                )}
              </>
            )}
          </div>

          {/* Top Bar: Company Badge, Rig Mode Switcher & Status */}
          <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white shadow-sm">
                <CompanyLogo companyKey={persona.companyKey} size="sm" />
                <span className="text-[11px] font-bold tracking-tight text-white/90 truncate max-w-[130px] sm:max-w-[180px]">
                  {persona.companyName}
                </span>
              </div>

              {/* View Mode Toggle Pill */}
              <button
                type="button"
                onClick={() =>
                  setAvatarMode((prev) =>
                    prev === 'animated-rig' ? 'studio-feed' : 'animated-rig'
                  )
                }
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-black/50 hover:bg-black/70 text-gray-200 border border-white/10 backdrop-blur-md transition-all shadow-2xs"
                title="Switch between Animated 2.5D Rig & Studio Feed"
              >
                <span>{avatarMode === 'animated-rig' ? '🎭 Live Animated Human' : '📸 Studio Mode'}</span>
              </button>
            </div>

            {/* Speaking / Listening Status Pill */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <div className="flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-end gap-0.5 h-3">
                    <motion.span
                      animate={{ height: ['4px', '12px', '4px'] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="w-1 bg-white rounded-full"
                    />
                    <motion.span
                      animate={{ height: ['6px', '14px', '6px'] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                      className="w-1 bg-white rounded-full"
                    />
                    <motion.span
                      animate={{ height: ['4px', '10px', '4px'] }}
                      transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                      className="w-1 bg-white rounded-full"
                    />
                  </div>
                  <span>Interviewer Speaking</span>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-md text-black text-[11px] font-bold px-3 py-1 rounded-full animate-pulse shadow-sm">
                  <Sparkles className="w-3 h-3 text-black" />
                  <span>Analyzing & Formulating Counter-Question...</span>
                </div>
              )}

              {isListening && !isSpeaking && !isAnalyzing && (
                <div className="flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Listening to Candidate</span>
                </div>
              )}

              {isCounterQuestionActive && (
                <div className="hidden sm:flex items-center gap-1 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Counter-Challenge Round</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Interviewer Info & Audio Controls */}
          <div className="relative z-10 p-3.5 sm:p-4 flex items-end justify-between gap-3 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {persona.name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20 text-emerald-300 border border-white/10">
                  Verified Evaluator
                </span>
              </div>
              <p className="text-xs text-gray-300 line-clamp-1">{persona.role}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{persona.experience}</p>
            </div>

            {/* Quick Audio Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReplaySpeech}
                title="Replay Voice"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors backdrop-blur-md border border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border ${
                  isMuted
                    ? 'bg-rose-500/80 text-white border-rose-400'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Candidate Video Tile (Your Feed) */}
        <div className="relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between aspect-16/10 md:aspect-auto">
          {/* Video Stream or Fallback Avatar */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="text-center space-y-2 p-4">
                <div className="w-14 h-14 rounded-full bg-gray-800 text-gray-400 border border-gray-700 flex items-center justify-center mx-auto">
                  <User className="w-7 h-7" />
                </div>
                <div className="text-xs font-semibold text-gray-300">{candidateName}</div>
                <div className="text-[10px] text-gray-500">Camera currently off</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Top Bar for Candidate Tile */}
          <div className="relative z-10 p-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              You (Candidate)
            </span>

            {/* Mic Indicator */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs backdrop-blur-md ${
                isListening
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-black/50 text-gray-400 border border-white/10'
              }`}
            >
              {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Bottom Bar: Camera Toggle Controls */}
          <div className="relative z-10 p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {candidateName}
            </span>

            <button
              type="button"
              onClick={toggleCamera}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 border ${
                isCameraActive
                  ? 'bg-emerald-500/90 text-white border-emerald-400'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300 border-white/10'
              }`}
            >
              {isCameraActive ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
              <span>{isCameraActive ? 'Cam On' : 'Start Cam'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Dialogue / Speech Subtitle Bar */}
      <AnimatePresence mode="wait">
        {currentSpeechText && (
          <motion.div
            key={currentSpeechText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed shadow-sm transition-all flex items-start gap-3 ${
              isCounterQuestionActive
                ? 'bg-rose-50/90 border-rose-200 text-rose-950 ring-1 ring-rose-200'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                isCounterQuestionActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-black text-white'
              }`}
            >
              {isCounterQuestionActive ? <Zap className="w-4 h-4 text-amber-300" /> : 'AI'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  {persona.name}
                </span>
                {isCounterQuestionActive && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800">
                    Live Counter-Challenge
                  </span>
                )}
              </div>
              <p className="font-medium text-gray-800 leading-relaxed">{currentSpeechText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
