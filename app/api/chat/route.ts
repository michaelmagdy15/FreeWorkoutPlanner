import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context, userId = 'default-user' } = await request.json()

    // Detect user intent and route to appropriate handler
    const intent = detectUserIntent(message)
    
    let response
    let toolUsed = null
    let structuredData = null

    switch (intent.type) {
      case 'log_activity':
        const logResult = await handleActivityLogging(message, userId, intent)
        response = logResult.response
        toolUsed = 'workout-logger'
        structuredData = logResult.structuredData
        break
        
      case 'log_nutrition':
        const nutritionResult = await handleNutritionLogging(message, userId, intent)
        response = nutritionResult.response
        toolUsed = 'nutrition-logger'
        structuredData = nutritionResult.structuredData
        break
        
      case 'generate_plan':
        const planResult = await handlePlanGeneration(message, userId, intent)
        response = planResult.response
        toolUsed = 'plan-generator'
        structuredData = planResult.structuredData
        break
        
      case 'general_chat':
      default:
        response = await handleGeneralChat(message, context, userId)
        toolUsed = 'context-viewer'
        break
    }

    return NextResponse.json({ 
      response, 
      toolUsed,
      structuredData,
      intent: intent.type
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        response: "I'm sorry, I'm having trouble right now. Please try again in a moment! 😊"
      },
      { status: 500 }
    )
  }
}

function detectUserIntent(message: string) {
  const lowerMessage = message.toLowerCase()
  
  // Activity logging patterns
  const activityPatterns = [
    /i (did|completed|finished|ran|walked|jogged|exercised|worked out)/,
    /logged?\s*(workout|exercise|activity|training|run|walk|jog)/,
    /(just|recently) (did|completed|finished|ran|walked|exercised)/,
    /(\d+)\s*(minutes?|mins?|hours?|hrs?)\s*(of|running|walking|exercising)/,
    /(ran|walked|jogged|exercised)\s*(\d+)/,
    /did\s*(\d+)\s*(push.?ups|squats|planks|lunges|burpees)/,
    /(completed|finished)\s*(my\s*)?(workout|exercise|training)/
  ]
  
  // Plan generation patterns (expanded and more specific)
  const planPatterns = [
    // Explicit plan requests
    /(suggest|create|generate|make|design|build)\s*(me\s*)?(a\s*)?(workout|meal|exercise|nutrition|training|diet|fitness)\s*plan/,
    /(give|show)\s*me\s*(a\s*)?(workout|meal|exercise|nutrition|fitness)\s*(plan|routine|schedule)/,
    /(help|assist)\s*me\s*(with\s*)?(planning|creating)\s*(workout|meal|exercise|nutrition)/,
    
    // Time-specific plan requests
    /plan\s*(for\s*)?(tomorrow|today|next\s*week|this\s*week|weekly|daily)/,
    /(tomorrow|today|next\s*week|this\s*week|weekly|daily)\s*(workout|meal|exercise|nutrition)\s*(plan|routine)/,
    /(tomorrow|today)\s*('?s)?\s*(workout|meal|exercise|plan)/,
    
    // Context-based plan requests
    /based\s*on\s*(today|my|yesterday)\s*(workout|activity|training)/,
    /(create|generate|make)\s*(a\s*)?(plan|routine|workout|schedule)/,
    /plan\s*(my\s*)?(day|week|workout|meals)/,
    
    // Question-based plan requests
    /(what|how)\s*(should|can)\s*i\s*(eat|workout|exercise|train)\s*(today|tomorrow|this\s*week)?/,
    
    // Weekly specific patterns
    /weekly\s*(workout|exercise|training|fitness|meal|nutrition)\s*(plan|routine|schedule)/,
    /(workout|exercise|training|fitness|meal|nutrition)\s*plan\s*(for\s*)?(week|weekly)/,
    /plan\s*(for\s*)?the\s*week/
  ]
  
  // Nutrition logging patterns (more specific to avoid catching plan requests)
  const nutritionPatterns = [
    /i (ate|had|consumed|drank)\s+(?!.*plan)/,  // Exclude if "plan" appears after
    /(just|recently) (ate|had|consumed)\s+(?!.*plan)/,
    /logged?\s*(meal|food|breakfast|lunch|dinner|snack)\s+(?!.*plan)/,
    /(had|ate)\s*(breakfast|lunch|dinner|snack)\s+(?!.*plan)/,
    /(consumed|drank)\s*(\d+)\s*calories/,
    /ate\s*(some|a|an)\s*\w+\s+(?!.*plan)/,
    // Only match if it's clearly about consuming food, not planning
    /^(?!.*(plan|create|generate|suggest|make|design)).*\b(ate|had|consumed|breakfast|lunch|dinner|snack)\b/
  ]

  // Check for plan generation FIRST (before nutrition/activity logging)
  if (planPatterns.some(pattern => pattern.test(lowerMessage))) {
    console.log('🎯 Detected plan generation intent:', message)
    return {
      type: 'generate_plan',
      confidence: 0.9,
      extractedData: extractPlanData(message)
    }
  }
  
  // Check for activity logging
  if (activityPatterns.some(pattern => pattern.test(lowerMessage))) {
    return {
      type: 'log_activity',
      confidence: 0.8,
      extractedData: extractActivityData(message)
    }
  }
  
  // Check for nutrition logging (only if not a plan request)
  if (nutritionPatterns.some(pattern => pattern.test(lowerMessage))) {
    return {
      type: 'log_nutrition', 
      confidence: 0.8,
      extractedData: extractNutritionData(message)
    }
  }
  
  return {
    type: 'general_chat',
    confidence: 0.5,
    extractedData: null
  }
}

function extractActivityData(message: string) {
  const lowerMessage = message.toLowerCase()
  
  // Extract duration
  const durationMatch = message.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/i)
  const duration = durationMatch ? 
    (durationMatch[2].toLowerCase().includes('hour') ? 
      parseInt(durationMatch[1]) * 60 : parseInt(durationMatch[1])) : null
  
  // Extract exercise type
  const exerciseTypes = ['push-ups', 'pushups', 'push ups', 'squats', 'plank', 'planks', 'lunges', 'burpees', 'running', 'walking', 'jogging', 'cycling', 'swimming', 'pullups', 'pull-ups', 'pull ups']
  const detectedExercise = exerciseTypes.find(exercise => {
    const exercisePattern = exercise.toLowerCase()
    return lowerMessage.includes(exercisePattern) || 
           lowerMessage.includes(exercisePattern.replace('-', ' ')) ||
           lowerMessage.includes(exercisePattern.replace(' ', ''))
  })
  
  // Normalize exercise name
  let normalizedExercise = detectedExercise
  if (detectedExercise) {
    if (detectedExercise.includes('push') || detectedExercise.includes('Push')) {
      normalizedExercise = 'Push-ups'
    } else if (detectedExercise.includes('squat')) {
      normalizedExercise = 'Squats'
    } else if (detectedExercise.includes('plank')) {
      normalizedExercise = 'Plank'
    } else if (detectedExercise.includes('lunge')) {
      normalizedExercise = 'Lunges'
    } else if (detectedExercise.includes('pull')) {
      normalizedExercise = 'Pull-ups'
    } else if (detectedExercise.includes('burpee')) {
      normalizedExercise = 'Burpees'
    } else {
      normalizedExercise = detectedExercise.charAt(0).toUpperCase() + detectedExercise.slice(1)
    }
  }
  
  // Extract sets/reps
  const setsMatch = message.match(/(\d+)\s*sets?/i)
  const repsMatch = message.match(/(\d+)\s*(reps?|repetitions?)/i) || 
                    message.match(/(\d+)\s*(push.?ups|squats|lunges|burpees)/i)
  
  return {
    exercise: normalizedExercise,
    duration,
    sets: setsMatch ? parseInt(setsMatch[1]) : null,
    reps: repsMatch ? parseInt(repsMatch[1]) : null,
    rawMessage: message
  }
}

