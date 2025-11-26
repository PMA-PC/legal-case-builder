// services/geminiService.ts - Enhanced with Conversational AI (Corrected)

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AnalysisResults,
  Allegation,
  ConversationMessage,
  DefenseSimulation,
  GoodFaithConferenceGuide,
  EvidenceItem,
  CounterArgument,
  SuggestedClaim,
  UnstatedClaim,
  ResponseStrategy,
  AiSuggestion,
} from '../types';

/**
 * Get Gemini API Key from environment
 */
function getGeminiAPIKey(): string {
  // For AI Studio deployment
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  
  // For Vite local development
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  // Fallback for direct replacement (REPLACE THIS WITH YOUR KEY)
  const directKey = "YOUR_GEMINI_API_KEY_HERE";
  
  if (directKey === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("⚠️ GEMINI API KEY IS MISSING!");
    console.error("Replace 'YOUR_GEMINI_API_KEY_HERE' in geminiService.ts with your actual key");
    console.error("Or set VITE_GEMINI_API_KEY in your .env.local file");
  }
  
  return directKey;
}

// Initialize AI instance
let genAI: GoogleGenerativeAI | null = null;

function getAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getGeminiAPIKey());
  }
  return genAI;
}

/**
 * Safe JSON parsing with error handling
 */
