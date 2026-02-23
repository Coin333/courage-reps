/**
 * COURAGE REPS V2 - Badges Module
 * Handles the badges and achievements functionality
 */

(function() {
    'use strict';

    // Badges data with requirements
    const BADGES_DATA = [
        {
            id: 'first_rep',
            name: 'First Rep',
            description: 'Complete your first challenge',
            icon: '🎯',
            check: (data) => (data.totalCompleted || 0) >= 1
        },
        {
            id: 'week_warrior',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            check: (data) => (data.streak >= 7) || (data.bestStreak >= 7)
        },
        {
            id: 'hard_charger',
            name: 'Hard Charger',
            description: 'Complete your first Hard challenge',
            icon: '💪',
            check: (data) => (data.hardCompleted || 0) >= 1
        },
        {
            id: 'thirty_strong',
            name: 'Thirty Strong',
            description: 'Complete 30 challenges',
            icon: '🏆',
            check: (data) => (data.totalCompleted || 0) >= 30
        },
        {
            id: 'level_five',
            name: 'Level 5 Achieved',
            description: 'Reach Level 5: Social Dominance',
            icon: '⭐',
            check: (data) => (data.level || 1) >= 5
        },
        {
            id: 'century',
            name: 'Century Club',
            description: 'Complete 100 interactions',
            icon: '💯',
            check: (data) => (data.totalCompleted || 0) >= 100
        },
        {
            id: 'no_refresh_week',
            name: 'Committed',
            description: 'Complete 7 challenges without refreshing',
            icon: '🎖',
            check: (data) => (data.noRefreshStreak || 0) >= 7
        },
        {
            id: 'scholar',
            name: 'Scholar',
            description: 'Complete all lessons',
            icon: '📚',
            check: (data) => (data.completedLessons?.length || 0) >= 10
        },
        {
            id: 'month_master',
            name: 'Month Master',
            description: 'Maintain a 30-day streak',
            icon: '👑',
            check: (data) => (data.streak >= 30) || (data.bestStreak >= 30)
        },
        {
            id: 'elite_runner',
            name: 'Elite Runner',
            description: 'Complete an Elite challenge',
            icon: '🌟',
            check: (data) => (data.eliteCompleted || 0) >= 1
        }
    ];

    // Title unlocks based on level
    const TITLES = [
        { name: 'Initiate', level: 1 },
        { name: 'Apprentice', level: 2 },
        { name: 'Confident', level: 3 },
        { name: 'Leader', level: 4 },
        { name: 'Dominant', level: 5 },
        { name: 'Influential', level: 6 }
    ];

    // State
    let userData = null;

    // DOM Elements
    const badgesGrid = document.getElementById('badges-grid');
    const titlesList = document.getElementById('titles-list');
    const badgesCountEl = document.getElementById('badges-count');
    const currentLevelEl = document.getElementById('current-level');

    // Initialize
    function init() {
        loadUserData();
        renderBadges();
        renderTitles();
        updateHeader();
    }

    // Load user data
    function loadUserData() {
        const data = localStorage.getItem('courageRepsData');
        if (data) {
            userData = JSON.parse(data);
        } else {
            userData = { level: 1, totalCompleted: 0, streak: 0, bestStreak: 0 };
        }
        
        if (!userData.earnedBadges) {
            userData.earnedBadges = [];
        }
    }

    // Update header stats
    function updateHeader() {
        if (currentLevelEl) currentLevelEl.textContent = userData.level || 1;
        
        // Count earned badges
        const earnedCount = BADGES_DATA.filter(badge => badge.check(userData)).length;
        if (badgesCountEl) badgesCountEl.textContent = earnedCount;
    }

    // Render badges grid
    function renderBadges() {
        if (!badgesGrid) return;
        
        badgesGrid.innerHTML = '';
        
        BADGES_DATA.forEach(badge => {
            const isEarned = badge.check(userData);
            
            const card = document.createElement('div');
            card.className = `badge-card ${isEarned ? 'earned' : 'locked'}`;
            
            card.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
            `;
            
            badgesGrid.appendChild(card);
        });
    }

    // Render titles list
    function renderTitles() {
        if (!titlesList) return;
        
        titlesList.innerHTML = '';
        
        TITLES.forEach(title => {
            const isUnlocked = (userData.level || 1) >= title.level;
            
            const titleEl = document.createElement('span');
            titleEl.className = `title-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
            titleEl.textContent = title.name;
            
            titlesList.appendChild(titleEl);
        });
    }

    // Check and award new badges (called from dashboard)
    function checkNewBadges() {
        let newBadges = [];
        
        BADGES_DATA.forEach(badge => {
            if (badge.check(userData) && !userData.earnedBadges.includes(badge.id)) {
                userData.earnedBadges.push(badge.id);
                newBadges.push(badge);
            }
        });
        
        if (newBadges.length > 0) {
            localStorage.setItem('courageRepsData', JSON.stringify(userData));
        }
        
        return newBadges;
    }

    // Export for use in dashboard
    window.BadgeSystem = {
        checkNewBadges,
        getBadgeCount: () => BADGES_DATA.filter(badge => badge.check(userData)).length
    };

    // Start
    document.addEventListener('DOMContentLoaded', init);
})();
