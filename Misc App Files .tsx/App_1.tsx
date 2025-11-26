import React, { useState, useEffect, useCallback, useMemo } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DashboardView from './components/DashboardView';
import ProgramsView from './components/ProgramsView';
import TopicsView from './components/TopicsView';
import TopicDetailView from './components/TopicDetailView';
import LogsView from './components/LogsView';
import SettingsView from './components/SettingsView';
import ResourcesView from './components/ResourcesView';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MoodLogModal from './components/MoodLogModal'; // NEW
import TopicFormModal from './components/TopicFormModal'; // Corrected import name
import NewTodoModal from './components/NewTodoModal';
import PostModal from './components/PostModal';
import LoginModal from './components/LoginModal';
import { UserData, Habit, Program, MoodEntry, Topic, TopicFormData, AppreciationEntry, AccomplishmentEntry, BoundaryEntry, QuoteEntry, GroundRule, Reminder, TimerState, TodoItem, ScreeningResult, Post } from './types';
import { checkResetTimerState, getInitialTimerState, playTimerAlert } from './utils/timer-logic';
import { AuthProvider, useAuth } from './AuthContext';
import { getPrimaryEmotionColorClass } from './utils/feelings-wheel'; // NEW

import './App.css'; // Main CSS
import './index.css'; // Tailwind CSS

// Default data for a new user
const initialUserData: UserData = {
  userName: '',
  moodLog: [],
  habits: [
    { id: 1, name: 'Drink 8 glasses of water', icon: '💧', completed: false, streak: 0 },
    { id: 2, name: 'Meditate for 10 minutes', icon: '🧘', completed: false, streak: 0 },
    { id: 3, name: 'Read for 30 minutes', icon: '📚', completed: false, streak: 0 }
  ],
  programs: [
    { id: 1, title: '7-Day Mindfulness Journey', icon: '🧘', duration: '7 days', activities: ['Day 1: Mindful Breathing', 'Day 2: Body Scan Meditation', 'Day 3: Mindful Eating', 'Day 4: Walking Meditation', 'Day 5: Loving-Kindness Meditation', 'Day 6: Gratitude Practice', 'Day 7: Silent Reflection'], currentDay: 0 },
    { id: 2, title: 'Build a Reading Habit', icon: '📖', duration: '21 days', activities: Array.from({ length: 21 }, (_, i) => `Day ${i + 1}: Read 15-30 minutes`), currentDay: 0 }
  ],
  topics: [],
  appreciations: [],
  accomplishments: [], // Added for type consistency
  boundaries: [],
  quotes: [],
  groundRules: [
    { id: 1, text: "Listen to understand, not to reply." },
    { id: 2, text: "Speak with respect and kindness." },
    { id: 3, text: "Take turns and avoid interrupting." }
  ],
  communicationReminders: [
    { id: 1, text: "Use 'I' statements to express feelings." },
    { id: 2, text: "Stay focused on the current topic." },
    { id: 3, text: "Take a break if emotions run high." }
  ],
  timerState: getInitialTimerState(),
  todos: [],
  screeningHistory: [],
  starredPosts: []
};

