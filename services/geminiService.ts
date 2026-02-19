import { GoogleGenAI, Type } from "@google/genai";
import { EngineeredFeatures, RawSignals, ScoreResult, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiAnalysis = async (
  profile: RawSignals,
  features: EngineeredFeatures,
  score: ScoreResult
): Promise<AIAnalysis> => {
  
  if (!process.env.API_KEY) {
    return {
      summary: "AI analysis unavailable (Missing API Key).",
      positiveFactors: ["N/A"],
      negativeFactors: ["N/A"],
      recommendations: ["Configure API Key to see insights."]
    };
  }

  const prompt = `
    You are an expert credit risk analyst for underbanked populations in India.
    Analyze the following user profile and enriched alternative data signals.
    
    User Profile:
    - Name: ${profile.name}
    - Occupation: ${profile.occupation}
    - Description: ${profile.description}
    
    KEY SIGNALS:
    1. FINANCIAL:
       - Monthly Average Balance: ₹${features.averageBalance}
       - Savings Ratio: ${(features.savingsRatio * 100).toFixed(1)}%
       - Loan/BNPL History Score: ${profile.financial.loanRepaymentScore} (0-1)
    
    2. BEHAVIORAL & TELECOM:
       - Phone Number Age: ${profile.telecom.phoneNumberAgeMonths} months
       - Call Consistency: ${(profile.telecom.callConsistencyScore * 100).toFixed(0)}%
       - Data Usage: ${profile.telecom.dataUsageGB} GB/mo
       - Utility Bill Payment Rate: ${(profile.utilities.onTimePayments / profile.utilities.totalBills * 100).toFixed(0)}%
    
    3. DIGITAL & LOCATION:
       - Location Consistency (Home/Work): ${(profile.digital.locationConsistencyScore * 100).toFixed(0)}%
       - Device Switches (Year): ${profile.digital.deviceSwitchCountYear}
       - App Usage Score (Productivity vs Risk): ${profile.digital.appUsageScore}
    
    4. SOCIAL & PUBLIC:
       - Social Connections Score: ${profile.social.socialConnectionsScore}
       - Property Owner: ${profile.public.propertyOwnership}
       - Registered Business: ${profile.public.businessRegistered}
       - Criminal Record: ${!profile.public.noCriminalRecord}

    5. SENSOR & INTERACTION (NEW):
       - Avg Session Time: ${profile.behavioral.avgSessionTimeSeconds}s
       - Typing Consistency: ${profile.behavioral.typingSpeedScore.toFixed(2)}
       - Navigation Confusion: ${profile.behavioral.navPathConfusionScore.toFixed(2)} (High = Confused)
       - Device Steadiness: ${profile.behavioral.sensorSteadinessScore.toFixed(2)} (Accelerometry)

    CALCULATED METRICS (0-1 Scale):
    - Financial Health: ${features.financialHealth.toFixed(2)}
    - Credit Discipline: ${features.creditDiscipline.toFixed(2)}
    - Stability Score: ${features.stabilityScore.toFixed(2)}
    - Social Credibility: ${features.socialCredibility.toFixed(2)}
    - Interaction Quality: ${features.interactionQuality.toFixed(2)}
    
    FINAL TRUST SCORE: ${score.trustScore} (Grade ${score.grade})

    Provide a JSON response with:
    1. A short summary of their creditworthiness focusing on non-traditional signals (especially mentioning if behavioral biometrics indicate confidence or risk).
    2. Two key positive factors.
    3. Two key negative factors.
    4. Three specific, actionable financial tips.
    
    Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            positiveFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            negativeFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "Could not generate AI analysis at this time.",
      positiveFactors: ["Manual Review Required"],
      negativeFactors: ["Manual Review Required"],
      recommendations: ["Check connection", "Retry later"]
    };
  }
};