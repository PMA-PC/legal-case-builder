import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getEmoji } from '../utils/emoji';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    } else {
      alert('Please enter your name');
      nameInputRef.current?.focus();
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  }, [name, handleStart]); // Dependency on name and handleStart is crucial here

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="bg-bg-card rounded-[20px] p-10 max-w-lg w-full text-center shadow-modal animate-fadeIn">
        <h1 className="text-4xl font-extrabold mb-3 text-primary-brand">{getEmoji('FeelingsCheckIn')} Welcome to <br/> Positive Mental Action!</h1>
        <p className="text-text-secondary text-lg mb-8">Your Personal Wellness & Communication Companion</p>

        <div className="mb-6 text-left">
          <label htmlFor="user-name" className="block mb-2 font-semibold text-sm text-text-primary">What's your name?</label>
          <input
            type="text"
            id="user-name"
            ref={nameInputRef}
            placeholder="Enter your name"
            className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300"
          onClick={handleStart}
        >
          Get Started
        </button>

        <p className="mt-6 text-xs text-text-secondary">
          {getEmoji('Warning')} All data saved locally in your browser
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;