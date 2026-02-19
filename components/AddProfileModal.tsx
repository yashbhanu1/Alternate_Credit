import React, { useState } from 'react';
import { X, Plus, Trash2, Calculator, Sparkles, AlertTriangle, Smartphone, Briefcase, MapPin, Wifi, Activity, IndianRupee, Wand2 } from 'lucide-react';
import { RawSignals } from '../types';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (profile: RawSignals) => void;
}

export const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [mode, setMode] = useState<'simulation' | 'manual'>('simulation');
  
  // Common State
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState(50000);

  // Simulation State
  const [income, setIncome] = useState(20000);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Manual State - Financial
  const [manualIncome, setManualIncome] = useState(25000);
  const [expenseItems, setExpenseItems] = useState<{id: number, label: string, amount: number}[]>([
    { id: 1, label: 'House Rent', amount: 8000 },
    { id: 2, label: 'Groceries / Food', amount: 5000 },
    { id: 3, label: 'Utilities & Bills', amount: 2000 },
    { id: 4, label: 'Transport', amount: 1500 }
  ]);
  const [emiDefaults, setEmiDefaults] = useState(0); // 1. Financial Discipline
  
  // Manual State - Payments & Service
  const [ottCount, setOttCount] = useState(2); // 2. Service Usage
  const [refundFreq, setRefundFreq] = useState<'Low' | 'Medium' | 'High'>('Low'); // 2. E-comm behavior

  // Manual State - Device & Tech
  const [deviceRooted, setDeviceRooted] = useState(false); // 3. Technical Stability
  const [deviceAge, setDeviceAge] = useState(18); // 3. Device Age (months)
  
  // Manual State - Behavioral
  const [screenTime, setScreenTime] = useState(4); // 4. Interaction Metrics
  const [appInstallRate, setAppInstallRate] = useState<'Stable' | 'Volatile'>('Stable'); // 3/4. Stability
  
  // Manual State - Mobility & Social
  const [residenceType, setResidenceType] = useState<'Owned' | 'Rented' | 'Family'>('Rented'); // 6. Stability
  const [commuteRegularity, setCommuteRegularity] = useState<'Regular' | 'Erratic'>('Regular'); // 6. Mobility
  const [socialConnectLevel, setSocialConnectLevel] = useState<'High' | 'Medium' | 'Low'>('Medium'); // 5. Social

  // Manual State - Professional
  const [skillPlatformUsage, setSkillPlatformUsage] = useState<'Active' | 'None'>('None'); // 7. Professional

  if (!isOpen) return null;

  const totalManualExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  const addExpenseItem = () => {
    setExpenseItems([...expenseItems, { id: Date.now(), label: '', amount: 0 }]);
  };

  const removeExpenseItem = (id: number) => {
    setExpenseItems(expenseItems.filter(i => i.id !== id));
  };

  const updateExpenseItem = (id: number, field: 'label' | 'amount', value: any) => {
    setExpenseItems(expenseItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generateTransactions = (baseIncome: number, baseExpense: number, isVolatile: boolean) => {
     return Array.from({ length: 6 }).map((_, i) => {
        const variance = isVolatile ? (Math.random() * 0.4 - 0.2) : (Math.random() * 0.1 - 0.05);
        const monthIncome = Math.round(baseIncome * (1 + variance));
        const monthExpense = Math.round(baseExpense * (1 + (variance * 0.5))); 
        return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
            income: monthIncome,
            expenses: monthExpense,
            upiVolume: Math.floor(Math.random() * 50) + 20,
            eodBalance: Math.max(0, (monthIncome - monthExpense) + (Math.random() * 5000))
        };
    });
  };

  const estimateIncome = () => {
    const occ = occupation.toLowerCase();
    let est = 0;
    if (occ.includes('driver') || occ.includes('delivery')) est = 22000;
    else if (occ.includes('teacher') || occ.includes('educator')) est = 35000;
    else if (occ.includes('engineer') || occ.includes('developer') || occ.includes('tech')) est = 85000;
    else if (occ.includes('shop') || occ.includes('business') || occ.includes('merchant')) est = 60000;
    else if (occ.includes('student')) est = 12000;
    else if (occ.includes('maid') || occ.includes('helper')) est = 15000;
    else if (occ.includes('manager')) est = 70000;
    else if (occ.includes('clerk') || occ.includes('admin')) est = 25000;
    else est = Math.floor(Math.random() * 40000) + 20000; // Random fallback
    
    // Add some variance
    est = Math.round(est * (0.9 + Math.random() * 0.2));
    
    if (mode === 'simulation') setIncome(est);
    else setManualIncome(est);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newProfile: RawSignals;

    if (mode === 'simulation') {
        const isRisky = riskLevel === 'High';
        const isSafe = riskLevel === 'Low';
        const expenseRatio = isRisky ? 0.95 : isSafe ? 0.6 : 0.8;
        const estExpense = income * expenseRatio;

        newProfile = {
            profileId: `user-${Date.now()}`,
            name,
            occupation,
            description: `Generated ${riskLevel} Risk Profile.`,
            monthlyIncome: income,
            requestedLoanAmount,
            financial: {
                transactions: generateTransactions(income, estExpense, isRisky),
                loanRepaymentScore: isSafe ? 0.9 : isRisky ? 0.4 : 0.7
            },
            telecom: {
                phoneNumberAgeMonths: isSafe ? 60 : isRisky ? 6 : 24,
                avgRechargeAmount: 400,
                dataUsageGB: 20,
                roamingDays: isRisky ? 15 : 2,
                callConsistencyScore: isSafe ? 0.95 : 0.6
            },
            utilities: {
                totalBills: 12,
                onTimePayments: isSafe ? 12 : isRisky ? 6 : 10,
                utilityTypes: ["Electricity", "Mobile"]
            },
            digital: {
                appUsageScore: isSafe ? 0.8 : 0.5,
                ecommerceSpendRatio: isRisky ? 0.5 : 0.2,
                browserHistoryRiskScore: isRisky ? 0.7 : 0.1,
                deviceSwitchCountYear: isRisky ? 3 : 0,
                locationConsistencyScore: isSafe ? 0.9 : 0.5
            },
            social: {
                socialConnectionsScore: 0.7,
                identityVerified: true,
                emailAgeMonths: isSafe ? 48 : 12
            },
            public: {
                propertyOwnership: isSafe,
                businessRegistered: false,
                noCriminalRecord: true
            },
            employment: {
                tenureMonths: isSafe ? 36 : isRisky ? 3 : 12,
                isSalaried: false
            },
            behavioral: {
                avgSessionTimeSeconds: isRisky ? 30 : 120,
                typingSpeedScore: isRisky ? 0.4 : 0.8,
                navPathConfusionScore: isRisky ? 0.6 : 0.1,
                sensorSteadinessScore: isSafe ? 0.9 : 0.6
            }
        };
    } else {
        // MANUAL MODE - Complex Mapping Logic
        
        // 1. Calculate Financial Discipline
        let loanScore = 0.9;
        loanScore -= (emiDefaults * 0.2); // Heavy penalty for defaults
        loanScore = Math.max(0.1, loanScore);

        // 2. Behavioral & Device Score
        let riskScore = 0.0;
        if (deviceRooted) riskScore += 0.8;
        if (refundFreq === 'High') riskScore += 0.3;
        if (appInstallRate === 'Volatile') riskScore += 0.2;
        riskScore = Math.min(1.0, riskScore);

        // 3. Stability Mapping
        const isStableCommute = commuteRegularity === 'Regular';
        const isOwner = residenceType === 'Owned' || residenceType === 'Family';
        const locationConsistency = (isStableCommute ? 0.4 : 0) + (isOwner ? 0.5 : 0.1);

        // 4. Social & Professional
        const socialScore = socialConnectLevel === 'High' ? 0.9 : socialConnectLevel === 'Medium' ? 0.6 : 0.3;
        const profBonus = skillPlatformUsage === 'Active' ? 0.2 : 0;
        
        // 5. Tech/Nav
        const navConfusion = screenTime > 8 ? 0.4 : 0.1; // Too much time might imply confusion or addiction

        newProfile = {
            profileId: `user-manual-${Date.now()}`,
            name,
            occupation,
            description: `Manual Profile: ${emiDefaults > 0 ? 'History of defaults.' : 'Good repayment history.'} ${deviceRooted ? 'High risk device detected.' : 'Secure device.'}`,
            monthlyIncome: manualIncome,
            requestedLoanAmount,
            financial: {
                transactions: generateTransactions(manualIncome, totalManualExpenses, emiDefaults > 0),
                loanRepaymentScore: loanScore
            },
            telecom: {
                phoneNumberAgeMonths: deviceAge + 12, // Proxy
                avgRechargeAmount: ottCount > 2 ? 600 : 300,
                dataUsageGB: screenTime * 5,
                roamingDays: commuteRegularity === 'Erratic' ? 10 : 2,
                callConsistencyScore: 0.85
            },
            utilities: {
                totalBills: 12,
                onTimePayments: emiDefaults > 0 ? 8 : 12,
                utilityTypes: ["Electricity", "Mobile", ...(ottCount > 0 ? ["Streaming"] : [])]
            },
            digital: {
                appUsageScore: appInstallRate === 'Stable' ? 0.8 : 0.4,
                ecommerceSpendRatio: refundFreq === 'High' ? 0.4 : 0.15,
                browserHistoryRiskScore: riskScore,
                deviceSwitchCountYear: deviceAge < 6 ? 2 : 0,
                locationConsistencyScore: locationConsistency
            },
            social: {
                socialConnectionsScore: Math.min(1, socialScore + profBonus),
                identityVerified: true,
                emailAgeMonths: deviceAge * 2
            },
            public: {
                propertyOwnership: residenceType === 'Owned',
                businessRegistered: false,
                noCriminalRecord: true
            },
            employment: {
                tenureMonths: 24,
                isSalaried: true
            },
            behavioral: {
                avgSessionTimeSeconds: screenTime * 60,
                typingSpeedScore: 0.8,
                navPathConfusionScore: navConfusion,
                sensorSteadinessScore: commuteRegularity === 'Regular' ? 0.9 : 0.5
            }
        };
    }

    onAdd(newProfile);
    onClose();
    setName('');
    setOccupation('');
    setRequestedLoanAmount(50000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <div>
                <h3 className="text-xl font-bold text-slate-800">New Applicant Profile</h3>
                <p className="text-xs text-slate-500">Configure signals to simulate risk assessment</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                <X size={20} />
            </button>
        </div>

        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setMode('simulation')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'simulation' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Quick Simulation
            </button>
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'manual' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Detailed Manual Entry
            </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
            <form id="profileForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Identity Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            placeholder="e.g. Vikram Das"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Occupation</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            placeholder="e.g. Driver"
                            value={occupation}
                            onChange={e => setOccupation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Requested Loan (₹)</label>
                        <div className="relative">
                            <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input 
                                required
                                type="number" 
                                className="w-full pl-9 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-slate-700"
                                value={requestedLoanAmount}
                                onChange={e => setRequestedLoanAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Simulation Mode Content */}
                {mode === 'simulation' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4 items-start">
                            <Sparkles className="text-blue-600 shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-800 mb-1">AI-Powered Synthesis</h4>
                                <p className="text-sm text-blue-700 mb-4 opacity-90">
                                    Our system will automatically generate thousands of data points (transactions, app logs, sensor data) matching the selected risk archetype.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-900 mb-1">Base Monthly Income (₹)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" 
                                                className="w-full p-2.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                value={income}
                                                onChange={e => setIncome(Number(e.target.value))}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={estimateIncome}
                                                className="p-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="Auto-estimate based on occupation"
                                            >
                                                <Wand2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-900 mb-1">Risk Archetype</label>
                                        <select 
                                            className="w-full p-2.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            value={riskLevel}
                                            onChange={(e: any) => setRiskLevel(e.target.value)}
                                        >
                                            <option value="Low">Low Risk (Stable Saver)</option>
                                            <option value="Medium">Medium Risk (Average)</option>
                                            <option value="High">High Risk (Volatile Spender)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Mode Content */}
                {mode === 'manual' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        
                        {/* 1. Financial Behavior */}
                        <div>
                             <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Calculator size={18} className="text-blue-600" />
                                <h4 className="text-sm font-bold text-slate-700 uppercase">1. Financial Behaviour</h4>
                             </div>
                             
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 space-y-3">
                                    <h5 className="text-xs font-bold text-slate-700 uppercase">Cashflow</h5>
                                    <div className="flex justify-between items-center mb-2">
                                         <span className="text-xs font-bold text-slate-700">Monthly Income</span>
                                         <div className="flex gap-2">
                                             <input 
                                                type="number"
                                                className="w-28 p-1.5 text-right text-sm font-bold rounded border border-slate-300 bg-white"
                                                value={manualIncome}
                                                onChange={e => setManualIncome(Number(e.target.value))}
                                             />
                                             <button 
                                                type="button" 
                                                onClick={estimateIncome}
                                                className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50"
                                                title="Auto-estimate"
                                             >
                                                <Wand2 size={14} />
                                             </button>
                                         </div>
                                    </div>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                        {expenseItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <input 
                                                    type="text"
                                                    placeholder="Category"
                                                    className="flex-1 p-2 text-xs rounded border border-slate-200 bg-white"
                                                    value={item.label}
                                                    onChange={e => updateExpenseItem(item.id, 'label', e.target.value)}
                                                />
                                                <input 
                                                    type="number"
                                                    placeholder="Amt"
                                                    className="w-20 p-2 text-xs text-right rounded border border-slate-200 bg-white"
                                                    value={item.amount}
                                                    onChange={e => updateExpenseItem(item.id, 'amount', Number(e.target.value))}
                                                />
                                                <button type="button" onClick={() => removeExpenseItem(item.id)}>
                                                    <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addExpenseItem} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                        <Plus size={12} /> Add Expense
                                    </button>
                                 </div>

                                 <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 space-y-4">
                                     <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Past Year EMI Defaults</label>
                                        <select 
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-white"
                                            value={emiDefaults}
                                            onChange={(e: any) => setEmiDefaults(Number(e.target.value))}
                                        >
                                            <option value={0}>0 (Clean History)</option>
                                            <option value={1}>1 (Minor Lapse)</option>
                                            <option value={3}>2-3 (Concern)</option>
                                            <option value={5}>4+ (High Risk)</option>
                                        </select>
                                     </div>
                                     <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Active Subscriptions (OTT/Apps)</label>
                                        <input 
                                            type="number"
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-white"
                                            value={ottCount}
                                            onChange={e => setOttCount(Number(e.target.value))}
                                        />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Refund/Return Frequency</label>
                                        <select 
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-white"
                                            value={refundFreq}
                                            onChange={(e: any) => setRefundFreq(e.target.value)}
                                        >
                                            <option value="Low">Low (Decisive Buyer)</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High (Impulsive/Indecisive)</option>
                                        </select>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* 2. Device & Digital */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Smartphone size={18} className="text-purple-600" />
                                <h4 className="text-sm font-bold text-slate-700 uppercase">2. Device & Digital Stability</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Device Security</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={deviceRooted} 
                                            onChange={e => setDeviceRooted(e.target.checked)}
                                            className="w-4 h-4 text-purple-600 rounded bg-white" 
                                        />
                                        <span className="text-sm font-medium text-slate-700">Rooted / Jailbroken</span>
                                    </label>
                                    {deviceRooted && <span className="text-xs text-red-500 mt-1 block flex items-center gap-1"><AlertTriangle size={10}/> Fraud Risk</span>}
                                </div>
                                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Device Age (Months)</label>
                                    <input type="number" value={deviceAge} onChange={e => setDeviceAge(Number(e.target.value))} className="w-full p-1.5 border border-slate-200 rounded text-sm bg-white"/>
                                </div>
                                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">App Install/Delete Rate</label>
                                    <select value={appInstallRate} onChange={(e: any) => setAppInstallRate(e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-sm bg-white">
                                        <option value="Stable">Stable</option>
                                        <option value="Volatile">High Churn</option>
                                    </select>
                                </div>
                                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Screen Time (Hrs)</label>
                                    <input type="number" value={screenTime} onChange={e => setScreenTime(Number(e.target.value))} className="w-full p-1.5 border border-slate-200 rounded text-sm bg-white"/>
                                </div>
                            </div>
                        </div>

                        {/* 3. Lifestyle & Social */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <MapPin size={18} className="text-orange-600" />
                                <h4 className="text-sm font-bold text-slate-700 uppercase">3. Mobility, Social & Professional</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Residential Status</label>
                                    <select value={residenceType} onChange={(e: any) => setResidenceType(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                                        <option value="Owned">Owned (High Stability)</option>
                                        <option value="Family">Living with Family</option>
                                        <option value="Rented">Rented</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Commute Pattern</label>
                                    <select value={commuteRegularity} onChange={(e: any) => setCommuteRegularity(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                                        <option value="Regular">Regular (Predictable)</option>
                                        <option value="Erratic">Erratic (Gig/Sales)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Social Connections</label>
                                    <select value={socialConnectLevel} onChange={(e: any) => setSocialConnectLevel(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                                        <option value="High">Strong Network</option>
                                        <option value="Medium">Average</option>
                                        <option value="Low">Sparse / New</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Prof. Skill Platform Activity</label>
                                    <select value={skillPlatformUsage} onChange={(e: any) => setSkillPlatformUsage(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50">
                                        <option value="Active">Active (Upskilling)</option>
                                        <option value="None">None</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button 
                onClick={handleSubmit} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/10 flex justify-center items-center gap-2"
            >
               {mode === 'simulation' ? <Sparkles size={18} /> : <Plus size={18} />}
               {mode === 'simulation' ? 'Generate Profile' : 'Create Profile from Signals'}
            </button>
        </div>
      </div>
    </div>
  );
}