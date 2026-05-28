"use client"

import { ChevronDown, ChevronUp, Dumbbell, Utensils, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface PlanCardProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

export function PlanCard({ isExpanded, setIsExpanded }: PlanCardProps) {
  const workoutPlan = [
    { exercise: "Push-ups", sets: "3x12", completed: true },
    { exercise: "Squats", sets: "3x15", completed: true },
    { exercise: "Plank", sets: "3x30s", completed: false },
    { exercise: "Lunges", sets: "3x10", completed: false },
  ]

  const mealPlan = [
    { meal: "Breakfast", food: "Oatmeal with berries", calories: 320, completed: true },
    { meal: "Lunch", food: "Grilled chicken salad", calories: 450, completed: false },
    { meal: "Snack", food: "Greek yogurt", calories: 150, completed: false },
    { meal: "Dinner", food: "Salmon with vegetables", calories: 520, completed: false },
  ]

  const workoutProgress = (workoutPlan.filter((w) => w.completed).length / workoutPlan.length) * 100
  const mealProgress = (mealPlan.filter((m) => m.completed).length / mealPlan.length) * 100

  return (
    <div className="glass-panel rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">Today's Plan</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Personalized for your goals</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="rounded-full text-slate-400 hover:text-white hover:bg-white/5">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={cn("transition-all duration-300 ease-in-out overflow-hidden", isExpanded ? "block" : "hidden")}>
        <div className="p-6 space-y-6">
          {/* Workout Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 btn-premium rounded-2xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Workout Plan</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={workoutProgress} className="flex-1 h-2 bg-slate-950/50" />
                  <span className="text-xs font-mono font-bold text-slate-300">{Math.round(workoutProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {workoutPlan.map((exercise, index) => (
                <button
                   key={index}
                   onClick={() => {
                     console.log(`Toggled ${exercise.exercise}`)
                   }}
                   className={cn(
                     "flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 w-full hover:scale-[1.01]",
                     exercise.completed
                       ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-sm"
                       : "bg-slate-900/40 border-white/5 text-slate-300 hover:border-secondary/30",
                   )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", exercise.completed ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-700")} />
                    <span className="font-medium">{exercise.exercise}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{exercise.sets}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meal Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-secondary rounded-2xl flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Meal Plan</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={mealProgress} className="flex-1 h-2 bg-slate-950/50" />
                  <span className="text-xs font-mono font-bold text-slate-300">{Math.round(mealProgress)}%</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {mealPlan.map((meal, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Toggle meal completion
                    const updatedMealPlan = [...mealPlan]
                    updatedMealPlan[index].completed = !updatedMealPlan[index].completed
                    // You would update state here in a real app
                    console.log(`Toggled ${meal.meal}:`, !meal.completed)
                  }}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 transition-all duration-200 group hover:shadow-md text-left w-full",
                    meal.completed
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-sm"
                      : "bg-slate-900/40 border-white/5 text-slate-300 hover:border-secondary/30 hover:scale-[1.02]",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-1 transition-all duration-200 flex-shrink-0",
                          meal.completed
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                            : "bg-slate-700 group-hover:bg-secondary",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                              meal.completed
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-white/5 text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary",
                            )}
                          >
                            {meal.meal.toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md",
                              meal.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500",
                            )}
                          >
                            {meal.calories} cal
                          </span>
                        </div>
                        <p
                          className={cn(
                            "font-bold text-sm leading-relaxed mb-2 tracking-tight",
                            meal.completed ? "text-emerald-300" : "text-white",
                          )}
                        >
                          {meal.food}
                        </p>
                      </div>
                    </div>

                    {meal.completed && (
                      <div className="ml-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-in slide-in-from-right-1 duration-300">
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {!meal.completed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Daily Nutrition Summary */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 space-y-4">
              <h4 className="font-semibold text-slate-300 text-xs flex items-center gap-2 uppercase tracking-wider">Daily Nutrition Target</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white font-mono">1,440</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Calories</div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 mt-1.5 border border-white/5">
                    <div className="btn-premium h-1.5 rounded-full w-1/4"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white font-mono">120g</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Protein</div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 mt-1.5 border border-white/5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-1/3"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white font-mono">45g</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fiber</div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 mt-1.5 border border-white/5">
                    <div className="bg-secondary h-1.5 rounded-full w-1/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full rounded-2xl btn-premium shadow-lg shadow-coral-500/10 hover:scale-[1.01] transition-all h-11 text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4 mr-2" />
            Update Progress
          </Button>
        </div>
      </div>
    </div>
  )
}
