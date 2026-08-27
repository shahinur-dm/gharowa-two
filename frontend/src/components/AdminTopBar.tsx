'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, ShieldCheck, Wifi, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminTopBar() {
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
    <header className="h-16 bg-obsidian-400/80 backdrop-blur-md border-b border-gold-500/15 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Current Date & Branch info */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>মতিঝিল ব্রাঞ্চ: খোলা (Open)</span>
        </span>

        <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-gold-400" />
          <span>{currentTime}</span>
        </span>
      </div>

      {/* Right: Quick info */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gold-300 bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/20">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Socket.IO Realtime POS Active</span>
        </div>
      </div>
    </header>
  );
}
