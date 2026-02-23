-- COURAGE REPS V3 - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- INVITE CODES TABLE
-- ============================================
CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES auth.users(id),
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some initial invite codes
INSERT INTO invite_codes (code) VALUES 
    ('COURAGE2026'),
    ('BUILDBRAVE'),
    ('SOCIALREPS'),
    ('FACEFEAR'),
    ('GROWBOLD');

-- ============================================
-- USERS TABLE (Profile data)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_seed VARCHAR(20),
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    streak_freeze_count INTEGER DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    courage_title VARCHAR(50) DEFAULT 'Initiate',
    is_private BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    invite_code_used VARCHAR(20),
    last_completion_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PRIVACY SETTINGS
-- ============================================
CREATE TABLE user_privacy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    hide_level BOOLEAN DEFAULT FALSE,
    hide_streak BOOLEAN DEFAULT FALSE,
    hide_total_reps BOOLEAN DEFAULT FALSE,
    hide_badges BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FRIENDSHIPS TABLE
-- ============================================
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(requester_id, receiver_id)
);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5) NOT NULL,
    category VARCHAR(50),
    description TEXT NOT NULL,
    xp_value INTEGER DEFAULT 20,
    verification_type VARCHAR(20) DEFAULT 'self' CHECK (verification_type IN ('self', 'reflection', 'friend')),
    min_level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert challenges
INSERT INTO challenges (difficulty, category, description, xp_value, min_level, max_level) VALUES
-- Level 1: Social Awareness
(1, 'awareness', 'Make eye contact with a stranger for 2 seconds and give a small nod.', 15, 1, 3),
(1, 'awareness', 'Say hello or good morning to one person you don''t know well.', 15, 1, 3),
(1, 'awareness', 'Ask a cashier or barista how their day is going after they serve you.', 15, 1, 3),
(1, 'awareness', 'Smile at 3 strangers today.', 15, 1, 3),
(1, 'awareness', 'Hold a door open for someone and make brief eye contact.', 15, 1, 3),
(1, 'awareness', 'Say thank you with direct eye contact to someone who helps you.', 15, 1, 3),
(1, 'awareness', 'Wave to a neighbor or someone you recognize but rarely talk to.', 15, 1, 3),
(1, 'awareness', 'Stand tall with good posture for your next social interaction.', 15, 1, 3),

-- Level 2: Initiation
(2, 'initiation', 'Give a genuine compliment to someone on their outfit or style.', 20, 2, 4),
(2, 'initiation', 'Ask someone for a recommendation (restaurant, music, show).', 20, 2, 4),
(2, 'initiation', 'Start a conversation with someone in line while waiting.', 20, 2, 4),
(2, 'initiation', 'Ask a coworker or classmate what they did over the weekend.', 20, 2, 4),
(2, 'initiation', 'Introduce yourself to someone new by name.', 20, 2, 4),
(2, 'initiation', 'Ask someone what they are working on and listen attentively.', 20, 2, 4),
(2, 'initiation', 'Share one personal opinion during a group conversation.', 20, 2, 4),

-- Level 3: Conversational Depth
(3, 'conversation', 'Share an unpopular opinion respectfully in a conversation.', 25, 3, 5),
(3, 'conversation', 'Ask someone to hang out or grab coffee.', 25, 3, 5),
(3, 'conversation', 'Tell a brief personal story in a group setting.', 25, 3, 5),
(3, 'conversation', 'Offer to help someone who looks like they are struggling.', 25, 3, 5),
(3, 'conversation', 'Give someone specific, thoughtful feedback on their work.', 25, 3, 5),
(3, 'conversation', 'Join a conversation already in progress.', 25, 3, 5),

-- Level 4: Leadership Presence
(4, 'leadership', 'Volunteer to lead a discussion or meeting segment.', 30, 4, 7),
(4, 'leadership', 'Give constructive feedback to someone more senior than you.', 30, 4, 7),
(4, 'leadership', 'Speak up first in a group discussion.', 30, 4, 7),
(4, 'leadership', 'Introduce two people who should know each other.', 30, 4, 7),
(4, 'leadership', 'Ask a hard question in a public setting.', 30, 4, 7),

-- Level 5: Social Dominance
(5, 'dominance', 'Start a conversation with someone who intimidates you.', 40, 5, 10),
(5, 'dominance', 'Negotiate something (price, terms, conditions).', 40, 5, 10),
(5, 'dominance', 'Share a controversial opinion with a group and defend it.', 40, 5, 10),
(5, 'dominance', 'Ask someone you admire to be your mentor.', 40, 5, 10),
(5, 'dominance', 'Give a toast or impromptu speech.', 40, 5, 10);

