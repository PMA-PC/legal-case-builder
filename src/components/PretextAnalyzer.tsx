import React from 'react';
import { PretextAnalysis } from '../types';

interface PretextAnalyzerProps {
    onAnalyze: () => Promise<void>;
    analysis: PretextAnalysis | null;
    isAnalyzing: boolean;
    statedReason: string; // From complaint
    characterProfile: string; // From input
}

const PretextAnalyzer: React.FC<PretextAnalyzerProps> = ({
    onAnalyze,
    analysis,
    isAnalyzing,
    statedReason,
    characterProfile
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600'; // Higher score = more likely pretext = good for plaintiff
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return 'Strong Pretext Evidence';
        if (score >= 40) return 'Moderate Pretext Evidence';
        return 'Weak Pretext Evidence';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">🎭 Pretext Evidence Builder</h2>
                <p className="text-indigo-100">
                    Prove the employer's stated reason for termination is false or not the real reason, exposing discriminatory or retaliatory motives.
                </p>
            </div>

            {/* Current Data Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📋 Case Summary
                </h3>
                <div className="space-y-3">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border-l-4 border-red-500">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Employer's Stated Reason:</p>
                        <p className="text-gray-900 dark:text-white">{statedReason || 'Not provided'}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border-l-4 border-green-500">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Employment History:</p>
                        <p className="text-gray-900 dark:text-white text-sm">{characterProfile ? characterProfile.substring(0, 200) + '...' : 'Not provided'}</p>
                    </div>
                </div>

                <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing || !statedReason || !characterProfile}
                    className="mt-6 w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
                >
                    {isAnalyzing ? '🔍 Analyzing Pretext...' : '🔍 Analyze Pretext Evidence'}
                </button>

                {(!statedReason || !characterProfile) && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        Please provide complaint text (with stated reason) and character profile in the Input tab first.
                    </p>
                )}
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-6">
                    {/* Pretext Score */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 Pretext Likelihood Score
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pretext Score</p>
                                <p className={`text-4xl font-bold ${getScoreColor(analysis.pretextScore)}`}>
                                    {analysis.pretextScore}/100
                                </p>
                                <p className={`text-sm font-semibold ${getScoreColor(analysis.pretextScore)}`}>
                                    {getScoreLabel(analysis.pretextScore)}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Analysis:</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.pretextRationale}</p>
                        </div>
                    </div>

                    {/* Stated Reasons */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📝 Employer's Stated Reasons
                        </h3>
                        <ul className="space-y-2">
                            {analysis.statedReasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shifting Explanations */}
                    {analysis.shiftingExplanations.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                🔄 Shifting Explanations (Red Flag!)
                            </h3>
                            <div className="space-y-2">
                                {analysis.shiftingExplanations.map((shift, idx) => (
                                    <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-4 border-red-500">
                                        <p className="text-gray-800 dark:text-gray-200">{shift}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Inconsistencies */}
                    {analysis.inconsistencies.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                ⚠️ Inconsistencies in Employer's Narrative
                            </h3>
                            <div className="space-y-2">
                                {analysis.inconsistencies.map((inconsistency, idx) => (
                                    <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-500">
                                        <p className="text-gray-800 dark:text-gray-200">{inconsistency}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Model Employee Narrative */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            ⭐ Model Employee vs. Sudden Termination
                        </h3>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-md border border-green-200 dark:border-green-700">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{analysis.modelEmployeeNarrative}</p>
                        </div>
                    </div>

                    {/* Employment History */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📊 Employment History Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tenure</p>
                                <p className="text-gray-900 dark:text-white">{analysis.employmentHistory.tenure}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Performance Reviews</p>
                                <p className="text-gray-900 dark:text-white">{analysis.employmentHistory.performanceReviews}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Disciplinary Record</p>
                                <p className="text-gray-900 dark:text-white">{analysis.employmentHistory.disciplinaryRecord}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Awards & Recognition</p>
                                <p className="text-gray-900 dark:text-white">{analysis.employmentHistory.awards}</p>
                            </div>
                        </div>
                    </div>

                    {/* Deposition Questions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            ❓ Deposition Questions to Expose Pretext
                        </h3>
                        <div className="space-y-3">
                            {analysis.depositionQuestions.map((question, idx) => (
                                <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-4 border-purple-500">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Q{idx + 1}:</p>
                                    <p className="text-gray-800 dark:text-gray-200">{question}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* After-Acquired Evidence Defense */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            🛡️ After-Acquired Evidence Defense
                        </h3>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md border border-orange-200 dark:border-orange-700">
                            <p className="text-gray-800 dark:text-gray-200">{analysis.afterAcquiredEvidenceDefense}</p>
                        </div>
                    </div>

                    {/* Export */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📤 Export Pretext Analysis
                        </h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const content = `PRETEXT ANALYSIS REPORT\n\nPretext Score: ${analysis.pretextScore}/100\n${analysis.pretextRationale}\n\nStated Reasons:\n${analysis.statedReasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nShifting Explanations:\n${analysis.shiftingExplanations.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nInconsistencies:\n${analysis.inconsistencies.map((inc, i) => `${i + 1}. ${inc}`).join('\n')}\n\nModel Employee Narrative:\n${analysis.modelEmployeeNarrative}\n\nEmployment History:\nTenure: ${analysis.employmentHistory.tenure}\nPerformance: ${analysis.employmentHistory.performanceReviews}\nDiscipline: ${analysis.employmentHistory.disciplinaryRecord}\nAwards: ${analysis.employmentHistory.awards}\n\nDeposition Questions:\n${analysis.depositionQuestions.map((q, i) => `Q${i + 1}: ${q}`).join('\n\n')}\n\nAfter-Acquired Evidence Defense:\n${analysis.afterAcquiredEvidenceDefense}`;
                                    const blob = new Blob([content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'pretext-analysis.txt';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                            >
                                📄 Download Report
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(analysis.depositionQuestions.map((q, i) => `Q${i + 1}: ${q}`).join('\n\n'));
                                    alert('Deposition questions copied to clipboard!');
                                }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                            >
                                📋 Copy Deposition Questions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PretextAnalyzer;
