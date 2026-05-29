"use client"

import { useEffect, useState } from "react"
import { Activity, Dumbbell, Award, Flame } from "lucide-react"

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const steps = [
    { text: "Initializing biometric telemetry...", icon: Activity, color: "text-[hsl(var(--primary))]" },
    { text: "Synchronizing calisthenics & fitness engine...", icon: Dumbbell, color: "text-[hsl(var(--secondary))]" },
    { text: "Synthesizing meal & nutrition catalog...", icon: Flame, color: "text-emerald-400" },
    { text: "Calibrating dynamic AI coaching agent...", icon: Award, color: "text-amber-400" },
    { text: "Ready to train...", icon: Activity, color: "text-white" }
  ]

  useEffect(() => {
    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        // Increment faster in the beginning, then slower near 100
        const increment = prev < 50 ? 1.8 : prev < 85 ? 1.0 : 0.6
        return Math.min(prev + increment, 100)
      })
    }, 20)

    // Step text transitions based on timeline milestones
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(stepInterval)
        return prev
      })
    }, 450)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setFadeOut(true)
        const completeTimeout = setTimeout(() => {
          if (onComplete) onComplete()
        }, 700) // matches the opacity transition duration
        return () => clearTimeout(completeTimeout)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  const ActiveIcon = steps[step]?.icon || Activity

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Radial Glow System */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.06)_0%,rgba(0,0,0,0)_75%)] pointer-events-none" />

      {/* Subtle Micro-particle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[hsl(var(--secondary))] rounded-full animate-ping [animation-delay:1.2s]" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping [animation-delay:0.6s]" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-amber-400 rounded-full animate-ping [animation-delay:1.8s]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center">
        {/* Pulsing Logo Core */}
        <div className="relative mb-10 p-6 rounded-full bg-slate-900/60 border border-white/5 shadow-2xl flex items-center justify-center">
          {/* Pulse gradient backgrounds */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-15 blur-xl animate-pulse" />
          
          {/* Dynamic rotating gradient border rings */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-35 animate-spin [animation-duration:9s]" />
          
          <div className="relative w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center border border-white/10">
            <ActiveIcon className={`w-7 h-7 ${steps[step]?.color} transition-all duration-300 animate-pulse`} />
          </div>
        </div>

        {/* Brand Identity */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          MITRIXO <span className="gradient-text">WORKOUTS</span>
        </h1>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-10">
          100% Free Lifetime Account
        </p>

        {/* Loading Progress Bar Wrapper */}
        <div className="w-full h-1 bg-slate-900/60 rounded-full overflow-hidden mb-6 relative border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_hsla(var(--primary),0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="h-6 flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]"></span>
          </span>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {steps[step]?.text}
          </p>
        </div>

        {/* Counter indicator */}
        <div className="mt-2 text-[10px] text-slate-600 font-bold font-mono">
          {Math.min(Math.round(progress), 100)}%
        </div>
      </div>
    </div>
  )
}
