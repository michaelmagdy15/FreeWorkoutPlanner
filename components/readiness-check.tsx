'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ShieldAlert, Moon, Activity, Flame, ChevronRight } from 'lucide-react';

interface ReadinessCheckProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (readinessScore: number, shouldScale: boolean) => void;
}

export function ReadinessCheck({ isOpen, onClose, onComplete }: ReadinessCheckProps) {
  const [sleep, setSleep] = useState<number>(8);
  const [soreness, setSoreness] = useState<number>(2);
  const [energy, setEnergy] = useState<number>(8);

  const handleSubmit = () => {
    // Readiness is calculated where soreness is inverted (less soreness is better)
    const sorenessValue = 11 - soreness; // 1 soreness -> 10 rating, 10 soreness -> 1 rating
    const averageScore = Math.round(((sleep + sorenessValue + energy) / 3) * 10) / 10;
    
    // Scale target workouts down if readiness score is below 5.5
    const shouldScale = averageScore < 5.5;
    
    onComplete(averageScore, shouldScale);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl shadow-black/80 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Activity className="w-5 h-5 text-[hsl(var(--primary))]" />
            Daily Readiness Check
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            MITRIXO uses autoregulation to optimize your exercise volume based on daily fatigue indicators.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* SLEEP QUALITY */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-350">
              <span className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-sky-400" />
                Sleep Quality
              </span>
              <span className="font-mono text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-300">
                {sleep}/10 ({sleep >= 8 ? 'Restful' : sleep >= 5 ? 'Average' : 'Poor'})
              </span>
            </div>
            <Slider
              value={[sleep]}
              onValueChange={(val) => setSleep(val[0])}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          {/* MUSCLE SORENESS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-350">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-coral-500" />
                Muscle Soreness
              </span>
              <span className="font-mono text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-300">
                {soreness}/10 ({soreness >= 8 ? 'Extreme' : soreness >= 5 ? 'Moderate' : 'Fresh'})
              </span>
            </div>
            <Slider
              value={[soreness]}
              onValueChange={(val) => setSoreness(val[0])}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          {/* ENERGY LEVELS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-350">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Energy Levels
              </span>
              <span className="font-mono text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-300">
                {energy}/10 ({energy >= 8 ? 'Charged' : energy >= 5 ? 'Middling' : 'Drained'})
              </span>
            </div>
            <Slider
              value={[energy]}
              onValueChange={(val) => setEnergy(val[0])}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          {/* ALERT BOX ON HIGH FATIGUE */}
          {((sleep + (11 - soreness) + energy) / 3) < 5.5 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[9px] text-amber-400 leading-relaxed font-semibold">
                Note: Readiness is low. Autoregulation will scale down target sets by -1 per exercise to prioritize joint integrity.
              </p>
            </div>
          )}

        </div>

        {/* SUBMIT TRIGGER */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            className="w-full rounded-2xl btn-premium flex items-center justify-center gap-2"
          >
            Start Active Session
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
