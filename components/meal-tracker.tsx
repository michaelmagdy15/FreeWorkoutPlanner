"use client"

import { useState, useEffect, useCallback } from "react"
import { Utensils, Plus, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"

interface Meal {
  id: string
  type: string
  name: string
  calories: number
  time: string
  completed: boolean
  protein: number
  carbs: number
  fat: number
}

interface MealTrackerProps {
  loggedNutrition?: Array<{
    id: string
    foodItem: string
    mealType: string
    calories: number
    protein: number
    carbs: number
    fat: number
    timestamp: string
  }>
}

export function MealTracker({ loggedNutrition = [] }: MealTrackerProps) {
  const { logNewEntry } = useFitnessData()

  // Helper function to check if a meal is completed based on logged nutrition
  const isMealCompleted = useCallback((mealName: string) => {
    return loggedNutrition.some(nutrition => 
      nutrition.foodItem.toLowerCase().includes(mealName.toLowerCase()) ||
      mealName.toLowerCase().includes(nutrition.foodItem.toLowerCase())
    )
  }, [loggedNutrition])

  // Helper function to get actual calories from logged nutrition
  const getActualCalories = useCallback((mealName: string) => {
    const loggedMeal = loggedNutrition.find(nutrition => 
      nutrition.foodItem.toLowerCase().includes(mealName.toLowerCase()) ||
      mealName.toLowerCase().includes(nutrition.foodItem.toLowerCase())
    )
    return loggedMeal?.calories || 0
  }, [loggedNutrition])

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "1",
      type: "Breakfast",
      name: "Greek Yogurt Bowl with Chia Seeds & Berries",
      calories: 320,
      time: "8:00 AM",
      completed: isMealCompleted("Greek Yogurt Bowl with Chia Seeds & Berries"),
      protein: 25,
      carbs: 35,
      fat: 8,
    },
    {
      id: "2",
      type: "Lunch",
      name: "Grilled Chicken Breast with Quinoa & Steamed Asparagus",
      calories: 480,
      time: "12:30 PM",
      completed: isMealCompleted("Grilled Chicken Breast with Quinoa & Steamed Asparagus"),
      protein: 40,
      carbs: 45,
      fat: 12,
    },
    {
      id: "3",
      type: "Snack",
      name: "Whey Protein Shake & Almonds",
      calories: 250,
      time: "3:00 PM",
      completed: isMealCompleted("Whey Protein Shake & Almonds"),
      protein: 30,
      carbs: 10,
      fat: 10,
    },
    {
      id: "4",
      type: "Dinner",
      name: "Pan-Seared Salmon with Sweet Potato & Broccoli",
      calories: 550,
      time: "7:00 PM",
      completed: isMealCompleted("Pan-Seared Salmon with Sweet Potato & Broccoli"),
      protein: 35,
      carbs: 40,
      fat: 22,
    },
  ])

  // Update meal completion status when loggedNutrition changes
  useEffect(() => {
    setMeals(prevMeals => 
      prevMeals.map(meal => ({
        ...meal,
        completed: isMealCompleted(meal.name)
      }))
    )
  }, [isMealCompleted])

  const toggleMeal = async (id: string) => {
    const meal = meals.find(m => m.id === id)
    if (!meal) return

    const newCompletedState = !meal.completed

    // Check if this meal is already logged
    const isAlreadyLogged = isMealCompleted(meal.name)
    
    if (isAlreadyLogged && !newCompletedState) {
      // Keep it checked if already logged
      return
    }

    // Update local state immediately
    setMeals(
      meals.map((m) => (m.id === id ? { ...m, completed: newCompletedState } : m)),
    )

    // Log to API on completion
    if (newCompletedState && !isAlreadyLogged) {
      try {
        const result = await logNewEntry('nutrition', {
          nutrition: {
            mealType: meal.type.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            foodItem: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          }
        })

        if (result.success) {
          console.log(`✅ Logged completed meal: ${meal.name} (${meal.calories} cal)`)
        } else {
          console.error('❌ Failed to log meal:', result.error)
        }
      } catch (error) {
        console.error('Failed to log meal completion:', error)
        // Revert the state
        setMeals(
          meals.map((m) => (m.id === id ? { ...m, completed: !newCompletedState } : m)),
        )
      }
    }
  }

  const completedMeals = meals.filter((meal) => meal.completed)
  
  // Calculate calorie and protein totals
  let totalCalories = 0
  let totalProtein = 0
  
  completedMeals.forEach(meal => {
    const loggedCalories = getActualCalories(meal.name)
    if (loggedCalories > 0) {
      totalCalories += loggedCalories
      totalProtein += Math.round(loggedCalories * 0.25 / 4)
    } else {
      totalCalories += meal.calories
      totalProtein += meal.protein
    }
  })
  
  const progress = (completedMeals.length / meals.length) * 100

  const targetCalories = 1440
  const targetProtein = 120

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/10">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Nutrition Tracker</h3>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progress} className="w-20 h-1.5 bg-slate-950/50" />
              <span className="text-xs text-slate-400 font-bold">{Math.round(progress)}% Logged</span>
            </div>
          </div>
        </div>
        <Button 
          size="sm" 
          className="rounded-xl btn-premium w-8 h-8 p-0 flex items-center justify-center hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {meals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => toggleMeal(meal.id)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left group",
              meal.completed
                ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-sm"
                : "bg-slate-900/40 border-white/5 hover:border-secondary/30 hover:shadow-md hover:scale-[1.01]",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {/* Completed Circle indicator */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full mt-0.5 transition-all duration-200 flex items-center justify-center flex-shrink-0",
                    meal.completed
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800 group-hover:bg-secondary",
                  )}
                >
                  {meal.completed && (
                    <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                        meal.completed
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary",
                      )}
                    >
                      {meal.type}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "font-bold text-sm leading-relaxed mb-2 tracking-tight",
                      meal.completed ? "text-emerald-300" : "text-white",
                    )}
                  >
                    {meal.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono font-medium">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      <span className={meal.completed ? "text-emerald-400/80" : "text-slate-400"}>{meal.calories} kcal</span>
                    </div>
                    <span className={meal.completed ? "text-emerald-400/80" : "text-slate-500"}>P: {meal.protein}g</span>
                    <span className={meal.completed ? "text-emerald-400/80" : "text-slate-500"}>C: {meal.carbs}g</span>
                    <span className={meal.completed ? "text-emerald-400/80" : "text-slate-500"}>F: {meal.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Daily Progress summary block */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-4">
        <h4 className="font-semibold text-slate-300 text-xs flex items-center gap-2 uppercase tracking-wider">
          <Flame className="w-4 h-4 text-primary" />
          Nutritional Summary
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Calories</span>
              <span className="text-white font-bold font-mono">
                {totalCalories}/{targetCalories} kcal
              </span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="btn-premium h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Protein</span>
              <span className="text-white font-bold font-mono">
                {totalProtein}g/{targetProtein}g
              </span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
