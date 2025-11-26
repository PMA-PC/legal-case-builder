
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { AnalysisResults, Allegation, DocumentRequest, AiSuggestion, DraftCommunication, EvidenceItem } from '../types';

interface AnalysisDisplayProps {
  analysisResults: AnalysisResults; // Renamed from 'results'
  onAddInstance: (strategyIndex: number) => void;
  onDeleteInstance: (strategyIndex: number, instanceId: string) => void;
  onUpdateInstanceNotes: (strategyIndex: number, instanceId: string, notes: string) => void;
  onAddAttachments: (strategyIndex: number, instanceId: string, files: FileList) => void;
  onDeleteAttachment: (strategyIndex: number, instanceId: string, attachmentIndex: number) => void;
  onGetSuggestions: (sectionKey: string, sectionTitle: string) => void;
  suggestions: Record<string, AiSuggestion | null>;
  isSuggesting: Record<string, boolean>;
  onMoveUnstatedClaim: (claimIndex: number) => void;
  onAddDocumentRequest: () => void;
  onUpdateDocumentRequest: (id: string, field: keyof Omit<DocumentRequest, 'id'>, value: string) => void;
  onDeleteDocumentRequest: (id: string) => void;
  onExportSection: (sectionKey: string, sectionTitle: string) => void; // New prop
  onUpdateUserNotes: (sectionKey: string, notes: string) => void; // New prop
  onUpdateStatedAllegationEvidenceMentioned: (allegationIndex: number, newEvidenceMentions: string[]) => void; // New prop
  allBoardEvidence: Record<string, EvidenceItem>; // New: All evidence from the board
  onLinkEvidenceToStrategy: (strategyIndex: number, evidenceToGatherIndex: number, newLinkedIds: string[]) => void; // New: Callback for linking evidence
}

