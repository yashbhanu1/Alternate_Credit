import React, { useState, useEffect } from 'react';
import { DEMO_PROFILES } from './constants';
import { engineerFeatures, calculateTrustScore, evaluateLoanRequest } from './services/scoringService';
import { getGeminiAnalysis } from './services/geminiService';
import { ScoreResult, AIAnalysis, RawSignals } from './types';
import { ScoreGauge } from './components/ScoreGauge';
import { FinancialChart } from './components/FinancialChart';
import { ProfileSelector } from './components/ProfileSelector';
import { FeatureCard } from './components/FeatureCard';
import { SignalGroup } from './components/SignalGroup';
import { AddProfileModal } from './components/AddProfileModal';
import { ChatSupport } from './components/ChatSupport';
import { Wallet, ShieldCheck, Smartphone, Activity, Sparkles, AlertCircle, Wifi, Users, Globe, Plus, CheckCircle, Fingerprint, Banknote, ArrowRight, X, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<RawSignals[]>(DEMO_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<RawSignals>(DEMO_PROFILES[0]);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualDecision, setManualDecision] = useState<'approved' | 'rejected' | null>(null);

  useEffect(() => {
    if (selectedProfile) {
      const features = engineerFeatures(selectedProfile);
      const score = calculateTrustScore(features);
      setScoreResult(score);
      setAiAnalysis(null);
      setManualDecision(null);
    }
  }, [selectedProfile]);

  const handleRunAI = async () => {
    if (!selectedProfile || !scoreResult) return;
    setLoadingAI(true);
    try {
      const analysis = await getGeminiAnalysis(selectedProfile, scoreResult.features, scoreResult);
      setAiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAddProfile = (newProfile: RawSignals) => {
    setProfiles([...profiles, newProfile]);
    setSelectedProfile(newProfile);
  };

  const loanEval = scoreResult && selectedProfile
    ? evaluateLoanRequest(
        scoreResult.trustScore,
        scoreResult.features.averageBalance,
        selectedProfile.monthlyIncome,
        selectedProfile.requestedLoanAmount || 0,
        selectedProfile.public
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">INNOVIX AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Alternative Scoring Engine</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold text-sm shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
              New Simulation
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProfileSelector
          profiles={profiles}
          selectedId={selectedProfile.profileId}
          onSelect={setSelectedProfile}
        />

        {scoreResult && loanEval && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Left Column - Core Scoring */}
            <div className="lg:col-span-4 space-y-6">
              <ScoreGauge score={scoreResult.trustScore} grade={scoreResult.grade} />

              {/* Loan Decision Card */}
              <div className={`relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
                manualDecision === 'approved' ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/10' :
                manualDecision === 'rejected' ? 'bg-white border-rose-500 ring-4 ring-rose-500/10' :
                loanEval.status === 'approved' ? 'bg-white border-emerald-100' :
                loanEval.status === 'rejected' ? 'bg-white border-rose-100' :
                'bg-white border-amber-100'
              }`}>
                {/* Decorative background blob */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 ${
                   manualDecision === 'approved' ? 'bg-emerald-600' :
                   manualDecision === 'rejected' ? 'bg-rose-600' :
                   loanEval.status === 'approved' ? 'bg-emerald-500' :
                   loanEval.status === 'rejected' ? 'bg-rose-500' :
                   'bg-amber-500'
                }`}></div>

                <div className="relative flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Banknote size={20} className="text-slate-400"/> Loan Decision
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide shadow-sm ${
                    manualDecision ? (manualDecision === 'approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') :
                    loanEval.status === 'approved' ? 'bg-emerald-500 text-white' :
                    loanEval.status === 'rejected' ? 'bg-rose-500 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {manualDecision ? manualDecision.toUpperCase() : loanEval.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Requested</span>
                        <span className="font-bold text-slate-700">₹{selectedProfile.requestedLoanAmount?.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-px bg-slate-200"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Max Limit</span>
                        <span className={`font-black text-lg ${
                            loanEval.status === 'approved' ? 'text-emerald-600' : 'text-slate-800'
                        }`}>₹{loanEval.maxLimit.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className={`mt-1 p-1 rounded-full ${
                        loanEval.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                        loanEval.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                        {loanEval.status === 'approved' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        {loanEval.reason}
                    </p>
                  </div>

                  {/* Manual Decision Controls */}
                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Manual Override</p>
                    
                    {!manualDecision ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setManualDecision('approved')}
                                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ThumbsUp size={14} /> Approve
                            </button>
                            <button 
                                onClick={() => setManualDecision('rejected')}
                                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                            >
                                <ThumbsDown size={14} /> Reject
                            </button>
                        </div>
                    ) : (
                        <div className={`w-full py-3 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-2 animate-in zoom-in duration-200 ${
                            manualDecision === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                            {manualDecision === 'approved' ? <CheckCircle size={14}/> : <X size={14}/>}
                            <span>Final Decision: {manualDecision === 'approved' ? 'APPROVED' : 'REJECTED'}</span>
                            <button 
                                onClick={() => setManualDecision(null)}
                                className="ml-2 p-1 hover:bg-black/5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                title="Reset Decision"
                            >
                                <RefreshCw size={12}/>
                            </button>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Chart */}
              <FinancialChart data={selectedProfile.financial.transactions} />
            </div>

            {/* Middle Column - Key Metrics & AI */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard
                  label="Financial Health"
                  value={`${(scoreResult.features.financialHealth * 100).toFixed(0)}/100`}
                  subtext="Income Stability"
                  icon={Wallet}
                  colorClass="bg-emerald-500"
                />
                <FeatureCard
                  label="Digital Affinity"
                  value={`${(scoreResult.features.digitalAffinity * 100).toFixed(0)}/100`}
                  subtext="App Usage"
                  icon={Smartphone}
                  colorClass="bg-blue-500"
                />
                <FeatureCard
                  label="Stability"
                  value={`${(scoreResult.features.stabilityScore * 100).toFixed(0)}/100`}
                  subtext="Telecom/Loc"
                  icon={Activity}
                  colorClass="bg-purple-500"
                />
                <FeatureCard
                  label="Interaction"
                  value={`${(scoreResult.features.interactionQuality * 100).toFixed(0)}/100`}
                  subtext="Biometrics"
                  icon={Fingerprint}
                  colorClass="bg-orange-500"
                />
              </div>

              {/* AI Analysis Section */}
              <div className="bg-white border border-indigo-100 rounded-3xl p-1 shadow-lg shadow-indigo-100/50">
                <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-[20px] p-6">
                    <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 leading-tight">Gemini AI Analysis</h3>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Powered by Google</p>
                        </div>
                    </div>
                    {!aiAnalysis && (
                        <button
                        onClick={handleRunAI}
                        disabled={loadingAI}
                        className="group flex items-center gap-2 text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                        >
                        {loadingAI ? 'Synthesizing...' : 'Generate Insights'}
                        {!loadingAI && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    )}
                    </div>

                    {loadingAI && (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                            <Sparkles className="text-indigo-500 animate-spin-slow relative z-10" size={40} />
                        </div>
                        <span className="text-sm font-medium animate-pulse text-indigo-900/60">Synthesizing 50+ signals...</span>
                    </div>
                    )}

                    {aiAnalysis && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 relative">
                           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>
                           <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{aiAnalysis.summary}"
                        </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-bold text-emerald-700 flex items-center gap-2 text-xs uppercase tracking-wider bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                            <CheckCircle size={14} /> Key Strengths
                            </h4>
                            <ul className="space-y-2.5">
                            {aiAnalysis.positiveFactors.map((f, i) => (
                                <li key={i} className="text-slate-600 text-xs pl-2 border-l-2 border-emerald-300 leading-tight font-medium">{f}</li>
                            ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-bold text-rose-700 flex items-center gap-2 text-xs uppercase tracking-wider bg-rose-50 p-2 rounded-lg border border-rose-100">
                            <AlertCircle size={14} /> Risk Flags
                            </h4>
                            <ul className="space-y-2.5">
                            {aiAnalysis.negativeFactors.map((f, i) => (
                                <li key={i} className="text-slate-600 text-xs pl-2 border-l-2 border-rose-300 leading-tight font-medium">{f}</li>
                            ))}
                            </ul>
                        </div>
                        </div>

                        <div className="pt-5 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Strategic Recommendations</h4>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis.recommendations.map((rec, i) => (
                                    <span key={i} className="text-xs bg-slate-100 hover:bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors cursor-default">
                                        {rec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                    
                    {!aiAnalysis && !loadingAI && (
                    <div className="h-56 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-center px-8 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={handleRunAI}>
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <Sparkles className="text-indigo-400 group-hover:text-indigo-600" size={28} />
                        </div>
                        <p className="text-sm text-slate-600 font-bold">AI Analysis Not Generated</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                        Tap "Generate Insights" to process unstructured logs and behavioral patterns.
                        </p>
                    </div>
                    )}
                </div>
              </div>
            </div>

            {/* Right Column - Raw Signals */}
            <div className="lg:col-span-3 space-y-4">
              <SignalGroup
                title="Telecom & Network"
                icon={Wifi}
                color="blue"
                items={[
                  { label: 'Phone Age', value: `${selectedProfile.telecom.phoneNumberAgeMonths} mo` },
                  { label: 'Data Usage', value: `${selectedProfile.telecom.dataUsageGB} GB` },
                  { label: 'Recharge', value: `₹${selectedProfile.telecom.avgRechargeAmount}` },
                ]}
              />
              <SignalGroup
                title="Digital Footprint"
                icon={Globe}
                color="indigo"
                items={[
                  { label: 'App Score', value: selectedProfile.digital.appUsageScore.toFixed(2) },
                  { label: 'Loc Stability', value: `${(selectedProfile.digital.locationConsistencyScore * 100).toFixed(0)}%` },
                  { label: 'E-comm Spend', value: `${(selectedProfile.digital.ecommerceSpendRatio * 100).toFixed(0)}%` },
                ]}
              />
              <SignalGroup
                title="Behavioral"
                icon={Activity}
                color="purple"
                items={[
                  { label: 'Typing Speed', value: selectedProfile.behavioral.typingSpeedScore.toFixed(2) },
                  { label: 'Nav Confusion', value: selectedProfile.behavioral.navPathConfusionScore.toFixed(2), status: selectedProfile.behavioral.navPathConfusionScore > 0.5 ? 'bad' : 'good' },
                  { label: 'Session Time', value: `${selectedProfile.behavioral.avgSessionTimeSeconds}s` },
                ]}
              />
              <SignalGroup
                title="Social & Public"
                icon={Users}
                color="orange"
                items={[
                  { label: 'Network Score', value: selectedProfile.social.socialConnectionsScore.toFixed(2) },
                  { label: 'ID Verified', value: selectedProfile.social.identityVerified },
                  { label: 'Property Owner', value: selectedProfile.public.propertyOwnership },
                  ...(selectedProfile.aadharNumber ? [{ label: 'Aadhar', value: '•••• ' + selectedProfile.aadharNumber.slice(-4) }] : []),
                  ...(selectedProfile.panNumber ? [{ label: 'PAN', value: selectedProfile.panNumber }] : [])
                ]}
              />
            </div>
          </div>
        )}
      </main>

      <AddProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProfile}
      />
      
      <ChatSupport />
    </div>
  );
};

export default App;