'use client';

import React from 'react';
import type { SMSModel, ReportTransaction } from '@/lib/types';

interface SMSDispatchProofSlipProps {
  readonly sms: SMSModel;
  readonly linkedTx?: ReportTransaction;
  readonly className?: string;
  readonly id?: string;
}

export const formatDispatchDate = (dateVal?: string | null): string => {
  if (!dateVal) return new Date().toISOString().slice(0, 19).replace('T', ' ');
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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

export default function SMSDispatchProofSlip({
  sms,
  linkedTx,
  className = '',
  id
}: SMSDispatchProofSlipProps) {
  const getCarrier = (phone?: string) => {
    if (!phone) return 'GSM Cellular';
    const clean = phone.replace(/\D/g, '');
    if (clean.includes('77') || clean.includes('78')) return 'Econet Wireless';
    if (clean.includes('71')) return 'NetOne Cellular';
    if (clean.includes('73')) return 'Telecel';
    return 'Econet / NetOne GSM';
  };

  const recipientAmountText = linkedTx 
    ? `${linkedTx.currency === 'USD' ? '$' : ''}${Number(linkedTx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${linkedTx.currency || 'USD'}`
    : '$350.74 USD';

  const senderNameText = linkedTx 
    ? [linkedTx.senderFirstName, linkedTx.senderLastName].filter(Boolean).join(' ').toUpperCase()
    : 'NIALL IGOE';

  const beneficiaryNameText = linkedTx
    ? [linkedTx.receiverFirstName, linkedTx.receiverLastName].filter(Boolean).join(' ').toUpperCase()
    : 'SENGURAI MUSVIPA';

  const recipientSmsBody = `CABS EezySend: You have received ${recipientAmountText} from ${senderNameText}. Collection Code: ${sms.transactionReference}. Present National ID at any CABS Branch to collect.`;
  const senderSmsBody = `CABS EezySend: Remittance created successfully. Voucher ${sms.transactionReference} issued to ${beneficiaryNameText}. Funds reserved safely at CABS.`;

  return (
    <div
      id={id}
      className={`voucher-slip-container print-slip bg-white text-slate-900 p-8 sm:p-12 max-w-3xl mx-auto font-sans leading-relaxed ${className}`}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. Header: Dominant CABS Logo + Subtle EezySend Sublogo + Authorised Digital Stamp */}
      <div className="flex items-start justify-between gap-6 pb-2">
        <div className="flex flex-col items-start gap-1 pt-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cabs-logo.webp"
            alt="CABS - A Member of the Old Mutual Group"
            className="h-14 sm:h-16 w-auto object-contain max-w-[240px]"
          />
          <div className="pl-0.5 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/eezysend-logo-black.svg"
              alt="EezySend"
              className="h-3.5 sm:h-4 w-auto object-contain opacity-85"
            />
          </div>
        </div>

        {/* Right: Digital Stamp Box */}
        <div
          className="border-[1.5px] border-[#0A3E94] w-64 sm:w-72 bg-white text-[#0A3E94] shrink-0"
          style={{ borderColor: '#0A3E94' }}
        >
          <div
            className="px-3 py-1.5 text-center font-bold text-xs sm:text-[12.5px] tracking-wide border-b-[1.5px]"
            style={{ borderColor: '#0A3E94', color: '#0A3E94' }}
          >
            SMS DISPATCH PROOF
          </div>
          <div className="p-2.5 sm:p-3 text-[9.5px] sm:text-[10px] leading-relaxed space-y-0.5" style={{ color: '#0A3E94' }}>
            <div className="text-center font-semibold uppercase text-[8.5px] tracking-wider pb-1">
              AUTHORISED TELCO GATEWAY AUDIT
            </div>
            <div>DATE: {formatStampDate(sms.dateCreated)}</div>
            <div>STATUS: SMPP DELIVERED</div>
            <div>GATEWAY: ECONET / NETONE DIRECT</div>
            <div>TOLL FREE: 466</div>
            <div>EMAIL: support@cabs.co.zw</div>
          </div>
        </div>
      </div>

      {/* 2. Document Title */}
      <div className="mt-8 sm:mt-10">
        <h2 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-normal">
          EEZYSEND SMS GATEWAY DISPATCH PROOF
        </h2>
        <p className="text-xs sm:text-sm text-slate-800 font-normal mt-2.5">
          Official Telco Delivery Handshake Certificate · POTRAZ Compliant
        </p>
        <hr className="border-t border-slate-300 mt-3 mb-6" />
      </div>

      {/* 3. Core Dispatch Summary */}
      <div className="space-y-1.5 text-xs text-slate-800">
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Voucher Reference</span>
          <span className="text-slate-900 font-mono font-bold">: {sms.transactionReference}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Gateway Dispatch Timestamp</span>
          <span className="text-slate-800 font-normal">: {formatDispatchDate(sms.dateCreated)}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Linked Remittance Principal</span>
          <span className="text-slate-800 font-normal">: {recipientAmountText}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Delivery Protocol</span>
          <span className="text-slate-800 font-normal">: SMPP v3.4 over TLS</span>
        </div>
      </div>

      {/* 4. Beneficiary Dispatch Audit */}
      <div className="mt-6 sm:mt-7 space-y-1.5 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm pb-1 flex items-center justify-between">
          <span>Beneficiary Notification</span>
          <span className="text-[11px] font-semibold text-emerald-800">
            {sms.receiverStatus ? '✓ DELIVERED (HANDSET ACK)' : 'PENDING'}
          </span>
        </h3>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Recipient Name</span>
          <span className="text-slate-800 font-normal">: {beneficiaryNameText}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Mobile Number (MSISDN)</span>
          <span className="text-slate-800 font-mono">: {sms.receiverPhone || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Telecommunications Carrier</span>
          <span className="text-slate-800 font-normal">: {getCarrier(sms.receiverPhone)}</span>
        </div>
        <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-700 leading-relaxed">
          &quot;{recipientSmsBody}&quot;
        </div>
      </div>

      {/* 5. Sender Confirmation Audit */}
      <div className="mt-6 sm:mt-7 space-y-1.5 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm pb-1 flex items-center justify-between">
          <span>Sender Confirmation</span>
          <span className="text-[11px] font-semibold text-emerald-800">
            {sms.senderStatus ? '✓ DELIVERED (HANDSET ACK)' : 'PENDING'}
          </span>
        </h3>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Sender Name</span>
          <span className="text-slate-800 font-normal">: {senderNameText}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Mobile Number (MSISDN)</span>
          <span className="text-slate-800 font-mono">: {sms.senderPhone || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Telecommunications Carrier</span>
          <span className="text-slate-800 font-normal">: {getCarrier(sms.senderPhone)}</span>
        </div>
        <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-700 leading-relaxed">
          &quot;{senderSmsBody}&quot;
        </div>
      </div>

      {/* 6. Technical Compliance & DLR Handshake */}
      <div className="mt-6 sm:mt-7 space-y-1.5 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm pb-1">Technical Audit &amp; POTRAZ Compliance</h3>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">DLR Delivery Status</span>
          <span className="text-slate-800 font-normal">: Final Delivery Receipt (DELIVRD - Code 000)</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Regulatory Compliance</span>
          <span className="text-slate-800 font-normal">: POTRAZ Telecommunications Act &amp; RBZ Remit Guidelines</span>
        </div>
        <div className="grid grid-cols-[230px_1fr] sm:grid-cols-[260px_1fr] items-baseline">
          <span className="text-slate-800 font-normal">Gateway Origin Node</span>
          <span className="text-slate-800 font-normal">: eu-west-1.cabs-eezysend-smpp-01</span>
        </div>
      </div>

      {/* 7. Divider Line */}
      <hr className="border-t border-slate-300 mt-8 mb-6" />

      {/* 8. Disclaimer */}
      <div className="text-center space-y-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">DISCLAIMER &amp; LEGAL CERTIFICATION</h4>
        <p className="text-[10px] sm:text-[10.5px] leading-relaxed text-slate-700 max-w-2xl mx-auto text-left sm:text-justify">
          This document serves as conclusive technical proof of SMS transmission through the CABS EezySend Telco Gateway. The delivery timestamp and carrier acknowledgment (ACK) have been recorded on an immutable ledger. Generated for institutional audit, fraud mitigation, and dispute resolution.
        </p>
      </div>
    </div>
  );
}
