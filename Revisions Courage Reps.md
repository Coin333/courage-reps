Your task is to modify the existing implementation of "Courage Reps" without rewriting the architecture unless absolutely necessary.

Follow these rules strictly:

* Do NOT refactor unrelated parts of the app.

* Do NOT introduce new frameworks.

* Do NOT change the overall design philosophy.

* Make minimal, surgical changes.

* Preserve existing structure.

* Explain what you are changing and why before showing code.

The app is a serious, minimalist social courage training dashboard.

Tone:

* Clean

* Neutral-dark

* Slightly masculine

* Structured

* Not playful

---

# **TASKS**

## **1️⃣ Redesign Header (Navigation)**

Current problem:  
 The header is just basic text links.

Upgrade requirements:

* Convert header into a professional dashboard-style top bar

* Left: "Courage Reps" (brand)

* Right: Nav items (Dashboard, Lessons, Badges, Profile)

* Add:

  * Active state indicator

  * Subtle hover effect

  * Proper spacing and alignment

  * Sticky positioning

* Keep minimalist aesthetic

* No gradients

* No flashy animations

* Use existing styling system (vanilla CSS or Tailwind if already present)

* Ensure mobile responsiveness

Do NOT redesign the entire layout.  
 Only improve the header component.

---

## **2️⃣ Revamp Badge Interface**

Current:  
 Badges are text \+ emojis.

New requirements:

* Convert badge display into a structured grid

* Each badge should be a card component

* Include:

  * Minimal geometric icon (SVG preferred, not emoji)

  * Badge name

  * Short description

  * Locked vs unlocked state

* Locked badges:

  * Desaturated

  * Reduced opacity

* Unlocked badges:

  * Subtle border accent or elevation

* No cartoon style

* Clean hierarchy

* Consistent spacing

* Use reusable badge component pattern if appropriate

Do NOT rebuild unrelated pages.  
 Only modify badge-related components.

---

## **3️⃣ Fix Challenge Loading Bug**

Current issue:  
 Challenges are not appearing on the dashboard.

You must:

1. Trace challenge generation logic.

2. Inspect:

   * Level retrieval

   * Challenge array

   * Date comparison logic

   * localStorage keys

3. Identify root cause before rewriting logic.

Likely failure points to check:

* Level undefined or NaN

* Empty challenge arrays

* Date mismatch logic causing reset loop

* Incorrect key names

* Async logic not awaited

Requirements after fix:

* Correctly load one daily challenge based on user level.

* Persist challenge for 24 hours.

* Allow refresh logic to work properly.

* Add safe fallback if challenge fails to load.

* Add console.debug logs for clarity.

* Do NOT remove persistence logic unless broken.

Separate clearly:

* Challenge selection

* Persistence logic

* UI rendering

---

# **OUTPUT FORMAT**

1. Explain root cause of challenge bug.

2. List files modified.

3. Show only modified sections of code (not entire files).

4. Clearly label each change.

5. Confirm no unrelated parts were altered.

Keep changes production-ready.

