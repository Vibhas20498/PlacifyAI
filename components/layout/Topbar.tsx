'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Sparkles, CheckCircle2, User, Sliders } from 'lucide-react';
import { useUser } from '@/lib/store/user-context';

export function Topbar() {
  const { profile, unreadNotificationsCount, updateProfile } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'Resume ATS score increased to 68/100 after keyword scan.', time: '10m ago' },
    { id: 2, text: 'New job match found: Associate Backend Engineer @ Stripe (82% match).', time: '1h ago' },
    { id: 3, text: 'RAG Career Coach synthesized 3 high-yield study milestones.', time: '4h ago' },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 fixed top-0 right-0 left-[260px] z-20 px-8 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">System State:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-black border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            ML Probability Calibrated
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Project Dossier Download Button */}
        <a
          href="/PLACIFYAI_PROJECT_SPECIFICATION.md"
          download="PLACIFYAI_PROJECT_SPECIFICATION.md"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-black hover:bg-black hover:text-white hover:border-black transition-all"
        >
          <span>Download Project Spec</span>
        </a>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
                  Notifications
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {unreadNotificationsCount} unread
                </span>
              </div>
              <div className="divide-y divide-gray-100 mt-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <p className="text-gray-800 leading-relaxed">{n.text}</p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-black hidden sm:inline-block">
              {profile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <div className="text-xs font-semibold text-black">{profile.name}</div>
                <div className="text-[11px] text-gray-500 truncate">{profile.email}</div>
              </div>
              <Link
                href="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Career Profile
              </Link>
              <Link
                href="/what-if"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                What-If Workbench
              </Link>
              <div className="pt-2 mt-1 border-t border-gray-100">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Sign Out to Landing
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
