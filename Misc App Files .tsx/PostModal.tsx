import React, { useRef, useEffect } from 'react';
import { Post } from '../types';
import { getEmoji } from '../utils/emoji';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (modalRef.current) {
        setTimeout(() => closeButtonRef.current?.focus(), 100);
        document.body.style.overflow = 'hidden';
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

  // Trap focus within the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        // Fix: Corrected typo 'focusableableElements' to 'focusableElements'
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
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] p-5 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
      <div ref={modalRef} className="bg-bg-card rounded-[20px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-modal animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <h3 id="post-modal-title" className="text-2xl font-bold text-primary-brand">{post.title}</h3>
          <button ref={closeButtonRef} className="text-text-secondary text-3xl cursor-pointer p-0 w-8 h-8 bg-transparent border-none leading-none" onClick={onClose} aria-label="Close post modal">×</button>
        </div>
        <p className="text-sm text-text-secondary mb-6">By {post.author} • {post.date}</p>
        <p className="mb-6 whitespace-pre-line text-text-primary">{post.content}</p>
        <button
          onClick={onClose}
          className="btn btn-primary px-6 py-2 rounded-xl font-semibold text-base bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PostModal;