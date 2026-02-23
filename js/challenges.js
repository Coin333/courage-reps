/**
 * COURAGE REPS V2 - Challenge Database
 * Challenges organized by difficulty level (1-6+)
 * Includes difficulty tiers, XP values, and level titles
 */

// Level titles for V2
const LEVEL_TITLES = {
    1: "Social Awareness",
    2: "Initiation",
    3: "Conversational Depth",
    4: "Leadership Presence",
    5: "Social Dominance",
    6: "Adaptive Influence"
};

// XP required to reach each level (exponential scaling)
const XP_THRESHOLDS = {
    1: 0,      // Starting level
    2: 100,    // 100 XP to reach level 2
    3: 300,    // 200 more XP (300 total)
    4: 700,    // 400 more XP (700 total)
    5: 1500,   // 800 more XP (1500 total)
    6: 3100    // 1600 more XP (3100 total)
};

// Get XP needed for next level
function getXPForNextLevel(currentLevel) {
    if (currentLevel >= 6) {
        // Exponential scaling beyond level 6
        return XP_THRESHOLDS[6] + Math.pow(2, currentLevel - 5) * 1600;
    }
    return XP_THRESHOLDS[currentLevel + 1] - XP_THRESHOLDS[currentLevel];
}

// Challenge difficulties
const DIFFICULTY = {
    STANDARD: 'Standard',
    HARD: 'Hard',
    ELITE: 'Elite'
};

