/**
 * COURAGE REPS V3 - Supabase Client
 * Backend-powered authentication and data management
 */

// Supabase configuration - Replace with your project credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = SUPABASE_URL !== 'https://your-project.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key';

// Initialize Supabase client only if configured
let supabase = null;
if (isSupabaseConfigured && window.supabase) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.warn('Supabase initialization failed:', e);
    }
} else {
    console.log('Supabase not configured - using local storage mode');
}

// Helper to check if Supabase is available
function isSupabaseAvailable() {
    return supabase !== null && isSupabaseConfigured;
}

// Auth helper functions
const SupabaseAuth = {
    // Check if backend is available
    isConfigured() {
        return isSupabaseAvailable();
    },

    // Get current session
    async getSession() {
        if (!isSupabaseAvailable()) return null;
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Session error:', error);
        return session;
    },

    // Get current user
    async getUser() {
        if (!isSupabaseAvailable()) return null;
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) console.error('User error:', error);
        return user;
    },

    // Sign up with invite code
    async signUp(email, password, username, inviteCode) {
        if (!isSupabaseAvailable()) {
            return { error: { message: 'Backend not configured. Please set up Supabase.' } };
        }
        
        // Validate invite code first
        const { data: invite, error: inviteError } = await supabase
            .from('invite_codes')
            .select('*')
            .eq('code', inviteCode)
            .eq('used', false)
            .single();

        if (inviteError || !invite) {
            return { error: { message: 'Invalid or used invite code' } };
        }

        // Create auth user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) return { error };

        // Mark invite code as used
        await supabase
            .from('invite_codes')
            .update({ used: true, used_by: data.user.id, used_at: new Date().toISOString() })
            .eq('code', inviteCode);

        // Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email: email,
                username: username,
                invite_code_used: inviteCode,
                level: 1,
                xp: 0,
                streak: 0,
                streak_freeze_count: 0,
                total_reps: 0,
                courage_title: 'Initiate',
                is_private: false,
                onboarding_completed: false,
                avatar_seed: Math.random().toString(36).substring(7)
            });

        if (profileError) console.error('Profile creation error:', profileError);

        return { data, error: profileError };
    },

    // Sign in
    async signIn(email, password) {
        if (!isSupabaseAvailable()) {
            return { error: { message: 'Backend not configured. Please set up Supabase.' } };
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    // Sign out
    async signOut() {
        if (!isSupabaseAvailable()) {
            window.location.href = 'login.html';
            return { error: null };
        }
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = 'login.html';
        }
        return { error };
    },

    // Check if user is authenticated
    async isAuthenticated() {
        if (!isSupabaseAvailable()) return false;
        const session = await this.getSession();
        return !!session;
    },

    // Require auth - redirect if not authenticated
    async requireAuth() {
        if (!isSupabaseAvailable()) {
            // In local mode, don't require auth
            return true;
        }
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// User profile functions
const UserProfile = {
    // Get current user's profile
    async getProfile() {
        if (!isSupabaseAvailable()) return null;
        const user = await SupabaseAuth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) console.error('Profile fetch error:', error);
        return data;
    },

    // Update profile
    async updateProfile(updates) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        return { data, error };
    },

    // Get profile by username
    async getProfileByUsername(username) {
        if (!isSupabaseAvailable()) return { data: null, error: { message: 'Backend not configured' } };
        const { data, error } = await supabase
            .from('users')
            .select('id, username, avatar_seed, level, xp, streak, total_reps, courage_title, is_private')
            .eq('username', username)
            .single();

        return { data, error };
    }
};

