# Issues & Feature Backlog

Status labels: `bug` `enhancement` `feature` `research` `blocked`
Priority: `P0` (critical) → `P3` (nice to have)

---

## Bugs

### BUG-001 — CSV columns with inconsistent casing fail silently
**Status:** bug · P1
**Description:** The CSV column detector in `lib/parseStatement.ts` lowercases headers before matching, but some bank exports use mixed-case headers that don't match any candidate (e.g. `Trans. Date`, `Merchant Name`). The parser silently returns 0 transactions instead of showing a helpful error.
**Steps to reproduce:** Upload a Scotiabank CSV export with French column headers.
**Fix:** Improve `detectColumns()` to use fuzzy matching, add a "could not detect columns" error state in `UploadSection.tsx` with guidance on manual column mapping.
**File:** `lib/parseStatement.ts`, `components/upload/UploadSection.tsx`

---

### BUG-002 — Negative amounts treated as positive spending
**Status:** bug · P1
**Description:** The CSV parser applies `Math.abs()` to all amounts, so refunds and credits are treated as spending rather than reducing the total. This inflates category totals.
**Fix:** Preserve the sign. Transactions with negative amounts should be shown as credits and excluded from spending category totals. Add a `type: "debit" | "credit"` field to `RawTransaction`.
**File:** `lib/parseStatement.ts`, `lib/types.ts`

---

### BUG-003 — Tax simulator marginal rate incorrect for province + federal combined
**Status:** bug · P2
**Description:** `getMarginalRate()` in `lib/taxCalculator.ts` looks up the bracket for `federalTaxableIncome` but uses this same value for the provincial lookup, which should use `provincialTaxableIncome` (different BPA). Results in marginal rate being slightly off for incomes near bracket boundaries.
**Fix:** Pass both taxable incomes separately to `getMarginalRate()`.
**File:** `lib/taxCalculator.ts`

---

### BUG-004 — Zustand hydration mismatch on initial render
**Status:** bug · P2
**Description:** Because Zustand `persist` rehydrates from localStorage on the client, the server-rendered HTML (with empty state) may briefly flash before hydration. Manifests as a flicker of the empty dashboard hero before showing the uploaded transactions.
**Fix:** Use Zustand's `skipHydration` option and manually call `rehydrate()` in a `useEffect`, or wrap the state-dependent UI in a `mounted` guard.
**File:** `store/appStore.ts`, `app/page.tsx`

---

### BUG-005 — Recharts ResponsiveContainer causes SSR warning
**Status:** bug · P2
**Description:** Recharts `ResponsiveContainer` logs a `width/height` warning during server-side rendering because it can't measure DOM elements on the server.
**Fix:** Wrap all Recharts components in a `dynamic(() => import(...), { ssr: false })` import, or add `"use client"` and a `mounted` state guard.
**Files:** `components/dashboard/CategoryPieChart.tsx`, `components/growth/GrowthProjectionSection.tsx`, `components/accounts/AccountsExplainer.tsx`, `components/tax/TaxSimulator.tsx`

---

## Enhancements to Existing Features

### ENH-001 — Add confidence threshold UI to transaction table
**Priority:** P1
**Description:** Transactions with Claude confidence < 0.7 should be highlighted and allow the user to manually correct the category via a dropdown. Currently all categories are shown as final with no correction flow.
**Implementation:** Add an "edit" icon on low-confidence rows. On click, show a `Select` dropdown with all 6 categories. On change, update the transaction in the Zustand store.
**File:** `components/upload/TransactionTable.tsx`, `store/appStore.ts`

---

### ENH-002 — Spending suggestions: add "Already doing this" feedback
**Priority:** P2
**Description:** Users have no way to dismiss irrelevant suggestions or indicate they're already acting on one. This makes the suggestions panel feel static.
**Implementation:** Add a dismiss button (×) per suggestion card. Dismissed suggestions are removed from the store. Add a "thumbs up" button that logs positive feedback (can be a no-op for now or sent to a feedback endpoint).
**File:** `components/suggestions/SuggestionCard.tsx`

---

