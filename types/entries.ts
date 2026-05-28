/**
 * Core entry types for the Health & Fitness Coach MCP server
 */

export interface WorkoutEntry {
  date: string;
  type: string;
  distance?: number;
  duration: number;
}

export interface NutritionEntry {
  date: string;
  meal: string;
  items: string[];
  calories: number;
}

export interface FeedbackEntry {
  date: string;
  notes: string;
}

export interface WeeklyTarget {
  weekStart: string;
  targetRuns: number;
  calorieBudget: number;
} 