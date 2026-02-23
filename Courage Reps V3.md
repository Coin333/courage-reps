# **Courage Reps — Version 3**

## **Private Social Courage Accountability Network**

---

# **1️⃣ PRODUCT OVERVIEW**

## **Vision**

Courage Reps V3 transforms the platform from a solo courage training tool into a private, invite-only accountability network for structured social skill development.

The system combines:

* Backend-powered identity

* Profile-based progression

* Private friend competition

* Accountability verification

* Structured courses

* AI-assisted reflection

* Invite-only culture

It is NOT social media.

It is a structured transformation platform.

---

# **2️⃣ PRODUCT GOALS**

### **Primary Goals**

* Increase 30-day retention

* Increase average streak length

* Increase challenge completion rate

* Introduce structured skill progression

### **Secondary Goals**

* Create healthy private accountability loops

* Preserve serious, non-playful tone

* Maintain simplicity while expanding depth

---

# **3️⃣ TECH STACK**

Frontend:

* Next.js (recommended if not already)

* Deployed on Vercel

Backend:

* Supabase

  * Auth

  * Postgres

  * Row-Level Security

  * Storage

No additional microservices for V3.

---

# **4️⃣ CORE SYSTEMS**

---

# **SYSTEM 1: AUTH & IDENTITY**

## **4.1 Authentication**

Provider:  
 Supabase Auth

Supported:

* Email \+ password

* Invite code required at signup

Flow:

1. User enters invite code

2. Code validated server-side

3. User registers

4. Profile created in Users table

5. Onboarding begins

---

## **4.2 Users Table**

Users

* id (UUID, PK)

* username (unique)

* email (private)

* avatar\_seed (string)

* level (int)

* xp (int)

* streak (int)

* streak\_freeze\_count (int)

* total\_reps (int)

* courage\_title (string)

* is\_private (bool)

* onboarding\_completed (bool)

* invite\_code\_used (string)

* created\_at (timestamp)

---

## **4.3 Privacy Controls**

User settings:

* hide\_level

* hide\_streak

* hide\_total\_reps

* hide\_badges

Stored in:  
 UserPrivacy table or JSON column.

---

# **SYSTEM 2: SOCIAL GRAPH**

## **5.1 Friendships Table**

Friendships

* id

* requester\_id

* receiver\_id

* status (pending / accepted)

* created\_at

Friend relationship is mutual once accepted.

---

## **5.2 Friend Features**

Users can:

* Search by username

* Send request

* Accept/decline

* Remove friend

---

## **5.3 Friend Data Visibility**

Friends can see:

* Username

* Courage title

Optional (if not hidden):

* Level

* Streak

* Total reps

* Badge count

---

## **5.4 Weekly Comparison Engine**

Server generates:

For each user:

* Highest streak among friends

* Highest XP gained this week

* Most reps this week

No global leaderboard.

---

# **SYSTEM 3: CHALLENGE ENGINE (BACKEND AUTHORITATIVE)**

---

## **6.1 Challenges Table**

Challenges

* id

* difficulty (1–5)

* category

* description

* xp\_value

* verification\_type

* min\_level

* max\_level

---

## **6.2 UserChallenges Table**

UserChallenges

* id

* user\_id

* challenge\_id

* assigned\_date

* completed (bool)

* completed\_at

* verification\_status

* refresh\_count

* reflection\_required (bool)

---

## **6.3 Assignment Logic**

Daily:

If no active challenge:

* Select challenge where:  
   level between min\_level and max\_level

* Randomize

* Insert record

Challenge persists 24 hours.

---

## **6.4 Refresh Logic**

* Max 2 refreshes per day

* XP reduced 20% per refresh

* Server-controlled

---

# **SYSTEM 4: ACCOUNTABILITY ENGINE**

---

## **7.1 Verification Types**

1. Self

2. Reflection-required

3. Friend-verified (optional)

---

## **7.2 Reflection Probability System**

For Hard difficulty:

reflection\_required \= random(40% probability)

Stored on assignment.

---

## **7.3 Reflections Table**

Reflections

* id

* user\_id

* user\_challenge\_id

* text

* ai\_feedback

* created\_at

---

## **7.4 ProofUploads Table**

ProofUploads

* id

* user\_id

* user\_challenge\_id

* file\_url

* created\_at

Storage:  
 Supabase bucket (private)

---

## **7.5 Friend Verification Flow**

If verification\_type \= friend:

1. User submits completion

2. Notification created

