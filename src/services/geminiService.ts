import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResults, Allegation, ArbitrationAnalysis, Timeline, TimelineEvent, DamagesBreakdown, ComparatorAnalysis, Comparator } from '../types';

// Helper to get AI instance
const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  console.log("Gemini Service: API Key present:", !!apiKey);
  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeCase(
  complaintText: string,
  jobDescriptionText: string,
  actualDutiesText: string,
  characterProfileText: string,
  handbookUrl: string
): Promise<AnalysisResults | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `
    As an expert AI legal strategist specializing in Texas employment law, analyze this case.
    
    Complaint: ${complaintText}
    Job Description: ${jobDescriptionText}
    Actual Duties: ${actualDutiesText}
    Character Profile: ${characterProfileText}
    Handbook URL: ${handbookUrl}
    
    Provide a comprehensive legal analysis in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResults;
  } catch (error) {
    console.error("Error analyzing case:", error);
    return null;
  }
}

export async function getImprovementSuggestions(
  sectionTitle: string,
  sectionContent: string,
  originalComplaint: string
): Promise<string | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Provide improvement suggestions for this legal section:\nTitle: ${sectionTitle}\nContent: ${sectionContent}\nOriginal Complaint: ${originalComplaint}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting improvement suggestions:", error);
    return null;
  }
}

export async function analyzeFileForRelevance(
  fileContent: string,
  allegations: Allegation[]
): Promise<{ isRelevant: boolean; relevanceType: 'specific' | 'proactive'; specificAllegation?: string; proactiveCategory?: string; justification: string; category: string; } | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const allegationText = allegations.map(a => `- ${a.claim}: ${a.summary}`).join('\n');
    const prompt = `Analyze if this file is relevant to these allegations:\n${allegationText}\n\nFile Content: ${fileContent}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (error) {
    console.error("Error analyzing file:", error);
    return null;
  }
}

export async function generateLegalLetter(
  analysis: AnalysisResults,
  complaintText: string,
  jobDescriptionText: string,
  actualDutiesText: string,
  characterProfileText: string,
  handbookUrl: string,
  tone: 'demand' | 'settlement'
): Promise<string | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Generate a ${tone} letter based on this analysis: ${JSON.stringify(analysis)}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating letter:", error);
    return null;
  }
}

export interface QuestionAnalysisResult {
  confidence_score: number;
  analysis: string;
  missing_evidence?: string;
  follow_up_questions?: string[];
  relevant_case_law?: CaseLawExample[];
}

export interface CaseLawExample {
  case_name: string;
  jurisdiction: string;
  claim_type: string;
  outcome: string;
  relevance_score: number;
  key_facts: string;
  legal_holding: string;
  why_relevant: string;
  settlement_amount?: string;
}

export async function analyzeAnswerConfidence(
  question: string,
  answer: string,
  allQuestionsContext?: string
): Promise<QuestionAnalysisResult | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Analyze this Q&A for a Texas employment law case:\nQuestion: ${question}\nAnswer: ${answer}\nContext: ${allQuestionsContext || 'None'}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing answer confidence:", error);
    return null;
  }
}

export async function generateFollowUpQuestions(
  question: string,
  answer: string
): Promise<string[] | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Generate follow-up questions for:\nQ: ${question}\nA: ${answer}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text.trim());
    return result.questions || [];
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return null;
  }
}

export async function analyzeQuestion(
  question: string,
  answer: string
): Promise<any> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Analyze this legal question and answer:\nQ: ${question}\nA: ${answer}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing question:", error);
    return null;
  }
}

export async function determineDiscoveryNeed(
  question: string,
  answer: string
): Promise<any[]> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Determine discovery needs for:\nQ: ${question}\nA: ${answer}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text.trim());
    return result.documents || [];
  } catch (error) {
    console.error("Error determining discovery need:", error);
    return [];
  }
}

export async function determineEvidenceStatus(
  question: string,
  answer: string
): Promise<string> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Determine evidence status for:\nQ: ${question}\nA: ${answer}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error determining evidence status:", error);
    return "unknown";
  }
}

export async function generateExampleAnswer(
  question: string,
  caseContext: string
): Promise<string | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Generate an example answer for:\nQuestion: ${question}\nContext: ${caseContext}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating example answer:", error);
    return null;
  }
}

// Advanced module functions
export async function analyzeArbitrationAgreement(
  agreementText: string,
  signedDate: string,
  protectedActivityDate: string
): Promise<ArbitrationAnalysis | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Analyze this arbitration agreement:\n${agreementText}\nSigned: ${signedDate}\nProtected Activity: ${protectedActivityDate}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text.trim());
    return {
      agreementText,
      signedDate,
      ...result
    };
  } catch (error) {
    console.error("Error analyzing arbitration agreement:", error);
    return null;
  }
}

export async function analyzeTemporalProximity(
  events: TimelineEvent[]
): Promise<Timeline | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const protectedActivity = sortedEvents.find(e => e.type === 'protected_activity');
    const termination = sortedEvents.find(e => e.type === 'adverse_action');

    if (!protectedActivity || !termination) {
      return null;
    }

    const prompt = `Analyze temporal proximity for these events:\n${JSON.stringify(sortedEvents)}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text.trim());
    return {
      events: sortedEvents,
      protectedActivityDate: protectedActivity.date,
      terminationDate: termination.date,
      ...result
    };
  } catch (error) {
    console.error("Error analyzing temporal proximity:", error);
    return null;
  }
}

export async function calculateDamages(inputData: {
  salary: number;
  terminationDate: string;
  newJobSalary: number;
  newJobStartDate: string;
  healthInsurance: number;
  retirement401k: number;
  paidTimeOff: number;
  otherBenefits: number;
  jobSearchExpenses: number;
  emotionalDistress: number;
  emotionalDistressJustification: string;
  reputationalHarm: number;
  reputationalHarmJustification: string;
}): Promise<DamagesBreakdown | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";
    const currentDate = new Date().toISOString().split('T')[0];

    const prompt = `Calculate damages for wrongful termination:\n${JSON.stringify(inputData)}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text.trim());
    return {
      salary: inputData.salary,
      terminationDate: inputData.terminationDate,
      currentDate,
      newJobSalary: inputData.newJobSalary,
      newJobStartDate: inputData.newJobStartDate,
      ...result
    };
  } catch (error) {
    console.error("Error calculating damages:", error);
    return null;
  }
}

export async function analyzeComparators(
  allegedMisconduct: string,
  yourDiscipline: string,
  comparators: Comparator[]
): Promise<ComparatorAnalysis | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Analyze comparator evidence:\nMisconduct: ${allegedMisconduct}\nDiscipline: ${yourDiscipline}\nComparators: ${JSON.stringify(comparators)}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing comparators:", error);
    return null;
  }
}

export async function analyzePretext(
  statedReason: string,
  actualReason: string,
  evidence: string,
  comparators: string
): Promise<{
  pretextScore: number;
  shiftingExplanations: string[];
  deviationsFromPolicy: string[];
  inconsistencies: string[];
  evidenceStrength: 'Strong' | 'Moderate' | 'Weak';
  depositionQuestions: string[];
  modelEmployeeNarrative: string;
} | null> {
  try {
    const ai = getAI();
    const model = "gemini-1.5-flash";

    const prompt = `Analyze pretext:\nStated: ${statedReason}\nActual: ${actualReason}\nEvidence: ${evidence}\nComparators: ${comparators}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing pretext:", error);
    return null;
  }
}