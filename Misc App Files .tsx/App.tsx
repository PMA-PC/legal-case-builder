
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { OnDragEndResponder } from '@hello-pangea/dnd';
import { AnalysisResults, Allegation, ResponseStrategy, BoardState, EvidenceItem, Column, DiscoveredEvidence, UnstatedClaim, DocumentRequest, CaseData, AiSuggestion } from './types';
import { analyzeCase, getImprovementSuggestions, generateLegalLetter } from './services/geminiService';
import Spinner from './components/Spinner';
import AnalysisDisplay from './components/AnalysisDisplay';
import Infographics from './components/Infographics';
import EvidenceBoard from './components/EvidenceBoard';
import DriveScanner from './components/DriveScanner';
import DemandLetter from './components/DemandLetter';
import FollowUpQuestions from './components/FollowUpQuestions';

const initialComplaintText = `Email Correspondence Summary
Date	Sender	Recipients	Subject	Summary
Fri, Aug 16, 2024, 11:54 AM	JD Shipman <joshuadshipman@gmail.com>	Stephanie Pathak	Formal Complaint - Joshua D. Shipman	Joshua Shipman sent a formal complaint to Stephanie Pathak (HR). The content of this initial complaint is not detailed in the provided emails.
Fri, Aug 16, 2024, 4:36 PM	Stephanie Pathak <Stephanie.Pathak@gainsco.com>	Sola Opeola, Joshua D. Shipman	Re: Formal Complaint - Joshua D. Shipman	Stephanie acknowledges Josh's email and a morning call. She states she will discuss internally and copies Sola Opeola (Associate General Counsel) to work directly with Josh on the matter.
Mon, Aug 19, 2024, 1:12 PM	Stephanie Pathak <Stephanie.Pathak@gainsco.com>	Joshua D. Shipman, Sola Opeola	(Re: Formal Complaint - Joshua D. Shipman)	Stephanie reiterates the company's focus on its best interest and employees, stating no tolerance for discrimination or retaliation. She confirms Sola Opeola, under direction from Drew (General Counsel), will conduct a thorough investigation and reach out shortly.
Mon, Sep 29, 2025, 8:20 AM	JD Shipman <joshuadshipman@gmail.com>	Stephanie Pathak, Sola Opeola, Joshua D. Shipman	Request for Formal Termination Documentation and Additional Grievances	Joshua Shipman requests formal termination documentation (notice, reason, severance, benefits, compensation, equipment return) and formally submits additional grievances for investigation, citing "Unfair Treatment Related to Disability and Denial of Reasonable Accommodation" under ADA and state laws, related to medical issues.
Mon, Sep 29, 2025, 10:30 AM	Scott Macduff <scott.macduff@gainsco.com>	JD Shipman	Re: Request for Formal Termination Documentation and Additional Grievances	Scott Macduff (HR Manager) responds to Josh's inquiries. He clarifies termination reason was policy violation (berating direct report) discussed on Sept 17. Confirms no severance. States benefits info was emailed on Sept 17 and re-sent. Final paycheck direct deposited Sept 23. Explains unused PTO is not paid out per company policy unless legally required. FedEx label for equipment was resent. Confirms Sola Opeola will conduct an investigation into additional grievances and asks to confirm Josh's phone number.
Employee's Potential Claims & Company's Counterarguments (Texas Employment Law)
Wrongful Termination (Texas At-Will Employment Exceptions)

Employee's Claim:

Despite Texas being an at-will employment state, my termination was wrongful because it falls under legally recognized exceptions, specifically discrimination based on disability and/or retaliation for protected activity (i.e., filing a formal complaint). The timing of the termination relative to my complaints suggests a potential link. The company's stated reason (berating a direct report) might be a pretext, especially if my behavior was influenced by my disability or if similar conduct by others went unpunished.

Company's Likely Counterargument:

The company operates under Texas at-will employment principles and can terminate employment for any non-discriminatory, non-retaliatory reason, or no reason at all. Any adverse employment action was based on legitimate, non-discriminatory business reasons (e.g., performance issues, organizational restructuring, policy violations) and was not in response to protected activity. Scott Macduff's email explicitly states the reason for termination was a clear violation of company policy regarding conduct with direct reports, which was discussed with the employee prior to the incident.

Disability Discrimination and Failure to Accommodate (ADA & Texas Labor Code)

Employee's Claim:

I was subjected to unfair treatment related to my disability and was denied reasonable accommodation for my medical issues, in direct violation of the Americans with Disabilities Act (ADA) and the Texas Labor Code, Chapter 21. The company's actions "pushed" against my medical needs, creating a discriminatory environment. The alleged policy violation might have been a manifestation of my disability, for which accommodation should have been considered, or the company failed to engage in an interactive process.

Company's Likely Counterargument:

The company denies any disability discrimination. We assert that we either provided reasonable accommodations, engaged in a good-faith interactive process to identify and implement suitable accommodations, or that any requested accommodation would have imposed an undue hardship on the business operations. Furthermore, any employment decisions impacting the employee were made independently of, and unrelated to, their disability status. The stated reason for termination relates to professional conduct, not disability.

Retaliation for Protected Activity (Federal & Texas Labor Code)

Employee's Claim:

I suffered retaliation, which culminated in my termination, directly after I engaged in protected activity by filing formal complaints of discrimination. This is a clear violation of both federal anti-retaliation laws and the Texas Labor Code, Chapter 21, which prohibit employers from taking adverse actions against employees who’s oppose discriminatory practices or file complaints. The termination occurring shortly after my initial complaint to HR on Aug 16, 2024, and before my additional grievances on Sep 29, 2025, establishes a temporal proximity indicative of retaliation.

Company's Likely Counterargument:

The company maintains a strict non-retaliation policy. We deny that any adverse employment action was taken because of the employee's protected complaints. The termination or other actions were based on legitimate, well-documented business reasons that predated or were independent of the complaints. Specifically, the policy violation occurred *after* the initial HR contact but was a distinct event justifying termination. The investigation into the initial complaint was ongoing and unbiased, as confirmed by Stephanie Pathak and Scott Macduff's emails.

Failure to Provide Required Termination Documentation & Information (Texas Payday Law)

Employee's Claim:

The company failed to provide essential termination documentation and information in a timely manner, including official written notice of termination, the stated reason for termination, details regarding a severance package, instructions for benefits conversion (e.g., COBRA), and the status of any outstanding compensation or accrued vacation time. My request on Sep 29, 2025, shows these were still not clearly received or understood, despite the termination occurring on Sept 17. The company's multiple resends and explanations indicate an initial failure in communication.

Company's Likely Counterargument:

The company will assert that all legally required documentation and information were provided to the employee within the statutory timelines. Texas law does not mandate providing a specific "reason" for at-will termination in writing, nor does it require severance packages unless explicitly agreed upon. Scott Macduff's email confirms that benefits information was sent on Sept 17 and re-sent, and the FedEx label was also sent on Sept 17, indicating the company made timely efforts. Any perceived delays or lack of receipt were administrative or due to incorrect contact information initially provided by the employee, which the company actively corrected.

Unpaid Wages/Benefits Claims (Texas Payday Law)

Employee's Claim:

The company failed to pay all outstanding compensation and/or accrued vacation time upon my termination, in violation of the Texas Payday Law (Texas Labor Code Chapter 61). Specifically, the company's refusal to pay out accrued and unused PTO, as stated in Scott Macduff's email, may contradict Texas Labor Code provisions or existing company practices if the policy is not uniformly applied or clearly communicated. Even if the policy exists, its enforceability under Texas law for previously accrued benefits might be challenged.

Company's Likely Counterargument:

The company affirms that all final wages, including any accrued vacation time payable under established company policy, were calculated and paid in full to the employee in accordance with the Texas Payday Law (Texas Labor Code Chapter 61). Scott Macduff's email explicitly states that the final paycheck was direct deposited on Sept 23 and cites the GAINSCO Employee Handbook policy (Page 18) which clearly states that unused PTO is not paid out upon termination unless required by applicable law, and Texas law generally does not require it.

Discriminatory Pay: User was paid unfairly based on work requested and level of work completed, not compensated at 'Manager 1' level. (Referencing relevant Texas case law examples for pay discrimination based on work requested and level of work completed, especially in comparison to a 'Manager 1' level).`;

