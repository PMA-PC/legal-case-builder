// App.tsx - Main Application Component

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import {
  AnalysisResults,
  Allegation,
  CaseData,
  ConversationMessage,
  EvidenceItem,
  BoardState,
  Column,
  AISessionState,
  SuggestedClaim,
  DefenseSimulation,
  DemandLetter,
  AiSuggestion
} from './types';
import {
  analyzeCase,
  continueAllegationConversation,
  validateEvidence,
  simulateDefense,
  discoverUnstatedClaims,
  generateDemandLetterSection,
  getImprovementSuggestions
} from './services/geminiService';

// Component imports (will be created next)
import Spinner from './components/Spinner';
import InputStage from './components/InputStage';
import AllegationInvestigator from './components/AllegationInvestigator';
import EvidenceBoard from './components/EvidenceBoard';
import StrategyDashboard from './components/StrategyDashboard';
import ConferencePrep from './components/ConferencePrep';
import DemandLetterBuilder from './components/DemandLetterBuilder';

const LOCAL_STORAGE_KEY = 'proSeLegalSupport_v1';

const initialCaseData: CaseData = {
  analysis: null,
  complaintText: '',
  jobDescriptionText: '',
  actualDutiesText: '',
  characterProfileText: '',
  handbookUrl: '',
  suggestions: {},
  letterContent: null,
  conversationHistory: []
};

const initialBoardState: BoardState = {
  evidence: {},
  columns: {
    'uncategorized': { id: 'uncategorized', title: 'Uncategorized Evidence', evidenceIds: [] },
    'strong': { id: 'strong', title: 'Strong Evidence', evidenceIds: [] },
    'needs-validation': { id: 'needs-validation', title: 'Needs Validation', evidenceIds: [] },
    'supplementary': { id: 'supplementary', title: 'Supplementary', evidenceIds: [] }
  },
  columnOrder: ['uncategorized', 'strong', 'needs-validation', 'supplementary']
};

