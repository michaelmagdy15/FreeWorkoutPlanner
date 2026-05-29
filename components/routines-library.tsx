"use client"

import React, { useState } from "react"
import { Dumbbell, Sparkles, BookOpen, Target, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Search, Flame, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"
import { useUser } from "@/lib/auth"

interface Exercise {
  name: string
  type: "strength" | "cardio"
  sets: number
  reps?: number
  weight?: string
  duration?: string
  day: number
  note?: string
  img?: string
}

interface Routine {
  id: string
  title: string
  badge: string
  description: string
  theme: "babyblue" | "emerald" | "coral" | "pink"
  goal: string
  level: "Beginner" | "Intermediate" | "Advanced"
  exercises: Exercise[]
}

const ROUTINE_LIBRARY: Routine[] = [
  {
    id: "plateau-breaker",
    title: "Plateau-Breaker Split",
    badge: "Emphasis: Glutes, Hamstrings & Posture",
    description: "Designed to break training adaptation by shifting emphasis to free-weights, high eccentric control (3-0-1), and smart RPE scaling.",
    theme: "babyblue",
    goal: "Sartorial Taper & Lower Body Focus",
    level: "Intermediate",
    exercises: [
      // Day 1
      { name: "Dumbbell Romanian Deadlifts (RDLs)", type: "strength", sets: 4, reps: 10, weight: "2x 25 lbs", day: 1, note: "Keep dumbbells scraping down your shins. Squeeze glutes to stand upright." },
      { name: "Bulgarian Split Squats", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 1, note: "Take a slight forward lean to direct load onto the working front glute." },
      { name: "Leg Press (High & Wide Foot Placement)", type: "strength", sets: 3, reps: 12, weight: "90 lbs", day: 1, note: "Foot placement shifts load straight onto hamstrings and glutes." },
      { name: "Lying Hamstring Curls", type: "strength", sets: 3, reps: 12, weight: "40 lbs", day: 1, note: "Keep hips firm against pad. eccentric drop by 30% on last set." },
      { name: "Core Activation (Plank & Knee Raises)", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 1, note: "Plank for 60s, hanging knee raises for 12 reps." },
      // Day 2
      { name: "Seated Dumbbell Shoulder Press", type: "strength", sets: 3, reps: 10, weight: "2x 20 lbs", day: 2, note: "Press straight up keeping back flat. Control descent to ear height." },
      { name: "Lat Pulldowns", type: "strength", sets: 3, reps: 12, weight: "60 lbs", day: 2, note: "Pull from your back rather than biceps, squeeze shoulder blades." },
      { name: "Incline Dumbbell Chest Press", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 2, note: "30-degree incline. Excellent for shoulder stability." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 4, reps: 15, weight: "2x 10 lbs", day: 2, note: "Push dumbbells out to walls, pinkies slightly high at peak." },
      { name: "Cable Face Pulls (Rope)", type: "strength", sets: 3, reps: 15, weight: "20 lbs", day: 2, note: "Pull rope directly to nose, separate hands at contraction." },
      { name: "Side Planks hold", type: "strength", sets: 3, reps: 1, duration: "45s", day: 2, note: "Squeeze oblique muscles. 45s per side." },
      // Day 3
      { name: "Barbell Hip Thrusts", type: "strength", sets: 4, reps: 10, weight: "65 lbs", day: 3, note: "Hold squeeze for 2s at top. Keep chin tucked looking forward." },
      { name: "Dumbbell Goblet Squats", type: "strength", sets: 3, reps: 12, weight: "30 lbs", day: 3, note: "Keep single dumbbell vertical at chest, drop as deep as possible." },
      { name: "Seated Cable Rows", type: "strength", sets: 3, reps: 12, weight: "50 lbs", day: 3, note: "Pull to lower stomach, slow extensions back." },
      { name: "DB Hammer Curls super-set", type: "strength", sets: 3, reps: 12, weight: "2x 10 lbs", day: 3, note: "Hammer curls super-set with overhead triceps extensions." },
      { name: "Cardio (Stairmaster)", type: "cardio", sets: 1, reps: 1, duration: "20m", day: 3, note: "20 minutes steady cardio conditioning at Level 6." }
    ]
  },
  {
    id: "hypertrophy-ppl",
    title: "Hypertrophy Push/Pull/Legs",
    badge: "Emphasis: Symmetrical Muscle Growth",
    description: "The classic highly-effective split designed to maximize training frequency and build aesthetic lean muscle mass.",
    theme: "emerald",
    goal: "Lean Muscle Hypertrophy & Symmetry",
    level: "Intermediate",
    exercises: [
      // Day 1 (Push)
      { name: "Flat Barbell Bench Press", type: "strength", sets: 4, reps: 8, weight: "95 lbs", day: 1, note: "Control down to chest, explode upward. Rest 90s." },
      { name: "Incline Dumbbell Press", type: "strength", sets: 3, reps: 10, weight: "2x 30 lbs", day: 1, note: "30-degree incline. Keep chest tall, push up cleanly." },
      { name: "Standing Overhead Press (OHP)", type: "strength", sets: 3, reps: 8, weight: "45 lbs", day: 1, note: "Brace glutes and core to protect spine. Lift bar to ceiling." },
      { name: "Dumbbell Lateral Raises", type: "strength", sets: 4, reps: 12, weight: "2x 12.5 lbs", day: 1, note: "Control the negative. Do not swing your body." },
      { name: "Overhead Dumbbell Tricep Extension", type: "strength", sets: 3, reps: 12, weight: "25 lbs", day: 1, note: "Keep elbows tucked forward, isolate triceps contraction." },
      // Day 2 (Pull)
      { name: "Bent-Over Barbell Rows", type: "strength", sets: 4, reps: 8, weight: "75 lbs", day: 2, note: "Hinge at hip, pull bar to navel. Keep spine neutral." },
      { name: "Chin-ups / Pull-ups", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 2, note: "Full range of motion, dead hang to chest above bar." },
      { name: "Seated Dumbbell Bicep Curls", type: "strength", sets: 3, reps: 12, weight: "2x 15 lbs", day: 2, note: "Squeeze biceps at top. Supinate wrist dynamically." },
      { name: "Cable Face Pulls", type: "strength", sets: 3, reps: 15, weight: "25 lbs", day: 2, note: "Focus on rear delts and mid-traps alignment." },
      { name: "DB Hammer Curls", type: "strength", sets: 3, reps: 10, weight: "2x 15 lbs", day: 2, note: "Keep palms facing each other to target brachialis." },
      // Day 3 (Legs)
      { name: "Barbell Back Squats", type: "strength", sets: 4, reps: 8, weight: "115 lbs", day: 3, note: "Drive knees out, drop below parallel, explode up." },
      { name: "Romanian Deadlifts (RDLs)", type: "strength", sets: 3, reps: 10, weight: "85 lbs", day: 3, note: "Hinge backward until hamstring stretch, stand and squeeze." },
      { name: "Leg Press", type: "strength", sets: 3, reps: 12, weight: "135 lbs", day: 3, note: "Slow eccentric descent. Sled safety on at all times." },
      { name: "Standing Calf Raises", type: "strength", sets: 4, reps: 15, weight: "40 lbs", day: 3, note: "2-second stretch at bottom, 1-second squeeze at top." }
    ]
  },
  {
    id: "cardio-fatburn",
    title: "Cardio & Fat-Burning Engine",
    badge: "Emphasis: Calorie Burn & Endurance",
    description: "Optimized for cardiovascular stamina, VO2 max improvement, and maximum metabolic expenditure using circuits.",
    theme: "coral",
    goal: "Fat Loss & Aerobic Conditioning",
    level: "Beginner",
    exercises: [
      // Day 1
      { name: "Cardio (Running Intervals)", type: "cardio", sets: 1, reps: 1, duration: "30m", day: 1, note: "Alternate 1m sprint with 1m light jog for 30 minutes." },
      { name: "Kettlebell Swings", type: "strength", sets: 4, reps: 20, weight: "25 lbs", day: 1, note: "Hinge at hip, drive dynamically through glutes, not arms." },
      { name: "Jumping Jacks", type: "cardio", sets: 4, reps: 30, day: 1, note: "Stay light on your toes. Quick steady cadence." },
      { name: "Mountain Climbers", type: "cardio", sets: 3, duration: "45s", day: 1, note: "Keep plank posture flat, drive knees aggressively." },
      // Day 2
      { name: "Rowing Machine", type: "cardio", sets: 1, reps: 1, duration: "25m", day: 2, note: "25 minutes steady-state rowing. Focus on leg drive." },
      { name: "Burpees Circuit", type: "cardio", sets: 4, reps: 10, day: 2, note: "Chest to floor, jump tall with arms overhead." },
      { name: "Plank Dynamic holds", type: "strength", sets: 3, duration: "60s", day: 2, note: "Engage entire core. Do not let hips sag." },
      { name: "Bicycle Crunches", type: "strength", sets: 3, reps: 20, day: 2, note: "Twist elbow to opposite knee, slow controlled reps." },
      // Day 3
      { name: "Incline Treadmill Walk", type: "cardio", sets: 1, reps: 1, duration: "35m", day: 3, note: "12% incline at 3.0 mph. Highly metabolic." },
      { name: "Dumbbell Thrusters", type: "strength", sets: 3, reps: 12, weight: "2x 10 lbs", day: 3, note: "Deep squat straight into overhead shoulder press." },
      { name: "Jump Squats", type: "cardio", sets: 3, reps: 15, day: 3, note: "Land softly. Dissipate impact through glutes and knees." },
      { name: "Bodyweight Plank Jacks", type: "cardio", sets: 3, reps: 20, day: 3, note: "Keep hands stacked under shoulders, hop feet wide." }
    ]
  },
  {
    id: "strength-catalyst",
    title: "Full-Body Strength Catalyst",
    badge: "Emphasis: Heavy Barbell Compounds",
    description: "Focuses on absolute strength gains across major functional movement patterns utilizing heavy multi-joint lifts.",
    theme: "pink",
    goal: "Absolute Total-Body Strength",
    level: "Advanced",
    exercises: [
      // Day 1
      { name: "Back Squats (5x5 Power)", type: "strength", sets: 5, reps: 5, weight: "135 lbs", day: 1, note: "Focus on clean depth. Rest 2-3 minutes between sets." },
      { name: "Flat Bench Press (5x5 Power)", type: "strength", sets: 5, reps: 5, weight: "115 lbs", day: 1, note: "Squeeze shoulder blades, drive legs to push bar up." },
      { name: "Weighted Pull-ups", type: "strength", sets: 3, reps: 6, weight: "+10 lbs", day: 1, note: "Controlled negative, chest to bar. Standard grip." },
      { name: "Core Planks", type: "strength", sets: 3, duration: "60s", day: 1, note: "Fully squeeze glutes and abs to resist load." },
      // Day 2
      { name: "Overhead Barbell Press", type: "strength", sets: 5, reps: 5, weight: "65 lbs", day: 2, note: "Squeeze glutes, push barbell straight over nose." },
      { name: "Barbell Deadlifts (Heavy)", type: "strength", sets: 3, reps: 5, weight: "155 lbs", day: 2, note: "Drag bar up shins, drive hips forward to lockout." },
      { name: "Incline Dumbbell Press", type: "strength", sets: 3, reps: 8, weight: "2x 35 lbs", day: 2, note: "Deep stretch at bottom, strong push to lockout." },
      { name: "Hanging Knee Raises", type: "strength", sets: 3, reps: 15, day: 2, note: "Lift knees to chest, avoid swinging on descent." },
    ]
  },
  {
    id: "calisthenics-mastery",
    title: "Calisthenics & Bodyweight Mastery",
    badge: "Emphasis: Relative Strength & Skill",
    description: "Build exceptional control over your own bodyweight with progressive gymnastic movements, levers, and absolute core control.",
    theme: "emerald",
    goal: "Relative Bodyweight Strength & Skill Mastery",
    level: "Advanced",
    exercises: [
      // Day 1 (Push & Core)
      { name: "Muscle-up / Pull-up Progression", type: "strength", sets: 4, reps: 5, weight: "Bodyweight", day: 1, note: "Explode bar to hips, focus on transition phase. Standard grip." },
      { name: "Parallel Bar Dips", type: "strength", sets: 4, reps: 10, weight: "Bodyweight", day: 1, note: "Lean slightly forward to engage lower chest fibers, lock out fully." },
      { name: "Decline/Diamond Push-ups", type: "strength", sets: 3, reps: 15, weight: "Bodyweight", day: 1, note: "Fingers in diamond shape, elbows tucked close to ribcage." },
      { name: "L-Sit holds (Floor or Parallettes)", type: "strength", sets: 3, duration: "15s", day: 1, note: "Lock elbows, depress shoulders, keep legs locked straight." },
      // Day 2 (Pull & Legs)
      { name: "Standard Pull-ups", type: "strength", sets: 4, reps: 8, weight: "Bodyweight", day: 2, note: "Full dead hang to chin above bar, slow 3s eccentric descent." },
      { name: "Australian Rows (Parallettes)", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 2, note: "Pull chest straight to bar, retract shoulder blades fully." },
      { name: "Pistol Squats (Single Leg)", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 2, note: "One leg straight out, drop to full depth, drive up through heel." },
      { name: "Shrimp Squats (Progression)", type: "strength", sets: 3, reps: 8, weight: "Bodyweight", day: 2, note: "Hold back foot, drop back knee to light touch on floor, stand." },
      // Day 3 (Skills & Conditioning)
      { name: "Handstand holds (Wall Supported)", type: "strength", sets: 4, duration: "30s", day: 3, note: "Press shoulders tall, hollow body shape, head neutral." },
      { name: "Planched Push-up Leans", type: "strength", sets: 3, duration: "10s", day: 3, note: "Lean shoulders forward past hands, keep scapula fully protracted." },
      { name: "Archer Push-ups", type: "strength", sets: 3, reps: 10, weight: "Bodyweight", day: 3, note: "Extend one arm completely straight, lower chest to opposite hand." },
      { name: "Hanging Leg Raises", type: "strength", sets: 3, reps: 12, weight: "Bodyweight", day: 3, note: "Raise toes directly to touch pull-up bar, do not swing." }
    ]
  }
]

export function RoutinesLibrary() {
  const { user, isSignedIn } = useUser()
  const userId = isSignedIn && user ? user.id : "default-user"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<string>("All")
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null)
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)

  // Filter routines based on search and goal selector
  const filteredRoutines = ROUTINE_LIBRARY.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goal.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGoal = selectedGoal === "All" || item.level === selectedGoal
    return matchesSearch && matchesGoal
  })

  // Set active routine in planStore via Next.js API
  const handleActivateRoutine = async (routine: Routine) => {
    try {
      setActivatingId(routine.id)
      console.log(`📡 [Routines Library] Activating split: "${routine.title}" for user:`, userId)
      
      const formattedExercises = routine.exercises.map((ex) => ({
        name: ex.name,
        type: ex.type,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || "",
        duration: ex.duration || "",
        day: ex.day,
        note: ex.note || "",
        img: ex.img || ""
      }))

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planType: "workout",
          customPlan: formattedExercises,
          userMessage: `Customized with routine: ${routine.title}`
        })
      })

      if (response.ok) {
        setActiveRoutineId(routine.id)
        setShowSyncSuccess(true)
        console.log(`✅ [Routines Library] Split "${routine.title}" active in planStore.`)

        // Trigger context refresh across panels
        window.dispatchEvent(new CustomEvent("refreshContext"))

        setTimeout(() => {
          setShowSyncSuccess(false)
        }, 4000)
      } else {
        throw new Error(`Failed to activate: ${response.statusText}`)
      }
    } catch (e) {
      console.error("Failed to activate routine:", e)
      alert("Unable to activate routine. Check your connection or server console.")
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

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interactive Splits Library
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Select Workout Program</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Browse and activate professionally designed workout splits. Click **Activate** to dynamically update your active daily checklist and dashboard telemetry instantly.
        </p>
      </div>

      {/* 2. Success Alert Box */}
      {showSyncSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Routine Activated Successfully!</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
              Unified stores synchronized. Switch to the **Workouts** tab to view your updated active set checklist.
            </p>
          </div>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search programs by muscle groups or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs bg-slate-950/60 border border-white/5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-950/60 border border-white/5 rounded-2xl">
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedGoal(lvl)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                selectedGoal === lvl
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-500 hover:text-slate-350"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Program List */}
      <div className="space-y-4">
        {filteredRoutines.length === 0 ? (
          <div className="glass-panel rounded-3xl py-12 text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No workout splits found matching that search.</p>
          </div>
        ) : (
          filteredRoutines.map((routine) => {
            const styles = getThemeStyles(routine.theme)
            const isExpanded = expandedRoutine === routine.id
            const isActive = activeRoutineId === routine.id
            const isActivating = activatingId === routine.id

            return (
              <div
                key={routine.id}
                className={cn(
                  "glass-panel rounded-3xl overflow-hidden transition-all duration-300 relative border",
                  styles.border,
                  isActive ? "bg-slate-950/50 shadow-lg shadow-black/85" : "bg-slate-950/10"
                )}
              >
                {/* Visual Accent Glow on Hover */}
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 hover:opacity-[0.03] pointer-events-none transition-all duration-300", styles.glow)} />

                {/* Card Header summary */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border", styles.badge)}>
                      {routine.badge}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                      Level: {routine.level}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white tracking-tight leading-snug">{routine.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{routine.description}</p>

                  <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                    <div className="flex-1 text-[10px] text-slate-500 font-medium">
                      Goal Focus: <span className="text-slate-300 font-semibold">{routine.goal}</span>
                    </div>

                    <button
                      onClick={() => setExpandedRoutine(isExpanded ? null : routine.id)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Hide Splits <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Show Exercises <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Splits Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5 bg-slate-950/30 space-y-5 pt-5 animate-in slide-in-from-top duration-300">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      Detailed 3-Day Exercise Telemetry
                    </h5>

                    {/* Group by Day */}
                    {[1, 2, 3].map((day) => {
                      const dayExercises = routine.exercises.filter((ex) => ex.day === day)
                      if (dayExercises.length === 0) return null

                      return (
                        <div key={day} className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/5">
                            <span>Day {day} Routine</span>
                            <span className={styles.accentText}>{dayExercises.length} Movements Prescribed</span>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            {dayExercises.map((ex, index) => (
                              <div key={index} className="flex justify-between items-start gap-4 text-xs">
                                <div className="flex-1">
                                  <span className="font-bold text-white leading-snug">{ex.name}</span>
                                  {ex.note && (
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal italic font-medium">
                                      Tip: {ex.note}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="font-mono text-slate-350 font-semibold">
                                    {ex.sets}s × {ex.reps}r
                                  </span>
                                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">
                                    {ex.weight || ex.duration || "Bodyweight"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {/* Activation Button */}
                    <div className="pt-2 border-t border-white/5">
                      <Button
                        onClick={() => handleActivateRoutine(routine)}
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
                            Synchronizing Active Client Plan...
                          </>
                        ) : isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            This Split Is Active Right Now
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Activate Program & Start Training
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