function extractNutritionData(message: string) {
  const lowerMessage = message.toLowerCase()
  
  // Extract meal type
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
  const mealType = mealTypes.find(meal => lowerMessage.includes(meal))
  
  // Extract food items (simple pattern matching)
  const foodKeywords = ['oatmeal', 'eggs', 'chicken', 'salad', 'rice', 'pasta', 'bread', 'fruit', 'yogurt', 'sandwich']
  const detectedFoods = foodKeywords.filter(food => lowerMessage.includes(food))
  
  // Extract calories
  const calorieMatch = message.match(/(\d+)\s*cal(ories?)?/i)
  const calories = calorieMatch ? parseInt(calorieMatch[1]) : null
  
  return {
    mealType,
    foods: detectedFoods,
    calories,
    rawMessage: message
  }
}

function extractPlanData(message: string) {
  const lowerMessage = message.toLowerCase()
  
  // Determine plan scope
  let planScope = 'daily' // default
  if (lowerMessage.includes('week') || lowerMessage.includes('weekly')) {
    planScope = 'weekly'
  } else if (lowerMessage.includes('tomorrow')) {
    planScope = 'tomorrow'
  } else if (lowerMessage.includes('today')) {
    planScope = 'today'
  }
  
  // Determine plan type
  const planType = lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('training') || lowerMessage.includes('fitness')
    ? 'workout' 
    : lowerMessage.includes('meal') || lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food')
    ? 'nutrition'
    : 'full'
    
  return {
    planType,
    planScope,
    rawMessage: message
  }
}

