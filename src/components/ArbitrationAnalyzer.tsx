import React, { useState } from 'react';
import { ArbitrationAnalysis } from '../types';

interface ArbitrationAnalyzerProps {
    onAnalyze: (agreementText: string, signedDate: string) => Promise<void>;
    analysis: ArbitrationAnalysis | null;
    isAnalyzing: boolean;
    protectedActivityDate: string; // From complaint (Aug 16, 2024)
}

const ArbitrationAnalyzer: React.FC<ArbitrationAnalyzerProps> = ({
    onAnalyze,
    analysis,
    isAnalyzing,
    protectedActivityDate
}) => {
    const [agreementText, setAgreementText] = useState('');
    const [signedDate, setSignedDate] = useState('');

    const handleAnalyze = () => {
        if (!agreementText.trim() || !signedDate) {
            alert('Please provide both the arbitration agreement text and the date it was signed.');
            return;
        }
        onAnalyze(agreementText, signedDate);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-red-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return 'High Unconscionability';
        if (score >= 40) return 'Moderate Unconscionability';
        return 'Low Unconscionability';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">⚖️ Arbitration Challenge Analyzer</h2>
                <p className="text-purple-100">
                    Analyze your arbitration agreement for enforceability issues and determine if your retaliation claim can be litigated outside arbitration.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📄 Arbitration Agreement Details
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Agreement Was Signed
                        </label>
                        <input
                            type="date"
                            value={signedDate}
                            onChange={(e) => setSignedDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        {protectedActivityDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Your protected activity (complaint) was on: <strong>{new Date(protectedActivityDate).toLocaleDateString()}</strong>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Arbitration Agreement Text
                        </label>
                        <textarea
                            value={agreementText}
                            onChange={(e) => setAgreementText(e.target.value)}
                            rows={10}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            placeholder="Paste the full text of your arbitration agreement here. Include all clauses, especially those related to scope, costs, and procedures."
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-300 disabled:cursor-not-allowed transition"
                    >
                        {isAnalyzing ? '🔍 Analyzing Agreement...' : '🔍 Analyze Arbitration Agreement'}
                    </button>
                </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-6">
                    {/* Unconscionability Score */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 Unconscionability Analysis
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Unconscionability Score</p>
                                <p className={`text-4xl font-bold ${getScoreColor(analysis.unconscionabilityScore)}`}>
                                    {analysis.unconscionabilityScore}/100
                                </p>
                                <p className={`text-sm font-semibold ${getScoreColor(analysis.unconscionabilityScore)}`}>
                                    {getScoreLabel(analysis.unconscionabilityScore)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Carve-Out Viable?</p>
                                <p className={`text-2xl font-bold ${analysis.carveOutViable ? 'text-green-600' : 'text-red-600'}`}>
                                    {analysis.carveOutViable ? '✅ YES' : '❌ NO'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Rationale:</strong> {analysis.carveOutRationale}
                            </p>
                        </div>
                    </div>

                    {/* Procedural Issues */}
                    {analysis.proceduralIssues.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                ⚠️ Procedural Unconscionability Issues
                            </h3>
                            <ul className="space-y-2">
                                {analysis.proceduralIssues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-red-500 mr-2">•</span>
                                        <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Substantive Issues */}
                    {analysis.substantiveIssues.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                ⚠️ Substantive Unconscionability Issues
                            </h3>
                            <ul className="space-y-2">
                                {analysis.substantiveIssues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-red-500 mr-2">•</span>
                                        <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Legal Arguments */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📜 Legal Arguments for Challenging Arbitration
                        </h3>
                        <div className="space-y-3">
                            {analysis.legalArguments.map((arg, idx) => (
                                <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border-l-4 border-blue-500">
                                    <p className="text-gray-800 dark:text-gray-200">{arg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Settlement Leverage Points */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            💪 Settlement Leverage Points
                        </h3>
                        <div className="space-y-2">
                            {analysis.settlementLeveragePoints.map((point, idx) => (
                                <div key={idx} className="flex items-start">
                                    <span className="text-green-500 mr-2 text-xl">✓</span>
                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Motion Template */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📝 Motion to Compel Litigation (Draft)
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                                {analysis.motionTemplate}
                            </pre>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(analysis.motionTemplate);
                                alert('Motion template copied to clipboard!');
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                        >
                            📋 Copy to Clipboard
                        </button>
                    </div>

                    {/* Export Options */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📤 Export Analysis
                        </h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const content = JSON.stringify(analysis, null, 2);
                                    const blob = new Blob([content], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'arbitration-analysis.json';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                            >
                                💾 Download JSON
                            </button>
                            <button
                                onClick={() => {
                                    const content = `ARBITRATION ANALYSIS REPORT\n\nUnconscionability Score: ${analysis.unconscionabilityScore}/100\nCarve-Out Viable: ${analysis.carveOutViable ? 'YES' : 'NO'}\n\nRationale:\n${analysis.carveOutRationale}\n\nProcedural Issues:\n${analysis.proceduralIssues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\nSubstantive Issues:\n${analysis.substantiveIssues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\nLegal Arguments:\n${analysis.legalArguments.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}\n\nSettlement Leverage:\n${analysis.settlementLeveragePoints.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}\n\nMOTION TEMPLATE:\n${analysis.motionTemplate}`;
                                    const blob = new Blob([content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'arbitration-analysis.txt';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                            >
                                📄 Download Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArbitrationAnalyzer;
