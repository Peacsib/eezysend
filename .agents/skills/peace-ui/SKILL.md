---
name: peace-ui
description: Peace Sibanda's signature design engineering system and UI philosophy for institutional financial software, banking platforms, and remittance systems. Use when building or reviewing fintech dashboards, banking vouchers/print slips, authentic digital stamps, institutional brand hierarchies, calm glassmorphic aesthetics, purposeful motion, or high-density transaction workflows.
---

# Peace UI: Institutional Financial Design System & Engineering Philosophy

## Initial Response

When this skill is first invoked without a specific question, respond with:

> I'm ready to help you design and build interfaces using **Peace UI** — institutional authority, bank-grade authenticity, calm glassmorphism, and senior engineering precision.

Do not provide extraneous commentary until the user asks a question or presents a task.

---

## The Philosophy of Peace UI

**Peace UI** was forged through the development of mission-critical banking and remittance applications (e.g., CABS EezySend, Old Mutual fintech systems). It rejects transient design gimmicks, juvenile bouncy animations, and marketing buzzwords in favor of **quiet institutional authority, high information density, and rock-solid engineering hygiene**.

> *"True financial software doesn't scream for attention. It inspires unshakeable confidence through precision, clarity, and authentic institutional presence."*

---

## Core Pillars of Peace UI

### 1. Institutional Dominance & Brand Hierarchy
In banking and financial infrastructure, partner channels or remittance products must **never overshadow the licensed anchor financial institution**.
- **Anchor Dominates**: The licensed bank or anchor entity (e.g. CABS, Old Mutual) is visually dominant in scale, prominence, and positioning.
- **Monochromatic Vector Sub-Branding**: Channel or product logos (e.g. `EezySend`) must be clean, monochromatic vector SVGs (e.g., `eezysend-logo-black.svg` on light backgrounds or white on dark), positioned cleanly as a secondary descriptor.
- **Never Compete**: Do not place two competing full-color logos side-by-side. The primary institution anchors trust; the sub-brand provides functional identity.

### 2. Exact Casing & Sacred Naming
Financial systems handle regulatory documents. Text casing is sacred:
- Always use exact official casing: `"EezySend REMITTANCE TRANSFER"`, never `"eezysend"`, `"EEZYSEND"`, or casual variations.
- System entities and roles must have strict canonical representations (e.g., `Sender Name`, `Receiver Mobile`, `Transaction Reference`, `Bearer ID`).
- Personal names on banking documents must be cleanly formatted in uppercase (e.g., `JOHN DOE`, `SARAH MOYO`).

### 3. Authentic Banking Print Documents & Digital Stamps
Paper and digital slips are the legal proof of transaction. They must mirror authentic in-branch banking slips:
- **Print Perfection**: Dedicated `@media print` stylesheets that hide navigation, sidebars, buttons, and backgrounds, rendering a pristine, high-contrast slip suited for thermal slip printers or A4 audit files.
- **Colon-Aligned Key-Value Layout**:
  ```text
  Date / Time            : 08 Oct 2026, 14:32:10
  Transaction Ref        : TR-2026-984210
  Remittance Channel     : EezySend REMITTANCE TRANSFER
  Sender Name            : JOHN DOE
  Receiver Mobile        : +263 77 123 4567
  Amount Disbursed       : USD 150.00
  ```
- **Regular Font Weight for Values**: Never make every field value bold. Standard regular weight (`font-normal`) with subtle semi-bold labels creates clean official readability.
- **Dual-Ring Digital Branch Stamp**: Every completed transaction voucher includes an official digital stamp:
  - Dual concentric borders (`border-2 border-dashed` or `border-2 border-emerald-700/80`).
  - Circular badge rotated slightly (-6° to -12°) for authentic hand-stamped appearance.
  - Institutional authority text: `"CABS ELECTRONIC VERIFICATION"`, `"BRANCH / DIGITAL CHANNELS"`, `"TRANSACTION AUTHORISED"`.

### 4. Understated Security Signals (No Marketing Fluff)
- **Eliminate Buzzwords**: Never display verbose claims like `"256-bit military-grade bank encryption"`. It reads like consumer marketing, not institutional software.
- **Quiet Confidence**: A crisp green shield or padlock icon with a single word: **`"Secured"`**.
- **Clear Status Tokens**:
  - `SUCCESS` / `AUTHORISED`: Emerald-600 with soft emerald-500/10 background.
  - `PENDING` / `IN_PROGRESS`: Amber-600 with soft amber-500/10 background.
  - `FAILED` / `REJECTED`: Rose-600 with soft rose-500/10 background.

