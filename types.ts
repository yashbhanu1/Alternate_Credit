export interface MonthlyTransaction {
  month: string;
  income: number;
  expenses: number;
  upiVolume: number; // Count of UPI transactions
  eodBalance: number;
}

// 1. Telecom & Mobile Signals
export interface TelecomData {
  phoneNumberAgeMonths: number;
  avgRechargeAmount: number; // In Rupees
  dataUsageGB: number;
  roamingDays: number; // Indicator of travel/stability
  callConsistencyScore: number; // 0-1 score indicating regularity of contacts
}

// 2. Utility & Bill Signals
export interface UtilityData {
  totalBills: number;
  onTimePayments: number;
  utilityTypes: string[]; // e.g. ["Electricity", "Postpaid Mobile", "Internet"]
}

// 3. Digital & Online Behavior
export interface DigitalData {
  appUsageScore: number; // 0-1, 1 = productive/financial apps, 0 = entertainment/gambling
  ecommerceSpendRatio: number; // 0-1 ratio of income spent online
  browserHistoryRiskScore: number; // 0-1, 0 = safe, 1 = risky
  deviceSwitchCountYear: number;
  locationConsistencyScore: number; // 0-1 (home/work stability based on cell tower/GPS)
}

// 4. Social & Profile Data
export interface SocialData {
  socialConnectionsScore: number; // 0-1 based on network quality (e.g. connections to other high-score users)
  identityVerified: boolean;
  emailAgeMonths: number;
}

// New Interface for Flats
export interface FlatProperty {
  bhk: number;
  estimatedValue: number;
  hasProof?: boolean; // NEW: Indicates if proof document was uploaded
}

// 5. Public Records
export interface PublicRecordData {
  propertyOwnership: boolean;
  businessRegistered: boolean; // GST etc
  noCriminalRecord: boolean;
  propertyLocation?: 'Urban' | 'Rural'; // NEW: For high value loan assessment
  estimatedPropertyValue?: number; // NEW: Estimated collateral value
  propertySizeAcres?: number; // NEW: Property size
  ownedFlats?: FlatProperty[]; // NEW: List of flats
}

// 6. Employment & Income
export interface EmploymentData {
  tenureMonths: number;
  isSalaried: boolean; // vs informal
}

// 7. Behavioral & Sensor Data (NEW)
export interface BehavioralData {
  avgSessionTimeSeconds: number; // Time spent on financial apps
  typingSpeedScore: number; // 0-1 consistency score (biometric proxy)
  navPathConfusionScore: number; // 0-1, 0 = confident navigation, 1 = confused/erratic
  sensorSteadinessScore: number; // 0-1, accelerometer/gyro stability during usage
}

export interface RawSignals {
  profileId: string;
  name: string;
  occupation: string;
  description: string;
  monthlyIncome: number; // NEW: Explicitly tracked income for affordability checks
  requestedLoanAmount?: number; // The amount the user wants to borrow
  aadharNumber?: string;
  panNumber?: string;
  
  // Categorized Signals
  financial: {
    transactions: MonthlyTransaction[];
    loanRepaymentScore: number; // 0-1, existing credit bureau proxy if any, or BNPL
  };
  telecom: TelecomData;
  utilities: UtilityData;
  digital: DigitalData;
  social: SocialData;
  public: PublicRecordData;
  employment: EmploymentData;
  behavioral: BehavioralData; // NEW
}

export interface EngineeredFeatures {
  financialHealth: number; // Combined income/cashflow/savings (0-1)
  creditDiscipline: number; // Bill payments + loan repayments (0-1)
  stabilityScore: number; // Telecom + Device + Location + Employment tenure (0-1)
  digitalAffinity: number; // App usage + Ecommerce + Digital ID (0-1)
  socialCredibility: number; // Social score + Public records (0-1)
  interactionQuality: number; // Behavioral biometric score (0-1) - NEW
  
  // Key metrics for UI
  averageBalance: number;
  savingsRatio: number;
}

export interface ScoreResult {
  trustScore: number; // 300 - 850
  pd: number; // Probability of Default 0.0 - 1.0
  grade: string; // A, B, C, D, E
  features: EngineeredFeatures;
}

export interface AIAnalysis {
  summary: string;
  positiveFactors: string[];
  negativeFactors: string[];
  recommendations: string[];
}