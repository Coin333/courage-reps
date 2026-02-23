## **PROJECT NAME (Working Title)**

“Courage Reps”

---

## **PROJECT PURPOSE**

Build a serious, training-oriented web app that helps introverted teens increase confidence and social intelligence through structured daily challenges.

---

## **TARGET USER**

* Age 14–22

* Introverted or socially hesitant

* Wants measurable progress

* Comfortable with structured discipline

* Prefers anonymous use

---

## **CORE MECHANIC**

1. User completes short pretest

2. System assigns starting level

3. User receives 1 daily social challenge

4. Must complete within 24 hours

5. Marks complete

6. Streak \+ XP increases

7. Difficulty scales every 7 completed challenges

---

## **DESIGN PRINCIPLES**

* Minimalist UI

* Neutral \+ slightly masculine color palette

* No flashy gradients

* Clean typography

* Feels like training dashboard, not arcade game

* Clear hierarchy

* Focus on action

---

## **FEATURES – PHASE 1 ONLY**

### **1\. Pretest Page**

5 multiple choice questions  
 Outputs Level 1–5

### **2\. Dashboard Page**

Displays:

* Current level

* Current streak

* XP progress bar

* Today’s challenge

* “Complete Challenge” button

* Countdown timer (24h)

### **3\. Challenge Engine**

Challenges stored in arrays:

* Level 1

* Level 2

* Level 3

* Level 4

* Level 5

Randomized within level.

### **4\. Progression System**

* \+10 XP per completion

* Level up every 70 XP

* Difficulty increases automatically

### **5\. Local Storage**

Save:

* Level

* XP

* Streak

* Last completion date

---

# **🛠 EXACT FIRST BUILD PROMPT**

Paste this into AI:

Build a minimal multi-page web app using HTML, CSS, and JavaScript (no frameworks).  
 The app is called "Courage Reps."  
 It should include:

1. A pretest page with 5 multiple choice questions that calculate a starting level from 1–5.

2. A dashboard page that shows:

   * Current level

   * XP progress bar

   * Current streak

   * One daily challenge based on level

   * 24-hour countdown timer

   * Button to mark challenge complete

3. Challenges should be stored in arrays categorized by level.

4. Completing a challenge gives 10 XP.

5. Level up every 70 XP.

6. All data saved using localStorage.

7. Clean, minimalist design with neutral colors.

8. Responsive layout.

Provide all code separated into HTML, CSS, and JS files.