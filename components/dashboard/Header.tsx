"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Clock,
  Menu,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function Header({
  onOpenMobileSidebar,
  onToggleCollapse,
  isSidebarCollapsed = false,
}: HeaderProps) {
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
    <header className="h-16 bg-white/60 border-b border-white/70 px-4 sm:px-6 flex items-center justify-between backdrop-blur-2xl sticky top-0 z-30 shadow-xs shadow-slate-200/10 transition-all duration-300">
      {/* Left: Sidebar Toggle, Mobile Logo & Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          title="Open navigation menu"
          className="md:hidden p-2 -ml-1 rounded-xl text-slate-700 hover:text-eezysend-blue hover:bg-white/80 active:scale-95 transition-all border border-slate-200/60 shadow-2xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Brand */}
        <div className="md:hidden flex items-center">
          <img
            src="/new-logo.webp"
            alt="EezySend Logo"
            className="h-6 w-auto object-contain"
          />
        </div>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          className="hidden md:inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-eezysend-blue hover:bg-white/80 active:scale-95 transition-all border border-slate-200/60 shadow-2xs"
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Time */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono transition-colors hover:text-slate-700">
          <Clock className="w-3.5 h-3.5 text-eezysend-blue" />
          <span>{time || '--:--:--'}</span>
        </div>
      </div>

      {/* Right: Environment & Server Info */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 border border-slate-200/60 text-[11px] text-slate-600 backdrop-blur-sm transition-all hover:bg-white/80">
          <Server className="w-3.5 h-3.5 text-eezysend-blue" />
          <span>eu-west-1 &middot; CABS Core</span>
        </div>
      </div>
    </header>
  );
}