// Challenge functions
const Challenges = {
    // Get today's challenge
    async getDailyChallenge() {
        if (!isSupabaseAvailable()) return null;
        const user = await SupabaseAuth.getUser();
        if (!user) return null;

        const today = new Date().toISOString().split('T')[0];

        // Check for existing challenge today
        let { data: existing, error } = await supabase
            .from('user_challenges')
            .select('*, challenge:challenges(*)')
            .eq('user_id', user.id)
            .eq('assigned_date', today)
            .single();

        if (existing) return existing;

        // Get user's level for challenge selection
        const profile = await UserProfile.getProfile();
        if (!profile) return null;

        // Get random challenge for user's level
        const { data: challenges } = await supabase
            .from('challenges')
            .select('*')
            .lte('min_level', profile.level)
            .gte('max_level', profile.level);

        if (!challenges || challenges.length === 0) {
            // Fallback: get any challenge
            const { data: fallback } = await supabase
                .from('challenges')
                .select('*')
                .limit(10);
            if (fallback && fallback.length > 0) {
                const challenge = fallback[Math.floor(Math.random() * fallback.length)];
                return await this.assignChallenge(user.id, challenge.id, today);
            }
            return null;
        }

        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        return await this.assignChallenge(user.id, challenge.id, today);
    },

    // Assign a challenge to user
    async assignChallenge(userId, challengeId, date) {
        if (!isSupabaseAvailable()) return null;
        // Determine if reflection is required (40% chance for hard challenges)
        const { data: challenge } = await supabase
            .from('challenges')
            .select('difficulty')
            .eq('id', challengeId)
            .single();

        const reflectionRequired = challenge?.difficulty >= 4 && Math.random() < 0.4;

        const { data, error } = await supabase
            .from('user_challenges')
            .insert({
                user_id: userId,
                challenge_id: challengeId,
                assigned_date: date,
                completed: false,
                refresh_count: 0,
                reflection_required: reflectionRequired
            })
            .select('*, challenge:challenges(*)')
            .single();

        if (error) console.error('Challenge assignment error:', error);
        return data;
    },

    // Complete challenge
    async completeChallenge(userChallengeId) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        // Get the challenge details
        const { data: uc } = await supabase
            .from('user_challenges')
            .select('*, challenge:challenges(*)')
            .eq('id', userChallengeId)
            .single();

        if (!uc) return { error: { message: 'Challenge not found' } };

        // Calculate XP
        let xpEarned = uc.challenge.xp_value || 20;
        if (uc.refresh_count > 0) {
            xpEarned = Math.floor(xpEarned * (1 - 0.2 * uc.refresh_count));
        }

        // Update challenge as completed
        const { error: updateError } = await supabase
            .from('user_challenges')
            .update({
                completed: true,
                completed_at: new Date().toISOString()
            })
            .eq('id', userChallengeId);

        if (updateError) return { error: updateError };

        // Update user stats
        const profile = await UserProfile.getProfile();
        const newXP = (profile.xp || 0) + xpEarned;
        const newTotalReps = (profile.total_reps || 0) + 1;
        const newStreak = (profile.streak || 0) + 1;

        // Check for level up
        let newLevel = profile.level;
        let remainingXP = newXP;
        while (remainingXP >= this.getXPForLevel(newLevel) && newLevel < 20) {
            remainingXP -= this.getXPForLevel(newLevel);
            newLevel++;
        }

        const newTitle = this.getTitleForLevel(newLevel);

        await UserProfile.updateProfile({
            xp: remainingXP,
            level: newLevel,
            total_reps: newTotalReps,
            streak: newStreak,
            courage_title: newTitle,
            last_completion_date: new Date().toISOString()
        });

        return { 
            data: { 
                xpEarned, 
                newLevel, 
                leveledUp: newLevel > profile.level,
                newTitle 
            } 
        };
    },

    // Refresh challenge
    async refreshChallenge(userChallengeId) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        // Get current refresh count
        const { data: uc } = await supabase
            .from('user_challenges')
            .select('refresh_count')
            .eq('id', userChallengeId)
            .single();

        if (!uc) return { error: { message: 'Challenge not found' } };
        if (uc.refresh_count >= 2) return { error: { message: 'Max refreshes reached' } };

        // Get user's level
        const profile = await UserProfile.getProfile();
        
        // Get new random challenge
        const { data: challenges } = await supabase
            .from('challenges')
            .select('*')
            .lte('min_level', profile.level)
            .gte('max_level', profile.level);

        if (!challenges || challenges.length === 0) {
            return { error: { message: 'No challenges available' } };
        }

        const newChallenge = challenges[Math.floor(Math.random() * challenges.length)];

        const { data, error } = await supabase
            .from('user_challenges')
            .update({
                challenge_id: newChallenge.id,
                refresh_count: uc.refresh_count + 1
            })
            .eq('id', userChallengeId)
            .select('*, challenge:challenges(*)')
            .single();

        return { data, error };
    },

    // Get XP required for level
    getXPForLevel(level) {
        return Math.pow(2, level - 1) * 100;
    },

    // Get title for level
    getTitleForLevel(level) {
        if (level >= 10) return 'Architect';
        if (level >= 7) return 'Commander';
        if (level >= 5) return 'Leader';
        if (level >= 3) return 'Challenger';
        return 'Initiate';
    }
};

