'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Menu, Sparkles, Store } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AdminTopBarProps {
  onToggleSidebar?: () => void;
}

export default function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('bn-BD', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
          ' • ' +
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs font-sans">
      {/* Left: Mobile hamburger + Branch info */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Store className="w-3.5 h-3.5" />
          <span>মতিঝিল ব্রাঞ্চ: ওপেন (Open)</span>
        </span>

        <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime}</span>
        </span>
      </div>

      {/* Right: Quick Realtime status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#900C19]" />
          <span>Live POS & Kitchen Sync</span>
        </div>
      </div>
    </header>
  );
}
