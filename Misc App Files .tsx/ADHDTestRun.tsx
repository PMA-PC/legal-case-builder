import React, { useState, useCallback } from 'react';
import { 
  Brain, 
  Heart, 
  Clock, 
  Target, 
  Activity, 
  HelpCircle, 
  ShoppingBag, 
  X, 
  CheckCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

// Types
interface SubCondition {
  id: string;
  name: string;
  description: string;
  prevalence: string;
  coreChallenges: string[];
  clinicalBasis: string[];
  assessmentTools: string[];
  icon: React.ReactNode;
  color: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  scores: number[];
  domain: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface Resource {
  id: string;
  type: 'physical-product' | 'digital-tool' | 'exercise';
  name: string;
  description: string;
  price: string;
  features: string[];
  evidence: string;
}

// Mock Data
const ADHD_SUB_CONDITIONS: SubCondition[] = [
  {
    id: "executive-function",
    name: "Executive Function Challenges",
    description: "Difficulties with cognitive processes that help manage thoughts, actions, and emotions to achieve goals.",
    prevalence: "Affects 89% of adults with ADHD",
    coreChallenges: [
      "Working memory limitations",
      "Poor planning and organization",
      "Difficulty task initiation",
      "Time management struggles",
      "Problem-solving challenges",
      "Cognitive flexibility issues"
    ],
    clinicalBasis: ["Barkley EF Scale", "DSM-5 Criterion A"],
    assessmentTools: ["Barkley Deficits in Executive Functioning Scale"],
    icon: <Brain className="w-5 h-5" />,
    color: "blue"
  },
  {
    id: "emotional-dysregulation",
    name: "Emotional Dysregulation",
    description: "Intense, rapid emotional responses and difficulty managing emotional reactions appropriately.",
    prevalence: "Affects 70% of adults with ADHD",
    coreChallenges: [
      "Quick temper or irritability",
      "Emotional overreactivity",
      "Difficulty calming down",
      "Mood lability",
      "Rejection sensitive dysphoria"
    ],
    clinicalBasis: ["Barkley Emotional Impulsivity Research"],
    assessmentTools: ["Emotion Regulation Questionnaire"],
    icon: <Heart className="w-5 h-5" />,
    color: "red"
  },
  {
    id: "time-blindness",
    name: "Time Perception Challenges",
    description: "Difficulty perceiving, estimating, and managing time effectively, often described as 'time blindness'.",
    prevalence: "Affects 80% of adults with ADHD",
    coreChallenges: [
      "Chronic lateness",
      "Poor time estimation",
      "Difficulty with future planning",
      "Procrastination",
      "Missed deadlines"
    ],
    clinicalBasis: ["Barkley Time Perception Studies"],
    assessmentTools: ["Time Perception Questionnaire"],
    icon: <Clock className="w-5 h-5" />,
    color: "purple"
  },
  {
    id: "attention-regulation",
    name: "Attention Regulation Issues",
    description: "Difficulty controlling focus, either struggling to maintain attention or becoming hyperfocused.",
    prevalence: "Affects 95% of adults with ADHD",
    coreChallenges: [
      "Easy distractibility",
      "Difficulty sustaining attention",
      "Hyperfocus on interesting tasks",
      "Mental restlessness",
      "Task switching difficulties"
    ],
    clinicalBasis: ["DSM-5 Inattention Criteria"],
    assessmentTools: ["Conners Continuous Performance Test"],
    icon: <Target className="w-5 h-5" />,
    color: "green"
  }
];

const EXECUTIVE_FUNCTION_QUIZ: Quiz = {
  id: "executive-function-assessment",
  title: "Executive Function Screening",
  description: "Based on Barkley Deficits in Executive Functioning Scale (BDEFS)",
  questions: [
    {
      id: "ef-1",
      question: "How often do you forget appointments, commitments, or tasks unless you write them down immediately?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      scores: [0, 1, 2, 3, 4],
      domain: "Working Memory"
    },
    {
      id: "ef-2",
      question: "How often do you have difficulty getting started on tasks, even when they're important?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      scores: [0, 1, 2, 3, 4],
      domain: "Task Initiation"
    },
    {
      id: "ef-3",
      question: "How often do you misplace items like keys, phone, or glasses?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      scores: [0, 1, 2, 3, 4],
      domain: "Organization"
    }
  ]
};

const EXECUTIVE_FUNCTION_RESOURCES: Resource[] = [
  {
    id: 'weekly-pill-organizer',
    type: 'physical-product',
    name: 'Weekly Pill Organizer with Timer',
    description: '7-day medication organizer with built-in digital timer and alarm reminders.',
    price: '$24.99',
    features: [
      'Daily AM/PM/Midday compartments',
      'Programmable reminder alarms',
      'Locking compartments'
    ],
    evidence: 'Improves medication adherence by 67%'
  },
  {
    id: 'time-timer',
    type: 'physical-product',
    name: 'Time Timer - Visual Task Timer',
    description: 'Unique visual timer that shows elapsed time with disappearing red disk.',
    price: '$29.99',
    features: [
      'Visual time representation',
      '1-inch to 60-minute settings',
      'Audible optional alarm'
    ],
    evidence: 'Improves time awareness in 82% of ADHD users'
  },
  {
    id: 'two-minute-rule',
    type: 'exercise',
    name: 'Two-Minute Rule Practice',
    description: 'Build task initiation habits by immediately doing tasks that take less than two minutes.',
    price: 'Free',
    features: [
      'Immediate implementation',
      'No special tools needed',
      'Builds momentum'
    ],
    evidence: '85% success with immediate implementation'
  }
];

// Main Component
interface ADHDTestRunProps {
  onBack: () => void;
}

// Fix: Ensure the functional component explicitly returns JSX for all branches.
export const ADHDTestRun: React.FC<ADHDTestRunProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'sub-condition' | 'quiz' | 'results' | 'resources'>('overview');
  const [selectedSubCondition, setSelectedSubCondition] = useState<SubCondition | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Renamed for clarity
  const [quizResultScore, setQuizResultScore] = useState<number | null>(null);
  const [quizResultLevel, setQuizResultLevel] = useState<string | null>(null);

  const currentQuiz = EXECUTIVE_FUNCTION_QUIZ; // Assuming this is the only quiz for now

  const handleSubConditionSelect = useCallback((subCondition: SubCondition) => {
    setSelectedSubCondition(subCondition);
    setCurrentView('sub-condition');
  }, []);

  const handleTakeQuiz = useCallback(() => {
    if (!selectedSubCondition) return;
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizResultScore(null);
    setQuizResultLevel(null);
    setCurrentView('quiz');
  }, [selectedSubCondition]);

  // Fix: Completed the handleAnswerSelect function definition and logic.
  const handleAnswerSelect = useCallback((questionId: string, selectedValue: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedValue }));

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuiz.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Quiz finished
      // Calculate total score including the last selected answer
      const totalScore = Object.values({ ...quizAnswers, [questionId]: selectedValue }).reduce((sum, score) => sum + score, 0);
      setQuizResultScore(totalScore);

      // Determine severity level (example logic for EXECUTIVE_FUNCTION_QUIZ)
      let level = '';
      const maxPossibleScore = currentQuiz.questions.length * 4; // Each question has max score 4
      if (totalScore <= maxPossibleScore * 0.25) level = 'Minimal';
      else if (totalScore <= maxPossibleScore * 0.50) level = 'Mild';
      else if (totalScore <= maxPossibleScore * 0.75) level = 'Moderate';
      else level = 'Severe';
      setQuizResultLevel(level);

      setCurrentView('results');
    }
  }, [currentQuestionIndex, quizAnswers, currentQuiz.questions.length, currentQuiz.questions]);

  const handleViewResources = useCallback(() => {
    setCurrentView('resources');
  }, []);

  const handleResetExplorer = useCallback(() => {
    setCurrentView('overview');
    setSelectedSubCondition(null);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizResultScore(null);
    setQuizResultLevel(null);
  }, []);

  // --- Render Logic ---
  if (currentView === 'quiz' && selectedSubCondition) {
    const question = currentQuiz.questions[currentQuestionIndex];
    return (
      <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn mb-4">
        <h2 className="text-2xl font-bold text-primary-brand mb-4">{currentQuiz.title}</h2>
        <div className="text-sm text-text-secondary mb-4">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</div>
        <div className="w-full bg-charcoal-700 rounded-full h-2 mb-6">
          <div className="bg-primary-brand h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }} />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(question.id, question.scores[idx])}
              className="w-full text-left p-4 border-2 border-charcoal-600 rounded-lg text-text-primary hover:border-primary-brand hover:bg-charcoal-700 transition-colors duration-200"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mt-6"
          onClick={handleResetExplorer}
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Quiz
        </button>
      </div>
    );
  } else if (currentView === 'results' && selectedSubCondition && quizResultScore !== null && quizResultLevel !== null) {
    const maxPossibleScore = currentQuiz.questions.length * 4;
    return (
      <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn mb-4">
        <h2 className="text-2xl font-bold text-primary-brand mb-4">Quiz Results: {selectedSubCondition.name}</h2>
        <div className="bg-charcoal-700 p-4 rounded-lg mb-4 border border-charcoal-600">
          <p className="text-lg font-semibold text-text-primary">Your Score: <span className="text-primary-brand">{quizResultScore}</span> / {maxPossibleScore}</p>
          <p className="text-xl font-bold text-primary-brand">Severity Level: {quizResultLevel}</p>
          <p className="text-sm text-text-secondary mt-2">Based on {currentQuiz.title}</p>
        </div>
        <button
          onClick={handleViewResources}
          className="w-full btn btn-primary py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-3"
        >
          View Recommended Resources
        </button>
        <button
          onClick={handleResetExplorer}
          className="btn btn-secondary w-full justify-center py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explorer
        </button>
      </div>
    );
  } else if (currentView === 'resources' && selectedSubCondition) {
    const resourcesToShow = selectedSubCondition.id === 'executive-function' ? EXECUTIVE_FUNCTION_RESOURCES : []; // Expand this with more resources
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-primary-brand mb-4">Resources for {selectedSubCondition.name}</h2>
        <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={handleResetExplorer}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explorer
        </button>

        {resourcesToShow.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No specific resources found for this condition yet. Please check back later!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourcesToShow.map(resource => (
              <div key={resource.id} className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
                <div className="flex items-center gap-3 mb-3">
                  {resource.type === 'physical-product' && <ShoppingBag className="w-6 h-6 text-primary-brand" />}
                  {resource.type === 'digital-tool' && <Activity className="w-6 h-6 text-primary-brand" />}
                  {resource.type === 'exercise' && <CheckCircle className="w-6 h-6 text-primary-brand" />}
                  <h3 className="text-xl font-bold text-text-primary">{resource.name}</h3>
                </div>
                <p className="text-text-secondary mb-3">{resource.description}</p>
                <div className="text-sm text-text-primary mb-2">
                  <span className="font-semibold">Price:</span> {resource.price}
                </div>
                <ul className="list-disc list-inside text-text-secondary text-sm mb-3 pl-4">
                  {resource.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
                </ul>
                <p className="text-xs text-text-secondary mb-4">
                  <span className="font-semibold">Evidence/Benefit:</span> {resource.evidence}
                </p>
                {/* Add a button to "Learn More" or "Buy Now" if applicable */}
                <button
                  className="btn btn-primary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Learn More <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else if (currentView === 'sub-condition' && selectedSubCondition) {
    return (
      <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn">
        <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={handleResetExplorer}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Conditions
        </button>
        <div className={`flex items-center gap-3 mb-4 text-${selectedSubCondition.color}-500`}>
          {selectedSubCondition.icon}
          <h2 className="text-2xl font-bold text-primary-brand">{selectedSubCondition.name}</h2>
        </div>
        <p className="text-text-secondary mb-4">{selectedSubCondition.description}</p>
        <p className="text-sm text-text-primary mb-6"><span className="font-semibold">Prevalence:</span> {selectedSubCondition.prevalence}</p>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-3">Core Challenges:</h3>
          <ul className="list-disc list-inside text-text-secondary space-y-1 pl-4">
            {selectedSubCondition.coreChallenges.map((challenge, idx) => (
              <li key={idx}>{challenge}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-3">Clinical Basis:</h3>
          <ul className="list-disc list-inside text-text-secondary space-y-1 pl-4">
            {selectedSubCondition.clinicalBasis.map((basis, idx) => (
              <li key={idx}>{basis}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-3">Relevant Assessment Tools:</h3>
          <ul className="list-disc list-inside text-text-secondary space-y-1 pl-4">
            {selectedSubCondition.assessmentTools.map((tool, idx) => (
              <li key={idx}>{tool}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleTakeQuiz}
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-3"
        >
          Take a Quick Assessment
        </button>
        <button
          onClick={handleViewResources}
          className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
        >
          View Resources
        </button>
      </div>
    );
  } else { // Default view: 'overview'
    return (
      <div className="space-y-6 animate-fadeIn">
        <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={onBack}
          aria-label="Back to resources menu"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </button>

        <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('Brain')} ADHD Condition Explorer</h2>
        <p className="text-text-secondary mb-6">
          Explore different aspects and challenges related to ADHD. Select a sub-condition below to learn more, take a quick assessment, and find tailored resources.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADHD_SUB_CONDITIONS.map((condition) => (
            <button
              key={condition.id}
              onClick={() => handleSubConditionSelect(condition)}
              className={`p-6 rounded-xl transition-all transform hover:scale-102 shadow-card-light bg-bg-card border border-border-light text-left flex flex-col justify-between h-40 group hover:border-primary-brand`}
            >
              <div className={`text-4xl mb-2 text-${condition.color}-500 group-hover:text-primary-brand transition-colors`}>{condition.icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-text-primary group-hover:text-primary-brand transition-colors">{condition.name}</h3>
                <p className="text-sm text-text-secondary opacity-90">{condition.description.split('.')[0]}.</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
};