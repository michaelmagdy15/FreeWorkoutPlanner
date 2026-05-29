"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Dumbbell, Plus, Zap, Play, Pause, RotateCcw, Volume2, Award, ChevronDown, ChevronUp, Scale, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useFitnessData } from "@/hooks/useFitnessData"
import { PlannedWorkout, WorkoutEntry } from "@/lib/api"
import { calculateOverload } from "@/lib/overload"
import { PlateCalculator } from "@/components/plate-calculator"

// Workout split days structure
const WORKOUT_DAYS = [
  {
    day: 1,
    title: "Shock the Lower Body",
    badge: "Emphasis: Glutes & Hamstrings",
    goal: "Force structural growth and deep leg strength by stepping out of rigid machine paths and utilizing free weights.",
    warmup: {
      id: "d1-warmup",
      details: "5 Minutes steady cycling + Dynamic Leg Swings & Bodyweight Good Mornings (1 Set x 15 Reps)."
    }
  },
  {
    day: 2,
    title: "Sculpt & Re-align",
    badge: "Emphasis: Hourglass & Posture Focus",
    goal: "Emphasize the shoulders and upper back to create a subtle, beautiful taper that naturally highlights the waist and supports spine posture.",
    warmup: {
      id: "d2-warmup",
      details: "5 Minutes dynamic arm swings, light band pull-aparts, and shoulder circles (1 Set x 15 Reps)."
    }
  },
  {
    day: 3,
    title: "Burn & Hammer",
    badge: "Emphasis: Posterior Chain & Conditioning",
    goal: "High metabolic output, burning energy while hammering the entire body with functional free-weight compounds.",
    warmup: {
      id: "d3-warmup",
      details: "5 Minutes Treadmill walk + Dynamic stretching exercises."
    }
  }
]

interface WorkoutTrackerProps {
  loggedWorkouts?: WorkoutEntry[]
  currentPlan?: PlannedWorkout[]
  shouldScaleVolume?: boolean
}

