import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, databaseId } from '@/lib/appwrite-server'
import { Query, ID } from 'node-appwrite'

export async function POST(request: NextRequest) {
  let userId: string | undefined;
  
  try {
    const { userId: requestUserId, planType = 'daily', userMessage = '', customPlan = null, customMeals = null } = await request.json()
    userId = requestUserId; // Capture userId for use in catch block

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Retrieve existing plan from Appwrite Databases if any, to allow merging
    let existingPlan = { workouts: [], meals: [], recommendations: [] };
    try {
      const existing = await serverDatabases.listDocuments(
        databaseId,
        'plans',
        [Query.equal('userId', userId), Query.limit(1)]
      );
      if (existing.documents.length > 0) {
        existingPlan = JSON.parse(existing.documents[0].structuredPlan);
      }
    } catch (err) {
      console.log('No existing plan found for merge, starting fresh.');
    }

    // If we have custom exercises or meals, merge and store them
    if (customPlan || customMeals) {
      console.log('📋 Merging custom workouts/meals into active Appwrite plan:', { workouts: !!customPlan, meals: !!customMeals })
      
      const planText = generateContextualPlanText(planType, userMessage)
      const structuredPlan = {
        workouts: customPlan ? customPlan.map((exercise: any, index: number) => ({
          id: (index + 1).toString(),
          name: exercise.name,
          type: exercise.type || 'strength',
          sets: parseInt(exercise.sets) || 3,
          reps: exercise.reps ? parseInt(exercise.reps) : (exercise.duration ? 1 : 10),
          weight: exercise.weight || undefined,
          duration: exercise.duration ? (exercise.duration.includes('s') ? parseInt(exercise.duration) : parseInt(exercise.duration) * 60) : exercise.estimatedDuration || undefined,
          completed: false,
          day: exercise.day || 1,
          note: exercise.note || undefined,
          img: exercise.img || undefined,
        })) : existingPlan.workouts,
        
        meals: customMeals ? customMeals.map((meal: any, index: number) => ({
          id: (index + 1).toString(),
          mealType: meal.mealType || 'snack',
          name: meal.name,
          calories: parseInt(meal.calories) || 300,
          protein: parseInt(meal.protein) || 20,
          carbs: parseInt(meal.carbs) || 30,
          fat: parseInt(meal.fat) || 10,
          time: meal.time || '12:00 PM',
          completed: false,
        })) : existingPlan.meals,
        
        recommendations: [
          'Focus on proper form over speed',
          'Rest 30-60 seconds between sets',
          'Stay hydrated throughout your workout',
          'Listen to your body and modify as needed'
        ]
      }

      // Store the plan in Appwrite Database
      await savePlanToAppwrite(userId, structuredPlan)
      
      return NextResponse.json({
        success: true,
        planText,
        structuredPlan,
      })
    }

    // Call the MCP plan generator tool
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
          name: 'generate-plan',
          arguments: {
            userId,
            planType,
          },
        },
      }),
    })

    if (!mcpResponse.ok) {
      const errorText = await mcpResponse.text()
      throw new Error(`MCP call failed: ${mcpResponse.status} ${mcpResponse.statusText} - ${errorText}`)
    }

    const responseText = await mcpResponse.text()
    console.log('✅ MCP plan generation successful:', responseText)
    
    // Parse the Server-Sent Events format to extract the plan text
    let planText = generateContextualPlanText(planType, userMessage)
    const dataMatch = responseText.match(/data: (.+)/)
    if (dataMatch) {
      try {
        const data = JSON.parse(dataMatch[1])
        if (data.error) {
          throw new Error(`MCP tool error: ${data.error.message}`)
        }
        planText = data.result?.content?.[0]?.text || planText
      } catch (parseError) {
        console.log('Could not parse MCP response, using default plan text')
      }
    }
    
    // Generate structured plan data  
    const structuredPlan = generateStructuredPlan(planText, userId, planType)

    // Store the plan in Appwrite Database
    await savePlanToAppwrite(userId, structuredPlan)

    return NextResponse.json({
      success: true,
      planText,
      structuredPlan,
    })
  } catch (error) {
    console.error('Error generating plan:', error)
    
    // Return fallback plan based on plan type
    const fallbackPlan = generateFallbackPlan('workout', '')
    
    // Store the fallback plan as well
    if (userId) {
      await savePlanToAppwrite(userId, fallbackPlan.structuredPlan)
    }
    
    return NextResponse.json(fallbackPlan)
  }
}

