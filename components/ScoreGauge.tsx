import React from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade }) => {
  // Map 300-850 to 0-100 percentage for the gauge
  const percentage = Math.max(0, Math.min(100, ((score - 300) / 550) * 100));
  
  // Color logic
  let color = '#ef4444'; // Red
  if (score > 550) color = '#f97316'; // Orange
  if (score > 650) color = '#eab308'; // Yellow
  if (score > 700) color = '#22c55e'; // Green
  if (score > 750) color = '#15803d'; // Dark Green

  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-slate-800">{score}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Trust Score</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className={`px-4 py-1 rounded-full text-sm font-bold border ${
          grade === 'A' || grade === 'B' ? 'bg-green-50 text-green-700 border-green-200' :
          grade === 'C' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          Grade {grade}
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center px-4">
          Based on alternative data signals.
        </p>
      </div>
    </div>
  );
};