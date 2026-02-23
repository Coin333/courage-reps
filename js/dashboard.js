/**
 * COURAGE REPS - Dashboard Module
 * Handles the main training dashboard functionality
 */

(function() {
    'use strict';

    // Constants
    const XP_PER_COMPLETION = 10;
    const XP_TO_LEVEL_UP = 70;
    const CHALLENGES_TO_INCREASE_DIFFICULTY = 7;
    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    // State
    let userData = null;

    // DOM Elements
    const currentLevelEl = document.getElementById('current-level');
    const currentStreakEl = document.getElementById('current-streak');
    const currentXPEl = document.getElementById('current-xp');
    const xpFillEl = document.getElementById('xp-fill');
    const challengeLevelEl = document.getElementById('challenge-level');
    const challengeTextEl = document.getElementById('challenge-text');
    const countdownEl = document.getElementById('countdown');
    const completeBtnEl = document.getElementById('complete-btn');
    const completedMessageEl = document.getElementById('completed-message');
    const challengeCardEl = document.getElementById('challenge-card');
    const challengeActionsEl = document.querySelector('.challenge-actions');
    const totalCompletedEl = document.getElementById('total-completed');
    const totalXPEl = document.getElementById('total-xp');
    const bestStreakEl = document.getElementById('best-streak');
    const daysTrainedEl = document.getElementById('days-trained');
    const resetBtnEl = document.getElementById('reset-btn');
    const timerEl = document.getElementById('timer');

    // Initialize
    function init() {
        loadUserData();
        
        if (!userData || !userData.pretestCompleted) {
            // Redirect to pretest
            window.location.href = 'index.html';
            return;
        }

        checkDayRollover();
        updateUI();
        startCountdown();
        attachEventListeners();
    }

    // Load user data from localStorage
    function loadUserData() {
        const data = localStorage.getItem('courageRepsData');
        if (data) {
            userData = JSON.parse(data);
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('courageRepsData', JSON.stringify(userData));
    }

    // Check if day has changed and handle accordingly
    function checkDayRollover() {
        const today = getDateString(new Date());
        
        // Check if this is a new day
        if (userData.challengeDate !== today) {
            // Check if streak should reset (missed more than 1 day)
            if (userData.lastCompletionDate) {
                const lastCompletion = new Date(userData.lastCompletionDate);
                const now = new Date();
                const daysDiff = Math.floor((now - lastCompletion) / MS_PER_DAY);
                
                if (daysDiff > 1) {
                    // Streak broken
                    userData.streak = 0;
                }
            }
            
            // Generate new challenge for today
            userData.currentChallenge = getUniqueDailyChallenge(
                userData.level, 
                userData.completedChallenges || []
            );
            userData.challengeDate = today;
            userData.challengeCompleted = false;
            
            saveUserData();
        }
    }

    // Get date string in YYYY-MM-DD format
    function getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    // Update all UI elements
    function updateUI() {
        // Header stats
        currentLevelEl.textContent = userData.level;
        currentStreakEl.textContent = userData.streak;

        // XP Section
        const xpInCurrentLevel = userData.xp % XP_TO_LEVEL_UP;
        currentXPEl.textContent = xpInCurrentLevel;
        const xpPercentage = (xpInCurrentLevel / XP_TO_LEVEL_UP) * 100;
        xpFillEl.style.width = `${xpPercentage}%`;

        // Challenge Section
        challengeLevelEl.textContent = userData.level;
        challengeTextEl.textContent = userData.currentChallenge || 'Loading challenge...';

        // Show/hide completion state
        if (userData.challengeCompleted) {
            showCompletedState();
        } else {
            showActiveState();
        }

        // Stats Section
        totalCompletedEl.textContent = userData.totalCompleted || 0;
        totalXPEl.textContent = userData.totalXP || 0;
        bestStreakEl.textContent = userData.bestStreak || 0;
        daysTrainedEl.textContent = userData.daysTrained || 0;
    }

    // Show challenge as completed
    function showCompletedState() {
        challengeCardEl.classList.add('hidden');
        challengeActionsEl.classList.add('hidden');
        completedMessageEl.classList.remove('hidden');
        timerEl.classList.add('hidden');
    }

    // Show active challenge
    function showActiveState() {
        challengeCardEl.classList.remove('hidden');
        challengeActionsEl.classList.remove('hidden');
        completedMessageEl.classList.add('hidden');
        timerEl.classList.remove('hidden');
    }

    // Handle challenge completion
    function completeChallenge() {
        if (userData.challengeCompleted) return;

        const today = getDateString(new Date());
        const lastCompletion = userData.lastCompletionDate;

        // Update completion status
        userData.challengeCompleted = true;
        userData.lastCompletionDate = today;

        // Add XP
        userData.xp += XP_PER_COMPLETION;
        userData.totalXP = (userData.totalXP || 0) + XP_PER_COMPLETION;

        // Update streak
        if (lastCompletion) {
            const lastDate = new Date(lastCompletion);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastDate) / MS_PER_DAY);
            
            if (daysDiff === 1) {
                // Consecutive day
                userData.streak++;
            } else if (daysDiff === 0) {
                // Same day, don't change streak
            } else {
                // Missed days, reset streak
                userData.streak = 1;
            }
        } else {
            // First completion
            userData.streak = 1;
        }

        // Update best streak
        if (userData.streak > userData.bestStreak) {
            userData.bestStreak = userData.streak;
        }

        // Update total completed
        userData.totalCompleted = (userData.totalCompleted || 0) + 1;
        userData.daysTrained = (userData.daysTrained || 0) + 1;

        // Track completed challenges
        if (!userData.completedChallenges) {
            userData.completedChallenges = [];
        }
        userData.completedChallenges.push(userData.currentChallenge);
        
        // Keep only last 20 challenges to prevent list from growing too large
        if (userData.completedChallenges.length > 20) {
            userData.completedChallenges = userData.completedChallenges.slice(-20);
        }

        // Check for level up
        checkLevelUp();

        // Check for difficulty increase (every 7 challenges)
        checkDifficultyIncrease();

        // Save and update UI
        saveUserData();
        updateUI();
    }

    // Check if user should level up
    function checkLevelUp() {
        while (userData.xp >= XP_TO_LEVEL_UP) {
            userData.xp -= XP_TO_LEVEL_UP;
            userData.level = Math.min(userData.level + 1, 5);
        }
    }

    // Check if difficulty should increase (every 7 challenges)
    function checkDifficultyIncrease() {
        // Difficulty already tied to level, which increases with XP
        // This is handled by the level up system
    }

    // Countdown timer
    function startCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        if (userData.challengeCompleted) {
            // Show time until next challenge
            countdownEl.textContent = getTimeUntilMidnight();
        } else {
            // Show time remaining to complete
            countdownEl.textContent = getTimeUntilMidnight();
        }
    }

    function getTimeUntilMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        
        const diff = midnight - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Reset progress
    function resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('courageRepsData');
            window.location.href = 'index.html';
        }
    }

    // Event listeners
    function attachEventListeners() {
        completeBtnEl.addEventListener('click', completeChallenge);
        resetBtnEl.addEventListener('click', resetProgress);
    }

    // Start the app
    document.addEventListener('DOMContentLoaded', init);
})();
