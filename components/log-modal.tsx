"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LogModalProps {
  isOpen: boolean
  onClose: () => void
  onActivityLogged?: (data: { entryType: 'workout' | 'nutrition' | 'feedback' | 'activity'; entryData: any }) => void
}

export function LogModal({ isOpen, onClose, onActivityLogged }: LogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [duration, setDuration] = useState([30])
  const [distance, setDistance] = useState([5])
  const [workoutType, setWorkoutType] = useState("")
  const [customWorkout, setCustomWorkout] = useState("")
  const [foodItem, setFoodItem] = useState("")
  const [customFoodItem, setCustomFoodItem] = useState("")
  const [calories, setCalories] = useState("")
  const [waterAmount, setWaterAmount] = useState("")
  const [stepsCount, setStepsCount] = useState("")
  const [sleepHours, setSleepHours] = useState([8])
  const [weight, setWeight] = useState("")

  const categories = [
    {
      id: "workout",
      label: "Workout",
      icon: "🏋️",
      color: "from-orange-400 to-red-500",
      fields: ["duration", "intensity"],
    },
    {
      id: "cardio",
      label: "Cardio",
      icon: "🏃",
      color: "from-blue-400 to-cyan-500",
      fields: ["duration", "distance"],
    },
    {
      id: "meal",
      label: "Meal",
      icon: "🍽️",
      color: "from-green-400 to-emerald-500",
      fields: ["food", "calories"],
    },
    {
      id: "water",
      label: "Water",
      icon: "💧",
      color: "from-blue-400 to-indigo-500",
      fields: ["amount"],
    },
    {
      id: "steps",
      label: "Steps",
      icon: "👟",
      color: "from-purple-400 to-pink-500",
      fields: ["count"],
    },
    {
      id: "sleep",
      label: "Sleep",
      icon: "😴",
      color: "from-indigo-400 to-purple-500",
      fields: ["hours"],
    },
    {
      id: "weight",
      label: "Weight",
      icon: "⚖️",
      color: "from-gray-400 to-slate-500",
      fields: ["value"],
    },
  ]

  const handleSubmit = () => {
    if (!selectedCategory) return

    let entryType: 'workout' | 'nutrition' | 'feedback' | 'activity'
    let entryData: any

    // Structure data according to the API requirements
    if (selectedCategory === "workout" || selectedCategory === "cardio") {
      entryType = 'workout'
      const finalWorkoutName = workoutType === "Other" ? customWorkout : workoutType
      entryData = {
        workout: {
          type: selectedCategory === "cardio" ? 'cardio' : 'strength',
          name: finalWorkoutName || (selectedCategory === "cardio" ? "Running" : "Strength Training"),
          duration: duration[0],
          sets: selectedCategory === "workout" ? 3 : undefined,
          reps: selectedCategory === "workout" ? 12 : undefined,
          distance: selectedCategory === "cardio" ? distance[0] : undefined,
        }
      }
    } else if (selectedCategory === "meal") {
      entryType = 'nutrition'
      const finalFoodItem = foodItem === "Other" ? customFoodItem : foodItem
      
      // Determine meal type based on selected food
      let mealType = 'snack'
      if (finalFoodItem?.includes('Breakfast') || finalFoodItem?.includes('Oatmeal')) mealType = 'breakfast'
      else if (finalFoodItem?.includes('Lunch') || finalFoodItem?.includes('chicken Caesar')) mealType = 'lunch'
      else if (finalFoodItem?.includes('Dinner') || finalFoodItem?.includes('salmon')) mealType = 'dinner'
      else if (finalFoodItem?.includes('Snack') || finalFoodItem?.includes('yogurt')) mealType = 'snack'
      
      entryData = {
        nutrition: {
          mealType,
          foodItem: finalFoodItem || "Unknown Food",
          calories: parseInt(calories) || 0,
          protein: Math.round((parseInt(calories) || 0) * 0.25 / 4), // Estimate 25% protein
          carbs: Math.round((parseInt(calories) || 0) * 0.45 / 4), // Estimate 45% carbs
          fat: Math.round((parseInt(calories) || 0) * 0.30 / 9), // Estimate 30% fat
        }
      }
    } else if (selectedCategory === "water" || selectedCategory === "steps" || selectedCategory === "sleep" || selectedCategory === "weight") {
      entryType = 'activity'
      if (selectedCategory === "water") {
        entryData = {
          activity: {
            type: 'water',
            amount: parseInt(waterAmount) || 250,
            unit: 'ml'
          }
        }
      } else if (selectedCategory === "steps") {
        entryData = {
          activity: {
            type: 'steps',
            count: parseInt(stepsCount) || 0,
            unit: 'steps'
          }
        }
      } else if (selectedCategory === "sleep") {
        entryData = {
          activity: {
            type: 'sleep',
            duration: sleepHours[0],
            unit: 'hours'
          }
        }
      } else if (selectedCategory === "weight") {
        entryData = {
          activity: {
            type: 'weight',
            value: parseFloat(weight) || 0,
            unit: 'kg'
          }
        }
      }
    } else {
      return
    }

    console.log("Logging activity:", { entryType, entryData })
    
    // Call the callback if provided
    if (onActivityLogged) {
      onActivityLogged({ entryType, entryData })
    }
    
    // Reset form
    onClose()
    setSelectedCategory(null)
    setWorkoutType("")
    setCustomWorkout("")
    setFoodItem("")
    setCustomFoodItem("")
    setCalories("")
    setWaterAmount("")
    setStepsCount("")
    setSleepHours([8])
    setWeight("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl shadow-black/80 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center gradient-text">
            Log Activity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedCategory ? (
            // Category Selection - Updated to show 3 columns for better layout
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`h-20 rounded-2xl border-2 bg-gradient-to-br ${category.color} text-white border-white/10 hover:scale-105 transition-all duration-200 shadow-lg`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="font-semibold text-sm">{category.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            // Activity Form
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Log {categories.find((c) => c.id === selectedCategory)?.label}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full p-1.5"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {selectedCategory === "workout" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Duration (minutes)</Label>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={180}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-center text-xs font-mono font-bold text-slate-300">{duration[0]} minutes</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workout-type" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Workout Type
                      </Label>
                      <select
                        id="workout-type"
                        value={workoutType}
                        onChange={(e) => setWorkoutType(e.target.value)}
                        className="w-full rounded-2xl border border-white/5 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0 disabled:opacity-50"
                      >
                        <option value="" className="bg-slate-950 text-white">Select an exercise...</option>
                        <option value="Push-ups" className="bg-slate-950 text-white">Push-ups</option>
                        <option value="Squats" className="bg-slate-950 text-white">Squats</option>
                        <option value="Plank" className="bg-slate-950 text-white">Plank</option>
                        <option value="Lunges" className="bg-slate-950 text-white">Lunges</option>
                        <option value="Pull-ups" className="bg-slate-950 text-white">Pull-ups</option>
                        <option value="Burpees" className="bg-slate-950 text-white">Burpees</option>
                        <option value="Mountain Climbers" className="bg-slate-950 text-white">Mountain Climbers</option>
                        <option value="Jumping Jacks" className="bg-slate-950 text-white">Jumping Jacks</option>
                        <option value="Sit-ups" className="bg-slate-950 text-white">Sit-ups</option>
                        <option value="Other" className="bg-slate-950 text-white">Other (specify below)</option>
                      </select>
                      {workoutType === "Other" && (
                        <Input
                          value={customWorkout}
                          onChange={(e) => setCustomWorkout(e.target.value)}
                          placeholder="e.g., Custom exercise name"
                          className="rounded-2xl border-white/5 bg-slate-900 mt-2 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                        />
                      )}
                    </div>
                  </>
                )}

                {selectedCategory === "cardio" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Duration (minutes)</Label>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={120}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-center text-xs font-mono font-bold text-slate-300">{duration[0]} minutes</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Distance (km)</Label>
                      <Slider
                        value={distance}
                        onValueChange={setDistance}
                        max={20}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-center text-xs font-mono font-bold text-slate-300">{distance[0]} km</div>
                    </div>
                  </>
                )}

                {selectedCategory === "meal" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="food-item" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Meal Type
                      </Label>
                      <select
                        id="food-item"
                        value={foodItem}
                        onChange={(e) => {
                          setFoodItem(e.target.value)
                          // Auto-set calories for recommended meals
                          if (e.target.value === "Oatmeal with berries & almonds") setCalories("320")
                          else if (e.target.value === "Grilled chicken Caesar salad") setCalories("450")
                          else if (e.target.value === "Greek yogurt with honey") setCalories("150")
                          else if (e.target.value === "Baked salmon with quinoa & broccoli") setCalories("520")
                          else setCalories("")
                        }}
                        className="w-full rounded-2xl border border-white/5 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus-visible:ring-primary focus-visible:ring-offset-0 disabled:opacity-50"
                      >
                        <option value="" className="bg-slate-950 text-white">Select a meal...</option>
                        <optgroup label="📋 Today's Recommended Meals" className="bg-slate-950 text-white font-bold">
                          <option value="Oatmeal with berries & almonds" className="bg-slate-950 text-white">🍳 Breakfast: Oatmeal with berries & almonds (320 cal)</option>
                          <option value="Grilled chicken Caesar salad" className="bg-slate-950 text-white">🥗 Lunch: Grilled chicken Caesar salad (450 cal)</option>
                          <option value="Greek yogurt with honey" className="bg-slate-950 text-white">🍯 Snack: Greek yogurt with honey (150 cal)</option>
                          <option value="Baked salmon with quinoa & broccoli" className="bg-slate-950 text-white">🍽️ Dinner: Baked salmon with quinoa & broccoli (520 cal)</option>
                        </optgroup>
                        <option value="Other" className="bg-slate-950 text-white">🍴 Other (specify below)</option>
                      </select>
                      {foodItem === "Other" && (
                        <Input
                          value={customFoodItem}
                          onChange={(e) => setCustomFoodItem(e.target.value)}
                          placeholder="e.g., Homemade pasta"
                          className="rounded-2xl border-white/5 bg-slate-900 mt-2 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        Calories
                      </Label>
                      <Input
                        id="calories"
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="e.g., 450"
                        className="rounded-2xl border-white/5 bg-slate-900 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </>
                )}

                {selectedCategory === "water" && (
                  <div className="space-y-2">
                    <Label htmlFor="water-amount" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Amount (ml)
                    </Label>
                    <Input
                      id="water-amount"
                      type="number"
                      value={waterAmount}
                      onChange={(e) => setWaterAmount(e.target.value)}
                      placeholder="e.g., 250"
                      className="rounded-2xl border-white/5 bg-slate-900 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}

                {selectedCategory === "steps" && (
                  <div className="space-y-2">
                    <Label htmlFor="steps-count" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Steps Count
                    </Label>
                    <Input
                      id="steps-count"
                      type="number"
                      value={stepsCount}
                      onChange={(e) => setStepsCount(e.target.value)}
                      placeholder="e.g., 5000"
                      className="rounded-2xl border-white/5 bg-slate-900 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                    />
                    <div className="text-[10px] text-slate-400 italic">
                      💡 Tip: Check your phone's health app or fitness tracker
                    </div>
                  </div>
                )}

                {selectedCategory === "sleep" && (
                  <div className="space-y-2">
                    <Label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sleep Duration (hours)</Label>
                    <Slider
                      value={sleepHours}
                      onValueChange={setSleepHours}
                      max={12}
                      min={4}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-center text-xs font-mono font-bold text-slate-300">{sleepHours[0]} hours</div>
                  </div>
                )}

                {selectedCategory === "weight" && (
                  <div className="space-y-2">
                    <Label htmlFor="weight-value" className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight-value"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g., 70.5"
                      className="rounded-2xl border-white/5 bg-slate-900 text-white placeholder:text-slate-600 focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setSelectedCategory(null)} className="flex-1 rounded-2xl btn-secondary-premium h-11 text-xs font-bold uppercase tracking-wider">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-2xl btn-premium h-11 text-xs font-bold uppercase tracking-wider shadow-lg shadow-coral-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Log Activity
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
