# Courage Reps

A training-oriented web app that helps build social confidence through structured daily challenges.

## Overview

Courage Reps is designed for individuals (primarily ages 14-22) who want to systematically improve their social skills and confidence. The app provides daily challenges calibrated to your current comfort level, tracks your progress, and gradually increases difficulty as you improve.

## Features

### Assessment
- 5-question pretest to determine starting level (1-5)
- Questions evaluate current social comfort and confidence
- Results immediately calibrate your challenge difficulty

### Daily Challenges
- One challenge per day tailored to your level
- 24-hour window to complete each challenge
- Challenges range from simple (eye contact, greetings) to advanced (public speaking, difficult conversations)

### Progression System
- **XP System**: Earn 10 XP per completed challenge
- **Level Up**: Progress to next level every 70 XP
- **Streak Tracking**: Consecutive days of completion are tracked
- **Difficulty Scaling**: Challenges automatically increase in difficulty as you level up

### Data Persistence
- All progress saved locally using localStorage
- No account required
- Privacy-first approach (no data sent to servers)

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, Flexbox, Grid
- **Vanilla JavaScript** - No frameworks, clean modular code
- **localStorage** - Client-side data persistence

## Project Structure

```
courage-reps/
├── index.html          # Pretest/assessment page
├── dashboard.html      # Main training dashboard
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── pretest.js      # Pretest logic
│   ├── challenges.js   # Challenge database
│   └── dashboard.js    # Dashboard logic
├── package.json        # Project metadata
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## Local Development

### Option 1: Using any static server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Option 2: Open directly
Simply open `index.html` in a modern web browser.

## Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Deploy (no configuration needed - vercel.json handles it)

### Netlify

1. Push to GitHub repository
2. Import in Netlify dashboard
3. Set publish directory to root (/)
4. Deploy

### GitHub Pages

1. Push to GitHub repository
2. Go to Settings > Pages
3. Select branch and root folder
4. Save

## Challenge Levels

| Level | Description | Example Challenges |
|-------|-------------|-------------------|
| 1 | Minimal social exposure | Eye contact, saying hello, holding doors |
| 2 | Brief exchanges | Compliments, asking for recommendations |
| 3 | More vulnerability required | Sharing opinions, asking to hang out |
| 4 | Extended interactions | Leading discussions, setting boundaries |
| 5 | Maximum challenge | Public speaking, difficult conversations |

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Privacy

All data is stored locally in your browser's localStorage. No data is collected, transmitted, or stored on any server. Your progress and personal information remain completely private.

## License

MIT License - Feel free to use, modify, and distribute.

---

**Train daily. Build confidence. No shortcuts.**
