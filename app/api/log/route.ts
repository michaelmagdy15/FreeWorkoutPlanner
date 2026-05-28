import { NextRequest, NextResponse } from 'next/server'
import { workoutStore, nutritionStore, activitiesStore } from '@/lib/stores'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId') || 'default-user'
  
  if (action === 'debug') {
    // Debug endpoint to check store contents
    const userWorkouts = workoutStore.get(userId) || []
    const userNutrition = nutritionStore.get(userId) || []
    const userActivities = activitiesStore.get(userId) || []
    
    return NextResponse.json({
      workouts: userWorkouts,
      nutrition: userNutrition,
      activities: userActivities,
      totals: {
        workoutMinutes: userWorkouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0),
        calories: userNutrition.reduce((sum: number, n: any) => sum + (n.calories || 0), 0),
        steps: userActivities
          .filter((a: any) => a.type === 'steps')
          .reduce((sum: number, a: any) => sum + (a.count || 0), 0),
        water: userActivities
          .filter((a: any) => a.type === 'water')
          .reduce((sum: number, a: any) => sum + (a.amount || 0), 0),
      }
    })
  }
  
  if (action === 'testStore') {
    // Test if stores are working
    const testData = { test: 'data', timestamp: new Date().toISOString() }
    workoutStore.set('test', testData)
    const retrieved = workoutStore.get('test')
    
    return NextResponse.json({
      stored: testData,
      retrieved: retrieved,
      working: JSON.stringify(testData) === JSON.stringify(retrieved)
    })
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { userId, entryType, entryData } = requestData

    if (!userId || !entryType || !entryData) {
      return NextResponse.json(
        { error: 'userId, entryType, and entryData are required' },
        { status: 400 }
      )
    }

    let mcpToolName: string
    let mcpArguments: any

    // Map entry types to MCP tools
    switch (entryType) {
      case 'workout':
        mcpToolName = 'log-workout'
        mcpArguments = {
          userId,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          type: entryData.workout?.name || 'Unknown Exercise',
          duration: entryData.workout?.duration || 30,
          ...(entryData.workout?.distance && { distance: entryData.workout.distance }),
        }
        break

      case 'nutrition':
        mcpToolName = 'log-nutrition'
        mcpArguments = {
          userId,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          meal: entryData.nutrition?.mealType || 'snack',
          items: [entryData.nutrition?.foodItem || 'Unknown Food'],
          calories: entryData.nutrition?.calories || 0,
        }
        break

      case 'feedback':
        mcpToolName = 'log-feedback'
        mcpArguments = {
          userId,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          notes: entryData.feedback?.notes || '',
        }
        break

      case 'activity':
        // Activities like steps, water, sleep, weight - store locally only for now
        console.log('💾 Storing activity locally (no MCP tool for activities yet)...')
        storeActivityLocally(userId, entryData)
        return NextResponse.json({ 
          success: true, 
          message: 'Activity logged successfully',
          stored: 'locally'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid entryType. Must be workout, nutrition, feedback, or activity' },
          { status: 400 }
        )
    }

    // Store data locally FIRST (regardless of MCP status)
    console.log('💾 Storing data locally regardless of MCP status...')
    storeDataLocally(userId, entryType, entryData)

    // Try to call MCP tool (but don't fail if it's not available)
    try {
      const mcpResponse = await fetch(`${request.nextUrl.origin}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: mcpToolName,
            arguments: mcpArguments,
          },
        }),
      })

      if (!mcpResponse.ok) {
        const errorText = await mcpResponse.text()
        throw new Error(`MCP call failed: ${mcpResponse.status} ${mcpResponse.statusText} - ${errorText}`)
      }

      const responseText = await mcpResponse.text()
      console.log('✅ MCP call successful:', responseText)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Entry logged successfully',
        mcpResponse: responseText,
        stored: 'both'
      })
    } catch (error) {
      console.error('MCP failed, but data already stored locally:', error)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Entry logged locally (MCP unavailable)',
        stored: 'locally'
      })
    }

  } catch (error) {
    console.error('Error in log API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function storeDataLocally(userId: string, entryType: string, entryData: any) {
  const timestamp = new Date().toISOString()
  const id = Date.now().toString()

  if (entryType === 'workout' && entryData.workout) {
    const userWorkouts = workoutStore.get(userId) || []
    const workoutEntry = {
      id,
      timestamp,
      type: entryData.workout.type || 'strength',
      name: entryData.workout.name || 'Unknown Exercise',
      duration: entryData.workout.duration || 30,
      sets: entryData.workout.sets || 3,
      reps: entryData.workout.reps || 10,
      weight: entryData.workout.weight,
      distance: entryData.workout.distance,
      caloriesBurned: entryData.workout.caloriesBurned,
      completed: true,
    }
    userWorkouts.push(workoutEntry)
    workoutStore.set(userId, userWorkouts)
    console.log(`✅ Stored workout for ${userId}:`, workoutEntry)
  }

  if (entryType === 'nutrition' && entryData.nutrition) {
    const userNutrition = nutritionStore.get(userId) || []
    const nutritionEntry = {
      id,
      timestamp,
      mealType: entryData.nutrition.mealType || 'snack',
      foodItem: entryData.nutrition.foodItem || 'Unknown Food',
      calories: entryData.nutrition.calories || 0,
      protein: entryData.nutrition.protein || 0,
      carbs: entryData.nutrition.carbs || 0,
      fat: entryData.nutrition.fat || 0,
    }
    userNutrition.push(nutritionEntry)
    nutritionStore.set(userId, userNutrition)
    console.log(`✅ Stored nutrition for ${userId}:`, nutritionEntry)
  }

  if (entryType === 'feedback' && entryData.feedback) {
    // For now, just log feedback but don't store it
    console.log(`✅ Feedback for ${userId}:`, entryData.feedback)
  }
}

function storeActivityLocally(userId: string, entryData: any) {
  const timestamp = new Date().toISOString()
  const id = Date.now().toString()

  if (entryData.activity) {
    const userActivities = activitiesStore.get(userId) || []
    const activityEntry = {
      id,
      timestamp,
      type: entryData.activity.type,
      ...entryData.activity
    }
    userActivities.push(activityEntry)
    activitiesStore.set(userId, userActivities)
    console.log(`✅ Stored activity for ${userId}:`, activityEntry)
  }
} 