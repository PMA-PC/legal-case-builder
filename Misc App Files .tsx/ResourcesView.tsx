import React from 'react';
import { getEmoji } from '../utils/emoji';
import SelfHelpView from './SelfHelpView';
import EducationView from './EducationView';
import SupportView from './SupportView';
import NewsView from './NewsView';
import ShopView from './ShopView';
import { ADHDTestRun } from './ADHDTestRun'; // NEW
import { UserData, Post, ScreeningResult } from '../types';
import { useAuth } from '../AuthContext';
import { POSTS } from './NewsView'; // Import POSTS data for NewsView

interface ResourcesViewProps {
  userData: UserData;
  activeResourceView: string | null;
  onSelectResourceView: (view: string | null) => void;
  onAddScreeningResult: (result: ScreeningResult) => void;
  onToggleReadingPost: (post: Post) => void;
  onSetViewingPost: (post: Post | null) => void;
}

const ResourcesView: React.FC<ResourcesViewProps> = ({
  userData,
  activeResourceView,
  onSelectResourceView,
  onAddScreeningResult,
  onToggleReadingPost,
  onSetViewingPost,
}) => {
  const { user } = useAuth(); // Needed for SelfHelp and News components

  const renderActiveResourceView = () => {
    switch (activeResourceView) {
      case 'self-help':
        return <SelfHelpView
          history={userData.screeningHistory}
          addResult={onAddScreeningResult}
          moods={userData.moodLog} // Pass moodLog for display
          onBack={() => onSelectResourceView(null)}
        />;
      case 'education':
        return <EducationView onBack={() => onSelectResourceView(null)} />;
      case 'support':
        return <SupportView onBack={() => onSelectResourceView(null)} />;
      case 'news':
        return <NewsView
          posts={POSTS} // Pass actual posts
          reading={userData.starredPosts}
          toggleReading={onToggleReadingPost}
          setViewing={onSetViewingPost}
          onBack={() => onSelectResourceView(null)}
        />;
      case 'shop':
        return <ShopView onBack={() => onSelectResourceView(null)} />;
      case 'adhd-explorer': // NEW case for ADHDTestRun
        return <ADHDTestRun onBack={() => onSelectResourceView(null)} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <h2 className="col-span-full text-2xl font-bold mb-4 text-primary-brand">{getEmoji('Education')} Explore Resources</h2>
            <button
              onClick={() => onSelectResourceView('self-help')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-blue-500 to-pe-indigo-500 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to Self-Help Assessments"
            >
              <div className="text-3xl mb-2">{getEmoji('SelfHelp')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Self-Help & Assessments</h3>
                <p className="text-sm opacity-90">Take mental health screenings</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('adhd-explorer')} // NEW button for ADHDTestRun
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-teal-500 to-pe-teal-600 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to ADHD Condition Explorer"
            >
              <div className="text-3xl mb-2">{getEmoji('Brain')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">ADHD Condition Explorer</h3>
                <p className="text-sm opacity-90">Understand and manage ADHD challenges</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('education')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-green-500 to-pe-emerald-600 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to Education"
            >
              <div className="text-3xl mb-2">{getEmoji('Education')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Education</h3>
                <p className="text-sm opacity-90">Learn about mental well-being</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('support')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-red-500 to-pe-pink-600 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to Support & Crisis Resources"
            >
              <div className="text-3xl mb-2">{getEmoji('Support')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Support & Crisis</h3>
                <p className="text-sm opacity-90">Find help and organizations</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('news')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-yellow-500 to-pe-amber-500 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to News & Advocacy"
            >
              <div className="text-3xl mb-2">{getEmoji('News')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">News & Advocacy</h3>
                <p className="text-sm opacity-90">Inspiring stories and updates</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('shop')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-indigo-600 to-pe-purple-600 text-white text-left h-40 flex flex-col justify-between"
              aria-label="Go to Wellness Shop"
            >
              <div className="text-3xl mb-2">{getEmoji('Shop')}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Wellness Shop</h3>
                <p className="text-sm opacity-90">Curated products for well-being</p>
              </div>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto mt-6">
      {renderActiveResourceView()}
    </div>
  );
};

export default ResourcesView;