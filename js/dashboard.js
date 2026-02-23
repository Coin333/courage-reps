/**
 * COURAGE REPS V2 - Dashboard Module
 * Handles the main training dashboard functionality
 */

(function() {
    'use strict';

    // V2 Constants
    const BASE_XP_PER_COMPLETION = 20;
    const NO_REFRESH_BONUS = 10;
    const HARD_DIFFICULTY_BONUS = 10;
    const STREAK_7_BONUS = 50;
    const MAX_REFRESHES_PER_DAY = 2;
    const REFRESH_XP_PENALTY = 0.20; // 20% reduction
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const GRACE_TOKEN_COOLDOWN_DAYS = 30;

    // State
    let userData = null;

    // DOM Elements
    const currentLevelEl = document.getElementById('current-level');
    const levelTitleEl = document.getElementById('level-title');
    const currentStreakEl = document.getElementById('current-streak');
    const currentXPEl = document.getElementById('current-xp');
    const xpToNextEl = document.getElementById('xp-to-next');
    const nextLevelTitleEl = document.getElementById('next-level-title');
    const xpFillEl = document.getElementById('xp-fill');
    const challengeLevelEl = document.getElementById('challenge-level');
    const challengeDifficultyEl = document.getElementById('challenge-difficulty');
    const challengeTextEl = document.getElementById('challenge-text');
    const xpRewardEl = document.getElementById('xp-reward');
    const xpBonusEl = document.getElementById('xp-bonus');
    const countdownEl = document.getElementById('countdown');
    const completeBtnEl = document.getElementById('complete-btn');
    const refreshBtnEl = document.getElementById('refresh-btn');
    const refreshCountEl = document.getElementById('refresh-count');
    const refreshWarningEl = document.getElementById('refresh-warning');
    const completedMessageEl = document.getElementById('completed-message');
    const challengeCardEl = document.getElementById('challenge-card');
    const challengeActionsEl = document.querySelector('.challenge-actions');
    const xpEarnedEl = document.getElementById('xp-earned');
    const reflectBtnEl = document.getElementById('reflect-btn');
    const totalCompletedEl = document.getElementById('total-completed');
    const totalXPEl = document.getElementById('total-xp');
    const bestStreakEl = document.getElementById('best-streak');
    const badgesEarnedEl = document.getElementById('badges-earned');
    const resetBtnEl = document.getElementById('reset-btn');
    const timerEl = document.getElementById('timer');
    const streakFillEl = document.getElementById('streak-fill');
    const nextMilestoneEl = document.getElementById('next-milestone');
    const graceAvailableEl = document.getElementById('grace-available');
    
    // Inline Reflection Elements
    const inlineReflectionEl = document.getElementById('inline-reflection');
    const inlineReflectionInputEl = document.getElementById('inline-reflection-input');
    const inlineAnalyzeBtnEl = document.getElementById('inline-analyze-btn');
    const inlineSkipBtnEl = document.getElementById('inline-skip-btn');
    const inlineFeedbackEl = document.getElementById('inline-feedback');
    const inlineFeedbackLoadingEl = document.getElementById('inline-feedback-loading');
    const inlineFeedbackResultEl = document.getElementById('inline-feedback-result');
    const inlineStrengthsListEl = document.getElementById('inline-strengths-list');
    const inlineImprovementsListEl = document.getElementById('inline-improvements-list');
    const inlineNextFocusTextEl = document.getElementById('inline-next-focus-text');
    const completedFooterEl = document.getElementById('completed-footer');

    // Initialize
    function init() {
        loadUserData();
        
        if (!userData || !userData.pretestCompleted) {
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
            // Initialize V2 fields if missing
            if (userData.refreshCountToday === undefined) userData.refreshCountToday = 0;
            if (userData.refreshUsedOnCurrent === undefined) userData.refreshUsedOnCurrent = false;
            if (userData.hardCompleted === undefined) userData.hardCompleted = 0;
            if (userData.eliteCompleted === undefined) userData.eliteCompleted = 0;
            if (userData.noRefreshStreak === undefined) userData.noRefreshStreak = 0;
            if (userData.graceTokenUsedDate === undefined) userData.graceTokenUsedDate = null;
            if (userData.currentDifficulty === undefined) userData.currentDifficulty = 'standard';
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('courageRepsData', JSON.stringify(userData));
    }

    // Check if day has changed and handle accordingly
    function checkDayRollover() {
        const today = getDateString(new Date());
        
        if (userData.challengeDate !== today) {
            // Check if streak should reset (missed more than 1 day)
            if (userData.lastCompletionDate) {
                const lastCompletion = new Date(userData.lastCompletionDate);
                const now = new Date();
                const daysDiff = Math.floor((now - lastCompletion) / MS_PER_DAY);
                
                if (daysDiff > 1) {
                    // Check for grace token
                    if (isGraceTokenAvailable() && daysDiff === 2) {
                        // Use grace token automatically
                        userData.graceTokenUsedDate = today;
                    } else {
                        // Streak broken
                        userData.streak = 0;
                    }
                }
            }
            
            // Reset daily refresh count
            userData.refreshCountToday = 0;
            userData.refreshUsedOnCurrent = false;
            
            // Determine difficulty for new challenge
            const difficulty = getDifficultyForLevel(userData.level);
            userData.currentDifficulty = difficulty;
            
            // Generate new challenge for today
            const challenge = getUniqueDailyChallenge(
                userData.level, 
                userData.completedChallenges || [],
                difficulty
            );
            userData.currentChallenge = challenge.text;
            userData.challengeDifficulty = challenge.difficulty;
            userData.challengeDate = today;
            userData.challengeCompleted = false;
            
            saveUserData();
        }
    }

    // Determine appropriate difficulty based on level
    function getDifficultyForLevel(level) {
        // Random chance for hard mode at level 3+
        if (level >= 5 && Math.random() < 0.15) {
            return 'elite';
        } else if (level >= 3 && Math.random() < 0.25) {
            return 'hard';
        }
        return 'standard';
    }

    // Check if grace token is available
    function isGraceTokenAvailable() {
        if (!userData.graceTokenUsedDate) return true;
        
        const lastUsed = new Date(userData.graceTokenUsedDate);
        const now = new Date();
        const daysSince = Math.floor((now - lastUsed) / MS_PER_DAY);
        
        return daysSince >= GRACE_TOKEN_COOLDOWN_DAYS;
    }

    // Get date string in YYYY-MM-DD format
    function getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    // Calculate XP needed for next level
    function getXPNeededForNextLevel() {
        const level = userData.level;
        if (level >= 6) {
            return Math.pow(2, level - 5) * 1600;
        }
        const thresholds = { 1: 100, 2: 200, 3: 400, 4: 800, 5: 1600 };
        return thresholds[level] || 1600;
    }

    // Calculate XP reward for current challenge
    function calculateXPReward() {
        let xp = BASE_XP_PER_COMPLETION;
        
        // Hard difficulty bonus
        if (userData.challengeDifficulty === 'Hard') {
            xp += HARD_DIFFICULTY_BONUS;
        } else if (userData.challengeDifficulty === 'Elite') {
            xp += HARD_DIFFICULTY_BONUS * 2;
        }
        
        // Refresh penalty
        if (userData.refreshUsedOnCurrent) {
            xp = Math.floor(xp * (1 - REFRESH_XP_PENALTY));
        }
        
        return xp;
    }

    // Update all UI elements
    function updateUI() {
        // Header stats
        currentLevelEl.textContent = userData.level;
        if (levelTitleEl && typeof LEVEL_TITLES !== 'undefined') {
            levelTitleEl.textContent = LEVEL_TITLES[userData.level] || '';
        }
        currentStreakEl.textContent = userData.streak;

        // XP Section
        const xpNeeded = getXPNeededForNextLevel();
        const xpInCurrentLevel = userData.xp;
        currentXPEl.textContent = xpInCurrentLevel;
        xpToNextEl.textContent = xpNeeded;
        const xpPercentage = Math.min((xpInCurrentLevel / xpNeeded) * 100, 100);
        xpFillEl.style.width = `${xpPercentage}%`;
        
        if (nextLevelTitleEl && typeof LEVEL_TITLES !== 'undefined') {
            const nextLevel = Math.min(userData.level + 1, 6);
            nextLevelTitleEl.textContent = LEVEL_TITLES[nextLevel] || 'Max Level';
        }

        // Challenge Section
        challengeLevelEl.textContent = userData.level;
        challengeTextEl.textContent = userData.currentChallenge || 'Loading challenge...';
        
        if (challengeDifficultyEl) {
            challengeDifficultyEl.textContent = userData.challengeDifficulty || 'Standard';
            challengeDifficultyEl.className = 'challenge-difficulty';
            if (userData.challengeDifficulty === 'Hard') {
                challengeDifficultyEl.classList.add('hard');
            } else if (userData.challengeDifficulty === 'Elite') {
                challengeDifficultyEl.classList.add('elite');
            }
        }

        // XP display
        const xpReward = calculateXPReward();
        if (xpRewardEl) xpRewardEl.textContent = `+${xpReward} XP`;
        
        if (xpBonusEl) {
            if (!userData.refreshUsedOnCurrent) {
                xpBonusEl.textContent = `+${NO_REFRESH_BONUS} No Refresh Bonus`;
                xpBonusEl.classList.remove('hidden');
            } else {
                xpBonusEl.classList.add('hidden');
            }
        }

        // Refresh button
        const refreshesLeft = MAX_REFRESHES_PER_DAY - userData.refreshCountToday;
        if (refreshCountEl) refreshCountEl.textContent = refreshesLeft;
        if (refreshBtnEl) {
            refreshBtnEl.disabled = refreshesLeft <= 0 || userData.challengeCompleted;
        }
        if (refreshWarningEl) {
            if (userData.refreshUsedOnCurrent) {
                refreshWarningEl.classList.remove('hidden');
            } else {
                refreshWarningEl.classList.add('hidden');
            }
        }

        // Show/hide completion state
        if (userData.challengeCompleted) {
            showCompletedState();
        } else {
            showActiveState();
        }

        // Streak section
        const streakProgress = Math.min((userData.streak / 7) * 100, 100);
        if (streakFillEl) streakFillEl.style.width = `${streakProgress}%`;
        
        if (nextMilestoneEl) {
            if (userData.streak >= 30) {
                nextMilestoneEl.textContent = 'Max milestone reached!';
            } else if (userData.streak >= 7) {
                nextMilestoneEl.textContent = '30';
            } else {
                nextMilestoneEl.textContent = '7';
            }
        }
        
        if (graceAvailableEl) {
            graceAvailableEl.textContent = isGraceTokenAvailable() ? 'Available' : 'Used';
        }

        // Stats Section
        totalCompletedEl.textContent = userData.totalCompleted || 0;
        totalXPEl.textContent = userData.totalXP || 0;
        bestStreakEl.textContent = userData.bestStreak || 0;
        
        // Badge count
        if (badgesEarnedEl) {
            const badgeCount = countEarnedBadges();
            badgesEarnedEl.textContent = badgeCount;
        }
    }

    // Count earned badges
    function countEarnedBadges() {
        let count = 0;
        const data = userData;
        
        if (data.totalCompleted >= 1) count++;
        if (data.streak >= 7 || data.bestStreak >= 7) count++;
        if (data.hardCompleted >= 1) count++;
        if (data.totalCompleted >= 30) count++;
        if (data.level >= 5) count++;
        if (data.totalCompleted >= 100) count++;
        if (data.noRefreshStreak >= 7) count++;
        if ((data.completedLessons?.length || 0) >= 10) count++;
        if (data.streak >= 30 || data.bestStreak >= 30) count++;
        if (data.eliteCompleted >= 1) count++;
        
        return count;
    }

    // Show challenge as completed
    function showCompletedState() {
        if (challengeCardEl) challengeCardEl.classList.add('hidden');
        if (challengeActionsEl) challengeActionsEl.classList.add('hidden');
        if (completedMessageEl) completedMessageEl.classList.remove('hidden');
        if (timerEl) timerEl.classList.add('hidden');
    }

    // Show active challenge
    function showActiveState() {
        if (challengeCardEl) challengeCardEl.classList.remove('hidden');
        if (challengeActionsEl) challengeActionsEl.classList.remove('hidden');
        if (completedMessageEl) completedMessageEl.classList.add('hidden');
        if (timerEl) timerEl.classList.remove('hidden');
    }

    // Handle challenge refresh
    function refreshChallenge() {
        if (userData.refreshCountToday >= MAX_REFRESHES_PER_DAY) return;
        if (userData.challengeCompleted) return;
        
        userData.refreshCountToday++;
        userData.refreshUsedOnCurrent = true;
        
        // Get new challenge at same difficulty
        const challenge = getUniqueDailyChallenge(
            userData.level,
            userData.completedChallenges || [],
            userData.currentDifficulty
        );
        userData.currentChallenge = challenge.text;
        
        saveUserData();
        updateUI();
    }

    // Handle challenge completion
    function completeChallenge() {
        if (userData.challengeCompleted) return;

        const today = getDateString(new Date());
        const lastCompletion = userData.lastCompletionDate;

        // Calculate XP earned
        let xpEarned = calculateXPReward();
        
        // No refresh bonus
        if (!userData.refreshUsedOnCurrent) {
            xpEarned += NO_REFRESH_BONUS;
            userData.noRefreshStreak = (userData.noRefreshStreak || 0) + 1;
        } else {
            userData.noRefreshStreak = 0;
        }

        // Update completion status
        userData.challengeCompleted = true;
        userData.lastCompletionDate = today;

        // Add XP
        userData.xp += xpEarned;
        userData.totalXP = (userData.totalXP || 0) + xpEarned;

        // Update streak
        if (lastCompletion) {
            const lastDate = new Date(lastCompletion);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastDate) / MS_PER_DAY);
            
            if (daysDiff === 1) {
                userData.streak++;
            } else if (daysDiff === 0) {
                // Same day, don't change streak
            } else {
                userData.streak = 1;
            }
        } else {
            userData.streak = 1;
        }

        // Check for streak bonus
        if (userData.streak === 7 || userData.streak === 14 || userData.streak === 21 || userData.streak === 28) {
            xpEarned += STREAK_7_BONUS;
            userData.xp += STREAK_7_BONUS;
            userData.totalXP += STREAK_7_BONUS;
        }

        // Update best streak
        if (userData.streak > userData.bestStreak) {
            userData.bestStreak = userData.streak;
        }

        // Track difficulty completions
        if (userData.challengeDifficulty === 'Hard') {
            userData.hardCompleted = (userData.hardCompleted || 0) + 1;
        } else if (userData.challengeDifficulty === 'Elite') {
            userData.eliteCompleted = (userData.eliteCompleted || 0) + 1;
        }

        // Update total completed
        userData.totalCompleted = (userData.totalCompleted || 0) + 1;

        // Track completed challenges
        if (!userData.completedChallenges) {
            userData.completedChallenges = [];
        }
        userData.completedChallenges.push(userData.currentChallenge);
        
        if (userData.completedChallenges.length > 30) {
            userData.completedChallenges = userData.completedChallenges.slice(-30);
        }

        // Check for level up
        checkLevelUp();

        // Update earned amount display
        if (xpEarnedEl) xpEarnedEl.textContent = `+${xpEarned} XP earned`;

        // Save and update UI
        saveUserData();
        updateUI();
    }

    // Check if user should level up
    function checkLevelUp() {
        const xpNeeded = getXPNeededForNextLevel();
        while (userData.xp >= xpNeeded && userData.level < 6) {
            userData.xp -= xpNeeded;
            userData.level++;
        }
    }

    // Skip reflection and show footer
    function skipReflection() {
        if (inlineReflectionEl) inlineReflectionEl.classList.add('hidden');
        if (completedFooterEl) completedFooterEl.classList.remove('hidden');
    }

    // Analyze inline reflection
    async function analyzeInlineReflection() {
        const reflection = inlineReflectionInputEl ? inlineReflectionInputEl.value.trim() : '';
        if (!reflection || reflection.length < 10) {
            alert('Please describe your interaction in more detail.');
            return;
        }
        
        if (inlineAnalyzeBtnEl) inlineAnalyzeBtnEl.disabled = true;
        if (inlineSkipBtnEl) inlineSkipBtnEl.classList.add('hidden');
        if (inlineFeedbackEl) inlineFeedbackEl.classList.remove('hidden');
        if (inlineFeedbackLoadingEl) inlineFeedbackLoadingEl.classList.remove('hidden');
        if (inlineFeedbackResultEl) inlineFeedbackResultEl.classList.add('hidden');
        
        try {
            const analysis = await window.FeedbackSystem.analyzeInteraction(reflection);
            
            if (inlineFeedbackLoadingEl) inlineFeedbackLoadingEl.classList.add('hidden');
            if (inlineFeedbackResultEl) inlineFeedbackResultEl.classList.remove('hidden');
            
            if (inlineStrengthsListEl) {
                inlineStrengthsListEl.innerHTML = analysis.strengths.map(s => `<li>${s}</li>`).join('');
            }
            if (inlineImprovementsListEl) {
                inlineImprovementsListEl.innerHTML = analysis.improvements.map(i => `<li>${i}</li>`).join('');
            }
            if (inlineNextFocusTextEl) {
                inlineNextFocusTextEl.textContent = analysis.nextFocus;
            }
            
            // Hide input and buttons after analysis
            if (inlineReflectionInputEl) inlineReflectionInputEl.classList.add('hidden');
            if (inlineAnalyzeBtnEl) inlineAnalyzeBtnEl.classList.add('hidden');
            
            // Show footer
            if (completedFooterEl) completedFooterEl.classList.remove('hidden');
            
            // Save reflection
            window.FeedbackSystem.saveReflection(reflection, analysis);
        } catch (error) {
            if (inlineFeedbackLoadingEl) inlineFeedbackLoadingEl.classList.add('hidden');
            if (inlineAnalyzeBtnEl) {
                inlineAnalyzeBtnEl.disabled = false;
                inlineAnalyzeBtnEl.classList.remove('hidden');
            }
            if (inlineSkipBtnEl) inlineSkipBtnEl.classList.remove('hidden');
            alert('Error analyzing reflection. Please try again.');
        }
    }

    // Countdown timer
    function startCountdown() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        if (countdownEl) {
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
        if (completeBtnEl) completeBtnEl.addEventListener('click', completeChallenge);
        if (refreshBtnEl) refreshBtnEl.addEventListener('click', refreshChallenge);
        if (resetBtnEl) resetBtnEl.addEventListener('click', resetProgress);
        
        // Inline reflection handlers
        if (inlineAnalyzeBtnEl) inlineAnalyzeBtnEl.addEventListener('click', analyzeInlineReflection);
        if (inlineSkipBtnEl) inlineSkipBtnEl.addEventListener('click', skipReflection);
    }

    // Start the app
    document.addEventListener('DOMContentLoaded', init);
})();
