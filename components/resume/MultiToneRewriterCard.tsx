'use client';

import React, { useState } from 'react';
import {
  Wand2,
  Sliders,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Server,
  Layout,
  Brain,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import {
  rewriteBulletWithPersonaTone,
  BulletTone,
  MultiToneBulletSuggestion,
} from '@/lib/resume/analyzer';

interface MultiToneRewriterCardProps {
  bulletList: string[];
}

export function MultiToneRewriterCard({ bulletList }: MultiToneRewriterCardProps) {
  const [selectedBulletIndex, setSelectedBulletIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [activeTone, setActiveTone] = useState<BulletTone>('scale');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeBullet =
    customInput.trim() ||
    bulletList[selectedBulletIndex] ||
    'Worked on building a web app for student career analytics.';

  const toneResult: MultiToneBulletSuggestion = rewriteBulletWithPersonaTone(activeBullet);
  const currentToneOption =
    toneResult.tones.find((t) => t.tone === activeTone) || toneResult.tones[0];

  const toneIcons: Record<BulletTone, React.ReactNode> = {
    scale: <Server className="w-3.5 h-3.5" />,
    product: <Layout className="w-3.5 h-3.5" />,
    research: <Brain className="w-3.5 h-3.5" />,
    leadership: <Crown className="w-3.5 h-3.5" />,
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Wand2 className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-black">
              Multi-Tone Bullet Point Rewriter
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              Persona Customizer
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Tailor any bullet point for specific engineering sub-domains (Backend Scale vs Frontend UI vs AI/ML).
          </p>
        </div>
      </div>

      {/* Pick Existing Bullet or Type Custom */}
      {bulletList.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 block">
            Select a Bullet Point from Your Resume:
          </label>
          <div className="flex flex-wrap gap-2">
            {bulletList.slice(0, 5).map((bullet, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedBulletIndex(idx);
                  setCustomInput('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium text-left truncate max-w-xs transition-all border ${
                  selectedBulletIndex === idx && !customInput
                    ? 'bg-black text-white border-black shadow-xs font-bold'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                Bullet {idx + 1}: &ldquo;{bullet.slice(0, 35)}...&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Or Paste Custom Sentence */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 block">
          Or Type / Paste Any Project Sentence to Transform:
        </label>
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. Created a fullstack dashboard for student analytics using React and Node.js..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-black focus:border-black outline-none transition-all"
        />
      </div>

      {/* Tone Switcher Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 block">
          Choose Target Engineering Persona Tone:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {toneResult.tones.map((t) => (
            <button
              key={t.tone}
              type="button"
              onClick={() => setActiveTone(t.tone)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
                activeTone === t.tone
                  ? 'bg-purple-950 text-white border-purple-950 shadow-md ring-2 ring-purple-400'
                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-black'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1 rounded-lg bg-white/20 text-current">
                  {toneIcons[t.tone]}
                </span>
                {activeTone === t.tone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{t.title.split('(')[0]}</div>
                <div className="text-[10px] opacity-75 mt-0.5">
                  Focus: {t.highlightedFocus}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* BEFORE VS AFTER TONE COMPARISON CARD */}
      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
        {/* BEFORE */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Original Sentence:
          </span>
          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 font-mono">
            {activeBullet}
          </div>
        </div>

        {/* AFTER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              {currentToneOption.title}
            </span>
            <span className="text-[11px] text-purple-700 font-medium">
              Action Verb: <strong>{currentToneOption.actionVerb}</strong>
            </span>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 font-mono leading-relaxed relative group">
            {currentToneOption.rewritten}
          </div>
        </div>

        {/* COPY & ACTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-gray-500">
            {currentToneOption.description}
          </p>
          <button
            type="button"
            onClick={() => handleCopy(activeTone, currentToneOption.rewritten)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 self-end sm:self-auto"
          >
            {copiedKey === activeTone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === activeTone ? 'Copied to Clipboard!' : 'Copy Rewritten Bullet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
