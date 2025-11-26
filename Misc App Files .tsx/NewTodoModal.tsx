import React, { useState, useEffect, useRef } from 'react';
import { getEmoji } from '../utils/emoji';
import { TodoItem } from '../types';

interface NewTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'isCompleted' | 'completedAt'>) => void;
}

const NewTodoModal: React.FC<NewTodoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [dueBy, setDueBy] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText('');
      setDueBy('');
      setTimeout(() => textInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Trap focus within the modal
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('To-Do text is required.');
      textInputRef.current?.focus();
      return;
    }

    onSave({
      text: text.trim(),
      dueBy: dueBy || undefined, // Only include if a date is set
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] p-5 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="new-todo-title">
      <div ref={modalRef} className="bg-bg-card rounded-[20px] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-modal animate-fadeIn">
        <div className="flex justify-between items-center mb-5">
          <h3 id="new-todo-title" className="text-xl font-bold text-primary-brand">{getEmoji('Todo')} Add New To-Do</h3>
          <button className="text-text-secondary text-3xl cursor-pointer p-0 w-8 h-8 bg-transparent border-none leading-none" onClick={onClose} aria-label="Close add new to-do modal">×</button>
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label htmlFor="todo-text" className="block mb-2 font-semibold text-sm text-text-primary">To-Do Description <span className="text-coral-400">*</span></label>
            <input
              type="text"
              id="todo-text"
              ref={textInputRef}
              placeholder="What do you need to do?"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="todo-due-by" className="block mb-2 font-semibold text-sm text-text-primary">Due By (Optional Date)</label>
            <input
              type="date"
              id="todo-due-by"
              className="w-full p-3 bg-charcoal-700 border-2 border-charcoal-600 rounded-xl text-text-primary text-base focus:outline-none focus:border-primary-brand transition-all duration-300"
              value={dueBy}
              onChange={(e) => setDueBy(e.target.value)}
              aria-label="Optional due date for the to-do item"
            />
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
              Add To-Do
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTodoModal;