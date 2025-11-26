import React, { useState, useEffect, useCallback } from 'react';
import { initClient, signIn, signOut, listFiles, getFileContent } from '../services/googleDriveService';
import { analyzeFileForRelevance } from '../services/geminiService';
import { Allegation, DiscoveredEvidence } from '../types';
import EvidenceTimeline from './EvidenceTimeline';

interface DriveScannerProps {
  allegations: Allegation[];
  onAddToBoard: (evidence: DiscoveredEvidence) => void;
  evidenceIdsOnBoard: Set<string>;
}

const DriveScanner: React.FC<DriveScannerProps> = ({ allegations, onAddToBoard, evidenceIdsOnBoard }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ processed: 0, total: 0 });
  const [discoveredEvidence, setDiscoveredEvidence] = useState<DiscoveredEvidence[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [keywords, setKeywords] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [view, setView] = useState<'list' | 'timeline'>('list');

  useEffect(() => {
    initClient((signedIn) => {
      setIsSignedIn(signedIn);
      setIsInitializing(false);
    });
  }, []);

  const handleAuthClick = () => {
    if (isInitializing) return;
    if (isSignedIn) {
      signOut(() => setIsSignedIn(false));
    } else {
      signIn();
    }
  };

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    setDiscoveredEvidence([]);
    setScanProgress({ processed: 0, total: 0 });

    try {
      const files = await listFiles(50, keywords, startDate, endDate);
      if (!files || files.length === 0) {
        setError("No relevant files (Google Docs, PDFs) found with the current search criteria in your Google Drive.");
        setIsScanning(false);
        return;
      }

      setScanProgress({ processed: 0, total: files.length });
      const foundEvidence: DiscoveredEvidence[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setScanProgress(prev => ({ ...prev, processed: i + 1 }));

        const content = await getFileContent(file.id, file.mimeType);
        if (content) {
          const analysisResult = await analyzeFileForRelevance(content, allegations);
          if (analysisResult?.isRelevant) {
            foundEvidence.push({
              fileId: file.id,
              fileName: file.name,
              fileUrl: file.webViewLink,
              createdDate: file.createdTime,
              relevanceType: analysisResult.relevanceType,
              specificAllegation: analysisResult.specificAllegation,
              proactiveCategory: analysisResult.proactiveCategory,
              justification: analysisResult.justification,
              category: analysisResult.category,
            });
          }
        }
      }
      setDiscoveredEvidence(foundEvidence);
    } catch (err: any) {
      setError(`An error occurred during the scan: ${err.message}`);
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  }, [allegations, keywords, startDate, endDate]);
  
  const groupEvidence = (evidenceList: DiscoveredEvidence[]) => 
    evidenceList.reduce((acc, evidence) => {
        const key = evidence.specificAllegation || evidence.proactiveCategory || 'Uncategorized';
        (acc[key] = acc[key] || []).push(evidence);
        return acc;
    }, {} as Record<string, DiscoveredEvidence[]>);

  const specificGroups = groupEvidence(discoveredEvidence.filter(e => e.relevanceType === 'specific'));
  const proactiveGroups = groupEvidence(discoveredEvidence.filter(e => e.relevanceType === 'proactive'));


  const EvidenceItemCard: React.FC<{item: DiscoveredEvidence}> = ({ item }) => {
    const isSpecific = item.relevanceType === 'specific';
    const badgeText = isSpecific ? 'Direct Evidence' : item.proactiveCategory;
    const badgeColorClasses = isSpecific 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    const itemBgColorClasses = isSpecific
        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
        : 'bg-purple-50 dark:bg-purple-900/30 border-purple-500';
    
    const isAlreadyOnBoard = evidenceIdsOnBoard.has(`drive-${item.fileId}`);

    return (
    <li className={`p-4 rounded-lg border-l-4 ${itemBgColorClasses}`}>
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
            <div className="flex items-center space-x-3 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-gray-200 hover:underline truncate" title={item.fileName}>
                {item.fileName}
                </a>
            </div>
            {badgeText && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${badgeColorClasses}`}>
                    {badgeText}
                </span>
            )}
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-700 dark:text-gray-200">Justification:</strong> {item.justification}</p>
        <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>Category: <span className="font-medium">{item.category}</span></span>
                <span className="ml-4">Created: {new Date(item.createdDate).toLocaleDateString()}</span>
            </div>
            {isAlreadyOnBoard ? (
                <span className="inline-flex items-center text-xs font-semibold text-green-700 dark:text-green-300">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    On Board
                </span>
            ) : (
                <button 
                    onClick={() => onAddToBoard(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    aria-label={`Add ${item.fileName} to evidence board`}
                >
                    + Add to Board
                </button>
            )}
        </div>
    </li>
    );
  };

  const ListView = () => {
    const specificGroupKeys = Object.keys(specificGroups).sort();
    const proactiveGroupKeys = Object.keys(proactiveGroups).sort();

    return (
        <div className="mt-8 space-y-6">
            {specificGroupKeys.map((groupName) => (
                <div key={groupName}>
                    <h5 className="font-bold text-blue-600 dark:text-blue-400">
                        Allegation: {groupName}
                    </h5>
                    <ul className="mt-2 space-y-3">
                        {specificGroups[groupName].map(item => <EvidenceItemCard key={item.fileId} item={item} />)}
                    </ul>
                </div>
            ))}
            {proactiveGroupKeys.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Contextual & Proactive Evidence</h4>
                    {proactiveGroupKeys.map((groupName) => (
                        <div key={groupName} className="mt-4">
                            <h5 className="font-bold text-purple-600 dark:text-purple-400">
                                {groupName}
                            </h5>
                            <ul className="mt-2 space-y-3">
                                {proactiveGroups[groupName].map(item => <EvidenceItemCard key={item.fileId} item={item} />)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Evidence Discovery from Google Drive</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Securely connect and scan your Google Drive for relevant documents, emails, and more.
          </p>
        </div>
        <button
          onClick={handleAuthClick}
          disabled={isInitializing}
          className={`mt-4 sm:mt-0 px-4 py-2 font-semibold rounded-md transition ${isInitializing ? 'bg-gray-400 text-white cursor-not-allowed' : (isSignedIn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')}`}
        >
          {isInitializing ? 'Initializing...' : (isSignedIn ? 'Disconnect Google Drive' : 'Connect Google Drive')}
        </button>
      </div>

      {isSignedIn && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
                  <input type="text" id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., performance review, unfair" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700" />
              </div>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition"
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      )}

      {isScanning && (
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700 dark:text-white">Scanning Files</span>
            <span className="text-sm font-medium text-blue-700 dark:text-white">{scanProgress.processed} / {scanProgress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(scanProgress.processed / scanProgress.total) * 100}%` }}></div>
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {discoveredEvidence.length > 0 && !isScanning && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Discovered Evidence</h4>
                <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                    <button onClick={() => setView('list')} className={`px-3 py-1 text-sm font-medium rounded-md transition ${view === 'list' ? 'bg-white dark:bg-gray-900 shadow text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>List</button>
                    <button onClick={() => setView('timeline')} className={`px-3 py-1 text-sm font-medium rounded-md transition ${view === 'timeline' ? 'bg-white dark:bg-gray-900 shadow text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>Timeline</button>
                </div>
            </div>
            {view === 'list' ? <ListView /> : <EvidenceTimeline evidence={discoveredEvidence} />}
        </div>
      )}
      
      {discoveredEvidence.length === 0 && !isScanning && scanProgress.total > 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">Scan complete. No relevant documents were found based on the provided criteria.</p>
      )}
    </div>
  );
};

export default DriveScanner;