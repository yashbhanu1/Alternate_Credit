import { RawSignals } from './types';

export const DEMO_PROFILES: RawSignals[] = [
  {
    profileId: 'gig-worker',
    name: "Ravi Kumar",
    occupation: "Gig Worker (Delivery Partner)",
    description: "Fluctuating income, high UPI usage. Strong telecom history but high location variance due to job.",
    monthlyIncome: 25000,
    requestedLoanAmount: 50000,
    financial: {
      loanRepaymentScore: 0.8, // Good BNPL history
      transactions: [
        { month: 'Jan', income: 25000, expenses: 22000, upiVolume: 45, eodBalance: 3000 },
        { month: 'Feb', income: 18000, expenses: 17500, upiVolume: 30, eodBalance: 3500 },
        { month: 'Mar', income: 32000, expenses: 24000, upiVolume: 60, eodBalance: 11500 },
        { month: 'Apr', income: 28000, expenses: 23000, upiVolume: 50, eodBalance: 16500 },
        { month: 'May', income: 15000, expenses: 16000, upiVolume: 25, eodBalance: 15500 },
        { month: 'Jun', income: 29000, expenses: 22000, upiVolume: 55, eodBalance: 22500 },
      ]
    },
    telecom: {
      phoneNumberAgeMonths: 48,
      avgRechargeAmount: 499,
      dataUsageGB: 45, // High usage (GPS/Apps)
      roamingDays: 2,
      callConsistencyScore: 0.9
    },
    utilities: {
      totalBills: 12,
      onTimePayments: 11,
      utilityTypes: ["Mobile Postpaid", "Electricity"]
    },
    digital: {
      appUsageScore: 0.85, // Delivery apps, Maps, UPI
      ecommerceSpendRatio: 0.1,
      browserHistoryRiskScore: 0.1,
      deviceSwitchCountYear: 0,
      locationConsistencyScore: 0.3 // Low (moves a lot)
    },
    social: {
      socialConnectionsScore: 0.6,
      identityVerified: true,
      emailAgeMonths: 36
    },
    public: {
      propertyOwnership: false,
      businessRegistered: false,
      noCriminalRecord: true
    },
    employment: {
      tenureMonths: 24,
      isSalaried: false
    },
    behavioral: {
      avgSessionTimeSeconds: 45, // Fast interactions
      typingSpeedScore: 0.9,
      navPathConfusionScore: 0.1, // Knows the UI well
      sensorSteadinessScore: 0.6 // Moving often (delivery)
    }
  },
  {
    profileId: 'rural-sme',
    name: "Lakshmi Devi",
    occupation: "Rural Kirana Store Owner",
    description: "Cash-heavy business moving to QR payments. High savings buffer, informal income. Strong local roots.",
    monthlyIncome: 45000,
    requestedLoanAmount: 200000,
    financial: {
      loanRepaymentScore: 0.5, // No history
      transactions: [
        { month: 'Jan', income: 45000, expenses: 30000, upiVolume: 120, eodBalance: 15000 },
        { month: 'Feb', income: 42000, expenses: 28000, upiVolume: 110, eodBalance: 29000 },
        { month: 'Mar', income: 48000, expenses: 32000, upiVolume: 130, eodBalance: 45000 },
        { month: 'Apr', income: 46000, expenses: 31000, upiVolume: 125, eodBalance: 60000 },
        { month: 'May', income: 43000, expenses: 29000, upiVolume: 115, eodBalance: 74000 },
        { month: 'Jun', income: 50000, expenses: 35000, upiVolume: 140, eodBalance: 89000 },
      ]
    },
    telecom: {
      phoneNumberAgeMonths: 72,
      avgRechargeAmount: 199,
      dataUsageGB: 5,
      roamingDays: 0,
      callConsistencyScore: 0.95
    },
    utilities: {
      totalBills: 24,
      onTimePayments: 24,
      utilityTypes: ["Electricity", "Shop License"]
    },
    digital: {
      appUsageScore: 0.4, // Minimal app usage
      ecommerceSpendRatio: 0.05,
      browserHistoryRiskScore: 0.0,
      deviceSwitchCountYear: 1,
      locationConsistencyScore: 0.99 // Very Stable
    },
    social: {
      socialConnectionsScore: 0.7,
      identityVerified: true,
      emailAgeMonths: 12
    },
    public: {
      propertyOwnership: true,
      businessRegistered: true,
      noCriminalRecord: true
    },
    employment: {
      tenureMonths: 120,
      isSalaried: false
    },
    behavioral: {
      avgSessionTimeSeconds: 120, // Takes time to read
      typingSpeedScore: 0.6, // Slower typing
      navPathConfusionScore: 0.0, // Very deliberate
      sensorSteadinessScore: 0.95 // Very steady hand/table usage
    }
  },
  {
    profileId: 'student',
    name: "Arjun Singh",
    occupation: "Student / First Job",
    description: "New to workforce. Thin file. High digital activity, erratic spending, high social score.",
    monthlyIncome: 12000,
    requestedLoanAmount: 25000,
    financial: {
      loanRepaymentScore: 0.6,
      transactions: [
        { month: 'Jan', income: 12000, expenses: 11500, upiVolume: 80, eodBalance: 500 },
        { month: 'Feb', income: 12000, expenses: 12500, upiVolume: 90, eodBalance: 0 },
        { month: 'Mar', income: 12000, expenses: 10000, upiVolume: 70, eodBalance: 2000 },
        { month: 'Apr', income: 15000, expenses: 14000, upiVolume: 100, eodBalance: 3000 },
        { month: 'May', income: 15000, expenses: 15000, upiVolume: 85, eodBalance: 3000 },
        { month: 'Jun', income: 15000, expenses: 13000, upiVolume: 95, eodBalance: 5000 },
      ]
    },
    telecom: {
      phoneNumberAgeMonths: 12,
      avgRechargeAmount: 699,
      dataUsageGB: 120,
      roamingDays: 10,
      callConsistencyScore: 0.5
    },
    utilities: {
      totalBills: 6,
      onTimePayments: 4,
      utilityTypes: ["Mobile Postpaid", "Streaming Sub"]
    },
    digital: {
      appUsageScore: 0.6,
      ecommerceSpendRatio: 0.4, // High spending
      browserHistoryRiskScore: 0.4, // Moderate risk
      deviceSwitchCountYear: 2,
      locationConsistencyScore: 0.6
    },
    social: {
      socialConnectionsScore: 0.9, // Influential
      identityVerified: true,
      emailAgeMonths: 60
    },
    public: {
      propertyOwnership: false,
      businessRegistered: false,
      noCriminalRecord: true
    },
    employment: {
      tenureMonths: 3,
      isSalaried: true
    },
    behavioral: {
      avgSessionTimeSeconds: 300, // Browses a lot
      typingSpeedScore: 0.95, // Fast typer
      navPathConfusionScore: 0.3, // Explores random features
      sensorSteadinessScore: 0.7 // Average
    }
  },
  {
    profileId: 'homemaker',
    name: "Priya Sharma",
    occupation: "Homemaker",
    description: "Household manager. No direct income, but manages expenses and savings efficiently. Very stable profile.",
    monthlyIncome: 20000,
    requestedLoanAmount: 40000,
    financial: {
      loanRepaymentScore: 0.5,
      transactions: [
        { month: 'Jan', income: 20000, expenses: 18000, upiVolume: 15, eodBalance: 2000 },
        { month: 'Feb', income: 20000, expenses: 17500, upiVolume: 12, eodBalance: 4500 },
        { month: 'Mar', income: 20000, expenses: 19000, upiVolume: 20, eodBalance: 5500 },
        { month: 'Apr', income: 20000, expenses: 18000, upiVolume: 15, eodBalance: 7500 },
        { month: 'May', income: 20000, expenses: 18500, upiVolume: 18, eodBalance: 9000 },
        { month: 'Jun', income: 20000, expenses: 18000, upiVolume: 15, eodBalance: 11000 },
      ]
    },
    telecom: {
      phoneNumberAgeMonths: 60,
      avgRechargeAmount: 299,
      dataUsageGB: 10,
      roamingDays: 0,
      callConsistencyScore: 0.98
    },
    utilities: {
      totalBills: 12,
      onTimePayments: 12,
      utilityTypes: ["LPG Gas", "Electricity"]
    },
    digital: {
      appUsageScore: 0.5,
      ecommerceSpendRatio: 0.15,
      browserHistoryRiskScore: 0.0,
      deviceSwitchCountYear: 0,
      locationConsistencyScore: 0.95
    },
    social: {
      socialConnectionsScore: 0.7,
      identityVerified: true,
      emailAgeMonths: 48
    },
    public: {
      propertyOwnership: true, // Joint owner
      businessRegistered: false,
      noCriminalRecord: true
    },
    employment: {
      tenureMonths: 0,
      isSalaried: false
    },
    behavioral: {
      avgSessionTimeSeconds: 90,
      typingSpeedScore: 0.7,
      navPathConfusionScore: 0.05, // Very focused usage
      sensorSteadinessScore: 0.9 // Stable
    }
  }
];