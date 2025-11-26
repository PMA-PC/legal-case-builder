import React from 'react';
import { AppreciationEntry, AccomplishmentEntry, BoundaryEntry, QuoteEntry } from '../types';
import { getEmoji } from '../utils/emoji';

type LogEntry = AppreciationEntry | AccomplishmentEntry | BoundaryEntry | QuoteEntry;

interface LogEntryCardProps {
  entry: LogEntry;
  type: 'appreciation' | 'accomplishment' | 'boundary' | 'quote';
}

const LogEntryCard: React.FC<LogEntryCardProps> = ({ entry, type }) => {
  const date = new Date(entry.timestamp).toLocaleString();

  let title = '';
  let content = '';
  let icon = getEmoji('✨'); // Default emoji

  switch (type) {
    case 'appreciation':
      const appEntry = entry as AppreciationEntry;
      icon = getEmoji('Appreciation');
      title = `Appreciation for ${appEntry.recipient}`;
      content = appEntry.note;
      break;
    case 'accomplishment':
      const accEntry = entry as AccomplishmentEntry;
      icon = getEmoji('Accomplishment');
      title = accEntry.title;
      content = accEntry.description;
      break;
    case 'boundary':
      const boundEntry = entry as BoundaryEntry;
      icon = getEmoji('Boundary');
      title = boundEntry.title;
      content = boundEntry.description;
      break;
    case 'quote':
      const quoteEntry = entry as QuoteEntry;
      icon = getEmoji('Quote');
      title = `"${quoteEntry.text}"`;
      content = `- ${quoteEntry.author}`;
      break;
  }

  return (
    <div className="bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light animate-fadeIn">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-3xl text-primary-brand">{icon}</h4>
        <span className="text-text-secondary text-xs">{date}</span>
      </div>
      <div className="text-lg font-semibold mb-2 text-text-primary">{title}</div>
      {content && <p className="text-text-secondary whitespace-pre-wrap">{content}</p>}
    </div>
  );
};

export default LogEntryCard;