async function savePlanToAppwrite(userId: string, structuredPlan: any) {
  try {
    // 1. Delete existing plans for this user to keep only the latest one
    const existing = await serverDatabases.listDocuments(
      databaseId,
      'plans',
      [Query.equal('userId', userId)]
    );
    for (const doc of existing.documents) {
      await serverDatabases.deleteDocument(databaseId, 'plans', doc.$id);
    }
    
    // 2. Create the new plan document
    await serverDatabases.createDocument(
      databaseId,
      'plans',
      ID.unique(),
      {
        userId,
        structuredPlan: JSON.stringify(structuredPlan),
        updatedAt: new Date().toISOString()
      }
    );
    console.log(`✅ Saved new Appwrite plan for ${userId}`)
  } catch (err) {
    console.error('Failed to save plan in Appwrite:', err)
  }
}

function generateContextualPlanText(planType: string, userMessage: string): string {
  if (planType === 'nutrition') {
    return `🍽️ Perfect! I've analyzed your current activity and created a personalized meal plan that will fuel your workouts and support your fitness goals. This plan focuses on balanced nutrition with optimal macros for energy and recovery.`
  } else if (planType === 'workout') {
    return `💪 Excellent! I've designed a workout plan tailored to your current fitness level and goals. This routine will help you build strength, improve cardiovascular health, and maintain consistency in your fitness journey.`
  } else {
    return `🎯 Fantastic! I've created a comprehensive fitness plan that includes both workouts and nutrition guidance. This holistic approach will help you achieve your goals more effectively by combining proper training with optimal nutrition.`
  }
}

function generateFallbackPlan(planType: string, userMessage: string) {
  if (planType === 'nutrition') {
    return {
      planText: generateContextualPlanText(planType, userMessage),
      structuredPlan: {
        workouts: [],
        meals: [
          {
            id: '1',
            mealType: 'breakfast',
            name: 'Protein-packed oatmeal with berries and almonds',
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 8,
            time: '8:00 AM',
          },
          {
            id: '2',
            mealType: 'lunch',
            name: 'Grilled chicken Caesar salad',
            calories: 450,
            protein: 35,
            carbs: 15,
            fat: 22,
            time: '12:30 PM',
          },
          {
            id: '3',
            mealType: 'snack',
            name: 'Greek yogurt with honey',
            calories: 150,
            protein: 15,
            carbs: 18,
            fat: 3,
            time: '3:00 PM',
          },
          {
            id: '4',
            mealType: 'dinner',
            name: 'Baked salmon with quinoa & broccoli',
            calories: 520,
            protein: 40,
            carbs: 35,
            fat: 18,
            time: '7:00 PM',
          },
        ],
        recommendations: [
          'Drink water before each meal to aid digestion',
          'Include protein in every meal for muscle recovery',
          'Eat colorful vegetables for essential micronutrients',
        ],
      },
    }
  } else {
    return {
      planText: generateContextualPlanText(planType, userMessage),
      structuredPlan: {
        workouts: [
          {
            id: '1',
            name: 'Push-ups',
            type: 'strength' as const,
            sets: 3,
            reps: 12,
            completed: false,
          },
          {
            id: '2',
            name: 'Squats',
            type: 'strength' as const,
            sets: 3,
            reps: 15,
            weight: 'bodyweight',
            completed: false,
          },
          {
            id: '3',
            name: 'Plank',
            type: 'strength' as const,
            sets: 3,
            reps: 1,
            duration: 30,
            completed: false,
          },
          {
            id: '4',
            name: 'Light cardio walk',
            type: 'cardio' as const,
            sets: 1,
            reps: 1,
            duration: 20,
            completed: false,
          },
        ],
        meals: [],
        recommendations: [
          'Warm up for 5 minutes before starting exercises',
          'Focus on proper form rather than speed',
          'Rest 30-60 seconds between sets',
        ],
      },
    }
  }
}

function generateStructuredPlan(planText: string, userId: string, planType: string) {
  if (planType === 'nutrition') {
    return generateFallbackPlan(planType, '').structuredPlan
  } else {
    return generateFallbackPlan('workout', '').structuredPlan
  }
}