const initialJobDescriptionText = `Key Responsibilities:
Supervise a team of claim leaders, providing guidance and support on claims handling and resolution.
Ensure timely and proper management of claims, in accordance with company policies and all legal/regulatory requirements.
Review and evaluate claims, analyze trends, and provide recommendations for process improvement.
Oversee team training and development, coach staff, and implement changes in processes or regulations.
Communicate effectively with policyholders, claimants, agents, and other company departments to facilitate seamless claims management.
Monitor claim processing metrics, prepare reports, and drive operational efficiency.
Ensure compliance with standards for documentation, reporting, and billing.
Interpret policies to ensure claims are handled according to coverage terms and exclusions.
Support loss control activities such as salvage, subrogation, and fraud detection.
Foster a positive, team-oriented culture and uphold high standards for customer satisfaction.`;

const initialActualDutiesText = `Project Management & Leadership 

Develop long-term solutions related to claims support functions including offsite call center, glass program, segmentation updates and administrative roles related to highly impactful claims organization. 

Advocate for improved processes related to customer experience and employee experience including working with strategic partners to assist with changes to our claims systems such as Guidewire or the Genesys phone system.  

Parter with Vice President to identify and recommend changes to process, resource allocation, training and or systems updates to improve the goals of each department or support group as well the Claims group as whole. 

Collaborate with other departments and Claims Vice Presidents regarding possible updates to processes and/or training. Create and use analytical reporting to determine various outcomes. 

Develop and approve new training materials within the department. Coach, train and provide feedback to new leaders on presentations and presentation skills related to their respective departments.  

Responsible GAINSCO’s inside adjuster catastrophe team and process. Coordinate with field staff to ensure best resolution based on the storm type. Reporting and analytics to both leadership and field staff on volume, types, and frequency. Request and creation of CAT Code creation and monitoring of potential losses. 

Implantation and administration of Kudos, a recognition platform, including updates and roll-out of employee engagement campaigns. 

Resource Management: 

Oversee departmental hiring for multiple departments to ensure highly qualified candidates for the various roles or positions within the organization.  

Manage and develop workflows within the various sub-groups ensuring tasks are appropriately delegated to leaders and adjusters. 

Motivate and engage employees to deliver exceptional results within Fastlane, Total Loss and sub-departments and groups.  

Identify and address departmental issues to ensure efficient and high-quality claims handling. 

Mentor staff and new leaders in achieving key department metrics. 

Oversee and management of support functions for PD Subrogation/Ehub, CMS Reporting, ImageRight Processing and FNOL claim creation both by claims support and third parties. 

Train new leaders in proper claim processing, basic analytics, and report writing. 

Supervises, evaluates performance, and recommends salary changes for personnel. Actively participates in interviews and selections of new personnel and assists with other staffing decisions 

Communication & Collaboration: 

Communicate departmental goals and strategies for Fastlane, Glass, Total Loss, PD Splits, and other claim support functions.  

Develop and recommend changes or other tools that improve the customer experience, reduce overhead costs or improve quality.  

Report and present to senior leadership board quarterly on the various department metrics, goals, and opportunities while ensuring current projects match the strategic goals of the company.  

Coach and train leaders on proper claims responses to various departments of insurance, BBB, and agents. 

Develop new leaders on proper coaching and feedback techniques to develop high quality adjusters within the group. 

Decision Making 

Analysis, process and decision making related to first notice of loss, express claims handling, total loss, and claims support functions. Including recommendations of new products, process changes and workflow updates, and implantation of new technology that supports quality, efficiency or a combination of both. 

Verify policy coverage and claims for accuracy and customer service. Identify trends within the departments related to quality and partner with related teams to improve the product or handling. 

Partner with the WFM group to ensure staffing and scheduling needs for the department are met.  

Collaborate with directors and vice presidents on critical claim decisions.  

External Relations 

Represent the company and build strong relationships with key stakeholders such as third-party companies supporting the GAINSCO claims organization including QRM and  

Review and make recommendations to ensure customer service and improved quality with third party vendors. Responsible for quality, metrics, and invoice validation to ensure contract compliance. 

Foster a mutual partnership with QRM, Safelite, and other vendors to ensure high quality and efficient use of services.`;

