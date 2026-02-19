import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle, Loader2, BarChart3, Database, Layers, Cpu, Award, ArrowRight, Play, Terminal, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ModelTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'upload', label: 'Ingestion' },
  { id: 'processing', label: 'Engineering' },
  { id: 'training', label: 'Training' },
  { id: 'results', label: 'Evaluation' }
];

const MOCK_FEATURE_IMPORTANCE = [
  { name: 'Cashflow Stability', value: 85, color: '#10b981' },
  { name: 'Social Graph Score', value: 72, color: '#3b82f6' },
  { name: 'Utility Pmt Ratio', value: 65, color: '#6366f1' },
  { name: 'Device Consistency', value: 45, color: '#8b5cf6' },
  { name: 'App Risk Profile', value: 38, color: '#ec4899' },
  { name: 'Geo-Location Var', value: 25, color: '#f59e0b' },
];

const CALIBRATION_DATA = [
  { prob: 0, actual: 0 },
  { prob: 0.2, actual: 0.18 },
  { prob: 0.4, actual: 0.38 },
  { prob: 0.6, actual: 0.62 },
  { prob: 0.8, actual: 0.81 },
  { prob: 1.0, actual: 0.98 },
];

export const ModelTrainingModal: React.FC<ModelTrainingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const runPipeline = async () => {
    setCurrentStep(1);
    setLogs([]);
    setProgress(0);

    // Phase 1: Cleaning & Labeling
    addLog("Initializing ETL pipeline...");
    await new Promise(r => setTimeout(r, 800));
    addLog(`Ingesting ${file ? file.name : 'kaggle_credit_risk_dataset.csv'} (15,420 rows)...`);
    setProgress(10);
    await new Promise(r => setTimeout(r, 800));
    addLog("Normalizing currency formats (INR/USD)...");
    addLog("Fixing timestamp inconsistencies...");
    setProgress(25);
    await new Promise(r => setTimeout(r, 800));
    addLog("Generating Labels: Target 'Default' (90+ days overdue)...");
    addLog("Class Imbalance Detected: 12% Positive / 88% Negative");
    addLog("Applying SMOTE oversampling...");
    setProgress(40);
    
    // Phase 2: Feature Engineering
    await new Promise(r => setTimeout(r, 1000));
    addLog("--- FEATURE ENGINEERING STARTED ---");
    addLog("Transforming: raw_transactions -> 'income_stability_index'");
    addLog("Transforming: call_logs -> 'social_connectedness_score'");
    addLog("Transforming: app_list -> 'digital_affinity_score'");
    setProgress(60);
    await new Promise(r => setTimeout(r, 800));
    
    setCurrentStep(2); // Training
    addLog("--- MODEL TRAINING STARTED ---");
    addLog("Splitting Data: 80% Train / 20% Validation (Stratified)");
    setProgress(75);
    await new Promise(r => setTimeout(r, 1000));
    addLog("Initializing LightGBM Classifier...");
    addLog("Hyperparameter Tuning: Learning Rate=0.05, Max Depth=6");
    await new Promise(r => setTimeout(r, 1500));
    addLog("Training Iteration 100... Loss: 0.45");
    addLog("Training Iteration 200... Loss: 0.32");
    addLog("Training Iteration 300... Loss: 0.18");
    setProgress(90);
    await new Promise(r => setTimeout(r, 800));
    addLog("Computing SHAP values for explainability...");
    setProgress(100);
    await new Promise(r => setTimeout(r, 500));
    
    setCurrentStep(3); // Results
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-100 flex justify-between items-center px-6 bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Database size={20} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800">AutoML Pipeline</h3>
                <p className="text-xs text-slate-500 font-medium">Kaggle Dataset Ingestion & Training</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex border-b border-slate-100 bg-white">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <div key={step.id} className={`flex-1 py-4 flex flex-col items-center relative ${isActive ? 'bg-indigo-50/50' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                   isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                   isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                 }`}>
                   {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                 </div>
                 <span className={`text-xs font-bold ${isActive ? 'text-indigo-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {step.label}
                 </span>
                 {idx !== STEPS.length - 1 && (
                   <div className="absolute top-8 left-1/2 w-full h-[2px] bg-slate-100 -z-10">
                     <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-100'}`} style={{width: '100%'}}></div>
                   </div>
                 )}
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
           
           {/* Step 1: Upload */}
           {currentStep === 0 && (
             <div className="flex-1 flex flex-col items-center justify-center p-12 animate-in slide-in-from-right-8 duration-300">
                <div 
                   className={`w-full max-w-lg border-3 border-dashed rounded-3xl p-10 flex flex-col items-center text-center transition-all ${
                     file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                   }`}
                >
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {file ? <FileText size={32} /> : <UploadCloud size={32} />}
                   </div>
                   
                   {file ? (
                     <div className="space-y-2">
                        <h4 className="text-xl font-bold text-slate-800">{file.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • CSV Dataset</p>
                        <button 
                          onClick={() => setFile(null)}
                          className="text-xs font-bold text-red-500 hover:underline mt-2"
                        >
                          Remove File
                        </button>
                     </div>
                   ) : (
                     <div className="space-y-2 cursor-pointer relative">
                        <input 
                           type="file" 
                           accept=".csv,.json"
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           onChange={(e) => e.target.files && setFile(e.target.files[0])}
                        />
                        <h4 className="text-lg font-bold text-slate-700">Drop Kaggle Dataset Here</h4>
                        <p className="text-sm text-slate-400">or click to browse CSV/JSON</p>
                     </div>
                   )}
                </div>

                <div className="mt-8 flex gap-4">
                   <button 
                     onClick={() => {
                        // Mock file if none selected
                        if (!file) {
                          const mockFile = new File([""], "kaggle_loan_default_v2.csv", { type: "text/csv" });
                          Object.defineProperty(mockFile, 'size', { value: 15420 * 1024 });
                          setFile(mockFile);
                        }
                     }}
                     className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                   >
                     Use Demo Dataset
                   </button>
                   <button 
                     disabled={!file}
                     onClick={runPipeline}
                     className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200 transition-all flex items-center gap-2"
                   >
                     Start Pipeline <ArrowRight size={18} />
                   </button>
                </div>
             </div>
           )}

           {/* Step 2 & 3: Processing & Training */}
           {(currentStep === 1 || currentStep === 2) && (
             <div className="flex-1 flex flex-col p-8 animate-in slide-in-from-right-8 duration-300">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Loader2 className="animate-spin text-indigo-600" /> 
                      {currentStep === 1 ? 'Processing Data...' : 'Training Model...'}
                   </h4>
                   <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                   <div 
                     className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>

                {/* Terminal Logs */}
                <div className="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-xs overflow-y-auto shadow-inner custom-scrollbar border border-slate-700">
                   {logs.map((log, i) => (
                      <div key={i} className="text-green-400 mb-1.5 opacity-0 animate-in fade-in slide-in-from-left-2 duration-300">
                         {log}
                      </div>
                   ))}
                   <div ref={logsEndRef} />
                   <div className="animate-pulse text-green-400 font-bold">_</div>
                </div>
             </div>
           )}

           {/* Step 4: Results */}
           {currentStep === 3 && (
             <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-right-8 duration-300 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 mb-6">
                   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                      <div className="text-xs font-bold text-emerald-600 uppercase mb-1">ROC-AUC</div>
                      <div className="text-2xl font-black text-emerald-800">0.874</div>
                   </div>
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                      <div className="text-xs font-bold text-blue-600 uppercase mb-1">Accuracy</div>
                      <div className="text-2xl font-black text-blue-800">92.1%</div>
                   </div>
                   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                      <div className="text-xs font-bold text-indigo-600 uppercase mb-1">KS Statistic</div>
                      <div className="text-2xl font-black text-indigo-800">48.2</div>
                   </div>
                   <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                      <div className="text-xs font-bold text-purple-600 uppercase mb-1">Gini Coeff</div>
                      <div className="text-2xl font-black text-purple-800">0.748</div>
                   </div>
                </div>

                <div className="flex gap-6 h-64">
                   <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                         <BarChart3 size={16} /> Feature Importance (SHAP)
                      </h5>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart layout="vertical" data={MOCK_FEATURE_IMPORTANCE}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {MOCK_FEATURE_IMPORTANCE.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>

                   <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                         <ActivityIcon size={16} /> Calibration Curve
                      </h5>
                      <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={CALIBRATION_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="prob" label={{ value: 'Predicted Prob', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                          <YAxis label={{ value: 'Actual Prob', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
                          <Line type="monotone" dataKey="prob" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100">
                        Close
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                        <Award size={18} /> Export Model
                    </button>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
