import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";

export const contextViewerTool = {
  name: "view-context",
  description: "View your complete fitness and nutrition history and weekly targets",
  schema: {
    userId: z.string().describe("Unique user identifier"),
  },
  handler: async ({ userId }: { userId: string }) => {
    try {
      const context = await memoryStore.getContext(userId);

      let contextSummary = "📊 **Your Health & Fitness Summary**\n\n";

      // Weekly targets
      if (context.weeklyTarget) {
        contextSummary += `🎯 **Weekly Targets (Week of ${context.weeklyTarget.weekStart}):**\n`;
        contextSummary += `- Target runs: ${context.weeklyTarget.targetRuns} per week\n`;
        contextSummary += `- Daily calorie budget: ${context.weeklyTarget.calorieBudget} calories\n\n`;
      }

      // Workouts
      if (context.workouts.length > 0) {
        contextSummary += `💪 **Recent Workouts (${context.workouts.length} total):**\n`;
        context.workouts.slice(-5).forEach(workout => {
          contextSummary += `- ${workout.date}: ${workout.type} (${workout.duration} min${workout.distance ? `, ${workout.distance} km` : ''})\n`;
        });
        contextSummary += "\n";
      } else {
        contextSummary += "💪 **Workouts:** No workouts logged yet\n\n";
      }

      // Nutrition
      if (context.nutrition.length > 0) {
        contextSummary += `🍽️ **Recent Nutrition (${context.nutrition.length} entries):**\n`;
        context.nutrition.slice(-5).forEach(entry => {
          contextSummary += `- ${entry.date} (${entry.meal}): ${entry.items.join(', ')} - ${entry.calories} cal\n`;
        });
        contextSummary += "\n";
      } else {
        contextSummary += "🍽️ **Nutrition:** No meals logged yet\n\n";
      }

      // Feedback
      if (context.feedback.length > 0) {
        contextSummary += `💭 **Recent Feedback (${context.feedback.length} entries):**\n`;
        context.feedback.slice(-3).forEach(feedback => {
          contextSummary += `- ${feedback.date}: ${feedback.notes}\n`;
        });
        contextSummary += "\n";
      } else {
        contextSummary += "💭 **Feedback:** No feedback logged yet\n\n";
      }

      contextSummary += "---\n*Use the other tools to log workouts, nutrition, or generate a personalized plan!*";

      return {
        content: [
          {
            type: "text" as const,
            text: contextSummary,
          },
        ],
      };
    } catch (error) {
      console.error('Error viewing context:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error retrieving your data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
}; 