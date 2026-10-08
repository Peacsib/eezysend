'use client';

import React from 'react';
import type { ReportTransaction } from '@/lib/types';

interface VoucherPrintSlipProps {
  transaction: ReportTransaction;
  className?: string;
  id?: string;
}

export const formatTransactionDate = (dateVal?: string | null): string => {
  if (!dateVal) return new Date().toISOString().slice(0, 10);
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatStampDate = (dateVal?: string | null): string => {
  if (!dateVal) return new Date().toLocaleDateString('en-GB');
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function VoucherPrintSlip({ transaction, className = '', id }: VoucherPrintSlipProps) {
  const senderParts = [transaction.senderFirstName, transaction.senderMiddleName, transaction.senderLastName]
    .filter(Boolean)
    .map(p => String(p).trim());
  const senderFullName = senderParts.length > 0 ? senderParts.join(' ') : 'N/A';

  const receiverParts = [transaction.receiverFirstName, transaction.receiverMiddleName, transaction.receiverLastName]
    .filter(Boolean)
    .map(p => String(p).trim());
  const receiverFullName = receiverParts.length > 0 ? receiverParts.join(' ') : 'N/A';

  const amountStr = Number(transaction.amount || 0).toFixed(2);

  return (
    <div
      id={id}
      className={`voucher-slip-container bg-white text-slate-900 p-8 sm:p-12 max-w-3xl mx-auto font-sans leading-relaxed ${className}`}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. Header: Dominant CABS Logo + Subtle EezySend Sublogo + Authorised Digital Stamp */}
      <div className="flex items-start justify-between gap-6 pb-2">
        {/* Left: Dominant CABS Logo with EezySend as Subtitle Sublogo */}
        <div className="flex flex-col items-start gap-1 pt-0.5">
          {/* Primary Dominant Brand Logo: CABS (A Member of the Old Mutual Group) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cabs-logo.webp"
            alt="CABS - A Member of the Old Mutual Group"
            className="h-14 sm:h-16 w-auto object-contain max-w-[240px]"
          />

          {/* Sublogo: EezySend (Monochrome Black Sub-brand Under CABS) */}
          <div className="pl-0.5 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/eezysend-logo-black.svg"
              alt="EezySend"
              className="h-3.5 sm:h-4 w-auto object-contain opacity-85"
            />
          </div>
        </div>

        {/* Right: Authentic Digital Stamp Box (CABS Navy Blue Outlined) */}
        <div
          className="border-[1.5px] border-[#0A3E94] w-64 sm:w-72 bg-white text-[#0A3E94] shrink-0"
          style={{ borderColor: '#0A3E94' }}
        >
          <div
            className="px-3 py-1.5 text-center font-bold text-xs sm:text-[12.5px] tracking-wide border-b-[1.5px]"
            style={{ borderColor: '#0A3E94', color: '#0A3E94' }}
          >
            EezySend REMITTANCE TRANSFER
          </div>
          <div className="p-2.5 sm:p-3 text-[9.5px] sm:text-[10px] leading-relaxed space-y-0.5" style={{ color: '#0A3E94' }}>
            <div className="text-center font-semibold uppercase text-[8.5px] tracking-wider pb-1">
              THIS IS AN AUTHORISED DIGITAL STAMP
            </div>
            <div>DATE: {formatStampDate(transaction.dateCreated)}</div>
            <div>TEL 1: +263 (242) 8677222445</div>
            <div>TEL 2: +263 (242) 883823/33</div>
            <div>TOLL FREE: 466</div>
            <div>EMAIL: support@cabs.co.zw</div>
          </div>
        </div>
      </div>

      {/* 2. Document Title: EezySend REMITTANCE TRANSFER */}
      <div className="mt-8 sm:mt-10">
        <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-normal">
          EezySend REMITTANCE TRANSFER
        </h2>
        <p className="text-xs sm:text-sm text-slate-800 font-normal mt-2.5">
          Your Remittance Transfer Completed
        </p>
        <hr className="border-t border-slate-300 mt-3 mb-6" />
      </div>

      {/* 3. Transaction Summary Table (Aligned Colons & Regular Weight) */}
      <div className="space-y-1.5 text-xs text-slate-800">
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Internal Transaction Reference</span>
          <span className="text-slate-800 font-normal">: {transaction.internalReferenceID || transaction.transactionReference || 'N/A'}</span>
        </div>
        {transaction.transactionReference && transaction.transactionReference !== transaction.internalReferenceID && (
          <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
            <span className="text-slate-800 font-normal">Transaction Reference</span>
            <span className="text-slate-800 font-normal">: {transaction.transactionReference}</span>
          </div>
        )}
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Date of Transaction</span>
          <span className="text-slate-800 font-normal">: {formatTransactionDate(transaction.dateCreated)}</span>
        </div>
      </div>

      {/* 4. Sender Details */}
      <div className="mt-6 sm:mt-7 space-y-1.5 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm pb-1">Sender Details</h3>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Sender Name</span>
          <span className="text-slate-800 font-normal">: {senderFullName.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Sender Account</span>
          <span className="text-slate-800 font-normal">: {transaction.senderPhone || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Debit Amount</span>
          <span className="text-slate-800 font-normal">: {amountStr}</span>
        </div>
      </div>

      {/* 5. Receiver Details */}
      <div className="mt-6 sm:mt-7 space-y-1.5 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm pb-1">Receiver Details</h3>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Beneficiary Bank</span>
          <span className="text-slate-800 font-normal">: CABS</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Beneficiary Account</span>
          <span className="text-slate-800 font-normal">: {transaction.receiverPhone || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Beneficiary Name</span>
          <span className="text-slate-800 font-normal">: {receiverFullName.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Credit Amount</span>
          <span className="text-slate-800 font-normal">: {amountStr}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Payment Reference</span>
          <span className="text-slate-800 font-normal">: {transaction.narrative || transaction.transactionReference || 'N/A'}</span>
        </div>
      </div>

      {/* 6. Divider Line */}
      <hr className="border-t border-slate-300 mt-8 mb-6" />

      {/* 7. Disclaimer */}
      <div className="text-center space-y-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">DISCLAIMER</h4>
        <p className="text-[10px] sm:text-[10.5px] leading-relaxed text-slate-700 max-w-2xl mx-auto text-left sm:text-justify">
          This notification serves to advise that your Remittance Transfer instruction has been effected by CABS. If funds have not been received, the sender must furnish CABS with the Internal Transaction Reference number in the message above for further assistance.
        </p>
      </div>
    </div>
  );
}
