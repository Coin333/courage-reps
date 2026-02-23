/**
 * COURAGE REPS - Challenge Database
 * Challenges organized by difficulty level (1-5)
 */

const CHALLENGES = {
    // Level 1: Very low-stakes, minimal social exposure
    1: [
        "Make eye contact with a stranger for 2 seconds and give a small nod.",
        "Say 'hello' or 'good morning' to one person you don't know well.",
        "Ask a cashier or barista 'How's your day going?' after they serve you.",
        "Smile at 3 strangers today.",
        "Hold a door open for someone and make brief eye contact.",
        "Say 'thank you' with direct eye contact to someone who helps you.",
        "Wave to a neighbor or someone you recognize but rarely talk to.",
        "Stand tall with good posture for your next social interaction.",
        "Make small talk about the weather with anyone (delivery person, neighbor, etc.).",
        "Compliment someone's pet if you see one on a walk."
    ],
    
    // Level 2: Low-stakes interactions with brief exchanges
    2: [
        "Give a genuine compliment to someone on their outfit or style.",
        "Ask someone for a recommendation (restaurant, music, show).",
        "Start a conversation with someone in line while waiting.",
        "Ask a coworker or classmate what they did over the weekend.",
        "Introduce yourself to someone new by name.",
        "Ask someone what they're working on and listen attentively.",
        "Share one personal opinion during a group conversation.",
        "Call a business to ask a question instead of texting or emailing.",
        "Sit next to someone new at lunch or in class.",
        "Ask a store employee for help finding something (even if you could find it yourself)."
    ],
    
    // Level 3: Medium-stakes with more vulnerability required
    3: [
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
    
    // Level 4: Higher stakes, more extended interactions
    4: [
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
    
    // Level 5: Maximum challenge, public speaking / vulnerability
    5: [
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
    ]
};

// Level descriptions for after pretest
const LEVEL_DESCRIPTIONS = {
    1: "You'll start with low-pressure challenges to build your foundation. These are designed to be achievable while still pushing you forward.",
    2: "You'll begin with basic social interactions. These challenges involve brief exchanges to build your comfort.",
    3: "You're starting at an intermediate level. Your challenges will require more engagement and occasional vulnerability.",
    4: "You're beginning with more demanding challenges. These involve leadership, deeper conversations, and setting boundaries.",
    5: "You're starting at the highest level. Your challenges involve public speaking, difficult conversations, and maximum exposure."
};

// Get a random challenge for a given level
function getRandomChallenge(level) {
    const levelChallenges = CHALLENGES[level];
    if (!levelChallenges || levelChallenges.length === 0) {
        return "No challenges available for this level.";
    }
    const randomIndex = Math.floor(Math.random() * levelChallenges.length);
    return levelChallenges[randomIndex];
}

// Get challenge that hasn't been shown recently
function getUniqueDailyChallenge(level, completedChallenges = []) {
    const levelChallenges = CHALLENGES[level];
    if (!levelChallenges || levelChallenges.length === 0) {
        return "No challenges available for this level.";
    }
    
    // Filter out recently completed challenges
    const availableChallenges = levelChallenges.filter(
        challenge => !completedChallenges.includes(challenge)
    );
    
    // If all challenges completed, reset and use full list
    const challengePool = availableChallenges.length > 0 ? availableChallenges : levelChallenges;
    
    const randomIndex = Math.floor(Math.random() * challengePool.length);
    return challengePool[randomIndex];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHALLENGES, LEVEL_DESCRIPTIONS, getRandomChallenge, getUniqueDailyChallenge };
}
