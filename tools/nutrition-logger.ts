import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";
import { NutritionEntry } from "../types/entries";

export const nutritionLoggerTool = {
  name: "log-nutrition",
  description: "Log a nutrition entry including meal type, food items, and calories",
  schema: {
    userId: z.string().describe("Unique user identifier"),
    date: z.string().describe("Date of the meal (YYYY-MM-DD format)"),
    meal: z.string().describe("Type of meal (e.g., 'breakfast', 'lunch', 'dinner', 'snack')"),
    items: z.array(z.string()).describe("List of food items consumed"),
    calories: z.number().describe("Total calories for this meal"),
  },
  handler: async ({ userId, date, meal, items, calories }: { 
    userId: string; 
    date: string; 
    meal: string; 
    items: string[]; 
    calories: number; 
  }) => {
    try {
      const nutritionEntry: NutritionEntry = {
        date,
        meal,
        items,
        calories,
      };

      await memoryStore.addEntry(userId, nutritionEntry);

      return {
        content: [
          {
            type: "text" as const,
            text: `🍽️ Nutrition logged successfully!

**Meal Details:**
- Date: ${date}
- Meal: ${meal}
- Items: ${items.join(', ')}
- Calories: ${calories}

Your nutrition data has been recorded and will help generate better meal recommendations in your personalized plan.`,
          },
        ],
      };
    } catch (error) {
      console.error('Error logging nutrition:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error logging nutrition: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  },
}; 