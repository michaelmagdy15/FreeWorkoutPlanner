import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, databaseId } from '@/lib/appwrite-server'
import { ID, Query } from 'node-appwrite'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId') || 'default-user'
  
  if (action === 'debug') {
    try {
      const workoutsRes = await serverDatabases.listDocuments(databaseId, 'workouts', [Query.equal('userId', userId), Query.limit(100)]);
      const nutritionRes = await serverDatabases.listDocuments(databaseId, 'nutrition', [Query.equal('userId', userId), Query.limit(100)]);
      const activitiesRes = await serverDatabases.listDocuments(databaseId, 'activities', [Query.equal('userId', userId), Query.limit(100)]);
      
      const userWorkouts = workoutsRes.documents;
      const userNutrition = nutritionRes.documents;
      const userActivities = activitiesRes.documents;
      
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
      });
    } catch (err) {
      console.error('Error in debug GET handler:', err);
      return NextResponse.json({ error: 'Failed to retrieve debug information' }, { status: 500 });
    }
  }
  
  if (action === 'testStore') {
    try {
      const testDoc = await serverDatabases.createDocument(
        databaseId,
        'workouts',
        ID.unique(),
        {
          userId: 'test',
          name: 'Test Setup Workout',
          type: 'cardio',
          duration: 5,
          completed: false,
          timestamp: new Date().toISOString()
        }
      );
      
      await serverDatabases.deleteDocument(databaseId, 'workouts', testDoc.$id);
      
      return NextResponse.json({
        working: true,
        message: 'Successfully verified connection to Appwrite'
      });
    } catch (err) {
      console.error('Test store connection failed:', err);
      return NextResponse.json({
        working: false,
        error: err instanceof Error ? err.message : 'Unknown Appwrite error'
      });
    }
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
        // Activities like steps, water, sleep, weight - store in Appwrite Databases
        console.log('💾 Storing activity in Appwrite Databases...')
        await storeActivityInAppwrite(userId, entryData)
        return NextResponse.json({ 
          success: true, 
          message: 'Activity logged successfully',
          stored: 'appwrite'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid entryType. Must be workout, nutrition, feedback, or activity' },
          { status: 400 }
        )
    }

    // Store data in Appwrite Database FIRST
    console.log('💾 Storing data in Appwrite Database...')
    await storeDataInAppwrite(userId, entryType, entryData)

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
      console.error('MCP failed, but data already stored in Appwrite:', error)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Entry logged in Appwrite (MCP tool execution skipped/failed)',
        stored: 'appwrite'
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

async function storeDataInAppwrite(userId: string, entryType: string, entryData: any) {
  const timestamp = new Date().toISOString()

  if (entryType === 'workout' && entryData.workout) {
    const workoutEntry = {
      userId,
      type: entryData.workout.type || 'strength',
      name: entryData.workout.name || 'Unknown Exercise',
      duration: entryData.workout.duration || 30,
      sets: entryData.workout.sets || null,
      reps: entryData.workout.reps || null,
      weight: entryData.workout.weight || null,
      distance: entryData.workout.distance || null,
      caloriesBurned: entryData.workout.caloriesBurned || null,
      completed: true,
      timestamp: entryData.workout.timestamp || timestamp,
    }
    await serverDatabases.createDocument(databaseId, 'workouts', ID.unique(), workoutEntry)
    console.log(`✅ Stored workout in Appwrite for ${userId}:`, workoutEntry)
  }

  if (entryType === 'nutrition' && entryData.nutrition) {
    const nutritionEntry = {
      userId,
      mealType: entryData.nutrition.mealType || 'snack',
      foodItem: entryData.nutrition.foodItem || 'Unknown Food',
      calories: entryData.nutrition.calories || 0,
      protein: entryData.nutrition.protein || null,
      carbs: entryData.nutrition.carbs || null,
      fat: entryData.nutrition.fat || null,
      timestamp: entryData.nutrition.timestamp || timestamp,
    }
    await serverDatabases.createDocument(databaseId, 'nutrition', ID.unique(), nutritionEntry)
    console.log(`✅ Stored nutrition in Appwrite for ${userId}:`, nutritionEntry)
  }

  if (entryType === 'feedback' && entryData.feedback) {
    const feedbackEntry = {
      userId,
      type: entryData.feedback.type || 'progress',
      notes: entryData.feedback.notes || '',
      rating: entryData.feedback.rating || null,
      timestamp: entryData.feedback.timestamp || timestamp,
    }
    await serverDatabases.createDocument(databaseId, 'feedback', ID.unique(), feedbackEntry)
    console.log(`✅ Stored feedback in Appwrite for ${userId}:`, feedbackEntry)
  }
}

async function storeActivityInAppwrite(userId: string, entryData: any) {
  const timestamp = new Date().toISOString()

  if (entryData.activity) {
    const activityEntry = {
      userId,
      type: entryData.activity.type,
      count: entryData.activity.count || null,
      amount: entryData.activity.amount || null,
      duration: entryData.activity.duration || null,
      value: entryData.activity.value || null,
      unit: entryData.activity.unit || 'units',
      timestamp: entryData.activity.timestamp || timestamp,
    }
    await serverDatabases.createDocument(databaseId, 'activities', ID.unique(), activityEntry)
    console.log(`✅ Stored activity in Appwrite for ${userId}:`, activityEntry)
  }
}