-- ============================================
-- USER CHALLENGES TABLE
-- ============================================
CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    verification_status VARCHAR(20) DEFAULT 'pending',
    refresh_count INTEGER DEFAULT 0,
    reflection_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFLECTIONS TABLE
-- ============================================
CREATE TABLE reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    user_challenge_id UUID REFERENCES user_challenges(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    ai_feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    unlock_condition VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert badges
INSERT INTO badges (name, description, icon, unlock_condition) VALUES
('First Rep', 'Complete your first challenge', 'target', 'total_reps >= 1'),
('Week Warrior', 'Maintain a 7-day streak', 'flame', 'streak >= 7'),
('Thirty Strong', 'Complete 30 challenges', 'trophy', 'total_reps >= 30'),
('Century Club', 'Complete 100 challenges', 'hundred', 'total_reps >= 100'),
('Month Master', 'Maintain a 30-day streak', 'crown', 'streak >= 30'),
('Challenger', 'Reach level 3', 'bolt', 'level >= 3'),
('Leader', 'Reach level 5', 'star', 'level >= 5'),
('Commander', 'Reach level 7', 'shield', 'level >= 7'),
('Architect', 'Reach level 10', 'diamond', 'level >= 10'),
('Scholar', 'Complete all courses', 'book', 'courses_completed >= 5');

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    min_level INTEGER DEFAULT 1,
    required_for_level_unlock BOOLEAN DEFAULT FALSE,
    estimated_duration VARCHAR(20),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert courses
INSERT INTO courses (title, description, min_level, estimated_duration, order_index) VALUES
('Eye Contact Fundamentals', 'Master the foundation of social connection through proper eye contact.', 1, '15 min', 1),
('Voice Projection & Tone', 'Learn to speak with confidence and command attention.', 1, '20 min', 2),
('Body Language Basics', 'Your body speaks before your mouth does.', 1, '20 min', 3),
('Asking Quality Questions', 'The skill of directing conversations through curiosity.', 2, '25 min', 4),
('Active Listening', 'Listening is not waiting for your turn to speak.', 2, '20 min', 5),
('Initiating Conversations', 'Break the approach barrier with proven techniques.', 3, '30 min', 6),
('Vulnerability & Authenticity', 'Strength through selective openness.', 3, '25 min', 7),
('Handling Rejection', 'Reframe rejection as data, not defeat.', 4, '30 min', 8),
('Social Leadership', 'Take charge of social situations confidently.', 5, '35 min', 9),
('Influence & Persuasion', 'Ethical influence through rapport and logic.', 6, '40 min', 10);

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    content_markdown TEXT,
    exercise_prompt TEXT,
    completion_xp INTEGER DEFAULT 5,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER COURSE PROGRESS
-- ============================================
CREATE TABLE user_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- ============================================
-- USER LESSON PROGRESS
-- ============================================
CREATE TABLE user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    message TEXT,
    reference_id UUID,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROOF UPLOADS TABLE
-- ============================================
CREATE TABLE proof_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    user_challenge_id UUID REFERENCES user_challenges(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view friends profiles" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM friendships 
            WHERE status = 'accepted' 
            AND ((requester_id = auth.uid() AND receiver_id = users.id)
            OR (receiver_id = auth.uid() AND requester_id = users.id))
        )
    );

CREATE POLICY "System can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Friendships policies
CREATE POLICY "Users can view their friendships" ON friendships
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friend requests" ON friendships
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of" ON friendships
    FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete their friendships" ON friendships
    FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Challenges policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view challenges" ON challenges
    FOR SELECT USING (auth.role() = 'authenticated');

-- User challenges policies
CREATE POLICY "Users can view their own challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- Reflections policies
CREATE POLICY "Users can view their own reflections" ON reflections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" ON reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies (read-only for all)
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user badges" ON user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses policies (read-only)
CREATE POLICY "Authenticated users can view courses" ON courses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Lessons policies (read-only)
CREATE POLICY "Authenticated users can view lessons" ON lessons
    FOR SELECT USING (auth.role() = 'authenticated');

-- User course progress policies
CREATE POLICY "Users can view their course progress" ON user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their course progress" ON user_course_progress
    FOR ALL USING (auth.uid() = user_id);

-- User lesson progress policies
CREATE POLICY "Users can manage their lesson progress" ON user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Invite codes policies
CREATE POLICY "Anyone can check invite codes" ON invite_codes
    FOR SELECT USING (true);

CREATE POLICY "System can update invite codes" ON invite_codes
    FOR UPDATE USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_receiver ON friendships(receiver_id);
CREATE INDEX idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_date ON user_challenges(assigned_date);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_reflections_user ON reflections(user_id);
