import React from 'react';
import { getEmoji } from '../utils/emoji';

interface BottomNavProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onSelectView }) => {
  const navItems = [
    { id: 'dashboard', icon: getEmoji('Home'), label: 'Home' },
    { id: 'programs', icon: getEmoji('Program'), label: 'Programs' },
    { id: 'topics', icon: getEmoji('Topic'), label: 'Topics' },
    { id: 'logs', icon: getEmoji('Logs'), label: 'Logs' },
    { id: 'resources', icon: getEmoji('Education'), label: 'Resources' }, // New Resources tab
    { id: 'settings', icon: getEmoji('Settings'), label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-card flex justify-around p-3 border-t border-border-light z-50 shadow-nav-bar pb-[calc(12px+env(safe-area-inset-bottom))]">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 p-2 md:px-4 md:py-3 bg-transparent border-none cursor-pointer rounded-xl transition-all duration-300 text-sm font-semibold 
            ${activeView === item.id ? 'text-white bg-primary-brand bg-opacity-20' : 'text-text-secondary hover:bg-charcoal-700'}`}
          onClick={() => onSelectView(item.id)}
          aria-current={activeView === item.id ? 'page' : undefined}
          aria-label={`Go to ${item.label} view`}
          style={{ '--tw-text-opacity': activeView === item.id ? '1' : '0.8' } as React.CSSProperties} // Dynamic opacity for text
        >
          <div className="text-2xl">{item.icon}</div>
          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;