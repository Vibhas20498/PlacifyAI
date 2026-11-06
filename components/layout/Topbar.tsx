'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Sparkles, User, Sliders, Menu, X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useUser } from '@/lib/store/user-context';
import { generateLinkedInJobsForRole } from '@/lib/linkedin/job-radar';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const { profile, unreadNotificationsCount, clearSession } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkedInMatches = React.useMemo(() => {
    return generateLinkedInJobsForRole(
      profile.targetRole || 'Fullstack Software Engineer',
      profile.verifiedSkills || [],
      profile.resumeAtsScore || 70
    );
  }, [profile.targetRole, profile.verifiedSkills, profile.resumeAtsScore]);

  return (
    <header
      className={`h-16 fixed top-0 right-0 left-0 lg:left-[260px] z-20 px-4 sm:px-8 flex items-center justify-between transition-all duration-200 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-gray-200/90 shadow-xs'
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Sidebar Toggle Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* System State Badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] font-mono text-gray-400 uppercase tracking-wider">
            Engine:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-black border border-gray-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Placement Probability</span>
            <span>Calibrated</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Project Dossier Download Button */}
        <a
          href="/PLACIFYAI_PROJECT_SPECIFICATION.md"
          download="PLACIFYAI_PROJECT_SPECIFICATION.md"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all shadow-2xs"
        >
          <span>Project Spec</span>
          <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-white" />
        </a>

        {/* Notifications Dropdown with Live LinkedIn Job Stream */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-colors focus-visible:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A66C2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A66C2]"></span>
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                      Live Alerts
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#0A66C2]/10 text-[#0A66C2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />
                      LinkedIn Live
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {profile.targetRole || 'Target Role'}
                  </span>
                </div>

                <div className="divide-y divide-gray-100 mt-2 max-h-80 overflow-y-auto space-y-1">
                  {/* Top Live LinkedIn Role Alerts */}
                  {linkedInMatches.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded bg-[#0A66C2] text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                            in
                          </span>
                          <span className="text-[11px] font-bold text-black truncate max-w-[170px]">
                            {job.company}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.matchPercentage}% match
                        </span>
                      </div>

                      <p className="text-xs font-medium text-gray-800 mt-1 line-clamp-1">
                        {job.title}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {job.location} • {job.postedTime}
                        </span>
                        <a
                          href={job.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A66C2] hover:text-[#004182] hover:underline"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* Placement Intelligence Notification */}
                  <div className="py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-black text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        AI
                      </span>
                      <span className="text-xs font-semibold text-gray-800">
                        Resume Calibrated: {profile.resumeAtsScore || 68}/100 ATS
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 pl-5">
                      Optimal for {profile.targetRole || 'Fullstack Software Engineer'} recruitment filters.
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    Real-time LinkedIn stream
                  </span>
                  <Link
                    href="/jobs"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#0A66C2] hover:underline flex items-center gap-1"
                  >
                    <span>Open Role Radar</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 focus-visible:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-bold text-black hidden sm:inline-block max-w-[120px] truncate">
              {profile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl p-2 shadow-xl z-50"
              >
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <div className="text-xs font-bold text-black truncate">{profile.name}</div>
                  <div className="text-[11px] text-gray-500 truncate">{profile.email}</div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Career Profile
                </Link>
                <Link
                  href="/onboarding"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Setup Profile Wizard
                </Link>
                <Link
                  href="/what-if"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  What-If Workbench
                </Link>
                <div className="pt-2 mt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      clearSession();
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                  >
                    Log Out / Switch Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
