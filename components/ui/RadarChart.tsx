'use client';

import React from 'react';

interface RadarChartProps {
  data?: { skill: string; score: number }[]; // 0 to 100
}

export function RadarChart({
  data = [
    { skill: 'Python', score: 92 },
    { skill: 'SQL', score: 88 },
    { skill: 'Power BI', score: 45 },
    { skill: 'NumPy', score: 78 },
  ],
}: RadarChartProps) {
  // 4-axis diamond/cross polygon matching Image 1 exactly
  const size = 300;
  const center = size / 2;
  const radius = 100;

  // Axis positions (North, East, South, West)
  const axes = [
    { name: data[0]?.skill || 'Python', score: (data[0]?.score || 90) / 100, x: center, y: center - radius, align: 'middle', dy: -12 },
    { name: data[1]?.skill || 'SQL', score: (data[1]?.score || 85) / 100, x: center + radius, y: center, align: 'start', dx: 14, dy: 4 },
    { name: data[2]?.skill || 'Power BI', score: (data[2]?.score || 50) / 100, x: center, y: center + radius, align: 'middle', dy: 20 },
    { name: data[3]?.skill || 'NumPy', score: (data[3]?.score || 75) / 100, x: center - radius, y: center, align: 'end', dx: -14, dy: 4 },
  ];

  // Concentric levels
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for data
  const dataPoints = axes
    .map((axis) => {
      const x = center + (axis.x - center) * axis.score;
      const y = center + (axis.y - center) * axis.score;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] h-auto overflow-visible select-none">
        {/* Background Grid Rings (Diamonds) */}
        {levels.map((lvl, idx) => {
          const pts = [
            `${center},${center - radius * lvl}`,
            `${center + radius * lvl},${center}`,
            `${center},${center + radius * lvl}`,
            `${center - radius * lvl},${center}`,
          ].join(' ');

          return (
            <polygon
              key={`grid-${idx}`}
              points={pts}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* Cross Axes Lines */}
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#E5E7EB" strokeWidth="1" />
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#E5E7EB" strokeWidth="1" />

        {/* Data Shaded Area (Black/Gray Monochrome) */}
        <polygon
          points={dataPoints}
          fill="#0A0A0A"
          fillOpacity="0.12"
          stroke="#0A0A0A"
          strokeWidth="2"
        />

        {/* Data Vertex Dots */}
        {axes.map((axis, idx) => {
          const vx = center + (axis.x - center) * axis.score;
          const vy = center + (axis.y - center) * axis.score;
          return (
            <circle
              key={`vertex-${idx}`}
              cx={vx}
              cy={vy}
              r="4"
              fill="#0A0A0A"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, idx) => (
          <text
            key={`label-${idx}`}
            x={axis.x + (axis.dx || 0)}
            y={axis.y + (axis.dy || 0)}
            textAnchor={axis.align as any}
            className="text-[11px] font-sans font-medium fill-gray-600"
          >
            {axis.name}
          </text>
        ))}
      </svg>
    </div>
  );
}
