import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  colorClass: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ label, value, subtext, icon: Icon, colorClass }) => {
  // Map Tailwind color classes to gradients
  const getGradient = (cls: string) => {
    if (cls.includes('emerald')) return 'from-emerald-400 to-emerald-600';
    if (cls.includes('blue')) return 'from-blue-400 to-blue-600';
    if (cls.includes('purple')) return 'from-purple-400 to-purple-600';
    if (cls.includes('orange')) return 'from-orange-400 to-orange-600';
    return 'from-slate-400 to-slate-600';
  };

  const gradient = getGradient(colorClass);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      {/* Hover Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            {subtext}
        </p>
      </div>
    </div>
  );
};