async function handleActivityLogging(message: string, userId: string, intent: any) {
  try {
    const extracted = intent.extractedData
    
    // Prepare workout data for MCP call
    const workoutData = {
      type: extracted.exercise && ['Push-ups', 'Squats', 'Plank', 'Lunges', 'Pull-ups', 'Burpees'].includes(extracted.exercise) ? 'strength' : 'cardio',
      name: extracted.exercise || 'General Exercise',
      duration: extracted.duration || 15, // Default 15 minutes
      sets: extracted.sets || 3,
      reps: extracted.reps || 10,
    }
    
    // Call MCP log endpoint
    const mcpResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/mcp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'log-workout',
          arguments: {
            userId,
            date: new Date().toISOString().split('T')[0],
            type: workoutData.name,
            duration: workoutData.duration
          }
        }
      })
    })
    
    if (mcpResponse.ok) {
      const responseText = await mcpResponse.text()
      console.log('✅ MCP workout logging successful:', responseText)
      
      // Also store to local stores for UI consistency
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            entryType: 'workout',
            entryData: {
              workout: workoutData
            }
          })
        })
        console.log('✅ Also stored to local stores for UI consistency')
      } catch (localStoreError) {
        console.warn('⚠️ Could not store to local stores, but MCP logging succeeded')
      }
      
      return {
        response: `🎉 Awesome! I've logged your ${workoutData.name.toLowerCase()} workout (${workoutData.duration} minutes). ${generateEncouragingMessage(workoutData)} Keep up the fantastic work! 💪`,
        structuredData: {
          type: 'workout_logged',
          workout: workoutData,
          refreshContext: true
        }
      }
    } else {
      const errorText = await mcpResponse.text()
      console.error('MCP workout logging failed:', errorText)
      throw new Error(`MCP call failed: ${mcpResponse.status} ${mcpResponse.statusText}`)
    }
    
  } catch (error) {
    console.error('Error logging workout:', error)
    
    // Fallback to direct API call
    try {
      const fallbackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          entryType: 'workout',
          entryData: {
            workout: {
              type: intent.extractedData.exercise && ['Push-ups', 'Squats', 'Plank', 'Lunges', 'Pull-ups', 'Burpees'].includes(intent.extractedData.exercise) ? 'strength' : 'cardio',
              name: intent.extractedData.exercise || 'General Exercise',
              duration: intent.extractedData.duration || 15,
              sets: intent.extractedData.sets || 3,
              reps: intent.extractedData.reps || 10,
            }
          }
        })
      })
      
      if (fallbackResponse.ok) {
        return {
          response: `✅ Great job! I've logged your workout. You're making excellent progress! 🌟`,
          structuredData: { type: 'workout_logged', refreshContext: true }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback logging failed:', fallbackError)
    }
    
    return {
      response: `I heard you completed a workout - that's fantastic! 🎉 While I'm having trouble logging it right now, every workout counts toward your goals. Keep up the amazing work! 💪`,
      structuredData: null
    }
  }
}

async function handleNutritionLogging(message: string, userId: string, intent: any) {
  try {
    const extracted = intent.extractedData
    
    // Prepare nutrition data for MCP call
    const nutritionData = {
      mealType: extracted.mealType || 'snack',
      foodItem: extracted.foods.length > 0 ? extracted.foods[0] : 'Mixed meal',
      calories: extracted.calories || 300,
      protein: 15,
      carbs: 30,
      fat: 10
    }
    
    // Call MCP nutrition log endpoint
    const mcpResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/mcp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'log-nutrition',
          arguments: {
            userId,
            date: new Date().toISOString().split('T')[0],
            meal: nutritionData.mealType,
            items: [nutritionData.foodItem],
            calories: nutritionData.calories
          }
        }
      })
    })
    
    if (mcpResponse.ok) {
      const responseText = await mcpResponse.text()
      console.log('✅ MCP nutrition logging successful:', responseText)
      
      // Also store to local stores for UI consistency
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            entryType: 'nutrition',
            entryData: {
              nutrition: nutritionData
            }
          })
        })
        console.log('✅ Also stored to local stores for UI consistency')
      } catch (localStoreError) {
        console.warn('⚠️ Could not store to local stores, but MCP logging succeeded')
      }
      
      return {
        response: `🍽️ Perfect! I've logged your ${nutritionData.mealType} (${nutritionData.calories} calories). ${generateNutritionEncouragement(nutritionData)} Stay consistent with your nutrition! 🥗`,
        structuredData: {
          type: 'nutrition_logged',
          nutrition: nutritionData,
          refreshContext: true
        }
      }
    } else {
      const errorText = await mcpResponse.text()
      console.error('MCP nutrition logging failed:', errorText)
      throw new Error(`MCP call failed: ${mcpResponse.status} ${mcpResponse.statusText}`)
    }
    
  } catch (error) {
    console.error('Error logging nutrition:', error)
    
    // Fallback to direct API call
    try {
      const fallbackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          entryType: 'nutrition',
          entryData: {
            nutrition: {
              mealType: intent.extractedData.mealType || 'snack',
              foodItem: intent.extractedData.foods.length > 0 ? intent.extractedData.foods[0] : 'Mixed meal',
              calories: intent.extractedData.calories || 300,
              protein: 15,
              carbs: 30,
              fat: 10
            }
          }
        })
      })
      
      if (fallbackResponse.ok) {
        return {
          response: `✅ Perfect! I've logged your ${intent.extractedData.mealType || 'snack'} (${intent.extractedData.calories || 300} calories). You're making great nutrition choices! 🥗`,
          structuredData: { type: 'nutrition_logged', refreshContext: true }
        }
      }
    } catch (fallbackError) {
      console.error('Nutrition logging fallback failed:', fallbackError)
    }
    
    // Final fallback response
    return {
      response: `Great job tracking your nutrition! 🍎 Every meal choice matters for your fitness goals. Keep making those healthy choices! 🌟`,
      structuredData: null
    }
  }
}

