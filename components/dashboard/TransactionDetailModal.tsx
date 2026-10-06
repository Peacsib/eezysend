"use client";

import React from "react";
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  ShieldCheck, 
  Copy,
  Check,
  Printer,
  RotateCcw,
} from "lucide-react";
import type { ReportTransaction } from "@/lib/types";

interface TransactionDetailModalProps {
  readonly transaction: ReportTransaction | null;
  readonly onClose: () => void;
  readonly onReverse?: (transaction: ReportTransaction) => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
  onReverse,
}: TransactionDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCollected = !!transaction.dateCollected;
  const isSuccess = transaction.status;

  // Helper functions to avoid nested ternaries
  const getStatusBgClass = () => {
    if (!isSuccess) return 'bg-rose-50 text-rose-600';
    if (isCollected) return 'bg-emerald-50 text-emerald-600';
    return 'bg-eezysend-blue-light text-eezysend-blue';
  };

  const getStatusIcon = () => {
    if (!isSuccess) return <AlertCircle className="w-5 h-5" />;
    if (isCollected) return <CheckCircle2 className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getStatusBadgeClass = () => {
    if (!isSuccess) return 'bg-rose-50 border-rose-200 text-rose-700';
    if (isCollected) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  const getStatusText = () => {
    if (!isSuccess) return 'Failed';
    if (isCollected) return 'Collected';
    return 'Pending Collection';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-detail-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)] rounded-3xl text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/95 backdrop-blur-md border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusBgClass()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="transaction-detail-title" className="text-base font-bold text-slate-900 font-mono tracking-tight">
                  {transaction.transactionReference}
                </h2>
                <button
                  onClick={() => handleCopy(transaction.transactionReference)}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Internal ID: <span className="font-mono text-slate-600">{transaction.internalReferenceID || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass()}`}>
              {getStatusText()}
            </span>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Amount & Fee Banner */}
          <div className="p-5 rounded-2xl bg-eezysend-blue-light/70 border border-eezysend-blue/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Remittance Amount
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                  {transaction.currency === 'USD' ? '$' : ''}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                  <span className="text-base font-semibold text-eezysend-blue">{transaction.currency}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 sm:text-right text-xs">
                <div>
                  <span className="text-slate-500 block">Service Charge</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {transaction.currency} {typeof transaction.charge === 'number' ? transaction.charge.toFixed(2) : (transaction.charge || '0.00')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tax / IMTT</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {transaction.currency} {(transaction.tax || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Channel</span>
                  <span className="inline-block px-2 py-0.5 mt-0.5 text-xs font-medium bg-white text-slate-700 rounded border border-slate-200">
                    {transaction.channel || 'BRANCH'}
                  </span>
                </div>
              </div>
            </div>

            {transaction.narrative && (
              <div className="mt-3 pt-3 border-t border-eezysend-blue/10 flex items-start gap-2">
                <FileText className="w-4 h-4 text-eezysend-blue shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 italic">
                  "{transaction.narrative}"
                </p>
              </div>
            )}
          </div>

          {/* Sender & Receiver Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender */}
            <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                <div className="p-1 rounded-lg bg-blue-100 text-eezysend-blue">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sender</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <p className="font-semibold text-slate-800 text-sm">
                    {[transaction.senderFirstName, transaction.senderMiddleName, transaction.senderLastName].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">National ID</span>
                    <p className="font-mono text-slate-700 font-medium">{transaction.senderNationalId || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone</span>
                    <p className="text-slate-700 font-medium">{transaction.senderPhone || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Origin Branch</span>
                    <p className="text-slate-700 font-medium">{transaction.senderBranch || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Teller ID</span>
                    <p className="font-mono text-slate-600">{transaction.senderTeller || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Beneficiary</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <p className="font-semibold text-slate-800 text-sm">
                    {[transaction.receiverFirstName, transaction.receiverMiddleName, transaction.receiverLastName].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">National ID</span>
                    <p className="font-mono text-slate-700 font-medium">{transaction.receiverNationalId || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone</span>
                    <p className="text-slate-700 font-medium">{transaction.receiverPhone || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payout Branch</span>
                    <p className="text-slate-700 font-medium">{transaction.receiverBranch || 'Pending'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payout Teller</span>
                    <p className="font-mono text-slate-600">{transaction.receiverTeller || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Compliance */}
          <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/70 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-eezysend-blue" />
              Regulatory Audit Trail
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
                <span className="text-slate-400 block text-[10px]">Date Created</span>
                <span className="font-medium text-slate-800">
                  {transaction.dateCreated ? new Date(transaction.dateCreated).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
                <span className="text-slate-400 block text-[10px]">Date Collected</span>
                <span className="font-medium text-slate-800">
                  {transaction.dateCollected ? new Date(transaction.dateCollected).toLocaleDateString() : 'Pending'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
                <span className="text-slate-400 block text-[10px]">Reported</span>
                <span className={`font-semibold ${transaction.reported ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {transaction.reported ? 'Yes' : 'Pending'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(10,62,148,0.08)]">
                <span className="text-slate-400 block text-[10px]">Withdrawal Ref</span>
                <span className="font-mono text-slate-700 truncate block">
                  {transaction.withdrawalReference || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-white/50 backdrop-blur-sm border-t border-white/30 rounded-b-3xl">
          <p className="text-xs text-slate-400">
            EezySend Financial Operations &middot; Audit View
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-white/40 rounded-xl transition-colors border border-slate-200 shadow-sm"
              title="Print official teller slip"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Slip</span>
            </button>
            {onReverse && !isCollected && !transaction.narrative?.includes("[REVERSED]") && (
              <button
                onClick={() => onReverse(transaction)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Reverse Voucher</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-eezysend-blue hover:bg-eezysend-blue-hover rounded-xl transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
