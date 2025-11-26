import React from 'react';
import { AnalysisResults, AiSuggestion } from '../types';
import { SectionCard } from './AnalysisDisplay';

interface FollowUpQuestionsProps {
    results: AnalysisResults;
    onGetSuggestions: (sectionKey: string, sectionTitle: string) => void;
    suggestions: Record<string, AiSuggestion | null>;
    isSuggesting: Record<string, boolean>;
    onExportSection: (sectionKey: string, sectionTitle: string) => void; // New prop
    onUpdateUserNotes: (sectionKey: string, notes: string) => void; // New prop
}

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({ results, onGetSuggestions, suggestions, isSuggesting, onExportSection, onUpdateUserNotes }) => {
    return (
        <div className="space-y-8 mt-8">
            <SectionCard
                title="Information Gaps to Address"
                sectionKey="informationGaps"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.informationGaps}
                isSuggesting={isSuggesting.informationGaps}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your AI attorney has identified areas where your narrative could be strengthened with more detail. Addressing these points will help build a more robust case.</p>
                <ul className="space-y-4">
                {results.informationGaps.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.area}</h4>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{item.question}</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        <span className="font-bold">Rationale:</span> {item.rationale}
                    </p>
                    </li>
                ))}
                </ul>
            </SectionCard>

            <SectionCard
                title="Potential Investigator Questions"
                sectionKey="investigatorQuestions"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.investigatorQuestions}
                isSuggesting={isSuggesting.investigatorQuestions}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Anticipate these questions from the company's investigator or lawyer. Preparing your answers will be critical.</p>
                <ul className="space-y-4">
                {results.investigatorQuestions.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">"{item.question}"</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Purpose: {item.purpose}</p>
                    </li>
                ))}
                </ul>
            </SectionCard>

            <SectionCard
                title="Provide More Data: Key Metrics to Strengthen Your Case"
                sectionKey="quantitativeDataPrompts"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.quantitativeDataPrompts}
                isSuggesting={isSuggesting.quantitativeDataPrompts}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The AI has identified areas where specific data could significantly strengthen your claims. Answer the following questions and incorporate the data into your narrative.</p>
                <ul className="space-y-4">
                {results.quantitativeDataPrompts.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-indigo-500">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.prompt}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                        <span className="font-bold">Rationale:</span> {item.rationale}
                    </p>
                    </li>
                ))}
                </ul>
            </SectionCard>

            <SectionCard
                title="Strategic Questions to Establish Culture Shift"
                sectionKey="cultureShiftQuestions"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.cultureShiftQuestions}
                isSuggesting={isSuggesting.cultureShiftQuestions}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Use these questions in depositions with company witnesses (e.g., former colleagues, HR, managers) to build a narrative about the negative changes in the work environment.</p>
                <ul className="space-y-4">
                {results.cultureShiftQuestions.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">"{item.question}"</p>
                    <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">Objective: {item.objective}</p>
                    </li>
                ))}
                </ul>
            </SectionCard>

            <SectionCard
                title="Questions to Portray Company Culture & Leadership"
                sectionKey="culturePortraitQuestions"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.culturePortraitQuestions}
                isSuggesting={isSuggesting.culturePortraitQuestions}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">These questions are designed to elicit detailed descriptions of the company's day-to-day environment, focusing on the issues stemming from inexperienced leadership.</p>
                <ul className="space-y-6">
                {results.culturePortraitQuestions.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.primaryQuestion}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">Objective: {item.objective}</p>
                    <div className="mt-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Follow-up Questions:</h5>
                        <ul className="space-y-2 mt-2">
                        {item.followUps.map((followUp, fuIndex) => (
                            <li key={fuIndex} className="text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">If response is {followUp.ifResponseIs}:</span>
                            <span className="ml-2 text-gray-800 dark:text-gray-200">"{followUp.followUpQuestion}"</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </li>
                ))}
                </ul>
            </SectionCard>
            
            <SectionCard
                title="Investigative Questions on ADA & Accommodations"
                sectionKey="adaAccommodationQuestions"
                onGetSuggestions={onGetSuggestions}
                suggestion={suggestions.adaAccommodationQuestions}
                isSuggesting={isSuggesting.adaAccommodationQuestions}
                onExport={onExportSection}
                onUpdateUserNotes={onUpdateUserNotes}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">These questions are designed to scrutinize the company's procedures and actions regarding your ADA accommodation requests, particularly those related to autism, and to highlight any inconsistencies or discriminatory practices.</p>
                <ul className="space-y-4">
                {results.adaAccommodationQuestions.map((item, index) => (
                    <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 pr-4">"{item.question}"</p>
                        <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">{item.focus}</span>
                    </div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">Objective: {item.objective}</p>
                    </li>
                ))}
                </ul>
            </SectionCard>
        </div>
    );
};

export default FollowUpQuestions;