// Challenges with difficulty tiers
const CHALLENGES = {
    // Level 1: Social Awareness - Very low-stakes, minimal exposure
    1: {
        standard: [
            "Make eye contact with a stranger for 2 seconds and give a small nod.",
            "Say 'hello' or 'good morning' to one person you don't know well.",
            "Ask a cashier or barista 'How's your day going?' after they serve you.",
            "Smile at 3 strangers today.",
            "Hold a door open for someone and make brief eye contact.",
            "Say 'thank you' with direct eye contact to someone who helps you.",
            "Wave to a neighbor or someone you recognize but rarely talk to.",
            "Stand tall with good posture for your next social interaction.",
            "Make small talk about the weather with anyone (delivery person, neighbor, etc.).",
            "Compliment someone's pet if you see one on a walk.",
            "Acknowledge someone's presence with a nod when you pass them.",
            "Practice saying 'excuse me' confidently when moving through a crowd."
        ]
    },
    
    // Level 2: Initiation - Low-stakes with brief exchanges
    2: {
        standard: [
            "Give a genuine compliment to someone on their outfit or style.",
            "Ask someone for a recommendation (restaurant, music, show).",
            "Start a conversation with someone in line while waiting.",
            "Ask a coworker or classmate what they did over the weekend.",
            "Introduce yourself to someone new by name.",
            "Ask someone what they're working on and listen attentively.",
            "Share one personal opinion during a group conversation.",
            "Call a business to ask a question instead of texting or emailing.",
            "Sit next to someone new at lunch or in class.",
            "Ask a store employee for help finding something.",
            "Comment on something happening around you to spark conversation.",
            "Ask someone about their day and follow up with one more question."
        ]
    },
    
    // Level 3: Conversational Depth - Medium-stakes with vulnerability
    3: {
        standard: [
            "Share an unpopular opinion respectfully in a conversation.",
            "Ask someone to hang out or grab coffee.",
            "Tell a brief personal story in a group setting.",
            "Offer to help someone who looks like they're struggling.",
            "Give someone specific, thoughtful feedback on their work.",
            "Join a conversation already in progress.",
            "Admit you don't know something and ask someone to explain it.",
            "Disagree politely with someone about a minor topic.",
            "Ask someone about their goals or dreams.",
            "Start a conversation with someone who intimidates you slightly."
        ],
        hard: [
            "Share a personal opinion that might be controversial in your group.",
            "Ask someone you admire to grab lunch or coffee one-on-one.",
            "Tell a funny story about yourself that shows vulnerability.",
            "Give constructive criticism to a friend or peer.",
            "Ask a follow-up question that shows you were really listening."
        ]
    },
    
    // Level 4: Leadership Presence - Higher stakes, extended interactions
    4: {
        standard: [
            "Lead a short group activity or discussion.",
            "Make a phone call you've been avoiding.",
            "Ask for feedback on something personal (your ideas, your work).",
            "Express appreciation to someone and be specific about why.",
            "Set a boundary with someone (say no to something you don't want to do).",
            "Share something you're proud of with someone.",
            "Initiate plans with a group of 3+ people.",
            "Have a one-on-one conversation for 10+ minutes with someone new.",
            "Ask someone you admire for advice.",
            "Speak up first in a meeting or group discussion."
        ],
        hard: [
            "Lead a meeting or discussion from start to finish.",
            "Have a confrontation you've been avoiding (politely but directly).",
            "Ask for a raise, extension, or something else you deserve.",
            "Give a toast at a small gathering.",
            "Introduce two people you know and facilitate their conversation."
        ]
    },
    
    // Level 5: Social Dominance - Maximum challenge, public exposure
    5: {
        standard: [
            "Give a short impromptu presentation or speech (even to just 2-3 people).",
            "Ask for what you want directly without apologizing or hedging.",
            "Have a difficult conversation you've been postponing.",
            "Volunteer to go first when others are hesitating.",
            "Share a personal failure and what you learned from it.",
            "Introduce yourself to someone significantly older or more experienced.",
            "Lead a meeting or take charge of organizing an event.",
            "Give a toast or speak at a gathering.",
            "Approach a stranger and start a genuine conversation from scratch.",
            "Publicly support or defend someone else's idea or work."
        ],
        hard: [
            "Give a 5+ minute presentation to a group.",
            "Cold approach 3 strangers in one day for genuine conversations.",
            "Moderate a discussion or debate.",
            "Interview someone for a project or genuine curiosity.",
            "Stand up for someone publicly when they're being criticized."
        ],
        elite: [
            "Give an impromptu speech at a public event.",
            "Lead a workshop or teach a skill to a group.",
            "Network at a professional event, introducing yourself to 5+ people.",
            "Negotiate something significant (price, salary, terms).",
            "Host an event you organized from scratch."
        ]
    },
    
    // Level 6: Adaptive Influence - Elite tier
    6: {
        standard: [
            "Facilitate a meeting with conflicting viewpoints.",
            "Mentor someone younger in a social skill you've developed.",
            "Handle a social crisis calmly and take charge of resolution.",
            "Give feedback to someone more experienced than you.",
            "Build rapport with someone very different from you in a 10+ minute conversation."
        ],
        hard: [
            "Mediate a conflict between two people.",
            "Pitch an idea persuasively to a skeptical audience.",
            "Lead a team through an uncomfortable but necessary conversation.",
            "Network across different social circles in one event.",
            "Command a room's attention for 10+ minutes."
        ],
        elite: [
            "Give a keynote or opening speech at an event.",
            "Successfully negotiate on behalf of someone else.",
            "Turn a hostile audience neutral or positive through dialogue.",
            "Organize and lead a community initiative.",
            "Coach someone through their own difficult social situation in real-time."
        ]
    }
};

// Level descriptions for after pretest
const LEVEL_DESCRIPTIONS = {
    1: "You'll start with low-pressure challenges to build your foundation. Focus on awareness and basic acknowledgment.",
    2: "You'll begin with basic social interactions. These challenges involve brief exchanges to build your comfort with initiation.",
    3: "You're starting at an intermediate level. Your challenges will require more engagement, personal sharing, and occasional vulnerability.",
    4: "You're beginning with demanding challenges. These involve leadership, deeper conversations, and setting boundaries.",
    5: "You're starting at an advanced level. Your challenges involve public speaking, difficult conversations, and maximum exposure.",
    6: "You're at the elite level. Your challenges involve influence, mediation, and high-stakes social leadership."
};