type AppStage = 'input' | 'analyzing' | 'investigation' | 'evidence' | 'strategy' | 'conference' | 'letter';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('input');
  const [caseData, setCaseData] = useState<CaseData>(initialCaseData);
  const [board, setBoard] = useState<BoardState>(initialBoardState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // AI Session State
  const [aiSession, setAiSession] = useState<AISessionState>({
    currentAllegationId: null,
    investigationMode: 'overview',
    pendingQuestions: [],
    discoveredClaims: []
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCaseData(parsed.caseData || initialCaseData);
        setBoard(parsed.board || initialBoardState);
        setStage(parsed.stage || 'input');
      }
    } catch (err) {
      console.error("Error loading saved data:", err);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        caseData,
        board,
        stage
      }));
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [caseData, board, stage]);

  /**
   * STAGE 1: Initial Analysis
   */
  const handleInitialAnalysis = useCallback(async () => {
    if (!caseData.complaintText.trim()) {
      setError("Please provide your case details before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStage('analyzing');

    try {
      const results = await analyzeCase(
        caseData.complaintText,
        caseData.jobDescriptionText,
        caseData.actualDutiesText,
        caseData.characterProfileText,
        caseData.handbookUrl
      );

      if (results) {
        // Initialize board with allegations as columns
        const newColumns: { [key: string]: Column } = { ...initialBoardState.columns };
        const newColumnOrder = [...initialBoardState.columnOrder];

        results.statedAllegations.forEach((allegation, index) => {
          const colId = `allegation-${allegation.id}`;
          newColumns[colId] = {
            id: colId,
            title: allegation.claim,
            evidenceIds: []
          };
          newColumnOrder.push(colId);
        });

        setBoard({
          evidence: {},
          columns: newColumns,
          columnOrder: newColumnOrder
        });

        setCaseData(prev => ({ ...prev, analysis: results }));
        setStage('investigation');
      } else {
        setError("Failed to analyze the case. Please check the AI service configuration.");
        setStage('input');
      }
    } catch (err) {
      setError("An unexpected error occurred during analysis.");
      console.error(err);
      setStage('input');
    } finally {
      setIsLoading(false);
    }
  }, [caseData]);

  /**
   * STAGE 2: Interactive Investigation of Each Allegation
   */
  const handleContinueConversation = useCallback(async (
    allegationId: string,
    userMessage: string
  ) => {
    if (!caseData.analysis) return;

    const allegation = caseData.analysis.statedAllegations.find(a => a.id === allegationId);
    if (!allegation) return;

    setIsLoading(true);

    try {
      const conversation = allegation.conversation || [];
      
      const result = await continueAllegationConversation(
        allegation,
        userMessage,
        conversation,
        caseData.complaintText
      );

      if (result) {
        const newMessage: ConversationMessage = {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString()
        };

        const aiMessage: ConversationMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'ai',
          content: result.aiResponse,
          timestamp: new Date().toISOString(),
          followUpQuestions: result.followUpQuestions
        };

        setCaseData(prev => {
          if (!prev.analysis) return prev;
          
          const updatedAllegations = prev.analysis.statedAllegations.map(a => {
            if (a.id === allegationId) {
              return {
                ...a,
                conversation: [...(a.conversation || []), newMessage, aiMessage],
                strengthScore: result.updatedStrength || a.strengthScore
              };
            }
            return a;
          });

          return {
            ...prev,
            analysis: {
              ...prev.analysis,
              statedAllegations: updatedAllegations
            },
            conversationHistory: [...prev.conversationHistory, newMessage, aiMessage]
          };
        });
      }
    } catch (err) {
      console.error("Error continuing conversation:", err);
      setError("Failed to continue conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [caseData]);

  /**
   * Evidence Management
   */
  const handleSaveEvidence = useCallback((evidenceData: Omit<EvidenceItem, 'id' | 'date'>, id?: string, tags?: string[]) => {
    const evidenceId = id || `ev-${Date.now()}`;
    const date = id && board.evidence[id] ? board.evidence[id].date : new Date().toISOString();
    
    const newEvidence: EvidenceItem = {
      ...evidenceData,
      id: evidenceId,
      date,
      tags: tags || [],
      linkedAllegations: evidenceData.linkedAllegations || [],
      validationStatus: evidenceData.validationStatus || 'pending'
    };

    setBoard(prev => {
      const newEvidenceMap = { ...prev.evidence, [evidenceId]: newEvidence };
      
      // If new evidence, add to uncategorized
      if (!id) {
        const uncategorized = prev.columns['uncategorized'];
        const newColumns = {
          ...prev.columns,
          'uncategorized': {
            ...uncategorized,
            evidenceIds: [...uncategorized.evidenceIds, evidenceId]
          }
        };
        return { ...prev, evidence: newEvidenceMap, columns: newColumns };
      }
      
      return { ...prev, evidence: newEvidenceMap };
    });
  }, [board]);

  const handleValidateEvidence = useCallback(async (evidenceId: string, allegationId: string) => {
    if (!caseData.analysis) return;

    const evidence = board.evidence[evidenceId];
    const allegation = caseData.analysis.statedAllegations.find(a => a.id === allegationId);
    
    if (!evidence || !allegation) return;

    setIsLoading(true);

    try {
      const validation = await validateEvidence(
        evidence,
        allegation,
        Object.values(board.evidence)
      );

      if (validation) {
        setBoard(prev => ({
          ...prev,
          evidence: {
            ...prev.evidence,
            [evidenceId]: {
              ...prev.evidence[evidenceId],
              validationStatus: validation.status,
              validationNotes: validation.notes
            }
          }
        }));
      }
    } catch (err) {
      console.error("Error validating evidence:", err);
    } finally {
      setIsLoading(false);
    }
  }, [board, caseData]);

  /**
   * Defense Simulation
   */
  const handleSimulateDefense = useCallback(async (allegationId: string) => {
    if (!caseData.analysis) return;

    const allegation = caseData.analysis.statedAllegations.find(a => a.id === allegationId);
    if (!allegation) return;

    setIsLoading(true);

    try {
      const linkedEvidence = Object.values(board.evidence).filter(e =>
        e.linkedAllegations.includes(allegationId)
      );

      const simulation = await simulateDefense(
        allegation,
        linkedEvidence,
        caseData.complaintText
      );

      if (simulation) {
        setCaseData(prev => {
          if (!prev.analysis) return prev;

          const updatedStrategies = prev.analysis.responseStrategies.map(s => {
            if (s.claim === allegation.claim) {
              return { ...s, defenseSimulation: simulation };
            }
            return s;
          });

          return {
            ...prev,
            analysis: {
              ...prev.analysis,
              responseStrategies: updatedStrategies
            }
          };
        });
      }
    } catch (err) {
      console.error("Error simulating defense:", err);
    } finally {
      setIsLoading(false);
    }
  }, [caseData, board]);

  /**
   * Discover Additional Claims
   */
  const handleDiscoverClaims = useCallback(async () => {
    if (!caseData.analysis) return;

    setIsLoading(true);

    try {
      const newClaims = await discoverUnstatedClaims(
        caseData.complaintText,
        caseData.analysis.statedAllegations,
        caseData.conversationHistory
      );

      setAiSession(prev => ({
        ...prev,
        discoveredClaims: newClaims
      }));
    } catch (err) {
      console.error("Error discovering claims:", err);
    } finally {
      setIsLoading(false);
    }
  }, [caseData]);

  /**
   * Drag and Drop Handler
   */
  const handleDragEnd: OnDragEndResponder = useCallback((result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    setBoard(prev => {
      const startColumn = prev.columns[source.droppableId];
      const finishColumn = prev.columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newEvidenceIds = Array.from(startColumn.evidenceIds);
        newEvidenceIds.splice(source.index, 1);
        newEvidenceIds.splice(destination.index, 0, draggableId);

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [startColumn.id]: { ...startColumn, evidenceIds: newEvidenceIds }
          }
        };
      }

      const startEvidenceIds = Array.from(startColumn.evidenceIds);
      startEvidenceIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, evidenceIds: startEvidenceIds };

      const finishEvidenceIds = Array.from(finishColumn.evidenceIds);
      finishEvidenceIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = { ...finishColumn, evidenceIds: finishEvidenceIds };

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn
        }
      };
    });
  }, []);

  /**
   * Clear All Data
   */
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data and start over? This cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCaseData(initialCaseData);
      setBoard(initialBoardState);
      setStage('input');
      setError(null);
      setAiSession({
        currentAllegationId: null,
        investigationMode: 'overview',
        pendingQuestions: [],
        discoveredClaims: []
      });
    }
  };

  // Render appropriate stage
  const renderStage = () => {
    switch (stage) {
      case 'input':
        return (
          <InputStage
            caseData={caseData}
            onUpdate={(updates) => setCaseData(prev => ({ ...prev, ...updates }))}
            onAnalyze={handleInitialAnalysis}
            isLoading={isLoading}
            error={error}
          />
        );

      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center p-12">
            <Spinner />
            <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white">
              Analyzing Your Case...
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our AI is conducting a comprehensive legal analysis. This may take a moment.
            </p>
          </div>
        );

      case 'investigation':
        return (
          <AllegationInvestigator
            allegations={caseData.analysis?.statedAllegations || []}
            onContinueConversation={handleContinueConversation}
            onSimulateDefense={handleSimulateDefense}
            onProceedToEvidence={() => setStage('evidence')}
            isLoading={isLoading}
          />
        );

      case 'evidence':
        return (
          <EvidenceBoard
            board={board}
            allegations={caseData.analysis?.statedAllegations || []}
            onDragEnd={handleDragEnd}
            onSaveEvidence={handleSaveEvidence}
            onValidateEvidence={handleValidateEvidence}
            onProceedToStrategy={() => setStage('strategy')}
          />
        );

      case 'strategy':
        return (
          <StrategyDashboard
            analysis={caseData.analysis!}
            board={board}
            onDiscoverClaims={handleDiscoverClaims}
            discoveredClaims={aiSession.discoveredClaims}
            onProceedToConference={() => setStage('conference')}
          />
        );

      case 'conference':
        return (
          <ConferencePrep
            analysis={caseData.analysis!}
            onProceedToLetter={() => setStage('letter')}
          />
        );

      case 'letter':
        return (
          <DemandLetterBuilder
            analysis={caseData.analysis!}
            caseData={caseData}
            onGenerateSection={generateDemandLetterSection}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pro Se Legal Support System
              </h1>
            </div>
            
            {stage !== 'input' && (
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Start Over
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          {stage !== 'input' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                {['Input', 'Investigation', 'Evidence', 'Strategy', 'Conference', 'Letter'].map((label, index) => {
                  const stages: AppStage[] = ['input', 'investigation', 'evidence', 'strategy', 'conference', 'letter'];
                  const currentIndex = stages.indexOf(stage);
                  const isActive = index === currentIndex;
                  const isComplete = index < currentIndex;

                  return (
                    <div key={label} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isActive ? 'bg-blue-600 text-white' :
                        isComplete ? 'bg-green-600 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {isComplete ? '✓' : index + 1}
                      </div>
                      <span className={`ml-2 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                      {index < 5 && <div className="w-12 h-0.5 mx-2 bg-gray-300" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStage()}
      </main>
    </div>
  );
};

export default App;