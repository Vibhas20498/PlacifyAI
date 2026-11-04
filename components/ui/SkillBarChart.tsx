'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillBarChartProps {
  skills?: { name: string; gap: number; priority: string }[];
}

export function SkillBarChart({
  skills = [
    { name: 'Docker & K8s', gap: 65, priority: 'High' },
    { name: 'Redis Caching', gap: 60, priority: 'High' },
    { name: 'System Design', gap: 50, priority: 'Medium' },
    { name: 'Kafka Streams', gap: 40, priority: 'Medium' },
  ],
}: SkillBarChartProps) {
  return (
    <div className="w-full flex flex-col justify-between h-full pt-2">
      <div className="space-y-4">
        {skills.map((item, idx) => (
          <div key={item.name} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800 group-hover:text-black transition-colors">
                {item.name}
              </span>
              <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                {item.gap}% Gap
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.gap}%` }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`h-full rounded-full ${
                  item.priority === 'High' || item.priority === 'Essential'
                    ? 'bg-gradient-to-r from-gray-900 to-black'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <span>0% (Low Impact)</span>
        <span className="text-gray-500">50% Priority</span>
        <span>100% (Critical)</span>
      </div>
    </div>
  );
}
