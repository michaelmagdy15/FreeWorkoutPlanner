import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";
import { WorkoutEntry } from "../types/entries";

export const workoutLoggerTool = {
  name: "log-workout",
  description: "Log a workout entry including type, duration, and optional distance",
  schema: {
    userId: z.string().describe("Unique user identifier"),
    date: z.string().describe("Date of the workout (YYYY-MM-DD format)"),
    type: z.string().describe("Type of workout (e.g., 'running', 'cycling', 'strength training', 'yoga')"),
    duration: z.number().describe("Duration of the workout in minutes"),
    distance: z.number().optional().describe("Distance covered in kilometers (optional, for cardio workouts)"),
  },
  handler: async ({ userId, date, type, duration, distance }: { 
    userId: string; 
    date: string; 
    type: string; 
    duration: number; 
    distance?: number; 
  }) => {
    try {
      const workoutEntry: WorkoutEntry = {
        date,
        type,
        duration,
        ...(distance && { distance }),
      };

      await memoryStore.addEntry(userId, workoutEntry);

      return {
        content: [
          {
            type: "text" as const,
            text: `✅ Workout logged successfully!

**Workout Details:**
- Date: ${date}
- Type: ${type}
- Duration: ${duration} minutes${distance ? `\n- Distance: ${distance} km` : ''}

Great job staying active! Your workout has been recorded and will be included in your next personalized plan.`,
          },
        ],
      };
    } catch (error) {
      console.error('Error logging workout:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error logging workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
}; 