import React, { useState, useMemo } from 'react';
import { LegalQuestion } from '../../data/legalQuestions';
import QuestionCard from './QuestionCard';

interface QuestionsViewProps {
    questions: LegalQuestion[];
    onAnalyzeQuestion?: (questionId: number) => void;
    onToggleDiscovery?: (questionId: number, needed: boolean) => void;
    onToggleEvidence?: (questionId: number, have: boolean) => void;
    confidenceScores?: Record<number, number>;
    analysisResults?: Record<number, string>;
    discoveryStatuses?: Record<number, { needDiscovery: boolean; haveEvidence: boolean }>;
}

const QuestionsView: React.FC<QuestionsViewProps> = ({
    questions,
    onAnalyzeQuestion,
    onToggleDiscovery,
    onToggleEvidence,
    confidenceScores = {},
    analysisResults = {},
    discoveryStatuses = {}
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const filteredQuestions = useMemo(() => {
        if (!searchTerm) return questions;
        const term = searchTerm.toLowerCase();
        return questions.filter(
            q =>
                q.question.toLowerCase().includes(term) ||
                q.answer.toLowerCase().includes(term) ||
                q.section.toLowerCase().includes(term)
        );
    }, [questions, searchTerm]);

    const groupedQuestions = useMemo(() => {
        return filteredQuestions.reduce((acc, q) => {
            if (!acc[q.section]) acc[q.section] = [];
            acc[q.section].push(q);
            return acc;
        }, {} as Record<string, LegalQuestion[]>);
    }, [filteredQuestions]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            } else {
                newSet.add(section);
            }
            return newSet;
        });
    };

    const expandAll = () => {
        setExpandedSections(new Set(Object.keys(groupedQuestions)));
    };

    const collapseAll = () => {
        setExpandedSections(new Set());
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Legal Questions Database</h2>
                    <p className="text-gray-500 mt-1">
                        Comprehensive list of {questions.length} legal questions and answers.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={expandAll}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedQuestions).map(([section, sectionQuestions]) => (
                    <div
                        key={section}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div
                            className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(section)}
                        >
                            <h2 className="text-lg font-semibold text-gray-800">{section}</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {sectionQuestions.length} Qs
                            </span>
                        </div>

                        {expandedSections.has(section) && (
                            <div className="divide-y divide-gray-100">
                                {sectionQuestions.map(q => (
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        onAnalyze={onAnalyzeQuestion}
                                        onToggleDiscovery={onToggleDiscovery}
                                        onToggleEvidence={onToggleEvidence}
                                        confidenceScore={confidenceScores[q.id]}
                                        analysisResult={analysisResults[q.id]}
                                        discoveryStatus={discoveryStatuses[q.id]}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionsView;
