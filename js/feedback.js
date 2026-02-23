/**
 * COURAGE REPS V2 - Feedback System
 * Provides post-interaction analysis and coaching
 * Note: This is a simulated system that can be connected to a real LLM API later
 */

(function() {
    'use strict';

    // Feedback templates for different types of interactions
    const STRENGTH_TEMPLATES = [
        "You took initiative by approaching the situation directly",
        "You maintained composure during the interaction",
        "You showed genuine interest in the other person",
        "You used open body language signals",
        "You listened actively before responding",
        "You expressed yourself clearly and confidently",
        "You stayed present in the conversation",
        "You showed vulnerability appropriately",
        "You adapted your approach based on feedback",
        "You followed through despite discomfort"
    ];

    const IMPROVEMENT_TEMPLATES = [
        "Consider making more direct eye contact",
        "Try projecting your voice slightly louder",
        "Practice pausing before responding to show thoughtfulness",
        "Work on asking follow-up questions to deepen connection",
        "Focus on open-ended questions rather than yes/no questions",
        "Try to relax your shoulders and facial muscles",
        "Consider sharing more about yourself to build rapport",
        "Work on ending conversations gracefully",
        "Practice expressing disagreement more directly",
        "Focus on being present rather than planning your next words"
    ];

    const NEXT_FOCUS_TEMPLATES = [
        "For your next rep, focus on maintaining eye contact for 3+ seconds during key moments.",
        "Next time, try to ask at least 2 follow-up questions to show genuine interest.",
        "Your next challenge: initiate the conversation rather than waiting for the other person.",
        "Focus on your body language - stand tall and take up space confidently.",
        "Try to share something personal about yourself to build deeper connection.",
        "Work on speaking at a slightly slower pace to convey confidence.",
        "Challenge yourself to hold silence comfortably without rushing to fill it.",
        "Next rep: aim to leave the other person feeling valued and heard.",
        "Focus on your greeting - make it warm and memorable.",
        "Try to steer the conversation toward meaningful topics rather than small talk."
    ];

    // Analyze the interaction based on user input
    function analyzeInteraction(userReflection) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                const analysis = generateAnalysis(userReflection);
                resolve(analysis);
            }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
        });
    }

    // Generate analysis based on reflection content
    function generateAnalysis(reflection) {
        const lowerReflection = reflection.toLowerCase();
        const wordCount = reflection.split(/\s+/).length;
        
        // Determine number of points based on reflection detail
        const strengthCount = wordCount > 30 ? 3 : wordCount > 15 ? 2 : 1;
        const improvementCount = wordCount > 30 ? 3 : wordCount > 15 ? 2 : 1;

        // Analyze sentiment and content
        const positiveIndicators = [
            'smiled', 'laughed', 'nodded', 'asked', 'listened', 'responded',
            'confident', 'good', 'great', 'comfortable', 'natural', 'easy'
        ];
        const challengeIndicators = [
            'nervous', 'awkward', 'uncomfortable', 'difficult', 'hard',
            'struggled', 'forgot', 'stumbled', 'anxious', 'scared'
        ];

        const positiveScore = positiveIndicators.filter(word => lowerReflection.includes(word)).length;
        const challengeScore = challengeIndicators.filter(word => lowerReflection.includes(word)).length;

        // Select appropriate feedback
        const strengths = selectFeedback(STRENGTH_TEMPLATES, strengthCount, positiveScore);
        const improvements = selectFeedback(IMPROVEMENT_TEMPLATES, improvementCount, challengeScore);
        const nextFocus = selectNextFocus(lowerReflection);

        return {
            strengths,
            improvements,
            nextFocus
        };
    }

    // Select feedback items
    function selectFeedback(templates, count, score) {
        // Shuffle and select
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.max(1, Math.min(count, 3)));
    }

    // Select next focus area based on reflection content
    function selectNextFocus(reflection) {
        // Try to match focus to reflection content
        if (reflection.includes('eye contact') || reflection.includes('look')) {
            return NEXT_FOCUS_TEMPLATES[0];
        }
        if (reflection.includes('question') || reflection.includes('ask')) {
            return NEXT_FOCUS_TEMPLATES[1];
        }
        if (reflection.includes('nervous') || reflection.includes('scared')) {
            return NEXT_FOCUS_TEMPLATES[3];
        }
        if (reflection.includes('quiet') || reflection.includes('silent')) {
            return NEXT_FOCUS_TEMPLATES[5];
        }
        
        // Random selection if no match
        return NEXT_FOCUS_TEMPLATES[Math.floor(Math.random() * NEXT_FOCUS_TEMPLATES.length)];
    }

    // Save reflection to user data
    function saveReflection(reflection, analysis) {
        const userData = JSON.parse(localStorage.getItem('courageRepsData') || '{}');
        
        if (!userData.reflections) {
            userData.reflections = [];
        }

        userData.reflections.push({
            date: new Date().toISOString(),
            challengeText: userData.currentChallenge,
            reflection: reflection,
            analysis: analysis
        });

        // Keep only last 50 reflections
        if (userData.reflections.length > 50) {
            userData.reflections = userData.reflections.slice(-50);
        }

        localStorage.setItem('courageRepsData', JSON.stringify(userData));
    }

    // Export functions
    window.FeedbackSystem = {
        analyzeInteraction,
        saveReflection
    };
})();