// Friends system
const Friends = {
    // Get all friends
    async getFriends() {
        if (!isSupabaseAvailable()) return [];
        const user = await SupabaseAuth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('friendships')
            .select(`
                id,
                status,
                requester:users!friendships_requester_id_fkey(id, username, avatar_seed, level, streak, courage_title),
                receiver:users!friendships_receiver_id_fkey(id, username, avatar_seed, level, streak, courage_title)
            `)
            .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .eq('status', 'accepted');

        if (error) {
            console.error('Friends fetch error:', error);
            return [];
        }

        // Format friends list
        return data.map(f => {
            const friend = f.requester.id === user.id ? f.receiver : f.requester;
            return { ...friend, friendshipId: f.id };
        });
    },

    // Get pending requests
    async getPendingRequests() {
        if (!isSupabaseAvailable()) return [];
        const user = await SupabaseAuth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('friendships')
            .select(`
                id,
                requester:users!friendships_requester_id_fkey(id, username, avatar_seed, courage_title)
            `)
            .eq('receiver_id', user.id)
            .eq('status', 'pending');

        if (error) {
            console.error('Pending requests fetch error:', error);
            return [];
        }

        return data;
    },

    // Send friend request
    async sendRequest(receiverUsername) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        // Get receiver's ID
        const { data: receiver, error: lookupError } = await supabase
            .from('users')
            .select('id')
            .eq('username', receiverUsername)
            .single();

        if (lookupError || !receiver) {
            return { error: { message: 'User not found' } };
        }

        if (receiver.id === user.id) {
            return { error: { message: 'Cannot add yourself' } };
        }

        // Check if friendship already exists
        const { data: existing } = await supabase
            .from('friendships')
            .select('id')
            .or(`and(requester_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(requester_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
            .single();

        if (existing) {
            return { error: { message: 'Friend request already exists' } };
        }

        const { data, error } = await supabase
            .from('friendships')
            .insert({
                requester_id: user.id,
                receiver_id: receiver.id,
                status: 'pending'
            })
            .select()
            .single();

        return { data, error };
    },

    // Accept request
    async acceptRequest(friendshipId) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const { data, error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId)
            .select()
            .single();

        return { data, error };
    },

    // Decline/remove friendship
    async removeFriendship(friendshipId) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('id', friendshipId);

        return { error };
    },

    // Get weekly comparison
    async getWeeklyComparison() {
        const friends = await this.getFriends();
        if (friends.length === 0) return null;

        // Find highest streak and level among friends
        let highestStreak = { username: null, streak: 0 };
        let highestLevel = { username: null, level: 0 };

        friends.forEach(f => {
            if (f.streak > highestStreak.streak) {
                highestStreak = { username: f.username, streak: f.streak };
            }
            if (f.level > highestLevel.level) {
                highestLevel = { username: f.username, level: f.level };
            }
        });

        return { highestStreak, highestLevel };
    }
};

// Courses system
const Courses = {
    // Get all courses
    async getCourses() {
        if (!isSupabaseAvailable()) return [];
        const profile = await UserProfile.getProfile();
        
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('min_level', { ascending: true });

        if (error) {
            console.error('Courses fetch error:', error);
            return [];
        }

        // Get user's progress
        const user = await SupabaseAuth.getUser();
        const { data: progress } = await supabase
            .from('user_course_progress')
            .select('*')
            .eq('user_id', user.id);

        // Merge progress with courses
        return data.map(course => {
            const p = progress?.find(p => p.course_id === course.id);
            return {
                ...course,
                progress_percentage: p?.progress_percentage || 0,
                completed: p?.completed || false,
                locked: course.min_level > profile.level
            };
        });
    },

    // Get course lessons
    async getCourseLessons(courseId) {
        if (!isSupabaseAvailable()) return [];
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Lessons fetch error:', error);
            return [];
        }

        // Get user's completed lessons
        const user = await SupabaseAuth.getUser();
        const { data: completed } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id);

        const completedIds = completed?.map(c => c.lesson_id) || [];

        return data.map(lesson => ({
            ...lesson,
            completed: completedIds.includes(lesson.id)
        }));
    },

    // Complete a lesson
    async completeLesson(lessonId) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        // Get lesson details
        const { data: lesson } = await supabase
            .from('lessons')
            .select('*, course:courses(*)')
            .eq('id', lessonId)
            .single();

        if (!lesson) return { error: { message: 'Lesson not found' } };

        // Mark lesson as completed
        await supabase
            .from('user_lesson_progress')
            .upsert({
                user_id: user.id,
                lesson_id: lessonId,
                completed_at: new Date().toISOString()
            });

        // Add XP
        const profile = await UserProfile.getProfile();
        await UserProfile.updateProfile({
            xp: (profile.xp || 0) + (lesson.completion_xp || 5)
        });

        // Update course progress
        const lessons = await this.getCourseLessons(lesson.course_id);
        const completedCount = lessons.filter(l => l.completed).length + 1;
        const progressPercentage = Math.round((completedCount / lessons.length) * 100);
        const courseCompleted = completedCount === lessons.length;

        await supabase
            .from('user_course_progress')
            .upsert({
                user_id: user.id,
                course_id: lesson.course_id,
                progress_percentage: progressPercentage,
                completed: courseCompleted
            });

        return { data: { xpEarned: lesson.completion_xp || 5, courseCompleted } };
    }
};

// Reflections
const Reflections = {
    // Submit reflection
    async submitReflection(userChallengeId, text) {
        if (!isSupabaseAvailable()) return { error: { message: 'Backend not configured' } };
        const user = await SupabaseAuth.getUser();
        if (!user) return { error: { message: 'Not authenticated' } };

        // Get AI feedback
        let aiFeedback = null;
        if (window.FeedbackSystem && window.FeedbackSystem.hasApiKey()) {
            const result = await window.FeedbackSystem.analyzeInteraction(text, '');
            aiFeedback = JSON.stringify(result);
        }

        const { data, error } = await supabase
            .from('reflections')
            .insert({
                user_id: user.id,
                user_challenge_id: userChallengeId,
                text: text,
                ai_feedback: aiFeedback
            })
            .select()
            .single();

        return { data, error, aiFeedback: aiFeedback ? JSON.parse(aiFeedback) : null };
    }
};

// Notifications
const Notifications = {
    // Get notifications
    async getNotifications() {
        if (!isSupabaseAvailable()) return [];
        const user = await SupabaseAuth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Notifications fetch error:', error);
            return [];
        }

        return data;
    },

    // Mark as read
    async markAsRead(notificationId) {
        if (!isSupabaseAvailable()) return;
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);
    },

    // Get unread count
    async getUnreadCount() {
        if (!isSupabaseAvailable()) return 0;
        const user = await SupabaseAuth.getUser();
        if (!user) return 0;

        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);

        return count || 0;
    }
};

// Export to window
window.supabase = supabase;
window.SupabaseAuth = SupabaseAuth;
window.UserProfile = UserProfile;
window.Challenges = Challenges;
window.Friends = Friends;
window.Courses = Courses;
window.Reflections = Reflections;
window.Notifications = Notifications;
