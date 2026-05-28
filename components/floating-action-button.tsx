"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const quickActions = [
    { label: "Run", emoji: "🏃", color: "from-red-400 to-pink-500" },
    { label: "Cycling", emoji: "🚴", color: "from-blue-400 to-cyan-500" },
    { label: "Breakfast", emoji: "🍳", color: "from-yellow-400 to-orange-500" },
    { label: "Water", emoji: "💧", color: "from-blue-400 to-indigo-500" },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          {quickActions.map((action, index) => (
            <Button
              key={action.label}
              className={cn(
                "w-14 h-14 rounded-full shadow-lg border border-white/10 bg-gradient-to-br hover:scale-110 transition-all duration-200 shadow-black/60",
                action.color,
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                onClick()
                setIsExpanded(false)
              }}
            >
              <span className="text-xl">{action.emoji}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        className={cn(
          "w-16 h-16 rounded-full shadow-xl btn-premium border-4 border-slate-950/80 transition-all duration-300 shadow-coral-500/20",
          isExpanded ? "rotate-45" : "hover:scale-110",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
      </Button>
    </div>
  )
}
