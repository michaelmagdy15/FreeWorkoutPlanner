import { NextRequest, NextResponse } from 'next/server'
import { workoutStore, nutritionStore, planStore, activitiesStore } from '@/lib/stores'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const testLocal = searchParams.get('testLocal') // Add test parameter
  
  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 }
    )
  }

  // If testLocal=true, return only local data to test stores
  if (testLocal === 'true') {
    const localContext = generateFallbackContext(userId)
    console.log('🧪 TEST LOCAL ONLY - returning fallback context')
    return NextResponse.json(localContext)
  }

  try {
    // ALWAYS get local store data first to preserve today's progress
    const localContext = generateFallbackContext(userId)
    console.log('📊 Local context data:', {
      workoutMinutes: localContext.todaysProgress.workoutMinutes,
      workoutsCount: localContext.recentEntries.workouts.length,
      localWorkouts: localContext.recentEntries.workouts.map((w: any) => `${w.name}(${w.duration}min)`)
    })

    // Try to call the MCP context viewer tool
    let mcpResponse
    try {
      mcpResponse = await fetch(`${request.nextUrl.origin}/mcp`, {
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
            name: 'view-context',
            arguments: {
              userId: userId,
            },
          },
        }),
      })
    } catch (error) {
      console.log('MCP server not available, using local data')
      return NextResponse.json(localContext)
    }

    if (!mcpResponse || !mcpResponse.ok) {
      console.log('MCP call failed or server unavailable, using local data')
      return NextResponse.json(localContext)
    }

    const responseText = await mcpResponse.text()
    console.log('✅ MCP context call successful:', responseText)
    
    // Parse the Server-Sent Events format to extract the context data
    let contextData = '{}'
    const dataMatch = responseText.match(/data: (.+)/)
    if (dataMatch) {
      try {
        const data = JSON.parse(dataMatch[1])
        contextData = data.result?.content?.[0]?.text || '{}'
      } catch (parseError) {
        console.log('Could not parse MCP response, using empty context')
      }
    }
    
    // Transform MCP response and MERGE with local data to preserve today's progress
    const mcpContext = transformMcpContextToFrontend(contextData, userId)
    
    console.log('🔄 MCP context data:', {
      workoutMinutes: mcpContext.todaysProgress?.workoutMinutes,
      workoutsCount: mcpContext.recentEntries?.workouts?.length || 0,
      mcpWorkouts: mcpContext.recentEntries?.workouts?.map((w: any) => `${w.name}(${w.duration}min)`) || [],
      hasPlan: !!mcpContext.currentPlan
    })
    
    // Merge local store data (today's progress) with MCP data (plans, etc.)
    const mergedContext = {
      ...mcpContext,
      // PRESERVE today's progress from local stores
      todaysProgress: {
        workoutMinutes: localContext.todaysProgress.workoutMinutes,
        caloriesConsumed: localContext.todaysProgress.caloriesConsumed,
        stepsTaken: localContext.todaysProgress.stepsTaken, // Always use local data for steps
        workoutsCompleted: localContext.todaysProgress.workoutsCompleted,
        mealsLogged: localContext.todaysProgress.mealsLogged,
      },
      // PRESERVE recent entries from local stores (logged workouts/nutrition)
      recentEntries: {
        workouts: localContext.recentEntries.workouts,
        nutrition: localContext.recentEntries.nutrition,
        feedback: mcpContext.recentEntries?.feedback || [],
      },
      // USE MCP plan if available, otherwise use local plan
      currentPlan: mcpContext.currentPlan || localContext.currentPlan,
    }
    
    console.log('🔄 Merged context:', {
      workoutMinutes: mergedContext.todaysProgress.workoutMinutes,
      workoutsCount: mergedContext.recentEntries.workouts.length,
      hasPlan: !!mergedContext.currentPlan
    })
    
    return NextResponse.json(mergedContext)
  } catch (error) {
    console.error('Error fetching context:', error)
    
    // Return local data as ultimate fallback
    const localContext = generateFallbackContext(userId)
    return NextResponse.json(localContext)
  }
}

function transformMcpContextToFrontend(mcpContextText: string, userId: string) {
  // Since MCP context viewer returns formatted text (not JSON data),
  // we'll return a clean default structure and let the merge logic
  // use the actual local store data for real values
  console.log('📄 MCP context text received (not parsing as JSON):', mcpContextText.substring(0, 100) + '...')
  
  return {
    userId,
    currentTargets: {
      calorieGoal: 2000,
      workoutMinutesGoal: 60,
      stepsGoal: 10000,
    },
    todaysProgress: {
      workoutMinutes: 0,  // Will be overridden by local data
      caloriesConsumed: 0, // Will be overridden by local data
      stepsTaken: 0,      // Will be overridden by local data
      workoutsCompleted: 0, // Will be overridden by local data
      mealsLogged: 0,     // Will be overridden by local data
    },
    recentEntries: {
      workouts: [],       // Will be overridden by local data
      nutrition: [],      // Will be overridden by local data
      feedback: [],
    },
    currentPlan: null,    // Could be enhanced later
  }
}

function generateFallbackContext(userId: string) {
  const userWorkouts = workoutStore.get(userId) || []
  const userNutrition = nutritionStore.get(userId) || []
  const userActivities = activitiesStore.get(userId) || []
  const userPlan = planStore.get(userId) // Get stored plan
  
  // Calculate totals from actual stored data only (no simulation)
  const workoutMinutes = userWorkouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0)
  const caloriesConsumed = userNutrition.reduce((sum: number, n: any) => sum + (n.calories || 0), 0)
  const stepsTaken = userActivities
    .filter((a: any) => a.type === 'steps')
    .reduce((sum: number, a: any) => sum + (a.count || 0), 0)
  
  return {
    userId: userId,
    currentTargets: {
      calorieGoal: 2000,
      workoutMinutesGoal: 60,
      stepsGoal: 10000,
    },
    todaysProgress: {
      workoutMinutes,
      caloriesConsumed,
      stepsTaken: stepsTaken || 0, // Use actual logged steps or 0
      workoutsCompleted: userWorkouts.length,
      mealsLogged: userNutrition.length,
    },
    recentEntries: {
      workouts: userWorkouts.slice(-5), // Last 5 workouts
      nutrition: userNutrition.slice(-5), // Last 5 meals
      feedback: [],
    },
    currentPlan: userPlan, // Include stored plan
  }
}