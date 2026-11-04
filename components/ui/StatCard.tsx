'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, FileText, Briefcase, Target, ArrowRight } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  label: string;
  value: string | number;
  iconType: 'trending' | 'file' | 'briefcase' | 'target';
  href: string;
  subtitle?: string;
  accentColor?: string;
}

export function StatCard({ label, value, iconType, href, subtitle }: StatCardProps) {
  const renderIcon = () => {
    switch (iconType) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-black group-hover:text-white transition-colors" />;
      case 'file':
        return <FileText className="w-4 h-4 text-black group-hover:text-white transition-colors" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-black group-hover:text-white transition-colors" />;
      case 'target':
        return <Target className="w-4 h-4 text-black group-hover:text-white transition-colors" />;
      default:
        return <TrendingUp className="w-4 h-4 text-black group-hover:text-white transition-colors" />;
    }
  };

  // Helper to parse numerical value and suffix (e.g., "82%", "68/100", 94)
  const renderValue = () => {
    if (typeof value === 'number') {
      return <AnimatedCounter value={value} />;
    }

    const str = String(value).trim();
    const percentMatch = str.match(/^([0-9.]+)\s*%$/);
    if (percentMatch) {
      const num = parseFloat(percentMatch[1]);
      return <AnimatedCounter value={num} suffix="%" />;
    }

    const fractionMatch = str.match(/^([0-9.]+)\s*\/\s*100$/);
    if (fractionMatch) {
      const num = parseFloat(fractionMatch[1]);
      return (
        <span className="flex items-baseline gap-0.5">
          <AnimatedCounter value={num} />
          <span className="text-xl font-medium text-gray-400">/100</span>
        </span>
      );
    }

    return <span>{str}</span>;
  };

  return (
    <Link href={href} className="block group outline-none">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
        whileTap={{ scale: 0.98 }}
        className="bg-white border border-gray-200 group-hover:border-black rounded-2xl p-6 transition-colors duration-200 shadow-sm group-hover:shadow-glass-hover relative overflow-hidden"
      >
        {/* Subtle accent line on top that reveals on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-black flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xs">
            {renderIcon()}
          </div>
          <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-3xl font-extrabold tracking-tight text-black font-sans">
            {renderValue()}
          </div>
          <div className="text-sm font-semibold text-gray-800 mt-1">
            {label}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1.5">
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
