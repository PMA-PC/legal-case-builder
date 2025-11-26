import React, { useState } from 'react';
import { Comparator, ComparatorAnalysis } from '../types';

interface ComparatorModuleProps {
    onAnalyze: (allegedMisconduct: string, yourDiscipline: string, comparators: Comparator[]) => Promise<void>;
    analysis: ComparatorAnalysis | null;
    isAnalyzing: boolean;
}

const ComparatorModule: React.FC<ComparatorModuleProps> = ({
    onAnalyze,
    analysis,
    isAnalyzing
}) => {
    const [allegedMisconduct, setAllegedMisconduct] = useState('');
    const [yourDiscipline, setYourDiscipline] = useState('');
    const [comparators, setComparators] = useState<Comparator[]>([]);
    const [newComparator, setNewComparator] = useState<Partial<Comparator>>({
        name: '',
        role: '',
        conduct: '',
        discipline: '',
        protectedClass: '',
        notes: ''
    });

    const addComparator = () => {
        if (!newComparator.name || !newComparator.conduct || !newComparator.discipline) {
            alert('Please provide at least name, conduct, and discipline for the comparator.');
            return;
        }

        const comparator: Comparator = {
            id: Date.now().toString(),
            name: newComparator.name,
            role: newComparator.role || '',
            conduct: newComparator.conduct,
            discipline: newComparator.discipline,
            protectedClass: newComparator.protectedClass || '',
            notes: newComparator.notes || ''
        };

        setComparators([...comparators, comparator]);
        setNewComparator({ name: '', role: '', conduct: '', discipline: '', protectedClass: '', notes: '' });
    };

    const removeComparator = (id: string) => {
        setComparators(comparators.filter(c => c.id !== id));
    };

    const handleAnalyze = () => {
        if (!allegedMisconduct || !yourDiscipline) {
            alert('Please provide your alleged misconduct and the discipline you received.');
            return;
        }
        if (comparators.length === 0) {
            alert('Please add at least one comparator employee.');
            return;
        }
        onAnalyze(allegedMisconduct, yourDiscipline, comparators);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-red-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">👥 Comparator Evidence & Disparate Treatment</h2>
                <p className="text-orange-100">
                    Document similarly situated employees who received different discipline to prove discriminatory treatment.
                </p>
            </div>

            {/* Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📝 Your Situation
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Alleged Misconduct
                        </label>
                        <input
                            type="text"
                            value={allegedMisconduct}
                            onChange={(e) => setAllegedMisconduct(e.target.value)}
                            placeholder="e.g., Berating a direct report"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Discipline You Received
                        </label>
                        <input
                            type="text"
                            value={yourDiscipline}
                            onChange={(e) => setYourDiscipline(e.target.value)}
                            placeholder="e.g., Termination"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Add Comparator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ➕ Add Comparator Employee
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Employee Name *
                        </label>
                        <input
                            type="text"
                            value={newComparator.name || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, name: e.target.value })}
                            placeholder="e.g., John Smith"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role/Title
                        </label>
                        <input
                            type="text"
                            value={newComparator.role || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, role: e.target.value })}
                            placeholder="e.g., Manager"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Their Conduct *
                        </label>
                        <input
                            type="text"
                            value={newComparator.conduct || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, conduct: e.target.value })}
                            placeholder="e.g., Yelled at employee in meeting"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Discipline They Received *
                        </label>
                        <input
                            type="text"
                            value={newComparator.discipline || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, discipline: e.target.value })}
                            placeholder="e.g., Written warning"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Protected Class
                        </label>
                        <input
                            type="text"
                            value={newComparator.protectedClass || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, protectedClass: e.target.value })}
                            placeholder="e.g., White, male, non-disabled"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes
                        </label>
                        <input
                            type="text"
                            value={newComparator.notes || ''}
                            onChange={(e) => setNewComparator({ ...newComparator, notes: e.target.value })}
                            placeholder="Additional context"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                <button
                    onClick={addComparator}
                    className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium"
                >
                    ➕ Add Comparator
                </button>
            </div>

            {/* Comparators List */}
            {comparators.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📋 Comparator Employees ({comparators.length})
                    </h3>

                    <div className="space-y-3">
                        {comparators.map((comp) => (
                            <div
                                key={comp.id}
                                className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white">{comp.name} {comp.role && `(${comp.role})`}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                            <strong>Conduct:</strong> {comp.conduct}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Discipline:</strong> {comp.discipline}
                                        </p>
                                        {comp.protectedClass && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <strong>Protected Class:</strong> {comp.protectedClass}
                                            </p>
                                        )}
                                        {comp.notes && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <strong>Notes:</strong> {comp.notes}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeComparator(comp.id)}
                                        className="ml-4 text-red-600 hover:text-red-800 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="mt-6 w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md disabled:bg-orange-300 disabled:cursor-not-allowed transition"
                    >
                        {isAnalyzing ? '🔍 Analyzing Disparate Treatment...' : '🔍 Analyze Disparate Treatment'}
                    </button>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-6">
                    {/* Disparate Treatment Score */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 Disparate Treatment Analysis
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Disparate Treatment Score</p>
                                <p className={`text-4xl font-bold ${getScoreColor(analysis.disparateTreatmentScore)}`}>
                                    {analysis.disparateTreatmentScore}/100
                                </p>
                                <p className={`text-sm font-semibold ${getScoreColor(analysis.disparateTreatmentScore)}`}>
                                    {analysis.disparateTreatmentScore >= 70 ? 'Strong Evidence' : analysis.disparateTreatmentScore >= 40 ? 'Moderate Evidence' : 'Weak Evidence'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.narrative}</p>
                        </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            📊 Comparison Chart
                        </h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="p-3 text-left text-gray-900 dark:text-white">Employee</th>
                                    <th className="p-3 text-left text-gray-900 dark:text-white">Conduct</th>
                                    <th className="p-3 text-left text-gray-900 dark:text-white">Discipline</th>
                                    <th className="p-3 text-left text-gray-900 dark:text-white">Protected Class</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysis.comparisonChart.map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                                        <td className="p-3 text-gray-900 dark:text-white font-medium">{row.employee}</td>
                                        <td className="p-3 text-gray-700 dark:text-gray-300">{row.conduct}</td>
                                        <td className="p-3 text-gray-700 dark:text-gray-300">{row.discipline}</td>
                                        <td className="p-3 text-gray-700 dark:text-gray-300">{row.protectedClass}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Discovery Requests */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📜 Recommended Discovery Requests
                        </h3>
                        <div className="space-y-2">
                            {analysis.discoveryRequests.map((request, idx) => (
                                <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-500">
                                    <p className="text-gray-800 dark:text-gray-200">{request}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Export */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📤 Export Analysis
                        </h3>
                        <button
                            onClick={() => {
                                const content = `COMPARATOR ANALYSIS REPORT\n\nYour Situation:\nAlleged Misconduct: ${analysis.allegedMisconduct}\nDiscipline Received: ${analysis.yourDiscipline}\n\nDisparate Treatment Score: ${analysis.disparateTreatmentScore}/100\n\nNarrative:\n${analysis.narrative}\n\nComparison Chart:\n${analysis.comparisonChart.map(row => `${row.employee} | ${row.conduct} | ${row.discipline} | ${row.protectedClass}`).join('\n')}\n\nDiscovery Requests:\n${analysis.discoveryRequests.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'comparator-analysis.txt';
                                a.click();
                            }}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium"
                        >
                            📄 Download Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparatorModule;
