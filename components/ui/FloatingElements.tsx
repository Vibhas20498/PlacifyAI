'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ShieldCheck, Target, CheckCircle2 } from 'lucide-react';

interface FloatingSkillBadgeProps {
  name: string;
  category?: string;
  icon?: string;
  delay?: number;
  duration?: number;
  className?: string;
  xOffset?: number;
  yOffset?: number;
}

export function FloatingSkillBadge({
  name,
  category = 'Verified',
  delay = 0,
  duration = 6,
  className = '',
  xOffset = 0,
  yOffset = -12,
}: FloatingSkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, yOffset, 0],
        x: [0, xOffset, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: {
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay,
        },
        x: {
          duration: duration * 1.3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay,
        },
      }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-md shadow-black/[0.04] text-xs font-semibold text-black select-none pointer-events-auto hover:border-black hover:scale-105 transition-transform ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>{name}</span>
      <span className="text-[10px] font-mono text-gray-400 font-normal">
        {category}
      </span>
    </motion.div>
  );
}

interface FloatingInsightCardProps {
  title: string;
  value: string;
  subtitle: string;
  type?: 'probability' | 'ats' | 'gap' | 'coach';
  delay?: number;
  duration?: number;
  className?: string;
}

export function FloatingInsightCard({
  title,
  value,
  subtitle,
  type = 'probability',
  delay = 0.2,
  duration = 7,
  className = '',
}: FloatingInsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'probability':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'ats':
        return <ShieldCheck className="w-4 h-4 text-sky-600" />;
      case 'gap':
        return <Target className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        y: {
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay,
        },
      }}
      className={`p-3.5 rounded-2xl bg-white/95 backdrop-blur-lg border border-gray-200/90 shadow-lg shadow-black/[0.06] flex items-center gap-3 select-none pointer-events-auto hover:border-black/50 transition-all ${className}`}
    >
      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center shrink-0">
        {getIcon()}
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold tracking-tight text-black">{value}</span>
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-tight">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function AmbientGlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Top right subtle violet/indigo ambient orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/40 via-purple-100/30 to-transparent blur-3xl"
      />

      {/* Bottom left subtle cyan/emerald ambient orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-sky-200/30 via-emerald-100/30 to-transparent blur-3xl"
      />

      {/* Subtle center spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-gray-100/40 to-transparent rounded-full blur-2xl opacity-60" />
    </div>
  );
}

export function SubtleGridPattern() {
  return (
    <div className="absolute inset-0 bg-tech-grid opacity-[0.55] pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
  );
}