### 5. Color Palette: The Forest Emerald & Glassmorphic Slate System
Peace UI avoids generic primary colors. It is anchored in deep, dignified wealth and stability tones:

| Role | Color / Hex | Tailwind Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| **Deep Forest Green** | `#00332c` / `#004d40` | `emerald-950` / `teal-950` | Primary brand background, header accents |
| **Vibrant Jade** | `#00a86b` / `#10b981` | `emerald-500` / `emerald-600` | Primary action buttons, success badges, key highlights |
| **Slate Charcoal** | `#0f172a` / `#1e293b` | `slate-900` / `slate-800` | Enterprise dashboard canvas and card foundations |
| **Frosted Glass** | `rgba(255, 255, 255, 0.04)` | `bg-white/[0.04] backdrop-blur-md` | Glassmorphic floating surfaces |
| **Hairline Borders** | `rgba(255, 255, 255, 0.1)` | `border-white/10` | Subtle edge definition without harsh lines |
| **Crisp Light** | `#f8fafc` / `#ffffff` | `slate-50` / `white` | High-contrast readable typography |

### 6. The "Goldilocks" Rule of Motion & Animation
- **Never Sluggish**: Excessive delay (>400ms) or slow cascades make enterprise operators feel system latency.
- **Never Twitchy**: Instant snap or absence of transition feels unpolished and abrasive.
- **The Sweet Spot**:
  - Micro-interactions (hover, focus, tab switch): `150ms - 200ms ease-out`.
  - Panel slides, modals, drawers: `250ms - 300ms cubic-bezier(0.16, 1, 0.3, 1)`.
  - Hero entrances: Structured **3-Act Sequence** with natural pacing (Act 1: Brand & Headings, Act 2: Subtitle & Value Proposition, Act 3: Action Form / Cards).
  - Hover feedback: `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`.

### 7. Deep Operational Information Density (3-Tier Inspection)
Never leave the user stranded on a surface-level table row:
1. **Tier 1 — The Table / Log**: High-density table with searchable reference, status badge, timestamp, amount, and quick actions.
2. **Tier 2 — The Action Modal**: Centered modal with primary breakdown, quick re-try, or print voucher trigger.
3. **Tier 3 — The Full-View Drawer (`Slide-Over`)**: Slide-out full-height drawer containing full payload metadata, SMS carrier logs, gateway latency, error stacks, and audit timestamps.
4. **Tier 4 — The Official Print Slip**: Thermal / A4 print slip ready for immediate customer handoff.

### 8. Senior Engineering Rigor & Zero-Fluff Code
- **100% Modern Assets**: All raster images optimized to WebP; all logos provided in scalable SVG vectors. Never commit bloated PNGs or raw camera photos.
- **Zero Lint / Zero Warning Tolerance**: SonarLint, TypeScript (`tsc --noEmit`), and Next.js Turbopack build must pass cleanly with 0 errors.
- **Secret & Config Hygiene**:
  - Never track or push `.env*`, `.env.local`, `.env.local.example`, or sensitive swagger schemas.
  - Verify `.gitignore` rules before touching git.
  - Commits must be atomic, descriptive, and strictly categorized (`feat`, `refactor`, `perf`, `chore`).

---

## Detailed Component Specifications

For complete code implementations, refer to:
- [Component Recipes](./RECIPES.md) — Production-ready TSX & CSS implementations of stamps, vouchers, drawers, and KPI cards.
- [Audit Checklist](./CHECKLIST.md) — 10-point inspection guide for Peace UI compliance.

---

## Quick Reference Table

| Interaction / Element | Peace UI Specification |
| :--- | :--- |
| **Brand Dominance** | Primary bank logo prominent; sub-channel logo monochromatic vector |
| **Print Slip Font** | Clean monospace or sans-serif; regular weight values; aligned colons |
| **Digital Stamp** | Dual ring, rotated `-8deg`, official authority text, emerald or deep teal |
| **Security Badge** | Shield / lock icon + `"Secured"` (no buzzwords) |
| **KPI Metric Cards** | Frosted glass, bold metric, trend pill, subtle icon background |
| **Transitions** | `200ms - 300ms`, no excessive bounce or sluggish lag |
| **Asset Formats** | WebP for photos/hero art; SVG for all logos and iconography |
