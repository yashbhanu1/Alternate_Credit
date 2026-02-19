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
      case 'gig-worker': return <Briefcase size={18} />;
      case 'student': return <GraduationCap size={18} />;
      case 'homemaker': return <Home size={18} />;
      case 'chairperson': return <Crown size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {profiles.map((p) => (
        <button
          key={p.profileId}
          onClick={() => onSelect(p)}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all border text-left ${
            selectedId === p.profileId
              ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-lg ${selectedId === p.profileId ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
            {getIcon(p.profileId)}
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">{p.name}</div>
            <div className={`text-xs ${selectedId === p.profileId ? 'text-blue-100' : 'text-slate-400'}`}>
              {p.occupation.split(' ')[0]}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};