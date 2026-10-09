import React from 'react';

export type StatusVariant = 
  | 'UP' 
  | 'DEGRADED' 
  | 'DOWN' 
  | 'AWAITING_COLLECTION' 
  | 'COLLECTED' 
  | 'REVERSED' 
  | 'PENDING'
  | 'DELIVERED'
  | 'FAILED'
  | string;

export interface StatusBadgeProps {
  status: StatusVariant;
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

/**
 * Shared status badge token mapping ensuring identical design language
 * across Reporting, Transactions, and Health tabs.
 */
export function getStatusBadgeClasses(status?: string): {
  badge: string;
  dot: string;
  textColor: string;
  subtextColor: string;
} {
  const s = (status || '').toUpperCase().trim();

  // DEGRADED & AWAITING_COLLECTION & PARTIAL share the exact same signature style
  if (s.includes('AWAITING') || s.includes('DEGRADED') || s.includes('PENDING') || s.includes('PARTIAL')) {
    return {
      badge: 'bg-slate-50 border-slate-200 text-[#C7510A]',
      dot: 'bg-[#C7510A]',
      textColor: 'text-[#C7510A]',
      subtextColor: 'text-[#C7510A]',
    };
  }

  // UP & COLLECTED & DELIVERED share the exact same clean emerald style
  if (s === 'UP' || s.includes('COLLECTED') || s.includes('DELIVERED') || s.includes('OPERATIONAL')) {
    return {
      badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dot: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      subtextColor: 'text-emerald-600',
    };
  }

  // DOWN & FAILED share the exact same subtle rose style
  if (s === 'DOWN' || s.includes('FAIL') || s.includes('ERROR') || s.includes('OUTAGE')) {
    return {
      badge: 'bg-rose-50 border-rose-200 text-rose-700',
      dot: 'bg-rose-500',
      textColor: 'text-rose-700',
      subtextColor: 'text-rose-600',
    };
  }

  // REVERSED & CANCELLED share the exact same subtle slate style
  if (s.includes('REVERSED') || s.includes('CANCEL')) {
    return {
      badge: 'bg-slate-100 border-slate-300 text-slate-700',
      dot: 'bg-slate-400',
      textColor: 'text-slate-700',
      subtextColor: 'text-slate-500',
    };
  }

  return {
    badge: 'bg-slate-50 border-slate-200 text-slate-600',
    dot: 'bg-slate-400',
    textColor: 'text-slate-600',
    subtextColor: 'text-slate-500',
  };
}

export default function StatusBadge({
  status,
  children,
  className = '',
  dot = false,
}: StatusBadgeProps) {
  const { badge, dot: dotBg } = getStatusBadgeClasses(status);
  const displayLabel = children ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotBg} animate-pulse`} />}
      <span>{displayLabel}</span>
    </span>
  );
}
