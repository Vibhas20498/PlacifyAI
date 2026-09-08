'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, FileText, Briefcase, Target, ArrowRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  iconType: 'trending' | 'file' | 'briefcase' | 'target';
  href: string;
  subtitle?: string;
}

export function StatCard({ label, value, iconType, href, subtitle }: StatCardProps) {
  const renderIcon = () => {
    switch (iconType) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-black" />;
      case 'file':
        return <FileText className="w-4 h-4 text-black" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-black" />;
      case 'target':
        return <Target className="w-4 h-4 text-black" />;
      default:
        return <TrendingUp className="w-4 h-4 text-black" />;
    }
  };

  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
          <span className="group-hover:text-white transition-colors">
            {renderIcon()}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
      </div>

      <div className="mt-2">
        <div className="text-3xl font-bold font-mono tracking-tight text-black">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-600 mt-1">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 mt-0.5 font-mono">
            {subtitle}
          </div>
        )}
      </div>
    </Link>
  );
}
