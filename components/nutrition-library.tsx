"use client"

import React, { useState } from "react"
import { Apple, Sparkles, BookOpen, Target, CheckCircle2, ChevronDown, ChevronUp, Search, Flame, Coffee, Utensils, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"
import { useUser } from "@/lib/auth"

interface Meal {
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

interface DietPlan {
  id: string
  title: string
  badge: string
  description: string
  theme: "babyblue" | "emerald" | "coral" | "pink"
  goal: string
  caloriesTarget: number
  proteinTarget: number
  meals: Meal[]
}

const DIET_LIBRARY: DietPlan[] = [
  {
    id: "plateau-breaker-diet",
    title: "Plateau-Breaker Recovery Diet",
    badge: "Balanced & Hormone Optimizing",
    description: "Tailored to support muscular recovery and joint health during high-intensity splits. Focuses on nutrient-dense recovery sources.",
    theme: "babyblue",
    goal: "Hormonal Balance & Muscular Recovery",
    caloriesTarget: 1800,
    proteinTarget: 130,
    meals: [
      { mealType: "breakfast", name: "Greek Yogurt Bowl with Chia Seeds & Berries", calories: 320, protein: 25, carbs: 35, fat: 8, time: "08:00 AM" },
      { mealType: "lunch", name: "Grilled Chicken Breast with Quinoa & Steamed Asparagus", calories: 480, protein: 40, carbs: 45, fat: 12, time: "01:00 PM" },
      { mealType: "snack", name: "Whey Protein Shake & Almonds", calories: 250, protein: 30, carbs: 10, fat: 10, time: "04:30 PM" },
      { mealType: "dinner", name: "Pan-Seared Salmon with Sweet Potato & Broccoli", calories: 550, protein: 35, carbs: 40, fat: 22, time: "07:30 PM" }
    ]
  },
  {
    id: "lean-mass-bulk",
    title: "Lean Mass Muscle Bulk",
    badge: "High Kcal & High Clean Carbs",
    description: "Formulated for active muscle growth, strength accumulation, and clean surplus weight gains without fat storage spillover.",
    theme: "emerald",
    goal: "Muscle Hypertrophy & Strength Accumulation",
    caloriesTarget: 2850,
    proteinTarget: 210,
    meals: [
      { mealType: "breakfast", name: "Oatmeal with Peanut Butter, Whey, & Bananas", calories: 650, protein: 45, carbs: 85, fat: 18, time: "07:30 AM" },
      { mealType: "lunch", name: "Extra Lean Beef Patty, Jasmine Rice, & Avocado", calories: 750, protein: 50, carbs: 70, fat: 24, time: "12:30 PM" },
      { mealType: "snack", name: "Cottage Cheese, Honey, & Rice Cakes", calories: 350, protein: 30, carbs: 45, fat: 4, time: "04:00 PM" },
      { mealType: "dinner", name: "Grilled Chicken Breast, Sweet Potato Mash, & Green Beans", calories: 600, protein: 45, carbs: 65, fat: 12, time: "07:00 PM" },
      { mealType: "snack", name: "Cashew Nuts & Casein Protein Shake", calories: 500, protein: 40, carbs: 20, fat: 22, time: "09:30 PM" }
    ]
  },
  {
    id: "keto-conditioning",
    title: "Keto Conditioning & Fat Loss",
    badge: "Low Carb & High Healthy Fats",
    description: "Supports metabolic state alterations, cellular fat utilization, and muscle preservation during rigorous cutting cycles.",
    theme: "coral",
    goal: "Aggressive Fat Loss & Keto Adaptation",
    caloriesTarget: 1550,
    proteinTarget: 103,
    meals: [
      { mealType: "breakfast", name: "3 Scrambled Eggs with Spinach, Feta & Butter", calories: 400, protein: 25, carbs: 4, fat: 32, time: "08:30 AM" },
      { mealType: "lunch", name: "Tuna Salad with Olive Oil, Cucumber & Walnuts", calories: 450, protein: 35, carbs: 6, fat: 34, time: "01:30 PM" },
      { mealType: "snack", name: "Avocado with Sea Salt & Celery Sticks", calories: 200, protein: 3, carbs: 8, fat: 18, time: "04:30 PM" },
      { mealType: "dinner", name: "Grilled Ribeye Steak with Asparagus & Garlic Butter", calories: 500, protein: 40, carbs: 2, fat: 38, time: "07:30 PM" }
    ]
  },
  {
    id: "calisthenics-shred",
    title: "Calisthenics Lean Shred Diet",
    badge: "High Protein & Lean Strength Focus",
    description: "Designed specifically for bodyweight athletes. Minimizes body fat to maximize relative strength and leverage outputs.",
    theme: "pink",
    goal: "Optimal Power-to-Bodyweight Leverage",
    caloriesTarget: 2200,
    proteinTarget: 162,
    meals: [
      { mealType: "breakfast", name: "Egg White Omelette with Whole Wheat Toast", calories: 380, protein: 30, carbs: 35, fat: 8, time: "08:00 AM" },
      { mealType: "lunch", name: "Baked Turkey Breast with Brown Rice & Zucchini", calories: 550, protein: 45, carbs: 55, fat: 10, time: "01:00 PM" },
      { mealType: "snack", name: "Greek Yogurt with Raspberries & Walnuts", calories: 270, protein: 22, carbs: 20, fat: 12, time: "04:30 PM" },
      { mealType: "dinner", name: "White Fish Fillet (Cod) with Quinoa & Salad", calories: 500, protein: 40, carbs: 40, fat: 8, time: "07:30 PM" },
      { mealType: "snack", name: "Low Fat Cottage Cheese & Mixed Berries", calories: 500, protein: 35, carbs: 15, fat: 2, time: "09:30 PM" }
    ]
  }
]

export function NutritionLibrary() {
  const { user, isSignedIn } = useUser()
  const userId = isSignedIn && user ? user.id : "default-user"

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null)
  const [activeDietId, setActiveDietId] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)

  // Filter diet plans based on search
  const filteredDiets = DIET_LIBRARY.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goal.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Set active diet in planStore via Next.js API
  const handleActivateDiet = async (diet: DietPlan) => {
    try {
      setActivatingId(diet.id)
      console.log(`📡 [Nutrition Library] Activating diet: "${diet.title}" for user:`, userId)
      
      const formattedMeals = diet.meals.map((m) => ({
        mealType: m.mealType,
        name: m.name,
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        time: m.time
      }))

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planType: "nutrition",
          customMeals: formattedMeals,
          userMessage: `Customized with diet: ${diet.title}`
        })
      })

      if (response.ok) {
        setActiveDietId(diet.id)
        setShowSyncSuccess(true)
        console.log(`✅ [Nutrition Library] Diet "${diet.title}" active in planStore.`)

        // Trigger context refresh across panels
        window.dispatchEvent(new CustomEvent("refreshContext"))

        setTimeout(() => {
          setShowSyncSuccess(false)
        }, 4000)
      } else {
        throw new Error(`Failed to activate: ${response.statusText}`)
      }
    } catch (e) {
      console.error("Failed to activate diet:", e)
      alert("Unable to activate diet plan. Check your connection or server console.")
    } finally {
      setActivatingId(null)
    }
  }

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "emerald":
        return {
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          accentText: "text-emerald-400",
          glow: "from-emerald-500/10"
        }
      case "coral":
        return {
          border: "border-coral-500/20 hover:border-coral-500/40",
          badge: "bg-coral-500/10 text-primary border-coral-500/20",
          accentText: "text-[hsl(var(--primary))]",
          glow: "from-coral-500/10"
        }
      case "pink":
        return {
          border: "border-pink-500/20 hover:border-pink-500/40",
          badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          accentText: "text-pink-400",
          glow: "from-pink-500/10"
        }
      case "babyblue":
      default:
        return {
          border: "border-sky-500/20 hover:border-sky-500/40",
          badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          accentText: "text-sky-400",
          glow: "from-sky-500/10"
        }
    }
  }

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="w-3.5 h-3.5 text-indigo-400" />
      case "lunch":
      case "dinner":
        return <Utensils className="w-3.5 h-3.5 text-secondary" />
      case "snack":
      default:
        return <Moon className="w-3.5 h-3.5 text-emerald-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Diets Library
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Select Nutrition Program</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Browse and activate macro-balanced diet plans. Click **Activate** to dynamically configure your active meal checklist, calorie budgets, and macronutrient targets instantly.
        </p>
      </div>

      {/* 2. Success Alert Box */}
      {showSyncSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Nutrition Plan Activated!</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
              Unified stores synchronized. Switch to the **Meals** tab to view your updated active meal checklist and macro budgets.
            </p>
          </div>
        </div>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search diet plans by focus or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950/60 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* 4. Diets List */}
      <div className="space-y-4">
        {filteredDiets.length === 0 ? (
          <div className="glass-panel rounded-3xl py-12 text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No diet plans found matching that search.</p>
          </div>
        ) : (
          filteredDiets.map((diet) => {
            const styles = getThemeStyles(diet.theme)
            const isExpanded = expandedDiet === diet.id
            const isActive = activeDietId === diet.id
            const isActivating = activatingId === diet.id

            return (
              <div
                key={diet.id}
                className={cn(
                  "glass-panel rounded-3xl overflow-hidden transition-all duration-300 relative border",
                  styles.border,
                  isActive ? "bg-slate-950/50 shadow-lg shadow-black/85" : "bg-slate-950/10"
                )}
              >
                {/* Accent glow on hover */}
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 hover:opacity-[0.03] pointer-events-none transition-all duration-300", styles.glow)} />

                {/* Card Header summary */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border", styles.badge)}>
                      {diet.badge}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                      {diet.caloriesTarget} kcal
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white tracking-tight leading-snug">{diet.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{diet.description}</p>

                  <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                    <div className="flex-1 text-[10px] text-slate-500 font-medium">
                      Goal Focus: <span className="text-slate-300 font-semibold">{diet.goal}</span>
                    </div>

                    <button
                      onClick={() => setExpandedDiet(isExpanded ? null : diet.id)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Hide Meals <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Show Menu <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Menu Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5 bg-slate-950/30 space-y-5 pt-5 animate-in slide-in-from-top duration-300">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      Daily Macronutrient Targets
                    </h5>

                    {/* Macro Bar */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                      <div className="text-center border-r border-white/5">
                        <div className="text-lg font-black text-white font-mono">{diet.caloriesTarget}</div>
                        <div className="text-[9px] text-slate-505 font-bold uppercase tracking-wider">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-emerald-400 font-mono">{diet.proteinTarget}g</div>
                        <div className="text-[9px] text-slate-505 font-bold uppercase tracking-wider">Protein Goal</div>
                      </div>
                    </div>

                    {/* Meals List */}
                    <div className="space-y-3">
                      {diet.meals.map((m, index) => (
                        <div key={index} className="flex gap-3 bg-slate-950/20 p-3.5 rounded-xl border border-white/5 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                            {getMealIcon(m.mealType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold text-white capitalize">{m.mealType} ({m.time})</span>
                              <span className="font-mono text-slate-400 font-semibold">{m.calories} cal</span>
                            </div>
                            <p className="text-[11px] text-slate-350 leading-relaxed font-medium">{m.name}</p>
                            <div className="flex gap-2 mt-1.5 text-[9px] text-slate-500 font-mono">
                              <span>P: {m.protein}g</span>
                              <span>•</span>
                              <span>C: {m.carbs}g</span>
                              <span>•</span>
                              <span>F: {m.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Activation Button */}
                    <div className="pt-2 border-t border-white/5">
                      <Button
                        onClick={() => handleActivateDiet(diet)}
                        disabled={isActivating}
                        className={cn(
                          "w-full rounded-2xl transition-all duration-300 uppercase text-xs font-black tracking-wider h-11 border",
                          isActive
                            ? "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                            : "btn-premium shadow-lg shadow-coral-500/15"
                        )}
                      >
                        {isActivating ? (
                          <>
                            <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent mr-2" />
                            Synchronizing Active Client Diet...
                          </>
                        ) : isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            This Diet Plan Is Active
                          </>
                        ) : (
                          <>
                            <Apple className="w-4 h-4 mr-2" />
                            Activate Plan & Load Meals
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
