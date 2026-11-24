'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  Building2,
  Calendar,
  FileCheck,
  TrendingUp,
  RotateCcw,
  Download,
} from 'lucide-react';
import { CompanyDriveProfile } from '@/lib/placement-war-room/types';
import { CompanyLogo } from './CompanyLogos';

interface OfficialOfferLetterProps {
  company: CompanyDriveProfile;
  candidateName: string;
  collegeName: string;
  onRestart: () => void;
}

export function OfficialOfferLetter({
  company,
  candidateName,
  collegeName,
  onRestart,
}: OfficialOfferLetterProps) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const offerId = `PLC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Celebration Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xl relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Campus Placement Cleared • All 4 Rounds Passed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
          Congratulations, {candidateName}!
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          You successfully cleared all elimination rounds of the {company.name} Campus Drive. We are proud to extend an official Letter of Intent & Employment Offer.
        </p>
      </motion.div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onRestart}
          className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Another Drive</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Offer Letter Document Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border-2 border-gray-300 p-8 sm:p-12 space-y-8 shadow-2xl relative text-gray-900 font-sans select-none"
      >
        {/* Subtle Corporate Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-9xl font-black font-heading select-none">
          OFFICIAL OFFER
        </div>

        {/* Company Header with Official Corporate Logo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-900">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CompanyLogo companyKey={company.key} size="lg" />
            </div>
            <div className="text-xs text-gray-500 font-mono">
              CAMPUS RECRUITMENT DIVISION • REF: {offerId}
            </div>
          </div>

          <div className="text-right text-xs text-gray-600 space-y-0.5">
            <div><strong>Date of Issue:</strong> {currentDate}</div>
            <div><strong>Cohort:</strong> Graduating Batch of 2026</div>
          </div>
        </div>

        {/* Candidate Recipient Details */}
        <div className="space-y-1 text-xs sm:text-sm text-gray-800">
          <div>To,</div>
          <div className="font-bold text-base text-black">{candidateName}</div>
          <div className="text-gray-600">{collegeName}</div>
          <div className="text-gray-600">Candidate ID: {offerId}</div>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-gray-700">
          <p>
            <strong>Subject: Letter of Intent & Campus Placement Offer for the role of {company.roleTitle}</strong>
          </p>

          <p>
            Dear {candidateName},
          </p>

          <p>
            Following your commendable performance in our rigorous 4-Round Campus Selection Process—encompassing the Online Aptitude & CS Fundamentals Screening, the Live Algorithmic Challenge, the Technical Architecture Defense, and the Executive Leadership Round—we are pleased to offer you the position of <strong>{company.roleTitle}</strong> at <strong>{company.name}</strong>.
          </p>

          {/* Compensation Breakdown Table */}
          <div className="my-6 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-2.5 font-bold text-xs text-gray-800 uppercase tracking-wider">
              Annual Compensation & Benefits Structure (CTC)
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-4 py-2.5 font-medium text-gray-600">Fixed Base Salary</td>
                  <td className="px-4 py-2.5 font-bold text-gray-900 text-right">{company.baseLPA} / annum</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-600">Joining / Relocation Allowance</td>
                  <td className="px-4 py-2.5 font-bold text-gray-900 text-right">{company.joiningBonus}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2.5 font-medium text-gray-600">Performance & Milestone Incentive</td>
                  <td className="px-4 py-2.5 font-bold text-gray-900 text-right">Standard Annual Incentive</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-950 font-bold">
                  <td className="px-4 py-3 text-sm">Total Gross Annual CTC</td>
                  <td className="px-4 py-3 text-sm text-right text-emerald-900 font-extrabold">{company.packageLPA}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Your reporting location and onboarding schedule will be communicated through the Campus Placement Portal prior to your graduation date.
          </p>

          <p>
            We look forward to having you onboard as a core contributor to our engineering and technology initiatives.
          </p>
        </div>

        {/* Corporate Signatures & Official Stamp */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-gray-200 text-xs">
          <div className="space-y-1">
            <div className="font-serif italic text-base text-gray-800">Authorized Signature</div>
            <div className="font-bold text-gray-900">Director of University Talent Acquisition</div>
            <div className="text-gray-500">{company.name} Campus Drive Division</div>
          </div>

          <div className="w-24 h-24 rounded-full border-2 border-emerald-600 text-emerald-700 flex flex-col items-center justify-center text-[10px] font-bold text-center p-2 uppercase tracking-tight shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-0.5" />
            <span>Campus Drive Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
