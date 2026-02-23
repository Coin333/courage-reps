/**
 * COURAGE REPS V2 - Badges Module
 * Handles the badges and achievements functionality
 */

(function() {
    'use strict';

    // SVG Icons - Minimal geometric style
    const SVG_ICONS = {
        target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z"/></svg>',
        bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M6 3h12v6a6 6 0 11-12 0V3zM9 21h6M12 15v6"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        hundred: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="4" y="17" font-size="14" font-weight="700" fill="currentColor" stroke="none">100</text></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c-4-2.5-8-5.5-8-11V5l8-3 8 3v6c0 5.5-4 8.5-8 11z"/></svg>',
        book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>',
        crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 17l3-8 5 4 2-11 2 11 5-4 3 8H2zM4 21h16"/></svg>',
        diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9l4-5h12l4 5-10 12L2 9z"/><path d="M2 9h20M7 4l-1 5 6 10M17 4l1 5-6 10"/></svg>'
    };

    // Badges data with requirements and progress tracking
    const BADGES_DATA = [
        {
            id: 'first_rep',
            name: 'First Rep',
            description: 'Complete your first challenge',
            icon: 'target',
            check: (data) => (data.totalCompleted || 0) >= 1,
            getProgress: (data) => ({ current: Math.min(data.totalCompleted || 0, 1), max: 1 })
        },
        {
            id: 'week_warrior',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: 'flame',
            check: (data) => (data.streak >= 7) || (data.bestStreak >= 7),
            getProgress: (data) => ({ current: Math.min(Math.max(data.streak || 0, data.bestStreak || 0), 7), max: 7 })
        },
        {
            id: 'hard_charger',
            name: 'Hard Charger',
            description: 'Complete a Hard challenge',
            icon: 'bolt',
            check: (data) => (data.hardCompleted || 0) >= 1,
            getProgress: (data) => ({ current: Math.min(data.hardCompleted || 0, 1), max: 1 })
        },
        {
            id: 'thirty_strong',
            name: 'Thirty Strong',
            description: 'Complete 30 challenges',
            icon: 'trophy',
            check: (data) => (data.totalCompleted || 0) >= 30,
            getProgress: (data) => ({ current: Math.min(data.totalCompleted || 0, 30), max: 30 })
        },
        {
            id: 'level_five',
            name: 'Level 5',
            description: 'Reach Social Dominance',
            icon: 'star',
            check: (data) => (data.level || 1) >= 5,
            getProgress: (data) => ({ current: Math.min(data.level || 1, 5), max: 5 })
        },
        {
            id: 'century',
            name: 'Century Club',
            description: 'Complete 100 challenges',
            icon: 'hundred',
            check: (data) => (data.totalCompleted || 0) >= 100,
            getProgress: (data) => ({ current: Math.min(data.totalCompleted || 0, 100), max: 100 })
        },
        {
            id: 'no_refresh_week',
            name: 'Committed',
            description: '7 challenges without refresh',
            icon: 'shield',
            check: (data) => (data.noRefreshStreak || 0) >= 7,
            getProgress: (data) => ({ current: Math.min(data.noRefreshStreak || 0, 7), max: 7 })
        },
        {
            id: 'scholar',
            name: 'Scholar',
            description: 'Complete all lessons',
            icon: 'book',
            check: (data) => (data.completedLessons?.length || 0) >= 10,
            getProgress: (data) => ({ current: Math.min(data.completedLessons?.length || 0, 10), max: 10 })
        },
        {
            id: 'month_master',
            name: 'Month Master',
            description: 'Maintain a 30-day streak',
            icon: 'crown',
            check: (data) => (data.streak >= 30) || (data.bestStreak >= 30),
            getProgress: (data) => ({ current: Math.min(Math.max(data.streak || 0, data.bestStreak || 0), 30), max: 30 })
        },
        {
            id: 'elite_runner',
            name: 'Elite Runner',
            description: 'Complete an Elite challenge',
            icon: 'diamond',
            check: (data) => (data.eliteCompleted || 0) >= 1,
            getProgress: (data) => ({ current: Math.min(data.eliteCompleted || 0, 1), max: 1 })
        }
    ];

    // Title unlocks based on level
    const TITLES = [
        { name: 'Wallflower', level: 1 },
        { name: 'Observer', level: 2 },
        { name: 'Initiator', level: 3 },
        { name: 'Connector', level: 4 },
        { name: 'Influencer', level: 5 },
        { name: 'Social Architect', level: 6 }
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

    // Render badges grid with progress bars
    function renderBadges() {
        if (!badgesGrid) return;
        
        badgesGrid.innerHTML = '';
        
        BADGES_DATA.forEach(badge => {
            const isEarned = badge.check(userData);
            const progress = badge.getProgress(userData);
            const progressPercent = Math.min((progress.current / progress.max) * 100, 100);
            const svgIcon = SVG_ICONS[badge.icon] || SVG_ICONS.target;
            
            const card = document.createElement('div');
            card.className = `badge-card ${isEarned ? 'earned' : 'locked'}`;
            
            card.innerHTML = `
                <div class="badge-icon-wrapper">
                    <span class="badge-icon badge-icon-svg">${svgIcon}</span>
                </div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
                <div class="badge-progress">
                    <div class="badge-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="badge-progress-text">${isEarned ? 'Unlocked' : `${progress.current} / ${progress.max}`}</div>
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
            titleEl.textContent = `Lv${title.level}: ${title.name}`;
            
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
