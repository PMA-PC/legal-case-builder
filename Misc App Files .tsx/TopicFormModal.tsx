import React, { useState, useEffect, useRef } from 'react';
import { getEmoji } from '../utils/emoji';
import { Topic, TopicFormData } from '../types'; // Import Topic and new TopicFormData

interface TopicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicData: TopicFormData, id?: number) => void; // Updated onSave signature
  existingTopic?: Topic | null; // NEW: Optional prop for existing topic
}

const TopicFormModal: React.FC<TopicFormModalProps> = ({ isOpen, onClose, onSave, existingTopic }) => {
  const [title, setTitle] = useState('');
  const [withPerson, setWithPerson] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [discussionDate, setDiscussionDate] = useState('');
  const [notes, setNotes] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (existingTopic) {
        // Populate form with existing topic data for editing
        setTitle(existingTopic.title);
        setWithPerson(existingTopic.withPerson);
        setUrgency(existingTopic.urgency);
        setCategories(existingTopic.categories);
        setDiscussionDate(existingTopic.discussionDate ? existingTopic.discussionDate.split('T')[0] : '');
        setNotes(existingTopic.notes || '');
      } else {
        // Reset form for a new topic
        setTitle('');
        setWithPerson('');
        setUrgency('Medium');
        setCategories([]);
        setDiscussionDate('');
        setNotes('');
      }
      setNewCategory(''); // Always clear new category input
      setTimeout(() => titleInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, existingTopic]); // Added existingTopic to dependencies

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
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setCategories(categories.filter(cat => cat !== catToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !withPerson.trim()) {
      alert('Topic title and person are required.');
      return;
    }

    const topicData: TopicFormData = {
      title: title.trim(),
      withPerson: withPerson.trim(),
      urgency,
      categories,
      discussionDate: discussionDate || undefined,
      notes: notes.trim() || undefined,
    };

    onSave(topicData, existingTopic?.id); // Pass id if editing
    // onClose is handled by onSave in App.tsx
  };

  if (!isOpen) return null;

  const modalTitle = existingTopic ? 'Edit Topic' : 'Add New Topic';
  const submitButtonText = existingTopic ? 'Save Changes' : 'Add Topic';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] p-5 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="topic-form-title">
      <div ref={modalRef} className="bg-bg-card rounded-[20px] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-modal animate-fadeIn">
        <div className="flex justify-between items-center mb-5">
          <h3 id="topic-form-title" className="text-xl font-bold text-primary-brand">{getEmoji('Topic')} {modalTitle}</h3>
          <button className="text-text-secondary text-3xl cursor-pointer p-0 w-8 h-8 bg-transparent border-none leading-none" onClick={onClose} aria-label="Close topic form modal">×</button>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label htmlFor="topic-title" className="block mb-2 font-semibold text-sm text-text-primary">Topic Title <span className="text-coral-400">*</span></label>
            <input
              type="text"
              id="topic-title"
              ref={titleInputRef}
              placeholder="e.g., Discuss family finances"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="topic-person" className="block mb-2 font-semibold text-sm text-text-primary">With Whom? <span className="text-coral-400">*</span></label>
            <input
              type="text"
              id="topic-person"
              placeholder="e.g., Partner, Parent, Friend"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={withPerson}
              onChange={(e) => setWithPerson(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="topic-urgency" className="block mb-2 font-semibold text-sm text-text-primary">Urgency</label>
            <select
              id="topic-urgency"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="topic-categories" className="block mb-2 font-semibold text-sm text-text-primary">Categories</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat, index) => (
                <span key={index} className="flex items-center bg-primary-brand bg-opacity-20 text-primary-brand px-3 py-1 rounded-full text-sm">
                  {cat}
                  <button type="button" onClick={() => handleRemoveCategory(cat)} className="ml-2 text-primary-brand hover:text-white transition-colors text-lg leading-none" aria-label={`Remove category ${cat}`}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="topic-new-category"
                placeholder="Add category (e.g., work, personal)"
                className="flex-1 p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                aria-label="New category input"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn btn-secondary py-3 px-5 rounded-xl font-semibold text-base flex items-center gap-1 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
                aria-label="Add category"
              >
                {getEmoji('Add')}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="topic-discussion-date" className="block mb-2 font-semibold text-sm text-text-primary">Suggested Discussion Date (Optional)</label>
            <input
              type="date"
              id="topic-discussion-date"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={discussionDate}
              onChange={(e) => setDiscussionDate(e.target.value)}
              aria-label="Suggested discussion date"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="topic-notes" className="block mb-2 font-semibold text-sm text-text-primary">Notes (Optional)</label>
            <textarea
              id="topic-notes"
              rows={4}
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base font-sans focus:outline-none focus:border-primary-brand transition-all duration-300 placeholder-text-secondary"
              placeholder="Add any specific points or thoughts for this discussion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Optional notes for the topic"
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn btn-secondary py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicFormModal;