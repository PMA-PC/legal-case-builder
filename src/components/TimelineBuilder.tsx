import React, { useState } from 'react';
import { Timeline, TimelineEvent } from '../types';

interface TimelineBuilderProps {
    onAnalyze: (events: TimelineEvent[]) => Promise<void>;
    timeline: Timeline | null;
    isAnalyzing: boolean;
    initialEvents?: TimelineEvent[]; // Pre-populated from complaint
    onEventsChange?: (events: TimelineEvent[]) => void;
}

const TimelineBuilder: React.FC<TimelineBuilderProps> = ({
    onAnalyze,
    timeline,
    isAnalyzing,
    initialEvents = [],
    onEventsChange
}) => {
    const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
    const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
        date: '',
        type: 'other',
        description: '',
        significance: ''
    });

    const addEvent = () => {
        if (!newEvent.date || !newEvent.description) {
            alert('Please provide at least a date and description for the event.');
            return;
        }

        const event: TimelineEvent = {
            id: Date.now().toString(),
            date: newEvent.date,
            type: newEvent.type as TimelineEvent['type'],
            description: newEvent.description,
            significance: newEvent.significance || '',
            category: newEvent.category
        };

        const updatedEvents = [...events, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(updatedEvents);
        if (onEventsChange) onEventsChange(updatedEvents);
        setNewEvent({ date: '', type: 'other', description: '', significance: '' });
    };

    const removeEvent = (id: string) => {
        const updatedEvents = events.filter(e => e.id !== id);
        setEvents(updatedEvents);
        if (onEventsChange) onEventsChange(updatedEvents);
    };

    const handleAnalyze = () => {
        if (events.length < 2) {
            alert('Please add at least 2 events (protected activity and adverse action) to analyze the timeline.');
            return;
        }
        onAnalyze(events);
    };

    const getEventTypeColor = (type: TimelineEvent['type']) => {
        const colors = {
            protected_activity: 'bg-green-100 text-green-800 border-green-300',
            adverse_action: 'bg-red-100 text-red-800 border-red-300',
            performance_review: 'bg-blue-100 text-blue-800 border-blue-300',
            meeting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            policy_change: 'bg-purple-100 text-purple-800 border-purple-300',
            other: 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[type];
    };

    const getEventTypeIcon = (type: TimelineEvent['type']) => {
        const icons = {
            protected_activity: '🛡️',
            adverse_action: '⚠️',
            performance_review: '📊',
            meeting: '🤝',
            policy_change: '📜',
            other: '📌'
        };
        return icons[type];
    };

    const getConnectionStrengthColor = (strength: Timeline['causalConnectionStrength']) => {
        const colors = {
            strong: 'text-green-600',
            moderate: 'text-yellow-600',
            weak: 'text-red-600'
        };
        return colors[strength];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">📅 Timeline & Causation Analyzer</h2>
                <p className="text-blue-100">
                    Build a visual timeline of events to establish temporal proximity and causal connection for your retaliation claim.
                </p>
            </div>

            {/* Add Event Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ➕ Add Timeline Event
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={newEvent.date || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Event Type
                        </label>
                        <select
                            value={newEvent.type || 'other'}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as TimelineEvent['type'] })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="protected_activity">🛡️ Protected Activity (Complaint)</option>
                            <option value="adverse_action">⚠️ Adverse Action</option>
                            <option value="performance_review">📊 Performance Review</option>
                            <option value="meeting">🤝 Meeting</option>
                            <option value="policy_change">📜 Policy Change</option>
                            <option value="other">📌 Other</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={newEvent.description || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            placeholder="e.g., Filed formal complaint with HR"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Significance (Optional)
                        </label>
                        <textarea
                            value={newEvent.significance || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, significance: e.target.value })}
                            rows={2}
                            placeholder="Why is this event important to your case?"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                <button
                    onClick={addEvent}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                    ➕ Add Event
                </button>
            </div>

            {/* Events List */}
            {events.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📋 Timeline Events ({events.length})
                    </h3>

                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`p-4 rounded-lg border-2 ${getEventTypeColor(event.type)}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                                            <span className="font-semibold">{new Date(event.date).toLocaleDateString()}</span>
                                            <span className="text-xs uppercase font-semibold">{event.type.replace('_', ' ')}</span>
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-200 font-medium">{event.description}</p>
                                        {event.significance && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <strong>Significance:</strong> {event.significance}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeEvent(event.id)}
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
                        className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                    >
                        {isAnalyzing ? '🔍 Analyzing Timeline...' : '🔍 Analyze Temporal Proximity & Causation'}
                    </button>
                </div>
            )}

            {/* Analysis Results */}
            {timeline && (
                <div className="space-y-6">
                    {/* Temporal Proximity */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            ⏱️ Temporal Proximity Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Protected Activity</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(timeline.protectedActivityDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Termination</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(timeline.terminationDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Days Between</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {timeline.temporalProximityDays}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Causal Connection Strength:
                                <span className={`ml-2 ${getConnectionStrengthColor(timeline.causalConnectionStrength)} uppercase`}>
                                    {timeline.causalConnectionStrength}
                                </span>
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{timeline.narrative}</p>
                        </div>
                    </div>

                    {/* McDonnell Douglas Framework */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            ⚖️ McDonnell Douglas Prima Facie Case
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className={`text-2xl mr-3 ${timeline.mcDonnellDouglasAnalysis.protectedActivity ? 'text-green-600' : 'text-red-600'}`}>
                                    {timeline.mcDonnellDouglasAnalysis.protectedActivity ? '✅' : '❌'}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">1. Protected Activity</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {timeline.mcDonnellDouglasAnalysis.protectedActivityDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <span className={`text-2xl mr-3 ${timeline.mcDonnellDouglasAnalysis.adverseAction ? 'text-green-600' : 'text-red-600'}`}>
                                    {timeline.mcDonnellDouglasAnalysis.adverseAction ? '✅' : '❌'}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">2. Adverse Action</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {timeline.mcDonnellDouglasAnalysis.adverseActionDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <span className={`text-2xl mr-3 ${timeline.mcDonnellDouglasAnalysis.causalConnection ? 'text-green-600' : 'text-red-600'}`}>
                                    {timeline.mcDonnellDouglasAnalysis.causalConnection ? '✅' : '❌'}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">3. Causal Connection</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {timeline.mcDonnellDouglasAnalysis.causalConnectionRationale}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intervening Events */}
                    {timeline.interveningEvents.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                🔗 Intervening Events Supporting Causation
                            </h3>
                            <ul className="space-y-2">
                                {timeline.interveningEvents.map((event, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span className="text-gray-700 dark:text-gray-300">{event}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Export */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            📤 Export Timeline
                        </h3>
                        <button
                            onClick={() => {
                                const content = `TIMELINE ANALYSIS REPORT\n\nProtected Activity: ${new Date(timeline.protectedActivityDate).toLocaleDateString()}\nTermination: ${new Date(timeline.terminationDate).toLocaleDateString()}\nDays Between: ${timeline.temporalProximityDays}\nCausal Connection: ${timeline.causalConnectionStrength.toUpperCase()}\n\nNarrative:\n${timeline.narrative}\n\nMcDonnell Douglas Analysis:\n1. Protected Activity: ${timeline.mcDonnellDouglasAnalysis.protectedActivity ? 'YES' : 'NO'}\n   ${timeline.mcDonnellDouglasAnalysis.protectedActivityDescription}\n\n2. Adverse Action: ${timeline.mcDonnellDouglasAnalysis.adverseAction ? 'YES' : 'NO'}\n   ${timeline.mcDonnellDouglasAnalysis.adverseActionDescription}\n\n3. Causal Connection: ${timeline.mcDonnellDouglasAnalysis.causalConnection ? 'YES' : 'NO'}\n   ${timeline.mcDonnellDouglasAnalysis.causalConnectionRationale}\n\nIntervening Events:\n${timeline.interveningEvents.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'timeline-analysis.txt';
                                a.click();
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                        >
                            📄 Download Timeline Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelineBuilder;
