
import React from 'react';
import { Topic } from '../types';
import { getEmoji } from '../utils/emoji';

interface TopicCardProps {
  topic: Topic;
  onView: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onEdit: (topic: Topic) => void; // NEW PROP
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onView, onToggleComplete, onEdit }) => {
  const dateCreated = new Date(topic.date).toLocaleDateString();

  const urgencyClass = {
    'Low': 'bg-sage-500',
    'Medium': 'bg-warning',
    'High': 'bg-coral-400'
  }[topic.urgency] || 'bg-charcoal-700';

  return (
    <div
      className={`bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light transition-all duration-300 ${topic.isCompleted ? 'opacity-70 border-sage-500' : 'hover:border-primary-brand hover:-translate-y-0.5'}`}
      role="button"
      tabIndex={0}
      onClick={() => onView(topic.id)}
      aria-label={`View details for ${topic.title} with ${topic.withPerson}, urgency ${topic.urgency}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-xl font-bold text-text-primary ${topic.isCompleted ? 'line-through text-text-secondary' : ''}`}>{getEmoji('Topic')} {topic.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${urgencyClass}`}>{topic.urgency}</span>
      </div>
      <p className="text-text-secondary text-sm mb-2">With: {topic.withPerson}</p>
      {topic.discussionDate && (
        <p className="text-text-secondary text-sm mb-2">
          Discussion Date: {new Date(topic.discussionDate).toLocaleDateString()}
        </p>
      )}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2"> {/* Wrapper for multiple buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(topic); }} // NEW: Edit button handler
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200
            bg-charcoal-700 text-text-primary border border-charcoal-600 hover:bg-primary-brand hover:border-primary-brand hover:text-white`}
            aria-label={`Edit topic: ${topic.title}`}
          >
            {getEmoji('Edit')} Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(topic.id); }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200
              ${topic.isCompleted ? 'bg-sage-500 text-white hover:bg-sage-600' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-primary-brand hover:border-primary-brand hover:text-white'}`}
            aria-label={topic.isCompleted ? 'Mark topic as incomplete' : 'Mark topic as complete'}
          >
            {topic.isCompleted ? getEmoji('Complete') : ''} {topic.isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;