const initialCharacterProfileText = `8-year employee with a consistent record of high performance, positive reviews, and zero disciplinary actions.
Credit score in the 830s, demonstrating high personal responsibility and reliability.
Perfect attendance record; never calls in sick. Known for working longer hours and being more dedicated than peers.
MBA-educated professional.
This character profile directly contradicts the company's stated reason for termination ("berating a direct report"), suggesting it is pretextual and inconsistent with a long-standing history of professional conduct.`;


const sampleEvidence: EvidenceItem[] = [
    { id: 'ev-1', content: 'Email from Manager (Jan 10)', description: 'Manager questions commitment after hours.', type: 'email', date: '2024-01-10T14:30:00Z', tags: ['Communication', 'Key Document'] },
    { id: 'ev-2', content: 'Performance Review Q4', description: 'Positive review, exceeds expectations.', type: 'document', date: '2023-12-15T10:00:00Z', tags: ['Performance'] },
    { id: 'ev-3', content: 'Witness Statement from Jane D.', description: 'Heard discriminatory comments in break room.', type: 'statement', date: '2024-02-05T11:20:00Z', tags: ['Discrimination', 'Witness'] },
    { id: 'ev-4', content: 'Project Assignment Email', description: 'Key project reassigned to a younger colleague.', type: 'email', date: '2024-03-01T09:05:00Z', tags: ['Age Discrimination'] },
    { id: 'ev-5', content: 'HR Complaint Draft', description: 'Initial draft outlining concerns about workload.', type: 'document', date: '2024-04-12T16:45:00Z', tags: ['HR Communication'] },
];

const LOCAL_STORAGE_KEY = 'wrongfulTerminationCaseData_prose_v5';

const initialCaseData: CaseData = {
  analysis: null,
  complaintText: initialComplaintText,
  jobDescriptionText: initialJobDescriptionText,
  actualDutiesText: initialActualDutiesText,
  characterProfileText: initialCharacterProfileText,
  handbookUrl: 'https://drive.google.com/file/d/1BNWluQDbQt1s2J72Mz3lDCMCv4E1UI8e/view?usp=sharing',
  suggestions: {}, // Initialize suggestions
  letterContent: null, // Initialize letter content
};

