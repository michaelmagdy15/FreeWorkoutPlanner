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

  // Local offline queue helpers
  const getOfflineQueue = (): any[] => {
    try {
      const queue = localStorage.getItem('fwp-offline-queue')
      return queue ? JSON.parse(queue) : []
    } catch (e) {
      return []
    }
  }

  const saveOfflineQueue = (queue: any[]) => {
    try {
      localStorage.setItem('fwp-offline-queue', JSON.stringify(queue))
      // Dispatch custom event to alert the OfflineSyncBanner
      window.dispatchEvent(new CustomEvent('offlineQueueUpdated', { detail: { count: queue.length } }))
    } catch (e) {
      console.error('Failed to save offline queue:', e)
    }
  }

  // Fetch user context (with offline local storage fallback)
  const refreshContext = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔄 Refreshing context for userId:', userId)
      
      // If we are offline, immediately try to load cached state
      if (typeof window !== 'undefined' && !navigator.onLine) {
        console.log('🔌 Offline mode: Accessing on-device cached context.')
        const cached = localStorage.getItem(`fwp-cached-context-${userId}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          setContext(parsed)
          setError(null)
          console.log('✅ Successfully loaded cached client context.')
        } else {
          setError('Working offline. No local workout tracking context found yet.')
        }
        return
      }

      const newContext = await fetchUserContext(userId)
      console.log('📊 New context received:', {
        workoutMinutes: newContext.todaysProgress?.workoutMinutes,
        workoutsCompleted: newContext.todaysProgress?.workoutsCompleted,
        workoutsCount: newContext.recentEntries?.workouts?.length
      })
      
      // If we got valid data, clear any previous errors and update cache
      if (newContext && newContext.todaysProgress) {
        setError(null)
        setContext(newContext)
        localStorage.setItem(`fwp-cached-context-${userId}`, JSON.stringify(newContext))
        console.log('✅ Context updated in state and cached in localStorage')
      } else {
        console.warn('⚠️ Received invalid context data:', newContext)
        setError('Unable to load fitness data')
      }
      
      console.log('🔄 Context refresh completed at:', new Date().toISOString())
    } catch (err) {
      console.error('❌ Failed to fetch context:', err)
      
      // Catch connection errors and load cached backup context
      const cached = localStorage.getItem(`fwp-cached-context-${userId}`)
      if (cached) {
        const parsed = JSON.parse(cached)
        setContext(parsed)
        setError('Unable to contact server. Displaying cached local gym records.')
      } else {
        const errorMessage = handleAPIError(err)
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Flush offline queue to the server on connection restoration
  const flushOfflineQueue = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine) return
    
    const queue = getOfflineQueue()
    if (queue.length === 0) return
    
    console.log(`📡 [Sync Engine] Connection restored. Flushing ${queue.length} cached gym records to server.`);
    
    let successCount = 0
    const remainingQueue = []
    
    for (const item of queue) {
      try {
        await logEntry(userId, item.entryType, item.entryData)
        successCount++
      } catch (err) {
        console.error('📡 [Sync Engine] Failed to upload entry, retaining in queue:', item, err)
        remainingQueue.push(item)
      }
    }
    
    saveOfflineQueue(remainingQueue)
    console.log(`📡 [Sync Engine] Flushed ${successCount} entries. ${remainingQueue.length} items remain in local cache.`);
    
    // Once flushed, reload the true unified state from the server
    await refreshContext()
  }, [userId, refreshContext])

  // Log new entry (optimistic UI update if offline)
  const logNewEntry = useCallback(async (
    entryType: 'workout' | 'nutrition' | 'feedback' | 'activity',
    entryData: LogEntryData
  ) => {
    try {
      setIsLogging(true)
      setError(null)
      
      // Handle offline logging
      if (typeof window !== 'undefined' && !navigator.onLine) {
        console.log('🔌 Offline: Stashing gym tracking entry to on-device queue.')
        
        const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        const timestamp = new Date().toISOString()
        
        const queue = getOfflineQueue()
        queue.push({
          id: mockId,
          entryType,
          entryData,
          timestamp
        })
        saveOfflineQueue(queue)

        // Optimistic UI Context update
        setContext(prevContext => {
          if (!prevContext) return null
          const nextContext = { ...prevContext }
          
          if (entryType === 'workout' && entryData.workout) {
            const newWorkout = {
              id: mockId,
              timestamp,
              type: entryData.workout.type || 'strength',
              name: entryData.workout.name || 'Strength Exercise',
              duration: Number(entryData.workout.duration || 0),
              sets: entryData.workout.sets,
              reps: entryData.workout.reps,
              weight: entryData.workout.weight,
              completed: true,
            }
            
            nextContext.recentEntries = {
              ...nextContext.recentEntries,
              workouts: [newWorkout, ...nextContext.recentEntries.workouts]
            }
            
            nextContext.todaysProgress = {
              ...nextContext.todaysProgress,
              workoutMinutes: nextContext.todaysProgress.workoutMinutes + newWorkout.duration,
              workoutsCompleted: nextContext.todaysProgress.workoutsCompleted + 1
            }
          } 
          
          else if (entryType === 'nutrition' && entryData.nutrition) {
            const newMeal = {
              id: mockId,
              timestamp,
              mealType: entryData.nutrition.mealType || 'snack',
              foodItem: entryData.nutrition.foodItem || 'Healthy Meal',
              calories: Number(entryData.nutrition.calories || 0),
              protein: Number(entryData.nutrition.protein || 0),
              carbs: Number(entryData.nutrition.carbs || 0),
              fat: Number(entryData.nutrition.fat || 0)
            }
            
            nextContext.recentEntries = {
              ...nextContext.recentEntries,
              nutrition: [newMeal, ...nextContext.recentEntries.nutrition]
            }
            
            nextContext.todaysProgress = {
              ...nextContext.todaysProgress,
              caloriesConsumed: nextContext.todaysProgress.caloriesConsumed + newMeal.calories,
              mealsLogged: nextContext.todaysProgress.mealsLogged + 1
            }
          } 
          
          else if (entryType === 'activity' && entryData.activity) {
            if (entryData.activity.type === 'steps') {
              const stepsCount = Number(entryData.activity.count || 0)
              nextContext.todaysProgress = {
                ...nextContext.todaysProgress,
                stepsTaken: nextContext.todaysProgress.stepsTaken + stepsCount
              }
            }
          }
          
          // Cache our optimistic updates so they survive hard page updates while offline!
          localStorage.setItem(`fwp-cached-context-${userId}`, JSON.stringify(nextContext))
          return nextContext
        })

        return { success: true }
      }
      
      // Standard online operation
      await logEntry(userId, entryType, entryData)
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
      
      if (typeof window !== 'undefined' && !navigator.onLine) {
        throw new Error('Generating AI coaching plans requires an active network connection.')
      }
      
      const planResult = await generatePlan(userId)
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
      // Intercept offline completions
      if (typeof window !== 'undefined' && !navigator.onLine) {
        console.log(`🔌 Offline: Queueing exercise completion tracker for ${exerciseId}`)
        
        const mockId = `mock-progress-${Date.now()}`
        const timestamp = new Date().toISOString()
        
        // Cache a feedback progress entry
        const queue = getOfflineQueue()
        queue.push({
          id: mockId,
          entryType: 'feedback',
          entryData: {
            feedback: {
              type: 'progress',
              notes: `${completed ? 'Completed' : 'Skipped'} exercise ${exerciseId}${notes ? `: ${notes}` : ''}`,
              timestamp,
            }
          },
          timestamp
        })
        saveOfflineQueue(queue)

        // Optimistically update plan workout checklist status
        setContext(prevContext => {
          if (!prevContext || !prevContext.currentPlan) return prevContext
          
          const nextWorkouts = prevContext.currentPlan.workouts.map(workout => {
            if (workout.id === exerciseId) {
              return { ...workout, completed }
            }
            return workout
          })

          const nextContext = {
            ...prevContext,
            currentPlan: {
              ...prevContext.currentPlan,
              workouts: nextWorkouts
            }
          }
          
          if (completed) {
            nextContext.todaysProgress = {
              ...nextContext.todaysProgress,
              workoutsCompleted: nextContext.todaysProgress.workoutsCompleted + 1
            }
          } else {
            nextContext.todaysProgress = {
              ...nextContext.todaysProgress,
              workoutsCompleted: Math.max(0, nextContext.todaysProgress.workoutsCompleted - 1)
            }
          }

          localStorage.setItem(`fwp-cached-context-${userId}`, JSON.stringify(nextContext))
          return nextContext
        })

        return { success: true }
      }

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

  // Bind sync hooks on mount & auto-flush if initially online
  useEffect(() => {
    const handleOnline = () => {
      flushOfflineQueue()
    }

    window.addEventListener('online', handleOnline)
    
    if (navigator.onLine) {
      flushOfflineQueue()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [flushOfflineQueue])

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
  ])

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
 