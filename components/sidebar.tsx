"use client"

import { Activity, Utensils, MessageSquare, TrendingUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  progressData: {
    workoutMinutes: number
    workoutProgress: number
    caloriesConsumed: number
    caloriesProgress: number
    stepsTaken: number
    stepsProgress: number
  }
}

export function Sidebar({ activeTab, setActiveTab, progressData }: SidebarProps) {
  const tabs = [
    { name: "Workouts", icon: Activity, color: "text-primary" },
    { name: "Nutrition", icon: Utensils, color: "text-secondary" },
    { name: "Feedback", icon: MessageSquare, color: "text-emerald-400" },
    { name: "Social", icon: Heart, color: "text-red-400" },
  ]

  return (
    <aside className="w-80 glass-panel h-full border-r border-white/5 p-6 flex flex-col gap-6">
      {/* Quick Stats */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Today's Dashboard
        </h2>

        <div className="space-y-3">
          {/* Workout Minutes */}
          <div className="bg-slate-900/60 border border-primary/10 rounded-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Minutes Done</span>
              <span className="text-2xl font-black text-primary font-mono">{progressData.workoutMinutes}</span>
            </div>
            <div className="mt-2.5 bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="btn-premium h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressData.workoutProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Calories Consumed */}
          <div className="bg-slate-900/60 border border-secondary/10 rounded-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Calories</span>
              <span className="text-2xl font-black text-secondary font-mono">{progressData.caloriesConsumed}</span>
            </div>
            <div className="mt-2.5 bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressData.caloriesProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Steps Taken */}
          <div className="bg-slate-900/60 border border-emerald-500/10 rounded-2xl p-4 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Steps Count</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{progressData.stepsTaken}</span>
            </div>
            <div className="mt-2.5 bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressData.stepsProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="space-y-4 flex-1">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">Navigation</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 text-xs font-bold uppercase tracking-wider",
                activeTab === tab.name
                  ? "bg-white/10 border border-white/10 text-white shadow-md shadow-black/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className={cn("w-4 h-4", tab.color)} />
              <span>{tab.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
