"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Server,
  Clock
} from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white/50 border-b border-white/60 px-6 flex items-center justify-between backdrop-blur-2xl sticky top-0 z-30 shadow-sm shadow-slate-200/10 transition-all duration-300">
      {/* Left: System Status & Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-700 text-xs font-medium backdrop-blur-sm transition-all hover:bg-emerald-100/90">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AWS NLB Live Gateway</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono transition-colors hover:text-slate-700">
          <Clock className="w-3.5 h-3.5 text-eezysend-blue" />
          <span>{time || '--:--:--'}</span>
        </div>
      </div>

      {/* Right: Environment & Notification */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 border border-slate-200/60 text-[11px] text-slate-600 backdrop-blur-sm transition-all hover:bg-white/80">
          <Server className="w-3.5 h-3.5 text-eezysend-blue" />
          <span>eu-west-1 &middot; CABS Core</span>
        </div>

        <button
          className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-all backdrop-blur-sm"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-eezysend-blue animate-pulse" />
        </button>
      </div>
    </header>
  );
}
