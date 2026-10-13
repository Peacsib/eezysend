# EezySend - Institutional Remittance Operations Portal

A modern, secure financial remittance and settlement operations portal engineered for **CABS (Central African Building Society)** and institutional remittance partners. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, and the **Peace UI** design engineering system.

---

## 💼 What is EezySend?

**EezySend** is an **Institutional Remittance Operations Portal** enabling commercial banking and operations officers to:

- **Monitor Live Remittance Transactions**: Track deposits, branch counter collections, and pending transfers across all domestic branches in real time.
- **Inspect Transaction Lifecycles**: Search and audit remittances by transaction reference (`EZS-...`), sender/receiver details, or T24 core banking identifiers.
- **Audit Carrier SMS Notifications**: Verify delivery receipts, recipient alert states, and trigger instant notification re-dispatches.
- **Perform Instant Transaction Reversals**: Authorized operational cancellation and fund releases back to senders.
- **Print Official Transaction & Proof Slips**: Pixel-perfect printable documents with authentic CABS digital stamps, colon-aligned key-values, and `@media print` layout formatting.
- **Analyze Trends & Export Operational Reports**: Interactive monthly/yearly performance trends and clean multi-sheet Excel (`.xlsx`) & streaming CSV exports.
- **Monitor System Infrastructure Health**: Live heartbeat pings, AWS Network Load Balancer (NLB) latency metrics, and subsystem telemetry.

### Operational Workflow
1. **Creation**: Sender deposits funds at a branch counter or digital channel; a unique transaction reference (e.g., `EZS-20261005-0981`) is assigned.
2. **Notification**: Automated SMS alerts dispatch to both sender and beneficiary with collection codes and designated pickup branches.
3. **Escrow & Verification**: Funds are held safely in escrow under CABS core banking.
4. **Counter Collection**: Beneficiary presents identification at any CABS branch; funds are disbursed and settled.
5. **Reconciliation & Audit**: Operations officers monitor volume, fee collection (including IMTT taxes), and export regulatory reports.

---

## 📊 Dashboard Modules

### 1. 📈 Reports & Settlements
**Purpose**: High-level financial analytics, interactive volume trending, and regulatory export.
- **Summary Metrics (KPIs)**: Total remittance USD volume, total transaction records with completion rates, and collected service fees & IMTT taxes.
- **Interactive Performance Chart**: Sleek, minimal line chart visualizing monthly and yearly performance trends with volume/transaction toggles, month tooltips, and year filters.
- **Segmented Views**: Instant filtering by *All Remittances*, *Deposits*, and *Collections*.
- **Live Search & Date Filtering**: Multi-field search (reference, phone, name) and flexible date-range picker.
- **Regulatory Export**: Export all or paginated records to branded multi-sheet Excel (`.xlsx`) via ExcelJS or streaming CSV (`.csv`).

### 2. 💸 Transactions
**Purpose**: Real-time lifecycle management, core banking lookups, and operational actions.
- **Escrow & Settlement KPIs**: Live tally of total volume, funds ready for collection in escrow, and disbursed amounts.
- **Direct Reference Lookup**: Instant lookup by EezySend transaction reference, T24 withdrawal reference, or deposit ID.
- **Transaction Detail Drawer & Full View**: 3-tier deep inspection with sender/receiver details, fee breakdown, and audit timeline.
- **Official Transaction Slip & Print Preview**: Authentic printable CABS transaction voucher with authorized digital stamp.
- **Transaction Reversal Modal**: Regulatory reversal flow with confirmation safeguarding and instant status updates.

### 3. 📱 SMS Notifications & Delivery
**Purpose**: Telemetry and dispatch verification across carrier gateways.
- **Gateway Metrics**: Total SMS dispatched, delivery success counts, and delivery exceptions.
- **Live Dispatch Logs**: Paginated transmission records with recipient phone numbers, gateway status badges, and timestamps.
- **Instant SMS Re-Dispatch**: One-click re-transmission for beneficiaries who missed pickup alerts.
- **SMS Proof Slip**: Printable official SMS dispatch confirmation document with delivery audit metadata.
- **Export**: Filtered CSV export of carrier logs for billing and telecommunication reconciliation.

### 4. 🏥 System Health & Telemetry
**Purpose**: Real-time infrastructure monitoring and API availability telemetry.
- **Live Cluster Status**: Real-time heartbeat against the EezySend NLB endpoint (`/eezysend/health`).
- **Telemetry Latency**: Direct HTTP round-trip latency measurements in milliseconds.
- **Subsystems Audit**: Connectivity tracking across AWS NLB, T24 Core Banking, SMS Gateway, and Remittance Services.
- **Raw JSON Inspection**: Direct inspection of the core health endpoint payload.

---

## 🎨 Design & Aesthetic System

Built according to **Peace UI** — Peace Sibanda's signature design engineering philosophy for high-trust institutional platforms:

- **Quiet Institutional Authority**: Dignified CABS Navy (`#0A3E94`) and Emerald (`#0d7a5f`) color harmony.
- **Bespoke SVG Dotted Constellation Loader**: Dual-orbital mathematical SVG constellation featuring a 12-dot comet tail orbit, 6-dot counter-orbit, central breathing node, and 5-dot rhythmic harmonic wave.
- **Zero Mock Flash**: Clean asynchronous synchronization preventing any dummy/mock records from appearing before live backend data resolves.
- **Atmospheric Frosted Glassmorphism**: High-elevation frosted cards with hairline borders (`border-white/60`, `border-slate-200/80`) and soft ambient shadows.
- **Print Slips with Dual-Ring Digital Stamps**: Dedicated `@media print` styling with colon-aligned metadata, disclaimer blocks, and CABS institutional stamps.
- **Responsive Navigation**: Resizable, collapsible sidebar with keyboard shortcut (`Ctrl+B` / `Cmd+B`) and mobile drawer navigation.

