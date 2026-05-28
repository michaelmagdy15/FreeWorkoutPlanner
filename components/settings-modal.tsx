'use client';

import React from 'react';
import { useTheme, ThemeName } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Settings, User, Palette, Shield, UserCheck, LogOut, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme, availableThemes } = useTheme();
  const { user, isSignedIn, isLoaded } = useUser();

  // Detect whether Clerk is configured in the environment
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMockMode = !clerkKey || clerkKey === 'your_clerk_publishable_key_here';

  // Load custom metadata theme on mount if logged into Clerk
  React.useEffect(() => {
    if (isSignedIn && user && user.unsafeMetadata?.themeColor) {
      const savedTheme = user.unsafeMetadata.themeColor as ThemeName;
      if (savedTheme && savedTheme !== theme) {
        setTheme(savedTheme);
      }
    }
  }, [isSignedIn, user]);

  const handleThemeChange = async (themeId: ThemeName) => {
    setTheme(themeId);
    
    // Save to Clerk metadata for persistent sync if online and authenticated
    if (isSignedIn && user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            themeColor: themeId,
          }
        });
        console.log(`Saved theme preference ${themeId} to Clerk metadata.`);
      } catch (err) {
        console.error('Failed to sync theme preference to Clerk:', err);
      }
    }
  };

  // Color circle styles mapped to theme ids
  const colorMap: Record<string, string> = {
    coral: 'bg-[hsl(12,100%,63%)] shadow-[hsl(12,100%,63%)]/20',
    pink: 'bg-[hsl(330,100%,71%)] shadow-[hsl(330,100%,71%)]/20',
    emerald: 'bg-[hsl(142,76%,45%)] shadow-[hsl(142,76%,45%)]/20',
    sky: 'bg-[hsl(200,95%,55%)] shadow-[hsl(200,95%,55%)]/20',
  };

  // Get active display details based on Auth status
  const userProfile = {
    name: isMockMode || !isSignedIn ? 'Mirna Workout Plan User' : (user.fullName || user.username || 'Client'),
    email: isMockMode || !isSignedIn ? 'mirna@freeworkoutplanner.com' : user.primaryEmailAddress?.emailAddress,
    id: isMockMode || !isSignedIn ? 'FWP-2026-M8915' : `CLERK-${user.id.substring(0, 10).toUpperCase()}`,
    avatar: isMockMode || !isSignedIn ? null : user.imageUrl,
    role: isMockMode ? 'Mock Client' : 'Client',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl shadow-black/80 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Settings className="w-5 h-5 text-[hsl(var(--primary))]" />
            Client Settings
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            Manage your client profile and customize your portal's dynamic style preference.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* MOCK MODE INDICATOR */}
          {isMockMode && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Developer Mock Auth Mode</p>
                <p className="text-[10px] text-slate-350 leading-relaxed mt-0.5">
                  App running locally without Clerk keys. Secure sign-in triggers will bypass when keys are added to `.env.local`.
                </p>
              </div>
            </div>
          )}

          {/* CLIENT PROFILE CARD */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-[hsl(var(--primary))]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{userProfile.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-850 border border-white/5 font-mono text-slate-400">
                      {userProfile.id}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                      <UserCheck className="w-2.5 h-2.5" />
                      {userProfile.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOGOUT ACTION */}
              {!isMockMode && isSignedIn && (
                <SignOutButton>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-400" title="Sign Out">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </SignOutButton>
              )}
            </div>

            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Goal: Plateau Breaker (RPE 8-9)</span>
              <span className="line-clamp-1">{userProfile.email}</span>
            </div>
          </div>

          {/* DYNAMIC COLOR CUSTOMIZATION ENGINE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Palette className="w-4 h-4 text-[hsl(var(--primary))]" />
              Choose App Theme Accent
            </div>

            <div className="grid grid-cols-2 gap-3">
              {availableThemes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-300 bg-slate-900/30 text-left ${
                    theme === item.id
                      ? 'border-[hsl(var(--primary))] bg-slate-900/60 shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                      : 'border-white/5 hover:border-white/10 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full shadow-lg ${colorMap[item.id] || 'bg-slate-400'}`} />
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                  </div>
                  {theme === item.id && <Check className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM DIALOG FOOTER */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={onClose}
            className="w-full rounded-2xl btn-premium shadow-lg shadow-[hsl(var(--primary))]/10"
          >
            Apply & Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
