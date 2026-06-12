import { WorkoutEntry, NutritionEntry, FeedbackEntry, WeeklyTarget } from '../types/entries';
import { CombinedContext } from '../types/context';
import { serverDatabases, databaseId } from '../lib/appwrite-server';
import { Query, ID } from 'node-appwrite';

/**
 * Appwrite DB backed storage for user health and fitness data
 */
export class MemoryStore {
  /**
   * Add a new entry for a user in Appwrite Databases
   * @param userId - Unique user identifier
   * @param entry - The entry to add (workout, nutrition, or feedback)
   */
  async addEntry(userId: string, entry: WorkoutEntry | NutritionEntry | FeedbackEntry): Promise<void> {
    try {
      if ('type' in entry && 'duration' in entry) {
        // WorkoutEntry
        const workout = entry as WorkoutEntry;
        await serverDatabases.createDocument(
          databaseId,
          'workouts',
          ID.unique(),
          {
            userId,
            name: 'type' in workout && (workout as any).name ? (workout as any).name : workout.type,
            type: workout.type,
            duration: workout.duration,
            distance: workout.distance || null,
            completed: true,
            timestamp: new Date(workout.date).toISOString()
          }
        );
      } else if ('meal' in entry && 'items' in entry && 'calories' in entry) {
        // NutritionEntry
        const nutrition = entry as NutritionEntry;
        await serverDatabases.createDocument(
          databaseId,
          'nutrition',
          ID.unique(),
          {
            userId,
            mealType: nutrition.meal,
            foodItem: nutrition.items.join(', '),
            calories: nutrition.calories,
            timestamp: new Date(nutrition.date).toISOString()
          }
        );
      } else if ('notes' in entry) {
        // FeedbackEntry
        const feedback = entry as FeedbackEntry;
        await serverDatabases.createDocument(
          databaseId,
          'feedback',
          ID.unique(),
          {
            userId,
            type: 'motivation',
            notes: feedback.notes,
            timestamp: new Date(feedback.date).toISOString()
          }
        );
      }
    } catch (error) {
      console.error('Error in MemoryStore.addEntry:', error);
      throw error;
    }
  }

  /**
   * Get the complete context for a user from Appwrite
   * @param userId - Unique user identifier
   * @returns Combined context with all user data
   */
  async getContext(userId: string): Promise<CombinedContext> {
    try {
      // 1. Fetch workouts
      const workoutsRes = await serverDatabases.listDocuments(
        databaseId,
        'workouts',
        [Query.equal('userId', userId), Query.limit(100)]
      );
      const workouts: WorkoutEntry[] = workoutsRes.documents.map(doc => ({
        date: doc.timestamp ? doc.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
        type: doc.type,
        duration: doc.duration,
        distance: doc.distance || undefined
      }));

      // 2. Fetch nutrition
      const nutritionRes = await serverDatabases.listDocuments(
        databaseId,
        'nutrition',
        [Query.equal('userId', userId), Query.limit(100)]
      );
      const nutrition: NutritionEntry[] = nutritionRes.documents.map(doc => ({
        date: doc.timestamp ? doc.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
        meal: doc.mealType,
        items: doc.foodItem ? doc.foodItem.split(',').map((s: string) => s.trim()) : [],
        calories: doc.calories
      }));

      // 3. Fetch feedback
      const feedbackRes = await serverDatabases.listDocuments(
        databaseId,
        'feedback',
        [Query.equal('userId', userId), Query.limit(100)]
      );
      const feedback: FeedbackEntry[] = feedbackRes.documents.map(doc => ({
        date: doc.timestamp ? doc.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: doc.notes
      }));

      // 4. Fetch targets
      const targetRes = await serverDatabases.listDocuments(
        databaseId,
        'activities',
        [
          Query.equal('userId', userId),
          Query.equal('type', 'target'),
          Query.orderDesc('timestamp'),
          Query.limit(1)
        ]
      );
      
      let weeklyTarget: WeeklyTarget | undefined;
      if (targetRes.documents.length > 0) {
        const doc = targetRes.documents[0];
        weeklyTarget = {
          weekStart: doc.timestamp ? doc.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
          targetRuns: doc.count || 0,
          calorieBudget: doc.duration || 2000
        };
      }

      return {
        workouts,
        nutrition,
        feedback,
        weeklyTarget
      };
    } catch (error) {
      console.error('Error in MemoryStore.getContext:', error);
      return {
        workouts: [],
        nutrition: [],
        feedback: [],
        weeklyTarget: undefined
      };
    }
  }

  /**
   * Set weekly target for a user
   * @param userId - Unique user identifier
   * @param target - The weekly target to set
   */
  async setWeeklyTarget(userId: string, target: WeeklyTarget): Promise<void> {
    try {
      await serverDatabases.createDocument(
        databaseId,
        'activities',
        ID.unique(),
        {
          userId,
          type: 'target',
          count: target.targetRuns,
          duration: target.calorieBudget,
          unit: 'runs/calories',
          timestamp: new Date(target.weekStart).toISOString()
        }
      );
    } catch (error) {
      console.error('Error in MemoryStore.setWeeklyTarget:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const memoryStore = new MemoryStore();