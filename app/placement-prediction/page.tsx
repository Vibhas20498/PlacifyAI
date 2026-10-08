'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { calculatePlacementProbability } from '@/lib/scoring';
import { TrendingUp, PlusCircle, MinusCircle, SlidersHorizontal, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PlacementPredictionPage() {
  const { profile } = useUser();
  const evaluation = calculatePlacementProbability(profile);

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Placement Probability & Factor Attribution
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Deterministic, explainable readiness analytics calculated via multi-factor candidate benchmarking.
            </p>
          </div>
          <Link
            href="/what-if"
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Launch What-If Workbench</span>
          </Link>
        </div>

        {/* Hero Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Estimated Placement Probability
            </span>
            <div className="text-5xl font-extrabold tracking-tight text-black">
              {evaluation.probability}%
            </div>
            <div className="text-xs text-gray-500">
              Confidence Range: [{evaluation.confidenceInterval[0]}%, {evaluation.confidenceInterval[1]}%]
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Peer Benchmark Percentile
            </span>
            <div className="text-5xl font-extrabold tracking-tight text-black">
              {evaluation.peerPercentile}th
            </div>
            <div className="text-xs text-gray-500">
              Ahead of {evaluation.peerPercentile}% of candidate benchmarks
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Readiness Index
            </span>
            <div className="text-5xl font-extrabold tracking-tight text-black">
              {evaluation.readinessScore}/100
            </div>
            <div className="text-xs text-gray-500">
              Multi-factor composite preparation score
            </div>
          </div>
        </div>

        {/* Factor Attribution Decomposition (Why is my score X%?) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-black">Key Placement Factor Drivers</h3>
              <p className="text-xs text-gray-500">
                Granular factor breakdown revealing positive drivers and areas for improvement.
              </p>
            </div>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-black font-semibold">
              Baseline: 52%
            </span>
          </div>

          <div className="space-y-4">
            {evaluation.shapFactors.map((factor, idx) => {
              const isPos = factor.impactType === 'positive';
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPos
                      ? 'border-gray-200 bg-gray-50/50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isPos ? (
                        <PlusCircle className="w-4 h-4 text-black" />
                      ) : (
                        <MinusCircle className="w-4 h-4 text-gray-600" />
                      )}
                      <h4 className="text-sm font-bold text-black">{factor.displayName}</h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isPos
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {isPos ? `+${factor.impactValue}%` : `-${factor.impactValue}%`}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pl-6">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Weights Matrix */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Evaluation Factor Weights & Profile Signals
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  <th className="py-2.5 font-semibold">Factor Name</th>
                  <th className="py-2.5 font-semibold">Candidate Profile Value</th>
                  <th className="py-2.5 font-semibold">Weight Impact</th>
                  <th className="py-2.5 text-right font-semibold">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluation.featureWeights.map((fw) => (
                  <tr key={fw.name} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-semibold text-black">{fw.name}</td>
                    <td className="py-3 text-gray-700 font-medium">{fw.value}</td>
                    <td className="py-3 text-gray-500 font-medium">{fw.weight}%</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          fw.impact === 'positive'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {fw.impact === 'positive' ? 'Optimal' : 'Needs Work'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
