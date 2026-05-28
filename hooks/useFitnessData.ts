import { useState, useEffect, useCallback } from 'react'
import { 
  fetchUserContext, 
  logEntry, 
  generatePlan, 
  updateExerciseProgress,
  UserContext,
  LogEntryData,
  handleAPIError 
} from '@/lib/api'

export function useFitnessData(userId: string = 'default-user') {
  const [context, setContext] = useState<UserContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLogging, setIsLogging] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

  // Fetch user context
  const refreshContext = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔄 Refreshing context for userId:', userId)
      const newContext = await fetchUserContext(userId)
      console.log('📊 New context received:', {
        workoutMinutes: newContext.todaysProgress?.workoutMinutes,
        workoutsCompleted: newContext.todaysProgress?.workoutsCompleted,
        workoutsCount: newContext.recentEntries?.workouts?.length
      })
      
      // If we got valid data, clear any previous errors
      if (newContext && newContext.todaysProgress) {
        setError(null)
        setContext(newContext)
        console.log('✅ Context updated in state with valid data')
      } else {
        console.warn('⚠️ Received invalid context data:', newContext)
        // Set error for invalid data
        setError('Unable to load fitness data')
      }
      
      // Force a re-render by updating a timestamp
      console.log('🔄 Context refresh completed at:', new Date().toISOString())
    } catch (err) {
      const errorMessage = handleAPIError(err)
      console.error('❌ Failed to fetch context:', err)
      console.error('❌ Error message:', errorMessage)
      
      // Set error on fetch failure
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [userId]) // Removed 'context' dependency to prevent infinite loop

  // Log new entry
  const logNewEntry = useCallback(async (
    entryType: 'workout' | 'nutrition' | 'feedback' | 'activity',
    entryData: LogEntryData
  ) => {
    try {
      setIsLogging(true)
      setError(null)
      
      await logEntry(userId, entryType, entryData)
      
      // Immediately refresh context to update UI
      await refreshContext()
      
      return { success: true }
    } catch (err) {
      const errorMessage = handleAPIError(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLogging(false)
    }
  }, [userId, refreshContext])

  // Generate fitness plan
  const generateNewPlan = useCallback(async () => {
    try {
      setIsGeneratingPlan(true)
      setError(null)
      
      const planResult = await generatePlan(userId)
      
      // Refresh context to get updated plan data
      await refreshContext()
      
      return {
        success: true,
        planText: planResult.planText,
        structuredPlan: planResult.structuredPlan,
      }
    } catch (err) {
      const errorMessage = handleAPIError(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsGeneratingPlan(false)
    }
  }, [userId, refreshContext])

  // Update exercise completion status
  const markExerciseComplete = useCallback(async (
    exerciseId: string,
    completed: boolean,
    notes?: string
  ) => {
    try {
      await updateExerciseProgress(userId, exerciseId, completed, notes)
      await refreshContext()
      return { success: true }
    } catch (err) {
      const errorMessage = handleAPIError(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [userId, refreshContext])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initialize data on mount
  useEffect(() => {
    refreshContext()
  }, [refreshContext])

  // Listen for refresh events from chat
  useEffect(() => {
    const handleRefreshContext = () => {
      refreshContext()
    }

    window.addEventListener('refreshContext', handleRefreshContext)
    
    return () => {
      window.removeEventListener('refreshContext', handleRefreshContext)
    }
  }, [refreshContext])

  // Auto-clear errors when we have valid data
  useEffect(() => {
    if (context && context.todaysProgress && error) {
      console.log('🧹 Auto-clearing error since we have valid context data')
      setError(null)
    }
  }, [context, error])

  // Calculate dynamic progress data from context
  const progressData = context ? {
    workoutMinutes: context.todaysProgress.workoutMinutes,
    workoutProgress: Math.min((context.todaysProgress.workoutMinutes / context.currentTargets.workoutMinutesGoal) * 100, 100),
    caloriesConsumed: context.todaysProgress.caloriesConsumed,
    caloriesProgress: Math.min((context.todaysProgress.caloriesConsumed / context.currentTargets.calorieGoal) * 100, 100),
    stepsTaken: context.todaysProgress.stepsTaken,
    stepsProgress: Math.min((context.todaysProgress.stepsTaken / context.currentTargets.stepsGoal) * 100, 100),
  } : {
    workoutMinutes: 0,
    workoutProgress: 0,
    caloriesConsumed: 0,
    caloriesProgress: 0,
    stepsTaken: 0,
    stepsProgress: 0,
  }

  // Debug log when progressData changes
  useEffect(() => {
    console.log('📈 Progress data calculated:', progressData)
    if (context) {
      console.log('📈 Raw context todaysProgress:', context.todaysProgress)
      console.log('📈 Raw context currentPlan:', context.currentPlan ? 'Plan exists' : 'No plan')
    }
  }, [
    progressData.workoutMinutes, 
    progressData.caloriesConsumed, 
    progressData.stepsTaken,
    progressData.workoutProgress,
    progressData.caloriesProgress,
    progressData.stepsProgress,
    context?.currentPlan
  ]) // Only depend on actual values, not the whole objects

  return {
    // Data
    context,
    progressData,
    
    // State
    loading,
    error,
    isLogging,
    isGeneratingPlan,
    
    // Actions
    refreshContext,
    logNewEntry,
    generateNewPlan,
    markExerciseComplete,
    clearError,
  }
} 