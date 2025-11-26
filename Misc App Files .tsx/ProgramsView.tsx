import React from 'react';
import { UserData } from '../types';
import ProgramCard from './ProgramCard';
import { getEmoji } from '../utils/emoji';

interface ProgramsViewProps {
  userData: UserData;
  onStartProgram: (id: number) => void;
  onViewProgram: (id: number) => void;
}

const ProgramsView: React.FC<ProgramsViewProps> = ({ userData, onStartProgram, onViewProgram }) => {
  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-primary-brand">{getEmoji('Program')} Training Programs</h2>
      <div>
        {userData.programs.length === 0 ? (
            <p className="text-text-secondary text-center py-8">No training programs available yet.</p>
          ) : (
            userData.programs.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                onStartProgram={onStartProgram}
                onViewProgram={onViewProgram}
              />
            ))
          )}
      </div>
    </div>
  );
};

export default ProgramsView;