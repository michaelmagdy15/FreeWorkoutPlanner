import { WorkoutEntry } from './api';

export interface OverloadSuggestion {
  suggestedWeight: number;
  suggestedReps: number;
  reason: string;
  increased: boolean;
}

/**
 * Calculates progressive overload recommendations based on historical exercise logs.
 */
export function calculateOverload(
  history: WorkoutEntry[] = [],
  currentExerciseName: string,
  targetReps: number = 10,
  defaultWeight: number = 20
): OverloadSuggestion {
  const matches = history
    .filter(
      (w) =>
        w.name.toLowerCase() === currentExerciseName.toLowerCase() &&
        w.completed &&
        w.weight
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (matches.length === 0) {
    return {
      suggestedWeight: defaultWeight,
      suggestedReps: targetReps,
      reason: `Establish a baseline weight (starting with ${defaultWeight}kg).`,
      increased: false,
    };
  }

  const latest = matches[0];
  const lastWeight = parseFloat(latest.weight || '0') || defaultWeight;
  const lastReps = latest.reps || targetReps;

  // Simple and highly effective progressive overload algorithm:
  // If the last session's reps met or exceeded target reps, increase load
  if (lastReps >= targetReps) {
    // Increase weight by 2.5kg for lower loads, or 5% rounded to nearest 2.5kg for larger loads
    const increment = lastWeight >= 60 ? 5 : 2.5;
    const nextWeight = Math.round((lastWeight + increment) * 10) / 10;
    
    return {
      suggestedWeight: nextWeight,
      suggestedReps: targetReps,
      reason: `Successfully completed ${lastReps} reps at ${lastWeight}kg. Upgrading load by +${increment}kg.`,
      increased: true,
    };
  } else {
    // If they missed target reps last time, keep weight the same but suggest increasing reps to hit baseline target
    return {
      suggestedWeight: lastWeight,
      suggestedReps: Math.min(targetReps, lastReps + 1),
      reason: `Targeting rep overload: Let's hit ${Math.min(targetReps, lastReps + 1)} reps at ${lastWeight}kg before adding weight.`,
      increased: true,
    };
  }
}

export interface BarbellPlates {
  weightPerSide: number;
  plates: Record<number, number>; // Maps weight (e.g. 20, 15) to count
  remainder: number;
}

/**
 * Calculates standard plate increments for a standard 20kg barbell.
 * Standard Olympic plates: 25, 20, 15, 10, 5, 2.5, 1.25 kg
 */
export function calculateBarbellPlates(totalWeight: number, barWeight: number = 20): BarbellPlates {
  if (totalWeight <= barWeight) {
    return {
      weightPerSide: 0,
      plates: {},
      remainder: 0,
    };
  }

  const weightPerSide = (totalWeight - barWeight) / 2;
  let remaining = weightPerSide;
  
  const standardPlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const plates: Record<number, number> = {};

  for (const plate of standardPlates) {
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      plates[plate] = count;
      remaining = Math.round((remaining - count * plate) * 100) / 100;
    }
  }

  return {
    weightPerSide,
    plates,
    remainder: remaining,
  };
}