### ENH-003 — Tax simulator: add Quebec-specific deductions
**Priority:** P2
**Description:** Quebec has a significantly different tax system (provincial abatement of 16.5% of basic federal tax). Current implementation treats Quebec like other provinces, which overstates federal tax for Quebec residents by ~$1,000–$3,000.
**Implementation:** Add Quebec abatement logic in `calculateTax()` — subtract 16.5% of federal basic tax when province === "QC".
**File:** `lib/taxCalculator.ts`

---

### ENH-004 — Growth projection: add inflation-adjusted "real value" line
**Priority:** P2
**Description:** The projection chart shows nominal dollars. A 4th line showing inflation-adjusted (real) value at 2.5% inflation would better set expectations.
**Implementation:** Add `realValue` to `ProjectionDataPoint`. Calculate as `withSavings / (1.025^year)`. Add as a dashed line in the chart.
**File:** `lib/growthProjection.ts`, `components/growth/GrowthProjectionSection.tsx`

---

### ENH-005 — Accounts explainer: link to CRA official pages
**Priority:** P1
**Description:** The TFSA/RRSP/FHSA explainer has no links to the CRA for users who want to verify limits or open accounts. Adds credibility and fulfills our educational mission.
**Implementation:** Add a footer link per tab pointing to the relevant CRA page. Example: `https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html`
**File:** `components/accounts/AccountsExplainer.tsx`

---

### ENH-006 — Mobile: bottom navigation bar
**Priority:** P2
**Description:** On mobile, the horizontal navbar requires scrolling to find tabs. A bottom tab bar (5 tabs max, icons only) would be standard mobile UX.
**Implementation:** Add a `BottomNav.tsx` component visible only on `sm:hidden`. Show top 5 tabs as icon-only buttons fixed to the bottom of the viewport.
**File:** New `components/layout/BottomNav.tsx`, `app/layout.tsx`

---

## New Features

### FEAT-001 — Net Worth Calculator
**Priority:** P1 · enhancement
**Description:** A simple form where users enter assets (chequing, TFSA, RRSP, car, property) and liabilities (credit card debt, student loans, car loan, mortgage). Calculates and displays net worth.
**Implementation:**
- New tab "Net Worth" in Navbar
- `components/networth/NetWorthCalculator.tsx`
- Dynamic rows for assets and liabilities using `useState`
- Donut chart (Recharts) showing assets vs liabilities breakdown
- Color-coded result: green if positive net worth, red if negative
- Save to Zustand store for persistence

---

### FEAT-002 — Financial Health Score (0–100)
**Priority:** P1 · feature
**Description:** A single number summarizing the user's financial health, generated from available data.

**Scoring formula (weighted):**
| Factor | Weight | How scored |
|--------|--------|-----------|
| Savings rate (spending vs income) | 30% | 0–100 based on % of income saved |
| Has TFSA / RRSP open | 20% | Binary: 10pts each |
| Emergency fund (3+ months expenses) | 20% | 0–100 scaled to 3-month target |
| Debt-to-income ratio | 30% | 0–100 inversely proportional to debt level |

**Implementation:**
- Gauge chart (or large number + color gradient) as the centrepiece
- Inputs: monthly income, whether they have TFSA/RRSP (checkboxes), emergency fund amount
- Pre-populated from tax simulator income if available
- Score breakdowns shown per factor with improvement tips

---

### FEAT-003 — Savings Goals Tracker
**Priority:** P1 · feature
**Description:** Users create named savings goals (e.g., "Emergency Fund – $10,000", "Trip to Japan – $3,000"). They set a target amount, monthly contribution, and see projected completion date + progress bar.

**Implementation:**
- New tab "Savings Goals"
- Add/remove goals with `+` button
- Each goal card shows: name, target, amount saved (manual input), monthly contribution, completion date, progress bar
- Completion date calculated from `lib/growthProjection.ts` (find first month where balance >= target)
- Persist goals in Zustand store

---

### FEAT-004 — Subscription Manager
**Priority:** P2 · feature
**Description:** Users manually enter their recurring subscriptions. The app flags subscriptions that appear in their uploaded transactions and tallies the monthly total.

**Implementation:**
- Manual entry: name, cost/month, category (streaming/software/fitness/other)
- Auto-detect: scan uploaded transactions for known subscription keywords (Netflix, Spotify, etc.)
- Total monthly cost card
- "Unused" flag — user can mark subscriptions as rarely used
- Total annual cost display ("You spend $X/year on subscriptions")

