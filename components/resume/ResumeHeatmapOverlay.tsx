'use client';

import React, { useState } from 'react';
import {
  Eye,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Layers,
} from 'lucide-react';
import {
  calculateRecruiterScanHeatmap,
  DetailedResumeAnalysis,
  RecruiterHeatmapData,
} from '@/lib/resume/analyzer';

interface ResumeHeatmapOverlayProps {
  analysis: DetailedResumeAnalysis;
  rawText: string;
}

export function ResumeHeatmapOverlay({
  analysis,
  rawText,
}: ResumeHeatmapOverlayProps) {
  const [heatmapData] = useState<RecruiterHeatmapData>(() =>
    calculateRecruiterScanHeatmap(rawText, analysis)
  );
  const [showThermalGradient, setShowThermalGradient] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Eye className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-black">
              Recruiter 6-Second Eye-Tracking Simulation
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              F-Pattern Visual Hierarchy
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Simulates the standard 6.2-second initial scan by human recruiters and talent sourcers.
          </p>
        </div>

        {/* Readability & Scan Speed Score */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Scan Readability
            </div>
            <div className="text-xs font-bold text-black">
              Avg Dwell: ~{heatmapData.scanTimeSeconds}s
            </div>
          </div>
          <div className="text-3xl font-black text-black font-mono">
            {heatmapData.readabilityScore}%
          </div>
        </div>
      </div>

      {/* VERDICT BANNER */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
        <Flame className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-black">Hiring Manager Eye-Tracking Verdict</div>
          <p className="text-xs text-gray-700 leading-relaxed">{heatmapData.verdict}</p>
        </div>
      </div>

      {/* DWELL TIME HOTSPOTS BREAKDOWN */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-black flex items-center justify-between">
          <span>Visual Attention Zones & Estimated Dwell Distribution:</span>
          <span className="text-gray-500 font-normal">F-Pattern Trajectory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heatmapData.hotspots.map((spot) => (
            <div
              key={spot.id}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                spot.importance.includes('Critical')
                  ? 'bg-rose-50/50 border-rose-200'
                  : spot.importance.includes('Important')
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">
                  {spot.zoneName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    spot.importance.includes('Critical')
                      ? 'bg-rose-100 text-rose-800'
                      : spot.importance.includes('Important')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {spot.dwellPercentage}% Attention (~{spot.estimatedDwellMs}ms)
                </span>
              </div>

              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    spot.importance.includes('Critical')
                      ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                      : spot.importance.includes('Important')
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${spot.dwellPercentage * 3}%` }}
                />
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {spot.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
