'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  User,
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  SlidersHorizontal,
  Map,
  MessageSquare,
  Mic,
  Sparkles,
  FileDown,
  X,
} from 'lucide-react';
import { useUser } from '@/lib/store/user-context';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { profile, isOnline } = useUser();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Resume Analyzer', href: '/resume', icon: FileText, badge: 'AI' },
    { name: 'Job Analyzer', href: '/job-analyzer', icon: Briefcase },
    { name: 'Skill Gap', href: '/skill-gap', icon: Target },
    { name: 'Placement Prediction', href: '/placement-prediction', icon: TrendingUp },
    { name: 'What-If Simulator', href: '/what-if', icon: SlidersHorizontal },
    { name: 'Learning Roadmap', href: '/learning-roadmap', icon: Map },
    { name: 'AI Career Coach', href: '/ai-coach', icon: MessageSquare },
    { name: 'Mock Interview', href: '/mock-interview', icon: Mic },
    { name: 'Job Recommendations', href: '/jobs', icon: Sparkles },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 select-none overflow-y-auto bg-white border-r border-gray-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <Link href="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-black flex items-center gap-1.5 font-sans">
                Placify AI
              </div>
              <div className="text-[10px] text-gray-400 font-mono tracking-wider uppercase -mt-0.5">
                Career Intelligence
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard'));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-black'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: User Card & Document Download */}
      <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
        <a
          href="/PLACIFYAI_PROJECT_SPECIFICATION.md"
          download="PLACIFYAI_PROJECT_SPECIFICATION.md"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 transition-colors group"
          title="Download the full architecture dossier"
        >
          <span className="flex items-center gap-2">
            <FileDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-black" />
            Project Dossier
          </span>
          <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">.MD</span>
        </a>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80 border border-gray-200/80">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.name.charAt(0)}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black truncate">{profile.name}</div>
            <div className="text-[11px] text-gray-500 truncate">{profile.targetRole}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-[260px] h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Slide-in */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
