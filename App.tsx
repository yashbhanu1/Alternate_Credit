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
import { Wallet, ShieldCheck, Smartphone, Activity, Sparkles, AlertCircle, Wifi, Users, Globe, Plus, CheckCircle, Fingerprint } from 'lucide-react';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<RawSignals[]>(DEMO_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<RawSignals>(DEMO_PROFILES[0]);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedProfile) {
      const features = engineerFeatures(selectedProfile);
      const score = calculateTrustScore(features);
      setScoreResult(score);
      setAiAnalysis(null);
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
        selectedProfile.requestedLoanAmount || 0
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">CreditPulse AI</h1>
            <p className="text-xs text-slate-500 font-medium">Alternative Data Risk Engine</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium text-sm"
        >
          <Plus size={16} />
          New Simulation
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProfileSelector
          profiles={profiles}
          selectedId={selectedProfile.profileId}
          onSelect={setSelectedProfile}
        />

        {scoreResult && loanEval && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Core Scoring */}
            <div className="lg:col-span-4 space-y-6">
              <ScoreGauge score={scoreResult.trustScore} grade={scoreResult.grade} />

              {/* Loan Decision Card */}
              <div className={`p-5 rounded-xl border ${
                loanEval.status === 'approved' ? 'bg-green-50 border-green-200' :
                loanEval.status === 'rejected' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">Loan Eligibility</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    loanEval.status === 'approved' ? 'bg-green-200 text-green-800' :
                    loanEval.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {loanEval.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Requested</span>
                    <span className="font-medium">₹{selectedProfile.requestedLoanAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Limit</span>
                    <span className="font-bold text-slate-900">₹{loanEval.maxLimit.toLocaleString()}</span>
                  </div>
                  <p className="text-xs mt-2 pt-2 border-t opacity-80 leading-relaxed border-current">
                    {loanEval.reason}
                  </p>
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
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-slate-800">AI Risk Assessment</h3>
                  </div>
                  {!aiAnalysis && (
                    <button
                      onClick={handleRunAI}
                      disabled={loadingAI}
                      className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-semibold disabled:opacity-50 transition-colors"
                    >
                      {loadingAI ? 'Analyzing...' : 'Generate Insights'}
                    </button>
                  )}
                </div>

                {loadingAI && (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 animate-pulse space-y-3">
                    <Sparkles className="text-indigo-300 animate-spin-slow" size={32} />
                    <span className="text-sm">Processing 50+ alternative data signals...</span>
                  </div>
                )}

                {aiAnalysis && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                       <p className="text-sm text-slate-700 leading-relaxed italic">
                        "{aiAnalysis.summary}"
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-emerald-700 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wide">
                          <CheckCircle size={14} /> Positive Factors
                        </h4>
                        <ul className="space-y-2">
                          {aiAnalysis.positiveFactors.map((f, i) => (
                            <li key={i} className="text-slate-600 text-xs pl-3 border-l-2 border-emerald-200 leading-tight">{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wide">
                          <AlertCircle size={14} /> Risk Factors
                        </h4>
                        <ul className="space-y-2">
                          {aiAnalysis.negativeFactors.map((f, i) => (
                            <li key={i} className="text-slate-600 text-xs pl-3 border-l-2 border-red-200 leading-tight">{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Recommendations</h4>
                        <div className="flex flex-wrap gap-2">
                            {aiAnalysis.recommendations.map((rec, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                    {rec}
                                </span>
                            ))}
                        </div>
                    </div>
                  </div>
                )}
                
                {!aiAnalysis && !loadingAI && (
                  <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center px-6">
                    <Sparkles className="text-slate-300 mb-2" size={24} />
                    <p className="text-sm text-slate-500 font-medium">No Analysis Generated</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click the button above to use GenAI to synthesize unstructured logs, behavioral patterns, and raw signals.
                    </p>
                  </div>
                )}
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
    </div>
  );
};

export default App;