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
      return val ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-400" />;
    }
    if (status === 'good') return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
    if (status === 'bad') return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
    return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
        <div className={`p-1.5 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={16} />
        </div>
        <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{item.label}</span>
            <div className="flex items-center gap-2 font-medium text-slate-800">
              {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value}
              {getStatusIcon(item.status, item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};