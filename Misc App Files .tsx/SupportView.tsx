import React from 'react';
import { getEmoji } from '../utils/emoji';

interface SupportViewProps {
  onBack: () => void;
}

const SupportView: React.FC<SupportViewProps> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('Support')} Positive Support</h2>
    <button
      className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
      onClick={onBack}
      aria-label="Back to resources menu"
    >
      {getEmoji('Back')} Back to Resources
    </button>

    <div className="bg-crisis-red bg-opacity-20 border-2 border-crisis-red p-6 rounded-xl text-white shadow-card-light">
      <h3 className="text-2xl font-bold text-crisis-red mb-4">Crisis Resources</h3>
      <p className="text-sm text-text-secondary mb-4">If you or someone you know is in immediate danger, please call emergency services immediately.</p>
      <div className="space-y-3">
        <div className="bg-bg-card p-4 rounded-lg border border-border-light">
          <p className="font-semibold text-primary-brand">988 Suicide & Crisis Lifeline</p>
          <p className="text-text-primary">Call or text: <a href="tel:988" className="text-info hover:underline">988</a></p>
          <p className="text-xs text-text-secondary mt-1">Available 24/7 in the US.</p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-border-light">
          <p className="font-semibold text-primary-brand">Crisis Text Line</p>
          <p className="text-text-primary">Text HOME to <a href="sms:741741" className="text-info hover:underline">741741</a></p>
          <p className="text-xs text-text-secondary mt-1">Free, 24/7, confidential.</p>
        </div>
      </div>
    </div>

    <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
      <h3 className="text-2xl font-bold text-primary-brand mb-4">Organizations & Further Support</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'NAMI (National Alliance on Mental Illness)', url: 'nami.org' },
          { name: 'Mental Health America (MHA)', url: 'mhanational.org' },
          { name: 'SAMHSA (Substance Abuse and Mental Health Services Administration)', url: 'samhsa.gov' },
          { name: 'Psychology Today', url: 'psychologytoday.com' }
        ].map(org => (
          <div key={org.name} className="p-4 border-2 border-charcoal-600 rounded-lg bg-charcoal-700 hover:border-primary-brand transition-colors shadow-card-light">
            <h4 className="font-bold text-text-primary mb-1">{org.name}</h4>
            <a href={`https://${org.url}`} target="_blank" rel="noopener noreferrer" className="text-info hover:underline text-sm break-all">{org.url}</a>
            <p className="text-xs text-text-secondary mt-2">Provides education, advocacy, and support.</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SupportView;