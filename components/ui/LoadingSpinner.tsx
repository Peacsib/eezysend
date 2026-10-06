"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} border-eezysend-blue/30 border-t-eezysend-blue rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_32px_rgba(10,62,148,0.15)] p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-100/50 rounded-xl">
          <div className="w-1/4 h-4 bg-slate-200 rounded" />
          <div className="w-1/5 h-4 bg-slate-200 rounded" />
          <div className="w-1/5 h-4 bg-slate-200 rounded" />
          <div className="w-1/6 h-4 bg-slate-200 rounded" />
          <div className="w-1/12 h-4 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
      <div className="h-8 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/3" />
    </div>
  );
}
