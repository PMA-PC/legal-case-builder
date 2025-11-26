import React from 'react';
import { Topic } from '../types';
import { getEmoji } from '../utils/emoji';

interface TopicDetailViewProps {
  topic: Topic;
  onBack: () => void;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({ topic, onBack }) => {
  const dateCreated = new Date(topic.date).toLocaleString();
  const discussionDate = topic.discussionDate ? new Date(topic.discussionDate).toLocaleDateString() : 'Not scheduled';

  const urgencyClass = {
    'Low': 'bg-sage-500',    // Green for Low
    'Medium': 'bg-warning', // Amber for Medium
    'High': 'bg-coral-400' // Coral for High
  }[topic.urgency] || 'bg-charcoal-700'; // Fallback

  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto animate-fadeIn">
      <button
        className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 mt-6 mb-4 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
        onClick={onBack}
        aria-label="Back to topics list"
      >
        {getEmoji('Back')} Back to Topics
      </button>

      <div className="bg-bg-card rounded-xl p-6 mb-4 border border-border-light shadow-card-light">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-brand">{getEmoji('Topic')} {topic.title}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${urgencyClass}`}>{topic.urgency}</span>
        </div>

        <div className="text-text-secondary text-sm mb-3">
          <p><strong>With:</strong> <span className="text-text-primary">{topic.withPerson}</span></p>
          <p><strong>Categories:</strong> {topic.categories.length > 0 ? <span className="text-text-primary">{topic.categories.join(', ')}</span> : 'None'}</p>
          <p><strong>Discussion Date:</strong> <span className="text-text-primary">{discussionDate}</span></p>
          <p><strong>Created:</strong> <span className="text-text-primary">{dateCreated}</span></p>
        </div>

        {topic.notes && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <h3 className="text-lg font-bold mb-2 text-text-primary">Notes:</h3>
            <p className="text-text-secondary whitespace-pre-wrap">{topic.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetailView;