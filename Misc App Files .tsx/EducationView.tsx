import React from 'react';
import { getEmoji } from '../utils/emoji';

interface EducationViewProps {
  onBack: () => void;
}

const EducationView: React.FC<EducationViewProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('Education')} Positive Education</h2>
    <button
      className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
      onClick={onBack}
      aria-label="Back to resources menu"
    >
      {getEmoji('Back')} Back to Resources
    </button>

    <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
      <h3 className="text-xl font-bold text-primary-brand mb-3">Understanding Mental Wellness</h3>
      <p className="text-text-secondary">
        Here you will find articles, guides, and interactive content to help you learn about various aspects of mental health,
        coping strategies, and personal growth.
      </p>
      <p className="text-text-secondary mt-3">
        Topics will include managing stress, building resilience, understanding different emotional states, and fostering positive relationships.
        Check back soon for new educational resources!
      </p>
    </div>
    <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
      <h3 className="text-xl font-bold text-primary-brand mb-3">Guided Learning Paths</h3>
      <p className="text-text-secondary">
        Explore structured learning paths on subjects like mindfulness, cognitive behavioral techniques (CBT) for beginners,
        and emotional regulation. Each path will offer a series of lessons and exercises designed to empower you with knowledge and skills.
      </p>
    </div>
  </div>
);

export default EducationView;