3. Friend approves/rejects

4. XP granted after approval

---

# **SYSTEM 5: LEVELING & REWARDS**

---

## **8.1 XP System**

Server authoritative.

XP Sources:

* Challenge completion

* No refresh bonus

* Hard difficulty bonus

* Course completion

* Streak milestone

---

## **8.2 Level Progression Curve**

Exponential curve:

Level 1 → 2 \= 100 XP  
 Level 2 → 3 \= 200 XP  
 Level 3 → 4 \= 400 XP  
 Level 4 → 5 \= 800 XP  
 Continue doubling.

---

## **8.3 Titles**

Level 1: Initiate  
 Level 3: Challenger  
 Level 5: Leader  
 Level 7: Commander  
 Level 10: Architect

Stored in Users.courage\_title.

---

## **8.4 Badges**

Badges Table:

* id

* name

* description

* unlock\_condition

UserBadges:

* user\_id

* badge\_id

* unlocked\_at

---

# **SYSTEM 6: STREAK ENGINE**

---

## **9.1 Streak Logic**

If completed within 24h:

* streak++

Else:

* if streak\_freeze\_count \> 0:  
   auto-consume

* else:  
   streak \= 0

---

## **9.2 Streak Freeze**

Earn:

* 1 freeze per 30 active days

Future:  
 Purchasable (V4 monetization)

---

# **SYSTEM 7: COURSE SYSTEM**

---

## **10.1 Courses Table**

Courses

* id

* title

* description

* min\_level

* required\_for\_level\_unlock (bool)

* estimated\_duration

---

## **10.2 Lessons Table**

Lessons

* id

* course\_id

* title

* content\_markdown

* exercise\_prompt

* completion\_xp

* order\_index

---

## **10.3 UserCourseProgress**

UserCourseProgress

* user\_id

* course\_id

* progress\_percentage

* completed

---

## **10.4 Gating Logic**

Example:

Level 3 requires:

* Completion of “Foundations of Social Awareness”

Server checks before leveling up.

---

# **SYSTEM 8: AI REFLECTION**

---

## **11.1 LLM Integration**

Triggered only if:

* reflection\_required \= true  
   OR

* user manually requests feedback

System Prompt Constraints:

* Tactical

* Analytical

* 3 strengths

* 3 improvements

* 1 next rep focus

* No therapy language

---

## **11.2 Safety Guardrails**

* No mental health advice

* No emotional dependency framing

* No validation loops

---

# **SYSTEM 9: NOTIFICATIONS**

Notifications

* id

* user\_id

* type

* reference\_id

* read

* created\_at

Types:

* Friend request

* Verification request

* Level up

* Badge unlock

* Weekly summary

---

# **SYSTEM 10: ONBOARDING FLOW**

Steps:

1. Welcome

2. Philosophy

3. System overview

4. Pretest

5. Privacy settings

6. First challenge

Skip optional.  
 onboarding\_completed stored.

---

# **12️⃣ API CONTRACT (High Level)**

Endpoints:

POST /signup  
 POST /login  
 GET /profile  
 POST /friend-request  
 POST /accept-friend  
 GET /daily-challenge  
 POST /complete-challenge  
 POST /refresh-challenge  
 POST /submit-reflection  
 POST /verify-challenge  
 GET /courses  
 POST /complete-lesson

All server validated.

---

# **13️⃣ SECURITY**

Row-Level Security:

Users can:

* Read/write own data

* Read limited friend fields

* Not access other reflections or uploads

Uploads private bucket only.

Invite code validated server-side.

---

# **14️⃣ IMPLEMENTATION ORDER**

Sprint 1:

* Supabase setup

* Auth

* Users table

* Invite system

Sprint 2:

* Backend challenge engine

* XP system

* Streak logic

Sprint 3:

* Friends system

* Privacy controls

Sprint 4:

* Courses system

* Level gating

Sprint 5:

* AI reflection

* Proof uploads

Sprint 6:

* Notifications

* Weekly summaries

---

# **15️⃣ RISKS**

* Scope creep

* Turning into social media

* Over-LLM dependence

* Overcomplicated UI

* Backend misconfiguration

Guardrail:  
 Keep it structured.  
 Keep it serious.  
 Keep it minimal.

---

# **FINAL PRODUCT DEFINITION**

Courage Reps V3 is:

A private, backend-powered, accountability-driven courage training network  
 for serious self-improvers.

It is:

* Identity-based

* Invite-only

* Structured

* Progressive

* Transformational