async function handlePlanGeneration(message: string, userId: string, intent: any) {
  try {
    const extracted = intent.extractedData
    console.log('🔄 Generating plan:', extracted.planType, 'scope:', extracted.planScope, 'for user:', userId)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('⚠️ OpenAI API key not configured, using smart fallback')
      if (extracted.planType === 'nutrition') {
        return await generateSmartMealPlan(message, userId, intent, new Error('OpenAI API key not configured'))
      } else {
        return await generateSmartWorkoutPlan(message, userId, intent, new Error('OpenAI API key not configured'))
      }
    }
    
    // Get current user context to analyze workouts
    let userContext = null
    try {
      const contextResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/context?userId=${userId}`)
      if (contextResponse.ok) {
        userContext = await contextResponse.json()
        console.log('📊 User context for plan generation:', userContext)
      }
    } catch (contextError) {
      console.log('⚠️ Could not fetch user context:', contextError)
    }
    
    // For weekly plans or when MCP should handle it, call MCP
    if (extracted.planScope === 'weekly' || (!extracted.planScope || extracted.planScope === 'daily')) {
      // Call MCP plan generation endpoint for full/weekly plans
      const mcpResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/mcp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'generate-plan',
            arguments: {
              userId
            }
          }
        })
      })
      
      if (mcpResponse.ok) {
        const responseText = await mcpResponse.text()
        console.log('✅ MCP plan generation successful:', responseText)
        
        // Parse the Server-Sent Events format to extract the plan text
        let planText = 'Plan generated successfully'
        const dataMatch = responseText.match(/data: (.+)/)
        if (dataMatch) {
          try {
            const data = JSON.parse(dataMatch[1])
            planText = data.result?.content?.[0]?.text || data.result || planText
          } catch (parseError) {
            console.log('Could not parse MCP response, using default message')
          }
        }
        
        // Customize response based on scope
        let scopeTitle = extracted.planScope === 'weekly' ? 'Weekly' : 'Personalized'
        
        return {
          response: `🎯 **AI-Generated ${scopeTitle} Plan**\n\n${planText}\n\n*This plan was created using AI analysis of your workout history and goals!* 🚀`,
          structuredData: {
            type: 'plan_generated',
            planType: extracted.planType,
            planScope: extracted.planScope,
            planData: planText,
            refreshContext: true
          }
        }
      } else {
        const errorData = await mcpResponse.text()
        console.error('MCP call failed:', errorData)
        throw new Error(`MCP call failed: ${mcpResponse.status} ${mcpResponse.statusText}`)
      }
    } else {
      // For tomorrow/today specific plans, use smart generators directly
      if (extracted.planType === 'nutrition') {
        return await generateSmartMealPlan(message, userId, intent, null)
      } else {
        return await generateSmartWorkoutPlan(message, userId, intent, null)
      }
    }
    
  } catch (error) {
    console.error('Error generating plan via MCP:', error)
    
    // Smart fallback plan generation based on plan type
    if (intent.extractedData.planType === 'nutrition') {
      return await generateSmartMealPlan(message, userId, intent, error)
    } else {
      return await generateSmartWorkoutPlan(message, userId, intent, error)
    }
  }
}

async function generateSmartWorkoutPlan(message: string, userId: string, intent: any, originalError: any) {
  try {
    console.log('🧠 Generating smart workout plan based on user context')
    
    // Check if this is due to missing OpenAI API key
    const isOpenAIError = originalError?.message?.includes('OpenAI API key not configured')
    
    // Get user's current workout context
    const contextResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/context?userId=${userId}`)
    let userContext = null
    let todaysWorkouts: any[] = []
    
    if (contextResponse.ok) {
      userContext = await contextResponse.json()
      todaysWorkouts = userContext?.recentEntries?.workouts || []
      console.log('📋 Today\'s completed workouts:', todaysWorkouts)
      console.log('📊 Today\'s progress:', userContext?.todaysProgress)
    }
    
    // Analyze today's workouts to create plan
    const completedExercises = todaysWorkouts.map(w => w.name.toLowerCase())
    const totalMinutesToday = todaysWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
    
    console.log('💪 Completed exercises today:', completedExercises)
    console.log('⏱️ Total workout time today:', totalMinutesToday, 'minutes')
    console.log('📈 Context workout minutes:', userContext?.todaysProgress?.workoutMinutes)
    
    // Create a smart plan based on what they've done
    let planResponse = ''
    let newWorkoutPlan = []
    const planScope = intent.extractedData?.planScope || 'daily'
    
    if (planScope === 'tomorrow') {
      // Tomorrow's plan based on today's activity
      const strengthExercises = ['Push-ups', 'Squats', 'Plank', 'Lunges', 'Pull-ups']
      const cardioExercises = ['Running', 'Cycling', 'Jumping Jacks', 'Burpees']
      
      // Check what muscle groups were worked today
      const workedToday = {
        pushMovements: completedExercises.some(ex => 
          ex.includes('push') || ex.includes('Push') || ex.includes('chest') || ex.includes('press')
        ),
        legMovements: completedExercises.some(ex => 
          ex.includes('squat') || ex.includes('Squat') || ex.includes('lunge') || ex.includes('Lunge') || ex.includes('leg')
        ),
        core: completedExercises.some(ex => 
          ex.includes('plank') || ex.includes('Plank') || ex.includes('abs') || ex.includes('core')
        ),
        cardio: completedExercises.some(ex => 
          ['running', 'cycling', 'jumping', 'burpee', 'cardio', 'run', 'jog', 'walk'].some(c => ex.includes(c))
        )
      }
      
      console.log('🎯 Muscle groups worked today:', workedToday)
      
      // Generate complementary exercises for tomorrow with variety
      const tomorrowExercises = []
      
      // Exercise pools for variety
      const pushExercises = [
        { name: 'Push-ups', sets: '3', reps: '12', estimatedDuration: 8 },
        { name: 'Incline Push-ups', sets: '3', reps: '10', estimatedDuration: 7 },
        { name: 'Diamond Push-ups', sets: '2', reps: '8', estimatedDuration: 6 }
      ]
      
      const pullExercises = [
        { name: 'Pull-ups', sets: '3', reps: '8', estimatedDuration: 10 },
        { name: 'Chin-ups', sets: '3', reps: '6', estimatedDuration: 9 },
        { name: 'Inverted Rows', sets: '3', reps: '10', estimatedDuration: 8 }
      ]
      
      const legExercises = [
        { name: 'Squats', sets: '4', reps: '12', weight: 'bodyweight', estimatedDuration: 10 },
        { name: 'Lunges', sets: '3', reps: '10', estimatedDuration: 8 },
        { name: 'Bulgarian Split Squats', sets: '3', reps: '8', estimatedDuration: 9 },
        { name: 'Jump Squats', sets: '3', reps: '10', estimatedDuration: 7 }
      ]
      
      const coreExercises = [
        { name: 'Plank', sets: '3', duration: '45s', estimatedDuration: 5 },
        { name: 'Mountain Climbers', sets: '3', reps: '20', estimatedDuration: 6 },
        { name: 'Dead Bug', sets: '3', reps: '10', estimatedDuration: 5 },
        { name: 'Russian Twists', sets: '3', reps: '15', estimatedDuration: 6 }
      ]
      
      const cardioVarietyExercises = [
        { name: 'Running', duration: '20min', type: 'cardio', estimatedDuration: 20 },
        { name: 'High Knees', sets: '4', duration: '30s', type: 'cardio', estimatedDuration: 8 },
        { name: 'Jumping Jacks', sets: '4', reps: '25', type: 'cardio', estimatedDuration: 8 },
        { name: 'Burpees', sets: '3', reps: '8', type: 'cardio', estimatedDuration: 10 }
      ]
      
      // Use date to add some randomness but keep it consistent for the same day
      const today = new Date()
      const dayIndex = today.getDay() // 0-6 for Sunday-Saturday
      
      // If did push movements today, add pull movements tomorrow
      if (workedToday.pushMovements) {
        const pullExercise = pullExercises[dayIndex % pullExercises.length]
        tomorrowExercises.push({ ...pullExercise, type: 'strength' })
      } else {
        // If no push movements today, add push movements tomorrow
        const pushExercise = pushExercises[dayIndex % pushExercises.length]
        tomorrowExercises.push({ ...pushExercise, type: 'strength' })
      }
      
      // If did leg work today, add different leg exercise or upper body
      if (workedToday.legMovements) {
        // Add different leg exercise
        const legExercise = legExercises[(dayIndex + 1) % legExercises.length]
        tomorrowExercises.push({ ...legExercise, type: 'strength' })
      } else {
        // If no leg work today, add leg work tomorrow
        const legExercise = legExercises[dayIndex % legExercises.length]
        tomorrowExercises.push({ ...legExercise, type: 'strength' })
      }
      
              if (workedToday.core) {
          // Add cardio since core was worked
          const cardioExercise = cardioVarietyExercises[dayIndex % cardioVarietyExercises.length]
          tomorrowExercises.push(cardioExercise)
        } else {
          const coreExercise = coreExercises[dayIndex % coreExercises.length]
          tomorrowExercises.push({ ...coreExercise, type: 'strength' })
        }
      
      // Add a challenge exercise (rotate based on day)
      const challengeExercises = [
        { name: 'Burpees', sets: '3', reps: '8', type: 'strength', estimatedDuration: 7 },
        { name: 'Jump Squats', sets: '3', reps: '12', type: 'strength', estimatedDuration: 6 },
        { name: 'Mountain Climbers', sets: '3', reps: '20', type: 'strength', estimatedDuration: 6 },
        { name: 'High Knees', sets: '3', duration: '30s', type: 'cardio', estimatedDuration: 5 }
      ]
      
      const challengeExercise = challengeExercises[dayIndex % challengeExercises.length]
      tomorrowExercises.push(challengeExercise)
      
      newWorkoutPlan = tomorrowExercises
      
      const actualMinutesToday = userContext?.todaysProgress?.workoutMinutes || totalMinutesToday
      
      // Add OpenAI configuration notice if needed
      const openaiNotice = isOpenAIError ? 
        `\n\n⚠️ **Note**: For fully personalized AI-generated plans, configure your OpenAI API key in \`.env.local\`\n` : 
        ``
      
      planResponse = `🌅 **Tomorrow's Workout Plan** - Based on your ${actualMinutesToday} minutes of training today!\n\n` +
        `I analyzed your today's workout (${completedExercises.length > 0 ? completedExercises.join(', ') : 'general exercise'}) and created a balanced plan:\n\n` +
        tomorrowExercises.map(ex => {
          let description = `💪 **${ex.name}**: `
          if ('sets' in ex && ex.sets) description += `${ex.sets} sets`
          if ('reps' in ex && ex.reps) description += ` × ${ex.reps} reps`
          if ('duration' in ex && ex.duration && !('sets' in ex)) description += ` for ${ex.duration}`
          else if ('duration' in ex && ex.duration) description += ` for ${ex.duration}`
          if ('weight' in ex && ex.weight) description += ` (${ex.weight})`
          return description
        }).join('\n') +
        `\n\n🎯 **Total estimated time**: ${tomorrowExercises.reduce((sum, ex) => sum + ex.estimatedDuration, 0)} minutes\n\n` +
        `This plan focuses on different muscle groups to give today's worked muscles time to recover while keeping you active! 🚀${openaiNotice}`
        
    } else {
      // General workout plan for today
      newWorkoutPlan = [
        {
          name: 'Push-ups',
          sets: '3',
          reps: '12',
          type: 'strength',
          estimatedDuration: 8
        },
        {
          name: 'Squats',
          sets: '3',
          reps: '15',
          weight: 'bodyweight',
          type: 'strength',
          estimatedDuration: 10
        },
        {
          name: 'Plank',
          sets: '3',
          duration: '30s',
          type: 'strength',
          estimatedDuration: 5
        },
        {
          name: 'Lunges',
          sets: '3',
          reps: '10',
          type: 'strength',
          estimatedDuration: 8
        }
      ]
      
      planResponse = `🏋️‍♂️ **Your Personalized Workout Plan**\n\n` +
        newWorkoutPlan.map(ex => 
          `💪 **${ex.name}**: ${ex.sets} sets × ${ex.reps || ex.duration} ${ex.weight ? `(${ex.weight})` : ''}`
        ).join('\n') +
        `\n\n🎯 **Total estimated time**: ${newWorkoutPlan.reduce((sum, ex) => sum + ex.estimatedDuration, 0)} minutes\n\n` +
        `Perfect for building strength and endurance! Check the right panel for your updated workout plan. 🚀`
    }
    
    // Try to update the plan via API
    try {
      const planUpdateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planType: 'workout',
          userMessage: message,
          customPlan: newWorkoutPlan
        })
      })
      
      if (planUpdateResponse.ok) {
        console.log('✅ Workout plan updated successfully')
      }
    } catch (planError) {
      console.log('⚠️ Could not update plan via API, but continuing with response')
    }
    
    return {
      response: planResponse,
      structuredData: {
        type: 'plan_generated',
        planType: 'workout',
        planData: newWorkoutPlan,
        refreshContext: true
      }
    }
    
  } catch (error) {
    console.error('Smart plan generation failed:', error)
    
    return {
      response: generateFallbackPlanResponse(intent.extractedData.planType),
      structuredData: null
    }
  }
}

