"use client";

import React, { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";

interface DateFilterDropdownProps {
  readonly startDate: string;
  readonly endDate: string;
  readonly isActive: boolean;
  readonly onApply: (start: string, end: string) => void;
  readonly onClear: () => void;
}

export function DateFilterDropdown({
  startDate,
  endDate,
  isActive,
  onApply,
  onClear,
}: DateFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);

  // Sync draft dates whenever props change
  useEffect(() => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
  }, [startDate, endDate]);

  const handlePreset = (start: string, end: string) => {
    setDraftStart(start);
    setDraftEnd(end);
    onApply(start, end);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (draftStart && draftEnd) {
      onApply(draftStart, draftEnd);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  // Helper date generators
  const getToday = () => new Date().toISOString().split("T")[0];
  const getDaysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-xl border shadow-[0_8px_32px_rgba(10,62,148,0.08)] text-xs transition-all shrink-0 ${
            isActive
              ? "bg-blue-50/90 border-eezysend-blue/50 text-eezysend-blue font-semibold ring-1 ring-eezysend-blue/20"
              : "bg-white/75 border-white/60 text-slate-700 hover:text-slate-900 hover:border-slate-300"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-eezysend-blue" />
          <span>
            {isActive
              ? startDate === endDate
                ? `Date: ${startDate}`
                : `${startDate} → ${endDate}`
              : "Filter Dates"}
          </span>
        </button>

        {isActive && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-white/75 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-white/60 transition-colors shadow-2xs"
            title="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl w-80 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Filter By Date</span>
              {isActive && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Active
                </span>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const today = getToday();
                  handlePreset(today, today);
                }}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-eezysend-blue hover:text-white text-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset(getDaysAgo(7), getToday())}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-eezysend-blue hover:text-white text-slate-700 transition-colors"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset("2026-06-01", "2026-06-30")}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-eezysend-blue hover:text-white text-slate-700 transition-colors"
              >
                June 2026 (Peak)
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                All Time
              </button>
            </div>

            {/* Custom Date Pickers */}
            <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-500 block mb-1 font-medium">Start Date:</span>
                <input
                  type="date"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-eezysend-blue text-xs shadow-2xs"
                />
              </div>
              <div>
                <span className="text-slate-500 block mb-1 font-medium">End Date:</span>
                <input
                  type="date"
                  value={draftEnd}
                  onChange={(e) => setDraftEnd(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-eezysend-blue text-xs shadow-2xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!draftStart || !draftEnd}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-eezysend-blue hover:bg-eezysend-blue-hover text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
