import React from 'react';
import { Habit } from '../types';
import { getEmoji } from '../utils/emoji';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: number) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => (
  <div
    className="flex items-center gap-3 p-4 bg-bg-card rounded-xl mb-3 cursor-pointer transition-all duration-300 hover:translate-x-1 border border-border-light shadow-card-light hover:border-primary-brand"
    onClick={() => onToggle(habit.id)}
    role="checkbox"
    aria-checked={habit.completed}
    tabIndex={0}
  >
    <div className={`w-7 h-7 border-2 border-charcoal-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${habit.completed ? 'bg-primary-brand border-primary-brand' : ''}`}>
      {habit.completed && <span className="text-white text-lg">{getEmoji('Complete')}</span>}
    </div>
    <div className="flex-1">
      <div className="font-semibold mb-1 text-text-primary">{habit.icon} {habit.name}</div>
      {habit.streak > 0 && <div className="text-sage-400 text-xs font-semibold">{getEmoji('Streak')} {habit.streak} day streak</div>}
    </div>
  </div>
);

export default HabitItem;