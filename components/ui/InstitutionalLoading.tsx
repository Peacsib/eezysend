'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export interface InstitutionalLoadingProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  variant?: 'page' | 'inline' | 'overlay';
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * Unique Institutional Loading Preview
 * Combines a high-precision dual-ring orbital spinner, concentric reverse-dotted ring,
 * and a 5-dot synchronized harmonic wave for live data synchronization.
 */
export function InstitutionalLoading({
  title = 'Synchronizing Live Records',
  subtitle = 'Connecting to EezySend Core Banking feed. Verifying live settlement records...',
  badgeText = 'LIVE CORE BANKING FEED',
  variant = 'page',
  error = null,
  onRetry,
  className = '',
}: InstitutionalLoadingProps) {
  const cardContent = (
    <div className="relative bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(10,62,148,0.12)] rounded-3xl p-8 sm:p-10 max-w-lg mx-auto text-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Badge: Live Status Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/70 text-[10px] font-bold text-[#0A3E94] uppercase tracking-wider mb-5 shadow-2xs">
        <span className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
        <span>{error ? 'CONNECTION INTERRUPTED' : badgeText}</span>
      </div>

      {error ? (
        <div className="space-y-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Sync Failed</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A3E94] hover:bg-[#083277] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Live Sync</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Central Unique Dual-Orbital Spinner + Concentric Dotted Ring */}
          <div className="relative w-24 h-24 mx-auto mb-5 flex items-center justify-center">
            {/* Outer Concentric Dashed Aura */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#0A3E94]/30 animate-dotted-ring pointer-events-none" />

            {/* Primary High-Speed Gradient Orbital Ring */}
            <div className="absolute inset-1 rounded-full border-[2.5px] border-transparent border-t-[#0A3E94] border-r-emerald-600 animate-spin" />

            {/* Middle Reverse Dotted Orbital Ring ("dotted loading preview") */}
            <div className="absolute inset-3 rounded-full border-2 border-dotted border-[#0A3E94]/70 animate-spin-reverse" />

            {/* Inner Glowing Monogram Hub */}
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0A3E94] to-[#00332c] flex items-center justify-center text-white shadow-md shadow-[#0A3E94]/25 animate-pulse">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
          </div>

          {/* Synchronized 5-Dot Harmonic Wave */}
          <div className="flex items-center justify-center gap-1.5 mb-5" aria-hidden="true">
            <span
              className="w-2 h-2 rounded-full bg-[#0A3E94] animate-[dottedWave_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: '-0.32s' }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-[dottedWave_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: '-0.16s' }}
            />
            <span
              className="w-3 h-3 rounded-full bg-emerald-600 animate-[dottedWave_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: '0s' }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#00332c] animate-[dottedWave_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: '0.16s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-[#0A3E94] animate-[dottedWave_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: '0.32s' }}
            />
          </div>

          {/* Institutional Title & Subtitle */}
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-[12.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Shimmer Telemetry Progress Line */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-6 relative">
            <div className="h-full w-full animate-shimmer rounded-full" />
          </div>

          {/* Micro Telemetry Ticker */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
            <span>DIRECT NLB GATEWAY</span>
            <span>SECURE STREAMING</span>
            <span>LATENCY ~45MS</span>
          </div>
        </>
      )}
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 ${className}`}>
        {cardContent}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`py-12 px-4 flex items-center justify-center ${className}`}>
        {cardContent}
      </div>
    );
  }

  // Variant 'page' (shows ambient structure placeholder with the central floating card)
  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${className}`}>
      {/* 1. Frosted Skeleton KPI Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-40 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xs space-y-3"
          >
            <div className="h-3.5 w-1/3 bg-slate-200/80 rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-slate-300/80 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200/60 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* 2. Prominent Central Unique Loading Card */}
      <div className="py-4">
        {cardContent}
      </div>

      {/* 3. Frosted Skeleton Table Placeholder */}
      <div className="rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 p-5 space-y-3 opacity-30 pointer-events-none">
        <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-slate-200/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstitutionalLoading;
