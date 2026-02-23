/**
 * COURAGE REPS V2 - Lessons Module
 * Handles the social skills lessons functionality
 */

(function() {
    'use strict';

    // Lessons data
    const LESSONS = [
        {
            id: 1,
            title: "Eye Contact Fundamentals",
            icon: "👁",
            concept: "Eye contact is the foundation of social connection. It signals confidence, attentiveness, and respect. Mastering eye contact means knowing when to look, how long to hold, and when to break naturally.",
            why: "Eye contact activates the social brain and creates trust. Studies show that appropriate eye contact increases perceived competence by 47%. Without it, your words lose impact.",
            example: "When meeting someone new, make eye contact as you approach. Hold for 2-3 seconds while greeting, then naturally glance away before re-engaging. During conversation, maintain contact about 60% of the time.",
            drills: [
                "Practice the 3-second hold with strangers (count internally)",
                "When listening, hold eye contact longer than when speaking",
                "Try the triangle technique: eyes to mouth to eyes",
                "Watch a video of yourself speaking - check your eye patterns"
            ],
            mistakes: [
                "Staring without blinking (intimidating)",
                "Looking away when making important points",
                "Darting eyes that signal nervousness",
                "Looking at phone/surroundings during conversation"
            ]
        },
        {
            id: 2,
            title: "Voice Projection & Tone",
            icon: "🔊",
            concept: "Your voice is an instrument. How you speak matters as much as what you say. Projection, pace, and tone convey confidence and command attention.",
            why: "A confident voice triggers respect in the listener's brain before they even process your words. Mumbling or upspeak (ending statements like questions) undermines your message.",
            example: "When ordering at a restaurant, project your voice so the server hears you clearly the first time. End your order with a downward inflection, not an upward question tone.",
            drills: [
                "Record yourself and analyze pace, clarity, and tone",
                "Practice speaking from your diaphragm, not your throat",
                "Read paragraphs aloud focusing on varied inflection",
                "Do the 'humming warmup' before important conversations"
            ],
            mistakes: [
                "Speaking too fast when nervous",
                "Trailing off at the end of sentences",
                "Using filler words (um, like, you know)",
                "Monotone delivery that loses engagement"
            ]
        },
        {
            id: 3,
            title: "Body Language Basics",
            icon: "🧍",
            concept: "Your body speaks before your mouth does. Posture, hand position, and physical space all communicate status and confidence non-verbally.",
            why: "Research shows 55% of communication is body language. A closed-off posture signals insecurity even if your words are confident. Alignment between words and body builds trust.",
            example: "When entering a room, stand tall with shoulders back, chin parallel to the ground. Keep hands visible (not in pockets). Take up appropriate space without invading others'.",
            drills: [
                "Practice 'mountain stance': feet hip-width, balanced weight",
                "Check posture every time you walk through a doorway",
                "Mirror power poses for 2 minutes before important situations",
                "Record yourself walking and standing to spot habits"
            ],
            mistakes: [
                "Crossed arms during conversation (defensive)",
                "Hands in pockets constantly (hiding/nervous)",
                "Slouching or hunching shoulders",
                "Taking up too little space (low status signal)"
            ]
        },
        {
            id: 4,
            title: "Asking Quality Questions",
            icon: "❓",
            concept: "Great conversationalists ask great questions. The skill isn't talking more—it's directing conversations into interesting territory through curiosity.",
            why: "Questions show interest and give you control of conversation flow. People remember how you made them feel more than what you said. Good questions make people feel valued.",
            example: "Instead of 'Do you like your job?' try 'What's the most interesting part of your work?' Open-ended questions invite stories and create connection.",
            drills: [
                "Prepare 3 go-to questions for common situations",
                "Practice the 'follow-up rule': always ask one more",
                "Use the journalist technique: Who, What, When, Where, Why, How",
                "After conversations, note which questions sparked energy"
            ],
            mistakes: [
                "Asking yes/no questions that kill momentum",
                "Rapid-fire questions without listening to answers",
                "Questions that are really statements in disguise",
                "Not following up on interesting answers"
            ]
        },
        {
            id: 5,
            title: "Active Listening",
            icon: "👂",
            concept: "Listening is not waiting for your turn to speak. Active listening means fully absorbing, processing, and responding to what someone shares.",
            why: "People can tell when you're not really listening. Active listening builds deep rapport and makes people feel understood. It's rare and therefore powerful.",
            example: "When someone shares a story, resist the urge to immediately share your own. Instead, ask a follow-up question or reflect back what you heard: 'So you felt frustrated when...'",
            drills: [
                "Practice repeating back key points before responding",
                "Notice when your mind starts planning your response—refocus",
                "Use minimal encouragers: 'mmhmm', nodding, 'I see'",
                "After conversations, test yourself: what did they say?"
            ],
            mistakes: [
                "Looking at phone during conversation",
                "Interrupting before they finish",
                "One-upping with your own story immediately",
                "Giving advice when they just wanted to be heard"
            ]
        },
        {
            id: 6,
            title: "Handling Awkward Silences",
            icon: "🤐",
            concept: "Silence is not your enemy. Comfort with pauses signals confidence. The goal isn't filling every gap—it's being comfortable when they occur.",
            why: "Rushing to fill silence shows anxiety. Confident people are comfortable with pauses. Often, the other person will fill the silence themselves if you wait.",
            example: "If conversation stalls, take a breath. Look thoughtful, not panicked. You might say 'That's interesting, let me think about that.' or simply wait 3 seconds before redirecting.",
            drills: [
                "Practice 3-second pauses after someone speaks before responding",
                "In conversations, intentionally let silences happen",
                "Prepare 3 'rescue topics' you can introduce naturally",
                "Notice how others handle pauses—learn from confident people"
            ],
            mistakes: [
                "Filling with nervous filler words",
                "Asking random off-topic questions in panic",
                "Breaking eye contact and looking uncomfortable",
                "Apologizing for the silence"
            ]
        },
        {
            id: 7,
            title: "Starting Conversations",
            icon: "💬",
            concept: "Initiating conversation is a skill that improves with practice. The goal is creating a natural opening that invites engagement without pressure.",
            why: "Most social opportunities are lost because no one initiates. The person who starts wins. Most people are relieved when someone else breaks the ice.",
            example: "Use observational openers: 'That's a great book—have you gotten far?' or situational comments: 'This line is crazy today.' Avoid generic 'nice weather' unless you can make it interesting.",
            drills: [
                "Make one comment per day to a stranger about your environment",
                "Prepare 3 context-appropriate openers for regular situations",
                "Practice the 3-second rule: approach within 3 seconds of noticing",
                "Study what made your best conversation openers work"
            ],
            mistakes: [
                "Overthinking and talking yourself out of it",
                "Starting with 'Sorry to bother you...'",
                "Generic, boring openers that go nowhere",
                "Being too aggressive or invading space"
            ]
        },
        {
            id: 8,
            title: "Graceful Exits",
            icon: "👋",
            concept: "Knowing how to end conversations is as important as starting them. A good exit leaves positive impressions and opens doors for future connection.",
            why: "Conversations that drag on too long leave negative impressions. Exiting gracefully shows social intelligence. It also leaves the other person wanting more.",
            example: "'It was great talking with you—I should let you get back to it!' or 'I need to grab coffee, but let's continue this soon.' Summarize briefly and express appreciation.",
            drills: [
                "Practice 3 exit phrases until they feel natural",
                "Set internal time limits: exit on a high note",
                "Notice how confident people transition out of conversations",
                "When exiting, offer a specific follow-up if appropriate"
            ],
            mistakes: [
                "Lingering too long and killing the vibe",
                "Abrupt exits without transition",
                "Long, awkward goodbyes",
                "Never being the one to end it (always waiting for them)"
            ]
        },
        {
            id: 9,
            title: "Disagreeing Respectfully",
            icon: "🤝",
            concept: "Confident people can disagree without conflict. The skill is expressing your view while maintaining respect and keeping the relationship intact.",
            why: "People-pleasers avoid disagreement and lose respect. Aggressive disagreement damages relationships. The middle path builds credibility and depth.",
            example: "'I see it differently—here's my perspective...' or 'That's interesting. I've found that...' Acknowledge their view before presenting yours.",
            drills: [
                "Practice 'Yes, and...' or 'I see that, and also...' framing",
                "In low-stakes conversations, express minor disagreements",
                "Notice your physical response when you disagree—stay calm",
                "After disagreements, check if the relationship stayed solid"
            ],
            mistakes: [
                "Starting with 'No, you're wrong'",
                "Getting emotional or defensive",
                "Backing down when you have a valid point",
                "Making it personal rather than about the idea"
            ]
        },
        {
            id: 10,
            title: "Recovering from Mistakes",
            icon: "🔄",
            concept: "Social mistakes happen. Recovery is what separates confident people from anxious ones. The skill is acknowledging, adapting, and moving forward without spiraling.",
            why: "Dwelling on mistakes makes them bigger. Quick, graceful recovery actually builds credibility. Others often don't notice what you think is catastrophic.",
            example: "If you forget someone's name: 'I'm terrible with names—remind me?' If you say something awkward: 'That came out wrong—what I meant was...' Then move on without over-apologizing.",
            drills: [
                "Prepare 3 recovery phrases for common mistakes",
                "Practice intentionally making small 'mistakes' to desensitize",
                "After social blunders, write what you'd do differently",
                "Notice that most people forget your mistakes quickly"
            ],
            mistakes: [
                "Over-apologizing and drawing more attention",
                "Leaving immediately out of embarrassment",
                "Replaying the moment for days afterward",
                "Getting defensive or blaming others"
            ]
        }
    ];

    // State
    let userData = null;

    // DOM Elements
    const lessonsGrid = document.getElementById('lessons-grid');
    const lessonsCompletedEl = document.getElementById('lessons-completed');
    const currentLevelEl = document.getElementById('current-level');
    const lessonModal = document.getElementById('lesson-modal');
    const lessonModalClose = document.getElementById('lesson-modal-close');
    const completeLessonBtn = document.getElementById('complete-lesson-btn');

    // Current lesson being viewed
    let currentLessonId = null;

    // Initialize
    function init() {
        loadUserData();
        renderLessons();
        attachEventListeners();
        updateHeader();
    }

    // Load user data
    function loadUserData() {
        const data = localStorage.getItem('courageRepsData');
        if (data) {
            userData = JSON.parse(data);
        } else {
            userData = { completedLessons: [], level: 1, xp: 0, totalXP: 0 };
        }
        
        if (!userData.completedLessons) {
            userData.completedLessons = [];
        }
    }

    // Save user data
    function saveUserData() {
        localStorage.setItem('courageRepsData', JSON.stringify(userData));
    }

    // Update header stats
    function updateHeader() {
        if (currentLevelEl) currentLevelEl.textContent = userData.level || 1;
        if (lessonsCompletedEl) lessonsCompletedEl.textContent = userData.completedLessons.length;
    }

    // Render lessons grid
    function renderLessons() {
        if (!lessonsGrid) return;
        
        lessonsGrid.innerHTML = '';
        
        LESSONS.forEach(lesson => {
            const isCompleted = userData.completedLessons.includes(lesson.id);
            
            const card = document.createElement('div');
            card.className = `lesson-card ${isCompleted ? 'completed' : ''}`;
            card.dataset.lessonId = lesson.id;
            
            card.innerHTML = `
                <span class="lesson-icon">${lesson.icon}</span>
                <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-subtitle">${lesson.drills.length} drills</div>
                </div>
                <div class="lesson-status">
                    ${isCompleted ? '✓ Done' : '<span class="lesson-xp">+5 XP</span>'}
                </div>
            `;
            
            card.addEventListener('click', () => openLesson(lesson.id));
            lessonsGrid.appendChild(card);
        });
    }

    // Open lesson modal
    function openLesson(lessonId) {
        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson) return;
        
        currentLessonId = lessonId;
        const isCompleted = userData.completedLessons.includes(lessonId);
        
        document.getElementById('lesson-modal-title').textContent = lesson.title;
        document.getElementById('lesson-concept').textContent = lesson.concept;
        document.getElementById('lesson-why').textContent = lesson.why;
        document.getElementById('lesson-example').textContent = lesson.example;
        
        const drillsList = document.getElementById('lesson-drills');
        drillsList.innerHTML = lesson.drills.map(drill => `<li>${drill}</li>`).join('');
        
        const mistakesList = document.getElementById('lesson-mistakes');
        mistakesList.innerHTML = lesson.mistakes.map(mistake => `<li>${mistake}</li>`).join('');
        
        completeLessonBtn.textContent = isCompleted ? 'Already Completed' : 'Mark Complete (+5 XP)';
        completeLessonBtn.disabled = isCompleted;
        
        lessonModal.classList.remove('hidden');
    }

    // Close lesson modal
    function closeLesson() {
        lessonModal.classList.add('hidden');
        currentLessonId = null;
    }

    // Complete lesson
    function completeLesson() {
        if (!currentLessonId || userData.completedLessons.includes(currentLessonId)) return;
        
        userData.completedLessons.push(currentLessonId);
        userData.xp = (userData.xp || 0) + 5;
        userData.totalXP = (userData.totalXP || 0) + 5;
        userData.lessonsCompleted = userData.completedLessons.length;
        
        saveUserData();
        
        completeLessonBtn.textContent = 'Already Completed';
        completeLessonBtn.disabled = true;
        
        renderLessons();
        updateHeader();
        
        // Close after brief delay
        setTimeout(closeLesson, 500);
    }

    // Event listeners
    function attachEventListeners() {
        if (lessonModalClose) {
            lessonModalClose.addEventListener('click', closeLesson);
        }
        
        if (completeLessonBtn) {
            completeLessonBtn.addEventListener('click', completeLesson);
        }
        
        if (lessonModal) {
            lessonModal.addEventListener('click', (e) => {
                if (e.target === lessonModal) closeLesson();
            });
        }
    }

    // Start
    document.addEventListener('DOMContentLoaded', init);
})();
