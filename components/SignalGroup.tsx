import React from 'react';
import { LucideIcon, Check, X, Minus } from 'lucide-react';

interface SignalItem {
  label: string;
  value: string | number | boolean;
  status?: 'good' | 'neutral' | 'bad';
}

interface SignalGroupProps {
  title: string;
  icon: LucideIcon;
  items: SignalItem[];
  color: string;
}

export const SignalGroup: React.FC<SignalGroupProps> = ({ title, icon: Icon, items, color }) => {
  const getStatusIcon = (status?: string, val?: any) => {
    if (typeof val === 'boolean') {
      return val ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-rose-400" />;
    }
    if (status === 'good') return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>;
    if (status === 'bad') return <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>;
    return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
        <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600 ring-4 ring-${color}-50/50`}>
          <Icon size={18} />
        </div>
        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm group">
            <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">{item.label}</span>
            <div className="flex items-center gap-3 font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
              {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value}
              {getStatusIcon(item.status, item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};