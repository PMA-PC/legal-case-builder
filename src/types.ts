

export interface Allegation {
  claim: string;
  summary: string;
  evidenceMentioned: string[];
  texasCaseExamples: TexasCaseExample[];
}

export interface UnstatedClaim {
  claim: string;
  justification: string;
  texasCaseExamples: TexasCaseExample[];
}

export interface InformationGap {
  area: string;
  question: string;
  rationale: string;
}

export interface InvestigatorQuestion {
  question: string;
  purpose: string;
}

export interface CultureShiftQuestion {
  question: string;
  objective: string;
}

export interface CultureQuestion {
  primaryQuestion: string;
  objective: string;

  followUps: {
    ifResponseIs: string;
    followUpQuestion: string;
  }[];
}

export interface ADAQuestion {
  question: string;
  objective: string;
  focus: 'Process' | "Your Case" | 'Disparate Treatment' | 'Legal Knowledge';
}

export interface QuantitativeDataPrompt {
  prompt: string;
  rationale: string;
}

export interface HandbookPolicyViolation {
  policyName: string;
  handbookSection: string;
  violationSummary: string;
  relatedAllegation: string;
}

export interface Attachment {
  name: string;
  type: string;
}

export interface StrategyInstance {
  id: string;
  notes: string;
  attachments: Attachment[];
}

export interface TexasCaseExample {
  caseName: string;
  primaryComplaint: string;
  outcome: string;
  relevance: string;
}

export interface EvidenceToGather {
  item: string;
  potentialSource: string;
  rationale: string;
  linkedEvidenceIds?: string[]; // New: Link to evidence items on the board
}

export interface ResponseStrategy {
  claim: string;
  strategy: string;
  evidenceToGather: EvidenceToGather[];
  suggestedActionSteps: string[];
  potentialCounterArguments: string[];
  rebuttals: string[]; // Added this field
  instances: StrategyInstance[];
}

export interface DocumentRequest {
  id?: string;
  category: string;
  item: string;
  rationale: string;
}

export interface DraftCommunication {
  type: 'Email' | 'Letter';
  purpose: string;
  subject: string;
  body: string;
}

export interface GoodFaithConferenceGuide {
  introduction: string;
  keyTopics: string[];
  documentRequests: DocumentRequest[];
  draftCommunications: DraftCommunication[];
}

export interface AnalysisResults {
  statedAllegations: Allegation[];
  unstatedClaims: UnstatedClaim[];
  informationGaps: InformationGap[];
  investigatorQuestions: InvestigatorQuestion[];
  cultureShiftQuestions: CultureShiftQuestion[];
  culturePortraitQuestions: CultureQuestion[];
  adaAccommodationQuestions: ADAQuestion[];
  quantitativeDataPrompts: QuantitativeDataPrompt[];
  handbookPolicyViolations: HandbookPolicyViolation[];
  goodFaithConferenceGuide: GoodFaithConferenceGuide;
  responseStrategies: ResponseStrategy[];
  boardState?: BoardState;
}

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

export interface EvidenceItem {
  id: string;
  content: string;
  description: string;
  type: 'email' | 'document' | 'statement' | 'other';
  date: string;
  tags?: string[];
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

export interface DiscoveredEvidence {
  fileId: string;
  fileName: string;
  fileUrl: string;
  createdDate: string;
  relevanceType: 'specific' | 'proactive';
  specificAllegation?: string; // The allegation claim it supports
  proactiveCategory?: string; // The descriptive category for proactive relevance
  justification: string;
  category: string;
}

export interface AiSuggestion {
  suggestionText: string;
  userNotes: string;
}

export interface CaseData {
  analysis: AnalysisResults | null;
  complaintText: string;
  jobDescriptionText: string;
  actualDutiesText: string;
  characterProfileText: string;
  handbookUrl: string;
  suggestions: Record<string, AiSuggestion | null>; // Added to persist suggestions and user notes
  letterContent: string | null; // Added to persist generated letter content

