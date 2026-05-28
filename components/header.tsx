'use client';

import { Dumbbell, Menu, Settings, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, SignInButton, Show, UserButton } from "@clerk/nextjs";


interface HeaderProps {
  onOpenSettings?: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const { user, isSignedIn } = useUser();
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMockMode = !clerkKey || clerkKey === 'your_clerk_publishable_key_here';

  return (
    <header className="h-20 glass-panel border-b border-white/5 bg-slate-950/40 relative z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 btn-premium rounded-2xl flex items-center justify-center shadow-lg shadow-[hsl(var(--primary))]/15">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight gradient-text">
              FreeWorkoutPlanner
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Plateau-Breaker Training Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mock Mode Developer Badge */}
          {isMockMode ? (
            <span className="hidden sm:flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold shadow-sm font-mono">
              <ShieldAlert className="w-3 h-3 animate-pulse" />
              Dev Mock
            </span>
          ) : (
            <>
              <Show when="signed-in">
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Secured Auth
                  </span>
                  <UserButton />
                </div>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button size="sm" className="h-8 rounded-xl bg-[hsl(var(--primary))]/20 hover:bg-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 text-xs px-3 font-semibold transition-all">
                    Sign In
                  </Button>
                </SignInButton>
              </Show>
            </>
          )}

          {/* Settings / Customize Accent Trigger */}
          <Button 
            onClick={onOpenSettings}
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 w-9 h-9 flex items-center justify-center"
            title="Portal Settings & Themes"
          >
            <Settings className="w-4.5 h-4.5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white hover:bg-white/5 w-9 h-9">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
