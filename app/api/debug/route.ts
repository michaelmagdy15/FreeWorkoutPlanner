import { NextRequest, NextResponse } from 'next/server'
import { workoutStore, nutritionStore, planStore, activitiesStore } from '@/lib/stores'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId') || 'default-user'
  
  if (action === 'force-refresh') {
    // Return data that should trigger a frontend refresh
    return NextResponse.json({
      success: true,
      message: 'Frontend should refresh now',
      timestamp: new Date().toISOString(),
      forceRefresh: true,
      userId
    })
  }
  
  if (action === 'clear-cache') {
    // Return success to trigger cache clearing
    return NextResponse.json({
      success: true,
      message: 'Cache cleared',
      timestamp: new Date().toISOString(),
      clearCache: true
    })
  }
  
  if (action === 'reset-data') {
    // Clear all data for the user
    workoutStore.delete(userId)
    nutritionStore.delete(userId)
    planStore.delete(userId)
    activitiesStore.delete(userId)
    
    return NextResponse.json({
      success: true,
      message: `All data cleared for user ${userId}`,
      timestamp: new Date().toISOString(),
      resetData: true,
      userId
    })
  }
  
  return NextResponse.json({
    availableActions: ['force-refresh', 'clear-cache', 'reset-data'],
    usage: 'Add ?action=force-refresh or ?action=clear-cache or ?action=reset-data&userId=default-user'
  })
} 