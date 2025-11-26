import * as React from 'react';
import { DiscoveredEvidence } from '../types';

interface EvidenceTimelineProps {
    evidence: DiscoveredEvidence[];
}

const TimelineIcon: React.FC = () => (
    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
);

const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ evidence }) => {
    if (evidence.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p>No evidence found for the selected criteria to display in a timeline.</p>
            </div>
        );
    }

    const sortedEvidence = [...evidence].sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());

    return (
        <div className="relative border-s border-gray-200 dark:border-gray-700 ml-4 mt-8">
            {sortedEvidence.map((item) => (
                <div key={item.fileId} className="mb-10 ms-6">
                    <TimelineIcon />
                    <time className="block mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        {new Date(item.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.fileName}
                        </a>
                    </h3>
                    <p className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">{item.justification}</p>
                    <div className="mt-2 text-sm">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                            {item.category}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EvidenceTimeline;
