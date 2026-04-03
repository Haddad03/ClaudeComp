# WealthWise

AI-powered financial tools for Canadians who don't have $1 million — yet.

Built at the **Claude Builders Hackathon @ McGill** (April 4, 2026).

---

## What it does

WealthWise helps young Canadians understand and manage their money through six tools:

| Feature | Description |
|---------|-------------|
| **Statement Upload** | Upload a bank/credit card CSV → Claude AI categorizes every transaction |
| **AI Spending Suggestions** | Claude analyzes your spending and recommends where to cut and what to do with saved money |
| **Growth Projection** | Interactive chart showing compound interest growth over time with adjustable sliders |
| **Accounts Explainer** | Plain-English breakdowns of TFSA, RRSP, and FHSA with mini growth charts |
| **Tax Simulator** | Estimate your Canadian taxes (all 13 provinces/territories) and see RRSP savings |
| **Terms & Disclaimer** | Full legal disclaimer — we are not financial advisors |

> **Not financial advice.** AI can make mistakes. Always consult a qualified financial professional.

---

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui (dark theme)
- **Charts:** Recharts
- **AI:** Anthropic SDK (`claude-sonnet-4-6`)
- **State:** Zustand (persisted to localStorage)
- **CSV parsing:** PapaParse

---

## Getting started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd wealth-app
npm install

# Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Set `ANTHROPIC_API_KEY` in your Vercel project environment variables.

---

## Project structure

```
wealth-app/
├── app/
│   ├── layout.tsx              # Root layout, dark theme
│   ├── page.tsx                # Main app — tab router
│   └── api/
│       ├── categorize/         # POST: Claude categorizes transactions
│       └── suggestions/        # POST: Claude generates spending advice
├── components/
│   ├── layout/                 # Navbar, DisclaimerBanner, TermsPage
│   ├── dashboard/              # DashboardShell, OverviewCards, CategoryPieChart
│   ├── upload/                 # UploadSection, TransactionTable, CategoryBadge
│   ├── suggestions/            # AISuggestionsPanel, SuggestionCard
│   ├── growth/                 # GrowthProjectionSection
│   ├── accounts/               # AccountsExplainer (TFSA/RRSP/FHSA)
│   └── tax/                    # TaxSimulator
├── lib/
│   ├── claude.ts               # Anthropic client (server-only)
│   ├── parseStatement.ts       # CSV parser + mock data generator
│   ├── taxCalculator.ts        # Canadian tax brackets + CPP/EI
│   ├── growthProjection.ts     # Compound interest formula
│   ├── categories.ts           # Category colors, icons, labels
│   └── types.ts                # Shared TypeScript interfaces
└── store/
    └── appStore.ts             # Zustand global store
```

---

## CSV format support

The CSV parser auto-detects column names. Supported formats include exports from:
- TD Bank
- RBC
- BMO
- Scotiabank
- CIBC
- Any CSV with `Date`, `Description`, and `Amount` (or `Debit`/`Credit`) columns

No upload? Hit **"Try with demo data"** for 20 realistic Canadian transactions.

---

## Hackathon team

Built in 8 hours at the Claude Builders Hackathon @ McGill, April 4, 2026.

Track: **Economic Empowerment & Education**

Powered by [Claude AI](https://anthropic.com) (Anthropic).
