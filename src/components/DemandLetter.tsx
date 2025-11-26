

import React, { useState, useEffect, useCallback } from 'react';
import Spinner from './Spinner';
import { AnalysisResults } from '../types';

interface DemandLetterProps {
  analysisResults: AnalysisResults;
  complaintText: string;
  jobDescriptionText: string;
  actualDutiesText: string;
  characterProfileText: string;
  handbookUrl: string;
  generateLetter: (analysis: AnalysisResults, complaint: string, jobDescription: string, actualDuties: string, characterProfile: string, handbookUrl: string, tone: 'demand' | 'settlement') => Promise<string | null>;
  letterContent: string | null; // New prop to receive and display external letter content
  onLetterGenerated: (content: string) => void; // Callback to update parent state
}

const DemandLetter: React.FC<DemandLetterProps> = ({ analysisResults, complaintText, jobDescriptionText, actualDutiesText, characterProfileText, handbookUrl, generateLetter, letterContent, onLetterGenerated }) => {
  const [letter, setLetter] = useState<string | null>(letterContent); // Initialize with prop
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<'demand' | 'settlement'>('demand');

  useEffect(() => {
    setLetter(letterContent); // Update local state if parent letterContent changes
  }, [letterContent]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setLetter(null); // Clear previous letter when regenerating
    try {
      const result = await generateLetter(analysisResults, complaintText, jobDescriptionText, actualDutiesText, characterProfileText, handbookUrl, tone);
      if (result) {
        setLetter(result);
        onLetterGenerated(result); // Call callback to update App.tsx state
      } else {
        setError('Failed to generate the letter. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Attachments collection logic (same as in AnalysisDisplay)
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

  const handleExportGeneratedLetter = () => {
    if (!letter) {
      alert("No letter generated to export.");
      return;
    }

    const allAttachments = collectAllAttachments(analysisResults);
    const attachmentListText = allAttachments.length > 0
        ? allAttachments.map(name => `- ${name}`).join('\n')
        : `- No specific attachments identified for this communication, but review your evidence board for relevant documents -`;

    const attachmentNote = `\n\n--- NOTE: The following documents were identified as relevant and should be manually attached. Please ensure they are included with this communication. ---\n${attachmentListText}\n`;

    let contentToExport = letter;
    const placeholderRegex = /\[\s*(ATTACHMENTS|DOCUMENTS|EVIDENCE|ATTACHMENT LIST)\s*\]/gi;

    if (placeholderRegex.test(letter)) {
        contentToExport = letter.replace(placeholderRegex, attachmentNote);
    } else {
        contentToExport += attachmentNote;
    }

    const fileName = `${tone === 'demand' ? 'Demand_Letter' : 'Settlement_Proposal'}.txt`;
    const blob = new Blob([contentToExport], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleCopyToClipboard = () => {
    if (letter) {
      navigator.clipboard.writeText(letter).then(() => {
        alert('Letter copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy letter.');
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Draft Your Formal Letter</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">
        Select a tone, then generate a professional letter based on your case analysis. Review and edit the draft carefully before sending.
      </p>

      <div className="max-w-md mx-auto">
        <div role="radiogroup" aria-label="Select letter tone" className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1 mb-6 text-center">
            <button role="radio" aria-checked={tone === 'demand'} onClick={() => setTone('demand')} className={`w-full px-3 py-2 text-sm font-medium rounded-md transition ${tone === 'demand' ? 'bg-white dark:bg-gray-900 shadow text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
                <span className="font-bold">Use Demand Tone</span>
                <span className="block text-xs">Formal, assertive, and ready to litigate.</span>
            </button>
            <button role="radio" aria-checked={tone === 'settlement'} onClick={() => setTone('settlement')} className={`w-full px-3 py-2 text-sm font-medium rounded-md transition ${tone === 'settlement' ? 'bg-white dark:bg-gray-900 shadow text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
                <span className="font-bold">Use Settlement Tone</span>
                <span className="block text-xs">Courteous, cooperative, seeks early resolution.</span>
            </button>
        </div>
      </div>

      {!letter && !isLoading && (
        <div className="text-center py-8">
          <button
            onClick={handleGenerate}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Generate Draft Letter
          </button>
        </div>
      )}

      {isLoading && <Spinner />}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {letter && (
        <div>
          <div className="prose prose-lg dark:prose-invert max-w-none p-6 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50 whitespace-pre-wrap font-serif">
            {letter}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
             <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
             >
                {isLoading ? 'Regenerating...' : 'Regenerate'}
             </button>
             <button
                onClick={handleExportGeneratedLetter} // Changed to local export handler
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
             >
                Export Letter
             </button>
             <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
             >
                Copy to Clipboard
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandLetter;