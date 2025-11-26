import React, { useState, useMemo } from 'react';
import { UserData, Habit, Program, GroundRule, Reminder, MoodEntry, TodoItem } from '../types';
import { getEmoji } from '../utils/emoji';
import StatCard from './StatCard';
import HabitItem from './HabitItem';
import ChallengeCard from './ChallengeCard';
import TopicCard from './TopicCard';
import TodoItemCard from './TodoItemCard';

// Data from Product Ecosystem example
const FOCUSES = [
  "Acknowledge one accomplishment you did well today!",
  "Take five deep, slow breaths!",
  "Step outside and notice your surroundings and journal the beauty you found!",
  "Write down three things you're grateful for having today",
  "Do one small act of kindness!",
  "Listen to a favorite song and enjoy the memory!",
  "Do a mindfulness stretch for 2 minutes!",
  "Journal a personal strength!",
  "Message a friend you miss!",
  "Notice something beautiful around you!"
];

interface DashboardViewProps {
  userData: UserData;
  onAddHabit: () => void;
  onToggleHabit: (id: number) => void;
  onOpenMoodLogModal: () => void; // NEW: Replaces onOpenFeelingsCheckIn and onAddMoodEntry
  onShowProgramsView: () => void;
  onShowTopicsView: () => void;
  onCompleteActivity: (programId: number) => void;
  calculateOverallStreak: () => number;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onOpenNewTopic: () => void;
  onViewTopic: (topicId: number) => void;
  onSelectResourceView: (view: string) => void;
  onOpenNewTodoModal: () => void;
  onToggleTodoComplete: (id: number) => void;
  onToggleTopicComplete: (id: number) => void; // NEW
}

const DashboardView: React.FC<DashboardViewProps> = ({
  userData,
  onAddHabit,
  onToggleHabit,
  onOpenMoodLogModal, // NEW
  onShowProgramsView,
  onShowTopicsView,
  onCompleteActivity,
  calculateOverallStreak,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onOpenNewTopic,
  onViewTopic,
  onSelectResourceView,
  onOpenNewTodoModal,
  onToggleTodoComplete,
  onToggleTopicComplete, // NEW
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const activeProgram = userData.programs.find(p => p.currentDay < p.activities.length && p.currentDay >= 0);
  const overallStreak = calculateOverallStreak();

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const timerDisplay = formatTime(userData.timerState.remainingSeconds);
  const totalDiscussionTime = formatTime(userData.timerState.totalSeconds);

  // Filter topics that have urgency High or Medium and no discussion date OR discussion date is in the future
  // NEW: Exclude completed topics
  const prominentTopics = userData.topics.filter(topic =>
    !topic.isCompleted && // Exclude completed topics
    (topic.urgency === 'High' || topic.urgency === 'Medium') &&
    (!topic.discussionDate || new Date(topic.discussionDate) > new Date())
  ).sort((a, b) => {
    // Sort High urgency first, then by earliest creation date for same urgency
    if (a.urgency === 'High' && b.urgency !== 'High') return -1;
    if (a.urgency !== 'High' && b.urgency === 'High') return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // NEW: Filter and sort upcoming/incomplete todos for the dashboard
  const upcomingTodos = userData.todos
    .filter(todo => !todo.isCompleted) // Exclude completed todos
    .sort((a, b) => {
      // Sort by due date, incomplete first
      if (!a.dueBy && b.dueBy) return 1;
      if (a.dueBy && !b.dueBy) return -1;
      if (a.dueBy && b.dueBy) {
        return new Date(a.dueBy).getTime() - new Date(b.dueBy).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Fallback to creation date
    });


  const todayFocus = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return FOCUSES[dayOfYear % FOCUSES.length];
  }, []);

  const sections = useMemo(() => ({
    quickStats: {
      title: "Quick Stats",
      icon: getEmoji('Home'),
      color: "from-pe-teal-500 to-pe-teal-600",
      description: "Overview of your progress",
    },
    activeProgram: {
      title: "Current Program",
      icon: getEmoji('Program'),
      color: "from-pe-blue-500 to-pe-indigo-500",
      description: "Continue your wellness journey",
    },
    dailyHabits: {
      title: "Daily Habits",
      icon: getEmoji('HabitComplete'),
      color: "from-pe-orange-500 to-pe-red-500",
      description: "Track your daily routines",
    },
    upcomingTodos: {
      title: "Upcoming To-Dos",
      icon: getEmoji('Todo'),
      color: "from-pe-indigo-600 to-pe-purple-600",
      description: "Your pending tasks and deadlines",
    },
    discussionTimer: {
      title: "Discussion Timer",
      icon: getEmoji('Timer'),
      color: "from-pe-green-500 to-pe-emerald-600",
      description: "Manage your communication time",
    },
    groundRules: {
      title: "Ground Rules & Reminders",
      icon: getEmoji('Quote'),
      color: "from-pe-yellow-500 to-pe-amber-500",
      description: "Essentials for healthy dialogue",
    },
    prominentTopics: {
      title: "Important Topics",
      icon: getEmoji('Topic'),
      color: "from-pe-indigo-600 to-pe-purple-600",
      description: "Discussions needing attention",
    },
    resourcesHub: {
      title: "Explore Resources",
      icon: getEmoji('Education'),
      color: "from-charcoal-700 to-charcoal-800",
      description: "Self-help, education, support, news, shop"
    }
  }), []);

  const renderSectionDetail = (sectionKey: string) => {
    switch (sectionKey) {
      case 'quickStats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={getEmoji('Streak')} number={overallStreak} label="Overall Streak" />
            <StatCard icon={getEmoji('HabitComplete')} number={userData.habits.filter(h => h.completed).length} label="Habits Done" />
            <StatCard icon={getEmoji('ActivePrograms')} number={userData.programs.filter(p => p.currentDay > 0 && p.currentDay < p.activities.length).length} label="Active Programs" />
            <StatCard icon={getEmoji('Timer')} number={Math.floor(userData.timerState.totalSeconds / 60)} label="Mins Discussed" />
          </div>
        );
      case 'activeProgram':
        return activeProgram ? (
          <ChallengeCard program={activeProgram} onCompleteActivity={onCompleteActivity} />
        ) : (
          <div className="bg-bg-card rounded-xl p-6 text-center shadow-card-light border border-border-light">
            <h3 className="text-xl font-bold text-primary-brand mb-3">No active program.</h3>
            <p className="text-text-secondary mb-4">Start a new journey or continue one from the Programs tab.</p>
            <button
              className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
              onClick={onShowProgramsView}
            >
              {getEmoji('Program')} View Programs
            </button>
          </div>
        );
      case 'dailyHabits':
        return (
          <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-brand">{getEmoji('HabitComplete')} Daily Habits</h3>
              <button
                className="text-text-primary hover:text-primary-brand transition-colors duration-200 text-2xl p-1"
                onClick={onAddHabit}
                aria-label="Add new habit"
              >
                {getEmoji('Add')}
              </button>
            </div>
            <div>
              {userData.habits.length === 0 ? (
                <p className="text-text-secondary text-center py-4">No habits yet. Click '+' to add one!</p>
              ) : (
                userData.habits.map(habit => (
                  <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
                ))
              )}
            </div>
          </div>
        );
      case 'upcomingTodos':
        return (
          <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-brand">{getEmoji('Todo')} Upcoming To-Dos</h3>
              <button
                className="text-text-primary hover:text-primary-brand transition-colors duration-200 text-2xl p-1"
                onClick={onOpenNewTodoModal}
                aria-label="Add new to-do"
              >
                {getEmoji('Add')}
              </button>
            </div>
            <div>
              {upcomingTodos.length === 0 ? (
                <p className="text-text-secondary text-center py-4">No active to-dos. Time to relax!</p>
              ) : (
                upcomingTodos.slice(0, 3).map(todo => (
                  <TodoItemCard key={todo.id} todo={todo} onToggleComplete={onToggleTodoComplete} />
                ))
              )}
            </div>
            {upcomingTodos.length > 3 && (
              <p className="text-text-secondary text-sm mt-3 text-center">... and {upcomingTodos.length - 3} more. View all in Logs tab.</p>
            )}
          </div>
        );
      case 'discussionTimer':
        return (
          <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light text-center">
            <h3 className="text-xl font-bold text-primary-brand">{getEmoji('Timer')} Discussion Timer</h3>
            <p className="text-4xl md:text-5xl font-mono font-bold mb-4 text-primary-brand">{timerDisplay}</p>
            <div className="flex gap-3 justify-center mb-4">
              {!userData.timerState.isRunning && userData.timerState.remainingSeconds > 0 && (
                <button
                  className="btn btn-primary py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
                  onClick={onStartTimer}
                >
                  Start
                </button>
              )}
              {userData.timerState.isRunning && (
                <button
                  className="btn btn-secondary py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
                  onClick={onPauseTimer}
                >
                  Pause
                </button>
              )}
              <button
                className="btn btn-secondary py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
                onClick={onResetTimer}
              >
                  Reset
              </button>
            </div>
            <p className="text-text-secondary text-sm">Today's total discussion time: {totalDiscussionTime}</p>
          </div>
        );
      case 'groundRules':
        return (
          <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light">
            <h3 className="text-xl font-bold text-primary-brand">{getEmoji('Quote')} Ground Rules & Reminders</h3>
            <div className="pt-4">
              <h4 className="font-bold text-lg mb-2 text-text-primary">Ground Rules:</h4>
              <ul className="list-disc list-inside text-text-secondary mb-4 space-y-1">
                {userData.groundRules.map((rule) => (
                  <li key={rule.id}>{rule.text}</li>
                ))}
              </ul>
              <h4 className="font-bold text-lg mb-2 text-text-primary">Communication Reminders:</h4>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {userData.communicationReminders.map((reminder) => (
                  <li key={reminder.id}>{reminder.text}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'prominentTopics':
        return (
          <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-brand">{getEmoji('Topic')} Important Topics</h3>
              <button
                className="text-text-primary hover:text-primary-brand transition-colors duration-200 text-2xl p-1"
                onClick={onOpenNewTopic}
                aria-label="Add new topic"
              >
                {getEmoji('Add')}
              </button>
            </div>
            <div>
              {prominentTopics.length === 0 ? (
                <p className="text-text-secondary text-center py-4">No urgent topics right now. Keep up the good work!</p>
              ) : (
                prominentTopics.slice(0, 3).map(topic => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-3 p-4 bg-charcoal-700 rounded-xl mb-3 cursor-pointer transition-all duration-300 hover:translate-x-1 border border-charcoal-600"
                    onClick={() => onViewTopic(topic.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View important topic: ${topic.title}`}
                  >
                     <div className="flex-1">
                        <div className="font-semibold text-text-primary">{topic.title}</div>
                        <div className="text-xs text-text-secondary">With: {topic.withPerson} - Urgency: {topic.urgency}</div>
                     </div>
                     <div className="text-xl text-primary-brand">{getEmoji('Topic')}</div>
                  </div>
                ))
              )}
              {prominentTopics.length > 0 && (
                <button
                  className="btn btn-secondary w-full justify-center py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mt-4"
                  onClick={onShowTopicsView}
                >
                  View All Topics
                </button>
              )}
            </div>
          </div>
        );
      case 'resourcesHub':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onSelectResourceView('self-help')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-blue-500 to-pe-indigo-500 text-white text-left flex flex-col justify-between h-40"
              aria-label="Go to Self-Help Assessments"
            >
              <div className="text-3xl mb-2">{getEmoji('SelfHelp')}</div>
              <div>
                <h4 className="font-bold text-lg mb-1">Self-Help & Assessments</h4>
                <p className="text-sm opacity-90">Take mental health screenings</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('education')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-green-500 to-pe-emerald-600 text-white text-left flex flex-col justify-between h-40"
              aria-label="Go to Education"
            >
              <div className="text-3xl mb-2">{getEmoji('Education')}</div>
              <div>
                <h4 className="font-bold text-lg mb-1">Education</h4>
                <p className="text-sm opacity-90">Learn about mental well-being</p>
              </div>
            </button>
            <button
              onClick={() => onSelectResourceView('support')}
              className="p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-gradient-to-br from-pe-red-500 to-pe-pink-600 text-white text-left flex flex-col justify-between h-40"
              aria-label="Go to Support & Crisis Resources"
            >
              <div className="text-3xl mb-2">{getEmoji('Support')}</div>
              <div>
                <h4 className="font-bold text-lg mb-1">Support & Crisis</h4>
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
                <h4 className="font-bold text-lg mb-1">News & Advocacy</h4>
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
                <h4 className="font-bold text-lg mb-1">Wellness Shop</h4>
                <p className="text-sm opacity-90">Curated products for well-being</p>
              </div>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto">
      {/* Can't Never Could, Be Better! */}
      <div className="bg-gradient-to-r from-pe-purple-500 to-pe-pink-500 p-6 rounded-xl text-white text-center mt-6 mb-5 shadow-card-featured animate-fadeIn">
      {/* Can't Never Could, Be Better! */}
        <h2 className="text-2xl font-bold mb-2">Today's Goal</h2>
        <p className="text-lg opacity-95">{todayFocus}</p>
      </div>

      {/* Central Diagram (Summary Cards) */}
      <div className="mb-8 bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn">
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(sections).map((key) => {
            const section = sections[key];
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(isActive ? null : key)}
                className={`p-4 rounded-lg transition-all transform text-left flex flex-col justify-between
                  ${isActive ? 'scale-105 shadow-card-hover ring-2 ring-primary-brand' : 'hover:scale-102 shadow-card-light'} 
                  bg-gradient-to-br ${section.color} text-white h-36`}
                aria-expanded={isActive}
                aria-controls={`detail-section-${key}`}
                aria-label={`Toggle detail view for ${section.title}`}
              >
                <div className="text-3xl mb-1">{section.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{section.title}</h3>
                  <p className="text-xs opacity-90">{section.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed View */}
      {activeSection && (
        <div id={`detail-section-${activeSection}`} role="region" aria-live="polite" className="bg-bg-card rounded-xl p-6 shadow-card-light mb-5 animate-fadeIn border border-border-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-brand">
              {sections[activeSection].icon} {sections[activeSection].title}
            </h2>
            <button
              onClick={() => setActiveSection(null)}
              className="text-text-secondary hover:text-primary-brand text-2xl p-1"
              aria-label="Close detailed section"
            >
              ✕
            </button>
          </div>
          {renderSectionDetail(activeSection)}
        </div>
      )}

      {/* NEW: Mood Log button, replaces old Feelings Check-in */}
      <div className="bg-bg-card rounded-xl p-6 mt-6 mb-5 text-center shadow-card-light border border-border-light">
        <h2 className="text-xl font-bold text-primary-brand mb-3">{getEmoji('FeelingsCheckIn')} Log Your Mood</h2>
        <p className="text-text-secondary mb-4">Track your emotions and understand your patterns.</p>
        <button
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
          onClick={onOpenMoodLogModal} // NEW: Call the new mood log modal handler
        >
          {getEmoji('Add')} Log Mood Now
        </button>
      </div>

    </div>
  );
};

export default DashboardView;