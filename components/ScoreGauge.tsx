import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Award } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade }) => {
  // Score range: 300 - 850. Total range = 550.
  const minScore = 300;
  const maxScore = 850;
  const normalizedScore = Math.min(Math.max(score, minScore), maxScore);
  const percentage = (normalizedScore - minScore) / (maxScore - minScore);

  // Geometry for a 260-degree gauge centered at top (-90deg)
  // Start: 130 deg (Bottom Left)
  // End: 50 deg (Bottom Right) - passing through Top (-90 / 270)
  // Actually simpler:
  // Start Angle: 140 degrees (radians) -> Bottom Leftish
  // End Angle: 40 degrees (radians) -> Bottom Rightish
  // We draw clockwise from Start to End. 
  // SVG coords: 0 is Right, 90 is Down, 180 is Left, 270/-90 is Top.
  
  const radius = 85;
  const strokeWidth = 14;
  const center = 100;
  
  // We want to span 260 degrees.
  // The gap at bottom is 100 degrees.
  // Symmetrical around 90 (Bottom) is the gap.
  // Start drawing at 140 degrees (Bottom Left)
  // Go around top to 40 degrees (Bottom Right)
  const startDeg = 140;
  const endDeg = 40;
  
  // Convert to radians
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;
  
  // Parametric equation for circle: x = cx + r*cos(a), y = cy + r*sin(a)
  const startX = center + radius * Math.cos(startRad);
  const startY = center + radius * Math.sin(startRad);
  const endX = center + radius * Math.cos(endRad);
  const endY = center + radius * Math.sin(endRad);
  
  // SVG Path: M startX startY A radius radius 0 largeArcFlag sweepFlag endX endY
  // largeArcFlag = 1 because 260 > 180
  const bgPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

  // For the progress, we use stroke-dasharray.
  // Total arc length = 2 * PI * r * (260/360)
  const arcLen = 2 * Math.PI * radius * (260 / 360);
  const progressLen = arcLen * percentage;

  // Color logic
  let color = '#ef4444';
  let gradientId = 'grad-red';
  let gradeText = 'Poor';
  let Icon = AlertCircle;
  let bgGlow = 'bg-red-500/5';
  
  if (score >= 550) { color = '#f97316'; gradientId = 'grad-orange'; gradeText = 'Fair'; Icon = AlertCircle; bgGlow = 'bg-orange-500/5'; }
  if (score >= 650) { color = '#eab308'; gradientId = 'grad-yellow'; gradeText = 'Good'; Icon = TrendingUp; bgGlow = 'bg-yellow-500/5'; }
  if (score >= 700) { color = '#10b981'; gradientId = 'grad-emerald'; gradeText = 'Very Good'; Icon = CheckCircle; bgGlow = 'bg-emerald-500/5'; }
  if (score >= 750) { color = '#16a34a'; gradientId = 'grad-green'; gradeText = 'Excellent'; Icon = Award; bgGlow = 'bg-green-500/5'; }

  return (
    <div className={`relative bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center overflow-hidden ${bgGlow}`}>
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
      
      <div className="relative w-64 h-52 flex items-center justify-center mt-2 z-20">
        <svg viewBox="0 0 200 170" className="w-full h-full drop-shadow-md">
           <defs>
            <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <path 
            d={bgPath} 
            fill="none" 
            stroke="#f1f5f9" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />

          {/* Progress Track */}
          <path 
            d={bgPath} 
            fill="none" 
            stroke={`url(#${gradientId})`} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round"
            strokeDasharray={`${progressLen} ${arcLen}`}
            strokeDashoffset="0"
            filter="url(#glow-filter)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
            <div className="flex flex-col items-center animate-in zoom-in fade-in duration-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trust Score</span>
                <span className="text-6xl font-black tracking-tighter text-slate-800" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    {score}
                </span>
                
                <div className={`flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border bg-white/80 backdrop-blur-sm shadow-sm ${
                    score >= 700 ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                    score >= 550 ? 'text-orange-700 border-orange-200 bg-orange-50' :
                    'text-red-700 border-red-200 bg-red-50'
                }`}>
                    <Icon size={14} strokeWidth={3} />
                    <span className="text-xs font-bold uppercase tracking-wide">{gradeText}</span>
                    <span className="text-xs font-medium opacity-70 ml-1">({grade})</span>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="w-full grid grid-cols-3 gap-px bg-slate-100 rounded-xl overflow-hidden mt-2">
         <div className="bg-white p-3 text-center">
             <div className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Min</div>
             <div className="text-xs font-bold text-slate-600">300</div>
         </div>
         <div className="bg-white p-3 text-center relative">
             <div className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Percentile</div>
             <div className="text-xs font-bold text-blue-600">Top {(100 - (percentage * 100)).toFixed(0)}%</div>
         </div>
         <div className="bg-white p-3 text-center">
             <div className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Max</div>
             <div className="text-xs font-bold text-slate-600">850</div>
         </div>
      </div>
    </div>
  );
};