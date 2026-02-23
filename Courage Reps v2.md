## **Project: Courage Reps**

## **Version: V2 – Structured Growth System**

---

# **1\. 🎯 PRODUCT VISION**

Courage Reps is a structured social courage training platform that transforms introverted teens into confident communicators through daily real-world challenges, progressive leveling, rewards, and guided reflection.

V2 Objective:  
 Increase engagement, accountability, and skill development depth while preserving seriousness and focus.

---

# **2\. 👤 TARGET USER**

Primary:

* Age 14–22

* Introverted or socially hesitant

* Motivated by self-improvement

* Wants measurable progress

* Comfortable with structured discipline

Secondary:

* High-achieving but socially underdeveloped students

* Athletes / disciplined individuals looking to expand social range

---

# **3\. 🧱 CORE PILLARS (V2)**

1. Daily Courage Challenges (refreshable)

2. Progressive Leveling System

3. Reward & XP Engine

4. Social Lessons Module

5. LLM-Based Post-Interaction Feedback

6. Streak & Retention Mechanics

---

# **4\. 🏗 FEATURE REQUIREMENTS**

---

## **4.1 🔁 Refreshable Tasks System**

### **Goal:**

Prevent user stagnation and frustration.

### **Requirements:**

* User receives 1 primary daily challenge.

* User may refresh challenge up to 2 times per day.

* Refresh reduces XP reward by 20%.

* Refreshed challenge must remain same difficulty tier.

### **Functional:**

* “Refresh Challenge” button

* Refresh counter visible

* XP penalty displayed clearly

### **Edge Cases:**

* Cannot refresh after marking complete

* Cannot exceed daily refresh limit

---

## **4.2 🏆 Reward System**

### **Goals:**

* Reinforce discipline

* Increase dopamine without gamifying excessively

### **Reward Types:**

* XP (primary currency)

* Level progression

* Achievement badges

* Title unlocks

### **Reward Structure:**

| Action | XP |
| ----- | ----- |
| Complete challenge | 20 XP |
| No refresh used | \+10 XP bonus |
| 7-day streak | \+50 XP |
| Hard difficulty completion | \+10 XP |

### **Badges:**

* 7 Day Streak

* First Hard Challenge

* 30 Reps Completed

* Level 5 Achieved

* 100 Total Interactions

Badges are visual only (no gameplay advantage).

---

## **4.3 📈 Expanded Leveling System**

### **Philosophy:**

Levels should represent courage tier, not just repetition count.

### **Level Structure:**

Level 1 – Social Awareness  
 Level 2 – Initiation  
 Level 3 – Conversational Depth  
 Level 4 – Leadership Presence  
 Level 5 – Social Dominance  
 Level 6+ – Adaptive Influence

### **XP Curve:**

* Level 1 → 2: 100 XP

* Level 2 → 3: 200 XP

* Level 3 → 4: 400 XP

* Level 4 → 5: 800 XP

* Exponential scaling beyond

### **Additional Mechanics:**

* Difficulty auto-scales with level

* Hard mode unlocks at Level 3

* “Elite Challenges” unlock at Level 5

---

## **4.4 📚 Social Lessons Module**

### **Goal:**

Add educational depth.

### **Structure:**

Separate tab: “Lessons”

Each lesson includes:

* Concept (e.g., Eye Contact Fundamentals)

* Why it matters

* Example scenario

* Actionable drills

* Common mistakes

MVP V2:

* Static lesson cards

* Placeholder content

* Completion checkbox

* \+5 XP for completion

Content can be added later without structural change.

---

## **4.5 🤖 Post-Interaction LLM Feedback**

### **Goal:**

Convert experience into skill.

### **Flow:**

1. User completes challenge

2. Prompt appears:

   * “Describe what happened.”

3. User types summary

4. LLM analyzes:

   * Confidence markers

   * Social cues used

   * Missed opportunities

   * Suggests improvement

### **Requirements:**

* Chat interface component

* Prompt template system

* Controlled token length

* No emotional therapy responses

* Focus on tactical social improvement

### **Example Prompt Template:**

“You are a social skills coach. Analyze this interaction for confidence, clarity, and leadership signals. Provide 3 strengths and 3 improvements.”

### **Safety Constraints:**

* No medical advice

* No therapy framing

* Strict skill coaching tone

---

## **4.6 🔥 Streak System Upgrade**

### **Rules:**

* 24-hour window

* Miss \= streak reset

* Grace token (1 per 30 days)

### **Retention Additions:**

* “Streak Shield” reward at 14 days

* Weekly performance summary

---

# **5\. 🗃 DATA & BACKEND REQUIREMENTS**

V2 Requires Backend.

Recommended:  
 Firebase or Supabase

Data Schema (High-Level):

User:

* user\_id (anonymous)

* level

* xp

* streak

* last\_completed\_date

* refresh\_count\_today

* badges\[\]

Challenge:

* challenge\_id

* difficulty

* category

* xp\_value

Interaction Log:

* user\_id

* challenge\_id

* completion\_date

* reflection\_text

* llm\_feedback\_summary

---

# **6\. 🎨 DESIGN REQUIREMENTS**

Tone:

* Clean

* Dark neutral palette

* Masculine but inclusive

* Sharp typography

* No childish icons

Dashboard must show:

* Level badge

* XP bar

* Streak

* Today’s challenge

* Refresh count

* Reward preview

Lessons page:

* Card layout

* Clean hierarchy

* Minimal distraction

LLM Chat:

* Structured response blocks

* “Strengths” section

* “Improvements” section

* “Next Rep Focus” section

---

# **7\. 📊 SUCCESS METRICS (V2)**

Primary:

* 7-day retention rate

* Average streak length

* Challenge completion rate

Secondary:

* Lesson completion rate

* LLM reflection usage

* Hard challenge adoption rate

---

# **8\. 🚀 V2 BUILD PRIORITY ORDER**

1. Backend integration

2. Expanded leveling system

3. Reward \+ badge engine

4. Refreshable task logic

5. Lessons tab

6. LLM reflection system

Do not build all simultaneously.

---

# **9\. 🚨 SCOPE GUARDRAILS**

DO NOT ADD:

* Public leaderboards

* Social feeds

* Messaging

* Content walls

* Monetization yet

* Heavy animations

This is a training system.  
 Not social media.