const safeJsonParse = <T>(jsonString: string, context: string): T | null => {
  try {
    const cleaned = jsonString
      .replace(/^```json\n/, '')
      .replace(/\n```$/, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error(`JSON Parse Error in ${context}:`, error);
    console.error("Raw response:", jsonString.substring(0, 500));
    return null;
  }
};

/**
 * MAIN CASE ANALYSIS - Initial comprehensive analysis
 */
export async function analyzeCase(
  complaintText: string,
  jobDescriptionText: string,
  actualDutiesText: string,
  characterProfileText: string,
  handbookUrl?: string | null,
  userAnalysisNotes?: Record<string, AiSuggestion>
): Promise<AnalysisResults | null> {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Format user's previous notes for re-analysis
  const formattedUserNotes = userAnalysisNotes 
    ? Object.entries(userAnalysisNotes)
        .filter(([, suggestion]) => suggestion?.userNotes?.trim().length > 0)
        .map(([sectionKey, suggestion]) => 
          `--- User Notes for Section: ${sectionKey} ---\n${suggestion?.userNotes}\n`
        )
        .join('\n\n') 
    : '';

  const prompt = `You are a senior employment attorney specializing in Texas employment law, acting as counsel for a terminated employee.

CASE INFORMATION:
Complaint: ${complaintText}

Job Description: ${jobDescriptionText}

Actual Duties Performed: ${actualDutiesText}

Character Profile: ${characterProfileText}

${handbookUrl ? `Employee Handbook: ${handbookUrl}` : ''}

${formattedUserNotes ? `\nPREVIOUS USER NOTES:\n${formattedUserNotes}` : ''}

TASK: Provide a comprehensive legal analysis in JSON format with the following structure:

{
  "statedAllegations": [
    {
      "id": "unique_id",
      "claim": "Claim title",
      "summary": "Detailed summary",
      "evidenceMentioned": ["evidence1", "evidence2"],
      "status": "investigating",
      "strengthScore": 7,
      "conversation": []
    }
  ],
  "unstatedClaims": [
    {
      "claim": "Potential claim not explicitly stated",
      "justification": "Why this claim applies",
      "evidenceNeeded": ["What evidence would prove this"],
      "texasCaseExamples": [
        {
          "caseName": "Case v. Company",
          "primaryComplaint": "What was claimed",
          "outcome": "Result",
          "relevance": "Why it matters here"
        }
      ]
    }
  ],
  "responseStrategies": [
    {
      "claim": "Claim name",
      "strategy": "Overall approach",
      "suggestedActionSteps": ["Step 1", "Step 2"],
      "evidenceToGather": [
        {
          "item": "Evidence item",
          "potentialSource": "Where to find it",
          "rationale": "Why it's important"
        }
      ],
      "texasCaseExamples": [],
      "instances": []
    }
  ],
  "counterArguments": [
    {
      "claim": "Our claim",
      "potentialArgument": "What company will say",
      "recommendedResponse": "How to counter",
      "evidenceNeeded": ["Evidence to support our counter"]
    }
  ],
  "investigatorQuestions": [
    {
      "question": "What investigator might ask",
      "purpose": "Why they'd ask this",
      "category": "factual"
    }
  ],
  "cultureShiftQuestions": [
    {
      "question": "Question about workplace culture changes",
      "objective": "What we're trying to establish"
    }
  ],
  "culturePortraitQuestions": [
    {
      "primaryQuestion": "Main question",
      "objective": "Goal",
      "followUps": [
        {
          "ifResponseIs": "positive/negative",
          "followUpQuestion": "Follow-up question"
        }
      ]
    }
  ],
  "adaAccommodationQuestions": [
    {
      "question": "ADA-specific question",
      "focus": "Area of focus",
      "objective": "What we're establishing"
    }
  ],
  "handbookPolicyViolations": [
    {
      "policy": "Policy name",
      "violation": "What company violated",
      "evidence": "Evidence of violation"
    }
  ],
  "informationGaps": [
    {
      "gap": "What's missing",
      "importance": "critical",
      "howToFill": "How to get this information"
    }
  ],
  "quantitativeDataPrompts": [
    {
      "dataType": "Type of data needed",
      "rationale": "Why it matters",
      "sources": ["Where to get it"]
    }
  ],
  "goodFaithConferenceGuide": {
    "meetingObjectives": ["Objective 1", "Objective 2"],
    "discoveryRequests": [
      {
        "id": "req_1",
        "category": "Personnel Records",
        "item": "Specific document",
        "rationale": "Why we need it",
        "priority": "critical",
        "legalBasis": "Legal justification"
      }
    ],
    "negotiationStrategy": {
      "openingPosition": "Our starting position",
      "fallbackPositions": ["Fallback 1", "Fallback 2"],
      "redLines": ["Non-negotiables"],
      "leveragePoints": ["Our advantages"]
    },
    "talkingPoints": ["Key point 1", "Key point 2"],
    "anticipatedConcerns": ["What they'll raise"],
    "settlementFramework": {
      "minimumAcceptable": "Minimum we'll accept",
      "targetSettlement": "Realistic goal",
      "aspirationalSettlement": "Best case",
      "nonMonetaryTerms": ["Reference letter", "etc"]
    }
  }
}

Focus on Texas employment law. Be thorough, strategic, and advocate strongly for the employee.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return safeJsonParse<AnalysisResults>(response, 'analyzeCase');
  } catch (error) {
    console.error("Error in analyzeCase:", error);
    return null;
  }
}

/**
 * CONVERSATIONAL AI - Interactive follow-up for specific allegation
 */
export const continueAllegationConversation = async (
  allegation: Allegation,
  userMessage: string,
  conversationHistory: ConversationMessage[],
  fullCaseContext: string
): Promise<{ aiResponse: string; followUpQuestions: string[]; updatedStrength?: number } | null> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const historyText = conversationHistory
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');

  const prompt = `You are a senior employment attorney conducting a detailed investigation of a specific legal claim.

CLAIM BEING INVESTIGATED: ${allegation.claim}
CLAIM SUMMARY: ${allegation.summary}

FULL CASE CONTEXT:
${fullCaseContext}

CONVERSATION HISTORY:
${historyText}

USER'S LATEST RESPONSE:
${userMessage}

YOUR TASK:
1. Acknowledge and analyze the user's response
2. Ask 2-3 targeted follow-up questions to:
   - Clarify facts
   - Identify evidence
   - Establish timeline
   - Validate provability
   - Uncover weaknesses we need to address
3. If you discover this claim is strong, suggest what evidence is still needed
4. If you discover weaknesses, explain them and how to address them
5. Rate the current strength of this claim (1-10) based on what you now know

Respond in JSON format:
{
  "aiResponse": "Your thoughtful response to the user, written conversationally as if you're their attorney",
  "followUpQuestions": [
    "Specific follow-up question 1",
    "Specific follow-up question 2"
  ],
  "updatedStrength": 7
}

Be conversational, supportive, but also realistic about strengths and weaknesses.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return safeJsonParse<{ aiResponse: string; followUpQuestions: string[]; updatedStrength?: number }>(
      response,
      'continueAllegationConversation'
    );
  } catch (error) {
    console.error("Error in conversation:", error);
    return null;
  }
};

