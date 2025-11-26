import React from 'react';
import { Post } from '../types';
import { getEmoji } from '../utils/emoji';
import { useAuth } from '../AuthContext';

// Data from Product Ecosystem example
export const POSTS: Post[] = [ // Export POSTS for use in App.tsx
  { id: '1', title: 'Welcome to PMAction', content: 'Your journey to wellness starts here. Take small steps every day to cultivate a positive mental state and improve your overall well-being. We are here to support you with tools, resources, and a community focus.', author: 'PMAction Team', date: 'Oct 26, 2023', tags: ['welcome'] },
  { id: '2', title: '5 Mindfulness Tips for Daily Life', content: '1. Breathe deeply: Take a few moments each day to focus on your breath.\n2. Body scan: Notice sensations in your body without judgment.\n3. Walk mindfully: Pay attention to each step, the air, the sounds.\n4. Use 5-4-3-2-1 technique: Name 5 things you can see, 4 things you can hear, 3 things you can feel, 2 things you can smell, and 1 thing you can taste.\n5. Listen fully: When in conversation, truly listen without preparing your response.', author: 'Jane Doe', date: 'Oct 27, 2023', tags: ['mindfulness', 'tips'] },
  { id: '3', title: 'The Power of Gratitude Journaling', content: 'A gratitude journal can transform your outlook by shifting your focus to the positive aspects of your life. Regularly writing down things you are grateful for can reduce stress, improve sleep, and boost overall happiness. Start with just three things each day, no matter how small.', author: 'Dr. Emily White', date: 'Nov 1, 2023', tags: ['gratitude', 'journaling'] },
  { id: '4', title: 'Setting Healthy Boundaries for Mental Well-being', content: 'Establishing clear boundaries is crucial for protecting your mental and emotional health. Learn to say no, communicate your needs effectively, and prioritize your own well-being. This can prevent burnout and foster healthier relationships.', author: 'Sarah Lee', date: 'Nov 5, 2023', tags: ['boundaries', 'self-care'] }
];

interface NewsViewProps {
  posts: Post[];
  reading: Post[];
  toggleReading: (post: Post) => void;
  setViewing: (post: Post | null) => void;
  onBack: () => void;
}

const NewsView: React.FC<NewsViewProps> = ({ posts, reading, toggleReading, setViewing, onBack }) => {
  const { user } = useAuth(); // Needed for starring posts

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('News')} Advocacy & News</h2>
      <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={onBack}
          aria-label="Back to resources menu"
        >
          {getEmoji('Back')} Back to Resources
        </button>

      {posts.map(post => ( // Use posts prop here
        <div key={post.id} className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-text-primary">{post.title}</h3>
            {user && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleReading(post); }}
                className="text-2xl text-pe-yellow-400 p-1 transform hover:scale-125 active:scale-95 transition-transform duration-200"
                aria-label={reading.some(p => p.id === post.id) ? 'Unstar post' : 'Star post'}
              >
                {reading.some(p => p.id === post.id) ? getEmoji('Star') : '☆'}
              </button>
            )}
          </div>
          <p className="text-sm text-text-secondary mb-3">By {post.author} • {post.date}</p>
          <p className="mb-4 whitespace-pre-line text-text-primary">{post.content.slice(0, 150)}...</p>
          <button
            onClick={() => setViewing(post)}
            className="text-primary-brand hover:underline font-semibold text-sm flex items-center gap-1"
            aria-label={`Read more about ${post.title}`}
          >
            Read more <span className="text-lg rotate-180">{getEmoji('Back')}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NewsView;