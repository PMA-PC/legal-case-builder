// types.ts - Complete Type Definitions for Legal Support System

// Environment variable types
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global API declarations
declare global {
  var gapi: any;
  var google: any;
}

// Google Drive Integration
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime: string;
}

// Core Allegation Types
export interface Allegation {
  id: string;
  claim: string;
  summary: string;
  evidenceMentioned: string[];
  texasCaseExamples?: TexasCaseExample[];
  status: 'draft' | 'investigating' | 'validated' | 'ready';
  conversation?: ConversationMessage[];
  strengthScore?: number;
}

export interface ConversationMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
  followUpQuestions?: string[];
}

// Evidence Types
export interface EvidenceItem {
  id: string;
  content: string;
  description: string;
  type: 'email' | 'document' | 'statement' | 'witness' | 'photo' | 'other';
  date: string;
  tags: string[];
  linkedAllegations: string[]; // IDs of allegations this evidence supports
  validationStatus: 'pending' | 'verified' | 'needs_more' | 'insufficient';
  validationNotes?: string;
  source?: string;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  name: string;
  type: string;
  size?: number;
  url?: string;
}

export interface Column {
  id: string;
  title: string;
  evidenceIds: string[];
}

export interface BoardState {
  evidence: { [key: string]: EvidenceItem };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

// Discovered Evidence from Drive
export interface DiscoveredEvidence {
  fileId: string;
  fileName: string;
  fileUrl: string;
  createdDate: string;
  relevanceType: 'specific' | 'proactive';
  specificAllegation?: string;
  proactiveCategory?: string;
  justification: string;
  category: string;
}

// Response Strategy Types
export interface ResponseStrategy {
  claim: string;
  strategy: string;
  suggestedActionSteps: string[];
  evidenceToGather: EvidenceToGather[];
  texasCaseExamples: TexasCaseExample[];
  instances: StrategyInstance[];
  defenseSimulation?: DefenseSimulation;
}

export interface EvidenceToGather {
  item: string;
  potentialSource: string;
  rationale: string;
  linkedEvidenceIds?: string[];
}

export interface TexasCaseExample {
  caseName: string;
  primaryComplaint: string;
  outcome: string;
  relevance: string;
  citation?: string;
}

export interface StrategyInstance {
  id: string;
  notes: string;
  attachments: FileAttachment[];
}

// Defense Simulation
export interface DefenseSimulation {
  likelyDefenses: DefenseArgument[];
  counterStrategies: CounterStrategy[];
  weaknessAnalysis: string;
  strengthRating: number; // 1-10
}

export interface DefenseArgument {
  argument: string;
  likelihood: 'high' | 'medium' | 'low';
  legalBasis: string;
  ourResponse: string;
}

export interface CounterStrategy {
  defensePoint: string;
  ourCounter: string;
  evidenceNeeded: string[];
}

// Investigation & Questions
export interface InvestigatorQuestion {
  question: string;
  purpose: string;
  category: 'factual' | 'legal' | 'evidence' | 'timeline';
}

export interface CultureShiftQuestion {
  question: string;
  objective: string;
}

export interface CulturePortraitQuestion {
  primaryQuestion: string;
  objective: string;
  followUps: FollowUpQuestion[];
}

export interface FollowUpQuestion {
  ifResponseIs: string;
  followUpQuestion: string;
}

export interface AdaAccommodationQuestion {
  question: string;
  focus: string;
  objective: string;
}

// Good Faith Conference
export interface GoodFaithConferenceGuide {
  meetingObjectives: string[];
  discoveryRequests: DocumentRequest[];
  negotiationStrategy: NegotiationStrategy;
  talkingPoints: string[];
  anticipatedConcerns: string[];
  settlementFramework: SettlementFramework;
}

export interface DocumentRequest {
  id: string;
  category: string;
  item: string;
  rationale: string;
  priority: 'critical' | 'important' | 'helpful';
  legalBasis?: string;
}

export interface NegotiationStrategy {
  openingPosition: string;
  fallbackPositions: string[];
  redLines: string[];
  leveragePoints: string[];
}

export interface SettlementFramework {
  minimumAcceptable: string;
  targetSettlement: string;
  aspirationalSettlement: string;
  nonMonetaryTerms: string[];
}

// Demand Letter
export interface DemandLetter {
  narrative: string | null;
  legalViolations: string | null;
  damages: string | null;
  conclusion: string | null;
  fullText?: string;
  generatedDate?: string;
}

// Counter Arguments
export interface CounterArgument {
  claim: string;
  potentialArgument: string;
  recommendedResponse: string;
  evidenceNeeded: string[];
}

// Analysis Results
export interface AnalysisResults {
  statedAllegations: Allegation[];
  unstatedClaims: UnstatedClaim[];
  responseStrategies: ResponseStrategy[];
  counterArguments: CounterArgument[];
  investigatorQuestions: InvestigatorQuestion[];
  cultureShiftQuestions: CultureShiftQuestion[];
  culturePortraitQuestions: CulturePortraitQuestion[];
  adaAccommodationQuestions: AdaAccommodationQuestion[];
  handbookPolicyViolations: HandbookViolation[];
  informationGaps: InformationGap[];
  quantitativeDataPrompts: QuantitativeDataPrompt[];
  goodFaithConferenceGuide: GoodFaithConferenceGuide;
  boardState?: BoardState;
  keyEventsTimeline?: KeyEvent[];
  evidenceStrength?: EvidenceStrengthMetric[];
}

export interface UnstatedClaim {
  claim: string;
  justification: string;
  evidenceNeeded: string[];
  texasCaseExamples?: TexasCaseExample[];
}

export interface HandbookViolation {
  policy: string;
  violation: string;
  evidence: string;
}

export interface InformationGap {
  gap: string;
  importance: 'critical' | 'important' | 'minor';
  howToFill: string;
}

export interface QuantitativeDataPrompt {
  dataType: string;
  rationale: string;
  sources: string[];
}

// AI Suggestions
export interface AiSuggestion {
  suggestionText: string;
  userNotes: string;
}

// Timeline & Infographics
export interface KeyEvent {
  event: string;
  date: string;
  significance: number;
  description: string;
}

export interface EvidenceStrengthMetric {
  claim: string;
  documentation: number;
  witnesses: number;
  timing: number;
  overall: number;
}

export interface TimelineEvent {
  fileId: string;
  fileName: string;
  fileUrl: string;
  createdDate: string;
  summary: string;
  category: string;
  topics: string[];
}

// Infographics Data
export interface CareerEvent {
  year: number;
  event: string;
  responsibilities: number;
  recognition: number;
}

export interface PeerComparisonData {
  metric: string;
  you: number;
  peer: number;
}

// Negotiation
export interface NegotiationPlaybook {
  openingOfferRationale: string;
  keyTalkingPoints: string[];
  concessionStrategy: string;
  timingStrategy?: string;
  psychologicalInsights?: string[];
}

export interface SuggestedClaim {
  suggestedClaim: string;
  justification: string;
  evidenceNeeded: string[];
  strengthRating?: number;
}

// Narrative Insights
export interface NarrativeInsight {
  causationLinks: string[];
  narrativeGaps: string[];
  keyTurningPoints: string[];
}

// Leadership Questions
export interface LeadershipQuestion {
  question: string;
  objective: string;
}

// Case Data Storage
export interface CaseData {
  analysis: AnalysisResults | null;
  complaintText: string;
  jobDescriptionText: string;
  actualDutiesText: string;
  characterProfileText: string;
  handbookUrl: string;
  suggestions: Record<string, AiSuggestion | null>;
  letterContent: DemandLetter | null;
  conversationHistory: ConversationMessage[];
}

// AI Session State
export interface AISessionState {
  currentAllegationId: string | null;
  investigationMode: 'overview' | 'deep-dive' | 'evidence-validation' | 'defense-prep';
  pendingQuestions: string[];
  discoveredClaims: SuggestedClaim[];
}

export {};