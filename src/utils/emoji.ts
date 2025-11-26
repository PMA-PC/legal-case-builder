export const getEmoji = (key: string): string => {
    const emojis: { [key: string]: string } = {
        'Happy': '😊',
        'Sad': '😢',
        'Angry': '😠',
        'Anxious': '😰',
        'Calm': '😌',
        'Excited': '🤩',
        'Fearful': '😨',
        'Surprised': '😮',
        'Disgusted': '🤢', // NEW
        'Meditation': '🧘',
        'Journal': '📝',
        'Exercise': '💪',
        'Program': '🎯',
        'FeelingsCheckIn': '💚',
        'Topic': '💬',
        'Appreciation': '💖',
        'Accomplishment': '🏆',
        'Boundary': '🚧',
        'Quote': '💡',
        'Home': '🏠',
        'Logs': '📖',
        'Settings': '⚙️',
        'Timer': '⏱️',
        'Streak': '🔥',
        'HabitComplete': '✅',
        'ActivePrograms': '🚀',
        'Export': '📥',
        'Add': '➕',
        'Back': '⬅️',
        'Complete': '✓',
        'Warning': '⚠️',
        // New emojis for new features
        'SelfHelp': '🧠',
        'Education': '📚',
        'Support': '🤝',
        'News': '📰',
        'Shop': '🛍️',
        'Star': '⭐',
        'User': '👤',
        'Todo': '📋',
        'Edit': '✏️', // NEW: For editing topics
        'Brain': '🧠' // NEW: For ADHD Explorer
    };
    return emojis[key] || '✨';
};
