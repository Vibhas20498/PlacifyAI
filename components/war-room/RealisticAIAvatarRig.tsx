'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewerPersona } from '@/lib/placement-war-room/types';

interface RealisticAIAvatarRigProps {
  persona: InterviewerPersona;
  isSpeaking: boolean;
  isListening: boolean;
  isAnalyzing: boolean;
  isCounterQuestionActive: boolean;
}

export function RealisticAIAvatarRig({
  persona,
  isSpeaking,
  isListening,
  isAnalyzing,
  isCounterQuestionActive,
}: RealisticAIAvatarRigProps) {
  // 1. Lip-Sync Mouth State (0 = closed, 1 = slight open, 2 = wide open / vowel, 3 = round / 'o', 4 = broad / 'e')
  const [mouthShape, setMouthShape] = useState<number>(0);

  // 2. Eye Blinking State
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // 3. Head Nod Counter for active listening
  const [nodTrigger, setNodTrigger] = useState<number>(0);

  // 4. Subtle Pupil Gaze Shift
  const [pupilShift, setPupilShift] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Continuous Lip-Sync Sequencer when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthShape(0);
      return;
    }

    // Realistic phoneme rhythm: syllables change every 140ms - 220ms
    const mouthSequence = [2, 1, 3, 2, 4, 1, 2, 0, 3, 1, 2, 4];
    let seqIdx = 0;

    const interval = setInterval(() => {
      seqIdx = (seqIdx + 1) % mouthSequence.length;
      setMouthShape(mouthSequence[seqIdx]);
    }, 160);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural Eye Blinking Timer (Blinks randomly every 3 to 5 seconds)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const nextDelay = 3000 + Math.random() * 2500; // 3 to 5.5s
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 140); // natural blink duration
      }, nextDelay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Attentive Head Nodding when Listening to Candidate
  useEffect(() => {
    if (!isListening) return;

    // Nods attentively every 2.8 seconds
    const nodInterval = setInterval(() => {
      setNodTrigger((prev) => prev + 1);
    }, 2800);

    return () => clearInterval(nodInterval);
  }, [isListening]);

  // Thinking Gaze Shift when Analyzing / Formulating Counter-Question
  useEffect(() => {
    if (isAnalyzing) {
      setPupilShift({ x: -2, y: -2 }); // looks slightly up and to the side in thought
    } else if (isSpeaking) {
      // gentle random conversational gaze adjustments
      setPupilShift({ x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 1 });
    } else {
      setPupilShift({ x: 0, y: 0 }); // direct eye contact with candidate
    }
  }, [isAnalyzing, isSpeaking]);

  const isFemale = persona.gender === 'female';
  const hasGlasses = persona.id.includes('rajesh') || persona.id.includes('rohan');

  // Mouth dimension calculations based on current viseme shape
  const getMouthDimensions = () => {
    switch (mouthShape) {
      case 1: // slight open
        return { width: 24, height: 7, teethVisible: true, tongueVisible: false };
      case 2: // wide open / vowel 'ah'
        return { width: 28, height: 16, teethVisible: true, tongueVisible: true };
      case 3: // round 'oh', 'oo'
        return { width: 18, height: 14, teethVisible: false, tongueVisible: true };
      case 4: // broad 'ee', 'ay'
        return { width: 30, height: 9, teethVisible: true, tongueVisible: false };
      case 0: // closed resting
      default:
        return { width: 22, height: 2, teethVisible: false, tongueVisible: false };
    }
  };

  const mouth = getMouthDimensions();

  // Head tilt & movement calculation based on states
  let headRotate = 0;
  let headTranslateY = 0;
  let headScale = 1;

  if (isAnalyzing) {
    headRotate = 2.5; // curious/thoughtful head tilt
    headTranslateY = -2;
  } else if (isCounterQuestionActive) {
    headScale = 1.03; // leans in slightly during cross-examination
    headTranslateY = -3;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-black select-none">
      {/* 1. Realistic Corporate Office Background (Modern Tech Boardroom Bokeh) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-gray-950/80 to-black" />
        {/* Soft background conference room lights & glass reflection */}
        <div className="absolute top-10 left-12 w-48 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-16 right-16 w-56 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90" />
      </div>

      {/* 2. Main Human Character Rig (SVG / Canvas Hybrid Layer) */}
      <motion.div
        className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] aspect-4/3 flex items-center justify-center"
        animate={{
          y: isListening ? [0, 4, 0] : [0, -1.5, 0], // subtle breathing or listening nods
          rotate: headRotate,
          scale: headScale,
        }}
        transition={{
          y: isListening
            ? { duration: 0.8, ease: 'easeInOut' }
            : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.5 },
          scale: { duration: 0.5 },
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin Tone Gradient (Warm Natural Corporate Lighting) */}
            <radialGradient id="skinGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor={isFemale ? '#F5D0B5' : '#E8B99A'} />
              <stop offset="70%" stopColor={isFemale ? '#E3B596' : '#D49E7C'} />
              <stop offset="100%" stopColor={isFemale ? '#C89675' : '#BA805E'} />
            </radialGradient>

            {/* Suit Blazer Gradient */}
            <linearGradient id="suitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Shirt Gradient */}
            <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Hair Gradient */}
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#33241A" />
              <stop offset="100%" stopColor="#1A120D" />
            </linearGradient>

            {/* Shadow Filter */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* TORSO & CLOTHING RIG */}
          <g id="torso">
            {/* Shoulders & Suit Jacket */}
            <path
              d="M50 290 C65 240 100 220 150 220 C200 220 235 240 250 290 Z"
              fill="url(#suitGrad)"
            />
            {/* Inner Formal Shirt / Blouse */}
            <path
              d="M125 220 L150 275 L175 220 Z"
              fill="url(#shirtGrad)"
            />
            {/* Tie / Formal Neckline Accent */}
            {!isFemale && (
              <path
                d="M146 230 L154 230 L156 280 L150 290 L144 280 Z"
                fill="#3B82F6"
              />
            )}
            {/* Suit Lapels */}
            <path
              d="M110 220 L135 285 L145 285 L125 220 Z"
              fill="#0F172A"
            />
            <path
              d="M190 220 L165 285 L155 285 L175 220 Z"
              fill="#0F172A"
            />
            {/* Company Badge Pin on Lapel */}
            <rect x="85" y="248" width="16" height="22" rx="3" fill="#0284C7" />
            <rect x="88" y="251" width="10" height="6" rx="1" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* NECK */}
          <path
            d="M130 170 L130 225 C140 230 160 230 170 225 L170 170 Z"
            fill="url(#skinGrad)"
          />
          {/* Subtle Neck Shadow Under Chin */}
          <ellipse cx="150" cy="180" rx="22" ry="6" fill="#000000" opacity="0.18" />

          {/* HEAD & FACE RIG */}
          <g id="head" filter="url(#softShadow)">
            {/* Base Face Contour */}
            <path
              d={
                isFemale
                  ? 'M105 100 C105 60 195 60 195 100 C195 145 178 185 150 185 C122 185 105 145 105 100 Z'
                  : 'M100 95 C100 55 200 55 200 95 C200 145 185 186 150 186 C115 186 100 145 100 95 Z'
              }
              fill="url(#skinGrad)"
            />

            {/* EARS */}
            <ellipse cx="98" cy="115" rx="6" ry="12" fill="url(#skinGrad)" />
            <ellipse cx="202" cy="115" rx="6" ry="12" fill="url(#skinGrad)" />

            {/* HAIR STYLE (Tailored for Gender) */}
            {isFemale ? (
              <g id="hairFemale">
                {/* Long/styled professional hair framing face */}
                <path
                  d="M90 120 C85 60 120 35 150 35 C180 35 215 60 210 120 C205 150 200 190 205 210 C195 190 195 140 190 110 C180 70 120 70 110 110 C105 140 105 190 95 210 C100 190 95 150 90 120 Z"
                  fill="url(#hairGrad)"
                />
              </g>
            ) : (
              <g id="hairMale">
                {/* Short, sharp corporate parted haircut */}
                <path
                  d="M95 90 C92 55 125 40 150 40 C175 40 208 55 205 90 C202 75 195 60 175 58 C155 56 125 60 110 72 C100 80 97 88 95 90 Z"
                  fill="url(#hairGrad)"
                />
              </g>
            )}

            {/* EYEBROWS */}
            <path
              d={
                isAnalyzing
                  ? 'M120 90 Q130 86 142 90' // furrowed / raised during thinking
                  : 'M120 92 Q131 88 142 91'
              }
              stroke="#2B1D14"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={
                isAnalyzing
                  ? 'M158 90 Q170 85 180 88' // one brow slightly raised
                  : 'M158 91 Q169 88 180 92'
              }
              stroke="#2B1D14"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* EYES (With Natural Blinking & Pupil Tracking) */}
            <g id="eyes">
              {isBlinking ? (
                // Natural Closed Eyelid Crease during Blink
                <>
                  <path d="M122 106 Q131 108 140 106" stroke="#5C3826" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M160 106 Q169 108 178 106" stroke="#5C3826" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                // Open Eyes with Sclera, Iris, and Gaze Tracking
                <>
                  {/* Left Eye Sclera */}
                  <ellipse cx="131" cy="105" rx="9" ry="6" fill="#F8FAFC" />
                  {/* Left Eye Iris */}
                  <circle cx={131 + pupilShift.x} cy={105 + pupilShift.y} r="4.2" fill="#3D2619" />
                  {/* Left Eye Pupil */}
                  <circle cx={131 + pupilShift.x} cy={105 + pupilShift.y} r="2.2" fill="#0F0A06" />
                  {/* Left Eye Specular Reflection */}
                  <circle cx={130 + pupilShift.x} cy={104 + pupilShift.y} r="1.1" fill="#FFFFFF" />

                  {/* Right Eye Sclera */}
                  <ellipse cx="169" cy="105" rx="9" ry="6" fill="#F8FAFC" />
                  {/* Right Eye Iris */}
                  <circle cx={169 + pupilShift.x} cy={105 + pupilShift.y} r="4.2" fill="#3D2619" />
                  {/* Right Eye Pupil */}
                  <circle cx={169 + pupilShift.x} cy={105 + pupilShift.y} r="2.2" fill="#0F0A06" />
                  {/* Right Eye Specular Reflection */}
                  <circle cx={168 + pupilShift.x} cy={104 + pupilShift.y} r="1.1" fill="#FFFFFF" />
                </>
              )}
            </g>

            {/* GLASSES (For Technical Architects Dr. Rajesh & Rohan Mehra) */}
            {hasGlasses && (
              <g id="glasses" stroke="#0F172A" strokeWidth="2" fill="none">
                <rect x="118" y="96" width="26" height="18" rx="4" fill="rgba(255,255,255,0.08)" />
                <rect x="156" y="96" width="26" height="18" rx="4" fill="rgba(255,255,255,0.08)" />
                <line x1="144" y1="105" x2="156" y2="105" />
                {/* Subtle Lens Glare */}
                <line x1="122" y1="99" x2="128" y2="111" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
                <line x1="160" y1="99" x2="166" y2="111" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
              </g>
            )}

            {/* NOSE */}
            <path
              d="M148 112 L147 132 Q150 135 153 132"
              stroke="#A87352"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* DYNAMIC LIP-SYNC TALKING MOUTH RIG */}
            <g id="mouth">
              {mouthShape === 0 ? (
                // Closed resting mouth with gentle professional smile
                <path
                  d="M138 155 Q150 158 162 155"
                  stroke="#9E4D45"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Open speaking mouth with teeth & tongue
                <g>
                  {/* Inner Mouth Cavity */}
                  <rect
                    x={150 - mouth.width / 2}
                    y={155 - mouth.height / 2}
                    width={mouth.width}
                    height={mouth.height}
                    rx={Math.min(mouth.height / 2, 7)}
                    fill="#450A0A"
                  />
                  {/* Upper Teeth Bar */}
                  {mouth.teethVisible && (
                    <rect
                      x={150 - (mouth.width - 6) / 2}
                      y={155 - mouth.height / 2 + 1}
                      width={mouth.width - 6}
                      height={Math.min(4, mouth.height / 2)}
                      rx="1"
                      fill="#F8FAFC"
                    />
                  )}
                  {/* Tongue Accent */}
                  {mouth.tongueVisible && (
                    <ellipse
                      cx="150"
                      cy={155 + mouth.height / 2 - 2}
                      rx={mouth.width / 3.5}
                      ry={Math.min(3, mouth.height / 3)}
                      fill="#DC2626"
                      opacity="0.9"
                    />
                  )}
                  {/* Upper Lip Contour */}
                  <path
                    d={`M${150 - mouth.width / 2} 155 Q150 ${153 - mouth.height / 4} ${150 + mouth.width / 2} 155`}
                    stroke="#881337"
                    strokeWidth="1.8"
                    fill="none"
                  />
                </g>
              )}
            </g>
          </g>
        </svg>
      </motion.div>

      {/* 3. Subtle Ambient Light Reflection & Video Scanlines Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
