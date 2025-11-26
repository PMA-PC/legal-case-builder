import React from 'react';
import { MoodEntry } from '../types';
import { getEmoji } from '../utils/emoji';

interface MoodLogCardProps {
  entry: MoodEntry;
}

const MoodLogCard: React.FC<MoodLogCardProps> = ({ entry }) => {
  const date = new Date(entry.date).toLocaleString();

  return (
    <div className={`bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light animate-fadeIn overflow-hidden`}>
      <div className={`-mx-5 -mt-5 mb-4 p-4 rounded-t-xl text-white ${entry.primaryEmotionColor}`}>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xl md:text-2xl font-bold">{getEmoji('FeelingsCheckIn')} {entry.feeling}</h4>
          <div className="text-base text-white/80" aria-label={`${entry.rating} out of 5 stars`}>
            {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
          </div>
        </div>
        <span className="text-xs text-white/70">{date}</span>
      </div>
      
      {entry.comment && <p className="text-text-secondary whitespace-pre-wrap mt-3">{entry.comment}</p>}
    </div>
  );
};

export default MoodLogCard;