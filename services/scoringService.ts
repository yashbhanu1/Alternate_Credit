import { EngineeredFeatures, RawSignals, ScoreResult } from '../types';

// Helper: Calculate Standard Deviation
const calculateStdDev = (values: number[]): number => {
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(val => Math.pow(val - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

export const engineerFeatures = (data: RawSignals): EngineeredFeatures => {
  const incomes = data.financial.transactions.map(t => t.income);
  const expenses = data.financial.transactions.map(t => t.expenses);
  const balances = data.financial.transactions.map(t => t.eodBalance);
  
  // --- 1. Financial Health (Income, Cashflow, Savings) ---
  const avgIncome = incomes.reduce((a, b) => a + b, 0) / incomes.length;
  const totalIncome = incomes.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  
  const incomeStdDev = calculateStdDev(incomes);
  const incomeCV = avgIncome === 0 ? 1 : incomeStdDev / avgIncome;
  const incomeStability = Math.max(0, 1 - Math.min(incomeCV, 1));
  
  const savingsRatio = totalIncome === 0 ? 0 : Math.max(0, (totalIncome - totalExpenses) / totalIncome);
  
  // Combine into financial Health score
  const financialHealth = (incomeStability * 0.4) + (Math.min(savingsRatio * 2, 1) * 0.6);


  // --- 2. Credit Discipline (Bills, Repayments) ---
  const billPaymentRate = data.utilities.totalBills === 0 
    ? 0.5 
    : data.utilities.onTimePayments / data.utilities.totalBills;
  
  const creditDiscipline = (billPaymentRate * 0.6) + (data.financial.loanRepaymentScore * 0.4);


  // --- 3. Stability Score (Telecom, Employment, Location) ---
  const telecomScore = Math.min(data.telecom.phoneNumberAgeMonths / 36, 1);
  const employmentScore = Math.min(data.employment.tenureMonths / 24, 1);
  const locationScore = data.digital.locationConsistencyScore;
  
  const stabilityScore = (telecomScore * 0.3) + (employmentScore * 0.4) + (locationScore * 0.3);


  // --- 4. Digital Affinity (Apps, Ecommerce, Devices) ---
  const deviceStability = Math.max(0, 1 - (data.digital.deviceSwitchCountYear * 0.2));
  const riskPenalty = data.digital.browserHistoryRiskScore;
  
  const digitalAffinity = (data.digital.appUsageScore * 0.4) + (deviceStability * 0.4) + (data.social.identityVerified ? 0.2 : 0) - riskPenalty;


  // --- 5. Social Credibility (Network, Public Records) ---
  const publicRecordBonus = (data.public.propertyOwnership ? 0.3 : 0) + (data.public.businessRegistered ? 0.2 : 0);
  const socialCredibility = Math.min(1, (data.social.socialConnectionsScore * 0.5) + publicRecordBonus + 0.2); // Base 0.2


  // --- 6. Interaction Quality (Behavioral & Sensors) ---
  // High steadiness, consistent typing, and low confusion = High Score
  const interactionQuality = (data.behavioral.sensorSteadinessScore * 0.4) + 
                             (data.behavioral.typingSpeedScore * 0.3) + 
                             ((1 - data.behavioral.navPathConfusionScore) * 0.3);


  // Metrics for UI
  const averageBalance = balances.reduce((a,b) => a+b, 0) / balances.length;

  return {
    financialHealth,
    creditDiscipline,
    stabilityScore,
    digitalAffinity,
    socialCredibility,
    interactionQuality,
    averageBalance,
    savingsRatio
  };
};

export const calculateTrustScore = (features: EngineeredFeatures): ScoreResult => {
  // Weights for final score
  const weights = {
    financialHealth: 0.25,
    creditDiscipline: 0.25,
    stabilityScore: 0.15,
    socialCredibility: 0.15,
    digitalAffinity: 0.10,
    interactionQuality: 0.10 // New Behavioral Component
  };

  const rawScore = 
    (features.financialHealth * weights.financialHealth) +
    (features.creditDiscipline * weights.creditDiscipline) +
    (features.stabilityScore * weights.stabilityScore) +
    (features.socialCredibility * weights.socialCredibility) +
    (features.digitalAffinity * weights.digitalAffinity) +
    (features.interactionQuality * weights.interactionQuality);

  // Scale to 300 - 850
  const trustScore = Math.round(300 + (rawScore * 550));

  // PD Calculation (Inverse logit approximation)
  const pd = parseFloat((1 - rawScore).toFixed(4));

  let grade = 'F';
  if (trustScore >= 750) grade = 'A';
  else if (trustScore >= 700) grade = 'B';
  else if (trustScore >= 650) grade = 'C';
  else if (trustScore >= 550) grade = 'D';
  else grade = 'E';

  return {
    trustScore,
    pd,
    grade,
    features
  };
};

// Evaluate a specific loan request
export const evaluateLoanRequest = (trustScore: number, avgBalance: number, monthlyIncome: number, requestedAmount: number) => {
  // Logic: 
  // 1. Determine leverage multiplier based on Trust Score quality
  // 2. Calculate Max Loan Limit based on Balance
  // 3. Affordability Check using Monthly Income (EMI Capacity)
  
  let leverageMultiplier = 3; // Base
  
  if (trustScore >= 750) leverageMultiplier = 8;       // High Trust: Can borrow 8x avg balance
  else if (trustScore >= 700) leverageMultiplier = 6;  // Good Trust: 6x
  else if (trustScore >= 600) leverageMultiplier = 4.5; // Avg Trust: 4.5x
  else if (trustScore >= 550) leverageMultiplier = 3;  // Low Trust: 3x
  else leverageMultiplier = 0;                         // No Trust: 0x
  
  // Calculate Max Limit based on Balance
  const maxLimit = Math.round(avgBalance * leverageMultiplier);
  
  let status: 'approved' | 'rejected' | 'review' = 'approved';
  let reason = 'Approved based on Trust Score & Affordability.';
  
  // Affordability check: Assume 12-month tenure, EMI shouldn't exceed 60% of Monthly Income (aggressive for underbanked)
  // or more conservatively, shouldn't exceed Avg Balance (Disposable Income)
  const estimatedEMI = requestedAmount / 12;

  if (trustScore < 550) {
    status = 'rejected';
    reason = 'Trust Score is below the minimum threshold (550).';
  } else if (requestedAmount > maxLimit) {
    status = 'rejected';
    reason = `Requested amount (₹${requestedAmount.toLocaleString()}) exceeds maximum limit based on savings (₹${maxLimit.toLocaleString()}).`;
  } else if (estimatedEMI > monthlyIncome * 0.6) {
    status = 'rejected';
    reason = `Loan EMI (₹${estimatedEMI.toFixed(0)}) exceeds 60% of monthly income. High default risk.`;
  } else if (trustScore < 650 && requestedAmount > (maxLimit * 0.8)) {
     // If score is mediocre ("C" grade) and asking for near max limit, flag for review or caution
     status = 'review';
     reason = 'High utilization relative to Trust Score. Manual review recommended.';
  }

  return { status, reason, maxLimit };
};