import React from 'react';
import { RawSignals } from '../types';
import { User, Briefcase, GraduationCap, Home, Crown } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: RawSignals[];
  selectedId: string;
  onSelect: (profile: RawSignals) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, selectedId, onSelect }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'gig-worker': return <Briefcase size={20} />;
      case 'student': return <GraduationCap size={20} />;
      case 'homemaker': return <Home size={20} />;
      case 'chairperson': return <Crown size={20} />;
      default: return <User size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Select Applicant Profile</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {profiles.map((p) => {
          const isSelected = selectedId === p.profileId;
          return (
            <button
              key={p.profileId}
              onClick={() => onSelect(p)}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 border text-center group ${
                isSelected
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white border-blue-600 shadow-xl shadow-blue-900/20 scale-[1.02] ring-2 ring-offset-2 ring-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-xl transition-colors duration-300 ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600'
              }`}>
                {getIcon(p.profileId)}
              </div>
              <div>
                <div className="font-bold text-sm leading-tight mb-1">{p.name}</div>
                <div className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {p.occupation.split('(')[0]}
                </div>
              </div>
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};