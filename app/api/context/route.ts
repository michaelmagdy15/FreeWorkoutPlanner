import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, databaseId } from '@/lib/appwrite-server'
import { Query, ID } from 'node-appwrite'
import { mirnaPlan } from '@/lib/plan-seed'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const testLocal = searchParams.get('testLocal')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 }
    )
  }

  // If testLocal=true, return only data from Appwrite (fallback) to verify connection
  if (testLocal === 'true') {
    const localContext = await generateFallbackContext(userId)
    console.log('🧪 TEST LOCAL ONLY - returning fallback context')
    return NextResponse.json(localContext)
  }

  try {
    // ALWAYS get Appwrite database context data first
    const localContext = await generateFallbackContext(userId)
    console.log('📊 Appwrite database context data loaded successfully')

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
      console.log('MCP server not available, using local Appwrite data')
      return NextResponse.json(localContext)
    }

    if (!mcpResponse || !mcpResponse.ok) {
      console.log('MCP call failed or server unavailable, using local Appwrite data')
      return NextResponse.json(localContext)
    }

    const responseText = await mcpResponse.text()
    
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
    
    // Transform MCP response and MERGE with Appwrite database data
    const mcpContext = transformMcpContextToFrontend(contextData, userId)
    
    // Merge database context data (today's progress) with MCP data
    const mergedContext = {
      ...mcpContext,
      // PRESERVE today's progress from Appwrite database
      todaysProgress: {
        workoutMinutes: localContext.todaysProgress.workoutMinutes,
        caloriesConsumed: localContext.todaysProgress.caloriesConsumed,
        stepsTaken: localContext.todaysProgress.stepsTaken,
        workoutsCompleted: localContext.todaysProgress.workoutsCompleted,
        mealsLogged: localContext.todaysProgress.mealsLogged,
      },
      // PRESERVE recent entries from Appwrite database
      recentEntries: {
        workouts: localContext.recentEntries.workouts,
        nutrition: localContext.recentEntries.nutrition,
        feedback: mcpContext.recentEntries?.feedback || [],
      },
      // USE MCP plan if available, otherwise use Appwrite database plan
      currentPlan: mcpContext.currentPlan || localContext.currentPlan,
    }
    
    return NextResponse.json(mergedContext)
  } catch (error) {
    console.error('Error fetching context:', error)
    
    // Return Appwrite data as ultimate fallback
    const localContext = await generateFallbackContext(userId)
    return NextResponse.json(localContext)
  }
}

function transformMcpContextToFrontend(mcpContextText: string, userId: string) {
  return {
    userId,
    currentTargets: {
      calorieGoal: 2000,
      workoutMinutesGoal: 60,
      stepsGoal: 10000,
    },
    todaysProgress: {
      workoutMinutes: 0,
      caloriesConsumed: 0,
      stepsTaken: 0,
      workoutsCompleted: 0,
      mealsLogged: 0,
    },
    recentEntries: {
      workouts: [],
      nutrition: [],
      feedback: [],
    },
    currentPlan: null,
  }
}

async function generateFallbackContext(userId: string) {
  try {
    // 1. Fetch workouts
    const workoutsRes = await serverDatabases.listDocuments(
      databaseId,
      'workouts',
      [
        Query.equal('userId', userId),
        Query.orderDesc('timestamp'),
        Query.limit(50)
      ]
    )
    const userWorkouts = workoutsRes.documents.map((w: any) => ({
      id: w.$id,
      timestamp: w.timestamp,
      type: w.type,
      name: w.name,
      duration: w.duration,
      sets: w.sets,
      reps: w.reps,
      weight: w.weight,
      distance: w.distance,
      caloriesBurned: w.caloriesBurned,
      completed: w.completed
    }))

    // 2. Fetch nutrition
    const nutritionRes = await serverDatabases.listDocuments(
      databaseId,
      'nutrition',
      [
        Query.equal('userId', userId),
        Query.orderDesc('timestamp'),
        Query.limit(50)
      ]
    )
    const userNutrition = nutritionRes.documents.map((n: any) => ({
      id: n.$id,
      timestamp: n.timestamp,
      mealType: n.mealType,
      foodItem: n.foodItem,
      calories: n.calories,
      protein: n.protein,
      carbs: n.carbs,
      fat: n.fat
    }))

    // 3. Fetch activities
    const activitiesRes = await serverDatabases.listDocuments(
      databaseId,
      'activities',
      [
        Query.equal('userId', userId),
        Query.orderDesc('timestamp'),
        Query.limit(100)
      ]
    )
    const userActivities = activitiesRes.documents

    // 4. Fetch plans
    const plansRes = await serverDatabases.listDocuments(
      databaseId,
      'plans',
      [
        Query.equal('userId', userId),
        Query.orderDesc('updatedAt'),
        Query.limit(1)
      ]
    )
    
    let userPlan = null
    if (plansRes.documents.length > 0) {
      try {
        userPlan = JSON.parse(plansRes.documents[0].structuredPlan)
      } catch (err) {
        console.error('Failed to parse saved plan JSON:', err)
      }
    }

    // Seed default plan for new/default users if none exists
    if (!userPlan && userId === 'default-user') {
      try {
        await serverDatabases.createDocument(
          databaseId,
          'plans',
          ID.unique(),
          {
            userId: 'default-user',
            structuredPlan: JSON.stringify(mirnaPlan),
            updatedAt: new Date().toISOString()
          }
        )
        userPlan = mirnaPlan
        console.log('🌱 Successfully seeded default Mirna plan in Appwrite')
      } catch (err) {
        console.error('Failed to seed default plan in Appwrite:', err)
        userPlan = mirnaPlan // Fallback in-memory
      }
    }

    // Calculate totals from actual stored data only
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
        stepsTaken: stepsTaken || 0,
        workoutsCompleted: userWorkouts.length,
        mealsLogged: userNutrition.length,
      },
      recentEntries: {
        workouts: userWorkouts.slice(-5), // Last 5 workouts
        nutrition: userNutrition.slice(-5), // Last 5 meals
        feedback: [],
      },
      currentPlan: userPlan,
    }
  } catch (err) {
    console.error('Error loading fallback context from Appwrite:', err)
    return {
      userId,
      currentTargets: { calorieGoal: 2000, workoutMinutesGoal: 60, stepsGoal: 10000 },
      todaysProgress: { workoutMinutes: 0, caloriesConsumed: 0, stepsTaken: 0, workoutsCompleted: 0, mealsLogged: 0 },
      recentEntries: { workouts: [], nutrition: [], feedback: [] },
      currentPlan: mirnaPlan
    }
  }
}