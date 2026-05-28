import { Dumbbell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-20 glass-panel border-b border-white/5 bg-slate-950/40 relative z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 btn-premium rounded-2xl flex items-center justify-center shadow-lg shadow-coral-500/15">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight gradient-text">
            Mirna's Training Portal
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </header>
  )
}
