import OpenAI from 'openai';
import { CombinedContext } from '../types/context';

/**
 * LLM client for generating personalized fitness and nutrition plans
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Generate a personalized fitness and nutrition plan based on user context
 * @param context - The user's complete health and fitness context
 * @returns Promise with generated plan text
 */
export async function generatePlan(context: CombinedContext): Promise<{ text: string }> {
  // Build a comprehensive prompt from the user's context
  const promptParts = [
    "You are a professional health and fitness coach. Based on the following user data, generate a personalized workout and meal plan for the upcoming week.",
    "",
    "## User's Recent Activity",
    "",
  ];

  // Add recent workouts (last 3)
  if (context.workouts.length > 0) {
    promptParts.push("### Recent Workouts:");
    const recentWorkouts = context.workouts.slice(-3);
    recentWorkouts.forEach(workout => {
      promptParts.push(`- ${workout.date}: ${workout.type}, ${workout.duration} minutes${workout.distance ? `, ${workout.distance} km` : ''}`);
    });
    promptParts.push("");
  }

  // Add recent nutrition entries (last 5)
  if (context.nutrition.length > 0) {
    promptParts.push("### Recent Nutrition:");
    const recentNutrition = context.nutrition.slice(-5);
    recentNutrition.forEach(entry => {
      promptParts.push(`- ${entry.date} (${entry.meal}): ${entry.items.join(', ')} - ${entry.calories} calories`);
    });
    promptParts.push("");
  }

  // Add weekly targets if available
  if (context.weeklyTarget) {
    promptParts.push("### Weekly Targets:");
    promptParts.push(`- Target runs: ${context.weeklyTarget.targetRuns} per week`);
    promptParts.push(`- Daily calorie budget: ${context.weeklyTarget.calorieBudget} calories`);
    promptParts.push("");
  }

  // Add recent feedback if available
  if (context.feedback.length > 0) {
    promptParts.push("### Recent Feedback:");
    const recentFeedback = context.feedback.slice(-3);
    recentFeedback.forEach(feedback => {
      promptParts.push(`- ${feedback.date}: ${feedback.notes}`);
    });
    promptParts.push("");
  }

  promptParts.push("## Instructions:");
  promptParts.push("Please provide:");
  promptParts.push("1. A structured weekly workout plan (3-5 workouts)");
  promptParts.push("2. Daily meal suggestions that align with their calorie targets");
  promptParts.push("3. Specific recommendations based on their recent activity patterns");
  promptParts.push("4. Motivational tips and adjustments for improvement");
  promptParts.push("");
  promptParts.push("Keep the plan realistic, progressive, and personalized to their current fitness level.");

  const prompt = promptParts.join('\n');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert health and fitness coach who creates personalized, achievable plans based on user data. Always provide specific, actionable advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const planText = response.choices[0]?.message?.content || 'Unable to generate plan at this time.';
    
    return { text: planText };
  } catch (error) {
    console.error('Error generating plan:', error);
    
    // Fallback plan if API fails
    const fallbackPlan = `
# Personalized Fitness Plan

## Weekly Workout Schedule
${context.workouts.length > 0 ? 
  `Based on your recent ${context.workouts[context.workouts.length - 1]?.type} workout, here's your plan:` : 
  'Here\'s a beginner-friendly plan to get you started:'
}

**Monday**: 30-minute cardio (walking/jogging)
**Wednesday**: Strength training (bodyweight exercises)
**Friday**: 45-minute mixed cardio
**Saturday**: Active recovery (yoga/stretching)

## Nutrition Recommendations
${context.weeklyTarget ? 
  `Daily calorie target: ${context.weeklyTarget.calorieBudget} calories` : 
  'Focus on balanced meals with lean proteins, vegetables, and whole grains'
}

- Breakfast: Oatmeal with fruits and nuts
- Lunch: Grilled chicken salad with mixed vegetables
- Dinner: Lean protein with quinoa and steamed vegetables
- Snacks: Greek yogurt, nuts, or fresh fruit

## Notes
${context.feedback.length > 0 ? 
  `Based on your recent feedback: "${context.feedback[context.feedback.length - 1]?.notes}", consider adjusting intensity accordingly.` :
  'Start gradually and listen to your body. Consistency is more important than intensity.'
}

*Note: This is a fallback plan. For personalized AI-generated plans, please ensure OpenAI API is configured.*
`;

    return { text: fallbackPlan };
  }
} 