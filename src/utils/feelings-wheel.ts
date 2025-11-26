// This file defines the hierarchical structure of the feelings wheel
// Primary Emotion (the 6 core ones)
//   -> Secondary Emotion (the immediate two to the right/clockwise from the primary)
//     -> Detailed Emotions
// IMPORTANT: Explicitly ensuring no trailing commas in object or array literals to prevent SyntaxError.

export interface SecondaryEmotion {
    name: string;
    details: string[]; // Array of detailed feeling strings
}

export interface PrimaryEmotion {
    name: string;
    emoji: string; // Emoji key from getEmoji
    colorClass: string; // Tailwind CSS class for background color gradient
    secondary: SecondaryEmotion[];
}

// Data derived from the provided feelings wheel image
export const FEELINGS_WHEEL_DATA: PrimaryEmotion[] = [
    {
        name: 'Happy',
        emoji: 'Happy', // Corresponds to getEmoji('Happy')
        colorClass: 'from-pe-yellow-300 to-pe-yellow-500', // Adjusted from Tailwind config
        secondary: [
            { name: 'Surprised', details: ['Energetic', 'Eager', 'Aroused', 'Cheeky', 'Excited', 'Playful', 'Content', 'Curious', 'Interested', 'Inquisitive', 'Proud'] },
            { name: 'Fearful', details: ['Successful', 'Confident', 'Accepted', 'Respected', 'Powerful', 'Valued', 'Courageous', 'Creative', 'Peaceful', 'Trusting', 'Loving', 'Thankful', 'Optimistic', 'Hopeful', 'Inspired'] }
        ]
    },
    {
        name: 'Surprised',
        emoji: 'Surprised',
        colorClass: 'from-pe-purple-300 to-pe-purple-500', // Tailwind config 'pe-purple-600' exists, using similar range
        secondary: [
            { name: 'Happy', details: ['Energetic', 'Eager', 'Aroused', 'Cheeky', 'Excited', 'Playful', 'Free', 'Content', 'Joyful', 'Curious', 'Interested', 'Inquisitive', 'Proud', 'Indifferent', 'Rushed', 'Overwhelmed', 'Out of control', 'Pressured', 'Apathetic', 'Sleepy', 'Unfocussed'] },
            { name: 'Fearful', details: ['Shocked', 'Dismayed', 'Disillusioned', 'Perplexed', 'Astonished', 'Awe', 'Tired', 'Startled', 'Confused', 'Amazed', 'Bad', 'Helpless', 'Frightened', 'Worried', 'Inadequate', 'Inferior', 'Worthless', 'Insignificant', 'Excluded'] }
        ]
    },
    {
        name: 'Fearful',
        emoji: 'Fearful',
        colorClass: 'from-pe-blue-300 to-pe-blue-500', // Tailwind config 'pe-blue-500' exists, using similar range
        secondary: [
            { name: 'Angry', details: ['Persecuted', 'Rejected', 'Nervous', 'Threatened', 'Exposed', 'Let down', 'Betrayed', 'Resentful', 'Humiliated', 'Disrespected', 'Ridiculed', 'Indignant'] },
            { name: 'Sad', details: ['Violated', 'Furious', 'Jealous', 'Provoked', 'Hostile', 'Infuriated', 'Annoyed', 'Withdrawn', 'Numb', 'Skeptical', 'Dismissive', 'Judgmental', 'Embarrassed', 'Appalled', 'Revolted', 'Disgusted', 'Nauseated', 'Awful', 'Detestable', 'Horrified'] }
        ]
    },
    {
        name: 'Angry',
        emoji: 'Angry',
        colorClass: 'from-pe-red-400 to-pe-red-600', // Tailwind config 'pe-red-500', 'pe-red-600' exists, using similar range
        secondary: [
            { name: 'Disgusted', details: ['Persecuted', 'Rejected', 'Nervous', 'Threatened', 'Exposed', 'Let down', 'Betrayed', 'Resentful', 'Humiliated', 'Disrespected', 'Ridiculed', 'Indignant', 'Bitter', 'Mad', 'Aggressive', 'Frustrated', 'Distant', 'Critical', 'Disapproving'] },
            { name: 'Sad', details: ['Lonely', 'Vulnerable', 'Despair', 'Depressed', 'Sensitive', 'Intimate', 'Hopeful', 'Inspired', 'Isolated', 'Abandoned', 'Victimized', 'Fragile', 'Grief', 'Powerless', 'Ashamed', 'Repelled', 'Hurt', 'Guilty', 'Hesitant', 'Remorseful', 'Disappointed', 'Empty', 'Inferior', 'Embarrassed'] }
        ]
    },
    {
        name: 'Disgusted',
        emoji: 'Disgusted',
        colorClass: 'from-pe-lime-400 to-pe-green-600', // Using existing green-like colors from config
        secondary: [
            { name: 'Sad', details: ['Disgusted', 'Nauseated', 'Awful', 'Detestable', 'Horrified', 'Lonely', 'Vulnerable', 'Despair', 'Depressed', 'Sensitive', 'Intimate', 'Hopeful', 'Inspired', 'Isolated'] },
            { name: 'Happy', details: ['Content', 'Joyful', 'Curious', 'Interested', 'Inquisitive', 'Proud', 'Successful', 'Confident', 'Accepted', 'Respected', 'Powerful', 'Valued', 'Courageous', 'Creative', 'Peaceful', 'Trusting', 'Loving', 'Thankful', 'Optimistic'] }
        ]
    },
    {
        name: 'Sad',
        emoji: 'Sad',
        colorClass: 'from-pe-gray-400 to-pe-gray-600', // Using existing gray colors from config
        secondary: [
            { name: 'Fearful', details: ['Lonely', 'Vulnerable', 'Despair', 'Depressed', 'Sensitive', 'Intimate', 'Hopeful', 'Inspired', 'Isolated', 'Abandoned', 'Victimized', 'Fragile', 'Grief', 'Powerless', 'Ashamed'] },
            { name: 'Angry', details: ['Bitter', 'Mad', 'Aggressive', 'Frustrated', 'Distant', 'Critical', 'Disapproving', 'Violated', 'Furious', 'Jealous', 'Provoked', 'Hostile', 'Infuriated', 'Annoyed', 'Withdrawn', 'Numb', 'Skeptical', 'Dismissive', 'Judgmental', 'Embarrassed', 'Appalled', 'Revolted'] }
        ]
    }
];

// Helper to get detailed feelings for a given secondary emotion name within a primary emotion context
export const getDetailedFeelings = (primaryName: string, secondaryName: string): string[] => {
    const primary = FEELINGS_WHEEL_DATA.find(p => p.name === primaryName);
    if (primary) {
        const secondary = primary.secondary.find(s => s.name === secondaryName);
        if (secondary) {
            return secondary.details;
        }
    }
    return [];
};

// Helper to get secondary emotions for a given primary emotion name
export const getSecondaryEmotions = (primaryName: string): SecondaryEmotion[] => {
    const primary = FEELINGS_WHEEL_DATA.find(p => p.name === primaryName);
    return primary ? primary.secondary : [];
};

export const getPrimaryEmotionColorClass = (primaryName: string): string => {
    const primary = FEELINGS_WHEEL_DATA.find(p => p.name === primaryName);
    return primary ? primary.colorClass : 'bg-gradient-to-br from-charcoal-700 to-charcoal-800'; // Default if not found
};