// Badge definitions
const BADGES = {
    FIRST_REP: {
        id: 'first_rep',
        name: 'First Rep',
        description: 'Complete your first challenge',
        icon: '🎯',
        requirement: (data) => data.totalCompleted >= 1
    },
    WEEK_WARRIOR: {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        requirement: (data) => data.streak >= 7 || data.bestStreak >= 7
    },
    HARD_CHARGER: {
        id: 'hard_charger',
        name: 'Hard Charger',
        description: 'Complete your first Hard challenge',
        icon: '💪',
        requirement: (data) => data.hardCompleted >= 1
    },
    THIRTY_STRONG: {
        id: 'thirty_strong',
        name: 'Thirty Strong',
        description: 'Complete 30 challenges',
        icon: '🏆',
        requirement: (data) => data.totalCompleted >= 30
    },
    LEVEL_FIVE: {
        id: 'level_five',
        name: 'Level 5 Achieved',
        description: 'Reach Level 5: Social Dominance',
        icon: '⭐',
        requirement: (data) => data.level >= 5
    },
    CENTURY: {
        id: 'century',
        name: 'Century Club',
        description: 'Complete 100 interactions',
        icon: '💯',
        requirement: (data) => data.totalCompleted >= 100
    },
    NO_REFRESH_WEEK: {
        id: 'no_refresh_week',
        name: 'Committed',
        description: 'Complete 7 challenges without refreshing',
        icon: '🎖',
        requirement: (data) => data.noRefreshStreak >= 7
    },
    SCHOLAR: {
        id: 'scholar',
        name: 'Scholar',
        description: 'Complete all lessons',
        icon: '📚',
        requirement: (data) => data.lessonsCompleted >= 10
    },
    MONTH_MASTER: {
        id: 'month_master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '👑',
        requirement: (data) => data.streak >= 30 || data.bestStreak >= 30
    },
    ELITE_RUNNER: {
        id: 'elite_runner',
        name: 'Elite Runner',
        description: 'Complete an Elite challenge',
        icon: '🌟',
        requirement: (data) => data.eliteCompleted >= 1
    }
};

// Get a random challenge for a given level and difficulty
function getRandomChallenge(level, difficulty = 'standard') {
    const levelChallenges = CHALLENGES[level];
    if (!levelChallenges) {
        return { text: "No challenges available for this level.", difficulty: 'Standard' };
    }
    
    const difficultyPool = levelChallenges[difficulty] || levelChallenges.standard;
    if (!difficultyPool || difficultyPool.length === 0) {
        return { text: "No challenges available for this difficulty.", difficulty: 'Standard' };
    }
    
    const randomIndex = Math.floor(Math.random() * difficultyPool.length);
    return {
        text: difficultyPool[randomIndex],
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    };
}

// Get challenge that hasn't been shown recently
function getUniqueDailyChallenge(level, completedChallenges = [], difficulty = 'standard') {
    const levelChallenges = CHALLENGES[level];
    if (!levelChallenges) {
        return { text: "No challenges available for this level.", difficulty: 'Standard' };
    }
    
    const difficultyPool = levelChallenges[difficulty] || levelChallenges.standard;
    if (!difficultyPool || difficultyPool.length === 0) {
        return { text: "No challenges available for this difficulty.", difficulty: 'Standard' };
    }
    
    // Filter out recently completed challenges
    const availableChallenges = difficultyPool.filter(
        challenge => !completedChallenges.includes(challenge)
    );
    
    // If all challenges completed, reset and use full list
    const challengePool = availableChallenges.length > 0 ? availableChallenges : difficultyPool;
    
    const randomIndex = Math.floor(Math.random() * challengePool.length);
    return {
        text: challengePool[randomIndex],
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    };
}

// Check if hard mode is available for level
function isHardModeAvailable(level) {
    return level >= 3 && CHALLENGES[level]?.hard;
}

// Check if elite mode is available for level
function isEliteModeAvailable(level) {
    return level >= 5 && CHALLENGES[level]?.elite;
}

// Get available difficulties for a level
function getAvailableDifficulties(level) {
    const available = ['standard'];
    if (isHardModeAvailable(level)) available.push('hard');
    if (isEliteModeAvailable(level)) available.push('elite');
    return available;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CHALLENGES, 
        LEVEL_DESCRIPTIONS, 
        LEVEL_TITLES,
        XP_THRESHOLDS,
        BADGES,
        DIFFICULTY,
        getRandomChallenge, 
        getUniqueDailyChallenge,
        getXPForNextLevel,
        isHardModeAvailable,
        isEliteModeAvailable,
        getAvailableDifficulties
    };
}