/**
 * EVIDENCE VALIDATION - AI evaluates if evidence proves the claim
 */
export const validateEvidence = async (
  evidence: EvidenceItem,
  allegation: Allegation,
  allEvidence: EvidenceItem[]
): Promise<{ status: 'verified' | 'needs_more' | 'insufficient'; notes: string; suggestions: string[] } | null> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are evaluating whether specific evidence is sufficient to prove a legal claim.

CLAIM: ${allegation.claim}
CLAIM DETAILS: ${allegation.summary}

EVIDENCE BEING EVALUATED:
Type: ${evidence.type}
Content: ${evidence.content}
Description: ${evidence.description}
Date: ${evidence.date}

OTHER AVAILABLE EVIDENCE:
${allEvidence.map(e => `- ${e.type}: ${e.content} (${e.date})`).join('\n')}

EVALUATE:
1. Does this evidence directly support the claim?
2. Is it admissible and credible?
3. What additional evidence is needed to strengthen the case?
4. Are there any weaknesses or gaps?

Respond in JSON:
{
  "status": "verified" | "needs_more" | "insufficient",
  "notes": "Detailed evaluation of this evidence",
  "suggestions": [
    "Additional evidence item 1 needed",
    "Additional evidence item 2 needed"
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return safeJsonParse(response, 'validateEvidence');
  } catch (error) {
    console.error("Error validating evidence:", error);
    return null;
  }
};

/**
 * DEFENSE SIMULATION - Predict and counter employer's defense
 */
export const simulateDefense = async (
  allegation: Allegation,
  availableEvidence: EvidenceItem[],
  caseContext: string
): Promise<DefenseSimulation | null> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are now acting as opposing counsel for the employer. Analyze this claim and develop the strongest possible defense, then switch back to plaintiff's counsel and counter it.

CLAIM: ${allegation.claim}
DETAILS: ${allegation.summary}

AVAILABLE EVIDENCE AGAINST THEM:
${availableEvidence.map(e => `- ${e.content}: ${e.description}`).join('\n')}

CASE CONTEXT:
${caseContext}

TASK:
1. As defense counsel: What are the 3-5 strongest arguments the employer will make?
2. For each defense argument, rate likelihood (high/medium/low)
3. As plaintiff's counsel: How do we counter each argument?
4. What evidence do we need to overcome each defense?
5. Overall, rate the strength of our case against these defenses (1-10)

JSON Response:
{
  "likelyDefenses": [
    {
      "argument": "Their argument",
      "likelihood": "high",
      "legalBasis": "Why they'd argue this",
      "ourResponse": "How we counter it"
    }
  ],
  "counterStrategies": [
    {
      "defensePoint": "What they'll say",
      "ourCounter": "Our response",
      "evidenceNeeded": ["Evidence to support our counter"]
    }
  ],
  "weaknessAnalysis": "Honest assessment of our vulnerabilities",
  "strengthRating": 7
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return safeJsonParse<DefenseSimulation>(response, 'simulateDefense');
  } catch (error) {
    console.error("Error simulating defense:", error);
    return null;
  }
};

