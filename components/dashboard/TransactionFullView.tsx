"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Printer, 
  RotateCcw,
  User,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
  Building2,
  FileText,
  Eye,
  X
} from "lucide-react";
import type { ReportTransaction } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import VoucherPrintSlip from "./VoucherPrintSlip";
import StatusBadge from "@/components/ui/StatusBadge";

interface TransactionFullViewProps {
  readonly transaction: ReportTransaction;
  readonly onBack: () => void;
  readonly onReverse?: (transaction: ReportTransaction) => void;
  readonly originTitle?: string;
}

export function TransactionFullView({
  transaction,
  onBack,
  onReverse,
  originTitle = "Reporting",
}: TransactionFullViewProps) {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSlipPreview, setShowSlipPreview] = useState(false);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `EezySend_Voucher_${transaction.transactionReference || 'Slip'}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const isReversed = !!transaction.narrative?.toUpperCase().includes('REVERSED');
  const isCollected = !!transaction.dateCollected || !!transaction.narrative?.toUpperCase().includes('COLLECTED');

  const chargeVal = typeof transaction.charge === 'number' 
    ? transaction.charge 
    : parseFloat(transaction.charge || '0') || 0;
  const taxVal = Number(transaction.tax) || 0;
  const totalDebit = (Number(transaction.amount) || 0) + chargeVal + taxVal;

  const senderFullName = [transaction.senderFirstName, transaction.senderMiddleName, transaction.senderLastName]
    .filter(Boolean)
    .join(' ') || 'N/A';

  const receiverFullName = [transaction.receiverFirstName, transaction.receiverMiddleName, transaction.receiverLastName]
    .filter(Boolean)
    .join(' ') || 'N/A';

  const formatPhone = (p?: string) => {
    if (!p) return 'N/A';
    const clean = p.replace(/\s+/g, '');
    if (clean.length === 10 && clean.startsWith('0')) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return p;
  };

  return (
    <>
      {/* 1. Official Slip Document (Visible ONLY in print / PDF save) */}
      <div className="hidden print:block">
        <VoucherPrintSlip transaction={transaction} />
      </div>

      {/* 2. Interactive Screen UI - Hidden completely during print */}
      <div className="no-print space-y-3.5 max-w-6xl mx-auto animate-in fade-in duration-150">
        {/* Top Navigation Bar - Calm, Minimalist */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Back to {originTitle}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>/</span>
              <span className="text-slate-500">Voucher</span>
              <span>/</span>
              <span className="font-mono text-slate-800 font-semibold">{transaction.transactionReference}</span>
            </div>

            <StatusBadge
              status={isReversed ? 'REVERSED' : isCollected ? 'COLLECTED' : 'AWAITING_COLLECTION'}
              dot={true}
            />
          </div>

          <div className="flex items-center gap-2">
            {onReverse && !isCollected && !isReversed && (
              <button
                onClick={() => onReverse(transaction)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reverse Voucher</span>
              </button>
            )}

            <button
              onClick={() => setShowSlipPreview(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200/80 shadow-2xs cursor-pointer active:scale-95"
              title="Preview official CABS digital slip before printing"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Slip</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-eezysend-blue hover:bg-eezysend-blue-hover rounded-xl transition-all shadow-sm shadow-eezysend-blue/20 cursor-pointer active:scale-95"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

      {/* 3. Hero Financial Summary - Calm, Monochromatic & Clean */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Reference Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Voucher Reference
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 uppercase">
                {transaction.channel || 'BRANCH'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {transaction.transactionReference}
              </h2>
              <button
                onClick={() => handleCopy(transaction.transactionReference, 'Voucher Reference')}
                className="no-print p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                title="Copy Reference"
              >
                {copiedKey === 'Voucher Reference' ? (
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Internal Ref: <strong className="text-slate-700 font-medium">{transaction.internalReferenceID || 'N/A'}</strong></span>
              {transaction.narrative && (
                <>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500 font-sans italic truncate max-w-sm">"{transaction.narrative}"</span>
                </>
              )}
            </div>
          </div>

          {/* Direct JSON Financial Breakdown - Separate, Clean & Unbundled */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Amount</span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                ${transaction.amount.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">{transaction.currency}</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Charge</span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                ${chargeVal.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">{transaction.currency}</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Tax</span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                ${taxVal.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">{transaction.currency}</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total</span>
              <span className="text-lg font-bold text-slate-900 block mt-0.5">
                ${totalDebit.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">{transaction.currency}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Parties: Sender Profile vs Beneficiary Profile (Calm & Uniform) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Sender Card */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Sender
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {senderFullName}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Sender Branch</span>
                <span className="text-xs font-semibold text-slate-700">{transaction.senderBranch || 'Harare Central'}</span>
              </div>
            </div>

            <div className="py-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  National ID
                </span>
                <span className="font-mono font-medium text-slate-800">
                  {transaction.senderNationalId || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Phone
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-slate-800">
                    {formatPhone(transaction.senderPhone)}
                  </span>
                  {transaction.senderPhone && (
                    <button
                      onClick={() => handleCopy(transaction.senderPhone, 'Sender Phone')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy phone"
                    >
                      {copiedKey === 'Sender Phone' ? <Check className="w-3 h-3 text-slate-700" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Address / City
                </span>
                <span className="font-medium text-slate-700 truncate max-w-[260px] text-right">
                  {[transaction.senderAddress, transaction.senderTown].filter(Boolean).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Origin Teller:</span>
            <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[280px]" title={transaction.senderTeller || ''}>
              {transaction.senderTeller || 'SYS-ONLINE'}
            </span>
          </div>
        </div>

        {/* Beneficiary Card */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Beneficiary
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {receiverFullName}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Receiver Branch</span>
                <span className="text-xs font-semibold text-slate-700">
                  {transaction.receiverBranch || (isCollected ? 'Claimed' : 'Any CABS Branch')}
                </span>
              </div>
            </div>

            <div className="py-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  National ID
                </span>
                <span className="font-mono font-medium text-slate-800">
                  {transaction.receiverNationalId || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Phone
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-slate-800">
                    {formatPhone(transaction.receiverPhone)}
                  </span>
                  {transaction.receiverPhone && (
                    <button
                      onClick={() => handleCopy(transaction.receiverPhone, 'Beneficiary Phone')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy phone"
                    >
                      {copiedKey === 'Beneficiary Phone' ? <Check className="w-3 h-3 text-slate-700" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Destination / Town
                </span>
                <span className="font-medium text-slate-700 truncate max-w-[260px] text-right">
                  {[transaction.receiverAddress, transaction.receiverTown].filter(Boolean).join(', ') || 'Any CABS Branch Nationwide'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Receiver Teller:</span>
            <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[280px]" title={transaction.receiverTeller || ''}>
              {transaction.receiverTeller || (isCollected ? 'Verified' : 'Pending')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Audit Trail - Clean, Light Neutral Card (No dark bar) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date Created</span>
              <span className="font-medium text-slate-800 truncate block">
                {transaction.dateCreated ? new Date(transaction.dateCreated).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date Collected</span>
              <span className="font-medium text-slate-800 truncate block">
                {transaction.dateCollected ? new Date(transaction.dateCollected).toLocaleDateString() : 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reported</span>
              <span className="font-medium text-slate-800 truncate block">
                {transaction.reported ? 'Yes' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Withdrawal Ref</span>
              <span className="font-mono text-slate-700 truncate block text-[11px]">
                {transaction.withdrawalReference || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 3. Official Voucher Slip Preview Modal */}
    {showSlipPreview && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowSlipPreview(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-eezysend-blue flex items-center justify-center border border-blue-100">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Official Voucher Slip Preview</h3>
                  <p className="text-[11px] text-slate-500">Digital Stamp Proof of Remittance</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-eezysend-blue hover:bg-eezysend-blue-hover text-white transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowSlipPreview(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable authentic paper slip */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden max-w-2xl mx-auto">
                <VoucherPrintSlip transaction={transaction} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
