import React, { useState } from 'react';
import { UserData } from '../types';
// import JournalEntryCard from './JournalEntryCard'; // REMOVED
import MoodLogCard from './MoodLogCard'; // NEW
import LogEntryCard from './LogEntryCard';
import TodoItemCard from './TodoItemCard';
import { getEmoji } from '../utils/emoji';

interface LogsViewProps {
  userData: UserData;
  onOpenMoodLogModal: () => void; // NEW PROP
  onAddLogEntry: (type: 'appreciation' | 'accomplishment' | 'boundary' | 'quote') => void;
  onOpenNewTodoModal: () => void;
  onToggleTodoComplete: (id: number) => void;
}

const LogsView: React.FC<LogsViewProps> = ({ userData, onOpenMoodLogModal, onAddLogEntry, onOpenNewTodoModal, onToggleTodoComplete }) => {
  const [activeTab, setActiveTab] = useState<'mood-log' | 'appreciation' | 'accomplishment' | 'boundary' | 'quote' | 'todo'>('mood-log'); // RENAMED 'feelings' to 'mood-log'

  const renderContent = () => {
    switch (activeTab) {
      case 'mood-log': // NEW: Mood Log tab content
        const sortedMoodLogs = [...userData.moodLog].reverse();
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={onOpenMoodLogModal} // NEW: Call the new mood log modal handler
              aria-label="Add new mood log entry"
            >
              {getEmoji('Add')} New Mood Entry
            </button>
            {sortedMoodLogs.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No mood entries yet. Log your first mood!</p>
            ) : (
              sortedMoodLogs.map(entry => (
                <MoodLogCard key={entry.id} entry={entry} /> // NEW: Use MoodLogCard
              ))
            )}
          </>
        );
      case 'appreciation':
        const sortedAppreciations = [...userData.appreciations].reverse();
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={() => onAddLogEntry('appreciation')}
              aria-label="Add new appreciation entry"
            >
              {getEmoji('Add')} New Appreciation
            </button>
            {sortedAppreciations.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No appreciations logged yet.</p>
            ) : (
              sortedAppreciations.map(entry => (
                <LogEntryCard key={entry.id} entry={entry} type="appreciation" />
              ))
            )}
          </>
        );
      case 'accomplishment':
        const sortedAccomplishments = [...userData.accomplishments].reverse();
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={() => onAddLogEntry('accomplishment')}
              aria-label="Add new accomplishment entry"
            >
              {getEmoji('Add')} New Accomplishment
            </button>
            {sortedAccomplishments.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No accomplishments logged yet.</p>
            ) : (
              sortedAccomplishments.map(entry => (
                <LogEntryCard key={entry.id} entry={entry} type="accomplishment" />
              ))
            )}
          </>
        );
      case 'boundary':
        const sortedBoundaries = [...userData.boundaries].reverse();
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={() => onAddLogEntry('boundary')}
              aria-label="Add new boundary entry"
            >
              {getEmoji('Add')} New Boundary
            </button>
            {sortedBoundaries.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No boundaries set yet.</p>
            ) : (
              sortedBoundaries.map(entry => (
                <LogEntryCard key={entry.id} entry={entry} type="boundary" />
              ))
            )}
          </>
        );
      case 'quote':
        const sortedQuotes = [...userData.quotes].reverse();
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={() => onAddLogEntry('quote')}
              aria-label="Add new quote entry"
            >
              {getEmoji('Add')} New Quote
            </button>
            {sortedQuotes.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No quotes saved yet.</p>
            ) : (
              sortedQuotes.map(entry => (
                <LogEntryCard key={entry.id} entry={entry} type="quote" />
              ))
            )}
          </>
        );
      case 'todo':
        const sortedTodos = [...userData.todos]
          .filter(todo => !todo.isCompleted) // Filter out completed todos
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return (
          <>
            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-4"
              onClick={onOpenNewTodoModal}
              aria-label="Add new to-do item"
            >
              {getEmoji('Add')} New To-Do
            </button>
            {sortedTodos.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No active to-do items yet. Time to get organized!</p>
            ) : (
              sortedTodos.map(todo => (
                <TodoItemCard key={todo.id} todo={todo} onToggleComplete={onToggleTodoComplete} />
              ))
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-primary-brand">{getEmoji('Logs')} Activity Logs</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'mood-log' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('mood-log')}
          aria-selected={activeTab === 'mood-log'}
          role="tab"
        >
          Mood Log
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'appreciation' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('appreciation')}
          aria-selected={activeTab === 'appreciation'}
          role="tab"
        >
          Appreciation
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'accomplishment' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('accomplishment')}
          aria-selected={activeTab === 'accomplishment'}
          role="tab"
        >
          Accomplishments
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'boundary' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('boundary')}
          aria-selected={activeTab === 'boundary'}
          role="tab"
        >
          Boundaries
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'quote' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('quote')}
          aria-selected={activeTab === 'quote'}
          role="tab"
        >
          Quotes
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'todo' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setActiveTab('todo')}
          aria-selected={activeTab === 'todo'}
          role="tab"
        >
          To-Dos
        </button>
      </div>

      <div className="log-content-area" role="tabpanel">
        {renderContent()}
      </div>
    </div>
  );
};

export default LogsView;