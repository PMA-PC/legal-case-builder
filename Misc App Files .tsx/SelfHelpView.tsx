import React, { useState, useCallback } from 'react';
import { ScreeningResult, MoodEntry } from '../types';
import { getEmoji } from '../utils/emoji';
import { useAuth } from '../AuthContext';
import MoodLogCard from './MoodLogCard'; // NEW: Import MoodLogCard

// Data from Product Ecosystem example
const SCREENINGS = {
  Depression: {
    title: "Depression (PHQ-9)",
    desc: "Over the last 2 weeks, how often have you been bothered by:",
    questions: ['Little interest in doing things', 'Feeling down or hopeless', 'Sleep problems', 'Feeling tired', 'Appetite changes', 'Feeling bad about yourself', 'Trouble concentrating', 'Slowed down or restless', 'Thoughts of self-harm']
  },
  Anxiety: {
    title: "Anxiety (GAD-7)",
    desc: "Over the last 2 weeks, how often have you been bothered by:",
    questions: ['Feeling nervous, anxious or on edge', 'Not being able to stop or control worrying', 'Worrying too much about different things', 'Trouble relaxing', 'Being so restless that it is hard to sit still', 'Becoming easily annoyed or irritable', 'Feeling afraid as if something awful might happen']
  },
  PTSD: {
    title: "PTSD Screen",
    desc: "In the past month, how much were you bothered by:",
    questions: ['Disturbing memories, thoughts, or images', 'Upsetting dreams', 'Suddenly acting or feeling as if the traumatic event were happening again', 'Feeling very upset when something reminded you of the event', 'Having strong physical reactions when reminded of the event']
  }
};

const OPTIONS = [
  { text: 'Not at all', value: 0 },
  { text: 'Several days', value: 1 },
  { text: 'More than half the days', value: 2 },
  { text: 'Nearly every day', value: 3 }
];

interface SelfHelpViewProps {
  history: ScreeningResult[];
  addResult: (result: ScreeningResult) => void;
  moods: MoodEntry[]; // Now uses the new MoodEntry type
  onBack: () => void;
}

const SelfHelpView: React.FC<SelfHelpViewProps> = ({ history, addResult, moods, onBack }) => {
  const { user, setShowLogin } = useAuth();
  const [screening, setScreening] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ScreeningResult | null>(null);

  const startScreening = (name: string) => {
    if (!user && confirm('Login to save results?')) {
      setShowLogin(true);
      return;
    }
    setScreening({ name, ...SCREENINGS[name] });
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const answerQuestion = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < (screening?.questions.length || 0)) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const score = newAnswers.reduce((s, v) => s + v, 0);
      let level = '';
      if (screening.name === 'PTSD') { // 5 questions, max score 15
        level = score <= 4 ? 'Minimal' : score <= 8 ? 'Mild' : score <= 11 ? 'Moderate' : 'Severe';
      } else { // PHQ-9 (9 questions), GAD-7 (7 questions)
        level = score <= 4 ? 'Minimal' : score <= 9 ? 'Mild' : score <= 14 ? 'Moderate' : score <= 19 ? 'Moderately Severe' : 'Severe';
      }

      const res: ScreeningResult = {
        id: Date.now(),
        title: screening.title,
        score,
        level,
        date: new Date().toLocaleDateString(),
      };
      setResult(res);
      if (user) addResult(res);
    }
  };

  if (result) {
    return (
      <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn mb-4">
        <h2 className="text-2xl font-bold text-primary-brand mb-4">Results: {result.title}</h2>
        <div className="bg-charcoal-700 p-4 rounded-lg mb-4 border border-charcoal-600">
          <p className="text-lg font-semibold text-text-primary">Score: <span className="text-primary-brand">{result.score}</span> / {screening.questions.length * 3}</p>
          <p className="text-xl font-bold text-primary-brand">{result.level}</p>
          <p className="text-sm text-text-secondary mt-2">Date: {result.date}</p>
        </div>
        <button onClick={() => setScreening(null)} className="w-full btn btn-primary py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]">
          Take Another Assessment
        </button>
        <button
          className="btn btn-secondary w-full justify-center py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mt-3"
          onClick={onBack}
        >
          {getEmoji('Back')} Back to Resources
        </button>
      </div>
    );
  }

  if (screening) {
    return (
      <div className="bg-bg-card rounded-xl p-6 shadow-card-light border border-border-light animate-fadeIn mb-4">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 text-text-secondary">
            <span>Question {currentQuestionIndex + 1} of {screening.questions.length}</span>
          </div>
          <div className="w-full bg-charcoal-700 rounded-full h-2">
            <div className="bg-primary-brand h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / screening.questions.length) * 100}%` }} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-6">{screening.questions[currentQuestionIndex]}</h3>
        <div className="space-y-3">
          {OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => answerQuestion(opt.value)}
              className="w-full text-left p-4 border-2 border-charcoal-600 rounded-lg text-text-primary hover:border-primary-brand hover:bg-charcoal-700 transition-colors duration-200"
              aria-label={`Select ${opt.text} for question ${currentQuestionIndex + 1}`}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <button onClick={() => setScreening(null)} className="mt-6 text-text-secondary hover:text-primary-brand transition-colors duration-200">
          {getEmoji('Back')} Cancel Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary-brand mb-4">{getEmoji('SelfHelp')} Self-Help & Assessments</h2>
      <button
          className="btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300 mb-4"
          onClick={onBack}
          aria-label="Back to resources menu"
        >
          {getEmoji('Back')} Back to Resources
        </button>

      {user && history.length > 0 && (
        <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
          <h3 className="text-xl font-bold text-primary-brand mb-4">Your Assessment History</h3>
          {history.slice(0, 5).map(r => (
            <div key={r.id} className="flex justify-between items-center p-3 bg-charcoal-700 rounded-lg mb-2 border border-charcoal-600">
              <div>
                <p className="font-semibold text-text-primary">{r.title}</p>
                <p className="text-sm text-text-secondary">{r.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                ${r.level.includes('Minimal') ? 'bg-sage-500' :
                  r.level.includes('Mild') ? 'bg-warning' :
                  r.level.includes('Moderate') ? 'bg-orange-500' :
                  'bg-coral-400'}`
              }>
                {r.level}
              </span>
            </div>
          ))}
          {history.length > 5 && (
            <p className="text-text-secondary text-sm mt-3 text-center">... and {history.length - 5} more entries</p>
          )}
        </div>
      )}

      {user && moods.length > 0 && (
        <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
          <h3 className="text-xl font-bold text-primary-brand mb-4">Your Mood Log History</h3>
          {moods.slice(0, 5).map(m => (
            <MoodLogCard key={m.id} entry={m} /> // NEW: Use MoodLogCard
          ))}
          {moods.length > 5 && (
            <p className="text-text-secondary text-sm mt-3 text-center">... and {moods.length - 5} more entries</p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-1 gap-4">
        {Object.keys(SCREENINGS).map(name => (
          <div key={name} className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
            <h3 className="text-xl font-bold text-primary-brand mb-2">{SCREENINGS[name].title}</h3>
            <p className="text-text-secondary mb-4">{SCREENINGS[name].desc}</p>
            <button
              onClick={() => startScreening(name)}
              className="w-full btn btn-primary py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
              aria-label={`Start ${SCREENINGS[name].title} assessment`}
            >
              Start Assessment
            </button>
          </div>
        ))}
        {/* Placeholder for Mood Log resources */}
        <div className="bg-bg-card p-6 rounded-xl shadow-card-light border border-border-light">
            <h3 className="text-xl font-bold text-primary-brand mb-2">Mood Logging Resources</h3>
            <p className="text-text-secondary mb-4">
              Explore advanced mood logging techniques and concepts. You can find inspiration from resources like:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 pl-4">
              <li><a href="https://github.com/topics/mood-tracker" target="_blank" rel="noopener noreferrer" className="text-info hover:underline">GitHub Repositories for Mood Trackers</a> (e.g., projects like <span className="font-semibold text-text-primary">Nightlio</span> or similar open-source mood logs)</li>
              <li><a href="https://www.google.com/search?q=Kenny+Weiss+mood+log+pdf" target="_blank" rel="noopener noreferrer" className="text-info hover:underline">Kenny Weiss's Mood Log concepts</a> (search for available PDFs)</li>
            </ul>
            <p className="text-text-secondary mt-4">These resources can provide deeper insights into tracking and understanding emotional patterns.</p>
        </div>
      </div>
    </div>
  );
};

export default SelfHelpView;