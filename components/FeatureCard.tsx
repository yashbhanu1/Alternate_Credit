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
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-lg font-bold text-slate-800">{value}</h4>
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      </div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
  );
};