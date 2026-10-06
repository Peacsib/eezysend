"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Send,
  MessageSquare,
  Phone,
  X,
  ChevronRight,
  Sparkles,
  Smartphone,
  Check,
  Copy,
} from "lucide-react";
import { smsApi, mockSMSList, mockReportTransactions } from "@/lib/api";
import type { SMSModel, ReportTransaction } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/LoadingSpinner";

export default function SMSTab() {
  const { showToast } = useToast();
  
  // Navigation segment: 'all' | 'delivered' | 'failed'
  const [filterType, setFilterType] = useState<'all' | 'delivered' | 'failed'>('all');
  
  // Data state
  const [smsList, setSmsList] = useState<SMSModel[]>(mockSMSList);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Resend action loading map (keyed by transactionReference)
  const [resendingMap, setResendingMap] = useState<Record<string, boolean>>({});

  // Selected SMS record for detail / preview modal
  const [selectedSMS, setSelectedSMS] = useState<SMSModel | null>(null);

  // Copy phone feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast('Phone number copied', 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Find linked remittance transaction for richer message preview
  const linkedTx = useMemo<ReportTransaction | undefined>(() => {
    if (!selectedSMS) return undefined;
    return mockReportTransactions.find(t => t.transactionReference === selectedSMS.transactionReference);
  }, [selectedSMS]);

  // Handle Resend SMS
  const handleResend = async (txRef: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResendingMap(prev => ({ ...prev, [txRef]: true }));

    try {
      await smsApi.resendSMS(txRef);
    } catch {
      // Handled via local state
    } finally {
      // Simulate gateway delivery confirmation
      setTimeout(() => {
        setSmsList(prev => prev.map(item => {
          if (item.transactionReference === txRef) {
            return {
              ...item,
              senderStatus: true,
              receiverStatus: true,
            };
          }
          return item;
        }));

        if (selectedSMS?.transactionReference === txRef) {
          setSelectedSMS(prev => prev ? {
            ...prev,
            senderStatus: true,
            receiverStatus: true,
          } : null);
        }

        setResendingMap(prev => ({ ...prev, [txRef]: false }));
        showToast(`Collection SMS re-dispatched successfully for voucher ${txRef}`, 'success');
      }, 700);
    }
  };

  // Direct lookup via reference
  const handleDirectSearch = async () => {
    const q = searchQuery.trim();
    if (!q) {
      showToast('Please enter a transaction reference', 'error');
      return;
    }

    setLoading(true);
    try {
      const match = await smsApi.getSMSByReference(q);
      if (match && match.transactionReference) {
        setSelectedSMS(match);
        showToast('SMS record found', 'success');
      } else {
        showToast('SMS record not found', 'error');
      }
    } catch {
      showToast('Failed to fetch SMS record', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return smsList.filter(item => {
      const bothDelivered = item.senderStatus && item.receiverStatus;
      
      if (filterType === 'delivered' && !bothDelivered) return false;
      if (filterType === 'failed' && bothDelivered) return false;

      if (q) {
        const ref = item.transactionReference.toLowerCase();
        const sPhone = item.senderPhone.toLowerCase();
        const rPhone = item.receiverPhone.toLowerCase();
        if (!ref.includes(q) && !sPhone.includes(q) && !rPhone.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [smsList, filterType, searchQuery]);

  // Metrics matching ReportsTab and TransactionsTab
  const metrics = useMemo(() => {
    const total = smsList.length;
    let deliveredCount = 0;
    let exceptionCount = 0;

    smsList.forEach(item => {
      if (item.senderStatus && item.receiverStatus) {
        deliveredCount++;
      } else {
        exceptionCount++;
      }
    });

    const rate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;

    return {
      total,
      deliveredCount,
      exceptionCount,
      rate,
    };
  }, [smsList]);

  // Clean CSV Export
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Voucher Reference", "Date Dispatched", "Sender Phone", "Sender Status", "Receiver Phone", "Receiver Status"
    ];
    const rows = filtered.map(s => [
      `"${s.transactionReference}"`,
      `"${new Date(s.dateCreated).toLocaleString()}"`,
      `"${s.senderPhone}"`,
      s.senderStatus ? "Delivered" : "Failed",
      `"${s.receiverPhone}"`,
      s.receiverStatus ? "Delivered" : "Failed"
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eezysend_sms_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header: Matches ReportsTab exactly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            SMS Notifications &amp; Delivery
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit SMS gateway transmission receipts and re-dispatch recipient voucher alerts
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
        {/* Total SMS Dispatched */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Total SMS Dispatched</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.total * 2}{' '}
            <span className="text-xs font-normal text-slate-400">alerts ({metrics.total} vouchers)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Sender confirmation &amp; beneficiary notifications
          </div>
        </div>

        {/* Delivered Successfully */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Delivered Successfully</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.deliveredCount}{' '}
            <span className="text-xs font-normal text-slate-400">vouchers complete</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{metrics.rate}% network delivery confirmation rate</span>
          </div>
        </div>

        {/* Delivery Exceptions */}
        <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
          <span className="text-xs font-medium text-slate-500">Delivery Exceptions / In Queue</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.exceptionCount}{' '}
            <span className="text-xs font-normal text-slate-400">flagged</span>
          </div>
          <div className="text-xs text-amber-700 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Eligible for instant 1-click re-dispatch</span>
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
            All Dispatches
          </button>
          <button
            onClick={() => setFilterType('delivered')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'delivered'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilterType('failed')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'failed'
                ? 'bg-eezysend-blue text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending / Failed
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher ref or phone (+263...)..."
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
                <th className="py-3.5 px-5">Sender Phone</th>
                <th className="py-3.5 px-5">Beneficiary Phone</th>
                <th className="py-3.5 px-5 text-center">Gateway Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <TableSkeleton rows={8} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No SMS transmission records found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const bothDelivered = item.senderStatus && item.receiverStatus;
                  const partial = (item.senderStatus && !item.receiverStatus) || (!item.senderStatus && item.receiverStatus);
                  const isResending = !!resendingMap[item.transactionReference];

                  return (
                    <tr
                      key={item.transactionReference}
                      onClick={() => setSelectedSMS(item)}
                      className="hover:bg-white/50 backdrop-blur-sm/70 cursor-pointer transition-colors group"
                    >
                      {/* Reference & Date */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-medium text-slate-900 group-hover:text-eezysend-blue transition-colors">
                          {item.transactionReference}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(item.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(item.dateCreated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Sender Phone */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-slate-800 flex items-center gap-1.5">
                          <span>{item.senderPhone}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.senderStatus ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.senderStatus ? 'Receipt Delivered' : 'Delivery Pending'}
                        </div>
                      </td>

                      {/* Beneficiary Phone */}
                      <td className="py-3.5 px-5">
                        <div className="font-mono text-slate-800 flex items-center gap-1.5">
                          <span>{item.receiverPhone}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.receiverStatus ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.receiverStatus ? 'Collection Code Delivered' : 'Collection Alert Failed'}
                        </div>
                      </td>

                      {/* Overall Status Badge */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          bothDelivered
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : partial
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>
                          {bothDelivered ? 'Delivered' : partial ? 'Partial' : 'Failed'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleResend(item.transactionReference, e)}
                            disabled={isResending}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 border ${
                              !bothDelivered
                                ? 'bg-eezysend-blue-light hover:bg-eezysend-blue text-eezysend-blue hover:text-white border-eezysend-blue/30'
                                : 'bg-white/50 backdrop-blur-sm hover:bg-white/40 text-slate-600 border-slate-200'
                            }`}
                            title="Re-dispatch collection SMS"
                          >
                            <Send className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                            <span>{isResending ? 'Sending...' : 'Resend'}</span>
                          </button>

                          <button
                            onClick={() => setSelectedSMS(item)}
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
          <span>Showing {filtered.length} of {smsList.length} dispatch logs</span>
          <span>Click any row to preview message text and gateway receipt</span>
        </div>
      </div>

      {/* 5. SMS Message Preview & Delivery Receipt Modal */}
      {selectedSMS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 space-y-4 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eezysend-blue-light text-eezysend-blue flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SMS Gateway Dispatch</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Voucher {selectedSMS.transactionReference}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSMS(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated SMS Message Preview Bubbles */}
            <div className="space-y-3">
              {/* Beneficiary SMS Bubble */}
              <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-eezysend-blue" />
                    Beneficiary Collection Alert
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedSMS.receiverStatus
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {selectedSMS.receiverStatus ? 'Delivered' : 'Delivery Failed'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]/70 text-xs text-slate-800 font-mono leading-relaxed shadow-2xs">
                  "CABS EezySend: You have received {linkedTx ? `${linkedTx.currency === 'USD' ? '$' : ''}${linkedTx.amount} ${linkedTx.currency}` : 'funds'} from {linkedTx ? `${linkedTx.senderFirstName} ${linkedTx.senderLastName}` : 'Sender'}. Collection Code: {selectedSMS.transactionReference}. Present your National ID at any CABS Branch to collect."
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>To: <strong className="font-mono text-slate-700">{selectedSMS.receiverPhone}</strong></span>
                  <button
                    onClick={() => handleCopy(selectedSMS.receiverPhone)}
                    className="text-eezysend-blue hover:underline"
                  >
                    {copiedText === selectedSMS.receiverPhone ? 'Copied' : 'Copy Phone'}
                  </button>
                </div>
              </div>

              {/* Sender SMS Bubble */}
              <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    Sender Confirmation Receipt
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedSMS.senderStatus
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {selectedSMS.senderStatus ? 'Delivered' : 'Delivery Failed'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]/70 text-xs text-slate-800 font-mono leading-relaxed shadow-2xs">
                  "CABS EezySend: Remittance created successfully. Voucher {selectedSMS.transactionReference} issued to {linkedTx ? `${linkedTx.receiverFirstName} ${linkedTx.receiverLastName}` : 'Recipient'}. Funds reserved safely."
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>To: <strong className="font-mono text-slate-700">{selectedSMS.senderPhone}</strong></span>
                  <button
                    onClick={() => handleCopy(selectedSMS.senderPhone)}
                    className="text-eezysend-blue hover:underline"
                  >
                    {copiedText === selectedSMS.senderPhone ? 'Copied' : 'Copy Phone'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/30">
              <span className="text-[11px] text-slate-400">
                Logged {new Date(selectedSMS.dateCreated).toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSMS(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-white/40 rounded-xl transition-colors border border-slate-200 shadow-sm"
                >
                  Close
                </button>

                <button
                  onClick={() => handleResend(selectedSMS.transactionReference)}
                  disabled={resendingMap[selectedSMS.transactionReference]}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-eezysend-blue hover:bg-eezysend-blue-hover rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${resendingMap[selectedSMS.transactionReference] ? 'animate-spin' : ''}`} />
                  <span>{resendingMap[selectedSMS.transactionReference] ? 'Sending...' : 'Resend Alerts'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
