import React, { useState } from 'react';
import { LegalQuestion } from '../../data/legalQuestions';
import { CaseLawExample } from '../../services/geminiService';

interface QuestionCardProps {
    question: LegalQuestion;
    onAnalyze?: (questionId: number) => void;
    onToggleDiscovery?: (questionId: number, needed: boolean) => void;
    onToggleEvidence?: (questionId: number, have: boolean) => void;
    confidenceScore?: number;
    analysisResult?: string;
    caseLawResults?: CaseLawExample[];
    discoveryStatus?: { needDiscovery: boolean; haveEvidence: boolean };
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    onAnalyze,
    onToggleDiscovery,
    onToggleEvidence,
    confidenceScore,
    analysisResult,
    caseLawResults,
    discoveryStatus = { needDiscovery: false, haveEvidence: false }
}) => {
    const [showAnalysis, setShowAnalysis] = useState(false);

    const handleAnalyze = () => {
        if (onAnalyze) {
            onAnalyze(question.id);
            setShowAnalysis(true);
        }
    };

    const getConfidenceColor = (score?: number) => {
        if (!score) return 'text-gray-500';
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors group border-b border-gray-100">
            <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-lg text-sm">
                        Q{question.id}
                    </span>
                    <h3 className="text-base font-medium text-gray-900">{question.question}</h3>
                </div>
                <div className="flex gap-2">
                    {onAnalyze && (
                        <button
                            onClick={handleAnalyze}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-all"
                            title="Analyze with AI"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={() => navigator.clipboard.writeText(question.answer)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-all"
                        title="Copy Answer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="pl-11">
                <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                    <div dangerouslySetInnerHTML={{ __html: question.answer.replace(/\n/g, '<br/>') }} />
                </div>

                {/* Discovery & Confidence Tools */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-4">
                        {onToggleDiscovery && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={discoveryStatus.needDiscovery}
                                    onChange={(e) => onToggleDiscovery(question.id, e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                Need Discovery
                            </label>
                        )}
                        {onToggleEvidence && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={discoveryStatus.haveEvidence}
                                    onChange={(e) => onToggleEvidence(question.id, e.target.checked)}
                                    className="rounded text-green-600"
                                />
                                Have Evidence
                            </label>
                        )}
                    </div>
                    {confidenceScore !== undefined && (
                        <div className={`font-medium ${getConfidenceColor(confidenceScore)}`}>
                            {confidenceScore}% Confidence
                        </div>
                    )}
                </div>

                {/* AI Analysis Result */}
                {showAnalysis && analysisResult && (
                    <div className="mt-3 bg-purple-50 p-3 rounded border border-purple-100 text-sm">
                        <div className="font-semibold text-purple-900 mb-1">AI Analysis:</div>
                        <p className="text-gray-700">{analysisResult}</p>
                    </div>
                )}

                {/* Case Law Results */}
                {showAnalysis && caseLawResults && caseLawResults.length > 0 && (
                    <div className="mt-3 bg-blue-50 p-4 rounded border border-blue-200">
                        <div className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Relevant Case Law ({caseLawResults.length} cases found)
                        </div>
                        <div className="space-y-3">
                            {caseLawResults.map((caseItem, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border border-blue-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-900">{caseItem.case_name}</div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${caseItem.relevance_score >= 95 ? 'bg-green-100 text-green-800' :
                                                caseItem.relevance_score >= 90 ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {caseItem.relevance_score}% Match
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-2">
                                        <span className="font-semibold">{caseItem.jurisdiction}</span> • {caseItem.claim_type} • {caseItem.outcome}
                                    </div>
                                    <div className="text-sm space-y-2">
                                        <div>
                                            <span className="font-semibold text-gray-700">Key Facts:</span>
                                            <p className="text-gray-600">{caseItem.key_facts}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Legal Holding:</span>
                                            <p className="text-gray-600 italic">{caseItem.legal_holding}</p>
                                        </div>
                                        <div className="bg-blue-50 p-2 rounded">
                                            <span className="font-semibold text-blue-900">Why This Helps Your Case:</span>
                                            <p className="text-blue-800">{caseItem.why_relevant}</p>
                                        </div>
                                        {caseItem.settlement_amount && (
                                            <div className="text-green-700 font-semibold">
                                                Settlement: {caseItem.settlement_amount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
