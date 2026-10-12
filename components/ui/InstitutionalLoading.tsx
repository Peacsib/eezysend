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

/**
 * Minimal, clean, yet unique institutional loading preview.
 * Combines a subtle hairline orbital arc, concentric reverse dotted ring,
 * and 3 synchronized harmonic micro-dots.
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
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Unique Minimal Dotted Spin Preview */}
      <div className="relative w-11 h-11 flex items-center justify-center mb-3">
        {/* Hairline outer arc */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-slate-200/80 border-t-[#0A3E94] animate-spin" />
        {/* Concentric delicate dotted counter-ring */}
        <div className="w-7 h-7 rounded-full border-[1.5px] border-dotted border-[#0A3E94]/60 animate-spin-reverse" />
        {/* Subtle breathing center dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#0A3E94] animate-pulse" />
      </div>

      {/* 3 Synchronized Micro-Dots */}
      <div className="flex items-center gap-1 mb-2" aria-hidden="true">
        <span
          className="w-1 h-1 rounded-full bg-[#0A3E94]/60 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '-0.24s' }}
        />
        <span
          className="w-1 h-1 rounded-full bg-[#0A3E94] animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '-0.12s' }}
        />
        <span
          className="w-1 h-1 rounded-full bg-[#0A3E94]/60 animate-[dottedWave_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: '0s' }}
        />
      </div>

      {/* Clean, minimal label */}
      <p className="text-xs font-medium text-slate-500 tracking-wide">
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
    <div className="py-24 px-4 flex items-center justify-center animate-in fade-in duration-150">
      {content}
    </div>
  );
}

export default InstitutionalLoading;
