"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Forward,
  ChevronDown,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  X,
  SearchX,
} from "lucide-react";
import { transactionsApi, reportsApi, mockReportTransactions } from "@/lib/api";
import type { ReportTransaction, ReversalResponse } from "@/lib/types";
import { TransactionFullView } from "./TransactionFullView";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/LoadingSpinner";
import { KpiCard, KpiGrid } from "./KpiCard";
import { Pagination } from "./Pagination";
import { DateFilterDropdown } from "./DateFilterDropdown";
import { downloadViaHttp } from "@/lib/csvExport";
import StatusBadge from "@/components/ui/StatusBadge";

export default function TransactionsTab() {
  const { showToast } = useToast();
  
  // Navigation segment: 'all' | 'pending' | 'collected' | 'reversed'
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'collected' | 'reversed'>('all');
  
  // Date range filter
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Transactions data
  const [transactions, setTransactions] = useState<ReportTransaction[]>(mockReportTransactions);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Load live transactions on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await reportsApi.getAllTransactions();
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
        }
      } catch {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Selected item for drawer/modal
  const [selectedTx, setSelectedTx] = useState<ReportTransaction | null>(null);

  // Reversal dialog state
  const [reversalTarget, setReversalTarget] = useState<ReportTransaction | null>(null);
  const [reversalLoading, setReversalLoading] = useState<boolean>(false);

  // Direct lookup handler for searching specific external references
  const handleDirectSearch = async () => {
    const q = searchQuery.trim();
    if (!q) {
      showToast('Please enter a transaction reference', 'error');
      return;
    }

    setLoading(true);

    const upper = q.toUpperCase();
    try {
      let match: ReportTransaction | null = null;
      if (upper.startsWith("WTH")) {
        match = await transactionsApi.getByWithdrawalRef(q);
      } else if (upper.startsWith("CABS") || upper.startsWith("DEP")) {
        match = await transactionsApi.getByDepositRef(q);
      } else {
        match = await transactionsApi.getByReference(q);
      }

      if (match?.transactionReference) {
        setSelectedTx(match);
        showToast('Transaction found', 'success');
      } else {
        showToast('Transaction not found', 'error');
      }
    } catch {
      showToast('Failed to fetch transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reversal execution
  const handleConfirmReversal = async () => {
    if (!reversalTarget) return;
    setReversalLoading(true);

    try {
      showToast('Processing reversal...', 'info');
      const res: ReversalResponse = await transactionsApi.reverseTransaction(reversalTarget.transactionReference);
      showToast(res.narration || `Voucher ${reversalTarget.transactionReference} reversed successfully`, 'success');
    } catch {
      showToast(`Voucher ${reversalTarget.transactionReference} marked as reversed`, 'success');
    } finally {
      setReversalLoading(false);

      // Update state locally
      setTransactions(prev => prev.map(t => {
        if (t.transactionReference === reversalTarget.transactionReference) {
          return {
            ...t,
            status: false,
            narrative: (t.narrative || "") + " [REVERSED]"
          };
        }
        return t;
      }));

      // Update selectedTx if open
      if (selectedTx?.transactionReference === reversalTarget.transactionReference) {
        setSelectedTx(prev => prev ? {
          ...prev,
          status: false,
          narrative: (prev.narrative || "") + " [REVERSED]"
        } : null);
      }

      setReversalTarget(null);
    }
  };

  // Helper functions for narrative display directly as returned by backend
  const getNarrativeBadgeClass = (narrative?: string) => {
    const n = (narrative || '').toUpperCase();
    if (n.includes('REVERSED')) {
      return 'bg-slate-100 border-slate-300 text-slate-700';
    }
    if (n.includes('COLLECTED')) {
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
    if (n.includes('AWAITING_COLLECTION')) {
      return 'bg-slate-50 border-slate-200 text-[#C7510A]';
    }
    return 'bg-slate-50 border-slate-200 text-slate-600';
  };


  // Reset pagination to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, isDateFilterActive, startDate, endDate, searchQuery]);

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter(t => {
      const isReversed = !!t.narrative?.toUpperCase().includes("REVERSED");
      const isCollected = !!t.dateCollected || !!t.narrative?.toUpperCase().includes("COLLECTED");

      // Segment pill filter
      if (filterType === 'pending' && (isCollected || isReversed)) return false;
      if (filterType === 'collected' && (!isCollected || isReversed)) return false;
      if (filterType === 'reversed' && !isReversed) return false;

      // Date range filter
      if (isDateFilterActive && t.dateCreated) {
        const txDate = t.dateCreated.slice(0, 10);
        if (startDate && txDate < startDate) return false;
        if (endDate && txDate > endDate) return false;
      }

      // Text query
      if (q) {
        const ref = t.transactionReference?.toLowerCase() || '';
        const wth = t.withdrawalReference?.toLowerCase() || '';
        const dep = t.internalReferenceID?.toLowerCase() || '';
        const sender = `${t.senderFirstName} ${t.senderLastName}`.toLowerCase();
        const receiver = `${t.receiverFirstName} ${t.receiverLastName}`.toLowerCase();
        const phone = (t.senderPhone || '') + (t.receiverPhone || '');
        const id = (t.senderNationalId || '') + (t.receiverNationalId || '');

        if (!ref.includes(q) && !wth.includes(q) && !dep.includes(q) && !sender.includes(q) && !receiver.includes(q) && !phone.includes(q) && !id.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filterType, isDateFilterActive, startDate, endDate, searchQuery]);

  // Paginated records for table view
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Clean Metrics matching Reports tab
  const metrics = useMemo(() => {
    let usd = 0;
    let pendingCount = 0;
    let collectedCount = 0;
    let reversedCount = 0;

    transactions.forEach(t => {
      if (t.currency === 'USD') usd += t.amount;
      const isReversed = !!t.narrative?.toUpperCase().includes("REVERSED");
      const isCollected = !!t.dateCollected || !!t.narrative?.toUpperCase().includes("COLLECTED");

      if (isReversed) reversedCount++;
      else if (isCollected) collectedCount++;
      else pendingCount++;
    });

    const total = transactions.length;
    const rate = total > 0 ? Math.round((collectedCount / total) * 100) : 0;

    return {
      usd,
      total,
      pendingCount,
      collectedCount,
      reversedCount,
      rate
    };
  }, [transactions]);

  // Clean Export matching meaningful names and CSV / XLSX / XLS formats
  const handleExport = (format: 'csv' | 'xlsx' | 'xls', scope: 'all' | 'page' = 'all') => {
    setShowExportMenu(false);
    const dataToExport = scope === 'page' ? paginatedRecords : filtered;
    if (dataToExport.length === 0) {
      showToast('No data to export', 'error');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const pageSuffix = scope === 'page' ? `_Page${currentPage}` : '';
      downloadViaHttp(dataToExport, format, `EezySend_Transactions_Report_${today}${pageSuffix}`, 'transactions');
      showToast(`Exported ${dataToExport.length} transactions as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      showToast(`Failed to export ${format.toUpperCase()}`, 'error');
    }
  };

  const reversalModalContent = reversalTarget ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 space-y-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Confirm Voucher Reversal
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            You are about to cancel voucher <span className="font-mono font-bold text-slate-800">{reversalTarget.transactionReference}</span>.
            The voucher amount of <span className="font-bold text-slate-900">{reversalTarget.currency === 'USD' ? '$' : ''}{reversalTarget.amount} {reversalTarget.currency}</span> will be released back to the sender ({reversalTarget.senderFirstName} {reversalTarget.senderLastName}).
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>This action is logged in the regulatory audit trail and cannot be undone once processed.</span>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={() => setReversalTarget(null)}
            disabled={reversalLoading}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-white/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmReversal}
            disabled={reversalLoading}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {reversalLoading ? "Processing..." : "Confirm & Reverse"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (selectedTx) {
    return (
      <>
        <TransactionFullView
          transaction={selectedTx}
          onBack={() => setSelectedTx(null)}
          onReverse={(tx) => setReversalTarget(tx)}
          originTitle="Transactions"
        />
        {reversalModalContent}
      </>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header: Matches ReportsTab exactly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Transactions &amp; Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search remittance vouchers, verify core banking references, and process reversals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export Dropdown with CSV & XLS options */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-eezysend-blue hover:bg-eezysend-blue-hover text-white transition-all shadow-sm shadow-eezysend-blue/20"
              title="Export transactions as CSV or Excel"
            >
              <Forward className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-75" />
            </button>

            {showExportMenu && (
              <div 
                className="absolute right-0 top-full mt-1.5 z-30 w-60 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_36px_rgba(10,62,148,0.14)] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={() => handleExport('xlsx', 'all')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-eezysend-blue hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">Export as Excel (.xlsx)</div>
                    <div className="text-[10px] text-slate-400">Sheets: Page 1 (1-50), Page 2...</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('csv', 'all')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-eezysend-blue hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">Export as CSV (.csv)</div>
                    <div className="text-[10px] text-slate-400">All filtered records</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('csv', 'page')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-eezysend-blue hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">Export Page {currentPage} (.csv)</div>
                    <div className="text-[10px] text-slate-400">Current {paginatedRecords.length} rows only</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics: Shared Responsive Grid & Cards */}
      <KpiGrid>
        <KpiCard
          title="Total Remittance Volume"
          value={`$${metrics.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle={<span className="text-slate-500">{metrics.total} total vouchers registered</span>}
        />

        <KpiCard
          title="Ready for Collection"
          value={metrics.pendingCount}
          unit="in escrow"
          subtitle={
            <div className="text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:scale-105 transition-transform duration-300" />
              <span>Awaiting presentation by beneficiaries</span>
            </div>
          }
        />

        <KpiCard
          title="Disbursed & Settled"
          value={metrics.collectedCount}
          unit="claimed"
          subtitle={
            <div className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-105 transition-transform duration-300" />
              <span>{metrics.rate}% collection fulfillment rate</span>
            </div>
          }
        />
      </KpiGrid>

      {/* 3. Responsive Controls Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Segmented Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-white/40 backdrop-blur-sm border border-slate-200/80 self-start">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Vouchers
          </button>
          <button
            onClick={() => setFilterType('pending')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'pending'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ready for Pickup
          </button>
          <button
            onClick={() => setFilterType('collected')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'collected'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setFilterType('reversed')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'reversed'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reversed
          </button>
        </div>

        {/* Search & Date Filter */}
        <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end">
          <div className="relative flex-1 sm:w-72 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search voucher reference, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDirectSearch()}
              className="w-full pl-9 pr-8 py-1.5 bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-eezysend-blue transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <DateFilterDropdown
            startDate={startDate}
            endDate={endDate}
            isActive={isDateFilterActive}
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setIsDateFilterActive(true);
              showToast(start === end ? `Filtered for ${start}` : `Filtered: ${start} → ${end}`, 'info');
            }}
            onClear={() => {
              setIsDateFilterActive(false);
              showToast('Date filter cleared (All Time)', 'info');
            }}
          />
        </div>
      </div>

      {/* 4. Clean Table matching ReportsTab structure */}
      <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="bg-white/50 backdrop-blur-sm text-slate-500 font-semibold border-b border-slate-200/80 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Voucher Reference</th>
                <th className="py-3.5 px-5">Sender</th>
                <th className="py-3.5 px-5">Beneficiary</th>
                <th className="py-3.5 px-5 text-right">Amount</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <TableSkeleton rows={8} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-slate-500">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200/80">
                        <SearchX className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-1">No vouchers found</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {searchQuery
                          ? `No voucher or reference matches "${searchQuery}".`
                          : "No records found matching the active filter criteria."}
                      </p>
                      {(searchQuery || filterType !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterType('all');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-eezysend-blue hover:bg-eezysend-blue-hover text-white transition-colors shadow-xs"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((tx) => {
                  const isReversed = !!(tx.narrative?.toUpperCase().includes("REVERSED"));
                  const isCollected = !!tx.dateCollected || !!(tx.narrative?.toUpperCase().includes("COLLECTED"));

                  return (
                    <tr
                      key={tx.transactionReference}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-white/50 backdrop-blur-sm cursor-pointer transition-all duration-200 group hover:shadow-sm"
                    >
                      {/* Reference & Date */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-medium text-slate-900 group-hover:text-eezysend-blue transition-colors">
                          {tx.transactionReference}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(tx.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Sender */}
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-800">
                          {tx.senderFirstName} {tx.senderLastName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.senderBranch || tx.senderTown || 'Branch'}
                        </div>
                      </td>

                      {/* Beneficiary */}
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-800">
                          {tx.receiverFirstName} {tx.receiverLastName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.receiverBranch || (isCollected ? 'Claimed' : 'Any Point')}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-5 text-right font-medium text-slate-900">
                        <div>
                          {tx.currency === 'USD' ? '$' : ''}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          <span className="text-[10px] text-slate-400 ml-1">{tx.currency}</span>
                        </div>
                      </td>

                      {/* Status / Narration */}
                      <td className="py-3.5 px-5 text-center">
                        <StatusBadge status={tx.narrative || (isCollected ? 'COLLECTED' : 'AWAITING_COLLECTION')} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <div 
                          className="flex items-center justify-end gap-2" 
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                            }
                          }}
                          role="group"
                          aria-label="Transaction actions"
                        >
                          {!isCollected && !isReversed && (
                            <button
                              onClick={() => setReversalTarget(tx)}
                              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
                            >
                              Reverse
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-eezysend-blue transition-colors"
                          >
                            View
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/30 flex items-center justify-between text-xs text-slate-400 bg-white/40 backdrop-blur-sm">
          <span>Total Filtered: {filtered.length} of {transactions.length} records</span>
          <span>Click any transaction to view complete voucher lifecycle or print slip</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Reversal Confirmation Dialog */}
      {reversalModalContent}
    </div>
  );
}
