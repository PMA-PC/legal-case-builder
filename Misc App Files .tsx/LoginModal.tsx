import React, { useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getEmoji } from '../utils/emoji';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { setUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus on the first interactive element when modal opens
    if (modalRef.current) {
      setTimeout(() => loginButtonRef.current?.focus(), 100);
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

  const handleLogin = () => {
    setUser({ id: 'demo-user-123', name: 'Demo User', email: 'demo@example.com' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] p-5 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div ref={modalRef} className="bg-bg-card rounded-[20px] p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-modal animate-fadeIn">
        <div className="flex justify-between items-center mb-5">
          <h3 id="login-modal-title" className="text-xl font-bold text-primary-brand">{getEmoji('User')} Login</h3>
          <button className="text-text-secondary text-3xl cursor-pointer p-0 w-8 h-8 bg-transparent border-none leading-none" onClick={onClose} aria-label="Close login modal">×</button>
        </div>

        <p className="text-text-secondary mb-6">Login to save your assessments and track progress.</p>
        
        <button
          ref={loginButtonRef}
          onClick={handleLogin}
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 mb-3 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Demo Login
        </button>
        <button
          onClick={onClose}
          className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;