import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";
import { WeeklyTarget } from "../types/entries";

export const targetSetterTool = {
  name: "set-weekly-target",
  description: "Set weekly fitness targets including target runs and daily calorie budget",
  schema: {
    userId: z.string().describe("Unique user identifier"),
    weekStart: z.string().describe("Start date of the week (YYYY-MM-DD format, typically Monday)"),
    targetRuns: z.number().describe("Number of runs/cardio sessions planned for the week"),
    calorieBudget: z.number().describe("Daily calorie budget/goal"),
  },
  handler: async ({ userId, weekStart, targetRuns, calorieBudget }: { 
    userId: string; 
    weekStart: string; 
    targetRuns: number; 
    calorieBudget: number; 
  }) => {
    try {
      const target: WeeklyTarget = {
        weekStart,
        targetRuns,
        calorieBudget,
      };

      memoryStore.setWeeklyTarget(userId, target);

      return {
        content: [
          {
            type: "text" as const,
            text: `🎯 Weekly targets set successfully!

**Your Goals for the week of ${weekStart}:**
- Target runs/cardio sessions: ${targetRuns} per week
- Daily calorie budget: ${calorieBudget} calories

These targets will be used to create more personalized workout and nutrition plans. Stay consistent and track your progress!`,
          },
        ],
      };
    } catch (error) {
      console.error('Error setting weekly target:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error setting weekly target: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
}; 