async function generateSmartMealPlan(message: string, userId: string, intent: any, originalError: any) {
  try {
    console.log('🍽️ Generating smart meal plan based on user context')
    
    // Check if this is due to missing OpenAI API key
    const isOpenAIError = originalError?.message?.includes('OpenAI API key not configured')
    
    // Get user's current nutrition context
    const contextResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/context?userId=${userId}`)
    let userContext = null
    let todaysNutrition: any[] = []
    
    if (contextResponse.ok) {
      userContext = await contextResponse.json()
      todaysNutrition = userContext?.recentEntries?.nutrition || []
      console.log('🍽️ Today\'s nutrition entries:', todaysNutrition)
      console.log('📊 Today\'s progress:', userContext?.todaysProgress)
    }
    
    // Analyze today's meals to create tomorrow's plan
    const consumedMeals = todaysNutrition.map(n => n.mealType?.toLowerCase()).filter(Boolean)
    const totalCaloriesToday = todaysNutrition.reduce((sum, n) => sum + (n.calories || 0), 0)
    
    console.log('🍽️ Consumed meals today:', consumedMeals)
    console.log('🔥 Total calories today:', totalCaloriesToday)
    
    // Create meal plan pools for variety
    const breakfastOptions = [
      { meal: 'Oatmeal with berries & almonds', calories: 320, protein: 12, carbs: 45, fat: 8 },
      { meal: 'Greek yogurt parfait with granola', calories: 280, protein: 20, carbs: 35, fat: 6 },
      { meal: 'Avocado toast with eggs', calories: 350, protein: 18, carbs: 25, fat: 22 },
      { meal: 'Smoothie bowl with protein powder', calories: 300, protein: 25, carbs: 40, fat: 5 }
    ]
    
    const lunchOptions = [
      { meal: 'Grilled chicken Caesar salad', calories: 450, protein: 35, carbs: 15, fat: 28 },
      { meal: 'Quinoa Buddha bowl with vegetables', calories: 420, protein: 18, carbs: 55, fat: 14 },
      { meal: 'Turkey and hummus wrap', calories: 380, protein: 25, carbs: 45, fat: 12 },
      { meal: 'Salmon poke bowl with brown rice', calories: 480, protein: 30, carbs: 45, fat: 18 }
    ]
    
    const snackOptions = [
      { meal: 'Greek yogurt with honey', calories: 150, protein: 15, carbs: 20, fat: 2 },
      { meal: 'Apple with almond butter', calories: 180, protein: 6, carbs: 25, fat: 8 },
      { meal: 'Protein smoothie', calories: 200, protein: 20, carbs: 15, fat: 5 },
      { meal: 'Mixed nuts and dried fruit', calories: 160, protein: 5, carbs: 18, fat: 9 }
    ]
    
    const dinnerOptions = [
      { meal: 'Baked salmon with quinoa & broccoli', calories: 520, protein: 40, carbs: 35, fat: 22 },
      { meal: 'Chicken stir-fry with brown rice', calories: 480, protein: 35, carbs: 50, fat: 15 },
      { meal: 'Lean beef with sweet potato & asparagus', calories: 550, protein: 42, carbs: 40, fat: 20 },
      { meal: 'Tofu curry with jasmine rice', calories: 460, protein: 22, carbs: 60, fat: 16 }
    ]
    
    // Use date for consistent but varied selection
    const today = new Date()
    const dayIndex = today.getDay()
    
    // Generate tomorrow's meal plan
    const tomorrowMealPlan = [
      { 
        mealType: 'Breakfast',
        ...breakfastOptions[dayIndex % breakfastOptions.length],
        time: '8:00 AM'
      },
      { 
        mealType: 'Lunch',
        ...lunchOptions[dayIndex % lunchOptions.length],
        time: '12:30 PM'
      },
      { 
        mealType: 'Snack',
        ...snackOptions[dayIndex % snackOptions.length],
        time: '3:30 PM'
      },
      { 
        mealType: 'Dinner',
        ...dinnerOptions[dayIndex % dinnerOptions.length],
        time: '7:00 PM'
      }
    ]
    
    const totalPlanCalories = tomorrowMealPlan.reduce((sum, meal) => sum + meal.calories, 0)
    const totalProtein = tomorrowMealPlan.reduce((sum, meal) => sum + meal.protein, 0)
    
    // Add OpenAI configuration notice if needed
    const openaiNotice = isOpenAIError ? 
      `\n\n⚠️ **Note**: For fully personalized AI-generated meal plans, configure your OpenAI API key in \`.env.local\`\n` : 
      ``
    
    const planResponse = `🍽️ **Tomorrow's Meal Plan** - Based on your ${totalCaloriesToday} calories consumed today!\n\n` +
      `I analyzed your nutrition patterns and created a balanced meal plan:\n\n` +
      tomorrowMealPlan.map(meal => 
        `🍽️ **${meal.mealType}** (${meal.time}): ${meal.meal}\n   📊 ${meal.calories} cal | ${meal.protein}g protein | ${meal.carbs}g carbs | ${meal.fat}g fat`
      ).join('\n\n') +
      `\n\n🎯 **Daily Totals**: ${totalPlanCalories} calories | ${totalProtein}g protein\n\n` +
      `This plan provides balanced nutrition to fuel your fitness goals! 🌟${openaiNotice}`
    
    // Try to update the meal plan via API
    try {
      const planUpdateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planType: 'nutrition',
          userMessage: message,
          customPlan: tomorrowMealPlan
        })
      })
      
      if (planUpdateResponse.ok) {
        console.log('✅ Meal plan updated successfully')
      }
    } catch (planError) {
      console.log('⚠️ Could not update meal plan via API, but continuing with response')
    }
    
    return {
      response: planResponse,
      structuredData: {
        type: 'plan_generated',
        planType: 'nutrition',
        planData: tomorrowMealPlan,
        refreshContext: true
      }
    }
    
  } catch (error) {
    console.error('Smart meal plan generation failed:', error)
    
    return {
      response: generateFallbackPlanResponse('nutrition'),
      structuredData: null
    }
  }
}