/**
 * DISCOVER UNSTATED CLAIMS - Proactively find claims user hasn't thought of
 */
export const discoverUnstatedClaims = async (
  complaintText: string,
  existingAllegations: Allegation[],
  conversationHistory: ConversationMessage[]
): Promise<SuggestedClaim[]> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const existingClaims = existingAllegations.map(a => a.claim).join(', ');
  const conversationContext = conversationHistory
    .slice(-10)
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `You are an expert Texas employment lawyer. Based on the case details and user answers, suggest additional legal claims that might have been overlooked. For each suggestion, provide a justification and list the type of evidence needed to support it.

ORIGINAL COMPLAINT:
${complaintText}

EXISTING CLAIMS IDENTIFIED:
${existingClaims}

RECENT CONVERSATION:
${conversationContext}

TASK: Based on Texas employment law, identify 3-5 ADDITIONAL legal claims that haven't been explicitly stated but might apply. Look for:
- Constructive discharge
- Breach of implied contract
- Defamation
- Intentional infliction of emotional distress
- Violation of public policy
- Promissory estoppel
- Fraud/misrepresentation
- Negligent supervision
- Any other viable claims

For each potential claim, explain WHY it might apply and what evidence would be needed.

JSON Response:
[
  {
    "suggestedClaim": "Legal claim name",
    "justification": "Detailed explanation of why this claim applies based on the facts",
    "evidenceNeeded": ["Evidence item 1", "Evidence item 2"],
    "strengthRating": 6
  }
]

Only suggest claims with at least a moderate chance of success.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const claims = safeJsonParse<SuggestedClaim[]>(response, 'discoverUnstatedClaims');
    return claims || [];
  } catch (error) {
    console.error("Error discovering claims:", error);
    return [];
  }
};

/**
 * GENERATE DEMAND LETTER SECTION
 */
export const generateDemandLetterSection = async (
  section: 'narrative' | 'legalViolations' | 'damages' | 'conclusion',
  analysisResults: AnalysisResults,
  complaintText: string,
  selectedClaims: string[]
): Promise<string | null> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const sectionPrompts = {
    narrative: `Write a compelling "Factual Background" section for a pre-litigation demand letter. Frame the client as a model employee who was wronged. Use specific dates and events. Professional but assertive tone.`,
    legalViolations: `Write the "Legal Violations" section. For each claim (${selectedClaims.join(', ')}), state the legal basis under Texas law and connect the facts to the elements. Cite relevant statutes and case law.`,
    damages: `Write the "Damages" section. Itemize economic damages (back pay, front pay, lost benefits), non-economic damages (emotional distress, reputational harm), and potential exemplary damages under Texas law. Frame as preliminary estimate.`,
    conclusion: `Write the "Conclusion and Demand" section. Firmly demand settlement of [$SETTLEMENT_AMOUNT], give 21 days to respond, and state that failure to settle will result in litigation. Professional but firm tone.`
  };

  const prompt = `${sectionPrompts[section]}

CASE SUMMARY: ${complaintText}

ANALYSIS DATA: ${JSON.stringify(analysisResults, null, 2)}

Write this section as it would appear in an actual demand letter. Use formal legal writing. Be persuasive but professional.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    return null;
  }
};

/**
 * AI IMPROVEMENT SUGGESTIONS
 */
export const getImprovementSuggestions = async (
  sectionTitle: string,
  sectionContent: string,
  fullCaseContext: string
): Promise<string | null> => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Review this section of a case analysis and provide 2-3 specific, actionable suggestions for improvement.

SECTION: ${sectionTitle}
CONTENT: ${sectionContent}

CONTEXT: ${fullCaseContext.substring(0, 1000)}

Provide concrete suggestions for:
- Missing information
- Logical gaps
- Stronger arguments
- Additional evidence needed
- Alternative approaches

Be specific and actionable.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return "Unable to generate suggestions at this time.";
  }
};

export {};