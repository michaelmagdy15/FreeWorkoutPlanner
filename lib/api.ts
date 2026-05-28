// API layer for MCP server interactions

const API_BASE_URL = '' // Use relative URLs to work with any port

export interface UserContext {
  userId: string
  currentTargets: {
    calorieGoal: number
    workoutMinutesGoal: number
    stepsGoal: number
  }
  todaysProgress: {
    workoutMinutes: number
    caloriesConsumed: number
    stepsTaken: number
    workoutsCompleted: number
    mealsLogged: number
  }
  recentEntries: {
    workouts: WorkoutEntry[]
    nutrition: NutritionEntry[]
    feedback: FeedbackEntry[]
  }
  currentPlan?: {
    workouts: PlannedWorkout[]
    meals: PlannedMeal[]
    recommendations: string[]
  }
}

export interface WorkoutEntry {
  id: string
  timestamp: string
  type: 'strength' | 'cardio'
  name: string
  duration: number
  sets?: number
  reps?: number
  weight?: string
  distance?: number
  caloriesBurned?: number
  completed: boolean
}

export interface NutritionEntry {
  id: string
  timestamp: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItem: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface FeedbackEntry {
  id: string
  timestamp: string
  type: 'progress' | 'motivation' | 'concern'
  notes: string
  rating?: number
}

export interface ActivityEntry {
  id: string
  timestamp: string
  type: 'steps' | 'water' | 'sleep' | 'weight'
  count?: number
  amount?: number
  duration?: number
  value?: number
  unit: string
}

export interface PlannedWorkout {
  id: string
  name: string
  type: 'strength' | 'cardio'
  sets: number
  reps: number
  weight?: string
  duration?: number
  completed: boolean
}

export interface PlannedMeal {
  id: string
  mealType: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

export interface LogEntryData {
  workout?: Partial<WorkoutEntry>
  nutrition?: Partial<NutritionEntry>
  feedback?: Partial<FeedbackEntry>
  activity?: Partial<ActivityEntry>
}

// API Functions
export async function fetchUserContext(userId: string): Promise<UserContext> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/context?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch context: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user context:', error)
    throw new Error('Unable to load your fitness data. Please try again.')
  }
}

export async function logEntry(
  userId: string, 
  entryType: 'workout' | 'nutrition' | 'feedback' | 'activity', 
  entryData: LogEntryData
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        entryType,
        entryData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to log entry: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error logging entry:', error)
    throw new Error('Unable to save your entry. Please try again.')
  }
}

export async function generatePlan(userId: string): Promise<{
  planText: string
  structuredPlan: {
    workouts: PlannedWorkout[]
    meals: PlannedMeal[]
    recommendations: string[]
  }
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate plan: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating plan:', error)
    throw new Error('Unable to generate your plan. Please try again.')
  }
}

export async function updateExerciseProgress(
  userId: string,
  exerciseId: string,
  completed: boolean,
  notes?: string
): Promise<void> {
  try {
    await logEntry(userId, 'feedback', {
      feedback: {
        type: 'progress',
        notes: `${completed ? 'Completed' : 'Skipped'} exercise ${exerciseId}${notes ? `: ${notes}` : ''}`,
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Error updating exercise progress:', error)
    throw new Error('Unable to update exercise progress. Please try again.')
  }
}

export async function getChatResponse(
  userId: string,
  message: string,
  context?: UserContext
): Promise<{ response: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message,
        context,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get chat response: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting chat response:', error)
    // Fallback to existing intelligent response system
    throw error
  }
}

// Error handling utilities
export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): string {
  if (error instanceof APIError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
} 