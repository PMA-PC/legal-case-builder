import React from 'react';
import { Program } from '../types';
import { getEmoji } from '../utils/emoji';

interface ChallengeCardProps {
  program: Program;
  onCompleteActivity: (programId: number) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ program, onCompleteActivity }) => {
  const progress = (((program.currentDay + 1) / program.activities.length) * 100).toFixed(0);
  const currentActivity = program.activities[program.currentDay];

  return (
    <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 mb-5 text-white shadow-card-featured animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm opacity-90 mb-1 uppercase tracking-wider">CURRENT PROGRAM</div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">{program.title}</h3>
          <div className="text-base md:text-lg opacity-95">{currentActivity}</div>
        </div>
        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">Day {program.currentDay + 1}</div>
      </div>
      <div className="bg-white bg-opacity-20 h-2 rounded-full overflow-hidden my-4">
        <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <button
        className="btn w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={() => onCompleteActivity(program.id)}
      >
        {getEmoji('Complete')} Complete Today's Activity
      </button>
    </div>
  );
};

export default ChallengeCard;