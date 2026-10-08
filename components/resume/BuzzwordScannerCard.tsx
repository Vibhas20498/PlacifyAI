'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import {
  scanForBuzzwordsAndRedFlags,
  BuzzwordAuditResult,
} from '@/lib/resume/analyzer';

interface BuzzwordScannerCardProps {
  rawText: string;
}

export function BuzzwordScannerCard({ rawText }: BuzzwordScannerCardProps) {
  const [auditResult] = useState<BuzzwordAuditResult>(() =>
    scanForBuzzwordsAndRedFlags(rawText)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyReplacement = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-black">
              Buzzword & Cliché Fluff Detector
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Anti-Fluff Auditor
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Identifies vague adjectives, overused clichés, and unverified claims that weaken candidate credibility.
          </p>
        </div>

        {/* Fluff-Free Score Badge */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Fluff-Free Cleanliness
            </div>
            <div className="text-xs font-bold text-black">
              {auditResult.totalBuzzwordsFound === 0 ? 'Zero Clichés Found' : `${auditResult.totalBuzzwordsFound} Buzzwords Detected`}
            </div>
          </div>
          <div className="text-3xl font-black text-black font-mono">
            {auditResult.fluffScore}%
          </div>
        </div>
      </div>

      {/* DETECTED BUZZWORDS LIST */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-black flex items-center justify-between">
          <span>Detected Clichés & 1-Click Technical Replacements:</span>
          <span className="text-gray-500 font-normal">
            {auditResult.detectedBuzzwords.length > 0
              ? 'Click copy to apply upgraded statement'
              : 'Clean resume! No common clichés identified'}
          </span>
        </div>

        {auditResult.detectedBuzzwords.length > 0 ? (
          <div className="space-y-3">
            {auditResult.detectedBuzzwords.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Flagged Buzzword: &ldquo;{item.word}&rdquo;
                  </span>
                  <span className="text-[11px] text-amber-800 italic">
                    {item.reason}
                  </span>
                </div>

                <div className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 font-mono">
                  <span className="text-gray-400 select-none">Found in resume: </span>
                  &ldquo;{item.sentence}&rdquo;
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-900 space-y-0.5">
                    <span className="font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      Recommended Technical Proof Upgrade:
                    </span>
                    <span className="text-emerald-950 font-semibold font-mono">
                      &ldquo;{item.suggestedReplacement}...&rdquo;
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyReplacement(item.id, item.suggestedReplacement)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs self-end sm:self-auto"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy Replacement'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero corporate fluff found!</strong> Your resume uses direct technical language rather than empty adjectives.
            </span>
          </div>
        )}
      </div>

      {/* ATS FORMAT RED FLAGS AUDIT */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="text-xs font-bold text-black uppercase tracking-wider">
          ATS Layout & Hygiene Red Flag Audit
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {auditResult.formatRedFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                flag.status === 'pass'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-amber-50/60 border-amber-200'
              }`}
            >
              {flag.status === 'pass' ? (
                <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-black">{flag.title}</div>
                <p className="text-gray-600">{flag.description}</p>
                {flag.status !== 'pass' && (
                  <p className="text-[11px] text-amber-900 font-medium pt-0.5">
                    💡 Tip: {flag.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
