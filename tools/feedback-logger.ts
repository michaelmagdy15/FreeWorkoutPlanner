import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";
import { FeedbackEntry } from "../types/entries";

export const feedbackLoggerTool = {
  name: "log-feedback",
  description: "Log feedback about your fitness journey, how you're feeling, or notes about workouts/nutrition",
  schema: {
    userId: z.string().describe("Unique user identifier"),
    date: z.string().describe("Date of the feedback (YYYY-MM-DD format)"),
    notes: z.string().describe("Your feedback, notes, or how you're feeling about your fitness journey"),
  },
  handler: async ({ userId, date, notes }: { 
    userId: string; 
    date: string; 
    notes: string; 
  }) => {
    try {
      const feedbackEntry: FeedbackEntry = {
        date,
        notes,
      };

      memoryStore.addEntry(userId, feedbackEntry);

      return {
        content: [
          {
            type: "text" as const,
            text: `💭 Feedback logged successfully!

**Feedback Details:**
- Date: ${date}
- Notes: ${notes}

Thank you for sharing your thoughts! This feedback will help generate better personalized recommendations and track your progress over time.`,
          },
        ],
      };
    } catch (error) {
      console.error('Error logging feedback:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error logging feedback: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
}; 