---

## 📁 Project Structure

```
eezysend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── token/
│   │           └── route.ts            # Next.js API route caching JWT from .env.local
│   ├── dashboard/
│   │   └── page.tsx                    # Main dashboard shell (Sidebar, Header, Tab routing)
│   ├── globals.css                     # Tailwind v4 theme, print rules, and animations
│   ├── layout.tsx                      # Root HTML layout with Google Fonts
│   └── page.tsx                        # Authentication / Landing portal
├── components/
│   ├── dashboard/
│   │   ├── DateFilterDropdown.tsx      # Date range selector with presets
│   │   ├── Header.tsx                  # Top navigation bar with user profile & mobile menu
│   │   ├── HealthTab.tsx               # System Health & NLB telemetry monitor
│   │   ├── InteractivePerformanceChart.tsx # Minimal monthly/yearly performance line graph
│   │   ├── KpiCard.tsx                 # Frosted metric cards with hover physics
│   │   ├── Pagination.tsx              # Institutional batch pagination controls
│   │   ├── ReportsTab.tsx              # Reports & Settlements module
│   │   ├── Sidebar.tsx                 # Collapsible/resizable navigation rail
│   │   ├── SMSDispatchProofSlip.tsx    # Printable official SMS dispatch slip
│   │   ├── SMSFullView.tsx             # Deep drawer view for SMS delivery records
│   │   ├── SMSTab.tsx                  # SMS Notifications & Gateway log monitor
│   │   ├── TransactionDetailModal.tsx  # Quick action modal & print trigger
│   │   ├── TransactionFullView.tsx     # Full lifecycle record view & slip preview
│   │   ├── TransactionPrintSlip.tsx    # Canonical printable transaction slip with CABS stamp
│   │   ├── TransactionsTab.tsx         # Transactions module with reversal workflow
│   │   └── VoucherPrintSlip.tsx        # Backward-compatible slip re-export
│   └── ui/
│       ├── InstitutionalLoading.tsx    # Bespoke SVG dual-orbital dotted constellation loader
│       ├── LoadingSpinner.tsx          # Utility spinner and loading overlay
│       ├── StatusBadge.tsx             # Semantic status badge component
│       └── Toast.tsx                   # Atmospheric toast notification system
├── lib/
│   ├── api.ts                          # Unified API client connecting to EezySend NLB
│   ├── csvExport.ts                    # Streaming CSV export utility
│   ├── excelExport.ts                  # Multi-sheet Excel (.xlsx) export utility via ExcelJS
│   └── types.ts                        # Full TypeScript data models and interfaces
├── public/                             # Vector brand assets and WebP images
├── swagger-api/                        # Internal controller documentation & endpoint references
├── next.config.ts                      # Next.js configuration
├── package.json                        # Project dependencies and npm scripts
└── tsconfig.json                       # TypeScript compiler configuration
```

---

## 🔌 API & Backend Architecture

The portal connects directly to the EezySend Core Banking cluster:

- **Base NLB Endpoint**: `http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend`
- **Key API Controllers**:
  - `POST /security/authorize`: Issues active Bearer JWT tokens.
  - `GET /report/alltransactions/`: Fetches live remittance transaction records.
  - `GET /report/alltransactionsByDate/`: Date-filtered financial settlement logs.
  - `GET /transact/status/{ref}`: Direct transaction lookup by reference.
  - `GET /transact/reverse/{ref}`: Regulatory transaction reversal.
  - `GET /sms-api/get-all-sms`: Paginated SMS carrier logs.
  - `GET /sms-api/resend-sms`: Triggers notification re-dispatch.
  - `GET /health`: Subsystem heartbeat and NLB latency probe.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** or **yarn**

### Installation

1. Clone repository and navigate to the project root:
   ```bash
   git clone https://github.com/Peacsib/eezysend.git
   cd eezysend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_API_URL=http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend
   NEXT_PUBLIC_APP_NAME=EezySend
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # EezySend Production API Credentials
   EEZYSEND_API_KEY=eezysendui
   EEZYSEND_API_SECRET=304bb2b63cd544feb6524055520fefea
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Typecheck & Build for Production:
   ```bash
   npm run type-check   # Runs tsc --noEmit (Zero error tolerance)
   npm run build        # Generates optimized Next.js production build
   npm start            # Starts production server
   ```

---

## 🔒 Security & Data Hygiene

- **Token Isolation**: Production API credentials (`key` & `secret`) are stored server-side in `.env.local` and exchanged securely via `/api/auth/token`.
- **Zero Mock Leaks**: Live data feeds strictly to production endpoints; mock fallbacks do not mask server connection states.
- **Regulatory Print Slips**: Verification stamps and internal transaction references follow institutional compliance formats.
- **Sensitive Data Handling**: National IDs and phone numbers are formatted and handled in compliance with financial data protection standards.

---

## 👤 Engineering & Design Attribution

- **Lead Design Engineer**: [Peace Sibanda](https://www.linkedin.com/in/peacesibanda/)
- **Design System**: Peace UI (Institutional authority, atmospheric glassmorphism, and editorial typography)
- **Anchor Institution**: Central African Building Society (CABS) / Old Mutual Group
- **License**: Proprietary & Confidential — All rights reserved.
