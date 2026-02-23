/**
 * COURAGE REPS - Pretest Module
 * Handles the initial assessment to determine starting level
 */

(function() {
    'use strict';

    // Pretest Questions
    // Each answer has a score from 1-5 (1 = most introverted, 5 = most confident)
    const QUESTIONS = [
        {
            text: "When entering a room full of strangers, you typically:",
            options: [
                { text: "Look for a corner to stand in and avoid eye contact", score: 1 },
                { text: "Stay near the entrance and observe before moving in", score: 2 },
                { text: "Find one person who looks approachable to talk to", score: 3 },
                { text: "Walk in comfortably and scan for people to meet", score: 4 },
                { text: "Introduce yourself to multiple people right away", score: 5 }
            ]
        },
        {
            text: "When someone you barely know makes eye contact with you, you:",
            options: [
                { text: "Look away immediately", score: 1 },
                { text: "Give a quick glance then look elsewhere", score: 2 },
                { text: "Hold eye contact briefly, then look away naturally", score: 3 },
                { text: "Smile and nod at them", score: 4 },
                { text: "Smile and initiate a greeting or conversation", score: 5 }
            ]
        },
        {
            text: "If you need to return an item at a store, you would:",
            options: [
                { text: "Ask someone else to do it or avoid returning it", score: 1 },
                { text: "Feel anxious and rehearse what to say beforehand", score: 2 },
                { text: "Feel slightly uncomfortable but handle it", score: 3 },
                { text: "Do it without much thought", score: 4 },
                { text: "Handle it easily and chat with the employee", score: 5 }
            ]
        },
        {
            text: "In group conversations, you usually:",
            options: [
                { text: "Stay silent and listen", score: 1 },
                { text: "Speak only when directly asked a question", score: 2 },
                { text: "Occasionally share your thoughts", score: 3 },
                { text: "Contribute regularly to the conversation", score: 4 },
                { text: "Often lead or direct the conversation", score: 5 }
            ]
        },
        {
            text: "When you disagree with someone, you typically:",
            options: [
                { text: "Stay quiet to avoid conflict", score: 1 },
                { text: "Agree outwardly but disagree internally", score: 2 },
                { text: "Express disagreement if it's important enough", score: 3 },
                { text: "Share your different perspective calmly", score: 4 },
                { text: "Directly state your disagreement and explain why", score: 5 }
            ]
        }
    ];

    // State
    let currentQuestion = 0;
    let answers = [];

    // DOM Elements
    const questionCard = document.getElementById('question-card');
    const resultsCard = document.getElementById('results-card');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const assignedLevel = document.getElementById('assigned-level');
    const levelDescription = document.getElementById('level-description');
    const startTrainingBtn = document.getElementById('start-training');

    // Initialize
    function init() {
        // Check if user already completed pretest
        const userData = localStorage.getItem('courageRepsData');
        if (userData) {
            const data = JSON.parse(userData);
            if (data.pretestCompleted) {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
                return;
            }
        }

        totalQuestionsSpan.textContent = QUESTIONS.length;
        renderQuestion();
        attachEventListeners();
    }

    // Render current question
    function renderQuestion() {
        const question = QUESTIONS[currentQuestion];
        questionText.textContent = question.text;
        currentQuestionSpan.textContent = currentQuestion + 1;

        // Clear and rebuild options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.dataset.index = index;
            button.dataset.score = option.score;

            // Mark as selected if previously answered
            if (answers[currentQuestion] !== undefined && answers[currentQuestion].index === index) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => selectOption(index, option.score));
            optionsContainer.appendChild(button);
        });

        // Update navigation buttons
        updateNavigation();
    }

    // Handle option selection
    function selectOption(index, score) {
        answers[currentQuestion] = { index, score };

        // Update UI
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`.option-btn[data-index="${index}"]`).classList.add('selected');

        // Auto-advance after short delay (better UX)
        setTimeout(() => {
            if (currentQuestion < QUESTIONS.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                updateNavigation();
            }
        }, 300);
    }

    // Update navigation buttons
    function updateNavigation() {
        // Previous button
        if (currentQuestion > 0) {
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }

        // Next/Submit button
        if (answers[currentQuestion] !== undefined) {
            nextBtn.classList.remove('hidden');
            if (currentQuestion === QUESTIONS.length - 1) {
                nextBtn.textContent = 'See Results';
            } else {
                nextBtn.textContent = 'Next';
            }
        } else {
            nextBtn.classList.add('hidden');
        }
    }

    // Calculate level from answers
    function calculateLevel() {
        const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
        const averageScore = totalScore / QUESTIONS.length;
        
        // Map average score (1-5) to level (1-5)
        // Score 1.0-1.8 = Level 1
        // Score 1.8-2.6 = Level 2
        // Score 2.6-3.4 = Level 3
        // Score 3.4-4.2 = Level 4
        // Score 4.2-5.0 = Level 5
        
        let level;
        if (averageScore < 1.8) level = 1;
        else if (averageScore < 2.6) level = 2;
        else if (averageScore < 3.4) level = 3;
        else if (averageScore < 4.2) level = 4;
        else level = 5;

        return level;
    }

    // Show results
    function showResults() {
        const level = calculateLevel();

        questionCard.classList.add('hidden');
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        document.querySelector('.progress-indicator').classList.add('hidden');
        resultsCard.classList.remove('hidden');

        assignedLevel.textContent = level;
        
        // Show level title from challenges.js
        const levelTitleEl = document.getElementById('level-title');
        if (levelTitleEl && typeof LEVEL_TITLES !== 'undefined') {
            levelTitleEl.textContent = LEVEL_TITLES[level] || '';
        }
        
        // Get level description from challenges.js
        if (typeof LEVEL_DESCRIPTIONS !== 'undefined') {
            levelDescription.textContent = LEVEL_DESCRIPTIONS[level];
        } else {
            levelDescription.textContent = `You'll start with Level ${level} challenges tailored to your current comfort zone.`;
        }
    }

    // Save data and start training
    function startTraining() {
        const level = calculateLevel();
        
        // V2 user data structure with all new fields
        const userData = {
            pretestCompleted: true,
            level: level,
            xp: 0,
            streak: 0,
            bestStreak: 0,
            totalCompleted: 0,
            totalXP: 0,
            lastCompletionDate: null,
            currentChallenge: null,
            challengeDate: null,
            challengeCompleted: false,
            challengeDifficulty: 'Standard',
            completedChallenges: [],
            // V2 fields
            refreshCountToday: 0,
            refreshUsedOnCurrent: false,
            hardCompleted: 0,
            eliteCompleted: 0,
            noRefreshStreak: 0,
            graceTokenUsedDate: null,
            currentDifficulty: 'standard',
            completedLessons: [],
            reflections: [],
            earnedBadges: [],
            createdAt: new Date().toISOString(),
            version: 2
        };

        localStorage.setItem('courageRepsData', JSON.stringify(userData));
        window.location.href = 'dashboard.html';
    }

    // Event listeners
    function attachEventListeners() {
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                renderQuestion();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentQuestion < QUESTIONS.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                showResults();
            }
        });

        startTrainingBtn.addEventListener('click', startTraining);
    }

    // Start the app
    document.addEventListener('DOMContentLoaded', init);
})();
