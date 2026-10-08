"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Send,
  MessageSquare,
  Phone,
  Copy,
  Check,
  Printer,
  Smartphone,
  ShieldCheck,
  Radio,
  Wifi
} from "lucide-react";
import type { SMSModel, ReportTransaction } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";

interface SMSFullViewProps {
  readonly sms: SMSModel;
  readonly linkedTx?: ReportTransaction;
  readonly onBack: () => void;
  readonly onResend: (txRef: string) => Promise<void> | void;
  readonly isResending?: boolean;
}

export function SMSFullView({
  sms,
  linkedTx,
  onBack,
  onResend,
  isResending = false,
}: SMSFullViewProps) {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCarrier = (phone?: string) => {
    if (!phone) return 'GSM Cellular';
    const clean = phone.replace(/\D/g, '');
    if (clean.includes('77') || clean.includes('78')) return 'Econet Wireless';
    if (clean.includes('71')) return 'NetOne Cellular';
    if (clean.includes('73')) return 'Telecel';
    return 'Econet / NetOne GSM';
  };

  const formatPhone = (p?: string) => {
    if (!p) return 'N/A';
    const clean = p.replace(/\s+/g, '');
    if (clean.length === 10 && clean.startsWith('0')) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return p;
  };

  const recipientAmountText = linkedTx 
    ? `${linkedTx.currency === 'USD' ? '$' : ''}${linkedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${linkedTx.currency}`
    : 'funds';

  const senderNameText = linkedTx 
    ? [linkedTx.senderFirstName, linkedTx.senderLastName].filter(Boolean).join(' ')
    : 'Remitter';

  const beneficiaryNameText = linkedTx
    ? [linkedTx.receiverFirstName, linkedTx.receiverLastName].filter(Boolean).join(' ')
    : 'Recipient';

  const recipientSmsBody = `CABS EezySend: You have received ${recipientAmountText} from ${senderNameText}. Collection Code: ${sms.transactionReference}. Present National ID at any CABS Branch to collect.`;

  const senderSmsBody = `CABS EezySend: Remittance created successfully. Voucher ${sms.transactionReference} issued to ${beneficiaryNameText}. Funds reserved safely at CABS.`;

  return (
    <div className="space-y-3.5 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* 1. Official Slip Header (Print Only) */}
      <div className="hidden print:block p-4 border-b border-slate-300 text-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">EezySend SMS Gateway Dispatch Proof</h1>
            <p className="text-xs text-slate-500">CABS Financial Operations</p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p>Voucher: <span className="font-mono font-bold">{sms.transactionReference}</span></p>
            <p>Printed: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Bar - Calm, Minimalist */}
      <div className="no-print flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back to SMS Center</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>/</span>
            <span className="text-slate-500">Gateway Dispatch</span>
            <span>/</span>
            <span className="font-mono text-slate-800 font-semibold">{sms.transactionReference}</span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            SMPP DISPATCHED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void onResend(sms.transactionReference)}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200/80 shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Send className={`w-3.5 h-3.5 text-slate-500 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend SMS Alerts'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200/80 shadow-2xs cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Dispatch Proof</span>
          </button>
        </div>
      </div>

      {/* 3. Hero Dispatch Overview - Calm & Clean */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Voucher Reference
            </span>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {sms.transactionReference}
              </h2>
              <button
                onClick={() => handleCopy(sms.transactionReference, 'Voucher Reference')}
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

            <p className="text-xs text-slate-500 font-mono">
              Gateway Dispatched: <strong className="text-slate-700 font-medium">{sms.dateCreated ? new Date(sms.dateCreated).toLocaleString() : 'N/A'}</strong>
              {linkedTx && (
                <span className="ml-2 font-sans text-slate-600">
                  &bull; Linked Amount: <strong>${linkedTx.amount.toFixed(2)} {linkedTx.currency}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Calm Status Badges */}
          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Beneficiary SMS</span>
              <span className="font-semibold text-slate-800">{sms.receiverStatus ? 'Delivered' : 'Delivery Failed'}</span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sender SMS</span>
              <span className="font-semibold text-slate-800">{sms.senderStatus ? 'Delivered' : 'Delivery Failed'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side SMS Bubbles (Calm, Non-Boxy Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Beneficiary Collection Alert Card */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Beneficiary Alert
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {beneficiaryNameText}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {sms.receiverStatus ? 'Delivered' : 'Failed'}
              </span>
            </div>

            {/* Simulated Handset Bubble */}
            <div className="my-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Sender ID: CABS-EEZYSEND</span>
                <span className="font-mono text-[10px]">
                  {sms.dateCreated ? new Date(sms.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className="font-mono text-slate-700 leading-relaxed text-[11px]">
                "{recipientSmsBody}"
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Phone
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-slate-800">
                    {formatPhone(sms.receiverPhone)}
                  </span>
                  {sms.receiverPhone && (
                    <button
                      onClick={() => handleCopy(sms.receiverPhone, 'Beneficiary Phone')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy phone"
                    >
                      {copiedKey === 'Beneficiary Phone' ? <Check className="w-3 h-3 text-slate-700" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  Carrier
                </span>
                <span className="font-medium text-slate-700">
                  {getCarrier(sms.receiverPhone)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">DLR Handshake:</span>
            <span className="font-medium text-slate-700">
              {sms.receiverStatus ? 'ACK Confirmed Handset Delivery' : 'Telco DLR Expired'}
            </span>
          </div>
        </div>

        {/* Sender Confirmation Alert Card */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Sender Confirmation
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {senderNameText}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {sms.senderStatus ? 'Delivered' : 'Failed'}
              </span>
            </div>

            {/* Simulated Handset Bubble */}
            <div className="my-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Sender ID: CABS-EEZYSEND</span>
                <span className="font-mono text-[10px]">
                  {sms.dateCreated ? new Date(sms.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className="font-mono text-slate-700 leading-relaxed text-[11px]">
                "{senderSmsBody}"
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile Phone
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-slate-800">
                    {formatPhone(sms.senderPhone)}
                  </span>
                  {sms.senderPhone && (
                    <button
                      onClick={() => handleCopy(sms.senderPhone, 'Sender Phone')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy phone"
                    >
                      {copiedKey === 'Sender Phone' ? <Check className="w-3 h-3 text-slate-700" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  Carrier
                </span>
                <span className="font-medium text-slate-700">
                  {getCarrier(sms.senderPhone)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">DLR Handshake:</span>
            <span className="font-medium text-slate-700">
              {sms.senderStatus ? 'ACK Confirmed Handset Delivery' : 'Telco DLR Expired'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. SMS Gateway Compliance Strip (Calm, Light Card) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dispatched Date</span>
              <span className="font-medium text-slate-800 truncate block">
                {sms.dateCreated ? new Date(sms.dateCreated).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Protocol</span>
              <span className="font-mono text-slate-700 truncate block text-[11px]">
                SMPP v3.4 over TLS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Regulatory</span>
              <span className="font-medium text-slate-800 truncate block">
                POTRAZ Compliant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retry Backoff</span>
              <span className="font-medium text-slate-700 truncate block">
                3x Auto-Retry (60s)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
