import React from 'react';
import { getEmoji } from '../utils/emoji';
import { useAuth } from '../AuthContext';

interface HeaderProps {
  userName: string; // Keep for existing integration if needed elsewhere
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { user, setShowLogin, setUser } = useAuth();

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold text-white">
          {getEmoji('FeelingsCheckIn')} Positive Mental Action!
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-white opacity-90">Welcome, <span className="font-semibold">{user.name}</span>!</span>
              <button
                onClick={() => setUser(null)}
                className="px-3 py-1 rounded-full bg-coral-400 text-white text-xs font-semibold hover:bg-coral-500 transition-colors"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-3 py-1 rounded-full bg-white text-teal-600 text-xs font-semibold hover:bg-gray-100 transition-colors"
              aria-label="Login"
            >
              {getEmoji('User')} Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;