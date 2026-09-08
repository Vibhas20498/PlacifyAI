'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { useUser } from '@/lib/store/user-context';

export function Sidebar() {
  const pathname = usePathname();
  const { profile, isOnline } = useUser();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Resume Analyzer', href: '/resume', icon: FileText },
    { name: 'Job Analyzer', href: '/job-analyzer', icon: Briefcase },
    { name: 'Skill Gap', href: '/skill-gap', icon: Target },
    { name: 'Placement Prediction', href: '/placement-prediction', icon: TrendingUp },
    { name: 'What-If Simulator', href: '/what-if', icon: SlidersHorizontal },
    { name: 'Learning Roadmap', href: '/learning-roadmap', icon: Map },
    { name: 'AI Career Coach', href: '/ai-coach', icon: MessageSquare },
    { name: 'Mock Interview', href: '/mock-interview', icon: Mic },
    { name: 'Job Recommendations', href: '/jobs', icon: Sparkles },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-4 fixed left-0 top-0 z-30 select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-4 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-black flex items-center gap-1.5">
              Placify AI
            </div>
            <div className="text-[11px] text-gray-500 font-normal -mt-0.5">
              Placement Intelligence
            </div>
          </div>
        </Link>

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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white font-semibold'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.name}</span>
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
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
          title="Download the full architecture dossier"
        >
          <span className="flex items-center gap-2">
            <FileDown className="w-3.5 h-3.5 text-gray-500" />
            Project Dossier
          </span>
          <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">.MD</span>
        </a>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {profile.name.charAt(0)}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black rounded-full ring-2 ring-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-black truncate">{profile.name}</div>
            <div className="text-[11px] text-gray-500 truncate">{profile.targetRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
