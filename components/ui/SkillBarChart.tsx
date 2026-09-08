'use client';

import React from 'react';

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
        {skills.map((item) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-800">{item.name}</span>
              <span className="font-mono text-gray-500">{item.gap}% Gap</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.gap}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <span>0% (Low Impact)</span>
        <span>50%</span>
        <span>100% (Critical)</span>
      </div>
    </div>
  );
}
