import { WorkoutEntry, NutritionEntry, FeedbackEntry, WeeklyTarget } from './entries';

/**
 * Combined context containing all user health and fitness data
 */
export interface CombinedContext {
  workouts: WorkoutEntry[];
  nutrition: NutritionEntry[];
  feedback: FeedbackEntry[];
  weeklyTarget?: WeeklyTarget;
} 