import { WorkoutEntry, NutritionEntry, FeedbackEntry, WeeklyTarget } from '../types/entries';
import { CombinedContext } from '../types/context';

/**
 * In-memory storage for user health and fitness data
 * Maintains separate arrays per user for workouts, nutrition, feedback, and weekly targets
 */
export class MemoryStore {
  private userWorkouts: Map<string, WorkoutEntry[]> = new Map();
  private userNutrition: Map<string, NutritionEntry[]> = new Map();
  private userFeedback: Map<string, FeedbackEntry[]> = new Map();
  private userTargets: Map<string, WeeklyTarget> = new Map();

  /**
   * Add a new entry for a user
   * @param userId - Unique user identifier
   * @param entry - The entry to add (workout, nutrition, or feedback)
   */
  addEntry(userId: string, entry: WorkoutEntry | NutritionEntry | FeedbackEntry): void {
    if ('type' in entry && 'duration' in entry) {
      // WorkoutEntry
      const workouts = this.userWorkouts.get(userId) || [];
      workouts.push(entry as WorkoutEntry);
      this.userWorkouts.set(userId, workouts);
    } else if ('meal' in entry && 'items' in entry && 'calories' in entry) {
      // NutritionEntry
      const nutrition = this.userNutrition.get(userId) || [];
      nutrition.push(entry as NutritionEntry);
      this.userNutrition.set(userId, nutrition);
    } else if ('notes' in entry) {
      // FeedbackEntry
      const feedback = this.userFeedback.get(userId) || [];
      feedback.push(entry as FeedbackEntry);
      this.userFeedback.set(userId, feedback);
    }
  }

  /**
   * Get the complete context for a user
   * @param userId - Unique user identifier
   * @returns Combined context with all user data
   */
  getContext(userId: string): CombinedContext {
    return {
      workouts: this.userWorkouts.get(userId) || [],
      nutrition: this.userNutrition.get(userId) || [],
      feedback: this.userFeedback.get(userId) || [],
      weeklyTarget: this.userTargets.get(userId),
    };
  }

  /**
   * Set weekly target for a user
   * @param userId - Unique user identifier
   * @param target - The weekly target to set
   */
  setWeeklyTarget(userId: string, target: WeeklyTarget): void {
    this.userTargets.set(userId, target);
  }
}

// Export singleton instance
export const memoryStore = new MemoryStore(); 