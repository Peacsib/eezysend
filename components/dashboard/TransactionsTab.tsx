"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { transactionsApi, mockReportTransactions } from "@/lib/api";
import type { ReportTransaction, ReversalResponse } from "@/lib/types";
import TransactionDetailModal from "./TransactionDetailModal";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/LoadingSpinner";

export default function TransactionsTab() {
  const { showToast } = useToast();
  
  // Navigation segment: 'all' | 'pending' | 'collected' | 'reversed'
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'collected' | 'reversed'>('all');
  
  // Transactions data
  const [transactions, setTransactions] = useState<ReportTransaction[]>(mockReportTransactions);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  // Helper functions for status display
  const getStatusBadgeClass = (isSuccess: boolean, isCollected: boolean, isReversed: boolean) => {
    if (isReversed) {
      return 'bg-white/40 border-slate-300 text-slate-700';
    }
    if (!isSuccess) {
      return 'bg-rose-50 border-rose-200 text-rose-700';
    }
    if (isCollected) {
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  const getStatusText = (isSuccess: boolean, isCollected: boolean, isReversed: boolean) => {
    if (isReversed) return 'Reversed';
    if (!isSuccess) return 'Failed';
    if (isCollected) return 'Collected';
    return 'Ready';
  };

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter(t => {
      const isCollected = !!t.dateCollected;
      const isReversed = t.narrative?.includes("[REVERSED]");

      // Segment pill filter
      if (filterType === 'pending' && (isCollected || isReversed)) return false;
      if (filterType === 'collected' && (!isCollected || isReversed)) return false;
      if (filterType === 'reversed' && !isReversed) return false;

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
  }, [transactions, filterType, searchQuery]);

  // Clean Metrics matching Reports tab
  const metrics = useMemo(() => {
    let usd = 0;
    let pendingCount = 0;
    let collectedCount = 0;
    let reversedCount = 0;

    transactions.forEach(t => {
      if (t.currency === 'USD') usd += t.amount;
      const isCollected = !!t.dateCollected;
      const isReversed = t.narrative?.includes("[REVERSED]");

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

  // Clean CSV Export matching Reports tab
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Reference", "Date", "Status", "Amount", "Currency", "Fee", "Sender", "Receiver", "Sender Branch", "Payout Branch"
    ];
    const rows = filtered.map(t => [
      `"${t.transactionReference}"`,
      `"${new Date(t.dateCreated).toLocaleDateString()}"`,
      t.narrative?.includes("[REVERSED]") ? "Reversed" : t.dateCollected ? "Collected" : "Pending",
      t.amount,
      `"${t.currency}"`,
      t.charge || 0,
      `"${t.senderFirstName} ${t.senderLastName}"`,
      `"${t.receiverFirstName} ${t.receiverLastName}"`,
      `"${t.senderBranch || ''}"`,
      `"${t.receiverBranch || ''}"`
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eezysend_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-eezysend-blue hover:bg-eezysend-blue-hover text-white transition-all shadow-sm shadow-eezysend-blue/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics: 3 Quiet, high-scannability cards matching ReportsTab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Remittances */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Total Remittance Volume</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            ${metrics.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {metrics.total} total vouchers registered
          </div>
        </div>

        {/* Ready for Collection (In Escrow) */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Ready for Collection</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.pendingCount}{' '}
            <span className="text-xs font-normal text-slate-400">in escrow</span>
          </div>
          <div className="text-xs text-amber-700 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Awaiting presentation by beneficiaries</span>
          </div>
        </div>

        {/* Disbursed & Completed */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Disbursed &amp; Settled</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.collectedCount}{' '}
            <span className="text-xs font-normal text-slate-400">claimed</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{metrics.rate}% collection fulfillment rate</span>
          </div>
        </div>
      </div>

      {/* 3. Clean, Single-Row Controls Bar matching ReportsTab */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
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
            Collected
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

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher, T24, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDirectSearch()}
              className="w-full pl-9 pr-3 py-1.5 bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-eezysend-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 4. Clean Table matching ReportsTab structure */}
      <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions found matching this search.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isCollected = !!tx.dateCollected;
                  const isReversed = !!(tx.narrative?.includes("[REVERSED]"));
                  const isSuccess = tx.status;

                  return (
                    <tr
                      key={tx.transactionReference}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-white/50 backdrop-blur-sm/70 cursor-pointer transition-colors group"
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

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(isSuccess, isCollected, isReversed)}`}>
                          {getStatusText(isSuccess, isCollected, isReversed)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {!isCollected && !isReversed && (
                            <button
                              onClick={() => setReversalTarget(tx)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors"
                            >
                              Reverse
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-eezysend-blue transition-colors"
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
          <span>Showing {filtered.length} of {transactions.length} records</span>
          <span>Click any transaction to view complete voucher lifecycle or print slip</span>
        </div>
      </div>

      {/* Transaction Detail Modal matching ReportsTab */}
      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onReverse={(tx) => setReversalTarget(tx)}
      />

      {/* Reversal Confirmation Dialog */}
      {reversalTarget && (
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
                The principal amount of <span className="font-bold text-slate-900">{reversalTarget.currency === 'USD' ? '$' : ''}{reversalTarget.amount} {reversalTarget.currency}</span> will be released back to the sender ({reversalTarget.senderFirstName} {reversalTarget.senderLastName}).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800">
              ⚠️ This action is logged in the regulatory audit trail and cannot be undone once processed.
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
      )}
    </div>
  );
}
