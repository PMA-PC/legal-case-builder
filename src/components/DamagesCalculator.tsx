import React, { useState } from 'react';
import { DamagesBreakdown } from '../types';

interface DamagesCalculatorProps {
    onCalculate: (inputData: {
        salary: number;
        terminationDate: string;
        newJobSalary: number;
        newJobStartDate: string;
        healthInsurance: number;
        retirement401k: number;
        paidTimeOff: number;
        otherBenefits: number;
        jobSearchExpenses: number;
        emotionalDistress: number;
        emotionalDistressJustification: string;
        reputationalHarm: number;
        reputationalHarmJustification: string;
    }) => Promise<void>;
    damages: DamagesBreakdown | null;
    isCalculating: boolean;
}

const DamagesCalculator: React.FC<DamagesCalculatorProps> = ({
    onCalculate,
    damages,
    isCalculating
}) => {
    const [salary, setSalary] = useState<number>(0);
    const [terminationDate, setTerminationDate] = useState<string>('');
    const [newJobSalary, setNewJobSalary] = useState<number>(0);
    const [newJobStartDate, setNewJobStartDate] = useState<string>('');

    // Benefits
    const [healthInsurance, setHealthInsurance] = useState<number>(0);
    const [retirement401k, setRetirement401k] = useState<number>(0);
    const [paidTimeOff, setPaidTimeOff] = useState<number>(0);
    const [otherBenefits, setOtherBenefits] = useState<number>(0);
    const [jobSearchExpenses, setJobSearchExpenses] = useState<number>(0);

    // Non-economic
    const [emotionalDistress, setEmotionalDistress] = useState<number>(0);
    const [emotionalDistressJustification, setEmotionalDistressJustification] = useState<string>('');
    const [reputationalHarm, setReputationalHarm] = useState<number>(0);
    const [reputationalHarmJustification, setReputationalHarmJustification] = useState<string>('');

    const handleCalculate = () => {
        if (!salary || !terminationDate) {
            alert('Please provide at least your salary and termination date.');
            return;
        }

        onCalculate({
            salary,
            terminationDate,
            newJobSalary,
            newJobStartDate,
            healthInsurance,
            retirement401k,
            paidTimeOff,
            otherBenefits,
            jobSearchExpenses,
            emotionalDistress,
            emotionalDistressJustification,
            reputationalHarm,
            reputationalHarmJustification
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">💰 Comprehensive Damages Calculator</h2>
                <p className="text-green-100">
                    Calculate economic, non-economic, and punitive damages to determine your settlement range.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Employment & Compensation Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Annual Salary at Termination *
                        </label>
                        <input
                            type="number"
                            value={salary || ''}
                            onChange={(e) => setSalary(Number(e.target.value))}
                            placeholder="e.g., 85000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Termination Date *
                        </label>
                        <input
                            type="date"
                            value={terminationDate}
                            onChange={(e) => setTerminationDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Job Salary (if applicable)
                        </label>
                        <input
                            type="number"
                            value={newJobSalary || ''}
                            onChange={(e) => setNewJobSalary(Number(e.target.value))}
                            placeholder="e.g., 70000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Job Start Date (if applicable)
                        </label>
                        <input
                            type="date"
                            value={newJobStartDate}
                            onChange={(e) => setNewJobStartDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Lost Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🏥 Lost Benefits (Annual Value)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Health Insurance (Annual)
                        </label>
                        <input
                            type="number"
                            value={healthInsurance || ''}
                            onChange={(e) => setHealthInsurance(Number(e.target.value))}
                            placeholder="e.g., 12000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            401(k) Match (Annual)
                        </label>
                        <input
                            type="number"
                            value={retirement401k || ''}
                            onChange={(e) => setRetirement401k(Number(e.target.value))}
                            placeholder="e.g., 5000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Unpaid PTO Value
                        </label>
                        <input
                            type="number"
                            value={paidTimeOff || ''}
                            onChange={(e) => setPaidTimeOff(Number(e.target.value))}
                            placeholder="e.g., 3000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Other Benefits (Annual)
                        </label>
                        <input
                            type="number"
                            value={otherBenefits || ''}
                            onChange={(e) => setOtherBenefits(Number(e.target.value))}
                            placeholder="e.g., 2000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Search Expenses
                        </label>
                        <input
                            type="number"
                            value={jobSearchExpenses || ''}
                            onChange={(e) => setJobSearchExpenses(Number(e.target.value))}
                            placeholder="e.g., 1500"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Non-Economic Damages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    😔 Non-Economic Damages
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Emotional Distress Amount
                        </label>
                        <input
                            type="number"
                            value={emotionalDistress || ''}
                            onChange={(e) => setEmotionalDistress(Number(e.target.value))}
                            placeholder="e.g., 50000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Emotional Distress Justification
                        </label>
                        <textarea
                            value={emotionalDistressJustification}
                            onChange={(e) => setEmotionalDistressJustification(e.target.value)}
                            rows={3}
                            placeholder="Describe therapy, medical treatment, impact on mental health, etc."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reputational Harm Amount
                        </label>
                        <input
                            type="number"
                            value={reputationalHarm || ''}
                            onChange={(e) => setReputationalHarm(Number(e.target.value))}
                            placeholder="e.g., 25000"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reputational Harm Justification
                        </label>
                        <textarea
                            value={reputationalHarmJustification}
                            onChange={(e) => setReputationalHarmJustification(e.target.value)}
                            rows={3}
                            placeholder="Describe damage to professional reputation, difficulty finding new employment, etc."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:bg-green-300 disabled:cursor-not-allowed transition"
            >
                {isCalculating ? '💰 Calculating Damages...' : '💰 Calculate Total Damages & Settlement Range'}
            </button>

            {/* Results */}
            {damages && (
                <div className="space-y-6">
                    {/* Economic Damages */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            💵 Economic Damages
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <span className="text-gray-700 dark:text-gray-300">Back Pay ({damages.economic.backPayMonths} months)</span>
                                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.economic.backPay)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <span className="text-gray-700 dark:text-gray-300">Front Pay ({damages.economic.frontPayYears} years)</span>
                                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.economic.frontPay)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <span className="text-gray-700 dark:text-gray-300">Lost Benefits</span>
                                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.economic.lostBenefits.total)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                <span className="text-gray-700 dark:text-gray-300">Job Search Expenses</span>
                                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.economic.jobSearchExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-100 dark:bg-blue-900/40 rounded-md border-2 border-blue-300 dark:border-blue-700">
                                <span className="font-bold text-gray-900 dark:text-white text-lg">Total Economic Damages</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">{formatCurrency(damages.economic.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Non-Economic Damages */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            😔 Non-Economic Damages
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Emotional Distress</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.nonEconomic.emotionalDistress)}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{damages.nonEconomic.emotionalDistressJustification}</p>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Reputational Harm</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.nonEconomic.reputationalHarm)}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{damages.nonEconomic.reputationalHarmJustification}</p>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-purple-100 dark:bg-purple-900/40 rounded-md border-2 border-purple-300 dark:border-purple-700">
                                <span className="font-bold text-gray-900 dark:text-white text-lg">Total Non-Economic Damages</span>
                                <span className="font-bold text-purple-600 dark:text-purple-400 text-2xl">{formatCurrency(damages.nonEconomic.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Punitive Damages */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            ⚡ Punitive Damages
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Eligible for Punitive Damages:
                                    <span className={`ml-2 ${damages.punitive.eligible ? 'text-green-600' : 'text-red-600'}`}>
                                        {damages.punitive.eligible ? '✅ YES' : '❌ NO'}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{damages.punitive.eligibilityRationale}</p>
                            </div>
                            {damages.punitive.eligible && (
                                <>
                                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">Punitive Damages Amount</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.punitive.amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">Texas Cap</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(damages.punitive.texasCap)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{damages.punitive.capCalculation}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Settlement Range */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-bold mb-4">🎯 Settlement Range Recommendations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <p className="text-sm text-green-100 mb-1">Conservative</p>
                                <p className="text-3xl font-bold">{formatCurrency(damages.settlementRange.conservative)}</p>
                                <p className="text-xs text-green-100 mt-2">{damages.settlementRange.conservativeRationale}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border-2 border-white">
                                <p className="text-sm text-green-100 mb-1">Moderate (Recommended)</p>
                                <p className="text-3xl font-bold">{formatCurrency(damages.settlementRange.moderate)}</p>
                                <p className="text-xs text-green-100 mt-2">{damages.settlementRange.moderateRationale}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <p className="text-sm text-green-100 mb-1">Aggressive</p>
                                <p className="text-3xl font-bold">{formatCurrency(damages.settlementRange.aggressive)}</p>
                                <p className="text-xs text-green-100 mt-2">{damages.settlementRange.aggressiveRationale}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Damages */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-4 border-green-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Total Damages</h3>
                            <p className="text-4xl font-bold text-green-600">{formatCurrency(damages.totalDamages)}</p>
                        </div>
                    </div>

                    {/* Export */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📤 Export Damages Report
                        </h3>
                        <button
                            onClick={() => {
                                const content = `DAMAGES CALCULATION REPORT\n\nECONOMIC DAMAGES:\nBack Pay (${damages.economic.backPayMonths} months): ${formatCurrency(damages.economic.backPay)}\nFront Pay (${damages.economic.frontPayYears} years): ${formatCurrency(damages.economic.frontPay)}\nLost Benefits: ${formatCurrency(damages.economic.lostBenefits.total)}\nJob Search Expenses: ${formatCurrency(damages.economic.jobSearchExpenses)}\nTotal Economic: ${formatCurrency(damages.economic.total)}\n\nNON-ECONOMIC DAMAGES:\nEmotional Distress: ${formatCurrency(damages.nonEconomic.emotionalDistress)}\n  ${damages.nonEconomic.emotionalDistressJustification}\nReputational Harm: ${formatCurrency(damages.nonEconomic.reputationalHarm)}\n  ${damages.nonEconomic.reputationalHarmJustification}\nTotal Non-Economic: ${formatCurrency(damages.nonEconomic.total)}\n\nPUNITIVE DAMAGES:\nEligible: ${damages.punitive.eligible ? 'YES' : 'NO'}\n${damages.punitive.eligibilityRationale}\nAmount: ${formatCurrency(damages.punitive.amount)}\nTexas Cap: ${formatCurrency(damages.punitive.texasCap)}\n\nSETTLEMENT RANGE:\nConservative: ${formatCurrency(damages.settlementRange.conservative)}\n  ${damages.settlementRange.conservativeRationale}\nModerate: ${formatCurrency(damages.settlementRange.moderate)}\n  ${damages.settlementRange.moderateRationale}\nAggressive: ${formatCurrency(damages.settlementRange.aggressive)}\n  ${damages.settlementRange.aggressiveRationale}\n\nTOTAL DAMAGES: ${formatCurrency(damages.totalDamages)}`;
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'damages-calculation.txt';
                                a.click();
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                        >
                            📄 Download Damages Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DamagesCalculator;