  // Advanced modules
  arbitrationAnalysis: ArbitrationAnalysis | null;
  timeline: Timeline | null;
  timelineEvents?: TimelineEvent[];
  damages: DamagesBreakdown | null;
  comparatorAnalysis: ComparatorAnalysis | null;
  pretextAnalysis: PretextAnalysis | null;
  protectedActivityDate?: string;
  terminationDate?: string;

  // New fields for Mood Log and Character Profile
  moodLogs: MoodLogEntry[];
  characterProfileData: CharacterProfileData;
  careerEvents: CareerEvent[];
  peerComparisons: PeerComparisonData[];
  rawEvidence: RawEvidence[];
}

export interface RawEvidence {
  id: string;
  file: UploadedFile;
  category: string;
  description: string;
}

export interface MoodLogEntry {
  id: string;
  date: string;
  feeling: string;
  primaryEmotionColor: string;
  rating: number;
  comment: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  content: string;
}

export interface ProfileEvidence {
  id: string;
  file: UploadedFile;
  description: string;
}

export interface CharacterProfileData {
  evidence: ProfileEvidence[];
}

// ===== ADVANCED MODULES TYPES =====

export interface ArbitrationAnalysis {
  agreementText: string;
  signedDate: string;
  unconscionabilityScore: number; // 0-100
  proceduralIssues: string[];
  substantiveIssues: string[];
  carveOutViable: boolean;
  carveOutRationale: string;
  motionTemplate: string;
  legalArguments: string[];
  settlementLeveragePoints: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'protected_activity' | 'adverse_action' | 'performance_review' | 'meeting' | 'policy_change' | 'other';
  description: string;
  significance: string;
  category?: string;
}

export interface Timeline {
  events: TimelineEvent[];
  protectedActivityDate: string;
  terminationDate: string;
  temporalProximityDays: number;
  causalConnectionStrength: 'strong' | 'moderate' | 'weak';
  narrative: string;
  mcDonnellDouglasAnalysis: {
    protectedActivity: boolean;
    protectedActivityDescription: string;
    adverseAction: boolean;
    adverseActionDescription: string;
    causalConnection: boolean;
    causalConnectionRationale: string;
  };
  interveningEvents: string[];
}

export interface DamagesBreakdown {
  // Input data
  salary: number;
  terminationDate: string;
  currentDate: string;
  newJobSalary: number;
  newJobStartDate: string;

  // Economic damages
  economic: {
    backPay: number;
    backPayMonths: number;
    frontPay: number;
    frontPayYears: number;
    lostBenefits: {
      healthInsurance: number;
      retirement401k: number;
      paidTimeOff: number;
      other: number;
      total: number;
    };
    jobSearchExpenses: number;
    total: number;
  };

  // Non-economic damages
  nonEconomic: {
    emotionalDistress: number;
    emotionalDistressJustification: string;
    reputationalHarm: number;
    reputationalHarmJustification: string;
    total: number;
  };

  // Punitive damages
  punitive: {
    eligible: boolean;
    eligibilityRationale: string;
    amount: number;
    texasCap: number;
    capCalculation: string;
  };

  // Settlement ranges
  settlementRange: {
    conservative: number;
    conservativeRationale: string;
    moderate: number;
    moderateRationale: string;
    aggressive: number;
    aggressiveRationale: string;
  };

  // Total
  totalDamages: number;
}

export interface Comparator {
  id: string;
  name: string;
  role: string;
  conduct: string;
  discipline: string;
  protectedClass: string;
  notes: string;
}

export interface ComparatorAnalysis {
  comparators: Comparator[];
  allegedMisconduct: string;
  yourDiscipline: string;
  disparateTreatmentScore: number; // 0-100
  discoveryRequests: string[];
  comparisonChart: {
    employee: string;
    conduct: string;
    discipline: string;
    protectedClass: string;
  }[];
  narrative: string;
}

export interface PretextAnalysis {
  statedReasons: string[];
  shiftingExplanations: string[];
  inconsistencies: string[];
  modelEmployeeNarrative: string;
  employmentHistory: {
    tenure: string;
    performanceReviews: string;
    disciplinaryRecord: string;
    awards: string;
  };
  depositionQuestions: string[];
  pretextScore: number; // 0-100, higher = more likely pretext
  pretextRationale: string;
  afterAcquiredEvidenceDefense: string;
}