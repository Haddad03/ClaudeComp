# WealthWise

**AI-powered financial tools for everyday Canadians.**
Built at the **Claude Builders Hackathon @ McGill** — April 4, 2026.

🌐 **Live demo:** [haddad03.github.io/ClaudeComp](https://haddad03.github.io/ClaudeComp/)

> Not financial advice. For educational purposes only.

---

## Features

| Feature | Description |
|---|---|
| **Auth & Accounts** | Sign up / log in · Terms acceptance · Free tier + subscription |
| **Statement Upload** | Upload CSV or PDF → AI categorizes every transaction · First upload free |
| **Dashboard** | Spending overview, category breakdown pie chart, AI suggestions |
| **Growth Projection** | Compound interest simulator with rate presets (GIC, ETF, S&P 500…) |
| **Tax Simulator** | Federal + provincial taxes for all 13 provinces · RRSP savings calculator |
| **Accounts Explainer** | Plain-English guide to TFSA, RRSP, and FHSA with live growth charts |
| **Spending History** | Save monthly snapshots · Compare months side-by-side · Year-over-year trend |
| **AI Chatbot** | Ask any money question — powered by Claude Haiku |
| **Offline / Demo mode** | Try with 20 realistic transactions — no API key needed |
| **Mobile-friendly** | Bottom tab bar navigation, responsive on all screen sizes |

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| AI | Anthropic SDK — `claude-sonnet-4-6` (analysis) · `claude-haiku-4-5` (chatbot) |
| State | Zustand 5 (persisted to localStorage) |
| CSV parsing | PapaParse |
| Deployment | GitHub Pages (static export) via GitHub Actions |

---

## Getting started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/) *(only needed for AI features)*

### Run locally

```bash
git clone https://github.com/Haddad03/ClaudeComp.git
cd ClaudeComp/wealth-app
npm install

# AI features (optional)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo account

| Username | Password | Access |
|---|---|---|
| `admin` | `admin` | Full access · No subscription required |
| *(sign up)* | *(any)* | Free tier · 1 upload included |

---

## Deployment

### GitHub Pages (static, auto-deploys on push to `main`)

Offline features work. AI features (chatbot, AI categorization) require a server.

```
https://haddad03.github.io/ClaudeComp/
```

### Vercel (full features)

```bash
cd wealth-app
npx vercel --prod
```

Set `ANTHROPIC_API_KEY` in your Vercel environment variables.

---

## Project structure

```
wealth-app/
├── app/
│   ├── layout.tsx              # Root layout — Navbar + Chatbot
│   ├── page.tsx                # Tab router (auth → onboarding → app)
│   └── api/
│       ├── categorize/         # POST: Claude categorizes transactions
│       ├── suggestions/        # POST: Claude generates spending advice
│       ├── chat/               # POST: Claude Haiku chatbot
│       └── parse-pdf/          # POST: extract transactions from PDF
├── components/
│   ├── auth/                   # AuthPage, SubscriptionModal
│   ├── layout/                 # Navbar (mobile bottom bar), TermsPage, Chatbot
│   ├── landing/                # Onboarding hero + goal selection
│   ├── home/                   # HomePage with quick actions
│   ├── dashboard/              # DashboardShell, OverviewCards, CategoryPieChart
│   ├── upload/                 # UploadSection, TransactionTable
│   ├── suggestions/            # AISuggestionsPanel, SuggestionCard
│   ├── growth/                 # GrowthProjectionSection
│   ├── accounts/               # AccountsExplainer (TFSA/RRSP/FHSA)
│   ├── tax/                    # TaxSimulator
│   └── history/                # HistoryPage (monthly snapshots + comparison)
├── lib/
│   ├── claude.ts               # Anthropic client (server-only)
│   ├── parseStatement.ts       # CSV parser + offline categorizer + demo data
│   ├── taxCalculator.ts        # 2025 Canadian federal + provincial brackets
│   ├── growthProjection.ts     # Compound interest projections
│   ├── categories.ts           # Category colors, emojis, labels
│   └── types.ts                # Shared TypeScript interfaces
└── store/
    └── appStore.ts             # Zustand global store (auth, transactions, snapshots…)
```

---

## Subscription model

| Tier | Uploads | AI Suggestions | History | Chatbot |
|---|---|---|---|---|
| **Free** | 1 | — | — | ✓ |
| **Pro ($4.99/mo)** | Unlimited | ✓ | ✓ | ✓ |
| **Admin** | Unlimited | ✓ | ✓ | ✓ |

*Demo mode — no real payment required.*

---

Built with ❤️ at the Claude Builders Hackathon @ McGill · Powered by [Claude AI](https://anthropic.com)
