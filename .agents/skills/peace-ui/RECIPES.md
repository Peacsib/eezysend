# Peace UI: Component Recipes & Implementation Patterns

Production-ready components and styling patterns adhering to the **Peace UI** specification.

---

## 1. Dual-Ring Digital Branch Stamp

An authentic banking stamp for electronic verification slips and receipts.

```tsx
export function PeaceDigitalStamp({
  date = new Date().toLocaleDateString('en-GB'),
  reference = 'CABS-ELEC-AUTH',
  institution = 'CABS ELECTRONIC VERIFICATION',
  status = 'TRANSACTION AUTHORISED',
}: {
  date?: string;
  reference?: string;
  institution?: string;
  status?: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-3 w-40 h-40 rounded-full border-2 border-dashed border-emerald-700/80 text-emerald-800 select-none transform -rotate-6 shadow-sm"
      aria-label="Digital Verification Stamp"
    >
      {/* Outer concentric ring */}
      <div className="absolute inset-1 rounded-full border border-emerald-700/40 pointer-events-none" />

      {/* Stamp Authority Headers */}
      <div className="text-[9px] font-bold tracking-widest text-center uppercase leading-tight">
        {institution}
      </div>

      <div className="my-1 w-24 h-px bg-emerald-700/30" />

      {/* Core Stamp Status */}
      <div className="text-[10px] font-extrabold tracking-wider text-center uppercase text-emerald-900">
        {status}
      </div>

      {/* Date & Ref */}
      <div className="mt-1 text-[8px] font-mono tracking-tighter text-emerald-700">
        {date}
      </div>
      <div className="text-[7px] font-mono tracking-widest text-emerald-600">
        {reference}
      </div>

      <div className="my-1 w-20 h-px bg-emerald-700/30" />

      <div className="text-[7.5px] font-semibold tracking-wider uppercase text-emerald-800">
        BRANCH / DIGITAL
      </div>
    </div>
  );
}
```

---

## 2. Authentic Bank Remittance Print Slip

A print-optimized voucher with institutional brand dominance, aligned colons, and regular font weight values.

```tsx
import Image from 'next/image';

interface VoucherProps {
  reference: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
}

export function PeaceRemittanceVoucher({
  reference,
  senderName,
  senderPhone,
  receiverName,
  receiverPhone,
  amount,
  currency,
  status,
  timestamp,
}: VoucherProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white text-slate-900 p-6 border border-slate-200 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0">
      {/* Brand Header: Dominant Bank Logo + Subtle Vector Channel Logo */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/cabs-logo.webp"
            alt="CABS Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-end">
          <Image
            src="/eezysend-logo-black.svg"
            alt="EezySend"
            width={85}
            height={24}
            className="h-6 w-auto object-contain"
          />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            EezySend REMITTANCE TRANSFER
          </span>
        </div>
      </div>

      {/* Aligned Key-Value Table */}
      <div className="space-y-1.5 text-xs font-mono text-slate-800 mb-6">
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Date / Time</span>
          <span>:</span>
          <span className="font-normal text-slate-900">{timestamp}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Transaction Ref</span>
          <span>:</span>
          <span className="font-normal text-slate-900">{reference}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Sender Name</span>
          <span>:</span>
          <span className="font-normal uppercase text-slate-900">{senderName}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Sender Contact</span>
          <span>:</span>
          <span className="font-normal text-slate-900">{senderPhone}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Receiver Name</span>
          <span>:</span>
          <span className="font-normal uppercase text-slate-900">{receiverName}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr]">
          <span className="text-slate-600">Receiver Mobile</span>
          <span>:</span>
          <span className="font-normal text-slate-900">{receiverPhone}</span>
        </div>
        <div className="grid grid-cols-[140px_12px_1fr] pt-2 border-t border-slate-100 font-semibold text-slate-900">
          <span>Amount Disbursed</span>
          <span>:</span>
          <span>{currency} {amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Official Verification Stamp Section */}
      <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-300">
        <div className="text-[10px] text-slate-500 max-w-[200px]">
          Official electronic transaction receipt. Generated by verified banking channel. Keep for your records.
        </div>
        <PeaceDigitalStamp
          reference={reference}
          date={timestamp.split(' ')[0]}
        />
      </div>
    </div>
  );
}
```

---

## 3. Understated "Secured" Indicator Badge

Replaces verbose marketing buzzwords with calm institutional confidence.

```tsx
import { ShieldCheck } from 'lucide-react';

export function PeaceSecuredBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>Secured</span>
    </div>
  );
}
```

---

## 4. Frosted Glassmorphic KPI Card

High-density financial summary card with trend indicator and backdrop blur.

```tsx
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface KpiProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: LucideIcon;
}

export function PeaceKpiCard({
  label,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
}: KpiProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 shadow-sm hover:border-emerald-500/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="text-2xl font-bold tracking-tight text-white mb-2">
        {value}
      </div>

      {(change || subtext) && (
        <div className="flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
```

---

## 5. Slide-Over Full Inspector Drawer

Full-height side drawer for detailed logs, payload inspection, and carrier responses.

```tsx
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PeaceInspectorDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Print Stylesheet Recipe (`@media print`)

Include in `globals.css` to guarantee clean bank vouchers:

```css
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }

  /* Hide navigation, sidebars, modal scrims, and action buttons */
  header,
  nav,
  aside,
  button,
  .no-print,
  [data-no-print="true"] {
    display: none !important;
  }

  /* Isolate printable voucher */
  .print-only {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
}
```
