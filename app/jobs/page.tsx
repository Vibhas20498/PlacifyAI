'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { Building2, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const { jobs, profile } = useUser();

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Job Recommendations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Top curated placement opportunities matching your verified skill portfolio.
            </p>
          </div>
          <Link
            href="/job-analyzer"
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Open Deep Match Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 hover:border-black rounded-2xl p-6 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-bold bg-black text-white px-2.5 py-1 rounded-full">
                    {job.matchScore}% Match
                  </span>
                  <span className="text-xs font-mono text-gray-400">{job.postedDate}</span>
                </div>
                <h3 className="text-lg font-bold text-black">{job.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{job.company}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 pt-1">{job.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-black">{job.salaryRange}</span>
                <Link
                  href="/job-analyzer"
                  className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
                >
                  <span>Analyze Alignment</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
