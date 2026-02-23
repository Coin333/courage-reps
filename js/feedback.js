/**
 * COURAGE REPS V2 - Feedback System
 * Provides post-interaction analysis and coaching via LLM
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'courageRepsApiKey';

    // System prompt for social courage coaching
    const SYSTEM_PROMPT = `You are a supportive social skills coach helping someone build confidence through daily social challenges. 

Analyze their reported social interaction and provide constructive feedback. Be encouraging but specific and actionable.

IMPORTANT: Respond ONLY with valid JSON in this exact format, no other text:
{
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "nextFocus": "One specific thing to focus on in the next interaction"
}

Guidelines:
- Identify 1-3 specific things they did well based on what they described
- Suggest 1-3 concrete, actionable improvements
- Give one focused tip for their next social challenge
- Keep each point concise (one sentence)
- Be warm and encouraging, not critical
- Focus on social courage aspects: approaching others, speaking up, vulnerability, presence`;

    // Get stored API key
    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY) || '';
    }

    // Set API key
    function setApiKey(key) {
        if (key) {
            localStorage.setItem(STORAGE_KEY, key.trim());
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    // Check if API key is configured
    function hasApiKey() {
        return !!getApiKey();
    }

    // Analyze interaction via OpenAI API
    async function analyzeInteraction(userReflection, challengeContext) {
        const apiKey = getApiKey();
        
        if (!apiKey) {
            return {
                strengths: ["Add your OpenAI API key in settings to get AI-powered feedback"],
                improvements: ["Go to Settings → API Key to enable analysis"],
                nextFocus: "Configure your API key to receive personalized coaching"
            };
        }

        const userPrompt = challengeContext 
            ? `Challenge completed: "${challengeContext}"\n\nUser's reflection on what happened:\n${userReflection}`
            : `User's reflection on their social interaction:\n${userReflection}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('OpenAI API error:', response.status, errorData);
                
                if (response.status === 401) {
                    return {
                        strengths: ["API key is invalid or expired"],
                        improvements: ["Please update your OpenAI API key in settings"],
                        nextFocus: "Go to Settings → API Key to fix this"
                    };
                }
                
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('Empty response from API');
            }

            // Parse JSON response
            const analysis = JSON.parse(content);
            
            // Validate structure
            return {
                strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ["You took action on today's challenge"],
                improvements: Array.isArray(analysis.improvements) ? analysis.improvements : ["Keep practicing daily"],
                nextFocus: typeof analysis.nextFocus === 'string' ? analysis.nextFocus : "Focus on being present in your next interaction"
            };

        } catch (error) {
            console.error('Feedback analysis error:', error);
            
            // Return fallback response on error
            return {
                strengths: ["You completed the challenge and reflected on it"],
                improvements: ["Analysis unavailable - check console for details"],
                nextFocus: "Continue practicing daily social challenges"
            };
        }
    }

    // Save reflection to user data
    function saveReflection(reflection, analysis) {
        const userData = JSON.parse(localStorage.getItem('courageRepsData') || '{}');
        
        if (!userData.reflections) {
            userData.reflections = [];
        }

        userData.reflections.push({
            date: new Date().toISOString(),
            challengeText: userData.currentChallenge,
            reflection: reflection,
            analysis: analysis
        });

        // Keep only last 50 reflections
        if (userData.reflections.length > 50) {
            userData.reflections = userData.reflections.slice(-50);
        }

        localStorage.setItem('courageRepsData', JSON.stringify(userData));
    }

    // Export functions
    window.FeedbackSystem = {
        analyzeInteraction,
        saveReflection,
        getApiKey,
        setApiKey,
        hasApiKey
    };
})();
