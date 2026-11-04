'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number | string;
  badge?: string;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  layoutId?: string;
  variant?: 'pills' | 'underlined' | 'dark';
  className?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  layoutId = 'animated-active-tab',
  variant = 'pills',
  className = '',
}: AnimatedTabsProps) {
  if (variant === 'underlined') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto pb-px border-b border-gray-200 scrollbar-none ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 focus-visible:outline-none ${
                isActive ? 'text-black' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-gray-400'}`} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pills' variant
  const isDark = variant === 'dark';

  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl ${
        isDark ? 'bg-slate-900 border border-slate-800' : 'bg-gray-100/80 border border-gray-200/60'
      } scrollbar-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 focus-visible:outline-none z-10 ${
              isActive
                ? isDark
                  ? 'text-white'
                  : 'text-black'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {/* Active sliding pill */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 rounded-xl shadow-xs -z-10 ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border border-gray-200/80'
                }`}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}

            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-sky-400'
                      : 'text-black'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-gray-500'
                }`}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive
                    ? isDark
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-gray-100 text-gray-800'
                    : isDark
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-gray-200/60 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
                    : 'bg-gray-200/50 text-gray-500'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