interface SectionCardProps {
  title: string;
  sectionKey: string; // New prop for export and notes
  children: React.ReactNode;
  onGetSuggestions?: (sectionKey: string, sectionTitle: string) => void;
  suggestion?: AiSuggestion | null; // Updated type
  isSuggesting?: boolean;
  onExport?: (sectionKey: string, sectionTitle: string) => void; // New prop
  onUpdateUserNotes?: (sectionKey: string, notes: string) => void; // New prop
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title, sectionKey, children, onGetSuggestions, suggestion, isSuggesting, onExport, onUpdateUserNotes
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
      <div className="flex items-center space-x-2">
        {onExport && (
          <button
            onClick={() => onExport(sectionKey, title)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
            aria-label={`Export ${title}`}
          >
            Export
          </button>
        )}
        {onGetSuggestions && (
          <button
            onClick={() => onGetSuggestions(sectionKey, title)}
            disabled={isSuggesting}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-wait transition"
            aria-label={`AI Review & Suggest for ${title}`}
          >
            {isSuggesting ? 'Reviewing...' : 'AI Review & Suggest'}
          </button>
        )}
      </div>
    </div>
    {children}
    {isSuggesting && <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><p className="text-center text-gray-600 dark:text-gray-300">Getting suggestions...</p></div>}
    {suggestion?.suggestionText && (
      <div className="mt-4 p-4 border-t-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">AI Suggestions for Improvement</h4>
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
        >
          {suggestion.suggestionText}
        </div>
        {onUpdateUserNotes && (
          <div className="mt-4">
            <label htmlFor={`user-notes-${sectionKey}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Notes/Answers:
            </label>
            <textarea
              id={`user-notes-${sectionKey}`}
              value={suggestion.userNotes}
              onChange={(e) => onUpdateUserNotes(sectionKey, e.target.value)}
              rows={5}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add your thoughts, answers to questions, or additional details here..."
              aria-label={`Your notes for AI suggestions on ${title}`}
            />
          </div>
        )}
      </div>
    )}
  </div>
);

const FileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const CaseLawSection: React.FC<{
  examples: Allegation['texasCaseExamples'];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ examples, isOpen, onToggle }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left font-semibold text-gray-700 dark:text-gray-300"
        aria-expanded={isOpen}
      >
        <span>Top Texas Case Law Precedents</span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 pl-2 border-l-2 border-blue-500">
          <ul className="space-y-4">
            {examples.map((example, i) => (
              <li key={i} className="text-sm bg-white dark:bg-gray-800 p-3 rounded-md">
                <p className="font-bold text-gray-800 dark:text-gray-200">{example.caseName}</p>
                <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong className="text-gray-700 dark:text-gray-300">Primary Complaint:</strong> {example.primaryComplaint}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Outcome:</strong> {example.outcome}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Relevance:</strong> {example.relevance}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
    analysisResults, // Renamed from 'results'
    onAddInstance,
    onDeleteInstance,
    onUpdateInstanceNotes,
    onAddAttachments,
    onDeleteAttachment,
    onGetSuggestions,
    suggestions,
    isSuggesting,
    onMoveUnstatedClaim,
    onAddDocumentRequest,
    onUpdateDocumentRequest,
    onDeleteDocumentRequest,
    onExportSection,
    onUpdateUserNotes,
    onUpdateStatedAllegationEvidenceMentioned, // New prop
    allBoardEvidence, // New prop
    onLinkEvidenceToStrategy, // New prop
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentTarget, setAttachmentTarget] = useState<{ strategyIndex: number; instanceId: string } | null>(null);
  const [openCaseLaw, setOpenCaseLaw] = useState<Record<string, boolean>>({});

  const toggleCaseLaw = (key: string) => {
    setOpenCaseLaw(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAttachClick = (strategyIndex: number, instanceId: string) => {
    setAttachmentTarget({ strategyIndex, instanceId });
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (attachmentTarget && event.target.files?.length) {
      onAddAttachments(attachmentTarget.strategyIndex, attachmentTarget.instanceId, event.target.files);
    }
    event.target.value = '';
    setAttachmentTarget(null);
  };

  const collectAllAttachments = useCallback((analysis: AnalysisResults): string[] => {
    const attachmentNames: Set<string> = new Set();
    if (analysis?.responseStrategies) {
      analysis.responseStrategies.forEach(strategy => {
        strategy.instances.forEach(instance => {
          instance.attachments.forEach(attachment => {
            attachmentNames.add(attachment.name);
          });
        });
      });
    }
    return Array.from(attachmentNames);
  }, []);

  // Define attachmentNote here, using collectAllAttachments
  const attachmentNote = useMemo(() => {
    const allAttachments = collectAllAttachments(analysisResults);
    if (allAttachments.length > 0) {
      return `\n\n--- NOTE: The following documents were identified as relevant and should be manually attached. Please ensure they are included with this communication. ---\n${allAttachments.map(name => `- ${name}`).join('\n')}\n`;
    }
    return `\n\n--- NOTE: No specific attachments identified for this communication, but review your evidence board for relevant documents. ---\n`;
  }, [analysisResults, collectAllAttachments]);

  const handleExportDraftCommunication = (draft: DraftCommunication) => {
    let bodyWithAttachments = draft.body;
    const placeholderRegex = /\[\s*(ATTACHMENTS|DOCUMENTS|EVIDENCE|ATTACHMENT LIST)\s*\]/gi;
    
    // Check if any placeholder exists in the body
    if (placeholderRegex.test(draft.body)) {
        // Replace the first occurrence of a placeholder with the attachment note
        bodyWithAttachments = draft.body.replace(placeholderRegex, attachmentNote);
    } else {
        // If no explicit placeholder, append the note to the end of the body
        bodyWithAttachments += attachmentNote;
    }

    const contentToExport = `Subject: ${draft.subject}\n\n${bodyWithAttachments}`;

    const fileName = `${draft.purpose.replace(/[^a-zA-Z0-9]/g, '_')}_${draft.type}.txt`;
    const blob = new Blob([contentToExport], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  return (
    <div className="space-y-8 mt-8">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <SectionCard
        title="Stated Allegations Summary"
        sectionKey="statedAllegations"
        onGetSuggestions={onGetSuggestions}
        suggestion={suggestions.statedAllegations}
        isSuggesting={isSuggesting.statedAllegations}
        onExport={onExportSection}
        onUpdateUserNotes={onUpdateUserNotes}
      >
        <ul className="space-y-4">
          {analysisResults.statedAllegations.map((item, index) => (
            <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">{item.claim}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{item.summary}</p>
              
              <div className="mt-3">
                <label htmlFor={`evidence-mentioned-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Evidence Mentioned (one item per line):
                </label>
                <textarea
                    id={`evidence-mentioned-${index}`}
                    value={item.evidenceMentioned.join('\n')}
                    onChange={(e) => onUpdateStatedAllegationEvidenceMentioned(index, e.target.value.split('\n'))}
                    rows={Math.max(3, item.evidenceMentioned.length + 1)} // Ensure minimum 3 rows, grows with content
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Email from Manager on 2024-01-10, Performance Review Q4 2023"
                    aria-label={`Evidence mentioned for ${item.claim}`}
                />
              </div>
               <CaseLawSection
                examples={item.texasCaseExamples}
                isOpen={!!openCaseLaw[`stated-${index}`]}
                onToggle={() => toggleCaseLaw(`stated-${index}`)}
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Potential Unstated Claims Identified by AI"
        sectionKey="unstatedClaims"
        onGetSuggestions={onGetSuggestions}
        suggestion={suggestions.unstatedClaims}
        isSuggesting={isSuggesting.unstatedClaims}
        onExport={onExportSection}
        onUpdateUserNotes={onUpdateUserNotes}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The AI has analyzed your narrative for potential legal claims you may not have explicitly stated. Review these possibilities with a legal professional.</p>
        <ul className="space-y-4">
          {analysisResults.unstatedClaims.map((item, index) => (
            <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.claim}</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    <span className="font-bold">Justification:</span> {item.justification}
                  </p>
                </div>
                <button
                  onClick={() => onMoveUnstatedClaim(index)}
                  className="ml-4 flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-md hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900 transition"
                  aria-label={`Add ${item.claim} as a stated claim`}
                >
                  Add as Stated Claim
                </button>
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">
                Action: Research specific Texas case law that directly supports this claim. Articulate how the facts from your complaint align with the legal precedent established by these cases.
              </p>
              <CaseLawSection
                examples={item.texasCaseExamples}
                isOpen={!!openCaseLaw[`unstated-${index}`]}
                onToggle={() => toggleCaseLaw(`unstated-${index}`)}
              />
            </li>
          ))}
        </ul>
      </SectionCard>
      
      <SectionCard
        title="Handbook Policy Violation Analysis"
        sectionKey="handbookPolicyViolations"
        onGetSuggestions={onGetSuggestions}
        suggestion={suggestions.handbookPolicyViolations}
        isSuggesting={isSuggesting.handbookPolicyViolations}
        onExport={onExportSection}
        onUpdateUserNotes={onUpdateUserNotes}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The AI has analyzed the employee handbook against your case details. Use these identified policy violations to show the company failed to follow its own rules.</p>
        <ul className="space-y-4">
          {analysisResults.handbookPolicyViolations.map((item, index) => (
            <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-cyan-500">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.policyName}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reference: {item.handbookSection}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{item.violationSummary}</p>
              <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-2">
                <span className="font-bold">Supports Allegation:</span> {item.relatedAllegation}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>

      {analysisResults.goodFaithConferenceGuide && (
        <SectionCard
          title="Good Faith Conference & Discovery Guide"
          sectionKey="goodFaithConferenceGuide"
          onGetSuggestions={onGetSuggestions}
          suggestion={suggestions.goodFaithConferenceGuide}
          isSuggesting={isSuggesting.goodFaithConferenceGuide}
          onExport={onExportSection}
          onUpdateUserNotes={onUpdateUserNotes}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{analysisResults.goodFaithConferenceGuide.introduction}</p>
          
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Discussion Topics:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {analysisResults.goodFaithConferenceGuide.keyTopics.map((topic, i) => <li key={i}>{topic}</li>)}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Document Request List</h4>
             <ul className="space-y-4">
              {analysisResults.goodFaithConferenceGuide.documentRequests.map((req) => (
                <li key={req.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600 relative group">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Category</label>
                      <input
                        type="text"
                        value={req.category}
                        onChange={(e) => onUpdateDocumentRequest(req.id!, 'category', e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Your Personnel File"
                      />
                    </div>
                     <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Item</label>
                      <textarea
                        value={req.item}
                        onChange={(e) => onUpdateDocumentRequest(req.id!, 'item', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Specific document or item being requested"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Rationale</label>
                      <textarea
                        value={req.rationale}
                        onChange={(e) => onUpdateDocumentRequest(req.id!, 'rationale', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Reason why this document is relevant and necessary"
                      />
                    </div>
                  </div>
                  <button onClick={() => onDeleteDocumentRequest(req.id!)} className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete document request">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </li>
              ))}
            </ul>
             <button onClick={onAddDocumentRequest} className="mt-4 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                + Add Document Request
            </button>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Draft Communications:</h4>
            <div className="space-y-4">
              {analysisResults.goodFaithConferenceGuide.draftCommunications.map((draft, i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">{draft.purpose} ({draft.type})</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{draft.subject}</p>
                  <pre className="whitespace-pre-wrap font-sans text-sm p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">{draft.body}</pre>
                  <button
                    onClick={() => handleExportDraftCommunication(draft)}
                    className="mt-3 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    Export {draft.type}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Recommended Strategies & Evidence"
        sectionKey="responseStrategies"
        onGetSuggestions={onGetSuggestions}
        suggestion={suggestions.responseStrategies}
        isSuggesting={isSuggesting.responseStrategies}
        onExport={onExportSection}
        onUpdateUserNotes={onUpdateUserNotes}
      >
         <ul className="space-y-6">
          {analysisResults.responseStrategies.map((item, strategyIndex) => (
            <li key={strategyIndex} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-semibold text-green-600 dark:text-green-400">{item.claim}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2"><span className="font-bold">Strategy:</span> {item.strategy}</p>

              {item.potentialCounterArguments && item.potentialCounterArguments.length > 0 && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md border-l-4 border-orange-500">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mr-2 text-orange-600 dark:text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Anticipate Employer's Defense</p>
                  </div>
                  <ul className="list-disc list-inside text-sm text-orange-700 dark:text-orange-200 space-y-1 mt-2 ml-2">
                    {item.potentialCounterArguments.map((arg, i) => <li key={i}>{arg}</li>)}
                  </ul>
                </div>
              )}
              
              {item.rebuttals && item.rebuttals.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-md border-l-4 border-green-500">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-bold text-green-800 dark:text-green-300">Your Rebuttals</p>
                  </div>
                  <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-200 space-y-1 mt-2 ml-2">
                    {item.rebuttals.map((rebuttal, i) => <li key={i}>{rebuttal}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Action Steps:</p>
                  <ul className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                    {item.suggestedActionSteps.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
              </div>

               <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Evidence to Gather:</p>
                  <ul className="space-y-3 mt-2">
                    {item.evidenceToGather.map((evidenceItem, evidenceToGatherIndex) => {
                        // Ensure the `value` prop for a multiple select is an array of strings.
                        const currentLinkedEvidenceIds: string[] = evidenceItem.linkedEvidenceIds ?? [];
                        return (
                        <li key={evidenceToGatherIndex} className="p-3 bg-white dark:bg-gray-800 rounded-md border-l-4 border-green-500">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{evidenceItem.item}</p>
                            <p className="text-xs italic text-gray-500 dark:text-gray-400">Potential Source: {evidenceItem.potentialSource}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{evidenceItem.rationale}</p>

                            <div className="mt-3">
                                <label htmlFor={`linked-evidence-${strategyIndex}-${evidenceToGatherIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link Evidence from Board:
                                </label>
                                <select
                                    id={`linked-evidence-${strategyIndex}-${evidenceToGatherIndex}`}
                                    multiple
                                    value={currentLinkedEvidenceIds}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        // Fix: Explicitly type `option` as `HTMLOptionElement`
                                        const selectedOptions = Array.from(e.target.selectedOptions).map((option: HTMLOptionElement) => option.value);
                                        onLinkEvidenceToStrategy(strategyIndex, evidenceToGatherIndex, selectedOptions);
                                    }}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    aria-label={`Link evidence for ${evidenceItem.item}`}
                                >
                                    {Object.values(allBoardEvidence).map((boardItem: EvidenceItem) => (
                                        <option key={boardItem.id} value={boardItem.id}>
                                            {boardItem.content} ({boardItem.type})
                                        </option>
                                    ))}
                                </select>
                                {(evidenceItem.linkedEvidenceIds || []).length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        Currently linked: {(evidenceItem.linkedEvidenceIds || [])
                                            .map(id => allBoardEvidence[id]?.content || `Unknown Evidence (${id})`)
                                            .join(', ')}
                                    </div>
                                )}
                            </div>
                        </li>
                    )})}
                  </ul>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">My Notes & Evidence Examples</h5>
                  {item.instances.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No examples added yet. Click "Add Example" to start documenting.</p>
                  )}
                  <div className="space-y-4 mt-2">
                      {item.instances.map((instance) => (
                          <div key={instance.id} className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                              <textarea
                                  value={instance.notes}
                                  onChange={(e) => onUpdateInstanceNotes(strategyIndex, instance.id, e.target.value)}
                                  rows={3}
                                  className="mt-1 block w-full border border-gray-300 dark:border-gray-500 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700 text-sm"
                                  placeholder="Add notes for this example..."
                              />
                              <div className="mt-3">
                                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</h6>
                                  {instance.attachments.length === 0 ? (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No files attached.</p>
                                  ) : (
                                      <ul className="mt-2 space-y-1">
                                          {instance.attachments.map((file, fileIndex) => (
                                              <li key={fileIndex} className="flex items-center justify-between text-sm p-1 rounded bg-gray-100 dark:bg-gray-700/50">
                                                  <div className="flex items-center space-x-2 truncate">
                                                      <FileIcon />
                                                      <span className="truncate" title={file.name}>{file.name}</span>
                                                  </div>
                                                  <button onClick={() => onDeleteAttachment(strategyIndex, instance.id, fileIndex)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500" aria-label="Delete attachment">
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                  </button>
                                              </li>
                                          ))}
                                      </ul>
                                  )}
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                  <button onClick={() => handleAttachClick(strategyIndex, instance.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                      Attach File
                                  </button>
                                  <button onClick={() => onDeleteInstance(strategyIndex, instance.id)} className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                      Delete Example
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => onAddInstance(strategyIndex)} className="mt-4 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                      + Add Example
                  </button>
                </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
};

export default AnalysisDisplay;
