'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUser } from '@/lib/store/user-context';
import { RefreshCw } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isHydrated } = useUser();
  const router = useRouter();

  const isAuthenticated = Boolean(profile?.email && profile.email.trim().length > 0);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // If still checking saved session from localStorage or unauthenticated, show clean auth gate
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-black">Verifying candidate credentials...</p>
          <p className="text-xs text-gray-500">Redirecting to login if no active session is found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex">
      {/* Sidebar with desktop persistent and mobile drawer handling */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 lg:pl-[260px] flex flex-col">
        {/* Topbar with mobile hamburger toggle */}
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* Page Content with smooth entrance transition */}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-20 px-4 sm:px-8 pb-16 max-w-7xl mx-auto w-full flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
