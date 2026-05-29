'use client';

import React from 'react';
import { calculateBarbellPlates } from '@/lib/overload';
import { Button } from '@/components/ui/button';
import { Scale, Info } from 'lucide-react';

interface PlateCalculatorProps {
  targetWeight: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PlateCalculator({ targetWeight, isOpen, onClose }: PlateCalculatorProps) {
  if (!isOpen) return null;

  const barWeight = 20;
  const result = calculateBarbellPlates(targetWeight, barWeight);

  // Plate definitions: weight, color, label color, height scale
  const plateConfig: Record<number, { bg: string; text: string; height: string; width: string; name: string }> = {
    25: { bg: 'bg-red-650 border-red-800 shadow-red-500/20', text: 'text-white', height: 'h-36', width: 'w-8', name: '25kg' },
    20: { bg: 'bg-blue-600 border-blue-800 shadow-blue-500/20', text: 'text-white', height: 'h-32', width: 'w-7.5', name: '20kg' },
    15: { bg: 'bg-yellow-500 border-yellow-750 shadow-yellow-500/20', text: 'text-slate-950', height: 'h-28', width: 'w-7', name: '15kg' },
    10: { bg: 'bg-emerald-600 border-emerald-800 shadow-emerald-500/20', text: 'text-white', height: 'h-24', width: 'w-6.5', name: '10kg' },
    5: { bg: 'bg-slate-200 border-slate-350 shadow-slate-200/20 text-slate-900', text: 'text-slate-900', height: 'h-20', width: 'w-5.5', name: '5kg' },
    2.5: { bg: 'bg-slate-800 border-slate-950 shadow-slate-850/20 text-slate-300', text: 'text-slate-300', height: 'h-16', width: 'w-4.5', name: '2.5kg' },
    1.25: { bg: 'bg-slate-400 border-slate-500 shadow-slate-400/20 text-slate-950', text: 'text-slate-950', height: 'h-12', width: 'w-3.5', name: '1.25kg' },
  };

  // Create a flat array of plates to map visually
  const plateList: number[] = [];
  Object.entries(result.plates).forEach(([weightStr, count]) => {
    const weight = parseFloat(weightStr);
    for (let i = 0; i < count; i++) {
      plateList.push(weight);
    }
  });

  // Sort descending so largest plates are loaded closest to the collar (inner side)
  plateList.sort((a, b) => b - a);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl shadow-black/80">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-extrabold tracking-tight">Barbell Plate Calculator</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        {/* Total Weight Summary Panel */}
        <div className="my-6 p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Target Weight</span>
            <div className="text-3xl font-black text-white font-mono mt-0.5">{targetWeight} <span className="text-sm font-bold text-slate-400">kg</span></div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500">Per Sleeve Side</span>
            <div className="text-lg font-bold text-primary font-mono mt-0.5">+{result.weightPerSide} <span className="text-xs text-slate-400">kg</span></div>
          </div>
        </div>

        {/* Visual CSS Barbell Container */}
        <div className="h-44 w-full bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center overflow-x-auto px-4 relative my-6">
          <div className="flex items-center justify-center w-full min-w-[320px]">
            {/* Left sleeve end */}
            <div className="h-2 w-12 bg-slate-550 border-r border-slate-650 rounded-l" />
            
            {/* Left Plates sleeve */}
            <div className="flex items-center flex-row-reverse justify-start h-5 w-24 bg-slate-600 border border-slate-500 relative">
              {plateList.map((wt, idx) => {
                const config = plateConfig[wt] || plateConfig[5];
                return (
                  <div
                    key={`l-${idx}`}
                    className={`border ${config.bg} rounded-md flex items-center justify-center flex-shrink-0 text-[8px] font-black font-mono shadow-md ${config.height} ${config.width}`}
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    {config.name}
                  </div>
                );
              })}
            </div>

            {/* Inner Collar Left */}
            <div className="h-10 w-2.5 bg-slate-400 border border-slate-500 rounded" />
            
            {/* Center Bar */}
            <div className="h-4 flex-1 min-w-[60px] bg-slate-700 border-y border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-400 font-mono select-none">
              BAR 20KG
            </div>

            {/* Inner Collar Right */}
            <div className="h-10 w-2.5 bg-slate-400 border border-slate-500 rounded" />

            {/* Right Plates sleeve */}
            <div className="flex items-center justify-start h-5 w-24 bg-slate-600 border border-slate-500 relative">
              {plateList.map((wt, idx) => {
                const config = plateConfig[wt] || plateConfig[5];
                return (
                  <div
                    key={`r-${idx}`}
                    className={`border ${config.bg} rounded-md flex items-center justify-center flex-shrink-0 text-[8px] font-black font-mono shadow-md ${config.height} ${config.width}`}
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    {config.name}
                  </div>
                );
              })}
            </div>

            {/* Right sleeve end */}
            <div className="h-2 w-12 bg-slate-550 border-l border-slate-650 rounded-r" />
          </div>
        </div>

        {/* Text Instructions breakdown */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-primary" />
            Loading Instructions per sleeve side:
          </div>

          {plateList.length === 0 ? (
            <p className="text-xs text-slate-400">Empty bar. Just load the barbell itself without adding plates.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/40 border border-white/5 rounded-2xl p-4">
              {Object.entries(result.plates).map(([wtStr, count]) => {
                const wt = parseFloat(wtStr);
                const color = wt === 25 ? 'text-red-400' : wt === 20 ? 'text-blue-400' : wt === 15 ? 'text-yellow-400' : wt === 10 ? 'text-emerald-450 text-emerald-400' : 'text-slate-300';
                return (
                  <div key={wt} className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Plate {wt}kg:</span>
                    <span className={`font-black ${color} font-mono`}>{count}x per side</span>
                  </div>
                );
              })}
            </div>
          )}

          {result.remainder > 0 && (
            <p className="text-[10px] text-amber-400 flex items-center gap-1">
              ⚠️ Note: Load includes a remaining {result.remainder}kg that cannot be represented with standard plates.
            </p>
          )}
        </div>

        {/* Bottom Button */}
        <div className="pt-4 mt-4 border-t border-white/5">
          <Button onClick={onClose} className="w-full rounded-2xl btn-premium">
            Done
          </Button>
        </div>

      </div>
    </div>
  );
}
