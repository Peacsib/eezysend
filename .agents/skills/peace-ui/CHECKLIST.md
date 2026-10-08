# Peace UI: Compliance & Audit Checklist

Use this 10-point checklist when reviewing any screen, component, or PR to guarantee compliance with Peace UI standards.

---

### 1. Brand Hierarchy & Prominence
- [ ] Does the licensed anchor institution (e.g. CABS, Old Mutual) clearly dominate the header or voucher?
- [ ] Is the partner or remittance channel represented via a subtle monochromatic vector SVG rather than a competing full-color raster logo?
- [ ] Is the exact brand casing respected (e.g., `"EezySend REMITTANCE TRANSFER"`)?

### 2. Banking Document Authenticity
- [ ] Are transaction vouchers printable cleanly without UI chrome or sidebars showing?
- [ ] Does the voucher feature the official dual-ring digital branch verification stamp?
- [ ] Is the key-value layout colon-aligned?
- [ ] Are customer names displayed in clean uppercase (`JOHN DOE`)?
- [ ] Are field values set to standard regular font weight (`font-normal`), avoiding heavy bold across all values?

### 3. Understated Security Language
- [ ] Have all marketing buzzwords (e.g., "military-grade 256-bit AES encryption") been removed?
- [ ] Is the security indicator a quiet, authoritative badge (e.g., `<ShieldCheck /> Secured`)?

### 4. Color System & Aesthetics
- [ ] Does the interface adhere to deep forest emerald, jade accents, and slate charcoal?
- [ ] Are cards using subtle frosted glassmorphism (`backdrop-blur-md`, `bg-slate-900/60`, `border-white/10`)?
- [ ] Are status badges semantically colored (Emerald for Success, Amber for Pending, Rose for Failed)?

### 5. Motion & Latency
- [ ] Are micro-interactions snappy (`150ms - 200ms`) without sluggish drag?
- [ ] Are drawer and modal transitions smooth (`250ms - 300ms cubic-bezier(0.16, 1, 0.3, 1)`)?
- [ ] Are hero sections paced with an intentional 3-act sequence?
- [ ] Is there zero delay on pointer click feedback?

### 6. Information Depth & User Flow
- [ ] Can operators inspect full transaction details via a slide-over drawer (`Slide-Over`) without losing table context?
- [ ] Are SMS logs and gateway carrier responses accessible with one click?
- [ ] Can operators instantly trigger thermal/A4 voucher printing from the modal or drawer?

### 7. Controls & Filtering
- [ ] Are date range presets provided (`Today`, `Last 7 Days`, `Last 30 Days`, `Custom`)?
- [ ] Does pagination clearly state current range and total count (`Showing 1 to 10 of 128 results`)?
- [ ] Are CSV and document export options immediately available for audits?

### 8. Asset Pipeline & Performance
- [ ] Are all raster images in `.webp` format?
- [ ] Have all obsolete `.png` files been purged?
- [ ] Are all logos and icons crisp scalable `.svg` vectors?

### 9. Code Quality & Linting
- [ ] Does `npm run type-check` pass with 0 TypeScript errors?
- [ ] Does `npm run build` pass Turbopack compilation cleanly?
- [ ] Are there 0 SonarLint or ESLint warnings?
- [ ] Are all types explicitly declared (no loose `any`)?

### 10. Secrets & Environment Safety
- [ ] Are `.env*`, `.env.local`, and `.env.local.example` strictly excluded by `.gitignore`?
- [ ] Are internal API documentation directories (`swagger-api/`) ignored?
- [ ] Are commits organized into atomic, specific, descriptive messages?
