'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Scissors,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageBudgetMetric, TrimmingOpportunity } from '@/lib/resume/page-budget';

interface PageBudgetCardProps {
  pageBudget: PageBudgetMetric;
  onApplyTrim?: (original: string, trimmed: string) => void;
}

export function PageBudgetCard({ pageBudget, onApplyTrim }: PageBudgetCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isSafe = pageBudget.status === 'safe';
  const isOverflow = pageBudget.status === 'warning-overflow' || pageBudget.status === 'heavy-overflow';
  const isUnderfilled = pageBudget.status === 'underfilled';

  const handleCopyTrim = (trim: TrimmingOpportunity) => {
    navigator.clipboard.writeText(trim.suggestedCondensation);
    setCopiedId(trim.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
              isSafe
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : isOverflow
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}
          >
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">1-Page Economy Budget</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isSafe
                    ? 'bg-emerald-100 text-emerald-800'
                    : isOverflow
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pageBudget.statusLabel} ({pageBudget.pageEstimate} Pages)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Strict 1-page compliance estimator for Indian campus placement drives & ATS screeners
            </p>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="flex items-center gap-4 text-left">
          <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Total Words</div>
            <div className="text-sm font-bold text-gray-800">{pageBudget.wordCount}</div>
          </div>
          <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Est. Lines</div>
            <div className="text-sm font-bold text-gray-800">
              {pageBudget.estimatedVisualLines} / {pageBudget.maxBudgetLines}
            </div>
          </div>
          <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400">Capacity</div>
            <div
              className={`text-sm font-bold ${
                isSafe ? 'text-emerald-600' : isOverflow ? 'text-rose-600' : 'text-amber-600'
              }`}
            >
              {pageBudget.pagePercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Budget Progress Visualizer */}
      <div className="p-6 space-y-6">
        {/* Progress Bar with Page 1 Boundary Marker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-600">Visual Page Fill Density</span>
            <span className="font-bold text-gray-800">
              {pageBudget.pagePercentage <= 100
                ? `${pageBudget.pagePercentage}% filled (Page 1 Safe)`
                : `+${pageBudget.pagePercentage - 100}% over 1-page boundary`}
            </span>
          </div>

          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
            {/* Safe 100% boundary marker */}
            <div
              className="absolute top-0 bottom-0 left-[83%] w-0.5 bg-gray-400 z-10"
              title="Standard 1-Page Maximum (50 Lines / ~520 Words)"
            />

            {/* Filled Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (pageBudget.pagePercentage / 120) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isSafe
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : isOverflow
                  ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-red-600'
                  : 'bg-gradient-to-r from-amber-300 to-amber-500'
              }`}
            />
          </div>

          <div className="flex justify-between text-[11px] text-gray-400">
            <span>0% (Empty)</span>
            <span>50%</span>
            <span className="font-semibold text-gray-700">100% (Strict 1-Page Max)</span>
            <span className="text-rose-500 font-semibold">120%+ (Page 2 Overflow)</span>
          </div>
        </div>

        {/* Dynamic Status Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSafe
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : isOverflow
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          {isSafe ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 ${isOverflow ? 'text-rose-600' : 'text-amber-600'}`}
            />
          )}

          <div className="space-y-1 text-xs">
            <div className="font-bold">
              {isSafe
                ? 'Ideal 1-Page Layout Detected'
                : isOverflow
                ? `Spillover Warning: ${pageBudget.spilloverLines} Lines Flowing onto Page 2`
                : 'Resume Looks Sparse (Under-Filled)'}
            </div>
            <p className="leading-relaxed opacity-90">{pageBudget.summaryMessage}</p>
          </div>
        </div>

        {/* Section Line Breakdown */}
        {pageBudget.sectionLineBreakdown.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Vertical Line Distribution by Section
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {pageBudget.sectionLineBreakdown.map((sec) => (
                <div key={sec.section} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 truncate">{sec.section}</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">
                    {sec.lines} lines{' '}
                    <span className="font-normal text-gray-400">
                      ({Math.round((sec.lines / Math.max(1, pageBudget.estimatedVisualLines)) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trimming Opportunities Accordion */}
        {pageBudget.trimmingOpportunities.length > 0 && (
          <div className="border border-gray-100 rounded-2xl bg-gray-50/50 p-4 space-y-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-800 hover:text-black"
            >
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-500" />
                <span>
                  Trimming Opportunities to Save Vertical Space ({pageBudget.trimmingOpportunities.length} Found)
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-semibold">
                <span>{showDetails ? 'Hide' : 'Review Suggestions'}</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2"
                >
                  <p className="text-[11px] text-gray-500">
                    The following bullet points wrap onto extra lines due to word length. Trimming them will recover line height and pull your resume back into a clean 1-page format:
                  </p>

                  <div className="space-y-2.5">
                    {pageBudget.trimmingOpportunities.map((trim) => (
                      <div
                        key={trim.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-gray-700">Original ({trim.wordCount} words):</span>
                          <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {trim.savingsTip}
                          </span>
                        </div>

                        <p className="text-gray-600 italic border-l-2 border-gray-200 pl-2 text-[11px]">
                          &ldquo;{trim.originalText}&rdquo;
                        </p>

                        <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 space-y-1.5">
                          <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>Recommended Trim (Saves 1 Line):</span>
                          </div>
                          <p className="text-emerald-950 font-medium text-[11px] leading-relaxed">
                            {trim.suggestedCondensation}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleCopyTrim(trim)}
                            className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copiedId === trim.id ? 'Copied!' : 'Copy Condensed'}
                          </button>
                          {onApplyTrim && (
                            <button
                              type="button"
                              onClick={() => onApplyTrim(trim.originalText, trim.suggestedCondensation)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <span>Apply Trim</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
