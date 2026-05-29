'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, Utensils, Heart, Share2, Award, Zap } from 'lucide-react';

interface FeedItem {
  id: string;
  user: {
    name: string;
    avatar: string | null;
    role: 'client' | 'coach' | 'admin';
    initials: string;
  };
  type: 'workout' | 'nutrition' | 'achievement';
  timestamp: string;
  title: string;
  details: string;
  likes: number;
  cheers: number;
  hasLiked: boolean;
}

export function CommunityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: 'feed-1',
      user: { name: 'Mirna AbdelShahid', avatar: null, role: 'client', initials: 'MA' },
      type: 'workout',
      timestamp: '10 Mins Ago',
      title: 'Completed Lower Body Split (Plateau-Breaker)',
      details: 'Goblet Squats (22.5kg x 3 sets of 10 reps) and Hip Thrusts (60kg x 3 sets of 10 reps). Pushed through RPE 9! 🔋',
      likes: 12,
      cheers: 5,
      hasLiked: false,
    },
    {
      id: 'feed-2',
      user: { name: 'Coach Satram', avatar: null, role: 'coach', initials: 'CS' },
      type: 'nutrition',
      timestamp: '2 Hours Ago',
      title: 'Logged Daily Fuel Target',
      details: 'Macro Breakdown: 2,100 Kcal, 150g Protein, 220g Carbs, 60g Fats. Reminder: Keep hydration high during rest phases! 💧',
      likes: 8,
      cheers: 2,
      hasLiked: false,
    },
    {
      id: 'feed-3',
      user: { name: 'Michael Mitry', avatar: null, role: 'admin', initials: 'MM' },
      type: 'achievement',
      timestamp: 'Yesterday',
      title: 'Milestone: Platform Admin Portal Launched',
      details: 'Successfully deployed secure Clerk authentication, offline gym tracking sync arrays, and visual plate calculation units! 🛠️',
      likes: 24,
      cheers: 15,
      hasLiked: true,
    },
  ]);

  const handleLike = (id: string) => {
    setFeed(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            likes: item.hasLiked ? item.likes - 1 : item.likes + 1,
            hasLiked: !item.hasLiked,
          };
        }
        return item;
      })
    );
  };

  const handleCheer = (id: string) => {
    setFeed(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            cheers: item.cheers + 1,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6 h-full flex flex-col overflow-y-auto max-h-[calc(100vh-140px)]">
      
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            MITRIXO Training Feed
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">Connect, encourage, and track splits with teammates.</p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 text-slate-400 font-mono">
          Realtime Sync
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-4 flex-1">
        {feed.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-slate-900/30 border border-white/5 space-y-3.5 hover:bg-slate-900/40 transition-all duration-300">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 text-xs font-black text-primary font-mono select-none">
                  {item.user.avatar ? (
                    <img src={item.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    item.user.initials
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.user.name}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold select-none ${
                      item.user.role === 'admin' 
                        ? 'bg-red-950/30 border border-red-500/20 text-red-400' 
                        : item.user.role === 'coach'
                        ? 'bg-amber-950/30 border border-amber-500/20 text-amber-400'
                        : 'bg-primary/10 border border-primary/20 text-primary'
                    }`}>
                      {item.user.role.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{item.timestamp}</span>
                </div>
              </div>

              {/* Icon Type indicator */}
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center">
                {item.type === 'workout' && <Dumbbell className="w-4 h-4 text-primary" />}
                {item.type === 'nutrition' && <Utensils className="w-4 h-4 text-secondary" />}
                {item.type === 'achievement' && <Award className="w-4 h-4 text-emerald-450 text-emerald-400" />}
              </div>
            </div>

            {/* Content body */}
            <div className="space-y-1.5 pl-1">
              <h4 className="font-bold text-xs text-slate-200">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.details}</p>
            </div>

            {/* Social actions and counters */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] text-slate-500 font-bold select-none">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1 hover:text-red-400 transition-colors ${item.hasLiked ? 'text-red-500 font-black' : ''}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {item.likes} Likes
                </button>
                <button 
                  onClick={() => handleCheer(item.id)}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-slate-500 hover:text-primary" />
                  {item.cheers} Cheers
                </button>
              </div>

              <button className="flex items-center gap-1 hover:text-slate-300 transition-colors text-slate-500">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
