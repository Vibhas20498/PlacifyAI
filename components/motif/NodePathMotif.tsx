'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroNodePathProps {
  interactive?: boolean;
}

export function HeroNodePath({ interactive = false }: HeroNodePathProps) {
  // 5-Node Graph matching Screenshot 3:
  // Node 1: Top (Profile)
  // Node 2: Middle Top (AI Analysis)
  // Node 3: Middle Left (Skills)
  // Node 4: Middle Right (Jobs)
  // Node 5: Bottom (Readiness)

  const nodes = [
    { id: 'profile', label: 'Profile', x: 250, y: 60, status: 'completed' },
    { id: 'analysis', label: 'AI Analysis', x: 250, y: 190, status: 'completed' },
    { id: 'skills', label: 'Skills', x: 120, y: 310, status: 'completed' },
    { id: 'jobs', label: 'Jobs', x: 380, y: 310, status: 'completed' },
    { id: 'readiness', label: 'Readiness', x: 250, y: 440, status: 'active' },
  ];

  const edges = [
    { from: [250, 78], to: [250, 172] }, // Profile to AI Analysis
    { from: [235, 205], to: [135, 295] }, // AI Analysis to Skills
    { from: [265, 205], to: [365, 295] }, // AI Analysis to Jobs
    { from: [135, 325], to: [235, 425] }, // Skills to Readiness
    { from: [365, 325], to: [265, 425] }, // Jobs to Readiness
  ];

  return (
    <div className="relative w-full max-w-[500px] h-[520px] flex items-center justify-center select-none">
      <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
        {/* Connecting Lines */}
        {edges.map((edge, idx) => (
          <motion.line
            key={`edge-${idx}`}
            x1={edge.from[0]}
            y1={edge.from[1]}
            x2={edge.to[0]}
            y2={edge.to[1]}
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, idx) => (
          <g key={node.id} className="cursor-default">
            {/* Label */}
            <motion.text
              x={node.x}
              y={node.y - 24}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-500 font-sans select-none tracking-tight"
              initial={{ opacity: 0, y: node.y - 15 }}
              animate={{ opacity: 1, y: node.y - 24 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
            >
              {node.label}
            </motion.text>

            {/* Outer Circle Ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill="#FFFFFF"
              stroke="#0A0A0A"
              strokeWidth="2.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2 + idx * 0.12,
              }}
              whileHover={interactive ? { scale: 1.15 } : {}}
            />

            {/* Inner Core */}
            {node.status === 'active' && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="7"
                fill="#0A0A0A"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function HorizontalOverviewNodePath({ currentStage = 4 }: { currentStage?: number }) {
  const stages = [
    { num: '01', label: 'Profile' },
    { num: '02', label: 'Skills' },
    { num: '03', label: 'Projects' },
    { num: '04', label: 'DSA/Code' },
    { num: '05', label: 'Interview' },
    { num: '06', label: 'Job Match' },
    { num: '07', label: 'Placement' },
  ];

  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[580px] px-2">
        {stages.map((stage, idx) => {
          const isDone = idx + 1 < currentStage;
          const isCurrent = idx + 1 === currentStage;

          return (
            <React.Fragment key={stage.num}>
              <div className="flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-black text-white'
                      : isCurrent
                      ? 'border-2 border-black bg-white text-black ring-4 ring-gray-100'
                      : 'border border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : stage.num}
                </div>
                <span
                  className={`mt-2 text-[11px] tracking-tight ${
                    isDone || isCurrent ? 'font-semibold text-black' : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {idx < stages.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 transition-all ${
                    idx + 1 < currentStage ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