function AppContent() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [showMoodLogModal, setShowMoodLogModal] = useState(false); // NEW
  const [showTopicFormModal, setShowTopicFormModal] = useState(false); // Renamed from showNewTopicModal
  const [topicToEdit, setTopicToEdit] = useState<Topic | null>(null); // NEW: For editing topics
  const [showNewTodoModal, setShowNewTodoModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [timerIntervalId, setTimerIntervalId] = useState<number | null>(null);
  const [activeResourceView, setActiveResourceView] = useState<string | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  const { showLogin, setShowLogin } = useAuth(); // Destructure from useAuth

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('pm_action_user_data');
    if (savedData) {
      const parsedData: UserData = JSON.parse(savedData);
      // Ensure timerState is correctly initialized/reset for the day
      const updatedTimerState = checkResetTimerState(parsedData.timerState);
      setUserData({ ...parsedData, timerState: updatedTimerState });
    } else {
      // If no data, show welcome screen, otherwise, proceed to dashboard
      setUserData(null); // Explicitly null to show WelcomeScreen
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('pm_action_user_data', JSON.stringify(userData));
    }
  }, [userData]);

  const handleStartApp = useCallback((name: string) => {
    setUserData({ ...initialUserData, userName: name });
    setActiveView('dashboard');
  }, []);

  const updateUserData = useCallback((updater: (prev: UserData) => UserData) => {
    setUserData(prev => {
      if (!prev) return null;
      return updater(prev);
    });
  }, []);

  // --- Habit Logic ---
  const handleToggleHabit = useCallback((id: number) => {
    updateUserData(prev => {
      const updatedHabits = prev.habits.map(habit => {
        if (habit.id === id) {
          const today = new Date().toISOString().split('T')[0];
          const isCompletedToday = habit.lastCompletionDate === today;

          if (isCompletedToday) {
            // Uncompleting a habit for today
            return {
              ...habit,
              completed: false,
              streak: habit.streak > 0 ? habit.streak - 1 : 0, // Decrease streak if it was incremented today
              lastCompletionDate: undefined, // Clear last completion date for today
            };
          } else {
            // Completing a habit
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayISO = yesterday.toISOString().split('T')[0];

            let newStreak = habit.streak;
            if (habit.lastCompletionDate === yesterdayISO) {
              // Continued streak
              newStreak++;
            } else if (!habit.lastCompletionDate) {
              // First completion or streak reset
              newStreak = 1;
            } else {
              // Break in streak
              newStreak = 1;
            }

            return {
              ...habit,
              completed: true,
              streak: newStreak,
              lastCompletionDate: today,
            };
          }
        }
        return habit;
      });
      return { ...prev, habits: updatedHabits };
    });
  }, [updateUserData]);

  const handleAddHabit = useCallback(() => {
    const newHabitName = prompt("Enter new habit name:");
    if (newHabitName) {
      const newIcon = prompt(`Enter an emoji for "${newHabitName}" (e.g., 💪, 📖):`);
      updateUserData(prev => {
        const newHabit: Habit = {
          id: Date.now(),
          name: newHabitName,
          icon: newIcon || '✨',
          completed: false,
          streak: 0,
        };
        return { ...prev, habits: [...prev.habits, newHabit] };
      });
    }
  }, [updateUserData]);

  const calculateOverallStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = userData?.habits.every(h => h.completed && h.lastCompletionDate === today);
    if (!completedToday) return 0; // If any habit isn't completed today, streak is broken for overall

    let minStreak = Infinity;
    if (userData && userData.habits.length > 0) {
      for (const habit of userData.habits) {
        if (habit.streak < minStreak) {
          minStreak = habit.streak;
        }
      }
      return minStreak === Infinity ? 0 : minStreak;
    }
    return 0;
  }, [userData]);


  // --- Program Logic ---
  const handleStartProgram = useCallback((id: number) => {
    updateUserData(prev => {
      const updatedPrograms = prev.programs.map(p =>
        p.id === id ? { ...p, currentDay: 0 } : p
      );
      return { ...prev, programs: updatedPrograms };
    });
    setActiveView('dashboard'); // Go back to dashboard to see active program
  }, [updateUserData]);

  const handleCompleteActivity = useCallback((programId: number) => {
    updateUserData(prev => {
      const updatedPrograms = prev.programs.map(p => {
        if (p.id === programId && p.currentDay < p.activities.length) {
          return { ...p, currentDay: p.currentDay + 1 };
        }
        return p;
      });
      return { ...prev, programs: updatedPrograms };
    });
  }, [updateUserData]);

  const handleViewProgram = useCallback((programId: number) => {
    // For now, simply setting it as active program if needed, or navigate to a detail view if one existed
    // For this app, clicking a program card just means viewing its progress.
    // The "ChallengeCard" is for the *active* program.
    // We don't have a separate ProgramDetailView, so this action might be a no-op or a placeholder.
    console.log("Viewing program details for ID:", programId);
    // Optionally, if we had a dedicated program detail modal/view, we would open it here.
    // Since we don't, this action might be a no-op or a placeholder.
  }, []);


  // --- Mood Log / Feelings Check-In Logic (NEW) ---
  const handleSaveMoodLogEntry = useCallback((feeling: string, primaryEmotionColor: string, rating: number, comment: string) => {
    updateUserData(prev => {
      const newMoodEntry: MoodEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        feeling,
        primaryEmotionColor,
        rating,
        comment,
      };
      return { ...prev, moodLog: [...prev.moodLog, newMoodEntry] };
    });
    setShowMoodLogModal(false);
    alert(`Mood logged: ${feeling} with ${rating} stars!`);
  }, [updateUserData]);

  // --- Topic Logic ---
  const handleOpenNewTopic = useCallback(() => {
    setTopicToEdit(null); // Ensure no existing topic is pre-filled
    setShowTopicFormModal(true);
  }, []);

  // NEW: Handler to open the modal for editing an existing topic
  const handleOpenEditTopicModal = useCallback((topic: Topic) => {
    setTopicToEdit(topic);
    setShowTopicFormModal(true);
  }, []);

  // NEW: Unified handler for saving (creating or updating) topics
  const handleSaveTopicForm = useCallback((topicData: TopicFormData, id?: number) => {
    updateUserData(prev => {
      if (id) {
        // Update existing topic
        return {
          ...prev,
          topics: prev.topics.map(topic =>
            topic.id === id ? { ...topic, ...topicData } : topic
          ),
        };
      } else {
        // Create new topic
        const topicToAdd: Topic = {
          ...topicData,
          id: Date.now(),
          date: new Date().toISOString(),
          isCompleted: false, // New topics are always pending
        };
        return { ...prev, topics: [...prev.topics, topicToAdd] };
      }
    });
    setShowTopicFormModal(false);
    setTopicToEdit(null); // Clear topicToEdit after saving
  }, [updateUserData]);

  const handleViewTopic = useCallback((topicId: number) => {
    const topic = userData?.topics.find(t => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      setActiveView('topic-detail');
    }
  }, [userData]);

  const handleToggleTopicComplete = useCallback((id: number) => {
    updateUserData(prev => {
      const updatedTopics = prev.topics.map(topic => {
        if (topic.id === id) {
          return {
            ...topic,
            isCompleted: !topic.isCompleted,
            completedAt: !topic.isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return topic;
      });
      return { ...prev, topics: updatedTopics };
    });
  }, [updateUserData]);


  // --- Logs Logic (Appreciation, Accomplishment, Boundary, Quote) ---
  const handleAddLogEntry = useCallback((type: 'appreciation' | 'accomplishment' | 'boundary' | 'quote') => {
    const timestamp = new Date().toISOString();
    switch (type) {
      case 'appreciation':
        const recipient = prompt("Who is the recipient?");
        const note = prompt("What do you appreciate about them?");
        if (recipient && note) {
          updateUserData(prev => ({
            ...prev,
            appreciations: [...prev.appreciations, { id: Date.now(), timestamp, recipient, note }]
          }));
        }
        break;
      case 'accomplishment':
        const title = prompt("What is your accomplishment?");
        const description = prompt("Describe your accomplishment:");
        if (title && description) {
          updateUserData(prev => ({
            ...prev,
            accomplishments: [...prev.accomplishments, { id: Date.now(), timestamp, title, description }]
          }));
        }
        break;
      case 'boundary':
        const boundaryTitle = prompt("What is the boundary?");
        const boundaryDesc = prompt("Describe why this boundary is important:");
        if (boundaryTitle && boundaryDesc) {
          updateUserData(prev => ({
            ...prev,
            boundaries: [...prev.boundaries, { id: Date.now(), timestamp, title: boundaryTitle, description: boundaryDesc }]
          }));
        }
        break;
      case 'quote':
        const text = prompt("Enter the quote:");
        const author = prompt("Who is the author of the quote?");
        if (text && author) {
          updateUserData(prev => ({
            ...prev,
            quotes: [...prev.quotes, { id: Date.now(), timestamp, text, author }]
          }));
        }
        break;
    }
  }, [updateUserData]);

  // --- Timer Logic ---
  const handleStartTimer = useCallback(() => {
    if (!userData || userData.timerState.isRunning) return;

    updateUserData(prev => ({ ...prev, timerState: { ...prev.timerState, isRunning: true } }));

    const id = window.setInterval(() => {
      setUserData(prev => {
        if (!prev || !prev.timerState.isRunning) {
          clearInterval(id);
          return prev;
        }

        let newRemaining = prev.timerState.remainingSeconds - 1;
        let newTotal = prev.timerState.totalSeconds + 1;

        if (newRemaining <= 0) {
          playTimerAlert();
          clearInterval(id);
          return {
            ...prev,
            timerState: { ...prev.timerState, isRunning: false, remainingSeconds: 0, totalSeconds: newTotal }
          };
        }
        return {
          ...prev,
          timerState: { ...prev.timerState, remainingSeconds: newRemaining, totalSeconds: newTotal }
        };
      });
    }, 1000);
    setTimerIntervalId(id);
  }, [userData, updateUserData]);

  const handlePauseTimer = useCallback(() => {
    if (timerIntervalId !== null) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
    updateUserData(prev => ({ ...prev, timerState: { ...prev.timerState, isRunning: false } }));
  }, [timerIntervalId, updateUserData]);

  const handleResetTimer = useCallback(() => {
    if (timerIntervalId !== null) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
    updateUserData(prev => ({ ...prev, timerState: { ...prev.timerState, isRunning: false, remainingSeconds: 15 * 60 } }));
  }, [timerIntervalId, updateUserData]);

  useEffect(() => {
    // Clear interval on component unmount
    return () => {
      if (timerIntervalId !== null) {
        clearInterval(timerIntervalId);
      }
    };
  }, [timerIntervalId]);


  // --- To-Do Logic ---
  const handleOpenNewTodoModal = useCallback(() => {
    setShowNewTodoModal(true);
  }, []);

  const handleSaveNewTodo = useCallback((newTodo: Omit<TodoItem, 'id' | 'createdAt' | 'isCompleted' | 'completedAt'>) => {
    updateUserData(prev => {
      const todoToAdd: TodoItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isCompleted: false, // New todos are always pending
        ...newTodo,
      };
      return { ...prev, todos: [...prev.todos, todoToAdd] };
    });
    setShowNewTodoModal(false);
  }, [updateUserData]);

  const handleToggleTodoComplete = useCallback((id: number) => {
    updateUserData(prev => {
      const updatedTodos = prev.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            isCompleted: !todo.isCompleted,
            completedAt: !todo.isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return todo;
      });
      return { ...prev, todos: updatedTodos };
    });
  }, [updateUserData]);

  // --- Screening Logic ---
  const handleAddScreeningResult = useCallback((result: ScreeningResult) => {
    updateUserData(prev => ({
      ...prev,
      screeningHistory: [...prev.screeningHistory, result]
    }));
  }, [updateUserData]);

  // --- News & Advocacy (Posts) Logic ---
  const handleToggleReadingPost = useCallback((post: Post) => {
    updateUserData(prev => {
      const isStarred = prev.starredPosts.some(p => p.id === post.id);
      let updatedStarredPosts;
      if (isStarred) {
        updatedStarredPosts = prev.starredPosts.filter(p => p.id !== post.id);
      } else {
        updatedStarredPosts = [...prev.starredPosts, post];
      }
      return { ...prev, starredPosts: updatedStarredPosts };
    });
  }, [updateUserData]);

  const handleSetViewingPost = useCallback((post: Post | null) => {
    setViewingPost(post);
  }, []);


  if (!userData) {
    return <WelcomeScreen onStart={handleStartApp} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            userData={userData}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            onOpenMoodLogModal={() => setShowMoodLogModal(true)} // NEW
            onShowProgramsView={() => setActiveView('programs')}
            onShowTopicsView={() => setActiveView('topics')}
            onCompleteActivity={handleCompleteActivity}
            calculateOverallStreak={calculateOverallStreak}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onResetTimer={handleResetTimer}
            onOpenNewTopic={handleOpenNewTopic}
            onViewTopic={handleViewTopic}
            onSelectResourceView={setActiveResourceView}
            onOpenNewTodoModal={handleOpenNewTodoModal}
            onToggleTodoComplete={handleToggleTodoComplete}
            onToggleTopicComplete={handleToggleTopicComplete}
          />
        );
      case 'programs':
        return (
          <ProgramsView
            userData={userData}
            onStartProgram={handleStartProgram}
            onViewProgram={handleViewProgram}
          />
        );
      case 'topics':
        return (
          <TopicsView
            userData={userData}
            onOpenNewTopic={handleOpenNewTopic}
            onViewTopic={handleViewTopic}
            onToggleTopicComplete={handleToggleTopicComplete}
            onOpenEditTopicModal={handleOpenEditTopicModal} // NEW
          />
        );
      case 'topic-detail':
        return selectedTopic ? (
          <TopicDetailView topic={selectedTopic} onBack={() => setActiveView('topics')} />
        ) : (
          <div>Topic not found.</div>
        );
      case 'logs':
        return (
          <LogsView
            userData={userData}
            onOpenMoodLogModal={() => setShowMoodLogModal(true)} // NEW
            onAddLogEntry={handleAddLogEntry}
            onOpenNewTodoModal={handleOpenNewTodoModal}
            onToggleTodoComplete={handleToggleTodoComplete}
          />
        );
      case 'resources':
        return (
          <ResourcesView
            userData={userData}
            activeResourceView={activeResourceView}
            onSelectResourceView={setActiveResourceView}
            onAddScreeningResult={handleAddScreeningResult}
            onToggleReadingPost={handleToggleReadingPost}
            onSetViewingPost={handleSetViewingPost}
          />
        );
      case 'settings':
        return <SettingsView userData={userData} />;
      default:
        return <DashboardView
          userData={userData}
          onAddHabit={handleAddHabit}
          onToggleHabit={handleToggleHabit}
          onOpenMoodLogModal={() => setShowMoodLogModal(true)}
          onShowProgramsView={() => setActiveView('programs')}
          onShowTopicsView={() => setActiveView('topics')}
          onCompleteActivity={handleCompleteActivity}
          calculateOverallStreak={calculateOverallStreak}
          onStartTimer={handleStartTimer}
          onPauseTimer={handlePauseTimer}
          onResetTimer={handleResetTimer}
          onOpenNewTopic={handleOpenNewTopic}
          onViewTopic={handleViewTopic}
          onSelectResourceView={setActiveResourceView}
          onOpenNewTodoModal={handleOpenNewTodoModal}
          onToggleTodoComplete={handleToggleTodoComplete}
          onToggleTopicComplete={handleToggleTopicComplete}
        />;
    }
  };

  return (
    <>
      <Header userName={userData.userName} />
      <main className="pt-4">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} onSelectView={(view) => { setActiveView(view); setActiveResourceView(null); }} /> {/* Reset resource view when changing main tab */}

      {showMoodLogModal && (
        <MoodLogModal
          isOpen={showMoodLogModal}
          onClose={() => setShowMoodLogModal(false)}
          onSave={handleSaveMoodLogEntry}
        />
      )}

      {showTopicFormModal && (
        <TopicFormModal
          isOpen={showTopicFormModal}
          onClose={() => { setShowTopicFormModal(false); setTopicToEdit(null); }}
          onSave={handleSaveTopicForm}
          existingTopic={topicToEdit} // Pass existing topic if editing
        />
      )}

      {showNewTodoModal && (
        <NewTodoModal
          isOpen={showNewTodoModal}
          onClose={() => setShowNewTodoModal(false)}
          onSave={handleSaveNewTodo}
        />
      )}

      {viewingPost && (
        <PostModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;