'use client';

import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export interface InstitutionalLoadingProps {
  title?: string;
  variant?: 'page' | 'inline' | 'overlay';
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

// Outer orbital ring: 12 mathematically placed circular SVG dots with graduated comet trail
const OUTER_DOTS = [
  { angle: 0, opacity: 1.0, r: 2.8, color: '#0A3E94' },
  { angle: 30, opacity: 0.88, r: 2.6, color: '#0A3E94' },
  { angle: 60, opacity: 0.76, r: 2.4, color: '#0A3E94' },
  { angle: 90, opacity: 0.64, r: 2.2, color: '#0A3E94' },
  { angle: 120, opacity: 0.52, r: 2.0, color: '#0A3E94' },
  { angle: 150, opacity: 0.42, r: 1.9, color: '#0A3E94' },
  { angle: 180, opacity: 0.32, r: 1.8, color: '#0A3E94' },
  { angle: 210, opacity: 0.24, r: 1.7, color: '#0A3E94' },
  { angle: 240, opacity: 0.18, r: 1.6, color: '#0A3E94' },
  { angle: 270, opacity: 0.13, r: 1.5, color: '#0A3E94' },
  { angle: 300, opacity: 0.09, r: 1.4, color: '#0A3E94' },
  { angle: 330, opacity: 0.06, r: 1.3, color: '#0A3E94' },
].map((dot, i) => {
  const rad = (dot.angle * Math.PI) / 180 - Math.PI / 2;
  return {
    ...dot,
    cx: Number((32 + 23 * Math.cos(rad)).toFixed(2)),
    cy: Number((32 + 23 * Math.sin(rad)).toFixed(2)),
    key: `outer-${i}`,
  };
});

// Inner counter-orbiting ring: 6 graduated emerald & navy dots
const INNER_DOTS = [
  { angle: 0, opacity: 0.85, r: 2.0, color: '#0d7a5f' },
  { angle: 60, opacity: 0.65, r: 1.8, color: '#0d7a5f' },
  { angle: 120, opacity: 0.45, r: 1.6, color: '#0A3E94' },
  { angle: 180, opacity: 0.30, r: 1.4, color: '#0d7a5f' },
  { angle: 240, opacity: 0.18, r: 1.3, color: '#0A3E94' },
  { angle: 300, opacity: 0.10, r: 1.2, color: '#0d7a5f' },
].map((dot, i) => {
  const rad = (dot.angle * Math.PI) / 180 - Math.PI / 2;
  return {
    ...dot,
    cx: Number((32 + 13 * Math.cos(rad)).toFixed(2)),
    cy: Number((32 + 13 * Math.sin(rad)).toFixed(2)),
    key: `inner-${i}`,
  };
});

/**
 * Bespoke Dual-Orbital SVG Dotted Constellation Loader
 * Minimal, clean, and distinctive: combines a 12-dot comet tail orbit,
 * a 6-dot emerald counter-orbit, and a 5-dot rhythmic wave.
 */
export function InstitutionalLoading({
  title = 'Loading live data...',
  variant = 'page',
  error = null,
  onRetry,
  className = '',
}: InstitutionalLoadingProps) {
  if (error) {
    return (
      <div className={`py-16 px-4 flex flex-col items-center justify-center text-center ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-slate-800 mb-1">Failed to load live data</p>
        <p className="text-[11px] text-slate-400 max-w-xs mb-3">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3E94] hover:bg-[#083277] text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  const content = (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Bespoke SVG Dual-Orbital Dotted Constellation */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer clockwise rotating 12-dot comet tail */}
        <svg
          viewBox="0 0 64 64"
          className="w-16 h-16 absolute inset-0 animate-[spin_1.2s_linear_infinite]"
        >
          {OUTER_DOTS.map((d) => (
            <circle
              key={d.key}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.color}
              opacity={d.opacity}
            />
          ))}
        </svg>

        {/* Inner counter-clockwise rotating 6-dot constellation */}
        <svg
          viewBox="0 0 64 64"
          className="w-16 h-16 absolute inset-0 animate-[spinReverse_2.2s_linear_infinite]"
        >
          {INNER_DOTS.map((d) => (
            <circle
              key={d.key}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.color}
              opacity={d.opacity}
            />
          ))}
        </svg>

        {/* Center glowing focal point with calm breathing pulse */}
        <div className="relative w-3.5 h-3.5 rounded-full bg-white/90 border border-slate-200/90 flex items-center justify-center shadow-2xs">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0A3E94] animate-pulse" />
        </div>
      </div>

      {/* 5-Dot Synchronized Rhythmic Wave */}
      <div className="flex items-center gap-1.5 mt-3.5" aria-hidden="true">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#0A3E94]/60 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '-0.32s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#0A3E94]/85 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '-0.16s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#0d7a5f] animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#0A3E94]/85 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '0.16s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#0A3E94]/60 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '0.32s' }}
        />
      </div>

      {/* Clean, minimal institutional label */}
      <p className="text-xs font-medium text-slate-500 tracking-wide mt-2">
        {title}
      </p>
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return <div className="py-12 px-4 flex items-center justify-center">{content}</div>;
  }

  // Variant 'page'
  return (
    <div className="w-full flex-1 min-h-[55vh] sm:min-h-[60vh] lg:min-h-[65vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-150">
      {content}
    </div>
  );
}

export default InstitutionalLoading;
