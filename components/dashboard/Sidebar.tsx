"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeftRight,
  MessageSquare,
  Activity,
  LogOut,
  Building2,
  ChevronRight,
  X,
} from "lucide-react";

export type DashboardTab = 'reporting' | 'transactions' | 'sms' | 'health';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (forceState?: boolean) => void;
  sidebarWidth?: number;
  onWidthChange?: (width: number) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  sidebarWidth = 272,
  onWidthChange,
}: SidebarProps) {
  const [username, setUsername] = useState<string>("Tinashe Zvihwati");
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(sidebarWidth);

  // Collapsed mode is strictly for desktop/tablet viewports; the mobile drawer is always fully expanded
  const isDesktopCollapsed = isCollapsed && !isMobileOpen;
  const effectiveWidth = isMobileOpen
    ? 288
    : (isDesktopCollapsed ? 80 : sidebarWidth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("eezysend_username");
      if (stored && stored.trim()) {
        setUsername(stored.trim());
      }
    }
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        onCloseMobile?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Mouse Drag Handler for Flexible Resizable Sidebar
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Main button only
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = isDesktopCollapsed ? 80 : sidebarWidth;

    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - dragStartXRef.current;
      const targetWidth = dragStartWidthRef.current + deltaX;

      if (targetWidth < 140) {
        // Snap to collapsed rail mode
        if (!isCollapsed) {
          onToggleCollapse?.(true);
        }
      } else {
        // Expand and dynamically follow mouse clamped between 200px and 440px
        if (isCollapsed) {
          onToggleCollapse?.(false);
        }
        const clampedWidth = Math.max(200, Math.min(440, targetWidth));
        onWidthChange?.(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Touch Drag Handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    dragStartWidthRef.current = isDesktopCollapsed ? 80 : sidebarWidth;

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const deltaX = event.touches[0].clientX - dragStartXRef.current;
      const targetWidth = dragStartWidthRef.current + deltaX;

      if (targetWidth < 140) {
        if (!isCollapsed) onToggleCollapse?.(true);
      } else {
        if (isCollapsed) onToggleCollapse?.(false);
        const clampedWidth = Math.max(200, Math.min(440, targetWidth));
        onWidthChange?.(clampedWidth);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCollapse?.();
  };

  const initials = useMemo(() => {
    const parts = username.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase() || "US";
  }, [username]);

  const navItems = [
    {
      id: 'reporting' as DashboardTab,
      label: 'Reporting',
      subtitle: 'Audit & Settlements',
      icon: FileText,
      badge: null,
    },
    {
      id: 'transactions' as DashboardTab,
      label: 'Transactions',
      subtitle: 'Transfers & Lookups',
      icon: ArrowLeftRight,
      badge: null,
    },
    {
      id: 'sms' as DashboardTab,
      label: 'SMS Center',
      subtitle: 'Delivery & Gateway',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'health' as DashboardTab,
      label: 'System Health',
      subtitle: 'NLB & API Status',
      icon: Activity,
      badge: null,
    },
  ];

  const handleNavClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* Main Sidebar (Drawer on mobile, Draggable/Flexible resizable rail on desktop) */}
      <aside
        style={{ width: `${effectiveWidth}px` }}
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:h-screen flex flex-col justify-between p-4 sm:p-5 bg-eezysend-blue border-r border-eezysend-blue-hover text-white ${
          isDragging ? 'transition-none select-none' : 'transition-[width] duration-300 ease-in-out'
        } shrink-0 select-none ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Draggable & Flexible Resize Handle (Desktop/Tablet) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={effectiveWidth}
          aria-label="Resize Sidebar"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
          className="hidden md:flex absolute top-0 bottom-0 right-0 w-3 -mr-1.5 cursor-col-resize z-40 items-center justify-center group select-none"
          title="Drag to resize sidebar (Double-click to toggle collapse)"
        >
          {/* Visual Grip Indicator */}
          <div
            className={`w-[3px] rounded-full transition-all duration-150 ${
              isDragging
                ? 'h-24 bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] opacity-100'
                : 'h-8 bg-white/30 group-hover:bg-white group-hover:h-16 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.7)] opacity-0 group-hover:opacity-100'
            }`}
          />
        </div>

        {/* Top Section: Branding, Org, Navigation */}
        <div className="space-y-5">
          {/* Top Branding Header with Centered Logo (No Versioning) */}
          <div className="relative flex items-center justify-center pb-3.5 border-b border-white/10 w-full min-h-[44px]">
            <Link
              href="/"
              className="flex items-center justify-center group transition-transform duration-200 hover:scale-[1.02] mx-auto"
              title="EezySend Home"
            >
              {isDesktopCollapsed ? (
                <div className="hidden md:flex w-9 h-9 rounded-xl bg-white/15 items-center justify-center font-bold text-white tracking-wider border border-white/20 shadow-xs">
                  ES
                </div>
              ) : null}
              <img
                src="/eezysend-logo-white.svg"
                alt="EezySend Logo"
                className={`h-7.5 w-auto object-contain transition-all ${isDesktopCollapsed ? 'md:hidden' : 'block'}`}
              />
            </Link>

            {/* Mobile Close Button (X) - positioned absolute so logo remains centered */}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Institution Info Card */}
          <div
            className={`rounded-xl bg-white/10 border border-white/20 flex items-center transition-all ${
              isDesktopCollapsed ? 'md:p-2 md:justify-center' : 'p-3 gap-3'
            }`}
            title="CABS Financial Ops · Local Remit Portal"
          >
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            {!isDesktopCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  CABS Financial Ops
                </div>
                <div className="text-[11px] text-white/70 truncate">
                  Local Remit Portal
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {!isDesktopCollapsed && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50 px-3 pb-1">
                Operations Workspace
              </div>
            )}

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    title={isDesktopCollapsed ? undefined : item.label}
                    className={`w-full flex items-center rounded-xl text-left transition-all duration-200 ${
                      isDesktopCollapsed
                        ? 'md:justify-center md:p-2.5 md:h-11'
                        : 'justify-between p-3'
                    } ${
                      isActive
                        ? 'bg-white text-eezysend-blue shadow-sm font-semibold scale-[1.02]'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`flex items-center ${isDesktopCollapsed ? 'md:justify-center' : 'gap-3'}`}>
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive
                            ? 'bg-eezysend-blue/10 text-eezysend-blue'
                            : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>

                      {!isDesktopCollapsed && (
                        <div className="overflow-hidden">
                          <div className="text-xs font-medium leading-tight truncate">
                            {item.label}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-eezysend-blue/70' : 'text-white/60'
                            }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isDesktopCollapsed && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
                          isActive ? 'opacity-100 text-eezysend-blue' : 'text-white/60'
                        }`}
                      />
                    )}
                  </button>

                  {/* Floating Tooltip in Collapsed Rail Mode (Greenie Dribbble Reference) */}
                  {isDesktopCollapsed && (
                    <div className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-semibold rounded-xl shadow-xl backdrop-blur-md pointer-events-none z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 scale-95 group-hover:scale-100 border border-white/10 items-center gap-1.5">
                      <span className="text-white">{item.label}</span>
                      <span className="text-[10px] text-white/50">&middot; {item.subtitle}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile & Sign Out (No collapse tab - sidebar is draggable/flexible) */}
        <div className="space-y-3 pt-4 border-t border-white/10 relative group/profile">
          {/* User Profile Card */}
          <div
            className={`rounded-xl bg-white/10 border border-white/20 flex items-center transition-all ${
              isDesktopCollapsed ? 'md:p-2 md:justify-center' : 'p-3 justify-between'
            }`}
            title={isDesktopCollapsed ? undefined : `${username} · Operations Officer`}
          >
            <div className={`flex items-center overflow-hidden ${isDesktopCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-eezysend-blue font-bold text-xs shrink-0 shadow-sm">
                {initials}
              </div>
              {!isDesktopCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate capitalize">
                    {username}
                  </div>
                  <div className="text-[10px] text-white/70 truncate">
                    Operations Officer
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Profile Tooltip in Collapsed Mode */}
          {isDesktopCollapsed && (
            <div className="hidden md:flex absolute left-full top-4 ml-3 px-3 py-2 bg-slate-900/95 text-white text-xs font-medium rounded-xl shadow-xl backdrop-blur-md pointer-events-none z-50 whitespace-nowrap opacity-0 group-hover/profile:opacity-100 transition-all duration-150 scale-95 group-hover/profile:scale-100 border border-white/10 flex-col gap-0.5">
              <span className="font-semibold text-white">{username}</span>
              <span className="text-[10px] text-white/60">Operations Officer</span>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="relative group/logout">
            <button
              type="button"
              onClick={onLogout}
              title={isDesktopCollapsed ? undefined : "Sign Out of Portal"}
              className={`w-full flex items-center justify-center rounded-lg text-white/80 hover:text-rose-200 hover:bg-rose-500/25 border border-white/20 transition-colors ${
                isDesktopCollapsed ? 'p-2.5' : 'gap-2 px-3 py-2 text-xs font-medium'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isDesktopCollapsed && <span>Sign Out of Portal</span>}
            </button>

            {/* Floating Logout Tooltip in Collapsed Mode */}
            {isDesktopCollapsed && (
              <div className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-rose-950/95 text-rose-200 text-xs font-semibold rounded-xl shadow-xl backdrop-blur-md pointer-events-none z-50 whitespace-nowrap opacity-0 group-hover/logout:opacity-100 transition-all duration-150 scale-95 group-hover/logout:scale-100 border border-rose-500/30">
                Sign Out of Portal
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
