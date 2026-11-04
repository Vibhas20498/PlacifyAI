'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