---

### FEAT-005 — PDF Statement Parsing
**Priority:** P2 · feature · research
**Description:** Many banks (especially older ones) don't offer CSV exports. Users can currently only upload CSVs. Adding PDF support would dramatically increase reach.

**Technical approach:**
- Use `pdf-parse` on the server side (in `/api/categorize/route.ts`)
- Extract raw text, then use Claude to parse transactions from unstructured text
- This is a "Claude parses the PDF" approach rather than regex-based extraction
- Prompt: "Extract a JSON array of transactions from this bank statement text: [text]"

**Risks:** PDF layouts vary wildly by bank. May require per-bank templates for reliability.

---

### FEAT-006 — Credit Score Tracker
**Priority:** P2 · feature · research
**Description:** Users manually enter their credit score (from Borrowell, Credit Karma, or their bank app) and get an explanation of what affects it.

**Implementation (manual, no API integration):**
- Score input (300–900)
- Color-coded gauge: Poor / Fair / Good / Very Good / Excellent
- 5 factor cards with explanations: Payment history, Credit utilization, Credit history length, Credit mix, New inquiries
- Tips on improving each factor using Claude AI
- Score history stored in localStorage (user can log monthly score)

**Future:** Integrate with Borrowell or Equifax API for automatic pulls.

---

### FEAT-007 — French Language Support
**Priority:** P2 · feature
**Description:** Quebec accounts for ~23% of Canada's population. French UI would significantly expand reach and is relevant to the hackathon track (accessibility + inclusion).

**Implementation:**
- Use `next-intl` for internationalization
- Language toggle in Navbar (EN / FR)
- Translate: all static UI strings, category names, account explainer content, disclaimer text
- Tax simulator already covers Quebec brackets

---

### FEAT-008 — User Authentication + Cloud Persistence
**Priority:** P3 · feature · blocked
**Description:** Currently all data lives in localStorage. Users lose their history if they clear the browser or switch devices. Adding auth would enable persistent history, multi-device sync, and future personalization.

**Blocked by:** Need to decide on a backend (Supabase, PlanetScale, or Vercel KV). Out of scope for hackathon.

**Implementation path:**
- Add NextAuth.js (magic link or GitHub OAuth)
- Replace Zustand `persist` with server-side storage (Supabase or Vercel KV)
- All financial data should be encrypted at rest

---

### FEAT-009 — Bank Account Integration (Open Banking)
**Priority:** P3 · feature · research · blocked
**Description:** Instead of CSV uploads, connect directly to Canadian bank accounts via Open Banking API.

**Status:** Canada's Open Banking framework is not yet fully live (expected 2025–2026). No public Plaid equivalent for Canada with wide bank support.

**Research needed:** Monitor progress of Canada's FCAC Open Banking implementation. Flinks.com is a Canadian fintech data aggregator worth evaluating.

---

## Infrastructure / Tech Debt

### TECH-001 — Add error boundary components
**Priority:** P2
**Description:** If any component throws during render (e.g. malformed Recharts data), the entire page crashes. Add React error boundaries per section so one broken component doesn't take down the app.

---

### TECH-002 — Rate limiting on API routes
**Priority:** P1
**Description:** The `/api/categorize` and `/api/suggestions` routes have no rate limiting. A single user could trigger hundreds of Claude API calls. Add per-IP rate limiting using Vercel's edge middleware or `@upstash/ratelimit`.

---

### TECH-003 — Input sanitization on API routes
**Priority:** P1
**Description:** The API routes deserialize user-supplied JSON and pass it directly to Claude prompts. While Claude is generally robust to prompt injection, the transaction descriptions should be sanitized (strip HTML, limit length per transaction) before being included in prompts.

---

### TECH-004 — Add E2E tests with Playwright
**Priority:** P2
**Description:** No automated tests exist. Add Playwright tests for the core demo flow: load demo data → see dashboard → check tax sim → verify growth chart updates.

---

### TECH-005 — Environment variable validation at startup
**Priority:** P1
**Description:** If `ANTHROPIC_API_KEY` is missing, the app starts but API calls fail with a confusing error. Add a startup check in `lib/claude.ts` that throws a clear error message if the key is not set.
