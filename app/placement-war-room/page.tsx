'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  ShieldCheck,
  ArrowRight,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import {
  PlacementDriveSession,
  WarRoomStage,
  DriveCompanyKey,
} from '@/lib/placement-war-room/types';
import {
  COMPANY_DRIVE_PROFILES,
} from '@/lib/placement-war-room/drive-data';
import {
  initializeDriveSession,
  loadDriveSession,
  saveDriveSession,
  clearDriveSession,
} from '@/lib/placement-war-room/engine';
import { Round1Screening } from '@/components/war-room/Round1Screening';
import { Round2Coding } from '@/components/war-room/Round2Coding';
import { Round3Technical } from '@/components/war-room/Round3Technical';
import { Round4HR } from '@/components/war-room/Round4HR';
import { OfficialOfferLetter } from '@/components/war-room/OfficialOfferLetter';
import { EliminationReport } from '@/components/war-room/EliminationReport';
import { CompanyLogo } from '@/components/war-room/CompanyLogos';

export default function PlacementWarRoomPage() {
  const { profile } = useUser();
  const [session, setSession] = useState<PlacementDriveSession | null>(null);
  const [selectedCompanyKey, setSelectedCompanyKey] = useState<DriveCompanyKey>('tcs-digital');
  const [candidateName, setCandidateName] = useState(profile.name || 'Placement Aspirant');
  const [collegeName, setCollegeName] = useState(profile.university || 'Campus Engineering Institute');
  const [qualificationNotice, setQualificationNotice] = useState<string | null>(null);

  // Restore existing session on mount or jump directly via URL query params (?stage=round-3-technical&company=google-sde)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stageParam = urlParams.get('stage') as WarRoomStage | null;
      const companyParam = urlParams.get('company') as DriveCompanyKey | null;

      const validCompany =
        companyParam && COMPANY_DRIVE_PROFILES[companyParam]
          ? companyParam
          : selectedCompanyKey;

      if (
        stageParam &&
        ['round-1-screening', 'round-2-coding', 'round-3-technical', 'round-4-hr'].includes(
          stageParam
        )
      ) {
        const directSession = initializeDriveSession(
          validCompany,
          candidateName.trim() || 'Placement Aspirant',
          collegeName.trim() || 'Campus Engineering Institute'
        );
        directSession.currentStage = stageParam;
        setSelectedCompanyKey(validCompany);
        setSession(directSession);
        saveDriveSession(directSession);
        return;
      }
    }

    const cached = loadDriveSession();
    if (cached) {
      setSession(cached);
    }
  }, []);

  const handleStartDrive = () => {
    const newSession = initializeDriveSession(
      selectedCompanyKey,
      candidateName.trim() || 'Placement Aspirant',
      collegeName.trim() || 'Campus Engineering Institute'
    );
    setSession(newSession);
    setQualificationNotice(null);
  };

  const handleTabSwitchViolation = () => {
    if (!session) return;
    const nextViolations = session.tabSwitchViolations + 1;
    if (nextViolations >= session.maxViolationsAllowed) {
      // Disqualify
      const updated: PlacementDriveSession = {
        ...session,
        tabSwitchViolations: nextViolations,
        currentStage: 'verdict-eliminated',
        finalResult: {
          eliminatedAtStage: session.currentStage,
          eliminationReason: 'Disqualified by Automated Campus Proctor: You exceeded the maximum limit of 3 tab-switches / window unfocus violations during a closed-book recruitment drive.',
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    } else {
      const updated: PlacementDriveSession = {
        ...session,
        tabSwitchViolations: nextViolations,
      };
      setSession(updated);
      saveDriveSession(updated);
    }
  };

  // Round 1 Complete Handler
  const handleRound1Complete = (res: any) => {
    if (!session) return;
    if (!res.passed) {
      const updated: PlacementDriveSession = {
        ...session,
        round1: res,
        currentStage: 'verdict-eliminated',
        finalResult: {
          eliminatedAtStage: 'round-1-screening',
          eliminationReason: `Scored ${res.score} / ${res.totalPossible} (${Math.round((res.score / res.totalPossible) * 100)}%), falling short of ${session.company.name}'s mandatory ${session.company.round1CutoffPercent}% screening cutoff.`,
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    } else {
      setQualificationNotice(`🎉 Qualified Round 1! You scored ${res.score}/${res.totalPossible} (${Math.round((res.score / res.totalPossible) * 100)}%). Advancing to Round 2: Speed Coding.`);
      const updated: PlacementDriveSession = {
        ...session,
        round1: res,
        currentStage: 'round-2-coding',
      };
      setSession(updated);
      saveDriveSession(updated);
    }
  };

  // Round 2 Complete Handler
  const handleRound2Complete = (res: any) => {
    if (!session) return;
    if (!res.passed) {
      const updated: PlacementDriveSession = {
        ...session,
        round2: res,
        currentStage: 'verdict-eliminated',
        finalResult: {
          eliminatedAtStage: 'round-2-coding',
          eliminationReason: `Passed ${res.passedCases} of ${res.totalCases} test cases. ${session.company.name} strictly requires passing at least ${session.company.round2RequiredTestCases} of 5 test cases (including hidden edge cases).`,
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    } else {
      setQualificationNotice(`🎉 Passed Round 2 Coding! Executed ${res.passedCases}/${res.totalCases} test cases in ${res.runtimeMs}ms. Advancing to Round 3: Technical Defense.`);
      const updated: PlacementDriveSession = {
        ...session,
        round2: res,
        currentStage: 'round-3-technical',
      };
      setSession(updated);
      saveDriveSession(updated);
    }
  };

  // Round 3 Complete Handler
  const handleRound3Complete = (res: any) => {
    if (!session) return;
    if (!res.passed) {
      const updated: PlacementDriveSession = {
        ...session,
        round3: res,
        currentStage: 'verdict-eliminated',
        finalResult: {
          eliminatedAtStage: 'round-3-technical',
          eliminationReason: `Achieved a technical defense score of ${res.averageScore}/100, which is below ${session.company.name}'s technical cutoff bar of ${session.company.round3PassingScore}/100.`,
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    } else {
      setQualificationNotice(`🎉 Cleared Technical Round! Average score ${res.averageScore}/100. Advancing to Round 4: Executive HR Round.`);
      const updated: PlacementDriveSession = {
        ...session,
        round3: res,
        currentStage: 'round-4-hr',
      };
      setSession(updated);
      saveDriveSession(updated);
    }
  };

  // Round 4 Complete Handler
  const handleRound4Complete = (res: any) => {
    if (!session) return;
    if (!res.passed) {
      const updated: PlacementDriveSession = {
        ...session,
        round4: res,
        currentStage: 'verdict-eliminated',
        finalResult: {
          eliminatedAtStage: 'round-4-hr',
          eliminationReason: `Scored ${res.averageScore}/100 on the HR Leadership evaluation, below the corporate alignment threshold of ${session.company.round4PassingScore}/100.`,
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    } else {
      const updated: PlacementDriveSession = {
        ...session,
        round4: res,
        currentStage: 'verdict-offer',
        finalResult: {
          offerDetails: {
            offerId: `OFFER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            candidateName: session.candidateName,
            roleTitle: session.company.roleTitle,
            companyName: session.company.name,
            annualCTC: session.company.packageLPA,
            basePay: session.company.baseLPA,
            joiningBonus: session.company.joiningBonus,
            retentionBonus: 'Standard Tier Incentive',
            joiningDate: 'July 2026',
            percentileRank: 96,
          },
        },
      };
      setSession(updated);
      saveDriveSession(updated);
    }
  };

  const handleRestartDrive = () => {
    clearDriveSession();
    setSession(null);
    setQualificationNotice(null);
  };

  const companyList = Object.values(COMPANY_DRIVE_PROFILES);

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-black font-heading tracking-tight">
                Campus Placement Drive War Room
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                Multi-Round Elimination Simulator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
              Experience the authentic 4-Round campus placement drive marathon. Clear Aptitude, Speed Coding, Technical Defense, and HR to earn your official Offer Letter.
            </p>
          </div>

          {session && (
            <button
              type="button"
              onClick={handleRestartDrive}
              className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1.5 self-start md:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Quit & Select Another Company</span>
            </button>
          )}
        </div>

        {/* Qualification Toast Banner */}
        <AnimatePresence>
          {qualificationNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{qualificationNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setQualificationNotice(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold shrink-0"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-Round Progress Tracker Stepper (When drive is active) */}
        {session && session.currentStage !== 'company-selection' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-xs">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => {
                  const updated: PlacementDriveSession = { ...session, currentStage: 'round-1-screening' };
                  setSession(updated);
                  saveDriveSession(updated);
                }}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  session.currentStage === 'round-1-screening'
                    ? 'border-black bg-black text-white shadow-xs'
                    : session.round1
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <span className="font-bold truncate">R1: Screening</span>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  const updated: PlacementDriveSession = { ...session, currentStage: 'round-2-coding' };
                  setSession(updated);
                  saveDriveSession(updated);
                }}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  session.currentStage === 'round-2-coding'
                    ? 'border-black bg-black text-white shadow-xs'
                    : session.round2
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <span className="font-bold truncate">R2: Coding</span>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  const updated: PlacementDriveSession = { ...session, currentStage: 'round-3-technical' };
                  setSession(updated);
                  saveDriveSession(updated);
                }}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  session.currentStage === 'round-3-technical'
                    ? 'border-black bg-black text-white shadow-xs'
                    : session.round3
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <span className="font-bold truncate">R3: Tech Defense 🎥</span>
              </button>

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => {
                  const updated: PlacementDriveSession = { ...session, currentStage: 'round-4-hr' };
                  setSession(updated);
                  saveDriveSession(updated);
                }}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                  session.currentStage === 'round-4-hr'
                    ? 'border-black bg-black text-white shadow-xs'
                    : session.round4
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                <span className="font-bold truncate">R4: HR Fit 🤝</span>
              </button>

              {/* Step 5: Final Verdict */}
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                  session.currentStage === 'verdict-offer'
                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                    : session.currentStage === 'verdict-eliminated'
                    ? 'border-rose-600 bg-rose-600 text-white font-bold'
                    : 'border-gray-100 bg-gray-50 text-gray-400'
                }`}
              >
                <Trophy className="w-4 h-4 shrink-0" />
                <span className="font-bold truncate">Offer Letter</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 0: COMPANY DRIVE SELECTION SCREEN */}
        {(!session || session.currentStage === 'company-selection') && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Candidate Verification Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Candidate Placement Drive Registration
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Candidate Name:</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">College / University Name:</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Select Target Placement Drive Cards */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                <span>Choose Your Target Placement Drive (Class of 2026):</span>
                <span className="text-gray-400 font-normal">Authentic Exam Patterns & Cutoffs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyList.map((company) => {
                  const isSelected = company.key === selectedCompanyKey;
                  return (
                    <div
                      key={company.key}
                      onClick={() => setSelectedCompanyKey(company.key)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-lg ring-2 ring-black/10'
                          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-md text-gray-900'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-white/20 text-white border border-white/30'
                                : company.badgeColor
                            }`}
                          >
                            {company.tier}
                          </span>
                          <span
                            className={`text-[11px] font-bold ${
                              isSelected ? 'text-gray-300' : 'text-gray-500'
                            }`}
                          >
                            {company.selectionRatio}
                          </span>
                        </div>

                        {/* Official Company Logo Badge */}
                        <div
                          className={`p-3 rounded-2xl flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-white text-black shadow-xs'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <CompanyLogo companyKey={company.key} size="md" />
                        </div>

                        <div>
                          <h3 className="text-base font-bold tracking-tight">{company.name}</h3>
                          <p
                            className={`text-xs mt-0.5 font-medium ${
                              isSelected ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {company.roleTitle}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-current/10">
                          <div className="text-sm font-extrabold tracking-tight">
                            {company.packageLPA}
                          </div>
                          <div
                            className={`text-[11px] ${
                              isSelected ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Base: {company.baseLPA} • {company.joiningBonus}
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          {company.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className={`text-[11px] flex items-center gap-1.5 ${
                                isSelected ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            >
                              <span>✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompanyKey(company.key);
                            handleStartDrive();
                          }}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-white text-black hover:bg-gray-100 shadow-sm'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Enter War Room (Start R1)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 1: ROUND 1 SCREENING TEST */}
        {session && session.currentStage === 'round-1-screening' && (
          <Round1Screening
            company={session.company}
            questions={session.screeningPaper}
            onCompleteRound={handleRound1Complete}
            tabSwitchViolations={session.tabSwitchViolations}
            onTabSwitchViolation={handleTabSwitchViolation}
          />
        )}

        {/* STAGE 2: ROUND 2 LIVE CODING */}
        {session && session.currentStage === 'round-2-coding' && (
          <Round2Coding
            company={session.company}
            problem={session.codingProblem}
            onCompleteRound={handleRound2Complete}
            tabSwitchViolations={session.tabSwitchViolations}
            onTabSwitchViolation={handleTabSwitchViolation}
          />
        )}

        {/* STAGE 3: ROUND 3 TECHNICAL ROUND */}
        {session && session.currentStage === 'round-3-technical' && (
          <Round3Technical
            company={session.company}
            candidateName={session.candidateName}
            onCompleteRound={handleRound3Complete}
          />
        )}

        {/* STAGE 4: ROUND 4 HR ROUND */}
        {session && session.currentStage === 'round-4-hr' && (
          <Round4HR
            company={session.company}
            candidateName={session.candidateName}
            onCompleteRound={handleRound4Complete}
          />
        )}

        {/* STAGE 5: OFFICIAL OFFER LETTER (SUCCESS) */}
        {session && session.currentStage === 'verdict-offer' && (
          <OfficialOfferLetter
            company={session.company}
            candidateName={session.candidateName}
            collegeName={session.collegeName}
            onRestart={handleRestartDrive}
          />
        )}

        {/* STAGE 6: ELIMINATION REPORT (FAILURE) */}
        {session && session.currentStage === 'verdict-eliminated' && (
          <EliminationReport
            company={session.company}
            eliminatedStage={session.finalResult?.eliminatedAtStage || 'round-1-screening'}
            eliminationReason={
              session.finalResult?.eliminationReason ||
              'Did not meet the round cutoff threshold required for shortlisting.'
            }
            onRestart={handleRestartDrive}
          />
        )}
      </div>
    </AppShell>
  );
}
