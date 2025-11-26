import React, { useState, useMemo } from 'react';
import { UserData, Topic } from '../types';
import TopicCard from './TopicCard';
import { getEmoji } from '../utils/emoji';

interface TopicsViewProps {
  userData: UserData;
  onOpenNewTopic: () => void;
  onViewTopic: (topicId: number) => void;
  onToggleTopicComplete: (topicId: number) => void;
  onOpenEditTopicModal: (topic: Topic) => void; // NEW PROP
}

const TopicsView: React.FC<TopicsViewProps> = ({ userData, onOpenNewTopic, onViewTopic, onToggleTopicComplete, onOpenEditTopicModal }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [sortBy, setSortBy] = useState<'date' | 'urgency' | 'title'>('date'); // NEW: State for sorting criteria
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // NEW: State for sort order

  const sortedAndFilteredTopics = useMemo(() => {
    const urgencyOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

    let filtered = userData.topics.filter(topic => {
      if (filter === 'pending') return !topic.isCompleted;
      if (filter === 'completed') return topic.isCompleted;
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'urgency') {
        comparison = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else { // sortBy === 'date'
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [userData.topics, filter, sortBy, sortOrder]);


  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-primary-brand">{getEmoji('Topic')} Discussion Topics</h2>

      <button
        className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-6"
        onClick={onOpenNewTopic}
        aria-label="Add new discussion topic"
      >
        {getEmoji('Add')} Add New Topic
      </button>

      <div className="flex justify-center gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'pending' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setFilter('pending')}
          aria-selected={filter === 'pending'}
          role="tab"
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'completed' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setFilter('completed')}
          aria-selected={filter === 'completed'}
          role="tab"
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'all' ? 'bg-primary-brand text-white shadow-card-light' : 'bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600'}`}
          onClick={() => setFilter('all')}
          aria-selected={filter === 'all'}
          role="tab"
        >
          All
        </button>
      </div>

      {/* NEW: Sorting Controls */}
      <div className="flex flex-wrap justify-between gap-3 mb-6 p-4 bg-bg-card rounded-xl border border-border-light shadow-card-light">
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="sort-by" className="block text-xs font-medium text-text-secondary mb-1">Sort By:</label>
          <select
            id="sort-by"
            className="w-full p-2 bg-charcoal-700 border-2 border-charcoal-600 rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary-brand transition-all duration-300"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'urgency' | 'title')}
            aria-label="Sort topics by"
          >
            <option value="date">Date Created</option>
            <option value="urgency">Urgency</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
        <div className="flex-1 min-w-[100px]">
          <label htmlFor="sort-order" className="block text-xs font-medium text-text-secondary mb-1">Order:</label>
          <select
            id="sort-order"
            className="w-full p-2 bg-charcoal-700 border-2 border-charcoal-600 rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary-brand transition-all duration-300"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            aria-label="Sort order"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>


      <div className="topics-list" role="tabpanel">
        {sortedAndFilteredTopics.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No {filter} topics found. Add a new one!</p>
        ) : (
          sortedAndFilteredTopics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onView={onViewTopic}
              onToggleComplete={onToggleTopicComplete}
              onEdit={onOpenEditTopicModal} // NEW PROP
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopicsView;