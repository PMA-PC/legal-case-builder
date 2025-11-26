import React, { useState, useEffect, useRef } from 'react';
import { getEmoji } from '../utils/emoji';
import { FEELINGS_WHEEL_DATA, getSecondaryEmotions, getDetailedFeelings, getPrimaryEmotionColorClass } from '../utils/feelings-wheel';

interface MoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feeling: string, primaryEmotionColor: string, rating: number, comment: string) => void;
}

const MoodLogModal: React.FC<MoodLogModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1); // 1: Primary, 2: Secondary, 3: Detailed, 4: Rating/Notes
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState<string | null>(null); // NEW: Store color
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);
  const [selectedDetailedFeeling, setSelectedDetailedFeeling] = useState<string | null>(null);
  const [moodRating, setMoodRating] = useState(0); // 1-5 stars
  const [comment, setComment] = useState('');
  
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset all states when modal opens
      setStep(1);
      setSelectedPrimary(null);
      setSelectedPrimaryColor(null);
      setSelectedSecondary(null);
      setSelectedDetailedFeeling(null);
      setMoodRating(0);
      setComment('');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Trap focus within the modal and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      } else if (event.key === 'Escape') {
        // Allow escape to go back one step or close modal at step 1
        if (step > 1) {
          handleBack();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, step, selectedPrimary]); // Added selectedPrimary for dependency on color class

  const handleSelectPrimary = (feelingName: string) => {
    setSelectedPrimary(feelingName);
    setSelectedPrimaryColor(getPrimaryEmotionColorClass(feelingName));
    setStep(2);
  };

  const handleSelectSecondary = (feelingName: string) => {
    setSelectedSecondary(feelingName);
    setStep(3);
    // Automatically focus the first detailed feeling button if available
    setTimeout(() => {
      const firstDetailedButton = modalRef.current?.querySelector('.detailed-feeling-button') as HTMLElement;
      firstDetailedButton?.focus();
    }, 100);
  };

  const handleSelectDetailed = (feelingName: string) => {
    setSelectedDetailedFeeling(feelingName);
    setStep(4);
    // Focus on mood rating or comment textarea if available
    setTimeout(() => {
      const firstRatingButton = modalRef.current?.querySelector('.mood-rating-button') as HTMLElement;
      if (firstRatingButton) {
        firstRatingButton.focus();
      } else {
        commentTextareaRef.current?.focus();
      }
    }, 100);
  };

  const handleSave = () => {
    if (!selectedDetailedFeeling || !selectedPrimaryColor || moodRating === 0) {
      alert('Please complete all selections (Feeling, Rating).');
      return;
    }
    onSave(selectedDetailedFeeling, selectedPrimaryColor, moodRating, comment);
    onClose(); // Close modal after saving
  };

  const handleBack = () => {
    if (step === 4) {
      setMoodRating(0);
      setComment('');
      setStep(3);
      // Focus on the last selected detailed feeling
      setTimeout(() => {
        const lastDetailedButton = modalRef.current?.querySelector(`button[aria-pressed="true"]`) as HTMLElement;
        lastDetailedButton?.focus();
      }, 100);
    } else if (step === 3) {
      setSelectedDetailedFeeling(null);
      setStep(2);
      // Focus on the last selected secondary feeling
      setTimeout(() => {
        const lastSecondaryButton = modalRef.current?.querySelector(`button[aria-pressed="true"]`) as HTMLElement;
        lastSecondaryButton?.focus();
      }, 100);
    } else if (step === 2) {
      setSelectedSecondary(null);
      setSelectedPrimary(null);
      setSelectedPrimaryColor(null);
      setStep(1);
      // Focus on the last selected primary feeling
      setTimeout(() => {
        const lastPrimaryButton = modalRef.current?.querySelector(`button[aria-pressed="true"]`) as HTMLElement;
        lastPrimaryButton?.focus();
      }, 100);
    } else if (step === 1) {
      onClose(); // Close modal if at first step and back is pressed
    }
  };

  if (!isOpen) return null;

  const currentPrimaryColorClass = selectedPrimaryColor || 'bg-gradient-to-br from-charcoal-700 to-charcoal-800'; // Fallback color

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] p-5 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="mood-log-title">
      <div ref={modalRef} className={`bg-bg-card rounded-[20px] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-modal animate-fadeIn transition-all duration-300 ${currentPrimaryColorClass}`}>
        <div className="flex justify-between items-center mb-5 text-white">
          <h3 id="mood-log-title" className="text-xl font-bold">{getEmoji('FeelingsCheckIn')} Log Your Mood (Step {step}/4)</h3>
          <button className="text-white text-3xl cursor-pointer p-0 w-8 h-8 bg-transparent border-none leading-none" onClick={onClose} aria-label="Close mood log modal">×</button>
        </div>

        {step > 1 && (
          <button
            onClick={handleBack}
            className="mb-4 btn btn-secondary py-2 px-4 rounded-xl font-semibold text-sm flex items-center gap-1 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300"
            aria-label="Go back to previous step"
          >
            {getEmoji('Back')} Back
          </button>
        )}

        {step === 1 && (
          <div className="mb-6 text-left">
            <label className="block mb-4 font-semibold text-base text-white">1. Select a Primary Emotion:</label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {FEELINGS_WHEEL_DATA.map(pFeeling => (
                <button
                  key={pFeeling.name}
                  className={`py-4 px-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 text-center
                    ${selectedPrimary === pFeeling.name ? 'bg-opacity-40 ring-2 ring-white shadow-lg' : 'hover:bg-opacity-30'}`}
                  onClick={() => handleSelectPrimary(pFeeling.name)}
                  aria-pressed={selectedPrimary === pFeeling.name}
                  style={{ backgroundColor: selectedPrimary === pFeeling.name ? pFeeling.colorClass : undefined }}
                  title={pFeeling.name} {/* NEW: Tooltip for primary emotion */}
                >
                  <div className="text-4xl mb-1">{getEmoji(pFeeling.emoji)}</div>
                  {pFeeling.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedPrimary && (
          <div className="mb-6 text-left">
            <label className="block mb-4 font-semibold text-base text-white">2. Narrow down (Secondary Emotion):</label>
            <div className="grid grid-cols-2 gap-3">
              {getSecondaryEmotions(selectedPrimary).map(sFeeling => (
                <button
                  key={sFeeling.name}
                  className={`py-4 px-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-xl text-white font-semibold cursor-pointer transition-all duration-300 text-center
                    ${selectedSecondary === sFeeling.name ? 'bg-opacity-40 ring-2 ring-white shadow-lg' : 'hover:bg-opacity-30'}`}
                  onClick={() => handleSelectSecondary(sFeeling.name)}
                  aria-pressed={selectedSecondary === sFeeling.name}
                  title={sFeeling.name} {/* NEW: Tooltip for secondary emotion */}
                >
                  {sFeeling.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedPrimary && selectedSecondary && (
          <div className="mb-6 text-left">
            <label className="block mb-4 font-semibold text-base text-white">3. Select a Detailed Feeling:</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {getDetailedFeelings(selectedPrimary, selectedSecondary).map(dFeeling => (
                <button
                  key={dFeeling}
                  className={`detailed-feeling-button py-3 px-2 bg-white bg-opacity-10 border-2 border-white border-opacity-20 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-300 text-center
                    ${selectedDetailedFeeling === dFeeling ? 'bg-opacity-30 ring-2 ring-white shadow-md' : 'hover:bg-opacity-20'}`}
                  onClick={() => handleSelectDetailed(dFeeling)}
                  aria-pressed={selectedDetailedFeeling === dFeeling}
                  title={dFeeling} {/* NEW: Tooltip for detailed feeling */}
                >
                  {dFeeling}
                </button>
              ))}
            </div>
          </div>
        )}

        {(step === 4 && selectedDetailedFeeling && selectedPrimaryColor) && (
          <>
            <div className="mb-6 text-left mt-6">
              <label className="block mb-4 font-semibold text-base text-white">4. Rate Your Mood:</label>
              <div className="flex justify-center gap-2 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onClick={() => setMoodRating(s)}
                    className={`mood-rating-button text-4xl transition-colors duration-200 
                      ${s <= moodRating ? 'text-mood-3 transform scale-110' : 'text-charcoal-600 hover:text-mood-3'}`}
                    aria-label={`${s} star rating`}
                    aria-pressed={s === moodRating}
                  >
                    {getEmoji('Star')}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6 text-left">
              <label htmlFor="mood-comment" className="block mb-2 font-semibold text-sm text-white">Comment (optional)</label>
              <textarea
                id="mood-comment"
                ref={commentTextareaRef}
                rows={4}
                className="w-full p-3 bg-white bg-opacity-10 border-2 border-white border-opacity-20 rounded-xl text-white text-base font-sans focus:outline-none focus:border-white transition-all duration-300 placeholder-white placeholder-opacity-70"
                placeholder="Add a quick note about why you feel this way..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-label="Optional comments about your mood"
              ></textarea>
            </div>

            <button
              className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-white text-primary-brand hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
              onClick={handleSave}
              aria-label="Save Mood Log Entry"
              disabled={moodRating === 0} // Disable if no rating
            >
              Save Mood Log
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodLogModal;