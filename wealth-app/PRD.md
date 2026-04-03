# Product Requirements Document — WealthWise

**Version:** 1.0
**Date:** April 4, 2026
**Hackathon:** Claude Builders Hackathon @ McGill
**Track:** Economic Empowerment & Education

---

## 1. Problem Statement

Financial literacy in Canada is alarmingly low. Most wealth management tools are built for people with $1M+ in assets — they assume users already know what a TFSA is, how marginal tax rates work, or why compound interest matters. Young Canadians are left without practical, accessible tools to understand and manage their own money.

The result: people overpay taxes they could legally avoid, miss out on years of compounding growth in registered accounts, and have no idea where their money actually goes each month.

**Who we are building for:** Canadians aged 18–35 with no formal financial education, earning $30,000–$100,000/year, who want to do better with their money but don't know where to start.

---

## 2. Product Vision

WealthWise is a free, AI-powered financial literacy platform that makes wealth management accessible to everyone — not just the wealthy. It gives users the clarity, tools, and confidence to make smarter financial decisions through plain-English explanations, real data analysis, and actionable AI-driven suggestions.

**Core philosophy:**
- Educate, don't advise — we explain concepts, not tell users what to do
- Show, don't tell — interactive charts beat walls of text
- Earn trust through transparency — every AI output carries a disclaimer
- Zero friction — no sign-up, no credit card, no bank connection required

---

## 3. Users

### Primary user: The Financial Newbie
- Age 18–28, student or early career
- Never opened a TFSA or RRSP
- Doesn't know what their effective tax rate is
- Spends without tracking
- **Needs:** Basic education, motivation to start saving, simple first steps

### Secondary user: The Curious Optimizer
- Age 25–40, working professional
- Has a TFSA but doesn't maximize it
- Wants to know if they should contribute to RRSP
- Uploads real bank statements
- **Needs:** Specific numbers, concrete savings opportunities, comparison tools

---

## 4. MVP Feature Requirements

### F-01: Statement Upload & AI Categorization
**Priority:** P0

**Description:** Users upload a bank or credit card statement (CSV). Claude AI reads each transaction description and assigns it to one of six categories.

**Acceptance criteria:**
- [ ] Accepts `.csv` files via drag-and-drop or file picker
- [ ] Auto-detects column layout (Date, Description, Amount/Debit/Credit) regardless of bank format
- [ ] Sends transactions to Claude API in batches (max 50 per request)
- [ ] Returns category + confidence score per transaction
- [ ] Displays results in a sortable table with color-coded category badges
- [ ] Shows skeleton loading state while Claude processes
- [ ] "Try demo data" button loads 20 mock transactions without requiring a file
- [ ] Graceful error handling if API fails (clear error message, retry option)

**Categories:** Food, Rent, Subscriptions, Transportation, Entertainment, Other

---

### F-02: AI Spending Suggestions
**Priority:** P0

**Description:** After categorization, Claude analyzes the spending breakdown and generates 3–5 specific, actionable suggestions for reducing spending and redirecting savings to TFSA/RRSP/FHSA.

**Acceptance criteria:**
- [ ] Triggered by "Analyse" button on the dashboard
- [ ] Sends category totals (not raw transactions) to Claude for privacy
- [ ] Each suggestion includes: title, detail text, estimated monthly savings, redirect account (TFSA/RRSP/FHSA/Savings), priority level
- [ ] Suggestions displayed as cards with priority badge (High/Medium/Low)
- [ ] Loading skeleton shown while Claude processes
- [ ] Tone is friendly and non-judgmental — no financial jargon

---

### F-03: Growth Projection Chart
**Priority:** P0

**Description:** Interactive compound interest calculator showing how regular savings grow over time using a line chart with three scenarios.

**Acceptance criteria:**
- [ ] Sliders for: monthly contribution ($50–$2,000), current savings ($0–$50K), time horizon (1–40 years)
- [ ] Dropdown for account/return rate preset (TFSA ETF 7%, RRSP Balanced 5%, GIC 4%, etc.)
- [ ] Three lines on chart: "With investing" (full compound growth), "Contributions only" (no growth), "No saving" (flat)
- [ ] Summary cards showing final value, total contributed, and market growth
- [ ] Reference lines at milestone values ($10K, $50K, $100K, $500K, $1M)
- [ ] Chart updates in real time as sliders move
- [ ] Y-axis formatted in CAD (K/M suffixes)

**Formula:** FV = PMT × [((1+r)^n − 1) / r] where r = monthly rate, n = months

---

### F-04: TFSA / RRSP / FHSA Explainer
**Priority:** P0

**Description:** Three-tab educational section explaining each registered account in plain language, with 2026 contribution limits, key rules, and a mini compound growth chart.

**Acceptance criteria:**
- [ ] Three tabs: TFSA, RRSP, FHSA
- [ ] Each tab contains: title, tagline, contribution limit, tax treatment callout, 3 content cards (What is it / How it works / Key scenario), rules checklist
- [ ] Mini area chart per tab: $500/month over 20 years in the account vs taxable account
- [ ] 2026 limits hardcoded: TFSA $7,000/yr, RRSP 18% of earned income, FHSA $8,000/yr ($40K lifetime)
- [ ] Content written at grade 8 reading level — no jargon

---

### F-05: Tax Simulator
**Priority:** P0

**Description:** Canadian income tax calculator for all 13 provinces/territories. Computes federal + provincial tax, CPP, EI, and shows the impact of RRSP contributions on tax owing.

**Acceptance criteria:**
- [ ] Inputs: gross income (CAD), province/territory (all 13), optional RRSP contribution
- [ ] Outputs: federal tax, provincial tax, CPP, EI, total tax, net income, effective rate, marginal rate
- [ ] Stacked bar chart comparing total tax before vs after RRSP contribution
- [ ] Green callout showing RRSP tax savings when RRSP > 0
- [ ] Detailed line-by-line breakdown table
- [ ] All calculations are client-side (no API call required)
- [ ] Based on 2025 Canadian tax brackets

**Tax data included:**
- Federal: 5 brackets (15%–33%), BPA $15,705
- Provinces: Full brackets for ON, BC, QC, AB, MB, SK; simplified for NS, NB, NL, PE, NT, NU, YT
- CPP: 5.95% on $3,500–$68,500
- EI: 1.66% on up to $63,200

---

### F-06: Terms & Disclaimer
**Priority:** P0

**Description:** Full legal disclaimer page and persistent warning banner.

**Acceptance criteria:**
- [ ] Persistent amber banner on every page: "Not financial advice. AI can make mistakes."
- [ ] Banner can be dismissed per session
- [ ] Full Terms page with 8 sections covering: not financial advice, AI limitations, tax disclaimers, investment projection caveats, data privacy, no guarantees, user responsibility, registered account information
- [ ] Terms page accessible via nav tab

---

## 5. Non-MVP Features (Backlog)

These are designed and planned but not built in the hackathon MVP. See `issues_backlog.md` for details.

| Feature | Priority | Complexity |
|---------|----------|-----------|
| Net Worth Calculator | P1 | Low |
| Financial Health Score (0–100) | P1 | Medium |
| Savings Goals Tracker | P1 | Medium |
| Subscription Manager | P2 | Medium |
| Credit Score Tracker | P2 | Medium |
| Smart Budget Limits (AI-set) | P2 | High |
| PDF statement parsing | P2 | High |
| Bank account integration (Open Banking) | P3 | Very High |
| User authentication + cloud persistence | P3 | High |
| Multi-currency support | P3 | Medium |
| French language support (Quebec) | P2 | Medium |

---

## 6. Design Principles

**1. Dark, modern aesthetic** — targets young users. Inspired by fintech apps (Wealthsimple, Robinhood). Near-black background (#0f1117), violet primary (#7c3aed), cyan accents (#22d3ee).

**2. Explain everything** — every feature has a subtitle explaining what it does. No unexplained jargon anywhere.

**3. Mobile-first** — all layouts work on 375px viewport. Navigation scrolls horizontally on mobile.

**4. Disclaimer-first** — AI disclaimer is persistent, cannot be fully hidden, appears on every page. Legal text covers all edge cases.

**5. No account required** — all state lives in localStorage. Zero sign-up friction.

---

## 7. Technical Constraints

- `ANTHROPIC_API_KEY` must only be used server-side (Next.js API routes)
- Claude model: `claude-sonnet-4-6` (balance of speed and accuracy)
- No database in MVP — Zustand + localStorage only
- Tax calculations are deterministic and run client-side
- CSV parsing is client-side (PapaParse)
- No PDF parsing in MVP (scoped out due to complexity)

---

## 8. Success Metrics (Hackathon Demo)

| Metric | Target |
|--------|--------|
| Demo data categorization accuracy | > 90% correct categories |
| Tax calculation accuracy (ON, $75K) | Within $200 of actual CRA assessment |
| Time to first AI suggestion | < 5 seconds |
| Page load time | < 2 seconds on local dev |
| Zero build errors | ✓ |
| Mobile usability | All features usable at 375px |

---

## 9. Ethical Considerations

Per the hackathon's requirements, we address three questions:

**Who are we building for, and why do they need it?**
Young Canadians without financial education or access to advisors. They need it because financial illiteracy has real costs — missed tax refunds, unused TFSA room, no emergency fund — and existing tools exclude them.

**What could go wrong?**
- AI miscategorizes a transaction → user gets inaccurate suggestions → we mitigate with confidence scores and "review" flags
- Tax estimate is wrong → user makes bad contribution decision → we mitigate with prominent disclaimers and CRA links
- User uploads sensitive documents → privacy risk → we mitigate by not persisting uploads server-side

**How does this help people rather than make decisions for them?**
Every output is educational and contextual. We show users *why* something is a suggestion, not just what to do. All suggestions link to further reading. The tool empowers informed choice — it never says "do this."
