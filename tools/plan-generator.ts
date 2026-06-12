import { z } from "zod";
import { memoryStore } from "../utils/memoryStore";
import { generatePlan } from "../utils/llmClient";

export const planGeneratorTool = {
  name: "generate-plan",
  description: "Generate a personalized weekly fitness and nutrition plan based on user's activity history",
  schema: {
    userId: z.string().describe("Unique user identifier"),
  },
  handler: async ({ userId }: { userId: string }) => {
    try {
      // Get user's complete context
      const context = await memoryStore.getContext(userId);

      // Generate personalized plan using LLM
      const plan = await generatePlan(context);

      return {
        content: [
          {
            type: "text" as const,
            text: `🎯 **Your Personalized Fitness Plan**

${plan.text}

---

*This plan is based on your recent activity data. Remember to listen to your body and adjust as needed. Log your workouts and meals to get even better recommendations!*`,
          },
        ],
      };
    } catch (error) {
      console.error('Error generating plan:', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Error generating plan: ${error instanceof Error ? error.message : 'Unknown error'}

Please try again later or contact support if the issue persists.`,
          },
        ],
      };
    }
  },
}; 