import React from 'react';
import { Program } from '../types';
import { getEmoji } from '../utils/emoji';

interface ProgramCardProps {
  program: Program;
  onStartProgram: (id: number) => void;
  onViewProgram: (id: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onStartProgram, onViewProgram }) => {
  const isActive = program.currentDay > 0 && program.currentDay < program.activities.length;
  const progressText = program.currentDay > 0 ? `${program.currentDay}/${program.activities.length} days` : 'Not started';

  return (
    <div
      className="bg-bg-card rounded-xl p-5 mb-4 border-2 border-border-light cursor-pointer transition-all duration-300 hover:border-primary-brand hover:-translate-y-0.5 shadow-card-light"
      onClick={() => onViewProgram(program.id)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${program.title} program`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="text-5xl text-primary-brand">{program.icon}</div>
        <div className="flex-1">
          <div className="text-xl font-bold mb-1 text-text-primary">{program.title}</div>
          <div className="text-sm text-text-secondary">{program.duration}</div>
        </div>
      </div>
      <div className="text-primary-brand font-semibold mt-3 text-sm">{isActive ? `${getEmoji('Streak')} ` : ''}{progressText}</div>
      {!isActive && program.currentDay === 0 && (
        <button
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 mt-3 transform hover:scale-[1.01] active:scale-[0.99]"
          onClick={(e) => { e.stopPropagation(); onStartProgram(program.id); }}
        >
          Start Program
        </button>
      )}
    </div>
  );
};

export default ProgramCard;