async function handleGeneralChat(message: string, context: any, userId: string) {
  // Get enhanced context if not provided
  if (!context) {
    try {
      const contextResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/context?userId=${userId}`)
      if (contextResponse.ok) {
        context = await contextResponse.json()
      }
    } catch (error) {
      console.error('Error fetching context:', error)
    }
  }
  
  return generateContextAwareFitnessResponse(message, context, userId)
}

function generateEncouragingMessage(workout: any): string {
  const messages = [
    `You're building strength and endurance with every rep!`,
    `Your consistency is paying off - I can see your progress!`,
    `That's exactly the kind of dedication that leads to results!`,
    `You're creating healthy habits that will transform your life!`
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

function generateNutritionEncouragement(nutrition: any): string {
  const messages = [
    `Fueling your body right is key to achieving your goals!`,
    `Great choice! Your body will thank you for this nutrition.`,
    `You're building healthy eating habits one meal at a time!`,
    `Perfect timing - your muscles need this fuel for recovery!`
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

function generateFallbackPlanResponse(planType: string): string {
  if (planType === 'workout') {
    return `💪 Here's a quick workout plan I recommend:\n\n**Today's Focus: Full Body Strength**\n• Push-ups: 3 sets of 10-12 reps\n• Squats: 3 sets of 15 reps\n• Plank: 3 sets of 30 seconds\n• Lunges: 3 sets of 10 each leg\n\nStart with this and we'll build from here! 🚀`
  } else if (planType === 'nutrition') {
    return `🍽️ Here's a balanced meal plan for today:\n\n**Breakfast**: Oatmeal with berries and nuts (350 cal)\n**Lunch**: Grilled chicken salad with mixed vegetables (450 cal)\n**Snack**: Greek yogurt with honey (150 cal)\n**Dinner**: Baked salmon with quinoa and broccoli (520 cal)\n\nThis gives you balanced nutrition for your fitness goals! 🥗`
  } else {
    return `🎯 I'm creating a comprehensive plan for you! Let's start with small, achievable goals and build momentum. Focus on consistency over perfection - you've got this! 💪`
  }
}

function generateContextAwareFitnessResponse(message: string, context: any, userId: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Extract user's current stats
  const workoutMinutes = context?.todaysProgress?.workoutMinutes || 0
  const caloriesConsumed = context?.todaysProgress?.caloriesConsumed || 0
  const stepsTaken = context?.todaysProgress?.stepsTaken || 0
  const workoutsCompleted = context?.todaysProgress?.workoutsCompleted || 0

  // Context-aware responses based on user's current progress
  if (lowerMessage.includes('how') && (lowerMessage.includes('doing') || lowerMessage.includes('progress'))) {
    if (workoutMinutes > 0 || caloriesConsumed > 0) {
      return `You're doing fantastic today! 🌟 I can see you've logged ${workoutMinutes} minutes of exercise and ${caloriesConsumed} calories. That shows real commitment to your goals! What would you like to focus on next?`
    } else {
      return `Today's a fresh start! 🌅 I'm here to help you make it count. Whether you want to plan your workouts, track nutrition, or just chat about fitness, I'm ready to support you! What's on your mind?`
    }
  }

  // Motivation based on current activity
  if (lowerMessage.includes('motivation') || lowerMessage.includes('tired') || lowerMessage.includes('hard')) {
    if (workoutMinutes > 30) {
      return `You've already crushed ${workoutMinutes} minutes of exercise today! 💪 That's incredible dedication. When things feel tough, remember this momentum you've built. You're stronger than you think!`
    } else {
      return `I understand that staying motivated can be challenging! 🌟 But you know what? You're here talking to me about fitness, and that already shows you care. Let's turn that energy into action - even 10 minutes of movement can change your whole day!`
    }
  }

  // Default responses with context awareness
  const responses = [
    `I love your enthusiasm for fitness! 🚀 ${workoutMinutes > 0 ? `You're already ${workoutMinutes} minutes into your fitness journey today.` : `Ready to start your fitness journey for today?`} How can I help you succeed?`,
    `That's exactly the mindset that leads to results! 💪 ${caloriesConsumed > 0 ? `I see you're tracking your nutrition too - fantastic!` : `Want to talk about nutrition planning as well?`} What's your next goal?`,
    `You're asking great questions! 🎯 ${workoutsCompleted > 0 ? `Your workout completion is looking good today.` : `Let's get those workouts started!`} I'm here to support you every step of the way.`
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
} 