const App: React.FC = () => {
  const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'followup' | 'infographics' | 'evidence' | 'discovery' | 'demand'>('analysis');
  const [isSuggesting, setIsSuggesting] = useState<Record<string, boolean>>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>('complaintText'); // State for open accordion

  const { analysis, complaintText, jobDescriptionText, actualDutiesText, characterProfileText, handbookUrl, suggestions } = caseData;

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData: CaseData = JSON.parse(savedData);
        
        // Migration for older data structures
        if (!parsedData.characterProfileText) {
            parsedData.characterProfileText = initialCharacterProfileText;
        }
        // FIX: Cast parsedData to 'any' to allow deletion of properties not present in the current CaseData type.
        if ((parsedData as any).cultureAnswers || (parsedData as any).cultureText) {
            delete (parsedData as any).cultureAnswers;
            delete (parsedData as any).cultureText;
        }

        // Migration for suggestions to the new AiSuggestion object format
        const newSuggestions: Record<string, AiSuggestion | null> = {};
        if (parsedData.suggestions) {
            for (const key in parsedData.suggestions) {
                const val = parsedData.suggestions[key];
                if (typeof val === 'string') { // Old format: just a string
                    newSuggestions[key] = { suggestionText: val, userNotes: '' };
                } else if (val && typeof val === 'object' && typeof (val as AiSuggestion).suggestionText === 'string') {
                    // Already in new format or similar, ensure userNotes exists
                    newSuggestions[key] = { suggestionText: (val as AiSuggestion).suggestionText, userNotes: (val as AiSuggestion).userNotes || '' };
                } else {
                    newSuggestions[key] = null;
                }
            }
        }
        parsedData.suggestions = newSuggestions; // Update with migrated suggestions

        // Ensure letterContent exists
        if (parsedData.letterContent === undefined) {
          parsedData.letterContent = null;
        }


        setCaseData(parsedData);
      }
    } catch (err) {
      console.error("Failed to load data from localStorage", err);
    }
  }, []);

  // Save data to localStorage whenever caseData changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(caseData));
    } catch (err) {
      console.error("Failed to save data to localStorage", err);
    }
  }, [caseData]);
  
  const initializeBoardState = (allegations: Allegation[]): BoardState => {
    const evidenceMap = sampleEvidence.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as { [key: string]: EvidenceItem });

    const allegationColumns = allegations.map((allegation, index) => ({
      id: `allegation-${index}`,
      title: allegation.claim,
      evidenceIds: [],
    }));

    return {
      evidence: evidenceMap,
      columns: {
        'uncategorized': {
          id: 'uncategorized',
          title: 'Uncategorized Evidence',
          evidenceIds: sampleEvidence.map(e => e.id),
        },
        ...allegationColumns.reduce((acc, col) => {
          acc[col.id] = col;
          return acc;
        }, {} as BoardState['columns']),
      },
      columnOrder: ['uncategorized', ...allegationColumns.map(c => c.id)],
    };
  };

  const handleAnalyze = useCallback(async () => {
    if (!complaintText.trim()) {
      setError("Please provide your complaint details before analyzing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCaseData(prev => ({ ...prev, analysis: null, suggestions: {}, letterContent: null })); // Reset analysis, suggestions, and letter
    setIsSuggesting({});
    try {
      const results = await analyzeCase(complaintText, jobDescriptionText, actualDutiesText, characterProfileText, handbookUrl);
      if (results) {
        if (results.goodFaithConferenceGuide?.documentRequests) {
            results.goodFaithConferenceGuide.documentRequests = results.goodFaithConferenceGuide.documentRequests.map((req, index) => ({
                ...req,
                id: `docreq-${Date.now()}-${index}`,
            }));
        }
        const augmentedResults: AnalysisResults = {
            ...results,
            responseStrategies: results.responseStrategies.map(strategy => ({
                ...(strategy as ResponseStrategy),
                instances: [],
                evidenceToGather: strategy.evidenceToGather.map(e => ({ ...e, linkedEvidenceIds: [] })) // Initialize linkedEvidenceIds
            })),
            boardState: initializeBoardState(results.statedAllegations),
        };
        setCaseData(prev => ({ ...prev, analysis: augmentedResults }));
        setActiveTab('analysis');
      } else {
        setError("Failed to get analysis from the AI. Please check the console for details.");
      }
    } catch (err) {
      setError("An unexpected error occurred during analysis.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [complaintText, jobDescriptionText, actualDutiesText, characterProfileText, handbookUrl]);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all saved data and start over? This action cannot be undone.")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCaseData(initialCaseData);
        setError(null);
        setIsSuggesting({});
        setActiveTab('analysis');
    }
  };

  // --- Instance Handlers ---
  const handleAddInstance = useCallback((strategyIndex: number) => {
    setCaseData(prev => {
      if (!prev.analysis) return prev;
      const newStrategies = [...prev.analysis.responseStrategies];
      const newInstances = [...(newStrategies[strategyIndex].instances || []), { id: `inst-${Date.now()}`, notes: '', attachments: [] }];
      newStrategies[strategyIndex] = { ...newStrategies[strategyIndex], instances: newInstances };
      const newAnalysis = { ...prev.analysis, responseStrategies: newStrategies };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const handleDeleteInstance = useCallback((strategyIndex: number, instanceId: string) => {
    if (!window.confirm("Are you sure you want to delete this example?")) return;
    setCaseData(prev => {
      if (!prev.analysis) return prev;
      const newStrategies = [...prev.analysis.responseStrategies];
      const newInstances = (newStrategies[strategyIndex].instances || []).filter(inst => inst.id !== instanceId);
      newStrategies[strategyIndex] = { ...newStrategies[strategyIndex], instances: newInstances };
      const newAnalysis = { ...prev.analysis, responseStrategies: newStrategies };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const handleUpdateInstanceNotes = useCallback((strategyIndex: number, instanceId: string, notes: string) => {
    setCaseData(prev => {
      if (!prev.analysis) return prev;
      const newStrategies = [...prev.analysis.responseStrategies];
      const newInstances = (newStrategies[strategyIndex].instances || []).map(inst =>
        inst.id === instanceId ? { ...inst, notes } : inst
      );
      newStrategies[strategyIndex] = { ...newStrategies[strategyIndex], instances: newInstances };
      const newAnalysis = { ...prev.analysis, responseStrategies: newStrategies };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const handleAddAttachments = useCallback((strategyIndex: number, instanceId: string, files: FileList) => {
    setCaseData(prev => {
      if (!prev.analysis) return prev;
      const newAttachments = Array.from(files).map(file => ({ name: file.name, type: file.type }));
      const newStrategies = [...prev.analysis.responseStrategies];
      const newInstances = (newStrategies[strategyIndex].instances || []).map(inst =>
        inst.id === instanceId ? { ...inst, attachments: [...inst.attachments, ...newAttachments] } : inst
      );
      newStrategies[strategyIndex] = { ...newStrategies[strategyIndex], instances: newInstances };
      const newAnalysis = { ...prev.analysis, responseStrategies: newStrategies };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);
  
  const handleDeleteAttachment = useCallback((strategyIndex: number, instanceId: string, attachmentIndex: number) => {
     setCaseData(prev => {
      if (!prev.analysis) return prev;
      const newStrategies = [...prev.analysis.responseStrategies];
      const newInstances = (newStrategies[strategyIndex].instances || []).map(inst => {
          if (inst.id === instanceId) {
              const updatedAttachments = [...inst.attachments];
              updatedAttachments.splice(attachmentIndex, 1);
              return { ...inst, attachments: updatedAttachments };
          }
          return inst;
      });
      newStrategies[strategyIndex] = { ...newStrategies[strategyIndex], instances: newInstances };
      const newAnalysis = { ...prev.analysis, responseStrategies: newStrategies };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  // --- Document Request Handlers ---
  const handleAddDocumentRequest = useCallback(() => {
    setCaseData(prev => {
      if (!prev.analysis?.goodFaithConferenceGuide) return prev;
      const newRequest: DocumentRequest = {
        id: `docreq-${Date.now()}`,
        category: 'New Category',
        item: 'New item to request.',
        rationale: 'Rationale for this request.',
      };
      const newGuide = {
        ...prev.analysis.goodFaithConferenceGuide,
        documentRequests: [...prev.analysis.goodFaithConferenceGuide.documentRequests, newRequest]
      };
      const newAnalysis = { ...prev.analysis, goodFaithConferenceGuide: newGuide };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const handleUpdateDocumentRequest = useCallback((id: string, field: keyof Omit<DocumentRequest, 'id'>, value: string) => {
    setCaseData(prev => {
      if (!prev.analysis?.goodFaithConferenceGuide) return prev;
      const newRequests = prev.analysis.goodFaithConferenceGuide.documentRequests.map(req =>
        req.id === id ? { ...req, [field]: value } : req
      );
      const newGuide = { ...prev.analysis.goodFaithConferenceGuide, documentRequests: newRequests };
      const newAnalysis = { ...prev.analysis, goodFaithConferenceGuide: newGuide };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const handleDeleteDocumentRequest = useCallback((id: string) => {
    if (!window.confirm("Are you sure you want to delete this document request?")) return;
    setCaseData(prev => {
      if (!prev.analysis?.goodFaithConferenceGuide) return prev;
      const newRequests = prev.analysis.goodFaithConferenceGuide.documentRequests.filter(req => req.id !== id);
      const newGuide = { ...prev.analysis.goodFaithConferenceGuide, documentRequests: newRequests };
      const newAnalysis = { ...prev.analysis, goodFaithConferenceGuide: newGuide };
      return { ...prev, analysis: newAnalysis };
    });
  }, []);

  // --- AI Suggestion Handler ---
  const handleGetSuggestions = useCallback(async (sectionKey: keyof AnalysisResults, sectionTitle: string) => {
    if (!analysis) return;
    setIsSuggesting(prev => ({ ...prev, [sectionKey]: true }));
    setCaseData(prev => ({
        ...prev,
        suggestions: {
            ...prev.suggestions,
            [sectionKey]: prev.suggestions[sectionKey] ? { ...prev.suggestions[sectionKey]!, suggestionText: '' } : null
        }
    })); // Clear previous suggestion text, keep user notes

    let sectionContent = '';
    
    switch (sectionKey) {
        case 'statedAllegations':
            sectionContent = JSON.stringify(analysis.statedAllegations, null, 2);
            break;
        case 'unstatedClaims':
            sectionContent = JSON.stringify(analysis.unstatedClaims, null, 2);
            break;
        case 'informationGaps':
            sectionContent = JSON.stringify(analysis.informationGaps, null, 2);
            break;
        case 'investigatorQuestions':
            sectionContent = JSON.stringify(analysis.investigatorQuestions, null, 2);
            break;
        case 'quantitativeDataPrompts':
            sectionContent = JSON.stringify(analysis.quantitativeDataPrompts, null, 2);
            break;
        case 'cultureShiftQuestions':
            sectionContent = JSON.stringify(analysis.cultureShiftQuestions, null, 2);
            break;
        case 'culturePortraitQuestions':
            sectionContent = JSON.stringify(analysis.culturePortraitQuestions, null, 2);
            break;
        case 'adaAccommodationQuestions':
            sectionContent = JSON.stringify(analysis.adaAccommodationQuestions, null, 2);
            break;
        case 'handbookPolicyViolations':
            sectionContent = JSON.stringify(analysis.handbookPolicyViolations, null, 2);
            break;
        case 'goodFaithConferenceGuide':
            sectionContent = JSON.stringify(analysis.goodFaithConferenceGuide, null, 2);
            break;
        case 'responseStrategies':
            sectionContent = JSON.stringify(analysis.responseStrategies.map(({ instances, ...rest }) => rest), null, 2);
            break;
        default:
            sectionContent = ''; // Should not happen with current sectionKeys
    }

    try {
        const result = await getImprovementSuggestions(sectionTitle, sectionContent, complaintText);
        if (result) {
            setCaseData(prev => ({
                ...prev,
                suggestions: {
                    ...prev.suggestions,
                    [sectionKey]: { suggestionText: result, userNotes: prev.suggestions[sectionKey]?.userNotes || '' }
                }
            }));
        }
    } catch (err) {
        console.error("Error getting suggestions:", err);
        setCaseData(prev => ({
            ...prev,
            suggestions: {
                ...prev.suggestions,
                [sectionKey]: { suggestionText: "Failed to get suggestions. Please try again.", userNotes: prev.suggestions[sectionKey]?.userNotes || '' }
            }
        }));
    } finally {
        setIsSuggesting(prev => ({...prev, [sectionKey]: false }));
    }
  }, [analysis, complaintText, suggestions]);

  // --- User Notes Handler ---
  const handleUpdateUserNotes = useCallback((sectionKey: string, notes: string) => {
    setCaseData(prev => ({
        ...prev,
        suggestions: {
            ...prev.suggestions,
            [sectionKey]: prev.suggestions[sectionKey] ? { ...prev.suggestions[sectionKey]!, userNotes: notes } : null
        }
    }));
  }, []);

  // --- Update Stated Allegation Evidence Mentioned Handler ---
  const handleUpdateStatedAllegationEvidenceMentioned = useCallback((allegationIndex: number, newEvidenceMentions: string[]) => {
    setCaseData(prev => {
        if (!prev.analysis) return prev;
        const updatedAllegations = [...prev.analysis.statedAllegations];
        if (updatedAllegations[allegationIndex]) {
            updatedAllegations[allegationIndex] = {
                ...updatedAllegations[allegationIndex],
                evidenceMentioned: newEvidenceMentions.filter(item => item.trim() !== ''), // Filter out empty lines
            };
        }
        return { ...prev, analysis: { ...prev.analysis, statedAllegations: updatedAllegations } };
    });
  }, []);


  // --- Export Section Content Handler ---
  const handleExportSection = useCallback((sectionKey: string, sectionTitle: string) => {
    let contentToExport = '';
    let fileNameBase = sectionTitle.replace(/[^a-zA-Z0-9]/g, '_');
    let fileExtension = 'json'; // Default for structured data

    if (sectionKey in suggestions && suggestions[sectionKey]?.suggestionText) { // For AI suggestions
        const suggestionData = suggestions[sectionKey];
        if (suggestionData) {
            contentToExport = `AI Suggestions for ${sectionTitle}:\n\n${suggestionData.suggestionText}`;
            if (suggestionData.userNotes) {
                contentToExport += `\n\n--- Your Notes ---\n${suggestionData.userNotes}`;
            }
            fileNameBase = `AI_Suggestions_${fileNameBase}`;
            fileExtension = 'txt';
        }
    } else if (analysis && analysis[sectionKey as keyof AnalysisResults]) { // For analysis results
        // Handle statedAllegations specifically to include potential user edits
        if (sectionKey === 'statedAllegations') {
            contentToExport = JSON.stringify(analysis.statedAllegations, null, 2);
        } else {
            const data = analysis[sectionKey as keyof AnalysisResults];
            contentToExport = JSON.stringify(data, null, 2);
        }
        fileNameBase = `Analysis_${fileNameBase}`;
    } else {
        contentToExport = 'No content available for this section.';
        fileExtension = 'txt';
    }

    const fileName = `${fileNameBase}.${fileExtension}`;
    const blob = new Blob([contentToExport], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}, [analysis, suggestions]);


  // --- Evidence Board Handlers ---
  const handleEvidenceDragEnd: OnDragEndResponder = useCallback((result) => {
    setCaseData(prev => {
      if (!prev.analysis?.boardState) return prev;

      const { destination, source, draggableId } = result;
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return prev;

      const board = prev.analysis.boardState;
      const startColumn = board.columns[source.droppableId];
      const finishColumn = board.columns[destination.droppableId];
      
      let newBoardState: BoardState;

      if (startColumn === finishColumn) {
        const newEvidenceIds = Array.from(startColumn.evidenceIds);
        newEvidenceIds.splice(source.index, 1);
        newEvidenceIds.splice(destination.index, 0, draggableId);
        const newColumn = { ...startColumn, evidenceIds: newEvidenceIds };
        newBoardState = { ...board, columns: { ...board.columns, [newColumn.id]: newColumn } };
      } else {
        const startEvidenceIds = Array.from(startColumn.evidenceIds);
        startEvidenceIds.splice(source.index, 1);
        const newStartColumn = { ...startColumn, evidenceIds: startEvidenceIds };
        const finishEvidenceIds = Array.from(finishColumn.evidenceIds);
        finishEvidenceIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = { ...finishColumn, evidenceIds: finishEvidenceIds };
        newBoardState = { ...board, columns: { ...board.columns, [newStartColumn.id]: newStartColumn, [newFinishColumn.id]: newFinishColumn } };
      }
      return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState } };
    });
  }, []);

  const handleSaveEvidence = useCallback((evidenceData: Omit<EvidenceItem, 'id' | 'date'>, id?: string, tags?: string[]) => {
    setCaseData(prev => {
        if (!prev.analysis?.boardState) return prev;
        const board = prev.analysis.boardState;
        const currentDate = new Date().toISOString();
        if (id) { // Edit mode
            const updatedEvidence = { ...board.evidence[id], ...evidenceData, tags: tags || board.evidence[id].tags, date: currentDate };
            const newEvidenceMap = { ...board.evidence, [id]: updatedEvidence };
            const newBoardState = { ...board, evidence: newEvidenceMap, columns: board.columns }; // Corrected: Update evidence map, not columns with evidence
            return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
        } else { // Add mode
            const newId = `ev-${Date.now()}`;
            const newEvidence: EvidenceItem = { id: newId, ...evidenceData, tags: tags || [], date: currentDate };
            const newEvidenceMap = { ...board.evidence, [newId]: newEvidence };
            const uncategorizedCol = board.columns['uncategorized'];
            const newUncategorizedIds = [...uncategorizedCol.evidenceIds, newId];
            const newColumns = { ...board.columns, 'uncategorized': { ...uncategorizedCol, evidenceIds: newUncategorizedIds } };
            const newBoardState = { ...board, evidence: newEvidenceMap, columns: newColumns };
            return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
        }
    });
  }, []);

  const handleDeleteEvidence = useCallback((evidenceId: string) => {
    if (!window.confirm('Are you sure you want to delete this evidence item?')) return;
    setCaseData(prev => {
        if (!prev.analysis?.boardState) return prev;
        const board = prev.analysis.boardState;
        const newEvidenceMap = { ...board.evidence };
        delete newEvidenceMap[evidenceId];
        const newColumns = { ...board.columns };
        Object.keys(newColumns).forEach(colId => {
            const column = newColumns[colId];
            const newEvidenceIds = column.evidenceIds.filter(id => id !== evidenceId);
            newColumns[colId] = { ...column, evidenceIds: newEvidenceIds };
        });

        // Also remove from any linkedEvidenceIds in response strategies
        const newResponseStrategies = prev.analysis.responseStrategies.map(strategy => ({
            ...strategy,
            evidenceToGather: strategy.evidenceToGather.map(eToG => ({
                ...eToG,
                linkedEvidenceIds: (eToG.linkedEvidenceIds || []).filter(id => id !== evidenceId)
            }))
        }));

        const newBoardState = { ...board, evidence: newEvidenceMap, columns: newColumns };
        return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState, responseStrategies: newResponseStrategies }};
    });
  }, []);
  
  const handleRenameColumn = useCallback((columnId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setCaseData(prev => {
        if (!prev.analysis?.boardState) return prev;
        const board = prev.analysis.boardState;
        const columnToUpdate = board.columns[columnId];
        if (!columnToUpdate || columnToUpdate.title === newTitle.trim()) return prev;

        const updatedColumn = { ...columnToUpdate, title: newTitle.trim() };
        const newColumns = { ...board.columns, [columnId]: updatedColumn };
        const newBoardState = { ...board, columns: newColumns };
        return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
    });
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    setCaseData(prev => {
        if (!prev.analysis?.boardState) return prev;
        const board = prev.analysis.boardState;
        
        const columnToDelete = board.columns[columnId];
        if (!columnToDelete || columnId === 'uncategorized') return prev;

        const evidenceToMove = columnToDelete.evidenceIds;
        
        const uncategorizedCol = board.columns['uncategorized'];
        const newUncategorizedIds = [...uncategorizedCol.evidenceIds, ...evidenceToMove];
        
        const newColumns = { ...board.columns };
        delete newColumns[columnId];
        newColumns['uncategorized'] = { ...uncategorizedCol, evidenceIds: newUncategorizedIds };
        
        const newColumnOrder = board.columnOrder.filter(id => id !== columnId);
        const newBoardState = { ...board, columns: newColumns, columnOrder: newColumnOrder };

        return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
    });
  }, []);
  
  const handleAddColumn = useCallback((title: string) => {
    if (!title.trim()) return;
    setCaseData(prev => {
      if (!prev.analysis?.boardState) return prev;
      const board = prev.analysis.boardState;
      const newColumnId = `custom-col-${Date.now()}`;
      const newColumn: Column = {
        id: newColumnId,
        title: title.trim(),
        evidenceIds: [],
      };
      
      const newColumns = { ...board.columns, [newColumnId]: newColumn };
      const newColumnOrder = [...board.columnOrder, newColumnId];
      
      const newBoardState = { ...board, columns: newColumns, columnOrder: newColumnOrder };
      return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
    });
  }, []);

  const handleMoveUnstatedClaim = useCallback((claimIndex: number) => {
    setCaseData(prev => {
        if (!prev.analysis) return prev;
        const claimToMove = prev.analysis.unstatedClaims[claimIndex];
        if (!claimToMove) return prev;

        const newStatedClaim: Allegation = {
            claim: claimToMove.claim,
            summary: claimToMove.justification,
            evidenceMentioned: [],
            texasCaseExamples: claimToMove.texasCaseExamples || [],
        };

        const newUnstatedClaims = prev.analysis.unstatedClaims.filter((_, index) => index !== claimIndex);
        const newStatedAllegations = [...prev.analysis.statedAllegations, newStatedClaim];

        const board = prev.analysis.boardState;
        let newBoardState = board;
        if (board) {
            const newColumnId = `allegation-${newStatedAllegations.length - 1}`;
            const newColumn: Column = {
                id: newColumnId,
                title: newStatedClaim.claim,
                evidenceIds: [],
            };
            newBoardState = {
                ...board,
                columns: { ...board.columns, [newColumnId]: newColumn },
                columnOrder: [...board.columnOrder, newColumnId],
            };
        }
        
        const newAnalysis = {
            ...prev.analysis,
            statedAllegations: newStatedAllegations,
            unstatedClaims: newUnstatedClaims,
            boardState: newBoardState,
        };
        
        return { ...prev, analysis: newAnalysis };
    });
  }, []);

  const evidenceIdsOnBoard = useMemo(() => 
    analysis?.boardState ? new Set(Object.keys(analysis.boardState.evidence)) : new Set<string>(),
    [analysis?.boardState?.evidence]
  );

  const handleAddDiscoveredEvidenceToBoard = useCallback((discoveredEvidence: DiscoveredEvidence) => {
      setCaseData(prev => {
          if (!prev.analysis?.boardState) return prev;

          const board = prev.analysis.boardState;
          const newId = `drive-${discoveredEvidence.fileId}`;
          
          if (board.evidence[newId]) {
              console.warn(`Evidence item ${newId} already exists on the board.`);
              return prev;
          }

          const mapCategoryToType = (category: string): EvidenceItem['type'] => {
              const lowerCategory = category.toLowerCase();
              if (lowerCategory.includes('email')) return 'email';
              if (lowerCategory.includes('document') || lowerCategory.includes('review') || lowerCategory.includes('policy')) return 'document';
              return 'other';
          };

          const newEvidence: EvidenceItem = {
              id: newId,
              content: discoveredEvidence.fileName,
              description: `Justification: ${discoveredEvidence.justification}\nSource: Google Drive\nURL: ${discoveredEvidence.fileUrl}`,
              type: mapCategoryToType(discoveredEvidence.category),
              date: discoveredEvidence.createdDate,
              tags: [discoveredEvidence.category]
          };

          const newEvidenceMap = { ...board.evidence, [newId]: newEvidence };
          const uncategorizedCol = board.columns['uncategorized'];
          const newUncategorizedIds = [newId, ...uncategorizedCol.evidenceIds]; // Add to top
          const newColumns = { ...board.columns, 'uncategorized': { ...uncategorizedCol, evidenceIds: newUncategorizedIds } };
          const newBoardState = { ...board, evidence: newEvidenceMap, columns: newColumns };
          
          return { ...prev, analysis: { ...prev.analysis, boardState: newBoardState }};
      });
  }, []);

  // New: Handle linking evidence to response strategies
  const handleLinkEvidenceToStrategy = useCallback((
    strategyIndex: number,
    evidenceToGatherIndex: number,
    newLinkedIds: string[]
  ) => {
    setCaseData(prev => {
      if (!prev.analysis) return prev;
      const updatedStrategies = [...prev.analysis.responseStrategies];
      const updatedEvidenceToGather = [...updatedStrategies[strategyIndex].evidenceToGather];
      updatedEvidenceToGather[evidenceToGatherIndex] = {
        ...updatedEvidenceToGather[evidenceToGatherIndex],
        linkedEvidenceIds: newLinkedIds,
      };
      updatedStrategies[strategyIndex] = {
        ...updatedStrategies[strategyIndex],
        evidenceToGather: updatedEvidenceToGather,
      };
      return {
        ...prev,
        analysis: {
          ...prev.analysis,
          responseStrategies: updatedStrategies,
        },
      };
    });
  }, []);

  const Header: React.FC = () => (
    <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Pro Se Wrongful Termination Case Builder</h1>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 003 12c0 2.8-.845 5.43-2.348 7.653c1.026.155 2.127.247 3.25.247 3.53 0 6.786-1.577 9-4.098 2.214 2.521 5.47 4.098 9 4.098 1.123 0 2.224-.092 3.25-.247C20.845 17.43 20 14.8 20 12c0-3.15-.75-6.11-2.052-8.664z" />
                </svg>
            </div>
        </div>
    </header>
  );

  const InputSection: React.FC<{
    title: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    sectionKey: string;
    isOpen: boolean;
    onToggle: () => void;
  }> = ({ title, value, onChange, placeholder, sectionKey, isOpen, onToggle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white px-6 py-4 cursor-pointer flex justify-between items-center" onClick={onToggle}>
        {title}
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </h3>
      {isOpen && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700" id={`accordion-body-${sectionKey}`} role="region" aria-labelledby={`accordion-header-${sectionKey}`}>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={10}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label={title}
          />
        </div>
      )}
    </div>
  );

  const handleAccordionToggle = (sectionKey: string) => {
    setOpenAccordion(prev => (prev === sectionKey ? null : sectionKey));
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Case Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Provide as much detail as possible in the fields below. The more information the AI has, the more accurate and comprehensive your analysis will be.
            </p>

            <div className="space-y-4">
              <InputSection
                title="Your Complaint & Grievances"
                value={complaintText}
                onChange={(e) => setCaseData(prev => ({ ...prev, complaintText: e.target.value }))}
                placeholder="Describe your employment, the issues you faced, formal complaints, and details of your termination. Include dates, names, and specific events."
                sectionKey="complaintText"
                isOpen={openAccordion === 'complaintText'}
                onToggle={() => handleAccordionToggle('complaintText')}
              />

              <InputSection
                title="Official Job Description (Manager 1)"
                value={jobDescriptionText}
                onChange={(e) => setCaseData(prev => ({ ...prev, jobDescriptionText: e.target.value }))}
                placeholder="Paste your official job description here. This will be compared against your actual duties."
                sectionKey="jobDescriptionText"
                isOpen={openAccordion === 'jobDescriptionText'}
                onToggle={() => handleAccordionToggle('jobDescriptionText')}
              />

              <InputSection
                title="Actual Duties Performed"
                value={actualDutiesText}
                onChange={(e) => setCaseData(prev => ({ ...prev, actualDutiesText: e.target.value }))}
                placeholder="Detail your day-to-day responsibilities, projects, team size managed, and any duties that exceeded your official job description."
                sectionKey="actualDutiesText"
                isOpen={openAccordion === 'actualDutiesText'}
                onToggle={() => handleAccordionToggle('actualDutiesText')}
              />

              <InputSection
                title="Professional Profile & Character"
                value={characterProfileText}
                onChange={(e) => setCaseData(prev => ({ ...prev, characterProfileText: e.target.value }))}
                placeholder="Describe your professional history, performance reviews, awards, disciplinary record (or lack thereof), attendance, and general character. This is crucial for building a 'model employee' narrative."
                sectionKey="characterProfileText"
                isOpen={openAccordion === 'characterProfileText'}
                onToggle={() => handleAccordionToggle('characterProfileText')}
              />

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white px-6 py-4 cursor-pointer flex justify-between items-center" onClick={() => handleAccordionToggle('handbookUrl')}>
                  Employee Handbook URL (Optional)
                  <svg className={`w-5 h-5 transition-transform ${openAccordion === 'handbookUrl' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </h3>
                {openAccordion === 'handbookUrl' && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700" id="accordion-body-handbookUrl" role="region" aria-labelledby="accordion-header-handbookUrl">
                    <input
                      type="url"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={handbookUrl}
                      onChange={(e) => setCaseData(prev => ({ ...prev, handbookUrl: e.target.value }))}
                      placeholder="e.g., https://www.yourcompany.com/employee-handbook.pdf"
                      aria-label="Employee Handbook URL"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Providing a direct link to your company's employee handbook (if publicly accessible) allows the AI to analyze potential policy violations.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
              >
                {isLoading ? 'Analyzing Case...' : 'Analyze My Case'}
              </button>
               <button
                  onClick={handleClearData}
                  className="ml-4 px-4 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                  Clear All Data
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </section>

          {isLoading && <Spinner />}

          {analysis && !isLoading && (
            <section>
              <nav className="mb-8 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'analysis' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="analysis-tab"
                      type="button"
                      role="tab"
                      aria-controls="analysis"
                      aria-selected={activeTab === 'analysis'}
                      onClick={() => setActiveTab('analysis')}
                    >
                      Analysis & Strategy
                    </button>
                  </li>
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'followup' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="followup-tab"
                      type="button"
                      role="tab"
                      aria-controls="followup"
                      aria-selected={activeTab === 'followup'}
                      onClick={() => setActiveTab('followup')}
                    >
                      Follow-up Questions
                    </button>
                  </li>
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'infographics' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="infographics-tab"
                      type="button"
                      role="tab"
                      aria-controls="infographics"
                      aria-selected={activeTab === 'infographics'}
                      onClick={() => setActiveTab('infographics')}
                    >
                      Infographics
                    </button>
                  </li>
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'evidence' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="evidence-tab"
                      type="button"
                      role="tab"
                      aria-controls="evidence"
                      aria-selected={activeTab === 'evidence'}
                      onClick={() => setActiveTab('evidence')}
                    >
                      Evidence Board
                    </button>
                  </li>
                   <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'discovery' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="discovery-tab"
                      type="button"
                      role="tab"
                      aria-controls="discovery"
                      aria-selected={activeTab === 'discovery'}
                      onClick={() => setActiveTab('discovery')}
                    >
                      Drive Discovery
                    </button>
                  </li>
                  <li className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'demand' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                      id="demand-tab"
                      type="button"
                      role="tab"
                      aria-controls="demand"
                      aria-selected={activeTab === 'demand'}
                      onClick={() => setActiveTab('demand')}
                    >
                      Demand Letter
                    </button>
                  </li>
                </ul>
              </nav>

              <div id="myTabContent">
                <div className={`${activeTab === 'analysis' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="analysis-tab">
                  <AnalysisDisplay
                    analysisResults={analysis}
                    onAddInstance={handleAddInstance}
                    onDeleteInstance={handleDeleteInstance}
                    onUpdateInstanceNotes={handleUpdateInstanceNotes}
                    onAddAttachments={handleAddAttachments}
                    onDeleteAttachment={handleDeleteAttachment}
                    onGetSuggestions={handleGetSuggestions}
                    suggestions={suggestions}
                    isSuggesting={isSuggesting}
                    onMoveUnstatedClaim={handleMoveUnstatedClaim}
                    onAddDocumentRequest={handleAddDocumentRequest}
                    onUpdateDocumentRequest={handleUpdateDocumentRequest}
                    onDeleteDocumentRequest={handleDeleteDocumentRequest}
                    onExportSection={handleExportSection}
                    onUpdateUserNotes={handleUpdateUserNotes}
                    onUpdateStatedAllegationEvidenceMentioned={handleUpdateStatedAllegationEvidenceMentioned}
                    allBoardEvidence={analysis.boardState?.evidence || {}} // Pass all evidence for linking
                    onLinkEvidenceToStrategy={handleLinkEvidenceToStrategy} // Pass linking callback
                  />
                </div>
                <div className={`${activeTab === 'followup' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="followup-tab">
                  <FollowUpQuestions
                    results={analysis}
                    onGetSuggestions={handleGetSuggestions}
                    suggestions={suggestions}
                    isSuggesting={isSuggesting}
                    onExportSection={handleExportSection}
                    onUpdateUserNotes={handleUpdateUserNotes}
                  />
                </div>
                <div className={`${activeTab === 'infographics' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="infographics-tab">
                  <Infographics />
                </div>
                <div className={`${activeTab === 'evidence' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="evidence-tab">
                  <EvidenceBoard
                    board={analysis.boardState!}
                    onDragEnd={handleEvidenceDragEnd}
                    onSaveEvidence={handleSaveEvidence}
                    onDeleteEvidence={handleDeleteEvidence}
                    onRenameColumn={handleRenameColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddColumn={handleAddColumn}
                  />
                </div>
                <div className={`${activeTab === 'discovery' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="discovery-tab">
                  <DriveScanner
                    allegations={analysis.statedAllegations}
                    onAddToBoard={handleAddDiscoveredEvidenceToBoard}
                    evidenceIdsOnBoard={evidenceIdsOnBoard}
                  />
                </div>
                <div className={`${activeTab === 'demand' ? 'block' : 'hidden'}`} role="tabpanel" aria-labelledby="demand-tab">
                  <DemandLetter
                    analysisResults={analysis}
                    complaintText={complaintText}
                    jobDescriptionText={jobDescriptionText}
                    actualDutiesText={actualDutiesText}
                    characterProfileText={characterProfileText}
                    handbookUrl={handbookUrl}
                    generateLetter={generateLegalLetter}
                    letterContent={caseData.letterContent}
                    onLetterGenerated={(content) => setCaseData(prev => ({ ...prev, letterContent: content }))}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;