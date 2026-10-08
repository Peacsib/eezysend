import React from "react";

export interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  unit?: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Shared KPI / Metric Card Design System Component
 * Enforces unified sizing, tokens, typography, glassmorphism, and subtle hover reactivity
 * across all EezySend dashboard views (Reports, Transactions, SMS, System Health).
 */
export function KpiCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  badge,
  className = "",
}: KpiCardProps) {
  return (
    <div
      className={`group relative p-5 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-white/60 hover:border-eezysend-blue/20 shadow-[0_8px_32px_rgba(10,62,148,0.07)] hover:shadow-[0_14px_36px_rgba(10,62,148,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 tracking-normal">
            {title}
          </span>
          {badge && <div>{badge}</div>}
        </div>

        <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight flex items-baseline gap-1.5 flex-wrap">
          <span>{value}</span>
          {unit && (
            <span className="text-xs font-normal text-slate-400">
              {unit}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="text-xs mt-1 font-body leading-relaxed">
          {subtitle}
        </div>
      )}
    </div>
  );
}

/**
 * Shared KPI Grid wrapper enforcing responsive 3-column layout
 */
export function KpiGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
}

export default KpiCard;
