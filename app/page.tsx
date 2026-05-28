"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatWindow } from "@/components/chat-window"
import { WorkoutTracker } from "@/components/workout-tracker"
import { MealTracker } from "@/components/meal-tracker"
import { FloatingActionButton } from "@/components/floating-action-button"
import { LogModal } from "@/components/log-modal"
import { Header } from "@/components/header"
import { useFitnessData } from "@/hooks/useFitnessData"

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState("Workouts")
  const [showLogModal, setShowLogModal] = useState(false)
  
  // Connect to MCP server
  const {
    context,
    progressData,
    loading,
    error,
    logNewEntry,
    clearError,
  } = useFitnessData()

  const handleLogActivity = () => {
    setShowLogModal(true)
  }

  const handleActivityLogged = async (data: { entryType: 'workout' | 'nutrition' | 'feedback' | 'activity'; entryData: any }) => {
    const result = await logNewEntry(data.entryType, data.entryData)
    if (result.success) {
      setShowLogModal(false)
    }
  }

  // Memoize props to prevent infinite re-renders
  const memoizedLoggedWorkouts = useMemo(() => {
    return context?.recentEntries?.workouts?.map(workout => ({
      id: workout.id || Date.now().toString(),
      name: workout.name || 'Unknown Exercise',
      type: workout.type || 'strength',
      completed: workout.completed || false,
      timestamp: workout.timestamp || new Date().toISOString(),
      duration: workout.duration || 0
    })) || []
  }, [context?.recentEntries?.workouts])

  const memoizedLoggedNutrition = useMemo(() => {
    return context?.recentEntries?.nutrition?.map(nutrition => ({
      id: nutrition.id || Date.now().toString(),
      foodItem: nutrition.foodItem || 'Unknown Food',
      mealType: nutrition.mealType || 'snack',
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbs: nutrition.carbs || 0,
      fat: nutrition.fat || 0,
      timestamp: nutrition.timestamp || new Date().toISOString()
    })) || []
  }, [context?.recentEntries?.nutrition])

  const memoizedCurrentPlan = useMemo(() => {
    return context?.currentPlan?.workouts || []
  }, [context?.currentPlan?.workouts])

  // Premium Dark Loading Screen
  if (loading && !context) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 animate-spin rounded-full border-2 border-slate-800 border-t-primary" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Training Context...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-primary/30">
      {/* Heartbeat Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none text-coral-500/10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heartbeat" x="0" y="0" width="200" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0,20 Q10,10 20,20 T40,20 L60,20 L80,5 L100,35 L120,20 L140,20 Q150,10 160,20 T180,20 L200,20"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heartbeat)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        {/* Premium Dark Error Alert */}
        {error && (
          <div className="mx-6 mt-6 bg-red-950/20 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-red-400">{error}</p>
              {context && context.todaysProgress && (
                <p className="text-xs text-red-500/80 mt-1">
                  Note: Some data is still loading correctly (showing {context.todaysProgress.workoutMinutes} workout minutes)
                </p>
              )}
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-300">
              ✕
            </button>
          </div>
        )}
        
        <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden">
          {/* Sidebar - Always visible */}
          <div className="w-80 hidden md:block">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              progressData={progressData}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
            {/* Chat Interface */}
            <div className="flex-1 min-w-0">
              <ChatWindow />
            </div>

            {/* Right Panel - Content based on active tab */}
            <div className="w-full lg:w-96 space-y-6 overflow-y-auto pr-1">
              {activeTab === "Workouts" && (
                <WorkoutTracker 
                  loggedWorkouts={memoizedLoggedWorkouts}
                  currentPlan={memoizedCurrentPlan}
                />
              )}
              {activeTab === "Nutrition" && (
                <MealTracker 
                  loggedNutrition={memoizedLoggedNutrition}
                />
              )}
              {activeTab === "Feedback" && (
                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Feedback & Progress</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 border border-emerald-500/10 rounded-2xl p-4">
                      <h4 className="font-semibold text-emerald-400 mb-2">Recent Achievements</h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {context?.recentEntries.feedback
                          ?.filter(f => f.type === 'progress')
                          .slice(0, 3)
                          .map(feedback => (
                            <li key={feedback.id}>• {feedback.notes}</li>
                          )) || [
                          <li key="1">• Completed 3 strength training sessions this week</li>,
                          <li key="2">• Maintained calorie goal for 5 days straight</li>,
                          <li key="3">• Increased workout duration by 15 minutes</li>
                        ]}
                      </ul>
                    </div>
                    <div className="bg-slate-900/60 border border-secondary/15 rounded-2xl p-4">
                      <h4 className="font-semibold text-secondary mb-2">Recommendations</h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {context?.currentPlan?.recommendations?.slice(0, 3).map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        )) || [
                          <li key="1">• Add more cardio sessions to improve endurance</li>,
                          <li key="2">• Increase protein intake by 20g daily</li>,
                          <li key="3">• Focus on proper form during strength exercises</li>
                        ]}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mobile Progress Cards - Only show on small screens */}
              <div className="md:hidden">
                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">Today's Dashboard</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-primary font-mono">{progressData.workoutMinutes}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-secondary font-mono">{progressData.caloriesConsumed}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-emerald-400 font-mono">{progressData.stepsTaken}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Steps</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleLogActivity} />
        
        {/* Log Modal */}
        <LogModal 
          isOpen={showLogModal} 
          onClose={() => setShowLogModal(false)}
          onActivityLogged={handleActivityLogged}
        />
      </div>
    </div>
  )
}