export function WorkoutTracker({ loggedWorkouts = [], currentPlan = [], shouldScaleVolume = false }: WorkoutTrackerProps) {
  const { logNewEntry } = useFitnessData()

  // Dynamic set calculator based on RPE readiness scaling
  const getExerciseSets = useCallback((exercise: any) => {
    if (shouldScaleVolume && exercise.type !== "cardio") {
      return Math.max(1, (exercise.sets || 3) - 1);
    }
    return exercise.sets || 3;
  }, [shouldScaleVolume]);

  // Plate Calculator Modal weight state
  const [calculatorWeight, setCalculatorWeight] = useState<number | null>(null);

  // Accelerometer states for real-time velocity coaching
  const [accelData, setAccelData] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [liftingTempoStatus, setLiftingTempoStatus] = useState<string>("Standby");
  const [tempoWarning, setTempoWarning] = useState<boolean>(false);

  // 1. Tab Management (Day 1 / Day 2 / Day 3)
  const [activeDay, setActiveDay] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mirna_workout_last_day")
      if (saved) {
        const val = parseInt(saved, 10)
        if (val >= 1 && val <= 3) return val
      }
    }
    return 1
  })

  useEffect(() => {
    localStorage.setItem("mirna_workout_last_day", activeDay.toString())
  }, [activeDay])

  // Get active day metadata
  const activeDayMeta = useMemo(() => {
    return WORKOUT_DAYS.find((w) => w.day === activeDay) || WORKOUT_DAYS[0]
  }, [activeDay])

  // Filter plan exercises for active day
  const activePlanExercises = useMemo(() => {
    return currentPlan.filter((ex: any) => ex.day === activeDay)
  }, [currentPlan, activeDay])

  // 2. Checklist & Overload Tracking (localStorage persistence)
  const [progress, setProgress] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mirna_workout_progress")
      if (saved) {
        try { return JSON.parse(saved) } catch (e) { return {} }
      }
    }
    return {}
  })

  const [warmupProgress, setWarmupProgress] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const d1 = localStorage.getItem("mirna_workout_warmup_d1-warmup") === "true"
      const d2 = localStorage.getItem("mirna_workout_warmup_d2-warmup") === "true"
      const d3 = localStorage.getItem("mirna_workout_warmup_d3-warmup") === "true"
      return { "d1-warmup": d1, "d2-warmup": d2, "d3-warmup": d3 }
    }
    return { "d1-warmup": false, "d2-warmup": false, "d3-warmup": false }
  })

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("mirna_workout_progress", JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    Object.entries(warmupProgress).forEach(([key, value]) => {
      localStorage.setItem(`mirna_workout_warmup_${key}`, value ? "true" : "false")
    })
  }, [warmupProgress])

  // Expandable Exercise Drawers
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedExercises(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // 3. Audio & Timer Synthesis Pipeline
  const audioCtxRef = useRef<AudioContext | null>(null)
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const restTimerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioAlertRef = useRef<HTMLAudioElement | null>(null)

  const [restTimer, setRestTimer] = useState({
    duration: 90,
    timeLeft: 90,
    isRunning: false,
    startTime: 0,
    startDuration: 90
  })

  const [metronome, setMetronome] = useState({
    isPlaying: false,
    step: 0,
    seconds: 3,
    phase: "LOWER (3s)"
  })

  const [sessionTime, setSessionTime] = useState("00:00")

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playTick = useCallback((frequency: number, type: OscillatorType = "sine", duration = 0.08, volume = 0.3) => {
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {
      console.warn("Web Audio synthesis blocked:", e)
    }
  }, [getAudioContext])

  const playAlarmMelody = useCallback(() => {
    try {
      const notes = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.12 },   // E5
        { freq: 783.99, time: 0.24 },   // G5
        { freq: 1046.50, time: 0.36 }   // C6
      ]
      notes.forEach(note => {
        setTimeout(() => {
          playTick(note.freq, "sine", 0.25, 0.4)
        }, note.time * 1000)
      })
    } catch (e) {
      console.warn("Chime failed:", e)
    }
  }, [playTick])

  // Rest Timer Alarm Trigger
  const triggerRestComplete = useCallback(() => {
    const trackerEl = document.getElementById("rest-timer-box")
    if (trackerEl) {
      trackerEl.classList.remove("flash-coral")
      void trackerEl.offsetHeight // force reflow
      trackerEl.classList.add("flash-coral")
    }
    playAlarmMelody()
    if (audioAlertRef.current) {
      audioAlertRef.current.currentTime = 0
      audioAlertRef.current.play().catch(() => {})
    }
  }, [playAlarmMelody])

  // Rest Timer tick logic (background resilient)
  useEffect(() => {
    if (restTimer.isRunning) {
      restTimerIntervalRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - restTimer.startTime) / 1000)
        const remaining = restTimer.startDuration - elapsed

        if (remaining <= 0) {
          setRestTimer(prev => ({ ...prev, timeLeft: 0, isRunning: false }))
          if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
          triggerRestComplete()
        } else {
          setRestTimer(prev => ({ ...prev, timeLeft: remaining }))
        }
      }, 100)
    } else {
      if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
    }
    return () => {
      if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
    }
  }, [restTimer.isRunning, restTimer.startTime, restTimer.startDuration, triggerRestComplete])

  const toggleRestTimer = useCallback(() => {
    getAudioContext()
    setRestTimer(prev => {
      const trackerEl = document.getElementById("rest-timer-box")
      if (trackerEl) trackerEl.classList.remove("flash-coral")

      if (prev.isRunning) {
        return { ...prev, isRunning: false }
      } else {
        const durationLimit = prev.timeLeft <= 0 ? prev.duration : prev.timeLeft
        return {
          ...prev,
          isRunning: true,
          timeLeft: durationLimit,
          startDuration: durationLimit,
          startTime: Date.now()
        }
      }
    })
  }, [getAudioContext])

  const resetRestTimer = useCallback(() => {
    const trackerEl = document.getElementById("rest-timer-box")
    if (trackerEl) trackerEl.classList.remove("flash-coral")
    setRestTimer(prev => ({ ...prev, timeLeft: prev.duration, isRunning: false }))
  }, [])

  const changeRestPreset = useCallback((seconds: number) => {
    setRestTimer(prev => ({
      ...prev,
      duration: seconds,
      timeLeft: prev.isRunning ? prev.timeLeft : seconds
    }))
  }, [])

  // Metronome Loop
  const runMetronomeStep = useCallback(() => {
    setMetronome(prev => {
      const nextStep = (prev.step + 1) % 9
      let nextSec = prev.seconds
      let nextPhase = prev.phase

      switch (nextStep) {
        case 0:
          nextSec = 3
          nextPhase = "LOWER (3s)"
          playTick(420, "triangle", 0.08, 0.25)
          break
        case 2:
          nextSec = 2
          nextPhase = "LOWER (3s)"
          playTick(420, "triangle", 0.08, 0.25)
          break
        case 4:
          nextSec = 1
          nextPhase = "LOWER (3s)"
          playTick(420, "triangle", 0.08, 0.25)
          break
        case 6:
          nextSec = 0
          nextPhase = "NO PAUSE"
          playTick(520, "sine", 0.04, 0.12)
          break
        case 7:
          nextSec = 1
          nextPhase = "EXPLODE UP (1s)"
          playTick(840, "sine", 0.18, 0.35)
          break
      }

      return { ...prev, step: nextStep, seconds: nextSec, phase: nextPhase }
    })
  }, [playTick])

  const toggleMetronome = useCallback(() => {
    getAudioContext()
    setMetronome(prev => {
      if (prev.isPlaying) {
        if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
        return { isPlaying: false, step: 0, seconds: 3, phase: "LOWER (3s)" }
      } else {
        playTick(420, "triangle", 0.08, 0.25)
        metronomeIntervalRef.current = setInterval(runMetronomeStep, 500)
        return { ...prev, isPlaying: true, step: 0, seconds: 3, phase: "LOWER (3s)" }
      }
    })
  }, [getAudioContext, runMetronomeStep, playTick])

  useEffect(() => {
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
    }
  }, [])

  // Handle device motion for lift velocity pacing check using browser accelerometers
  useEffect(() => {
    if (!metronome.isPlaying) {
      setLiftingTempoStatus("Standby")
      setTempoWarning(false)
      return
    }
    
    let speedExceededCount = 0
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity
      if (!accel) return
      
      const x = accel.x || 0
      const y = accel.y || 0
      const z = accel.z || 0
      
      setAccelData({ x, y, z })
      
      // Calculate overall acceleration magnitude
      const magnitude = Math.sqrt(x*x + y*y + z*z)
      
      // Dynamic motion rules checking eccentric speed
      if (metronome.phase.includes("LOWER")) {
        if (magnitude > 13.5) {
          speedExceededCount++
          if (speedExceededCount > 3) {
            setLiftingTempoStatus("Dropping Too Fast! ⚠️")
            setTempoWarning(true)
          }
        } else {
          setLiftingTempoStatus("Good Controlled Pace ✅")
          setTempoWarning(false)
        }
      } else if (metronome.phase.includes("EXPLODE")) {
        setLiftingTempoStatus("Concentric Power 🔥")
        setTempoWarning(false)
      }
    }
    
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      const reqPermission = (DeviceMotionEvent as any).requestPermission
      if (typeof reqPermission === "function") {
        reqPermission().then((state: string) => {
          if (state === "granted") {
            window.addEventListener("devicemotion", handleMotion)
          }
        }).catch(() => {})
      } else {
        window.addEventListener("devicemotion", handleMotion)
      }
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion)
      }
    }
  }, [metronome.isPlaying, metronome.phase])

  // Active workout session stopwatch
  useEffect(() => {
    let startVal = localStorage.getItem("mirna_workout_stopwatch_start")
    if (!startVal) {
      startVal = Date.now().toString()
      localStorage.setItem("mirna_workout_stopwatch_start", startVal)
    }
    const startTimestamp = parseInt(startVal, 10)

    const stopwatchInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      setSessionTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(stopwatchInterval)
  }, [])

  // 4. Seeding Checkbox & Logging Interactions
  const handleSetRowChange = useCallback((exerciseId: string, setNum: number, field: string, value: string) => {
    const key = `${exerciseId}_set_${setNum}`
    setProgress(prev => {
      const prevData = prev[key] || { completed: false }
      return { ...prev, [key]: { ...prevData, [field]: value } }
    })
  }, [])

  const toggleSetComplete = useCallback(async (exercise: any, setNum: number, defaultReps: number) => {
    const key = `${exercise.id}_set_${setNum}`
    getAudioContext()

    let nextCompleted = false
    setProgress(prev => {
      const prevData = prev[key] || { completed: false, weight: "", reps: defaultReps }
      nextCompleted = !prevData.completed

      if (nextCompleted) {
        playTick(600, "sine", 0.1, 0.2)
      }

      return {
        ...prev,
        [key]: {
          ...prevData,
          completed: nextCompleted,
          reps: prevData.reps !== undefined && prevData.reps !== "" ? prevData.reps : defaultReps
        }
      }
    })

    // If this checking completes the LAST uncompleted set of the exercise, log it to Next.js API!
    setTimeout(async () => {
      // Calculate how many sets are now completed
      const totalSets = exercise.sets
      let completedCount = 0
      for (let s = 1; s <= totalSets; s++) {
        const setKey = `${exercise.id}_set_${s}`
        // Get fresh localStorage values because state updates asynchronously
        const savedProgress = JSON.parse(localStorage.getItem("mirna_workout_progress") || "{}")
        if (savedProgress[setKey]?.completed) {
          completedCount++
        }
      }

      if (completedCount === totalSets && nextCompleted) {
        console.log(`💪 All ${totalSets} sets of "${exercise.name}" completed! Logging to DB...`)
        // Gather overload statistics for the log
        const firstSetKey = `${exercise.id}_set_1`
        const localProgress = JSON.parse(localStorage.getItem("mirna_workout_progress") || "{}")
        const weightAchieved = localProgress[firstSetKey]?.weight || exercise.weight || "Bodyweight"
        
        await logNewEntry("workout", {
          workout: {
            name: exercise.name,
            type: exercise.type,
            duration: exercise.type === "cardio" ? (exercise.duration || 20) : (totalSets * 3), // Estimate minutes
            sets: totalSets,
            reps: exercise.reps,
            weight: weightAchieved,
            completed: true
          }
        })
      }
    }, 150)

  }, [getAudioContext, playTick, logNewEntry])

  const toggleWarmup = useCallback((warmupId: string) => {
    getAudioContext()
    setWarmupProgress(prev => {
      const nextVal = !prev[warmupId]
      if (nextVal) {
        playTick(600, "sine", 0.1, 0.2)
      }
      return { ...prev, [warmupId]: nextVal }
    })
  }, [getAudioContext, playTick])

  const resetAllProgress = useCallback(() => {
    const confirmReset = window.confirm("Are you sure you want to clear all workout progress and start fresh?")
    if (!confirmReset) return

    setProgress({})
    setWarmupProgress({ "d1-warmup": false, "d2-warmup": false, "d3-warmup": false })
    const nowTime = Date.now().toString()
    localStorage.setItem("mirna_workout_stopwatch_start", nowTime)
  }, [])

  // Calculate current completion percentage
  const currentProgressStats = useMemo(() => {
    if (activePlanExercises.length === 0) return { percentage: 0, completed: 0, total: 0 }

    let total = 0
    let completed = 0

    activePlanExercises.forEach((ex: any) => {
      const setTotal = ex.sets || 1
      for (let s = 1; s <= setTotal; s++) {
        total++
        const key = `${ex.id}_set_${s}`
        if (progress[key]?.completed) {
          completed++
        }
      }
    })

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { percentage, completed, total }
  }, [activePlanExercises, progress])

  // Check if progressive overload is fully achieved
  const isOverloadAchieved = useCallback((exercise: any) => {
    const totalSets = exercise.sets || 1
    let completedCount = 0
    let maxRepsCount = 0

    for (let s = 1; s <= totalSets; s++) {
      const key = `${exercise.id}_set_${s}`
      if (progress[key]?.completed) {
        completedCount++
        const repsVal = parseInt(progress[key]?.reps ?? exercise.reps, 10)
        if (repsVal >= exercise.reps) {
          maxRepsCount++
        }
      }
    }
    return completedCount === totalSets && maxRepsCount === totalSets
  }, [progress])

  const formattedRestTimer = useMemo(() => {
    const mins = Math.floor(restTimer.timeLeft / 60)
    const secs = restTimer.timeLeft % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [restTimer.timeLeft])

  return (
    <div className="space-y-6">
      {/* Audio chime element backup */}
      <audio ref={audioAlertRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav" preload="auto" style={{ display: "none" }} />

      {/* 1. Day Switching Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-950/60 border border-white/5 rounded-2xl">
        {WORKOUT_DAYS.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={cn(
              "flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all duration-300 text-center uppercase tracking-wider",
              activeDay === d.day
                ? "btn-premium shadow-lg shadow-coral-500/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* 2. Welcome Plan Card */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-coral-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold uppercase px-2 py-1 rounded-md bg-coral-500/10 text-primary">
            Active Routine
          </span>
          <span className="text-xs text-slate-400 font-medium">Day {activeDay} of 3</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">{activeDayMeta.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{activeDayMeta.goal}</p>

        {/* Dynamic progress bar */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">Workout Completion</span>
            <span className="text-primary font-bold">{currentProgressStats.percentage}%</span>
          </div>
          <Progress value={currentProgressStats.percentage} className="h-2 bg-slate-950/50" />
        </div>
      </div>

      {/* 3. Session Stopwatch & Rest Timer Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-center items-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Session Clock</span>
          <span className="text-2xl font-extrabold text-white mt-1 font-mono tracking-tight">{sessionTime}</span>
        </div>

        <div id="rest-timer-box" className="glass-panel rounded-2xl p-4 transition-all duration-300 flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Optimal Rest</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {formattedRestTimer}
            </span>
            <button
              onClick={toggleRestTimer}
              className={cn(
                "p-1.5 rounded-full transition-all",
                restTimer.isRunning ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
              )}
            >
              {restTimer.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button onClick={resetRestTimer} className="p-1.5 rounded-full bg-white/5 text-slate-400">
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button onClick={() => changeRestPreset(60)} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
              60s
            </button>
            <button onClick={() => changeRestPreset(90)} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
              90s
            </button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Tempo Coach (3-0-1 Cadence Metronome) */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-secondary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Tempo Coach (3-0-1)</h4>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMetronome}
            className={cn(
              "h-7 px-3 rounded-xl text-xs font-bold",
              metronome.isPlaying 
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                : "bg-secondary/10 text-secondary hover:bg-secondary/20"
            )}
          >
            {metronome.isPlaying ? "Stop" : "Start"}
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/40 border border-white/5 p-3 rounded-xl">
          <div className="relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-slate-900 overflow-hidden flex-shrink-0">
            {metronome.isPlaying && (
              <div 
                className={cn(
                  "absolute inset-0 rounded-full bg-secondary/20 tempo-pulse",
                  metronome.phase.includes("EXPLODE") && "bg-primary/40 animate-ping"
                )} 
              />
            )}
            <span className="text-lg font-black text-white font-mono z-10">{metronome.seconds}s</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Phase</div>
            <div className="text-sm font-black text-white uppercase tracking-wider mt-0.5">
              {metronome.phase}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              3s slow eccentric (down) ➔ 0s hold ➔ 1s explosive concentric (up).
            </p>
          </div>
        </div>

        {/* Dynamic Velocity Accel Coach feedback banner */}
        {metronome.isPlaying && (
          <div className={cn(
            "mt-3 p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all duration-300",
            tempoWarning 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse" 
              : "bg-slate-900/40 border-white/5 text-slate-305"
          )}>
            <span className="font-semibold uppercase tracking-wider text-[9px] text-slate-400">Accelerometer feedback:</span>
            <span className="font-black flex items-center gap-1.5 uppercase font-mono">
              <span className={cn("w-2 h-2 rounded-full", tempoWarning ? "bg-amber-500" : "bg-emerald-400")} />
              {liftingTempoStatus}
            </span>
          </div>
        )}
      </div>

      {/* 5. Dynamic Warm-up Checklist */}
      <div className="glass-panel rounded-2xl p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Warm-up Checklist</h4>
        <button
          onClick={() => toggleWarmup(activeDayMeta.warmup.id)}
          className={cn(
            "w-full p-3.5 rounded-xl border text-left transition-all",
            warmupProgress[activeDayMeta.warmup.id]
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/10"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-4 h-4 rounded-full mt-0.5 flex items-center justify-center flex-shrink-0",
              warmupProgress[activeDayMeta.warmup.id] ? "bg-green-500" : "bg-slate-700"
            )}>
              {warmupProgress[activeDayMeta.warmup.id] && (
                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider block mb-0.5 text-slate-400">
                5-Min Mobilization
              </span>
              <p className="text-xs font-medium leading-relaxed">{activeDayMeta.warmup.details}</p>
            </div>
          </div>
        </button>
      </div>

      {/* 6. Active Exercise Deck */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exercise Deck</h4>
          <button onClick={resetAllProgress} className="text-[10px] font-bold text-primary/70 hover:text-primary">
            Reset Checklist
          </button>
        </div>

        {activePlanExercises.length === 0 ? (
          <div className="glass-panel rounded-3xl py-12 text-center">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No seeded workouts found. Generate one in Chat!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activePlanExercises.map((exercise: any) => {
              const isExpanded = !!expandedExercises[exercise.id]
              const overloadMet = isOverloadAchieved(exercise)

              return (
                <div 
                  key={exercise.id} 
                  className={cn(
                    "glass-panel rounded-2xl overflow-hidden transition-all duration-200",
                    overloadMet ? "border-green-500/20 bg-green-950/5" : ""
                  )}
                >
                  {/* Summary Card Header */}
                  <div 
                    onClick={() => toggleExpand(exercise.id)}
                    className="p-4 flex items-start justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                          exercise.type === "cardio" ? "bg-blue-500/10 text-blue-400" : "bg-primary/10 text-primary"
                        )}>
                          {exercise.type === "cardio" ? "Cardio" : "Strength"}
                        </span>
                        {overloadMet && (
                          <span className="text-[9px] font-black bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Award className="w-2.5 h-2.5" /> Target Achieved
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                        {exercise.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        {getExerciseSets(exercise)} Sets × {exercise.reps} Reps | Target: <span className="text-slate-300 font-semibold">{exercise.weight || "Bodyweight"}</span>
                      </p>
                    </div>
                    <div className="text-slate-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/5 bg-slate-950/20 space-y-4 pt-4 animate-in duration-200">
                      {/* Exercise illustration if available */}
                      {exercise.img && (
                        <div className="w-full aspect-square relative rounded-xl overflow-hidden border border-white/5 bg-slate-900 flex items-center justify-center">
                          <img 
                            src={exercise.img} 
                            alt={exercise.name} 
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>
                      )}

                      {/* Instructions */}
                      {exercise.note && (
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Coach Instructions</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-medium">{exercise.note}</p>
                        </div>
                      )}

                      {/* Progressive Overload Recommendation Banner */}
                      {(() => {
                        const overloadSuggestion = calculateOverload(
                          loggedWorkouts, 
                          exercise.name, 
                          exercise.reps, 
                          parseFloat(exercise.weight) || 20
                        );
                        if (!overloadSuggestion) return null;
                        return (
                          <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-2.5">
                            <Zap className="w-4 h-4 text-[hsl(var(--primary))] mt-0.5 flex-shrink-0 animate-pulse" />
                            <div>
                              <span className="text-[9px] font-black uppercase text-[hsl(var(--primary))] tracking-wider block">Recommended Overload Progression</span>
                              <p className="text-xs text-slate-350 leading-relaxed mt-0.5 font-bold">
                                Target: <span className="text-white font-black">{overloadSuggestion.suggestedWeight}kg</span> for <span className="text-white font-black">{overloadSuggestion.suggestedReps} reps</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{overloadSuggestion.reason}</p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Set Checklist Block */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Set Tracker & Progressive Overload</span>
                          {exercise.type !== "cardio" && (
                            <button
                              onClick={() => {
                                const wtVal = parseFloat(exercise.weight) || 20;
                                setCalculatorWeight(wtVal);
                              }}
                              type="button"
                              className="px-2 py-0.5 rounded-lg bg-slate-900/60 border border-white/5 text-[9px] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                            >
                              <Scale className="w-3.5 h-3.5 text-slate-400" />
                              Plate Calculator
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {Array.from({ length: getExerciseSets(exercise) }).map((_, index) => {
                            const setNum = index + 1
                            const setKey = `${exercise.id}_set_${setNum}`
                            const setData = progress[setKey] || { completed: false, weight: "", reps: exercise.reps.toString() }

                            return (
                              <div 
                                key={setNum}
                                className={cn(
                                  "flex items-center gap-3 p-2 border border-white/5 rounded-xl transition-all",
                                  setData.completed 
                                    ? "bg-green-500/10 border-green-500/20" 
                                    : "bg-slate-900/40"
                                )}
                              >
                                {/* Set number badge */}
                                <div className="text-xs font-mono font-black text-slate-500 w-8">
                                  S{setNum}
                                </div>

                                {/* Weight Input */}
                                <div className="flex-1 min-w-0">
                                  <input 
                                    type="text" 
                                    placeholder={exercise.weight || "Weight"}
                                    value={setData.weight || ""}
                                    onChange={(e) => handleSetRowChange(exercise.id, setNum, "weight", e.target.value)}
                                    disabled={setData.completed}
                                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-2 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                  />
                                </div>

                                {/* Reps Input */}
                                <div className="w-16">
                                  <input 
                                    type="number" 
                                    placeholder={exercise.reps.toString()}
                                    value={setData.reps !== undefined ? setData.reps : ""}
                                    onChange={(e) => handleSetRowChange(exercise.id, setNum, "reps", e.target.value)}
                                    disabled={setData.completed}
                                    className="w-full bg-slate-950/60 border border-white/5 rounded-lg px-2 py-1 text-xs text-center text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                  />
                                </div>

                                {/* Completed Check button */}
                                <button
                                  onClick={() => toggleSetComplete(exercise, setNum, exercise.reps)}
                                  className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                                    setData.completed 
                                      ? "bg-green-500 text-black shadow-lg shadow-green-500/20" 
                                      : "bg-slate-800 hover:bg-slate-700 text-slate-500"
                                  )}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Barbell Plate Loader Modal */}
      {calculatorWeight !== null && (
        <PlateCalculator
          targetWeight={calculatorWeight}
          isOpen={calculatorWeight !== null}
          onClose={() => setCalculatorWeight(null)}
        />
      )}
    </div>
  )
}
