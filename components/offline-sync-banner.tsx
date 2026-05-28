'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from 'lucide-react';

export function OfflineSyncBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Helper to read current queue size
  const updateQueueCount = () => {
    try {
      const queueJson = localStorage.getItem('fwp-offline-queue');
      if (queueJson) {
        const queue = JSON.parse(queueJson);
        setQueueCount(Array.isArray(queue) ? queue.length : 0);
      } else {
        setQueueCount(0);
      }
    } catch (e) {
      console.error('Failed to parse offline queue in banner:', e);
      setQueueCount(0);
    }
  };

  useEffect(() => {
    // Check initial online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      updateQueueCount();
      
      // If initially offline, show banner immediately
      if (!navigator.onLine) {
        setShowBanner(true);
      }
    }

    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      
      // Keep showing banner for a few seconds to notify connection restore & sync success
      setTimeout(() => {
        setIsSyncing(false);
        setShowBanner(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    const handleQueueUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      if (customEvent.detail && typeof customEvent.detail.count === 'number') {
        setQueueCount(customEvent.detail.count);
      } else {
        updateQueueCount();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offlineQueueUpdated', handleQueueUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineQueueUpdated', handleQueueUpdate);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-6 py-2 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-500 ${
        isOnline 
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300 shadow-emerald-950/20' 
          : 'bg-amber-950/80 border-amber-500/30 text-amber-300 shadow-amber-950/20'
      }`}>
        {isOnline ? (
          <>
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-400" />
            )}
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Connection Restored</span>
              <span className="text-[9px] text-emerald-400/80 font-medium">Auto-syncing all gym tracking records...</span>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Working Offline</span>
              <span className="text-[9px] text-amber-400/85 font-medium">
                {queueCount > 0 
                  ? `${queueCount} workout record${queueCount > 1 ? 's' : ''} queued on-device`
                  : 'Gym logs will be cached locally on-device'}
              </span>
            </div>
            {queueCount > 0 && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
